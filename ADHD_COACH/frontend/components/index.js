
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";

serve(async (req) => {
  // shared-secret check so this endpoint can't be triggered by randoms 
  // set CRON_SECRET as a function secret and pass it as the trigger's auth header
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${Deno.env.get("CRON_SECRET")}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  // SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are auto-injected into every

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
  );

  const { data: due, error } = await supabase
    .from("reminders")
    .select("id, email, deck_id")
    .eq("sent", false)
    .lte("remind_at", new Date().toISOString());

  if (error) {
    console.error("Failed to query due reminders:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  if (!due || due.length === 0) {
    return new Response(JSON.stringify({ sent: 0 }), { status: 200 });
  }

  const client = new SMTPClient({
    connection: {
      hostname: "smtp.gmail.com",
      port: 587,
      tls: true,
      auth: {
        username: Deno.env.get("GMAIL_ADDRESS"),
        password: Deno.env.get("GMAIL_APP_PASSWORD"), // the 16-char app password, not your real Gmail password
      },
    },
  });

  let sentCount = 0;
  for (const reminder of due) {
    try {
      await client.send({
        from: Deno.env.get("GMAIL_ADDRESS"),
        to: reminder.email,
        subject: "Time to review your flashcards",
        content: "Remember! Consistency is key ^^ (your effort compounds everyday when u delay) ",
      });

      // mark sent right after a successful send, one at a time, so a crash
      // partway through the loop can't leave an already-sent reminder
      // looking unsent and get emailed twice on the next run
      await supabase.from("reminders").update({ sent: true }).eq("id", reminder.id);
      sentCount++;
    } catch (sendErr) {
      // don't mark this one sent — it'll just get retried next run
      console.error(`Failed to send reminder ${reminder.id}:`, sendErr);
    }
  }

  await client.close();

  return new Response(JSON.stringify({ sent: sentCount, checked: due.length }), { status: 200 });
});
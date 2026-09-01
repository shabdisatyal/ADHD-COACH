import React, { useState } from "react";
import { supabase } from "../../../supabaseclient";

// gotta add more themes for making everything customizable.
const theme = {
  "--bg": "#EBF4DD",
  "--sage": "#90AB8B",
  "--forest": "#5A7863",
  "--ink": "#3B4953",
};

// This generates a random string for the password-reset nonce (not used by
// Supabase directly — kept here in case you wire up your own verification
// step, but the actual reset flow below uses Supabase's built-in email link)
function generateRandomNonce() {
  const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomValues = new Uint32Array(10);
  crypto.getRandomValues(randomValues);
  return Array.from(randomValues).map((val) => charSet[val % charSet.length]).join('');
}

export const Signup = () => {
  const [form, setForm] = useState({ email: "", password: "", name: "", age: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // submit handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.name,
          age: form.age,
        }
      }
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    console.log(data);
  };

  // forgot-password: sends the user a reset email via Supabase.
  // Supabase handles the token/verification itself — when the user clicks
  // the emailed link, they land back on your app with a temporary session,
  // and *that's* when you'd call supabase.auth.updateUser({ password }).
  const handleUpdate = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!form.email) {
      setErrorMsg("Enter your email above first, then click 'Forgot Password?'");
      return;
    }

    const { data, error } = await supabase.auth.resetPasswordForEmail(form.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    console.log("Password reset email sent:", data);
  };

  // FORM DESIGN
  return (
    <div
      className="signup pt-3 font-Fascinate text-center min-h-screen flex flex-col items-center justify-center"
      style={{ ...theme, backgroundColor: "var(--bg)", color: "var(--ink)" }}
    >
      <p className="mb-6 text-lg font-bold">
        ARE YOU READY TO UNLOCK YOUR REAL POTENTIAL.
      </p>
      <form
        onSubmit={handleSubmit}
        className="form rounded-md font-Fascinate font-bold p-6 w-80 shadow-md"
        style={{ backgroundColor: "var(--sage)", border: "1px solid var(--forest)" }}
      >
        <div className="input flex flex-col gap-3">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="text-left rounded-sm px-3 py-2 outline-none"
            style={{ backgroundColor: "var(--bg)", color: "var(--ink)", border: "1px solid var(--forest)" }}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="text-left rounded-sm px-3 py-2 outline-none"
            style={{ backgroundColor: "var(--bg)", color: "var(--ink)", border: "1px solid var(--forest)" }}
          />
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="text-left rounded-sm px-3 py-2 outline-none"
            style={{ backgroundColor: "var(--bg)", color: "var(--ink)", border: "1px solid var(--forest)" }}
          />
          <input
            name="age"
            placeholder="age"
            value={form.age}
            onChange={handleChange}
            className="text-left rounded-sm px-3 py-2 outline-none"
            style={{ backgroundColor: "var(--bg)", color: "var(--ink)", border: "1px solid var(--forest)" }}
          />

          {errorMsg && (
            <p className="text-sm font-normal" style={{ color: "#B3261E" }}>
              {errorMsg}
            </p>
          )}

          <div className="submit mt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-sm py-2 text-white transition-colors disabled:opacity-60"
              style={{ backgroundColor: "var(--forest)" }}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </div>
        </div>
      </form>
      <button
        type="button"
        onClick={handleUpdate}
        className="mt-4 underline bg-transparent border-none cursor-pointer"
        style={{ color: "var(--ink)" }}
      >
        Forgot Password? No worries.
      </button>
    </div>
  );
};
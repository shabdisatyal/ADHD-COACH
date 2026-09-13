import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseclient";

const theme = {
  "--bg": "#EBF4DD",
  "--sage": "#90AB8B",
  "--forest": "#5A7863",
  "--ink": "#3B4953",
};

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function initialsFrom(name, email) {
  const base = name || email || "?";
  return base.trim().charAt(0).toUpperCase();
}

export function Profile() {
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (!error) {
        setUser(data.user);
        setNewEmail(data.user?.email || "");
      }
    });
  }, []);

  const name = user?.user_metadata?.first_name || "";
  const email = user?.email || "";
  const memberSince = formatDate(user?.created_at);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setStatusMsg("");
    if (!newPassword) {
      setErrorMsg("Enter a new password first.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    setStatusMsg("Password updated.");
    setNewPassword("");
  };

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setStatusMsg("");
    if (!newEmail) {
      setErrorMsg("Enter an email first.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    setSaving(false);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    setStatusMsg("Check your inbox to confirm the new email.");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/signin";
  };

  const inputClass =
    "w-full bg-transparent text-[var(--ink)] text-sm py-2 border-b border-[var(--sage)]/40 outline-none focus:border-[var(--forest)] transition-colors";
  const labelClass = "text-[var(--forest)]/70 text-xs uppercase tracking-wide";

  return (
    <div style={theme} className="min-h-screen w-full bg-[var(--bg)] px-6 py-12">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
        {/* left: avatar + details card */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="w-28 h-28 rounded-full bg-[var(--forest)] flex items-center justify-center text-4xl font-bold text-[var(--bg)] overflow-hidden">
            {user?.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              initialsFrom(name, email)
            )}
          </div>

          <div className="w-full bg-white rounded-xl border border-[var(--sage)]/30 shadow-sm p-5 text-center md:text-left">
            <p className="text-lg font-bold text-[var(--forest)]">
              {name || "Your name"}
            </p>
            <p className="text-sm text-[var(--ink)]/70 mt-1 break-all">{email}</p>
            <p className="text-xs text-[var(--sage)] mt-4 uppercase tracking-wide">
              Member since
            </p>
            <p className="text-sm text-[var(--ink)]">{memberSince || "—"}</p>
          </div>
        </div>

        {/* right: account settings */}
        <div className="bg-white rounded-xl border border-[var(--sage)]/30 shadow-sm p-6 flex flex-col gap-8">
          <h2 className="text-xl font-bold text-[var(--forest)]">Account settings</h2>

          <form onSubmit={handleEmailUpdate} className="flex flex-col gap-2">
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              autoComplete="username"
              className={inputClass}
            />
            <button
              type="submit"
              disabled={saving}
              className="self-start mt-2 text-sm font-semibold text-[var(--forest)] hover:underline disabled:opacity-60"
            >
              Update email
            </button>
          </form>

          <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-2">
            <label className={labelClass}>New password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              className={inputClass}
            />
            <button
              type="submit"
              disabled={saving}
              className="self-start mt-2 text-sm font-semibold text-[var(--forest)] hover:underline disabled:opacity-60"
            >
              Update password
            </button>
          </form>

          {(statusMsg || errorMsg) && (
            <p
              className={`text-sm ${
                errorMsg ? "text-red-500" : "text-[var(--forest)]"
              }`}
            >
              {errorMsg || statusMsg}
            </p>
          )}

          <button
            type="button"
            onClick={handleSignOut}
            className="self-start mt-4 rounded-full px-6 py-2 text-sm font-bold text-white bg-[var(--ink)] hover:opacity-90 transition-opacity"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
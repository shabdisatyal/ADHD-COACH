import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseclient";

const theme = {
  "--bg": "#fdfdfd",
  "--panel": "#FFFFFF",
  "--panel-border": "#E0E0E0",
  "--titlebar": "#EDEDED",
  "--border": "#D4D4D4",
  "--muted": "#8A8A8A",
  "--text": "#111111",
  "--accent": "#9ED3DC",
  "--ink": "#FFFFFF",
  "--button": "#c9f1f8",
  "--button-hover": "#2A2A2A",
  "--error": "#111111",
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






  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const inputClass =
    "w-full bg-transparent text-[var(--text)] text-sm py-2 border-b border-[var(--border)] outline-none focus:border-[var(--accent)] transition-colors";
  const labelClass = "text-[var(--muted)] text-xs uppercase tracking-wide";

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-[var(--bg)] px-4 py-10"
      style={{
        ...theme,
        backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)",
        backgroundSize: "38px 38px",
      }}
    >
      {/* mac-style window */}
      <div className="w-full max-w-8xl bg-[var(--panel)] border border-[var(--panel-border)] rounded-xl shadow-1xl overflow-hidden">
        {/* title bar */}
        

        {/* window content */}
        <div className="p-8 flex flex-col sm:flex-row gap-">
          {/* left: avatar + details, ~40% width */}
          <div className="sm:w-[68%] flex flex-col items-center sm:items-start text-center sm:text-left shrink-0">
            <div className="w-20 h-20 rounded-full bg-[var(--button)] flex items-center justify-center text-2xl font-bold text-[var(--ink)] overflow-hidden">
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
            <h1 className="text-[var(--text)] text-xl font-extrabold tracking-tight leading-none mt-4">
              {name || "your account"}
            </h1>
            <p className="text-[var(--muted)] text-sm mt-2 break-all">{email}</p>
            {memberSince && (
              <p className="text-[var(--muted)] text-xs mt-1">member since {memberSince}</p>
            )}
          </div>

          {/* divider */}
          <div className="hidden sm:block w-px bg-[var(--panel-border)]" />
          <div className="sm:hidden h-px w-full bg-[var(--panel-border)]" />

          {/* right: account actions */}
          <div className="flex-1 flex flex-col gap-6">
            <form onSubmit={handleEmailUpdate} className="flex flex-col gap-4">
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  autoComplete="username"
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-md py-3 font-bold text-[var(--ink)] bg-[var(--button)] hover:bg-[var(--button-hover)] transition-colors disabled:opacity-60"
              >
                {saving ? "updating..." : "update email"}
              </button>
            </form>

            <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-4">
              <div>
                <label className={labelClass}>New password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-md py-3 font-bold text-[var(--ink)] bg-[var(--button)] hover:bg-[var(--button-hover)] transition-colors disabled:opacity-60"
              >
                {saving ? "updating..." : "update password"}
              </button>
            </form>

            {errorMsg && (
              <p className="text-sm text-[var(--error)] font-medium -mt-2">{errorMsg}</p>
            )}
            {statusMsg && (
              <p className="text-sm text-[var(--text)] -mt-2">{statusMsg}</p>
            )}

            <button
              type="button"
              onClick={handleSignOut}
              className="text-[var(--muted)] underline bg-transparent border-none cursor-pointer hover:text-[var(--text)] transition-colors text-sm self-start"
            >
              sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
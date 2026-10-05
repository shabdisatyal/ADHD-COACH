import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseclient";
import { Progress } from "./progress";
import { Stickers } from "../cutestickerprofile";
import { getIcon } from "../avatar";

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function Profile() {
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [picking, setPicking] = useState(false);
  const [selected, setSelected] = useState("duck");

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
  const savedAvatarId = user?.user_metadata?.avatar_id;

  const run = async (payload, successMsg, after) => {
    setErrorMsg("");
    setStatusMsg("");
    setSaving(true);
    const { data, error } = await supabase.auth.updateUser(payload);
    setSaving(false);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    if (data?.user) setUser(data.user);
    setStatusMsg(successMsg);
    after?.();
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (!newPassword) return setErrorMsg("Enter a new password first.");
    run({ password: newPassword }, "Password updated.", () => setNewPassword(""));
  };

  const handleEmailUpdate = (e) => {
    e.preventDefault();
    if (!newEmail) return setErrorMsg("Enter an email first.");
    run({ email: newEmail }, "Check your inbox to confirm the new email.");
  };

  const handleAvatarSave = () => {
    run({ data: { avatar_id: selected } }, "Picture updated.", () =>
      setPicking(false)
    );
  };

  const togglePicker = () => {
    setErrorMsg("");
    setStatusMsg("");
    setSelected(savedAvatarId || "duck");
    setPicking((v) => !v);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/signin";
  };

  const inputClass =
    "w-full bg-transparent text-[#2B2118] text-sm py-2 border-b border-[#C9BFA5] outline-none focus:border-[#4C7A54] transition-colors";
  const labelClass = "text-[#7A5230] text-xs";
  const submitClass =
    "rounded-lg py-2.5 px-5 text-sm font-semibold text-white bg-[#2F5D3A] hover:bg-[#244A2E] transition-colors disabled:opacity-60";

  return (
    <div
      className="min-h-screen w-full bg-[#F5EFE1] px-4 py-10"
      style={{ fontFamily: "'Lexend', system-ui, sans-serif" }}
    >
      <div className="mx-auto w-full max-w-6xl bg-white rounded-xl overflow-hidden">
        {/* header band */}
        <header className="bg-[#AEC4D4] px-8 sm:px-14 py-10 flex flex-col sm:flex-row sm:items-center gap-6">
          <button
            type="button"
            onClick={togglePicker}
            aria-label="Change profile picture"
            className="group relative w-24 h-24 rounded-full shrink-0 overflow-hidden bg-[#FFF4E0] shadow-lg"
          >
            <img
              src={getIcon(savedAvatarId).icon}
              alt="Profile"
              className="w-full h-full object-contain p-2"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Change pfp
            </span>
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="text-4xl font-bold text-[#2B2118] leading-tight">
              {name || "Your account"}
            </h1>
            <p className="text-[#2F4858] text-sm mt-1 break-all">{email}</p>
            {memberSince && (
              <p className="text-[#4F6678] text-sm mt-0.5">Member since {memberSince}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-lg px-5 py-2.5 text-sm font-medium text-[#7A5230] bg-[#F5EFE1] hover:bg-[#FCF1D0] transition-colors"
            >
              Sign out
            </button>
            <button type="button" onClick={() => setEditing((v) => !v)} className={submitClass}>
              {editing ? "Close" : "Edit profile"}
            </button>
          </div>
        </header>

        {/* sticker picker that opens from the circle */}
        {picking && (
          <div className="px-8 sm:px-14 py-8 border-b border-[#E6DDC6] bg-[#FCF1D0]/50">
            <Stickers selected={selected} onSelect={setSelected} />
            <div className="flex items-center gap-4 mt-4 max-w-md mx-auto">
              <button
                type="button"
                onClick={handleAvatarSave}
                disabled={saving}
                className={submitClass}
              >
                {saving ? "Saving..." : "Saved!"}
              </button>
              {(errorMsg || statusMsg) && (
                <p className={`text-sm ${errorMsg ? "text-red-600 font-medium" : "text-[#2B2118]"}`}>
                  {errorMsg || statusMsg}
                </p>
              )}
            </div>
          </div>
        )}

        {/* account settings, opens from Edit profile */}
        {editing && (
          <div className="px-8 sm:px-14 py-8 border-b border-[#E6DDC6] bg-[#FCF1D0]/50 grid gap-8 sm:grid-cols-2">
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
              <button type="submit" disabled={saving} className={`${submitClass} self-start`}>
                {saving ? "Updating..." : "Update email"}
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
              <button type="submit" disabled={saving} className={`${submitClass} self-start`}>
                {saving ? "Updating..." : "Update password"}
              </button>
            </form>

            {(errorMsg || statusMsg) && (
              <p className={`sm:col-span-2 text-sm ${errorMsg ? "text-red-600 font-medium" : "text-[#2B2118]"}`}>
                {errorMsg || statusMsg}
              </p>
            )}
          </div>
        )}

        {/* progress */}
        <main className="px-8 sm:px-14 py-10 bg-white">
          <Progress />
        </main>
      </div>
    </div>
  );
}
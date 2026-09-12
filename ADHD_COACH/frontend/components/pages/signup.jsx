import React, { useState } from "react";
import { supabase } from "../../../supabaseclient";

//to add custom color changer 
const theme = {
  "--bg": "#0B1710",
  "--panel": "#0E1F14",
  "--panel-border": "#1E3324",
  "--border": "#4c634c",
  "--muted": "#91be9e",
  "--text": "#FFFFFF",
  "--accent": "#ff98d6",
  "--ink": "#0E1F14",
  "--pink": "#F6A8CB",
  "--pink-hover": "#F393BE",
  "--error": "#F87171",
};

export const Signup = () => {
  const [form, setForm] = useState({ email: "", password: "", name: "", age: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
        },
      },
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    console.log(data);
  };

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

  const inputClass =
    "w-full bg-transparent text-[var(--text)] text-sm py-2 border-b border-[var(--border)] outline-none focus:border-[var(--accent)] transition-colors";
  const labelClass = "text-[var(--muted)] text-xs uppercase tracking-wide";

  return (
    <div
      style={theme}
      className="min-h-screen w-full flex items-center justify-center bg-[var(--bg)] px-4 py-10"
    >
      <div className="relative w-full max-w-3xl bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-visible">
        {/* left: form */}
        <div className="flex-1 p-10 md:pr-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-11 h-11 rounded-full bg-[var(--accent)] flex items-center justify-center text-[var(--ink)] text-lg font-bold shrink-0">
              C
            </div>
            <div>
              <h1 className="text-[var(--text)] text-2xl font-extrabold tracking-tight leading-none">
                CREATE ACCOUNT
              </h1>
              <p className="text-[var(--muted)] text-sm mt-1">
                Start building progressive study habits.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className={labelClass}>Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="username"
                className={inputClass}
              />
            </div>

            <div className="relative">
              <label className={labelClass}>Password</label>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                className={`${inputClass} pr-8`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-0 bottom-2 text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a18.5 18.5 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </button>
            </div>

            <div>
              <label className={labelClass}>Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Age</label>
              <input
                name="age"
                value={form.age}
                onChange={handleChange}
                autoComplete="off"
                className={inputClass}
              />
            </div>

            {errorMsg && (
              <p className="text-sm text-[var(--error)] -mt-2">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full py-3 font-bold text-[var(--ink)] bg-[var(--pink)] hover:bg-[var(--pink-hover)] transition-colors disabled:opacity-60"
            >
              {loading ? "Signing up..." : "SIGN UP"}
            </button>
          </form>

          <div className="flex items-center justify-between mt-6 text-sm">
            <button
              type="button"
              onClick={handleUpdate}
              className="text-[var(--muted)] underline bg-transparent border-none cursor-pointer hover:text-[var(--accent)] transition-colors"
            >
              Forgot Password?
            </button>
            <a href="/signin" className="text-[var(--muted)]">
              Have an account?{" "}
              <span className="text-[var(--accent)] font-semibold">Log in</span>
            </a>
          </div>
        </div>

        {/* right: decorative panel */}
        <div className="hidden md:block relative w-64 shrink-0">
          <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-72 h-80 rounded-2xl bg-[var(--accent)] p-8 flex flex-col justify-end shadow-xl">
            <p className="text-[var(--ink)] text-2xl font-extrabold leading-tight relative mt-40">
              BUILD FOCUS,
              <br />
              <span className="font-black">STUDY SMARTER</span> ✦
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
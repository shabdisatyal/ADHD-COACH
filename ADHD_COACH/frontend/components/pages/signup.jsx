import React, { useState } from "react";

const theme = {
  "--bg": "#EBF4DD",
  "--sage": "#90AB8B",
  "--forest": "#5A7863",
  "--ink": "#3B4953",
};

export const Signup = () => {
  const [form, setForm] = useState({ email: "", password: "", name: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div
      style={theme}
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
          <div className="submit mt-2">
            <button
              type="submit"
              className="w-full rounded-sm py-2 text-white transition-colors"
              style={{ backgroundColor: "var(--forest)" }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
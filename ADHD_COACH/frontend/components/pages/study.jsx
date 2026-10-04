
import { BACKGROUNDS, fmt, useStudy } from "./Usestudy";
// UI for the Study page. All state and timer logic lives in useStudy.js.

export function Study() {
  const {
    settings,
    set,
    showSettings,
    setShowSettings,
    bgOpt,
    totalFocus,
    totalBreak,
    playlist,
    linkInput,
    setLinkInput,
    linkError,
    addPlaylist,
    removePlaylist,
    phases,
    phaseIndex,
    isFocus,
    remaining,
    running,
    finished,
    inProgress,
    progress,
    toggleRun,
    reset,
    toast,
  } = useStudy();

  const ink = bgOpt.dark ? "#FCF1D0" : "#2B2118";
  const accent = bgOpt.dark ? "#FCF1D0" : "#2F5D3A";

  // timer ring
  const R = 88;
  const C = 2 * Math.PI * R;
  const ringColor = isFocus ? accent : bgOpt.dark ? "#B0CDE6" : "#7A5230";

  const panel = `rounded-2xl border p-5 ${
    bgOpt.dark ? "bg-white/10 border-white/20" : "bg-white/70 border-[#E6DDC6]"
  }`;
  const primaryBtn = `rounded-xl px-8 py-3 text-sm font-semibold transition-colors ${
    bgOpt.dark ? "bg-[#FCF1D0] text-[#2B2118] hover:bg-white" : "bg-[#2F5D3A] text-white hover:bg-[#244A2E]"
  }`;
  const ghostBtn = `rounded-xl px-6 py-3 text-sm font-medium border transition-colors disabled:opacity-40 ${
    bgOpt.dark ? "border-white/30 hover:bg-white/10" : "border-[#2B2118]/20 hover:bg-white/60"
  }`;

  return (
    <div
      className="relative min-h-screen w-full transition-colors duration-500"
      style={{ background: bgOpt.bg, color: ink, fontFamily: "'Lexend', system-ui, sans-serif" }}
    >
      {/* settings toggle, top left */}
      <button
        type="button"
        onClick={() => setShowSettings((v) => !v)}
        aria-pressed={showSettings}
        aria-label="Focus settings"
        className={`absolute top-4 left-4 z-20 w-10 h-10 rounded-full flex items-center justify-center shadow transition-colors ${
          showSettings
            ? bgOpt.dark
              ? "bg-[#FCF1D0] text-[#2B2118]"
              : "bg-[#2F5D3A] text-white"
            : bgOpt.dark
            ? "bg-white/15 text-[#FCF1D0]"
            : "bg-white text-[#2F5D3A]"
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
          <circle cx="16" cy="6" r="2" />
          <circle cx="10" cy="12" r="2" />
          <circle cx="18" cy="18" r="2" />
        </svg>
      </button>

      {/* settings popover, only rendered while the toggle is on */}
      {showSettings && (
        <div className="absolute top-16 left-4 z-20 w-72 rounded-2xl bg-[#FFFDF6] text-[#2B2118] border border-[#E6DDC6] shadow-xl p-5 flex flex-col gap-5">
          <fieldset disabled={inProgress} className="flex flex-col gap-5 disabled:opacity-50">
            <label className="block">
              <div className="flex justify-between text-sm font-medium">
                <span>Focus length</span>
                <span className="text-[#3E6B4A]">{settings.focus} min</span>
              </div>
              <input
                type="range"
                min="5"
                max="90"
                step="5"
                value={settings.focus}
                onChange={(e) => set("focus", Number(e.target.value))}
                className="w-full mt-2 accent-[#2F5D3A]"
              />
            </label>

            <div>
              <div className="flex items-center justify-between text-sm font-medium">
                <span>Breaks</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Fewer breaks"
                    onClick={() => set("breaks", Math.max(0, settings.breaks - 1))}
                    className="w-8 h-8 rounded-full border border-[#C9BFA5] hover:bg-[#FCF1D0]"
                  >
                    -
                  </button>
                  <span className="w-4 text-center text-[#3E6B4A]">{settings.breaks}</span>
                  <button
                    type="button"
                    aria-label="More breaks"
                    onClick={() => set("breaks", Math.min(6, settings.breaks + 1))}
                    className="w-8 h-8 rounded-full border border-[#C9BFA5] hover:bg-[#FCF1D0]"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <label className="block">
              <div className="flex justify-between text-sm font-medium">
                <span>Break length</span>
                <span className="text-[#3E6B4A]">{settings.breakLen} min</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={settings.breakLen}
                onChange={(e) => set("breakLen", Number(e.target.value))}
                disabled={settings.breaks === 0}
                className="w-full mt-2 accent-[#7A5230]"
              />
            </label>
          </fieldset>

          <div className="flex items-center justify-between text-sm font-medium">
            <span>Spotify player</span>
            <button
              type="button"
              role="switch"
              aria-checked={settings.music}
              aria-label="Show Spotify player"
              onClick={() => set("music", !settings.music)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                settings.music ? "bg-[#2F5D3A]" : "bg-[#C9BFA5]"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  settings.music ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Focus background</div>
            <div className="flex gap-2">
              {BACKGROUNDS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  aria-label={b.name}
                  title={b.name}
                  onClick={() => set("bg", b.id)}
                  className="w-8 h-8 rounded-full border border-black/10"
                  style={{
                    background: b.bg,
                    outline: settings.bg === b.id ? "2px solid #2F5D3A" : "none",
                    outlineOffset: 2,
                  }}
                />
              ))}
            </div>
          </div>

          <p className="text-xs text-[#7A5230]">
            {totalFocus} min focus and {totalBreak} min break in total.
            {inProgress && " Reset the timer to change length or breaks."}
          </p>
        </div>
      )}

      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* left: Spotify */}
        {settings.music && (
        <aside className="lg:w-[26rem] shrink-0 p-6 pt-20">
          <div className={panel}>
            <h2 className="text-sm font-semibold">Music</h2>
            {!playlist ? (
              <form onSubmit={addPlaylist} className="mt-3 flex flex-col gap-3">
                <p className="text-sm opacity-70">Paste a Spotify playlist link to play it while you focus.</p>
                <input
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder="https://open.spotify.com/playlist/..."
                  aria-label="Spotify playlist link"
                  className="w-full rounded-lg bg-white/80 text-[#2B2118] text-sm px-3 py-2.5 outline-none border border-[#C9BFA5] focus:border-[#4C7A54]"
                />
                {linkError && <p className="text-xs font-medium text-[#9B2C2C] bg-white/80 rounded-md px-2 py-1">{linkError}</p>}
                <button type="submit" className={`${primaryBtn} self-start !px-5 !py-2.5`}>
                  Add playlist
                </button>
              </form>
            ) : (
              <div className="mt-3">
                <iframe
                  title="Spotify player"
                  src={`https://open.spotify.com/embed/${playlist.type}/${playlist.id}?utm_source=generator`}
                  width="100%"
                  height="352"
                  style={{ border: 0, borderRadius: 12 }}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
                <button type="button" onClick={removePlaylist} className="mt-3 text-sm underline opacity-70 hover:opacity-100">
                  Change playlist
                </button>
              </div>
            )}
          </div>
        </aside>
        )}

        {/* center: timer */}
        <main className="flex-1 flex flex-col items-center justify-center gap-8 p-6 pb-16">
          <div className="text-sm font-semibold opacity-80">
            {finished ? "Session complete" : isFocus ? "Focus" : "Break"}
          </div>

          <div className="relative w-72 h-72">
            <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
              <circle cx="100" cy="100" r={R} fill="none" stroke={ink} strokeOpacity="0.15" strokeWidth="10" />
              <circle
                cx="100"
                cy="100"
                r={R}
                fill="none"
                stroke={ringColor}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - progress)}
                style={{ transition: "stroke-dashoffset 0.3s linear" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-6xl font-bold tabular-nums">
              {fmt(remaining)}
            </div>
          </div>

          <div className="flex gap-1.5" aria-label="Session progress">
            {phases.map((p, i) => (
              <span
                key={i}
                className="h-1.5 rounded-full"
                style={{
                  width: p.type === "focus" ? 28 : 14,
                  background:
                    p.type === "focus"
                      ? accent
                      : bgOpt.dark
                      ? "#B0CDE6"
                      : "#7A5230",
                  opacity: i < phaseIndex || finished ? 1 : i === phaseIndex ? 0.75 : 0.25,
                }}
              />
            ))}
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={toggleRun} className={primaryBtn}>
              {finished ? "Start again" : running ? "Pause" : inProgress ? "Resume" : "Start"}
            </button>
            <button type="button" onClick={() => reset(true)} disabled={!inProgress} className={ghostBtn}>
              End session
            </button>
          </div>
        </main>
      </div>

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-xl bg-[#2F5D3A] text-white text-sm px-5 py-3 shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
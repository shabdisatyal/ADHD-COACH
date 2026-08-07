import { useState, useEffect, useRef, useCallback } from "react";

const PALETTE = {
  bg: "#EBF4DD",
  panel: "#FFFFFF",
  ring: "#CFE0BE",
  focus: "#5A7863",
  break: "#90AB8B",
  text: "#3B4953",
  textDim: "#6E8079",
};

const MODE_COLOR = { focus: PALETTE.focus, break: PALETTE.break };

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function FocusTimer() {
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [mode, setMode] = useState("focus"); // "focus" | "break"
  const [secondsLeft, setSecondsLeft] = useState(focusMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsDone, setSessionsDone] = useState(0);

  const intervalRef = useRef(null);

  const totalForMode = (mode === "focus" ? focusMinutes : breakMinutes) * 60;

  
  useEffect(() => {
    if (!isRunning) {
      setSecondsLeft((mode === "focus" ? focusMinutes : breakMinutes) * 60);
    }
   
  }, [focusMinutes, breakMinutes, mode]);

  const switchMode = useCallback(() => {
    setMode((prev) => {
      const next = prev === "focus" ? "break" : "focus";
      if (prev === "focus") setSessionsDone((n) => n + 1);
      setSecondsLeft((next === "focus" ? focusMinutes : breakMinutes) * 60);
      return next;
    });
  }, [focusMinutes, breakMinutes]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          switchMode();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, switchMode]);

  const toggleRunning = () => setIsRunning((r) => !r);

  const reset = () => {
    setIsRunning(false);
    setSecondsLeft((mode === "focus" ? focusMinutes : breakMinutes) * 60);
  };

  const progress = totalForMode > 0 ? 1 - secondsLeft / totalForMode : 0;
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);
  const accent = MODE_COLOR[mode];

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: PALETTE.bg }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 flex flex-col items-center gap-6"
        style={{
          backgroundColor: PALETTE.panel,
          border: `1px solid ${PALETTE.ring}`,
          boxShadow: "0 8px 30px rgba(59, 73, 83, 0.10)",
        }}
      >
        {/* Mode label */}
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: accent }}
          />
          <span
            className="text-xs tracking-widest uppercase"
            style={{ color: PALETTE.textDim, letterSpacing: "0.2em" }}
          >
            {mode === "focus" ? "Focus session" : "Break"}
          </span>
        </div>

        {/* Ring + time */}
        <div className="relative flex items-center justify-center">
          <svg width="260" height="260" viewBox="0 0 260 260">
            <circle
              cx="130"
              cy="130"
              r={radius}
              fill="none"
              stroke={PALETTE.ring}
              strokeWidth="10"
            />
            <circle
              cx="130"
              cy="130"
              r={radius}
              fill="none"
              stroke={accent}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 130 130)"
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span
              className="text-5xl font-semibold tabular-nums"
              style={{ color: PALETTE.text, fontVariantNumeric: "tabular-nums" }}
            >
              {formatTime(secondsLeft)}
            </span>
            <span className="text-xs mt-1" style={{ color: PALETTE.textDim }}>
              {sessionsDone} session{sessionsDone === 1 ? "" : "s"} done
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 w-full justify-center">
          <button
            onClick={toggleRunning}
            className="px-6 py-2 rounded-full font-medium text-sm"
            style={{
              backgroundColor: accent,
              color: PALETTE.bg,
            }}
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            onClick={reset}
            className="px-5 py-2 rounded-full font-medium text-sm"
            style={{
              backgroundColor: "transparent",
              border: `1px solid ${PALETTE.ring}`,
              color: PALETTE.textDim,
            }}
          >
            Reset
          </button>
          <button
            onClick={switchMode}
            className="px-5 py-2 rounded-full font-medium text-sm"
            style={{
              backgroundColor: "transparent",
              border: `1px solid ${PALETTE.ring}`,
              color: PALETTE.textDim,
            }}
          >
            Skip
          </button>
        </div>

        {/* Sliders */}
        <div className="w-full flex flex-col gap-4 pt-2">
          <SliderRow
            label="Focus"
            value={focusMinutes}
            min={5}
            max={60}
            step={5}
            color={PALETTE.focus}
            onChange={setFocusMinutes}
            disabled={isRunning}
          />
          <SliderRow
            label="Break"
            value={breakMinutes}
            min={1}
            max={30}
            step={1}
            color={PALETTE.break}
            onChange={setBreakMinutes}
            disabled={isRunning}
          />
        </div>
      </div>
    </div>
  );
}

function SliderRow({ label, value, min, max, step, color, onChange, disabled }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs" style={{ color: PALETTE.textDim }}>
        <span>{label}</span>
        <span style={{ color }}>{value} min</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ accentColor: color, opacity: disabled ? 0.4 : 1 }}
        className="w-full"
      />
    </div>
  );
}
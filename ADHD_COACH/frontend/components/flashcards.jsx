import { useState, useEffect, useCallback } from "react";

const PALETTE = {
  bg: "#EBF4DD",
  panel: "#FFFFFF",
  ring: "#CFE0BE",
  focus: "#5A7863",
  break: "#90AB8B",
  text: "#3B4953",
  textDim: "#6E8079",
};


];

export const DEFAULT_CARDS = [
  { front: "", back: "" },
  { front: "", back: "" },
  { front: "", back: "" },
];
 
const TRANSITION_MS = 220;

export default function Flashcard({ cards = DEFAULT_CARDS }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(() => new Set());
  const [phase, setPhase] = useState("idle"); // "idle" | "out"
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

  const total = cards.length;
  const card = cards[index];

  const goTo = useCallback(
    (next, dir) => {
      setDirection(dir);
      setFlipped(false);
      setPhase("out");
      setTimeout(() => {
        setIndex((i) => (next + total) % total);
        setPhase("idle");
      }, TRANSITION_MS);
    },
    [total]
  );

  const handleNext = useCallback(() => goTo(index + 1, 1), [goTo, index]);
  const handlePrev = useCallback(() => goTo(index - 1, -1), [goTo, index]);
  const handleFlip = useCallback(() => setFlipped((f) => !f), []);

  const markKnown = (isKnown) => {
    setKnown((prev) => {
      const next = new Set(prev);
      if (isKnown) next.add(index);
      else next.delete(index);
      return next;
    });
    handleNext();
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") handleNext();
      else if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleFlip();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleNext, handlePrev, handleFlip]);

  return (
    <div
      style={{
        minHeight: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        background: PALETTE.bg,
        padding: "48px 24px",
        fontFamily:
          "'Segoe UI', system-ui, -apple-system, sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* progress dots */}
      <div style={{ display: "flex", gap: "8px" }}>
        {cards.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === index ? "20px" : "8px",
              height: "8px",
              borderRadius: "999px",
              transition: "all 0.25s ease",
              background: known.has(i)
                ? PALETTE.focus
                : i === index
                ? PALETTE.break
                : PALETTE.ring,
            }}
          />
        ))}
      </div>

      {/* card */}
      <div
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") e.preventDefault();
        }}
        style={{
          perspective: "1200px",
          width: "min(420px, 90vw)",
          height: "260px",
          cursor: "pointer",
          opacity: phase === "out" ? 0 : 1,
          transform:
            phase === "out"
              ? `translateX(${direction * -28}px) scale(0.96)`
              : "translateX(0) scale(1)",
          transition: `opacity ${TRANSITION_MS}ms ease, transform ${TRANSITION_MS}ms ease`,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            transformStyle: "preserve-3d",
            transition: "transform 0.5s cubic-bezier(0.4, 0.2, 0.2, 1)",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* front */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              background: PALETTE.panel,
              border: `1px solid ${PALETTE.ring}`,
              borderRadius: "18px",
              boxShadow: "0 6px 24px rgba(90,120,99,0.12)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "32px",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: PALETTE.textDim,
                marginBottom: "16px",
              }}
            >
              {index + 1} / {total} · question
            </span>
            <p
              style={{
                fontSize: "20px",
                fontWeight: 500,
                color: PALETTE.text,
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {card.front}
            </p>
            <span
              style={{
                position: "absolute",
                bottom: "18px",
                fontSize: "12px",
                color: PALETTE.textDim,
              }}
            >
              tap to flip
            </span>
          </div>

          {/* back */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: PALETTE.focus,
              borderRadius: "18px",
              boxShadow: "0 6px 24px rgba(90,120,99,0.2)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "32px",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: PALETTE.ring,
                marginBottom: "16px",
              }}
            >
              answer
            </span>
            <p
              style={{
                fontSize: "20px",
                fontWeight: 500,
                color: "#FFFFFF",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {card.back}
            </p>
          </div>
        </div>
      </div>

      {/* known / unknown actions */}
      <div style={{ display: "flex", gap: "12px" }}>
        <button
          onClick={() => markKnown(false)}
          style={{
            padding: "10px 18px",
            borderRadius: "999px",
            border: `1px solid ${PALETTE.ring}`,
            background: PALETTE.panel,
            color: PALETTE.textDim,
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          still learning
        </button>
        <button
          onClick={() => markKnown(true)}
          style={{
            padding: "10px 18px",
            borderRadius: "999px",
            border: "none",
            background: PALETTE.focus,
            color: "#FFFFFF",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          got it
        </button>
      </div>

      {/* nav */}
      <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
        <button
          onClick={handlePrev}
          aria-label="Previous card"
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: `1px solid ${PALETTE.ring}`,
            background: PALETTE.panel,
            color: PALETTE.text,
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          ‹
        </button>
        <span style={{ fontSize: "13px", color: PALETTE.textDim }}>
          {known.size} / {total} known
        </span>
        <button
          onClick={handleNext}
          aria-label="Next card"
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: `1px solid ${PALETTE.ring}`,
            background: PALETTE.panel,
            color: PALETTE.text,
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          ›
        </button>
      </div>
    </div>
  );
}
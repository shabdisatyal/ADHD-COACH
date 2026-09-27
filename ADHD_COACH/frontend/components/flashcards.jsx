import { useState, useEffect, useCallback, useRef } from "react";
import { getDueCards, saveReview, getNextUpcomingReview, getTodayReviewCount} from "./cards.js";

const PALETTE = {
  bg: "#FFFFFF",
  panel: "#FEF9E9",
  ring: "#BBD5DA",
  focus: "#3B4953",
  break: "#BBD5DA",
  text: "#000000",
  textDim: "#6E6E6E",
};

const TRANSITION_MS = 220;

export function Flashcard({ deckId = null }) {
  const [cards, setCards] = useState([]);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(() => new Set()); // set of card ids
  const [phase, setPhase] = useState("idle"); // "idle" | "out"
  const [direction, setDirection] = useState(1);
  const [nextReview, setNextReview] = useState(null);
  const [notifyState, setNotifyState] = useState("idle"); // idle | scheduled | unsupported | denied | too-far
  const [saveError, setSaveError] = useState("");
  const notifyTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (notifyTimeoutRef.current) clearTimeout(notifyTimeoutRef.current);
    };
  }, []);

useEffect(() => {
  let cancelled = false;
  setLoading(true);
  getDueCards(deckId)
    .then(async (due) => {
      if (cancelled) return;
      setCards(due);
      setIndex(0);
      setKnown(new Set());

      if (due.length > 0) {
        setSessionTotal(due.length);
      } else {
        // nothing due right now — check if today's reviews already happened
        try {
          const todayCount = await getTodayReviewCount(deckId);
          if (!cancelled) setSessionTotal(todayCount);
        } catch (err) {
          console.error("Failed to fetch today's review count:", err);
        }
      }
    })
    .finally(() => !cancelled && setLoading(false));
  return () => {
    cancelled = true;
  };
}, [deckId]);



  const total = cards.length;
  const card = cards[index];

  const goTo = useCallback(
    (next, dir) => {
      if (total === 0) return;
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

  const markKnown = async (isKnown) => {
    if (!card || submitting) return;
    setSubmitting(true);
    setSaveError("");

    let saved = false;
    try {
      await saveReview(card.id, isKnown);
      saved = true;
    } catch (err) {
      console.error("Failed to save review:", err);
      setSaveError("Couldn't save that review, check your connection and try again.");
    }
    setSubmitting(false);

    // if the save failed, bail out here: don't advance, don't mark known,
    // don't remove the card. A failed save must not look like a finished
    // review, or the count/"done" state silently drifts from what's
    // actually persisted in the database.
    if (!saved) return;

    if (isKnown) setKnown((prev) => new Set(prev).add(card.id));

    const reviewedId = card.id;
    setDirection(1);
    setFlipped(false);
    setPhase("out");
    setTimeout(() => {
      setCards((prev) => {
        const next = prev.filter((c) => c.id !== reviewedId);
        // clamp index into the shrunk array; harmless if next is empty,
        // the total === 0 branch below takes over in that case
        setIndex((i) => Math.max(0, Math.min(i, next.length - 1)));
        return next;
      });
      setPhase("idle");
    }, TRANSITION_MS);
  };

  useEffect(() => {
    if (!loading && total === 0 && sessionTotal > 0) {
      getNextUpcomingReview(deckId)
        .then(setNextReview)
        .catch((err) => console.error("Failed to fetch next review:", err));
    }
  }, [loading, total, sessionTotal, deckId]);

  const handleNotifyMe = () => {
    if (!("Notification" in window)) {
      setNotifyState("unsupported");
      return;
    }
    if (!nextReview) return;

    const delay = new Date(nextReview).getTime() - Date.now();
    // setTimeout delays beyond ~24 days are unreliable/capped by browsers,
    // and won't survive the tab closing anyway, so only schedule within a day.
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    Notification.requestPermission().then((permission) => {
      if (permission !== "granted") {
        setNotifyState("denied");
        return;
      }
      if (delay > ONE_DAY_MS) {
        setNotifyState("too-far");
        return;
      }
      notifyTimeoutRef.current = setTimeout(() => {
        new Notification("Time to review", {
          body: "Your next flashcard is due now.",
        });
      }, Math.max(0, delay));
      setNotifyState("scheduled");
    });
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

  if (loading) {
  return (
    <div style={wrapStyle}>
      <div className="loader" />
    </div>
  );
}

  if (total === 0) {
    const justFinished = sessionTotal > 0;
    return (
      <div style={wrapStyle}>
        <p style={{ fontSize: "40px", margin: 0 }}>{justFinished ? ":3" : "✨"}</p>
        <p style={{ color: PALETTE.text, fontWeight: 600, fontSize: "20px", margin: 0 }}>
          {justFinished ? "You're done for today!" : "All caught up"}
        </p>
        <p style={{ color: PALETTE.textDim, fontSize: "14px", textAlign: "center", maxWidth: "280px" }}>
          {justFinished
            ? `Nice work, you got through ${sessionTotal} card${sessionTotal === 1 ? "" : "s"} today.`
            : "No cards due right now. Check back later."}
        </p>

        {nextReview && (
          <p style={{ color: PALETTE.text, fontSize: "14px", marginTop: "4px" }}>
            Next review: {formatWhen(nextReview)}
          </p>
        )}

        {nextReview && notifyState === "idle" && (
          <button onClick={handleNotifyMe} style={notifyBtnStyle}>
            Remind me
          </button>
        )}
        {notifyState === "scheduled" && (
          <p style={{ color: PALETTE.textDim, fontSize: "13px" }}>
            We'll notify you here, keep this tab open.
          </p>
        )}
        {notifyState === "denied" && (
          <p style={{ color: PALETTE.textDim, fontSize: "13px" }}>
            Notifications are blocked in your browser settings.
          </p>
        )}
        {notifyState === "too-far" && (
          <p style={{ color: PALETTE.textDim, fontSize: "13px" }}>
            That's more than a day out, come back closer to then and we'll remind you.
          </p>
        )}
        {notifyState === "unsupported" && (
          <p style={{ color: PALETTE.textDim, fontSize: "13px" }}>
            Your browser doesn't support notifications.
          </p>
        )}
      </div>
    );
  }

  return (
    <div style={wrapStyle}>
      <div style={{ display: "flex", gap: "8px" }}>
        {cards.map((c, i) => (
          <div
            key={c.id}
            style={{
              width: i === index ? "20px" : "8px",
              height: "8px",
              borderRadius: "999px",
              transition: "all 0.25s ease",
              background: known.has(c.id)
                ? PALETTE.focus
                : i === index
                ? PALETTE.break
                : PALETTE.ring,
            }}
          />
        ))}
      </div>

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

      {saveError && (
        <p style={{ color: "#B3452F", fontSize: "13px", margin: 0 }}>
          {saveError}
        </p>
      )}

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          onClick={() => markKnown(false)}
          disabled={submitting}
          style={{
            padding: "10px 18px",
            borderRadius: "999px",
            border: `1px solid ${PALETTE.ring}`,
            background: PALETTE.panel,
            color: PALETTE.textDim,
            fontSize: "14px",
            fontWeight: 500,
            cursor: submitting ? "default" : "pointer",
            opacity: submitting ? 0.6 : 1,
          }}
        >
          still learning
        </button>
        <button
          onClick={() => markKnown(true)}
          disabled={submitting}
          style={{
            padding: "10px 18px",
            borderRadius: "999px",
            border: "none",
            background: PALETTE.focus,
            color: "#FFFFFF",
            fontSize: "14px",
            fontWeight: 500,
            cursor: submitting ? "default" : "pointer",
            opacity: submitting ? 0.6 : 1,
          }}
        >
          {submitting ? "saving..." : "got it"}
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
        <button
          onClick={handlePrev}
          aria-label="Previous card"
          style={navBtnStyle}
        >
          ‹
        </button>
        <span style={{ fontSize: "13px", color: PALETTE.textDim }}>
          {known.size} / {sessionTotal} known
        </span>
        <button
          onClick={handleNext}
          aria-label="Next card"
          style={navBtnStyle}
        >
          ›
        </button>
      </div>
    </div>
  );
}

const wrapStyle = {
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "20px",
  background: PALETTE.bg,
  padding: "48px 24px",
  fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
  boxSizing: "border-box",
};

const navBtnStyle = {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  border: `1px solid ${PALETTE.ring}`,
  background: PALETTE.panel,
  color: PALETTE.text,
  fontSize: "16px",
  cursor: "pointer",
};

const notifyBtnStyle = {
  padding: "8px 16px",
  borderRadius: "999px",
  border: "none",
  background: PALETTE.focus,
  color: "#FFFFFF",
  fontSize: "13px",
  fontWeight: 500,
  cursor: "pointer",
  marginTop: "4px",
};

function formatWhen(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (24 * 60 * 60 * 1000));

  if (diffDays <= 0) return "now";
  if (diffDays === 1) return "tomorrow";
  if (diffDays < 7) return `in ${diffDays} days`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
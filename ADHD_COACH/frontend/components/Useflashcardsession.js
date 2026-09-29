import { useState, useEffect, useCallback } from "react";
import { getDueCards, saveReview, getTodayReviewCount } from "./cards.js";

const TRANSITION_MS = 220;

export function useFlashcardSession(deckId) {
  const [cards, setCards] = useState([]);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(() => new Set()); // set of card ids
  const [phase, setPhase] = useState("idle"); 
  const [direction, setDirection] = useState(1);
  const [saveError, setSaveError] = useState("");

  // load the due queue whenever the deck changes
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

  const markKnown = useCallback(
    async (isKnown) => {
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
    },
    [card, submitting]
  );

  return {
    cards,
    card,
    total,
    index,
    flipped,
    known,
    phase,
    direction,
    loading,
    submitting,
    saveError,
    sessionTotal,
    handleNext,
    handlePrev,
    handleFlip,
    markKnown,
  };
}
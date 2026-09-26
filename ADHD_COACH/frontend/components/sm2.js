export function reviewCard({ interval, easeFactor, repetitions }, quality) {
  if (quality < 3) {  //fail case of reset
    repetitions = 0;
    interval = 1;
  } 
  else 
    {
    repetitions += 1; //success casce that gradually increases until collapse
    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 6;
    else interval = Math.round(interval * easeFactor);
  }
 
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return { interval, easeFactor, repetitions, nextReview: nextReview.toISOString() };
}

export function defaultProgress() {
  return { interval: 0, easeFactor: 2.5, repetitions: 0 };
}
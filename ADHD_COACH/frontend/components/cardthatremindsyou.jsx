import { useState, useCallback } from 'react';

export function useFolderShuffle(text, startIndex = 0) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  const shuffle = useCallback(() => {
    if (text.length <= 1) return; // nothing to shuffle to

    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * text.length);
    } while (nextIndex === currentIndex); // avoid immediate repeat

    setCurrentIndex(nextIndex);
  }, [text.length, currentIndex]);

  return {
    currentText: text[currentIndex],
    currentIndex,
    shuffle,
  };
}

export function Card({ text, label }) {
  const { currentText, currentIndex, shuffle } = useFolderShuffle(text);

  return (
    <div className="TextShufflerContainer w-full mx-auto mt-12" onClick={shuffle}>
      <div className="relative w-full overflow-hidden rounded-sm">
        <img
          src="https://i.pinimg.com/1200x/48/ac/d9/48acd9ee8d4190419df62f63a33c58d9.jpg"
          alt={label}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 flex items-center justify-center px-6">
          <p className="text-[#5A7863] text-4xl font-fascinate text-center px-4 py-2 rounded-md">
            {currentText}
          </p>
        </div>
      </div>

      <div className="dots flex justify-center gap-2 mt-2">
        {text.map((_, i) => (
          <span
            key={i}
            className={i === currentIndex ? 'dot dot-active' : 'dot'}
          />
        ))}
      </div>
    </div>
  );
}

export const textfolder = [
  {
    label: 'motivation',
    text: [
      'You Can Do This',
      'I Believe In You',
      'Yes Girl You Slay',
      'We are the wild u',
    ],
  },
];
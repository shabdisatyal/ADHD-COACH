import { useState, useCallback } from 'react';

// Takes an array of image sources - doesn't care what they're named
export function useFolderShuffle(images, startIndex = 0) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  const shuffle = useCallback(() => {
    if (images.length <= 1) return; // nothing to shuffle to

    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * images.length);
    } while (nextIndex === currentIndex); // avoid immediate repeat

    setCurrentIndex(nextIndex);
  }, [images.length, currentIndex]);

  return {
    currentImage: images[currentIndex],
    currentIndex,
    shuffle,
  };
}
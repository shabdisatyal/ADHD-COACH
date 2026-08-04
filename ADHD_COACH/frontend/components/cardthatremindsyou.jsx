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



export function Card({ images, label }) {
  const { currentImage, currentIndex, shuffle } = useFolderShuffle(images);

  return (
    <div className='ImageShufflerContainer border-4 border-black rounded-none' onClick={shuffle}>
      <img src={currentImage} alt={label} />
      <div className="dots">
        {images.map((_, i) => (
          <span
            key={i}
            className={i === currentIndex ? 'dot dot-active' : 'dot'}
          />
        ))}
      </div>
    </div>
  );
}


export const imgfolder = [
{
label:'motivation', 
images: [
  'https://i.pinimg.com/736x/0f/18/a3/0f18a36ecf97385615a384af03e6a514.jpg',
  'https://i.pinimg.com/736x/0b/a1/6a/0ba16a1be3ae8070a56bbeb7da769fa7.jpg',
  'https://i.pinimg.com/736x/29/b8/01/29b8011472227557eeaec20a84b3f5ee.jpg',

]

}






]
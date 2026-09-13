import { useRef, useState, useCallback } from "react";



const STICKER_IMAGES = [
  { src: "/stickers/image.png", size: 64, x: 60, y: 80, rotate: -8 },
  { src: "/stickers/image-1.png", size: 48, x: 260, y: 40, rotate: 12 },
  { src: "/stickers/image-2.png", size: 80, x: 120, y: 260, rotate: -4 },
  { src: "/stickers/image-3.png", size: 56, x: 300, y: 220, rotate: 6 },
];

function DraggableSticker({ sticker, zIndex, onPickUp }) {
  const [pos, setPos] = useState({ x: sticker.x, y: sticker.y });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ dx: 0, dy: 0 });

  const handlePointerDown = useCallback(
    (e) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      offset.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
      setDragging(true);
      onPickUp(); 
    },
    [pos, onPickUp]
  );

  const handlePointerMove = useCallback((e) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    setPos({
      x: e.clientX - offset.current.dx,
      y: e.clientY - offset.current.dy,
    });
  }, []);

  const handlePointerUp = useCallback((e) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
  }, []);

  return (
    <img
      src={sticker.src}
      alt=""
      draggable={false} 
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`absolute select-none touch-none ${
        dragging ? "cursor-grabbing scale-110" : "cursor-grab"
      } transition-transform duration-150`}
      style={{
        left: pos.x,
        top: pos.y,
        width: sticker.size,
        transform: `rotate(${sticker.rotate}deg)`,
        zIndex,
        filter: dragging
          ? "drop-shadow(0 12px 16px rgba(0,0,0,0.25))"
          : "drop-shadow(0 4px 6px rgba(0,0,0,0.15))",
      }}
    />
  );
}

export function StickerPlayground() {
  const [order, setOrder] = useState(STICKER_IMAGES.map((_, i) => i));

  const bringToFront = useCallback((i) => {
    setOrder((prev) => [...prev.filter((n) => n !== i), i]);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {STICKER_IMAGES.map((sticker, i) => (
        <DraggableSticker
          key={i}
          sticker={sticker}
          zIndex={order.indexOf(i) + 1}
          onPickUp={() => bringToFront(i)}
        />
      ))}
    </div>
  );
}
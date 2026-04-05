import { AnimatePresence } from "framer-motion";
import type { WeddingPhoto, SwipeDirection } from "../types";
import SwipeCard from "./SwipeCard";

interface Props {
  photos: WeddingPhoto[];
  onSwipe: (direction: SwipeDirection, photo: WeddingPhoto) => void;
}

const VISIBLE_CARDS = 3;

export default function CardStack({ photos, onSwipe }: Props) {
  const visible = photos.slice(0, VISIBLE_CARDS);

  if (visible.length === 0) return null;

  return (
    <div className="relative flex-1 min-h-0 overflow-hidden">
      <AnimatePresence mode="popLayout">
        {visible.map((photo, index) => (
          <SwipeCard
            key={photo.id}
            photo={photo}
            stackIndex={index}
            onSwipe={index === 0 ? (dir) => onSwipe(dir, photo) : undefined}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

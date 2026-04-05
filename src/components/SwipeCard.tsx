import { forwardRef, useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import type { WeddingPhoto, SwipeDirection } from "../types";
import { THEME_MAP } from "../data/themes";

interface Props {
  photo: WeddingPhoto;
  onSwipe?: (direction: SwipeDirection) => void;
  stackIndex: number;
}

const SWIPE_THRESHOLD = 110;
const VELOCITY_THRESHOLD = 600;

const SwipeCard = forwardRef<HTMLDivElement, Props>(function SwipeCard(
  { photo, onSwipe, stackIndex },
  forwardedRef,
) {
  const isTop = stackIndex === 0;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const isDragging = useRef(false);

  // Derived animations from drag position
  const rotate = useTransform(x, [-220, 0, 220], [-18, 0, 18]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const dislikeOpacity = useTransform(x, [-100, -20], [1, 0]);
  const cardScale = useTransform(x, [-220, 0, 220], [0.97, 1, 0.97]);

  // Cards behind the top scale down and shift upward (peek from behind top card)
  const behindScale = 1 - stackIndex * 0.05;
  const behindY = -(stackIndex * 8); // negative = upward, so behind cards peek from behind

  const triggerSwipe = useCallback(
    (direction: SwipeDirection) => {
      if (!onSwipe) return;
      const targetX = direction === "like" ? 600 : -600;
      void animate(x, targetX, { duration: 0.35, ease: "easeIn" });
      void animate(y, 40, { duration: 0.35 });

      // Haptic feedback on supported devices
      if (navigator.vibrate) navigator.vibrate(40);

      setTimeout(() => {
        x.set(0);
        y.set(0);
        onSwipe(direction);
      }, 350);
    },
    [onSwipe, x, y],
  );

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      isDragging.current = false;
      const ox = info.offset.x;
      const vx = info.velocity.x;

      if (ox > SWIPE_THRESHOLD || vx > VELOCITY_THRESHOLD) {
        triggerSwipe("like");
      } else if (ox < -SWIPE_THRESHOLD || vx < -VELOCITY_THRESHOLD) {
        triggerSwipe("dislike");
      } else {
        // Snap back with spring
        void animate(x, 0, { type: "spring", stiffness: 350, damping: 30 });
        void animate(y, 0, { type: "spring", stiffness: 350, damping: 30 });
      }
    },
    [triggerSwipe, x, y],
  );

  return (
    <motion.div
      ref={forwardedRef}
      className="absolute inset-0"
      style={{
        scale: isTop ? cardScale : behindScale,
        y: isTop ? y : behindY,
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        zIndex: 10 - stackIndex,
        originY: 1,
      }}
      initial={stackIndex === 0 ? { scale: 0.92, y: 20, opacity: 0 } : false}
      animate={
        stackIndex === 0
          ? { scale: 1, y: 0, opacity: 1 }
          : { scale: behindScale, y: behindY, opacity: 1 - stackIndex * 0.15 }
      }
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragStart={() => {
        isDragging.current = true;
      }}
      onDragEnd={handleDragEnd}
      data-drag={isTop ? "true" : undefined}
    >
      <div className="relative h-full w-full overflow-hidden rounded-3xl card-shadow">
        {/* Background image */}
        <img
          src={photo.url}
          alt={photo.altDescription}
          className="h-full w-full object-cover"
          loading={stackIndex === 0 ? "eager" : "lazy"}
          style={
            {
              userSelect: "none",
              WebkitUserDrag: "none",
            } as React.CSSProperties
          }
        />

        {/* Gradient overlay — dark top for header, dark bottom for info */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/75" />

        {/* Like stamp */}
        <motion.div
          className="absolute left-5 top-10 rounded-xl border-4 border-emerald-400 px-4 py-2 text-emerald-400"
          style={{ opacity: likeOpacity, rotate: -15 }}
        >
          <span className="font-playfair text-2xl font-bold italic tracking-wider">
            SIM ♥
          </span>
        </motion.div>

        {/* Dislike stamp */}
        <motion.div
          className="absolute right-5 top-10 rounded-xl border-4 border-rose-400 px-4 py-2 text-rose-400"
          style={{ opacity: dislikeOpacity, rotate: 15 }}
        >
          <span className="font-playfair text-2xl font-bold italic tracking-wider">
            NÃO ✕
          </span>
        </motion.div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-36 pt-4">
          <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
            {THEME_MAP[photo.themeKey]?.label ?? ""}
          </span>
        </div>
      </div>
    </motion.div>
  );
});

export default SwipeCard;

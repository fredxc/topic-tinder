import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../store/context";
import { fetchVisionBoardPhotos } from "../services/unsplash";
import {
  dimensionBreakdown,
  DIMENSION_LABELS,
  DIMENSION_ICONS,
} from "../services/classifier";
import type { WeddingPhoto } from "../types";
import FloatingHearts from "./FloatingHearts";

// Simple animate-in on mount with delay — avoids whileInView issues inside scroll containers
function Section({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function ResultScreen() {
  const { state, dispatch } = useAppStore();
  const { profile } = state;
  const [visionPhotos, setVisionPhotos] = useState<WeddingPhoto[]>([]);
  const [confettiVisible, setConfettiVisible] = useState(true);

  useEffect(() => {
    if (!profile) return;
    fetchVisionBoardPhotos(profile.archetype.visionBoardQueries)
      .then(setVisionPhotos)
      .catch(() => {
        // Use liked photos as fallback
        setVisionPhotos(profile.likedPhotos.slice(0, 6));
      });
  }, [profile]);

  useEffect(() => {
    const t = setTimeout(() => setConfettiVisible(false), 3000);
    return () => clearTimeout(t);
  }, []);

  if (!profile) return null;

  const { archetype, isHybrid, hybridName, normalizedScores, likedPhotos } =
    profile;
  const breakdown = dimensionBreakdown(profile.scores);
  const displayName = isHybrid && hybridName ? hybridName : archetype.name;
  const boardPhotos =
    visionPhotos.length > 0 ? visionPhotos : likedPhotos.slice(0, 6);

  return (
    <div className="relative h-dvh overflow-y-auto overflow-x-hidden bg-stone-50 scrollbar-hide">
      {/* Confetti burst */}
      <AnimatePresence>
        {confettiVisible && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
          >
            {Array.from({ length: 30 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                style={{ left: `${Math.random() * 100}%`, top: "-5%" }}
                animate={{
                  y: ["0%", "110vh"],
                  x: [0, (Math.random() - 0.5) * 200],
                  rotate: [0, Math.random() * 720 - 360],
                  opacity: [1, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 1.5,
                  delay: Math.random() * 0.8,
                }}
              >
                {
                  ["🌸", "💕", "✨", "🌹", "💍", "🎊", "⭐", "🌺"][
                    Math.floor(Math.random() * 8)
                  ]
                }
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-lg px-5 pb-16 pt-safe">
        {/* Hero */}
        <Section>
          <div className="pt-12 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 14,
                delay: 0.2,
              }}
              className="mb-4 text-6xl"
            >
              {archetype.icon}
            </motion.div>

            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-amber-700">
              Seu perfil de casamento
            </p>

            <h1 className="font-playfair text-3xl font-bold italic leading-tight text-stone-900">
              {displayName}
            </h1>

            {isHybrid && (
              <div className="mt-1 flex items-center justify-center gap-1.5">
                <span className="text-xs text-stone-500">
                  {archetype.name} · {profile.secondaryArchetype?.name}
                </span>
              </div>
            )}

            <p className="mt-3 font-playfair text-base italic text-stone-600">
              "{archetype.tagline}"
            </p>
          </div>
        </Section>

        <div className="my-8 h-px w-full bg-stone-200" />

        {/* Description */}
        <Section>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-playfair text-lg font-semibold italic text-stone-900">
              Quem é você como noiva
            </h2>
            <p className="text-sm leading-relaxed text-stone-600">
              {archetype.description}
            </p>
          </div>
        </Section>

        <div className="my-6" />

        {/* Dimension breakdown */}
        <Section>
          <h2 className="mb-4 font-playfair text-lg font-semibold italic text-stone-900">
            Seu estilo em números
          </h2>
          <motion.div variants={stagger} initial="hidden" animate="visible">
            {(
              Object.keys(normalizedScores) as (keyof typeof normalizedScores)[]
            )
              .sort((a, b) => breakdown[b] - breakdown[a])
              .map((dim) => (
                <motion.div key={dim} variants={fadeUp} className="mb-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-sm text-stone-700">
                      <span>{DIMENSION_ICONS[dim]}</span>
                      <span>{DIMENSION_LABELS[dim]}</span>
                    </span>
                    <span className="text-sm font-semibold text-stone-900">
                      {breakdown[dim]}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300"
                      initial={{ width: 0 }}
                      animate={{ width: `${breakdown[dim]}%` }}
                      transition={{
                        duration: 0.9,
                        ease: "easeOut",
                        delay: 0.4,
                      }}
                    />
                  </div>
                </motion.div>
              ))}
          </motion.div>
        </Section>

        <div className="my-6 h-px w-full bg-stone-200" />

        {/* Color palette */}
        <Section>
          <h2 className="mb-4 font-playfair text-lg font-semibold italic text-stone-900">
            Paleta do seu casamento
          </h2>
          <div className="flex gap-3">
            {archetype.palette.map((swatch, i) => (
              <motion.div
                key={swatch.hex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="h-14 w-full rounded-xl shadow-md"
                  style={{ backgroundColor: swatch.hex }}
                />
                <span className="text-center text-xs leading-tight text-stone-500">
                  {swatch.name}
                </span>
              </motion.div>
            ))}
          </div>
        </Section>

        <div className="my-6 h-px w-full bg-stone-200" />

        {/* Characteristics */}
        <Section>
          <h2 className="mb-4 font-playfair text-lg font-semibold italic text-stone-900">
            O que define seu casamento
          </h2>
          <motion.div
            className="space-y-3"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            {archetype.characteristics.map((c) => (
              <motion.div
                key={c}
                variants={fadeUp}
                className="flex items-start gap-3 rounded-xl bg-white px-4 py-3 shadow-sm"
              >
                <span className="mt-0.5 text-amber-600">❖</span>
                <span className="text-sm text-stone-700">{c}</span>
              </motion.div>
            ))}
          </motion.div>
        </Section>

        <div className="my-6 h-px w-full bg-stone-200" />

        {/* Venue + flowers + budget */}
        <Section>
          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 font-playfair font-semibold italic text-stone-900">
                <span>🏗️</span> Locais ideais
              </h3>
              <ul className="space-y-1.5">
                {archetype.venueTypes.map((v) => (
                  <li
                    key={v}
                    className="flex items-center gap-2 text-sm text-stone-600"
                  >
                    <span className="text-amber-600">·</span> {v}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 font-playfair font-semibold italic text-stone-900">
                  <span>💐</span> Flores
                </h3>
                <ul className="space-y-1.5">
                  {archetype.flowerSuggestions.map((f) => (
                    <li key={f} className="text-xs text-stone-600">
                      · {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <h3 className="mb-2 font-playfair font-semibold italic text-stone-900">
                  💰 Orçamento
                </h3>
                <p className="text-sm font-semibold text-stone-700">
                  {archetype.budgetRange}
                </p>
                <p className="mt-1 text-xs text-stone-400">estimativa média</p>
              </div>
            </div>
          </div>
        </Section>

        <div className="my-6 h-px w-full bg-stone-200" />

        {/* Vision board */}
        {boardPhotos.length > 0 && (
          <Section>
            <h2 className="mb-4 font-playfair text-lg font-semibold italic text-white">
              Seu moodboard de inspiração
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {boardPhotos.slice(0, 6).map((photo, i) => (
                <motion.div
                  key={photo.id + i}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="aspect-[3/4] overflow-hidden rounded-xl"
                  style={{ backgroundColor: photo.dominantColor }}
                >
                  <img
                    src={photo.thumbUrl}
                    alt={photo.altDescription}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </div>
          </Section>
        )}

        <div className="my-6 h-px w-full bg-stone-200" />

        {/* Liked count */}
        <Section>
          <div className="text-center text-stone-600">
            <p className="font-playfair italic">
              Você amou{" "}
              <span className="font-bold text-stone-900">
                {likedPhotos.length}
              </span>{" "}
              de{" "}
              <span className="font-bold text-stone-900">
                {profile.totalSwipes}
              </span>{" "}
              fotos
            </p>
          </div>
        </Section>

        <div className="my-6" />

        {/* Restart */}
        <Section>
          <div className="text-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => dispatch({ type: "RESET" })}
              className="rounded-full bg-stone-900 px-8 py-3.5 font-semibold text-white shadow-lg transition-shadow hover:shadow-xl"
            >
              Recomeçar do início
            </motion.button>
            <p className="mt-3 text-xs text-stone-400">
              Refaça o quiz para um resultado ainda mais preciso
            </p>
          </div>
        </Section>

        <div className="pb-8" />
      </div>
    </div>
  );
}

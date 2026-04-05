import { motion } from "framer-motion";
import FloatingHearts from "./FloatingHearts";

export default function LoadingScreen() {
  return (
    <div className="relative flex h-dvh flex-col items-center justify-center overflow-hidden bg-stone-950">
      <div className="relative z-10 flex flex-col items-center gap-8 px-8 text-center">
        {/* Ring animation */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-7xl"
        >
          💍
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="font-playfair text-4xl font-bold italic text-white drop-shadow-lg">
            Wedding Tinder
          </h1>
          <p className="mt-2 font-playfair text-lg italic text-stone-300">
            Descubra o casamento dos seus sonhos
          </p>
        </motion.div>

        {/* Loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex gap-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2.5 w-2.5 rounded-full bg-stone-400"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.8 }}
          className="text-sm text-stone-400"
        >
          Buscando inspirações para vocês...
        </motion.p>
      </div>
    </div>
  );
}

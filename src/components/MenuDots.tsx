import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../store/context";
import { MIN_SWIPES } from "./ProgressBar";

export default function MenuDots() {
  const { state, dispatch } = useAppStore();
  const menuRef = useRef<HTMLDivElement>(null);

  const canUndo = state.history.length > 0;
  const canGenerate = state.history.length >= MIN_SWIPES;

  // Close on outside click
  useEffect(() => {
    if (!state.isMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        dispatch({ type: "CLOSE_MENU" });
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [state.isMenuOpen, dispatch]);

  return (
    <div ref={menuRef} className="relative">
      {/* Three-dot button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => dispatch({ type: "TOGGLE_MENU" })}
        className="glass flex h-10 w-10 items-center justify-center rounded-full text-white"
        aria-label="Menu"
        aria-expanded={state.isMenuOpen}
      >
        <span className="flex flex-col gap-[4px] items-center justify-center">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block h-[4px] w-[4px] rounded-full bg-white"
              animate={{ scale: state.isMenuOpen ? 1.2 : 1 }}
              transition={{ delay: i * 0.05 }}
            />
          ))}
        </span>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {state.isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -8 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="absolute right-0 top-12 z-50 w-52 overflow-hidden rounded-2xl bg-white shadow-2xl"
            style={{ transformOrigin: "top right" }}
          >
            {/* Undo */}
            <button
              disabled={!canUndo}
              onClick={() => dispatch({ type: "UNDO" })}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="text-xl">↩</span>
              <div>
                <p className="text-sm font-medium text-gray-800">Desfazer</p>
                <p className="text-xs text-gray-400">Voltar à última foto</p>
              </div>
            </button>

            <div className="mx-4 h-px bg-gray-100" />

            {/* History */}
            <button
              disabled={state.history.length === 0}
              onClick={() => dispatch({ type: "TOGGLE_HISTORY" })}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="text-xl">🖼️</span>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Ver histórico
                </p>
                <p className="text-xs text-gray-400">
                  {state.history.length} foto
                  {state.history.length !== 1 ? "s" : ""} avaliada
                  {state.history.length !== 1 ? "s" : ""}
                </p>
              </div>
            </button>

            <div className="mx-4 h-px bg-gray-100" />

            {/* Generate result */}
            <button
              disabled={!canGenerate}
              onClick={() => dispatch({ type: "GENERATE_RESULT" })}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="text-xl">💍</span>
              <div>
                <p className="text-sm font-medium text-stone-700">
                  Ver meu perfil
                </p>
                <p className="text-xs text-gray-400">
                  {canGenerate
                    ? "Descobrir o casamento ideal"
                    : `Avalie mais ${MIN_SWIPES - state.history.length} foto${MIN_SWIPES - state.history.length !== 1 ? "s" : ""}`}
                </p>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

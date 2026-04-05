import { motion } from "framer-motion";

const MIN_SWIPES = 10;
const IDEAL_SWIPES = 25;

interface Props {
  swipeCount: number;
}

export default function ProgressBar({ swipeCount }: Props) {
  const pct = Math.min((swipeCount / IDEAL_SWIPES) * 100, 100);
  const isReady = swipeCount >= MIN_SWIPES;

  return (
    <div className="w-full px-5 pt-1">
      <div className="flex items-center justify-between pb-1">
        <span className="text-xs text-white/50">
          {swipeCount} foto{swipeCount !== 1 ? "s" : ""} avaliada
          {swipeCount !== 1 ? "s" : ""}
        </span>
        {isReady ? (
          <span className="text-xs text-emerald-400">
            Perfil desbloqueado ✓
          </span>
        ) : (
          <span className="text-xs text-stone-300/60">
            mais {MIN_SWIPES - swipeCount} para desbloquear
          </span>
        )}
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className={`h-full rounded-full ${isReady ? "bg-emerald-400" : "bg-amber-400"}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}

export { MIN_SWIPES };

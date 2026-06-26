"use client";

import { motion } from "framer-motion";
import { Clock, DollarSign, MapPin, Navigation, Sparkles } from "lucide-react";

interface HiddenGemCardProps {
  spot: {
    id: string;
    name: string;
    description: string;
    reason: string;
    bestTime: string;
    estimatedTime: string;
    cost: string;
    nearbySpots: string[];
    imageColor?: string;
    imageUrl?: string;
    tags?: string[];
    city?: string;
  };
  index: number;
  isActive: boolean;
  onClick: () => void;
}

export default function HiddenGemCard({
  spot,
  index,
  isActive,
  onClick,
}: HiddenGemCardProps) {
  const fallbackColor = spot.imageColor || "#6B7B8D";

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onClick={onClick}
      className={`glass-sm p-5 cursor-pointer transition-all duration-300 ${
        isActive
          ? "border-[#4F8EF7] shadow-lg shadow-[#4F8EF7]/10 scale-[1.02]"
          : "hover:border-[var(--color-border)]"
      }`}
    >
      {/* Image */}
      <div className="w-full h-36 rounded-xl mb-4 relative overflow-hidden">
        {spot.imageUrl ? (
          <img
            src={spot.imageUrl}
            alt={spot.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              (e.target as HTMLImageElement).parentElement!.style.background = `linear-gradient(135deg, ${fallbackColor}88, ${fallbackColor}44)`;
            }}
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, ${fallbackColor}88, ${fallbackColor}44)`,
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        {!spot.imageUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <MapPin size={32} className="text-white/80" />
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md rounded-full px-2.5 py-1 text-xs text-white font-medium">
          <Sparkles size={12} className="inline mr-1" />
          Secret
        </div>
      </div>

      <h3 className="font-bold text-[var(--color-text-primary)] mb-1.5">
        {spot.name}
        {spot.city && <span className="text-xs font-normal text-[var(--color-text-secondary)] ml-2">{spot.city}</span>}
      </h3>
      <p className="text-xs text-[var(--color-text-secondary)] mb-3 line-clamp-2">
        {spot.description}
      </p>

      {/* Tags */}
      {spot.tags && spot.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {spot.tags.slice(0, 3).map((t) => (
            <span key={t} className="px-2 py-0.5 text-[10px] rounded-full bg-[var(--color-border)] text-[var(--color-text-secondary)]">
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
        <span className="flex items-center gap-1">
          <Clock size={12} />
          {spot.estimatedTime}
        </span>
        <span className="flex items-center gap-1">
          <DollarSign size={12} />
          {spot.cost}
        </span>
      </div>

      {isActive && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 pt-3 border-t border-[var(--color-border)]"
        >
          <p className="text-xs text-[var(--color-text-secondary)] mb-2">
            <span className="font-medium text-[#7ED6C2]">推荐理由：</span>
            {spot.reason}
          </p>
          <p className="text-xs text-[var(--color-text-secondary)] mb-2">
            <span className="font-medium text-[#4F8EF7]">最佳时间：</span>
            {spot.bestTime}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {spot.nearbySpots.map((n) => (
              <span
                key={n}
                className="px-2 py-0.5 text-xs rounded-full bg-[#7ED6C2]/12 text-[#7ED6C2]"
              >
                <Navigation size={10} className="inline mr-1" />
                {n}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

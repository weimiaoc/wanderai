"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin, Heart, Star, Clock, DollarSign } from "lucide-react";
import { Destination } from "../lib/recommendation";
import { isFavorited, toggleFavorite } from "../lib/storage";
import { useState, useEffect } from "react";
import { calculateBudget } from "../lib/budget";
import SafeImage from "./SafeImage";

interface DestinationCardProps {
  destination: Destination;
  index: number;
  onClick?: () => void;
}

export default function DestinationCard({
  destination,
  index,
  onClick,
}: DestinationCardProps) {
  const [fav, setFav] = useState(false);

  const budget = useMemo(
    () => calculateBudget(destination.name, 5, 1, "classic"),
    [destination.name]
  );

  useEffect(() => {
    setFav(isFavorited(destination.id));
  }, [destination.id]);

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    const result = toggleFavorite({
      id: destination.id,
      name: destination.name,
      favoritedAt: new Date().toISOString(),
    });
    setFav(result);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="glass card-hover p-6 cursor-pointer relative overflow-hidden group"
    >
      {/* Gradient Bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5"
        style={{ background: destination.imageGradient }}
      />

      {/* Image */}
      <div className="w-full h-40 rounded-xl mb-4 overflow-hidden">
        <SafeImage
          src={`https://picsum.photos/400/320?random=40${index}`}
          alt={destination.name}
          className="w-full h-full object-cover"
          fallbackText={destination.name.slice(0, 1)}
        />
      </div>

      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
            {destination.name}
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)]">
            {destination.country} · {destination.region}
          </p>
        </div>
        <button
          onClick={handleFav}
          className={`p-2 rounded-xl transition-all ${
            fav
              ? "text-red-400 bg-red-400/10"
              : "text-[var(--color-text-secondary)] hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100"
          }`}
        >
          <Heart size={18} fill={fav ? "currentColor" : "none"} />
        </button>
      </div>

      <p className="text-sm text-[var(--color-text-secondary)] mb-4 line-clamp-2">
        {destination.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {destination.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 text-xs rounded-full bg-[#4F8EF7]/8 text-[#4F8EF7] font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-1 text-sm font-semibold gradient-text">
          <DollarSign size={14} />
          ¥{budget.perPerson[0].toLocaleString()}-{budget.perPerson[1].toLocaleString()}
        </div>
        <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)]">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {destination.tripLength.min}-{destination.tripLength.ideal}天
          </span>
          <span className="flex items-center gap-1">
            <Star size={12} className="text-[#F59E0B]" />
            {destination.matchScore}
          </span>
        </div>
      </div>

      {destination.reasons.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-text-secondary)]">
            {destination.reasons[0]}
          </p>
        </div>
      )}
    </motion.div>
  );
}

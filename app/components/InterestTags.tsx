"use client";

import { motion } from "framer-motion";
import {
  Camera,
  UtensilsCrossed,
  Trees,
  Landmark,
  Coffee,
  Footprints,
  Moon,
  Building2,
  ShoppingBag,
  Tent,
  Waves,
  Castle,
} from "lucide-react";

interface InterestTagsProps {
  selected: string[];
  onChange: (interests: string[]) => void;
}

const allInterests = [
  { id: "摄影", icon: Camera },
  { id: "美食", icon: UtensilsCrossed },
  { id: "自然风光", icon: Trees },
  { id: "历史文化", icon: Landmark },
  { id: "咖啡馆", icon: Coffee },
  { id: "City Walk", icon: Footprints },
  { id: "夜景", icon: Moon },
  { id: "博物馆", icon: Building2 },
  { id: "购物", icon: ShoppingBag },
  { id: "露营", icon: Tent },
  { id: "海边", icon: Waves },
  { id: "古镇", icon: Castle },
];

export default function InterestTags({ selected, onChange }: InterestTagsProps) {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {allInterests.map((interest) => {
        const isActive = selected.includes(interest.id);
        return (
          <motion.button
            key={interest.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggle(interest.id)}
            className={`tag flex items-center gap-1.5 ${
              isActive ? "tag-active" : "tag-inactive"
            }`}
          >
            <interest.icon size={15} />
            {interest.id}
          </motion.button>
        );
      })}
    </div>
  );
}

export { allInterests };

"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Users,
  Calendar,
  Wallet,
  Sparkles,
  Play,
  ArrowRight,
  Compass,
} from "lucide-react";
import InterestTags from "./InterestTags";
import type { TravelStyle } from "../lib/recommendation";

interface PlannerInputProps {
  departureCity: string;
  setDepartureCity: (v: string) => void;
  budget: number;
  setBudget: (v: number) => void;
  days: number;
  setDays: (v: number) => void;
  travelers: number;
  setTravelers: (v: number) => void;
  interests: string[];
  setInterests: (v: string[]) => void;
  onGenerate: () => void;
  onDemo: () => void;
  isCompact?: boolean;
  maxDays?: number;
  travelStyle: TravelStyle;
  setTravelStyle: (v: TravelStyle) => void;
}

const cities = [
  "北京",
  "上海",
  "广州",
  "深圳",
  "杭州",
  "成都",
  "重庆",
  "南京",
  "西安",
  "苏州",
  "长沙",
  "青岛",
  "厦门",
  "昆明",
  "大理",
  "丽江",
  "哈尔滨",
  "三亚",
];

const styleOptions: { id: TravelStyle; label: string; emoji: string }[] = [
  { id: "classic", label: "经典打卡", emoji: "" },
  { id: "food", label: "美食探索", emoji: "" },
  { id: "nature", label: "自然风光", emoji: "" },
  { id: "culture", label: "历史文化", emoji: "" },
  { id: "family", label: "亲子家庭", emoji: "" },
];

export default function PlannerInput({
  departureCity,
  setDepartureCity,
  budget,
  setBudget,
  days,
  setDays,
  travelers,
  setTravelers,
  interests,
  setInterests,
  onGenerate,
  onDemo,
  isCompact = false,
  maxDays = 5,
  travelStyle,
  setTravelStyle,
}: PlannerInputProps) {
  const inputVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
    }),
  };

  if (isCompact) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
              出发城市
            </label>
            <select
              value={departureCity}
              onChange={(e) => setDepartureCity(e.target.value)}
              className="input-field text-sm"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
              旅行天数
            </label>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="input-field text-sm"
            >
              {Array.from({ length: maxDays }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {d} 天
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
              同行人数
            </label>
            <select
              value={travelers}
              onChange={(e) => setTravelers(Number(e.target.value))}
              className="input-field text-sm"
            >
              {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} 人
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
              预算 ¥{budget}
            </label>
            <input
              type="range"
              min={500}
              max={10000}
              step={100}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2 bg-[var(--color-border)] rounded-lg appearance-none cursor-pointer accent-[#4F8EF7]"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2">
            兴趣偏好
          </label>
          <InterestTags selected={interests} onChange={setInterests} />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
            旅行风格
          </label>
          <div className="flex flex-wrap gap-1.5">
            {styleOptions.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setTravelStyle(s.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  travelStyle === s.id
                    ? "bg-[#4F8EF7] text-white"
                    : "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]"
                }`}
              >
                {s.emoji} {s.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onGenerate} className="btn-primary flex-1 flex items-center justify-center gap-2">
            <Sparkles size={18} /> 生成旅行方案
          </button>
          <button
            onClick={onDemo}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <Play size={16} /> 演示案例
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="glass p-8 md:p-10 max-w-2xl w-full mx-auto space-y-6"
    >
      {/* Departure + Days + Travelers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div variants={inputVariants} custom={0}>
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            <MapPin size={16} className="text-[#4F8EF7]" />
            出发城市
          </label>
          <select
            value={departureCity}
            onChange={(e) => setDepartureCity(e.target.value)}
            className="input-field"
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </motion.div>
        <motion.div variants={inputVariants} custom={1}>
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            <Calendar size={16} className="text-[#7ED6C2]" />
            旅行天数
          </label>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="input-field"
          >
            {Array.from({ length: maxDays }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {d} 天
              </option>
            ))}
          </select>
        </motion.div>
        <motion.div variants={inputVariants} custom={2}>
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            <Users size={16} className="text-[#FFB4A2]" />
            同行人数
          </label>
          <select
            value={travelers}
            onChange={(e) => setTravelers(Number(e.target.value))}
            className="input-field"
          >
            {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} 人
              </option>
            ))}
          </select>
        </motion.div>
      </div>

      {/* Budget Slider */}
      <motion.div variants={inputVariants} custom={3}>
        <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] mb-3">
          <Wallet size={16} className="text-[#7ED6C2]" />
          预算范围
          <span className="ml-auto text-lg font-bold gradient-text">
            ¥{budget.toLocaleString()}
          </span>
        </label>
        <div className="relative">
          <input
            type="range"
            min={500}
            max={10000}
            step={100}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full h-2 bg-[var(--color-border)] rounded-lg appearance-none cursor-pointer accent-[#4F8EF7]"
          />
          <div className="flex justify-between text-xs text-[var(--color-text-secondary)] mt-1">
            <span>¥500</span>
            <span>¥10,000</span>
          </div>
        </div>
      </motion.div>

      {/* Interests */}
      <motion.div variants={inputVariants} custom={4}>
        <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] mb-3">
          <Sparkles size={16} className="text-[#FFB4A2]" />
          兴趣偏好（多选）
        </label>
        <InterestTags selected={interests} onChange={setInterests} />
      </motion.div>

      {/* Travel Style */}
      <motion.div variants={inputVariants} custom={5}>
        <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] mb-3">
          <Compass size={16} className="text-[#7B68EE]" />
          旅行风格
        </label>
        <div className="flex flex-wrap gap-2">
          {styleOptions.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setTravelStyle(s.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                travelStyle === s.id
                  ? "bg-[#4F8EF7] text-white shadow-md"
                  : "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]"
              }`}
            >
              {s.emoji} {s.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Buttons */}
      <motion.div
        variants={inputVariants}
        custom={6}
        className="flex flex-col sm:flex-row gap-3 pt-2"
      >
        <button
          onClick={onGenerate}
          className="btn-primary flex-1 flex items-center justify-center gap-2 group"
        >
          <Sparkles size={20} />
          生成旅行方案
          <ArrowRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
        <button
          onClick={onDemo}
          className="btn-secondary flex items-center justify-center gap-2"
        >
          <Play size={18} />
          演示案例
        </button>
      </motion.div>
    </motion.div>
  );
}

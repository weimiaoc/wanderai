"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import DestinationCard from "../components/DestinationCard";
import PlannerInput from "../components/PlannerInput";
import {
  TravelPreferences,
  getRecommendations,
  getMaxDays,
  destinations,
  Destination,
  TravelStyle,
} from "../lib/recommendation";
import { Sparkles } from "lucide-react";

function PlannerContent() {
  const searchParams = useSearchParams();

  const [preferences, setPreferences] = useState<TravelPreferences>({
    departureCity: "上海", budget: 3000, days: 5, travelers: 1,
    interests: [], pace: "balanced", travelStyle: "classic",
  });
  const [generated, setGenerated] = useState(false);
  const [results, setResults] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [pace, setPace] = useState<"relaxed" | "balanced" | "intensive">("balanced");
  const [travelStyle, setTravelStyle] = useState<TravelStyle>("classic");

  const maxDays = useMemo(() => {
    const d = destinations.find((x) => x.name === preferences.departureCity);
    return d?.tripLength.max || 5;
  }, [preferences.departureCity]);

  useEffect(() => {
    if (preferences.days > maxDays) setPreferences((p) => ({ ...p, days: maxDays }));
  }, [maxDays, preferences.days]);

  useEffect(() => {
    const city = searchParams.get("city");
    const budget = searchParams.get("budget");
    const days = searchParams.get("days");
    const travelers = searchParams.get("travelers");
    const interests = searchParams.get("interests");
    const sPace = searchParams.get("pace") as "relaxed" | "balanced" | "intensive";
    const sStyle = searchParams.get("style") as TravelStyle;
    const isDemo = searchParams.get("demo");
    if (city || isDemo) {
      const p: TravelPreferences = {
        departureCity: city || "上海",
        budget: Number(budget) || 2000,
        days: Number(days) || 2,
        travelers: Number(travelers) || 1,
        interests: interests ? interests.split(",").filter(Boolean) : [],
        pace: sPace || "balanced",
        travelStyle: sStyle || "classic",
      };
      setPreferences(p);
      if (sPace) setPace(sPace);
      if (sStyle) setTravelStyle(sStyle);
      generateResults(p, sPace || "balanced", sStyle || "classic");
    }
  }, [searchParams]);

  const generateResults = (prefs: TravelPreferences, cPace: string, cStyle?: TravelStyle) => {
    setLoading(true);
    setTimeout(() => {
      const style = cStyle || travelStyle || "classic";
      const pw = { ...prefs, pace: cPace as "relaxed" | "balanced" | "intensive", travelStyle: style };
      const recs = getRecommendations(pw);
      setResults(recs);
      setGenerated(true);
      setLoading(false);
    }, 1200);
  };

  const handleGenerate = () => {
    const p = { ...preferences, travelStyle };
    generateResults(p, pace, travelStyle);
  };

  const handleDemo = () => {
    const dp: TravelPreferences = {
      departureCity: "上海", budget: 2000, days: 2, travelers: 1,
      interests: ["咖啡馆", "摄影", "City Walk"], pace: "balanced", travelStyle: "classic",
    };
    setPreferences(dp);
    setPace("balanced");
    setTravelStyle("classic");
    generateResults(dp, "balanced", "classic");
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />
      <div className="pt-24 pb-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F8EF7] to-[#7ED6C2] flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">AI 旅行规划</h1>
              <p className="text-sm text-[var(--color-text-secondary)]">智能推荐 · 个性化路线 · 预算分析</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-4">
            <div className="sticky top-24">
              <div className="glass p-6 space-y-5">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Sparkles size={18} className="text-[#4F8EF7]" />旅行偏好
                </h2>
                <PlannerInput
                  cityName={preferences.departureCity}
                  departureCity={preferences.departureCity}
                  setDepartureCity={(v) => setPreferences({ ...preferences, departureCity: v })}
                  budget={preferences.budget}
                  setBudget={(v) => setPreferences({ ...preferences, budget: v })}
                  days={preferences.days}
                  setDays={(v) => setPreferences({ ...preferences, days: v })}
                  travelers={preferences.travelers}
                  setTravelers={(v) => setPreferences({ ...preferences, travelers: v })}
                  interests={preferences.interests}
                  setInterests={(v) => setPreferences({ ...preferences, interests: v })}
                  onGenerate={handleGenerate}
                  onDemo={handleDemo}
                  isCompact
                  maxDays={maxDays}
                  travelStyle={travelStyle}
                  setTravelStyle={setTravelStyle}
                />
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2">旅行节奏</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "relaxed" as const, label: "慢旅行", desc: "深度体验" },
                      { id: "balanced" as const, label: "平衡", desc: "劳逸结合" },
                      { id: "intensive" as const, label: "特种兵", desc: "打卡高效" },
                    ].map((p) => (
                      <button
                        key={p.id}
                        onClick={() => { setPace(p.id); setPreferences({ ...preferences, pace: p.id }); }}
                        className={`p-3 rounded-xl text-center transition-all ${
                          pace === p.id
                            ? "bg-gradient-to-br from-[#4F8EF7]/15 to-[#7ED6C2]/15 border border-[#4F8EF7]/30 text-[#4F8EF7]"
                            : "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[#4F8EF7]/20"
                        }`}
                      >
                        <div className="text-sm font-semibold">{p.label}</div>
                        <div className="text-xs opacity-70">{p.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Results */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {!generated && !loading && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#4F8EF7]/10 to-[#7ED6C2]/10 flex items-center justify-center mx-auto mb-4">
                      <Sparkles size={36} className="text-[#4F8EF7]/40" />
                    </div>
                    <p className="text-[var(--color-text-secondary)]">调整左侧偏好后点击「生成旅行方案」</p>
                  </div>
                </motion.div>
              )}
              {loading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-16 h-16 rounded-full border-2 border-[#4F8EF7]/30 border-t-[#4F8EF7] mx-auto mb-4" />
                    <p className="text-[var(--color-text-secondary)]">AI 正在为你生成旅行方案...</p>
                  </div>
                </motion.div>
              )}
              {generated && results.length > 0 && (
                <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">
                      为你推荐 {results.length} 个目的地
                    </h3>
                    <p className="text-xs text-[var(--color-text-secondary)] mb-4">
                      点击城市卡片查看完整的概览、行程与预算详情
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {results.map((dest, i) => (
                        <a key={dest.id} href={`/city/${dest.id}`} className="block">
                          <DestinationCard destination={dest} index={i} />
                        </a>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}

import { Suspense } from "react";

export default function PlannerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-[#4F8EF7]/30 border-t-[#4F8EF7] animate-spin" />
        </div>
      }
    >
      <PlannerContent />
    </Suspense>
  );
}

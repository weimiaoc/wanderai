"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import DestinationCard from "../components/DestinationCard";
import PlannerInput from "../components/PlannerInput";
import {
  TravelPreferences,
  getRecommendations,
  generateDailyPlan,
  getMaxDays,
  destinations,
  Destination,
  DayPlan,
  TravelStyle,
} from "../lib/recommendation";
import { saveTrip, SavedTrip } from "../lib/storage";
import {
  Sparkles,
  MapPin,
  Clock,
  Wallet,
  ArrowRight,
  BarChart3,
  Download,
  Heart,
  ChevronRight,
  Sunrise,
  Train,
  Coffee,
  UtensilsCrossed,
  Camera,
  Moon,
  Footprints,
  Calendar,
  Plane,
  Check,
  Navigation,
} from "lucide-react";

function PlannerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [preferences, setPreferences] = useState<TravelPreferences>({
    departureCity: "上海",
    budget: 2000,
    days: 2,
    travelers: 1,
    interests: [],
    pace: "balanced",
    travelStyle: "classic",
  });
  const [generated, setGenerated] = useState(false);
  const [results, setResults] = useState<Destination[]>([]);
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [dailyPlan, setDailyPlan] = useState<DayPlan[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "plan" | "budget">(
    "overview"
  );
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pace, setPace] = useState<"relaxed" | "balanced" | "intensive">(
    "balanced"
  );
  const [travelStyle, setTravelStyle] = useState<TravelStyle>("classic");

  // Derive max days for the selected departure city
  const maxDays = useMemo(() => {
    const dest = destinations.find(
      (d) => d.name === preferences.departureCity
    );
    return dest?.tripLength.max || 5;
  }, [preferences.departureCity]);

  // Clamp days when city changes
  useEffect(() => {
    if (preferences.days > maxDays) {
      setPreferences((prev) => ({ ...prev, days: maxDays }));
    }
  }, [maxDays, preferences.days]);

  useEffect(() => {
    const city = searchParams.get("city");
    const budget = searchParams.get("budget");
    const days = searchParams.get("days");
    const travelers = searchParams.get("travelers");
    const interests = searchParams.get("interests");
    const searchPace = searchParams.get("pace") as "relaxed" | "balanced" | "intensive";
    const searchStyle = searchParams.get("style") as TravelStyle;
    const isDemo = searchParams.get("demo");

    if (city || isDemo) {
      const prefs: TravelPreferences = {
        departureCity: city || "上海",
        budget: Number(budget) || 2000,
        days: Number(days) || 2,
        travelers: Number(travelers) || 1,
        interests: interests ? interests.split(",").filter(Boolean) : [],
        pace: searchPace || "balanced",
        travelStyle: searchStyle || "classic",
      };
      setPreferences(prefs);
      if (searchPace) setPace(searchPace);
      if (searchStyle) setTravelStyle(searchStyle);
      generateResults(prefs, searchPace || "balanced");
    }
  }, [searchParams]);

  const generateResults = (
    prefs: TravelPreferences,
    currentPace: string
  ) => {
    setLoading(true);
    setTimeout(() => {
      const prefsWithPace = { ...prefs, pace: currentPace as "relaxed" | "balanced" | "intensive", travelStyle: travelStyle || prefs.travelStyle || "classic" };
      const recs = getRecommendations(prefsWithPace);
      setResults(recs);
      if (recs.length > 0) {
        setSelectedDest(recs[0]);
        const plan = generateDailyPlan(recs[0], prefsWithPace);
        setDailyPlan(plan);
      }
      setGenerated(true);
      setLoading(false);
    }, 1200);
  };

  const handleGenerate = () => {
    const prefs = { ...preferences, travelStyle };
    generateResults(prefs, pace);
  };

  const handleDemo = () => {
    const demoPrefs: TravelPreferences = {
      departureCity: "上海",
      budget: 2000,
      days: 2,
      travelers: 1,
      interests: ["咖啡馆", "摄影", "City Walk"],
      pace: "balanced",
      travelStyle: "classic",
    };
    setPreferences(demoPrefs);
    setPace("balanced");
    setTravelStyle("classic");
    generateResults(demoPrefs, "balanced");
  };

  const handleSave = () => {
    if (!selectedDest) return;
    const trip: SavedTrip = {
      id: `trip-${Date.now()}`,
      name: `${selectedDest.name}之旅`,
      destination: selectedDest.name,
      departureCity: preferences.departureCity,
      budget: preferences.budget,
      days: preferences.days,
      travelers: preferences.travelers,
      interests: preferences.interests,
      pace,
      createdAt: new Date().toISOString(),
      plan: { destination: selectedDest, dailyPlan },
    };
    saveTrip(trip);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "transport":
        return <Train size={16} />;
      case "sight":
        return <Camera size={16} />;
      case "food":
        return <UtensilsCrossed size={16} />;
      case "cafe":
        return <Coffee size={16} />;
      case "rest":
        return <Moon size={16} />;
      default:
        return <MapPin size={16} />;
    }
  };

  const totalPlanCost = dailyPlan.reduce(
    (sum, day) =>
      sum + (day.activities || []).reduce((s, a) => s + a.cost, 0),
    0
  );

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />

      {/* Page Header */}
      <div className="pt-24 pb-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F8EF7] to-[#7ED6C2] flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">
                AI 旅行规划
              </h1>
              <p className="text-sm text-[var(--color-text-secondary)]">
                智能推荐 · 个性化路线 · 预算分析
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left - Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4"
          >
            <div className="sticky top-24">
              <div className="glass p-6 space-y-5">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Sparkles size={18} className="text-[#4F8EF7]" />
                  旅行偏好
                </h2>
                <PlannerInput
                  departureCity={preferences.departureCity}
                  setDepartureCity={(v) =>
                    setPreferences({ ...preferences, departureCity: v })
                  }
                  budget={preferences.budget}
                  setBudget={(v) =>
                    setPreferences({ ...preferences, budget: v })
                  }
                  days={preferences.days}
                  setDays={(v) => setPreferences({ ...preferences, days: v })}
                  travelers={preferences.travelers}
                  setTravelers={(v) =>
                    setPreferences({ ...preferences, travelers: v })
                  }
                  interests={preferences.interests}
                  setInterests={(v) =>
                    setPreferences({ ...preferences, interests: v })
                  }
                  onGenerate={handleGenerate}
                  onDemo={handleDemo}
                  isCompact
                  maxDays={maxDays}
                  travelStyle={travelStyle}
                  setTravelStyle={setTravelStyle}
                />

                {/* Pace Selector */}
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2">
                    旅行节奏
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        id: "relaxed" as const,
                        label: "慢旅行",
                        desc: "深度体验",
                      },
                      {
                        id: "balanced" as const,
                        label: "平衡",
                        desc: "劳逸结合",
                      },
                      {
                        id: "intensive" as const,
                        label: "特种兵",
                        desc: "打卡高效",
                      },
                    ].map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setPace(p.id);
                          setPreferences({ ...preferences, pace: p.id });
                        }}
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
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center h-96"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#4F8EF7]/10 to-[#7ED6C2]/10 flex items-center justify-center mx-auto mb-4">
                      <Sparkles size={36} className="text-[#4F8EF7]/40" />
                    </div>
                    <p className="text-[var(--color-text-secondary)]">
                      调整左侧偏好后点击「生成旅行方案」
                    </p>
                  </div>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center h-96"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 rounded-full border-2 border-[#4F8EF7]/30 border-t-[#4F8EF7] mx-auto mb-4"
                    />
                    <p className="text-[var(--color-text-secondary)]">
                      AI 正在为你生成旅行方案...
                    </p>
                  </div>
                </motion.div>
              )}

              {generated && results.length > 0 && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Destination Cards */}
                  <div>
                    <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">
                      为你推荐 {results.length} 个目的地
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {results.map((dest, i) => (
                        <div
                          key={dest.id}
                          onClick={() => {
                            setSelectedDest(dest);
                            setDailyPlan(generateDailyPlan(dest, preferences));
                          }}
                          className={selectedDest?.id === dest.id ? "ring-2 ring-[#4F8EF7] rounded-[20px]" : ""}
                        >
                          <DestinationCard destination={dest} index={i} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Selected Destination Detail */}
                  {selectedDest && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {/* Tabs */}
                      <div className="flex gap-2 mb-6">
                        {[
                          { id: "overview" as const, label: "概览" },
                          { id: "plan" as const, label: "行程" },
                          { id: "budget" as const, label: "预算" },
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                              activeTab === tab.id
                                ? "bg-[#4F8EF7] text-white shadow-lg shadow-[#4F8EF7]/25"
                                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]"
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      {/* Tab Content */}
                      {activeTab === "overview" && (
                        <div className="space-y-6">
                          {/* Destination Header */}
                          <div className="glass p-6">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg"
                                    style={{
                                      background: selectedDest.imageGradient,
                                    }}
                                  >
                                    {selectedDest.name[0]}
                                  </div>
                                  <div>
                                    <h3 className="text-xl font-bold">
                                      {selectedDest.name}
                                    </h3>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                      {selectedDest.country} · {selectedDest.region}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-[var(--color-text-secondary)] mt-3">
                                  {selectedDest.description}
                                </p>
                              </div>
                              <button
                                onClick={handleSave}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                  saved
                                    ? "bg-green-500 text-white"
                                    : "btn-secondary"
                                }`}
                              >
                                {saved ? (
                                  <span className="flex items-center gap-1">
                                    <Check size={16} /> 已保存
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1">
                                    <Heart size={16} /> 保存
                                  </span>
                                )}
                              </button>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mt-6">
                              <div className="text-center p-3 rounded-xl bg-[var(--color-border)]">
                                <Clock size={16} className="mx-auto mb-1 text-[#4F8EF7]" />
                                <div className="text-xs text-[var(--color-text-secondary)]">
                                  最佳季节
                                </div>
                                <div className="text-sm font-semibold mt-0.5">
                                  {selectedDest.bestSeason}
                                </div>
                              </div>
                              <div className="text-center p-3 rounded-xl bg-[var(--color-border)]">
                                <Wallet size={16} className="mx-auto mb-1 text-[#7ED6C2]" />
                                <div className="text-xs text-[var(--color-text-secondary)]">
                                  预计花费
                                </div>
                                <div className="text-sm font-semibold gradient-text mt-0.5">
                                  ¥{selectedDest.estimatedCost.total.toLocaleString()}
                                </div>
                              </div>
                              <div className="text-center p-3 rounded-xl bg-[var(--color-border)]">
                                <Calendar size={16} className="mx-auto mb-1 text-[#FFB4A2]" />
                                <div className="text-xs text-[var(--color-text-secondary)]">
                                  建议天数
                                </div>
                                <div className="text-sm font-semibold mt-0.5">
                                  {selectedDest.tripLength.min}-{selectedDest.tripLength.ideal}天
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Reasons */}
                          <div className="glass p-6">
                            <h4 className="font-bold mb-3">推荐理由</h4>
                            <div className="space-y-2">
                              {selectedDest.reasons.map((r, i) => (
                                <div
                                  key={i}
                                  className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]"
                                >
                                  <Check
                                    size={16}
                                    className="text-[#7ED6C2] mt-0.5 shrink-0"
                                  />
                                  {r}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === "plan" && (
                        <div className="space-y-4">
                          {dailyPlan.map((day, i) => (
                            <motion.div
                              key={day.day}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="glass p-6"
                            >
                              <div className="flex items-center gap-2 mb-5">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F8EF7] to-[#7ED6C2] flex items-center justify-center text-white font-bold text-sm">
                                  {day.day}
                                </div>
                                <h4 className="font-bold">{day.title}</h4>
                              </div>
                              <div className="relative pl-5">
                                <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-[var(--color-border)]" />
                                {(day.activities || []).map((act, j) => (
                                  <div
                                    key={j}
                                    className="relative pb-5 last:pb-0"
                                  >
                                    <div className="absolute -left-[27px] top-1 w-[14px] h-[14px] rounded-full bg-[var(--color-bg)] border-2 border-[#4F8EF7] flex items-center justify-center">
                                      <div
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{ backgroundColor: "#4F8EF7" }}
                                      />
                                    </div>
                                    <div className="flex items-start gap-3">
                                      <span className="text-xs font-mono text-[#4F8EF7] mt-0.5 min-w-[45px]">
                                        {act.time}
                                      </span>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-0.5">
                                          <span className="p-1 rounded-md bg-[var(--color-border)]">
                                            {getActivityIcon(act.type)}
                                          </span>
                                          <span className="font-medium text-sm">
                                            {act.name}
                                          </span>
                                          <span className="text-xs text-[#7ED6C2] font-medium">
                                            ¥{act.cost}
                                          </span>
                                        </div>
                                        <p className="text-xs text-[var(--color-text-secondary)] ml-9">
                                          {act.description} · {act.duration}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {activeTab === "budget" && (
                        <div className="space-y-6">
                          {/* Budget Chart */}
                          <div className="glass p-6">
                            <h4 className="font-bold mb-4 flex items-center gap-2">
                              <BarChart3 size={18} className="text-[#4F8EF7]" />
                              预算分析
                            </h4>
                            <div className="space-y-4">
                              {[
                                {
                                  label: "交通",
                                  value: selectedDest.estimatedCost.transport,
                                  color: "#4F8EF7",
                                  icon: Plane,
                                },
                                {
                                  label: "住宿",
                                  value:
                                    selectedDest.estimatedCost.accommodation,
                                  color: "#7ED6C2",
                                  icon: Moon,
                                },
                                {
                                  label: "餐饮",
                                  value: selectedDest.estimatedCost.food,
                                  color: "#FFB4A2",
                                  icon: UtensilsCrossed,
                                },
                                {
                                  label: "门票/活动",
                                  value: selectedDest.estimatedCost.activities,
                                  color: "#8B5CF6",
                                  icon: Footprints,
                                },
                                {
                                  label: "购物/其他",
                                  value: selectedDest.estimatedCost.shopping,
                                  color: "#F59E0B",
                                  icon: ShoppingIcon,
                                },
                              ].map((item) => {
                                const pct = Math.round(
                                  (item.value /
                                    selectedDest.estimatedCost.total) *
                                    100
                                );
                                return (
                                  <div key={item.label}>
                                    <div className="flex items-center justify-between mb-1.5">
                                      <span className="text-sm flex items-center gap-2">
                                        <item.icon
                                          size={14}
                                          style={{ color: item.color }}
                                        />
                                        {item.label}
                                      </span>
                                      <span className="text-sm font-semibold">
                                        ¥{item.value.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${pct}%` }}
                                        transition={{
                                          duration: 1,
                                          ease: "easeOut",
                                        }}
                                        className="h-full rounded-full"
                                        style={{
                                          background: `linear-gradient(90deg, ${item.color}, ${item.color}88)`,
                                        }}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="mt-6 pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
                              <span className="font-bold">总计</span>
                              <span className="text-xl font-bold gradient-text">
                                ¥{selectedDest.estimatedCost.total.toLocaleString()}
                              </span>
                            </div>
                            <p className="text-xs text-[var(--color-text-secondary)] mt-2">
                              此预算为 {preferences.days} 天 {preferences.travelers} 人估算，实际花费可能因季节和消费习惯略有浮动
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}

function ShoppingIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

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

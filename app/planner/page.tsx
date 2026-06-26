"use client";

import { useState, useEffect, useMemo, Suspense, useRef } from "react";
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
import { calculateBudget, BudgetResult, BudgetBreakdown } from "../lib/budget";
import {
  Sparkles,
  MapPin,
  Clock,
  Wallet,
  BarChart3,
  Heart,
  Train,
  Coffee,
  UtensilsCrossed,
  Camera,
  Moon,
  Footprints,
  Calendar,
  Plane,
  Check,
  CloudSun,
  Users,
  Tag,
} from "lucide-react";

// ----- Budget Ring Chart (Pure SVG) -----
function BudgetRing({ breakdown, totalMin, totalMax }: { breakdown: BudgetBreakdown; totalMin: number; totalMax: number }) {
  const items = [
    { label: "交通", value: breakdown.transport, color: "#4F8EF7" },
    { label: "住宿", value: breakdown.accommodation, color: "#7ED6C2" },
    { label: "餐饮", value: breakdown.meals, color: "#FFB4A2" },
    { label: "景点", value: breakdown.attractions, color: "#8B5CF6" },
    { label: "市内交通", value: breakdown.localTransport, color: "#F59E0B" },
  ];
  const total = items.reduce((s, i) => s + (i.value[0] + i.value[1]) / 2, 0);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const gap = 4;
  const gapLen = (gap / 360) * circumference;
  let offset = 0;
  const segments = items.map((item) => {
    const pct = ((item.value[0] + item.value[1]) / 2) / total;
    const len = Math.max(pct * circumference - gapLen, 1);
    const seg = { ...item, dash: `${len} ${circumference - len}`, off: -offset };
    offset += len + gapLen;
    return seg;
  });

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
      <div className="relative w-36 h-36 shrink-0">
        <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
          {segments.map((seg, i) => (
            <circle key={i} cx="70" cy="70" r={radius} fill="none" stroke={seg.color} strokeWidth="16" strokeDasharray={seg.dash} strokeDashoffset={seg.off} strokeLinecap="butt" className="transition-all duration-700" />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-[var(--color-text-primary)]">¥{((totalMin + totalMax) / 2).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          <span className="text-[10px] text-[var(--color-text-secondary)]">人均预估</span>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-1 gap-2 text-xs">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-[var(--color-text-secondary)]">{item.label}</span>
            </div>
            <span className="font-medium tabular-nums">¥{item.value[0].toLocaleString()} - ¥{item.value[1].toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ----- Progress bar for budget items -----
function BudgetBar({ label, value, total, color, icon: Icon }: { label: string; value: [number, number]; total: number; color: string; icon: React.ElementType }) {
  const avg = (value[0] + value[1]) / 2;
  const pct = Math.round((avg / Math.max(total, 1)) * 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm flex items-center gap-2"><span style={{ color, display: "inline-flex" }}><Icon size={14} /></span>{label}</span>
        <span className="text-sm font-semibold tabular-nums">¥{value[0].toLocaleString()} - ¥{value[1].toLocaleString()}</span>
      </div>
      <div className="h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
      </div>
    </div>
  );
}

// ----- Data helpers -----
function getWeatherTip(cityName: string): string {
  const month = new Date().getMonth() + 1;
  const t: Record<string, string> = {
    杭州: month >= 3 && month <= 5 ? "春日杭州，气温15-25°C，薄外套+雨具即可" : month >= 9 && month <= 11 ? "秋高气爽，桂花飘香，最适合游玩" : "注意防暑/保暖，西湖边风大",
    北京: month >= 3 && month <= 5 ? "春季多风沙，建议戴口罩" : month >= 9 && month <= 11 ? "秋高气爽，爬山最佳时节" : month >= 6 && month <= 8 ? "夏季炎热，注意防暑补水" : "冬季寒冷干燥，需羽绒服",
    上海: month >= 3 && month <= 5 ? "春季温和湿润，适合外滩漫步" : month >= 9 && month <= 11 ? "秋季凉爽，梧桐落叶超美" : "夏季闷热多雨，冬季湿冷",
    三亚: "全年温暖，注意防晒，夏季偶有台风",
    成都: "春秋最佳，夏季闷热，冬季阴冷但火锅暖身",
    重庆: month >= 5 && month <= 9 ? "火炉模式，注意防暑" : "秋冬多雾，别有一番风味",
    西安: month >= 3 && month <= 5 ? "春季干燥多风" : month >= 9 && month <= 11 ? "秋高气爽，最适合爬城墙" : "夏季炎热冬季干冷",
  };
  return t[cityName] || "建议查看出行前天气预报";
}

function getCityIntro(name: string): string {
  const intros: Record<string, string> = {
    杭州: "西湖烟雨，龙井茶香，江南的慢生活从一杯明前龙井开始。千年古刹与湿地交错，现代文艺与老城烟火并存。",
    重庆: "8D魔幻山城，轻轨穿楼、长江索道横江，火锅沸腾的夜晚万家灯火。一座让导航失灵、让舌尖狂欢的城市。",
    北京: "故宫红墙下藏着六百年风云，胡同里飘着豆汁焦圈的烟火气。古典与现代在长安街交织，每一步都是历史。",
    上海: "外滩万国建筑与陆家嘴摩天楼隔江相望，梧桐区的咖啡馆藏着法租界的旧时光。",
    西安: "十三朝古都，城墙脚下的回民街烟火千年不灭，兵马俑的军阵静默守护着大秦帝国的秘密。",
    成都: "一座来了就不想走的城市。熊猫在竹林里打滚，火锅在九宫格里翻滚，茶馆里的龙门阵摆不完。",
    三亚: "阳光沙滩椰风海浪，蜈支洲岛的海水蓝得不像话。热带天堂，冬季避寒首选。",
  };
  return intros[name] || `${name}，一座值得慢慢探索的城市。`;
}

const SEASONS: Record<string, string> = {
  杭州: "3-5月、9-11月", 重庆: "3-5月、10-11月", 北京: "4-5月、9-10月", 上海: "3-5月、9-11月",
  三亚: "10月-次年4月", 成都: "3-6月、9-11月", 西安: "3-5月、9-10月", 广州: "10-12月",
  深圳: "10-12月", 南京: "3-5月、10-11月", 苏州: "3-5月、9-11月", 长沙: "3-5月、9-11月",
  厦门: "3-5月、10-11月", 昆明: "全年", 大理: "3-5月、9-11月", 丽江: "4-6月、9-11月",
  青岛: "5-10月", 哈尔滨: "12-2月(冰雪)、6-8月(避暑)",
};

const STYLE_LABELS: Record<string, string> = { classic: "经典打卡", food: "美食探索", nature: "自然风光", culture: "历史文化", family: "亲子家庭" };

function PlannerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resultsRef = useRef<HTMLDivElement>(null);

  const [preferences, setPreferences] = useState<TravelPreferences>({ departureCity: "上海", budget: 2000, days: 2, travelers: 1, interests: [], pace: "balanced", travelStyle: "classic" });
  const [generated, setGenerated] = useState(false);
  const [results, setResults] = useState<Destination[]>([]);
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [dailyPlan, setDailyPlan] = useState<DayPlan[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "plan" | "budget">("overview");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pace, setPace] = useState<"relaxed" | "balanced" | "intensive">("balanced");
  const [travelStyle, setTravelStyle] = useState<TravelStyle>("classic");
  const [budgetData, setBudgetData] = useState<BudgetResult | null>(null);

  const maxDays = useMemo(() => { const d = destinations.find((x) => x.name === preferences.departureCity); return d?.tripLength.max || 5; }, [preferences.departureCity]);

  useEffect(() => { if (preferences.days > maxDays) setPreferences((p) => ({ ...p, days: maxDays })); }, [maxDays, preferences.days]);

  useEffect(() => {
    const city = searchParams.get("city"), budget = searchParams.get("budget"), days = searchParams.get("days"), travelers = searchParams.get("travelers");
    const interests = searchParams.get("interests"), sPace = searchParams.get("pace") as "relaxed" | "balanced" | "intensive";
    const sStyle = searchParams.get("style") as TravelStyle, isDemo = searchParams.get("demo");
    if (city || isDemo) {
      const p: TravelPreferences = { departureCity: city || "上海", budget: Number(budget) || 2000, days: Number(days) || 2, travelers: Number(travelers) || 1, interests: interests ? interests.split(",").filter(Boolean) : [], pace: sPace || "balanced", travelStyle: sStyle || "classic" };
      setPreferences(p); if (sPace) setPace(sPace); if (sStyle) setTravelStyle(sStyle);
      generateResults(p, sPace || "balanced", sStyle || "classic");
    }
  }, [searchParams]);

  const generateResults = (prefs: TravelPreferences, cPace: string, cStyle?: TravelStyle) => {
    setLoading(true);
    setTimeout(() => {
      const style = cStyle || travelStyle || "classic";
      const pw = { ...prefs, pace: cPace as "relaxed" | "balanced" | "intensive", travelStyle: style };
      const recs = getRecommendations(pw); setResults(recs);
      if (recs.length > 0) {
        setSelectedDest(recs[0]);
        const plan = generateDailyPlan(recs[0], pw); setDailyPlan(plan);
        setBudgetData(calculateBudget(recs[0].name, prefs.days, prefs.travelers, style, prefs.budget));
      }
      setGenerated(true); setLoading(false);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
    }, 1200);
  };

  const handleGenerate = () => { const p = { ...preferences, travelStyle }; generateResults(p, pace, travelStyle); };
  const handleDemo = () => {
    const dp: TravelPreferences = { departureCity: "上海", budget: 2000, days: 2, travelers: 1, interests: ["咖啡馆", "摄影", "City Walk"], pace: "balanced", travelStyle: "classic" };
    setPreferences(dp); setPace("balanced"); setTravelStyle("classic"); generateResults(dp, "balanced", "classic");
  };
  const handleSave = () => {
    if (!selectedDest) return;
    saveTrip({ id: `trip-${Date.now()}`, name: `${selectedDest.name}之旅`, destination: selectedDest.name, departureCity: preferences.departureCity, budget: preferences.budget, days: preferences.days, travelers: preferences.travelers, interests: preferences.interests, pace, createdAt: new Date().toISOString(), plan: { destination: selectedDest, dailyPlan } });
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const getActivityIcon = (type: string) => {
    switch (type) { case "transport": return <Train size={16} />; case "sight": return <Camera size={16} />; case "food": return <UtensilsCrossed size={16} />; case "cafe": return <Coffee size={16} />; case "rest": return <Moon size={16} />; default: return <MapPin size={16} />; }
  };

  const TABS = [{ id: "overview" as const, label: "概览", icon: MapPin }, { id: "plan" as const, label: "行程", icon: Calendar }, { id: "budget" as const, label: "预算", icon: Wallet }];

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />
      <div className="pt-24 pb-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F8EF7] to-[#7ED6C2] flex items-center justify-center"><Sparkles size={20} className="text-white" /></div>
            <div><h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">AI 旅行规划</h1><p className="text-sm text-[var(--color-text-secondary)]">智能推荐 · 个性化路线 · 预算分析</p></div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-4">
            <div className="sticky top-24">
              <div className="glass p-6 space-y-5">
                <h2 className="font-bold text-lg flex items-center gap-2"><Sparkles size={18} className="text-[#4F8EF7]" />旅行偏好</h2>
                <PlannerInput departureCity={preferences.departureCity} setDepartureCity={(v) => setPreferences({ ...preferences, departureCity: v })} budget={preferences.budget} setBudget={(v) => setPreferences({ ...preferences, budget: v })} days={preferences.days} setDays={(v) => setPreferences({ ...preferences, days: v })} travelers={preferences.travelers} setTravelers={(v) => setPreferences({ ...preferences, travelers: v })} interests={preferences.interests} setInterests={(v) => setPreferences({ ...preferences, interests: v })} onGenerate={handleGenerate} onDemo={handleDemo} isCompact maxDays={maxDays} travelStyle={travelStyle} setTravelStyle={setTravelStyle} />
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2">旅行节奏</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[{ id: "relaxed" as const, label: "慢旅行", desc: "深度体验" }, { id: "balanced" as const, label: "平衡", desc: "劳逸结合" }, { id: "intensive" as const, label: "特种兵", desc: "打卡高效" }].map((p) => (
                      <button key={p.id} onClick={() => { setPace(p.id); setPreferences({ ...preferences, pace: p.id }); }} className={`p-3 rounded-xl text-center transition-all ${pace === p.id ? "bg-gradient-to-br from-[#4F8EF7]/15 to-[#7ED6C2]/15 border border-[#4F8EF7]/30 text-[#4F8EF7]" : "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[#4F8EF7]/20"}`}>
                        <div className="text-sm font-semibold">{p.label}</div><div className="text-xs opacity-70">{p.desc}</div>
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
                  <div className="text-center"><div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#4F8EF7]/10 to-[#7ED6C2]/10 flex items-center justify-center mx-auto mb-4"><Sparkles size={36} className="text-[#4F8EF7]/40" /></div><p className="text-[var(--color-text-secondary)]">调整左侧偏好后点击「生成旅行方案」</p></div>
                </motion.div>
              )}
              {loading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center h-96">
                  <div className="text-center"><motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-16 h-16 rounded-full border-2 border-[#4F8EF7]/30 border-t-[#4F8EF7] mx-auto mb-4" /><p className="text-[var(--color-text-secondary)]">AI 正在为你生成旅行方案...</p></div>
                </motion.div>
              )}
              {generated && results.length > 0 && (
                <motion.div key="results" ref={resultsRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">为你推荐 {results.length} 个目的地</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {results.map((dest, i) => (
                        <div key={dest.id} onClick={() => { setSelectedDest(dest); setDailyPlan(generateDailyPlan(dest, preferences)); setBudgetData(calculateBudget(dest.name, preferences.days, preferences.travelers, travelStyle, preferences.budget)); setActiveTab("overview"); }} className={selectedDest?.id === dest.id ? "ring-2 ring-[#4F8EF7] rounded-[20px]" : ""}>
                          <DestinationCard destination={dest} index={i} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedDest && budgetData && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      {/* Sticky Tab Bar */}
                      <div className="sticky top-[88px] z-30 -mx-1 px-1 pt-2 pb-4">
                        <div className="glass px-1 py-1 rounded-2xl flex gap-1 shadow-lg shadow-black/5">
                          {TABS.map((tab) => { const isActive = activeTab === tab.id, Icon = tab.icon; return (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-[#4F8EF7] text-white shadow-md shadow-[#4F8EF7]/25" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-border)]"}`}>
                              <Icon size={16} /><span className="hidden sm:inline">{tab.label}</span><span className="sm:hidden text-xs">{tab.label}</span>
                            </button>
                          );})}
                        </div>
                      </div>

                      {/* === OVERVIEW TAB === */}
                      {activeTab === "overview" && (
                        <div className="space-y-4">
                          <div className="glass p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg shrink-0" style={{ background: selectedDest.imageGradient }}>{selectedDest.name[0]}</div>
                                <div><h3 className="text-xl font-bold">{selectedDest.name}</h3><p className="text-xs text-[var(--color-text-secondary)]">{selectedDest.country} · {selectedDest.region} · {SEASONS[selectedDest.name] || selectedDest.bestSeason}</p></div>
                              </div>
                              <button onClick={handleSave} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all shrink-0 ${saved ? "bg-green-500 text-white" : "btn-secondary"}`}>{saved ? <span className="flex items-center gap-1"><Check size={16} />已保存</span> : <span className="flex items-center gap-1"><Heart size={16} />保存</span>}</button>
                            </div>
                            <p className="text-[var(--color-text-secondary)] mt-4 text-sm leading-relaxed">{getCityIntro(selectedDest.name)}</p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                              {[{ icon: Calendar, c: "#4F8EF7", l: "天数", v: `${preferences.days} 天` }, { icon: Users, c: "#7ED6C2", l: "人数", v: `${preferences.travelers} 人` }, { icon: Tag, c: "#FFB4A2", l: "风格", v: STYLE_LABELS[travelStyle] || "经典打卡" }, { icon: Wallet, c: "#8B5CF6", l: "人均预算", v: `¥${budgetData.perPerson[0].toLocaleString()}-${budgetData.perPerson[1].toLocaleString()}` }].map((s, i) => { const Ic = s.icon; return (
                                <div key={i} className="text-center p-3 rounded-xl bg-[var(--color-border)]"><span style={{ color: s.c, display: "inline-flex" }}><Ic size={16} className="mx-auto mb-1" /></span><div className="text-[10px] text-[var(--color-text-secondary)]">{s.l}</div><div className={`text-sm font-semibold mt-0.5 ${s.l === "人均预算" ? "gradient-text" : ""}`}>{s.v}</div></div>
                              );})}
                            </div>
                            <div className="mt-4 p-3 rounded-xl bg-[#4F8EF7]/5 border border-[#4F8EF7]/10 flex items-start gap-2">
                              <CloudSun size={16} className="text-[#4F8EF7] mt-0.5 shrink-0" />
                              <div><div className="text-xs font-medium text-[#4F8EF7]">出行天气建议</div><p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{getWeatherTip(selectedDest.name)}</p></div>
                            </div>
                          </div>
                          <div className="glass p-6">
                            <h4 className="font-bold text-sm mb-3">推荐理由</h4>
                            <div className="space-y-2">{selectedDest.reasons.map((r, i) => (<div key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]"><Check size={16} className="text-[#7ED6C2] mt-0.5 shrink-0" />{r}</div>))}</div>
                          </div>
                        </div>
                      )}

                      {/* === PLAN TAB === */}
                      {activeTab === "plan" && (
                        <div className="space-y-4">{dailyPlan.map((day, i) => (
                          <motion.div key={day.day} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="glass p-6">
                            <div className="flex items-center gap-2 mb-5"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F8EF7] to-[#7ED6C2] flex items-center justify-center text-white font-bold text-sm">{day.day}</div><h4 className="font-bold">{day.title}</h4></div>
                            <div className="relative pl-5">
                              <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-[var(--color-border)]" />
                              {(day.activities || []).map((act, j) => (
                                <div key={j} className="relative pb-5 last:pb-0">
                                  <div className="absolute -left-[27px] top-1 w-[14px] h-[14px] rounded-full bg-[var(--color-bg)] border-2 border-[#4F8EF7] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#4F8EF7" }} /></div>
                                  <div className="flex items-start gap-3">
                                    <span className="text-xs font-mono text-[#4F8EF7] mt-0.5 min-w-[45px]">{act.time}</span>
                                    <div className="flex-1"><div className="flex items-center gap-2 mb-0.5"><span className="p-1 rounded-md bg-[var(--color-border)]">{getActivityIcon(act.type)}</span><span className="font-medium text-sm">{act.name}</span><span className="text-xs text-[#7ED6C2] font-medium">¥{act.cost}</span></div><p className="text-xs text-[var(--color-text-secondary)] ml-9">{act.description} · {act.duration}</p></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        ))}</div>
                      )}

                      {/* === BUDGET TAB === */}
                      {activeTab === "budget" && (
                        <div className="space-y-4">
                          <div className="glass p-6">
                            <h4 className="font-bold text-sm mb-4 flex items-center gap-2"><BarChart3 size={18} className="text-[#4F8EF7]" />预算总览</h4>
                            <BudgetRing breakdown={budgetData.breakdown} totalMin={budgetData.totalRange[0]} totalMax={budgetData.totalRange[1]} />
                            <div className="mt-6 pt-4 border-t border-[var(--color-border)] flex flex-col gap-1">
                              <div className="flex items-center justify-between"><span className="text-sm text-[var(--color-text-secondary)]">预计总花费</span><span className="text-xl font-bold gradient-text tabular-nums">¥{budgetData.totalRange[0].toLocaleString()} - ¥{budgetData.totalRange[1].toLocaleString()}</span></div>
                              <div className="flex items-center justify-between"><span className="text-sm text-[var(--color-text-secondary)]">人均预算</span><span className="text-lg font-semibold tabular-nums">¥{budgetData.perPerson[0].toLocaleString()} - ¥{budgetData.perPerson[1].toLocaleString()}</span></div>
                              <p className="text-xs text-[var(--color-text-secondary)] mt-2 bg-[var(--color-border)] rounded-lg p-2">{preferences.days} 天 {preferences.travelers} 人 · {STYLE_LABELS[travelStyle]}风格 · 实际花费因季节和消费习惯浮动</p>
                            </div>
                          </div>
                          <div className="glass p-6">
                            <h4 className="font-bold text-sm mb-4">费用构成明细</h4>
                            <div className="space-y-4">
                              <BudgetBar label="交通（往返机票）" value={budgetData.breakdown.transport} total={(budgetData.totalRange[0] + budgetData.totalRange[1]) / 2} color="#4F8EF7" icon={Plane} />
                              <BudgetBar label="住宿" value={budgetData.breakdown.accommodation} total={(budgetData.totalRange[0] + budgetData.totalRange[1]) / 2} color="#7ED6C2" icon={Moon} />
                              <BudgetBar label="餐饮" value={budgetData.breakdown.meals} total={(budgetData.totalRange[0] + budgetData.totalRange[1]) / 2} color="#FFB4A2" icon={UtensilsCrossed} />
                              <BudgetBar label="景点门票/活动" value={budgetData.breakdown.attractions} total={(budgetData.totalRange[0] + budgetData.totalRange[1]) / 2} color="#8B5CF6" icon={Footprints} />
                              <BudgetBar label="市内交通" value={budgetData.breakdown.localTransport} total={(budgetData.totalRange[0] + budgetData.totalRange[1]) / 2} color="#F59E0B" icon={Train} />
                            </div>
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

export default function PlannerPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 rounded-full border-2 border-[#4F8EF7]/30 border-t-[#4F8EF7] animate-spin" /></div>}><PlannerContent /></Suspense>;
}

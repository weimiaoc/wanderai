"use client";

import { useMemo } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import SafeImage from "../../components/SafeImage";
import {
  destinations,
  type Destination,
} from "../../lib/recommendation";
import { calculateBudget, type BudgetResult, type BudgetBreakdown } from "../../lib/budget";
import { cityPlans } from "../../lib/city-plans";
import {
  Sparkles,
  MapPin,
  Clock,
  Wallet,
  Calendar,
  Users,
  Tag,
  CloudSun,
  Check,
  Plane,
  Moon,
  UtensilsCrossed,
  Footprints,
  Train,
  Coffee,
  Camera,
  BarChart3,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";

// ============ Budget Ring Chart ============
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
            <circle key={i} cx="70" cy="70" r={radius} fill="none" stroke={seg.color} strokeWidth="16" strokeDasharray={seg.dash} strokeDashoffset={seg.off} strokeLinecap="butt" />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-[var(--color-text-primary)]">
            ¥{(Math.round((totalMin + totalMax) / 2 / 100) * 100).toLocaleString()}
          </span>
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

// ============ Budget Bar ============
function BudgetBar({ label, value, total, color, icon: Icon }: { label: string; value: [number, number]; total: number; color: string; icon: React.ElementType }) {
  const avg = (value[0] + value[1]) / 2;
  const pct = Math.round((avg / Math.max(total, 1)) * 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm flex items-center gap-2">
          <span style={{ color, display: "inline-flex" }}><Icon size={14} /></span>
          {label}
        </span>
        <span className="text-sm font-semibold tabular-nums">¥{value[0].toLocaleString()} - ¥{value[1].toLocaleString()}</span>
      </div>
      <div className="h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
      </div>
    </div>
  );
}

// ============ Helpers ============
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

function getActivityIcon(type: string) {
  switch (type) {
    case "transport": return <Train size={16} />;
    case "sight": return <Camera size={16} />;
    case "food": return <UtensilsCrossed size={16} />;
    case "cafe": return <Coffee size={16} />;
    case "rest": return <Moon size={16} />;
    default: return <MapPin size={16} />;
  }
}

// ============ Main Component ============
export default function CityPlanClient({ slug }: { slug: string }) {
  const dest = useMemo(() => {
    return destinations.find((d) => d.id === slug);
  }, [slug]);

  // 5-day itinerary from city-plans.ts
  const plan5Day = useMemo(() => {
    if (!dest) return [];
    const plans = cityPlans[dest.id];
    if (!plans) return [];
    return plans[5] || plans[3] || plans[7] || [];
  }, [dest]);

  // Budget for 5 days, 1 traveler, comfort tier (classic style)
  const budgetData = useMemo((): BudgetResult | null => {
    if (!dest) return null;
    return calculateBudget(dest.name, 5, 1, "classic");
  }, [dest]);

  if (!dest) {
    notFound();
  }

  const totalMid = budgetData ? (budgetData.totalRange[0] + budgetData.totalRange[1]) / 2 : 0;

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />

      {/* ============ HERO ============ */}
      <section
        className="relative pt-24 pb-16 px-4 sm:px-6 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${dest.imageGradient}22 0%, var(--color-bg) 100%)`,
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: dest.imageGradient }}
        />
        <div
          className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-3xl opacity-10"
          style={{ background: dest.imageGradient }}
        />

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
            返回首页
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-start gap-8"
          >
            {/* City Image */}
            <div className="w-full md:w-72 h-56 md:h-72 rounded-3xl overflow-hidden shrink-0 shadow-2xl">
              <SafeImage
                src={`https://picsum.photos/600/500?random=50`}
                alt={dest.name}
                className="w-full h-full object-cover"
                fallbackText={dest.name.slice(0, 1)}
              />
            </div>

            {/* City Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg"
                  style={{ background: dest.imageGradient }}
                >
                  {dest.name[0]}
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)]">
                    {dest.name}
                  </h1>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {dest.country} · {dest.region}
                  </p>
                </div>
              </div>
              <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed mb-4">
                {getCityIntro(dest.name)}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                {dest.description}
              </p>
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {dest.tags.slice(0, 5).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs rounded-full bg-[#4F8EF7]/8 text-[#4F8EF7] font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ OVERVIEW ============ */}
      <section className="relative z-10 py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F8EF7] to-[#7ED6C2] flex items-center justify-center">
                <MapPin size={16} className="text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
                行程概览
              </h2>
            </div>

            {/* 4-Grid Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Calendar, color: "#4F8EF7", label: "天数", value: "5 天", sub: "舒适档" },
                { icon: CloudSun, color: "#7ED6C2", label: "最佳季节", value: SEASONS[dest.name] || dest.bestSeason, sub: getWeatherTip(dest.name) },
                { icon: Tag, color: "#FFB4A2", label: "风格", value: STYLE_LABELS["classic"] || "经典打卡", sub: "经典路线" },
                { icon: Wallet, color: "#8B5CF6", label: "人均预算", value: budgetData ? `¥${budgetData.perPerson[0].toLocaleString()}-${budgetData.perPerson[1].toLocaleString()}` : "—", sub: `${dest.tripLength.min}-${dest.tripLength.ideal}天推荐` },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={i}
                    className="glass p-4 rounded-2xl text-center"
                  >
                    <span style={{ color: stat.color, display: "inline-flex" }}>
                      <Icon size={20} className="mx-auto mb-2" />
                    </span>
                    <div className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-wider">
                      {stat.label}
                    </div>
                    <div className="text-lg font-bold mt-1 text-[var(--color-text-primary)]">
                      {stat.value}
                    </div>
                    <div className="text-[10px] text-[var(--color-text-secondary)] mt-1 line-clamp-2">
                      {stat.sub}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Weather Tip */}
            <div className="mt-6 glass p-4 rounded-2xl bg-[#4F8EF7]/5 border border-[#4F8EF7]/10 flex items-start gap-3">
              <CloudSun size={18} className="text-[#4F8EF7] mt-0.5 shrink-0" />
              <div>
                <div className="text-sm font-medium text-[#4F8EF7]">出行天气建议</div>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  {getWeatherTip(dest.name)}
                </p>
              </div>
            </div>

            {/* Reasons */}
            {dest.reasons.length > 0 && (
              <div className="mt-4 glass p-5 rounded-2xl">
                <h4 className="font-bold text-sm mb-3 text-[var(--color-text-primary)]">推荐理由</h4>
                <div className="space-y-2">
                  {dest.reasons.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                      <Check size={16} className="text-[#7ED6C2] mt-0.5 shrink-0" />
                      {r}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ============ ITINERARY ============ */}
      <section className="relative z-10 py-12 px-4 sm:px-6 bg-[var(--color-bg-secondary)]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F8EF7] to-[#7ED6C2] flex items-center justify-center">
                <Calendar size={16} className="text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
                5 日行程
              </h2>
            </div>

            {plan5Day.length > 0 ? (
              <div className="space-y-5">
                {plan5Day.map((day: { day: number; title: string; theme: string; highlights: string[]; tip: string; activities?: { time: string; type: string; name: string; cost: number; description: string; duration: string }[] }, i: number) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F8EF7] to-[#7ED6C2] flex items-center justify-center text-white font-bold text-sm">
                        {day.day}
                      </div>
                      <div>
                        <h4 className="font-bold text-[var(--color-text-primary)]">
                          {day.title}
                        </h4>
                        <p className="text-xs text-[var(--color-text-secondary)]">
                          {day.theme}
                        </p>
                      </div>
                    </div>

                    {/* Activities timeline (if available) */}
                    {day.activities && day.activities.length > 0 && (
                      <div className="relative pl-5 mb-4">
                        <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-[var(--color-border)]" />
                        {day.activities.map((act, j) => (
                          <div key={j} className="relative pb-5 last:pb-0">
                            <div className="absolute -left-[27px] top-1 w-[14px] h-[14px] rounded-full bg-[var(--color-bg-secondary)] border-2 border-[#4F8EF7] flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#4F8EF7]" />
                            </div>
                            <div className="flex items-start gap-3">
                              <span className="text-xs font-mono text-[#4F8EF7] mt-0.5 min-w-[45px]">{act.time}</span>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="p-1 rounded-md bg-[var(--color-border)]">{getActivityIcon(act.type)}</span>
                                  <span className="font-medium text-sm text-[var(--color-text-primary)]">{act.name}</span>
                                  <span className="text-xs text-[#7ED6C2] font-medium">¥{act.cost}</span>
                                </div>
                                <p className="text-xs text-[var(--color-text-secondary)] ml-9">
                                  {act.description} · {act.duration}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Highlights */}
                    <ul className="space-y-1.5 mb-3">
                      {day.highlights.map((h: string, j: number) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                          <span className="text-[#7ED6C2] mt-1 shrink-0">·</span>
                          {h}
                        </li>
                      ))}
                    </ul>

                    {/* Tip */}
                    <div className="p-3 rounded-xl bg-[#F59E0B]/5 border border-[#F59E0B]/10 text-xs text-[var(--color-text-secondary)]">
                      <span className="font-medium text-[#F59E0B]">小贴士：</span>
                      {day.tip}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="glass p-10 text-center">
                <p className="text-[var(--color-text-secondary)]">
                  暂无{dest.name}的预设行程数据。
                </p>
                <Link
                  href={`/planner?city=${slug}`}
                  className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-[#4F8EF7] hover:underline"
                >
                  前往 AI 规划定制行程 <ChevronRight size={16} />
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ============ BUDGET ============ */}
      <section className="relative z-10 py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F8EF7] to-[#7ED6C2] flex items-center justify-center">
                <BarChart3 size={16} className="text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
                费用预估
              </h2>
            </div>

            {budgetData ? (
              <div className="space-y-5">
                {/* Budget Overview */}
                <div className="glass p-6">
                  <h4 className="font-bold text-sm mb-4 flex items-center gap-2 text-[var(--color-text-primary)]">
                    <BarChart3 size={18} className="text-[#4F8EF7]" />
                    预算总览
                  </h4>
                  <BudgetRing
                    breakdown={budgetData.breakdown}
                    totalMin={budgetData.totalRange[0]}
                    totalMax={budgetData.totalRange[1]}
                  />
                  <div className="mt-6 pt-4 border-t border-[var(--color-border)] flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--color-text-secondary)]">预计总花费</span>
                      <span className="text-xl font-bold gradient-text tabular-nums">
                        ¥{budgetData.totalRange[0].toLocaleString()} - ¥{budgetData.totalRange[1].toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--color-text-secondary)]">人均预算</span>
                      <span className="text-lg font-semibold tabular-nums">
                        ¥{budgetData.perPerson[0].toLocaleString()} - ¥{budgetData.perPerson[1].toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-2 bg-[var(--color-border)] rounded-lg p-2">
                      5 天 1 人 · 经典打卡风格 · 实际花费因季节和消费习惯浮动
                    </p>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="glass p-6">
                  <h4 className="font-bold text-sm mb-4 text-[var(--color-text-primary)]">费用构成明细</h4>
                  <div className="space-y-4">
                    <BudgetBar label="交通（往返机票）" value={budgetData.breakdown.transport} total={totalMid} color="#4F8EF7" icon={Plane} />
                    <BudgetBar label="住宿" value={budgetData.breakdown.accommodation} total={totalMid} color="#7ED6C2" icon={Moon} />
                    <BudgetBar label="餐饮" value={budgetData.breakdown.meals} total={totalMid} color="#FFB4A2" icon={UtensilsCrossed} />
                    <BudgetBar label="景点门票/活动" value={budgetData.breakdown.attractions} total={totalMid} color="#8B5CF6" icon={Footprints} />
                    <BudgetBar label="市内交通" value={budgetData.breakdown.localTransport} total={totalMid} color="#F59E0B" icon={Train} />
                  </div>
                </div>

                {/* Go to Planner CTA */}
                <div className="glass p-6 bg-gradient-to-br from-[#4F8EF7]/5 to-[#8B5CF6]/5 border border-[#4F8EF7]/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={18} className="text-[#8B5CF6]" />
                    <h3 className="font-bold text-[var(--color-text-primary)]">想调整行程？</h3>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] mb-3">
                    自定义天数、人数和旅行风格，AI 为你重新生成专属方案。
                  </p>
                  <Link
                    href={`/planner?city=${slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl bg-gradient-to-r from-[#4F8EF7] to-[#8B5CF6] text-white hover:opacity-90 transition-opacity"
                  >
                    <Sparkles size={14} /> 自定义规划
                  </Link>
                </div>
              </div>
            ) : (
              <div className="glass p-10 text-center">
                <p className="text-[var(--color-text-secondary)]">预算数据暂不可用。</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer spacing */}
      <div className="h-16" />
    </main>
  );
}

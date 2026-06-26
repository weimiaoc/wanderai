"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import HeroBackground from "./components/HeroBackground";
import FloatingClouds from "./components/FloatingClouds";
import CountUp from "./components/CountUp";
import AnimatedSection from "./components/AnimatedSection";
import PlannerInput from "./components/PlannerInput";
import SafeImage from "./components/SafeImage";
import { demoPreset, type TravelStyle } from "./lib/recommendation";
import {
  Sparkles,
  ArrowRight,
  Compass,
  Map,
  Route,
  TrendingUp,
  Shield,
  Zap,
  MapPin,
  Clock,
  Wallet,
  Star,
  Camera,
  Coffee,
  ChevronRight,
} from "lucide-react";

// 热门目的地推荐
const popularDestinations = [
  { name: "杭州", slug: "hangzhou", budget: "¥1500-2500", month: "3-5月", style: "City Walk · 咖啡馆", image: "https://picsum.photos/400/500?random=1", region: "华东" },
  { name: "成都", slug: "chengdu", budget: "¥1800-3000", month: "3-6月", style: "美食 · 慢生活", image: "https://picsum.photos/400/500?random=2", region: "西南" },
  { name: "大理", slug: "dali", budget: "¥1500-2500", month: "全年皆宜", style: "自然 · 摄影", image: "https://picsum.photos/400/500?random=3", region: "西南" },
  { name: "上海", slug: "shanghai", budget: "¥2000-3500", month: "3-5月", style: "咖啡馆 · City Walk", image: "https://picsum.photos/400/500?random=4", region: "华东" },
  { name: "西安", slug: "xian", budget: "¥1200-2000", month: "3-5月", style: "历史文化 · 美食", image: "https://picsum.photos/400/500?random=5", region: "西北" },
  { name: "长沙", slug: "changsha", budget: "¥1000-1800", month: "10-11月", style: "美食 · 网红打卡", image: "https://picsum.photos/400/500?random=6", region: "华中" },
];

const weeklyPicks = [
  { title: "摄影天堂", icon: Camera, desc: "大理、霞浦、新疆——为一张好照片出发", slug: "dali", color: "#F59E0B", image: "https://picsum.photos/400/300?random=7" },
  { title: "咖啡馆巡礼", icon: Coffee, desc: "上海、杭州、成都——用咖啡读懂一座城", slug: "shanghai", color: "#8B5C4E", image: "https://picsum.photos/400/300?random=8" },
  { title: "周末短逃离", icon: Zap, desc: "48小时换一个城市呼吸", slug: "hangzhou", color: "#6366F1", image: "https://picsum.photos/400/300?random=9" },
  { title: "学生党穷游", icon: Wallet, desc: "预算有限但体验无限", slug: "chongqing", color: "#10B981", image: "https://picsum.photos/400/300?random=10" },
];

export default function HomePage() {
  const router = useRouter();

  const [departureCity, setDepartureCity] = useState("上海");
  const [budget, setBudget] = useState(2000);
  const [days, setDays] = useState(2);
  const [travelers, setTravelers] = useState(1);
  const [interests, setInterests] = useState<string[]>([]);
  const [travelStyle, setTravelStyle] = useState<TravelStyle>("classic");

  const handleGenerate = () => {
    const params = new URLSearchParams({
      city: departureCity,
      budget: budget.toString(),
      days: days.toString(),
      travelers: travelers.toString(),
      interests: interests.join(","),
      pace: "balanced",
    });
    router.push(`/planner?${params.toString()}`);
  };

  const handleDemo = () => {
    const params = new URLSearchParams({
      city: demoPreset.departureCity,
      budget: demoPreset.budget.toString(),
      days: demoPreset.days.toString(),
      travelers: demoPreset.travelers.toString(),
      interests: demoPreset.interests.join(","),
      pace: demoPreset.pace,
      demo: "true",
    });
    router.push(`/planner?${params.toString()}`);
  };

  return (
    <main className="relative min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Sky Gradient */}
        <div className="absolute inset-0 sky-gradient" />
        <HeroBackground />
        <FloatingClouds />

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-sm mb-6"
            >
              <Sparkles size={16} className="text-[#4F8EF7]" />
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                AI-Powered Travel Planning
              </span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
              <span className="text-[var(--color-text-primary)]">Wander</span>
              <span className="gradient-text">AI</span>
            </h1>

            <p className="text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-4 leading-relaxed">
              输入预算与偏好，AI 为你生成真正适合你的旅行方案
            </p>
            <p className="text-sm text-[var(--color-text-secondary)]/60 max-w-xl mx-auto">
              不再翻遍攻略做表格，不再纠结去哪儿。告诉 AI 你的想法，剩下的交给我们。
            </p>
          </motion.div>

          {/* Planner Input */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          >
            <PlannerInput
              departureCity={departureCity}
              setDepartureCity={setDepartureCity}
              budget={budget}
              setBudget={setBudget}
              days={days}
              setDays={setDays}
              travelers={travelers}
              setTravelers={setTravelers}
              interests={interests}
              setInterests={setInterests}
              travelStyle={travelStyle}
              setTravelStyle={setTravelStyle}
              onGenerate={handleGenerate}
              onDemo={handleDemo}
            />
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-[var(--color-text-secondary)]/20 flex items-start justify-center p-1.5"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#4F8EF7]" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text">AI 旅行规划</span>，重新定义出行方式
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto">
            不再是千篇一律的攻略，而是真正为你量身定制的旅行体验
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Compass,
              title: "智能目的地匹配",
              desc: "根据你的兴趣偏好、预算和时间，动态推荐最合适的目的地",
              color: "#4F8EF7",
            },
            {
              icon: Map,
              title: "隐藏宝藏发现",
              desc: "AI 挖掘当地人才知道的秘密地点，告别游客打卡照",
              color: "#7ED6C2",
            },
            {
              icon: Route,
              title: "路线智能优化",
              desc: "多目的地自动规划最优游览顺序，节省路途时间",
              color: "#FFB4A2",
            },
            {
              icon: Shield,
              title: "预算精准把控",
              desc: "交通、住宿、餐饮、门票逐项分析，不花冤枉钱",
              color: "#8B5CF6",
            },
          ].map((feat, i) => (
            <AnimatedSection key={feat.title} delay={i * 0.1}>
              <div className="glass-sm p-6 h-full card-hover">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${feat.color}14` }}
                >
                  <feat.icon size={24} style={{ color: feat.color }} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-[var(--color-text-primary)]">
                  {feat.title}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="relative z-10 py-24 px-4 sm:px-6">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            热门目的地<span className="gradient-text">推荐</span>
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto">
            精选全国最具性价比和体验感的目的地
          </p>
        </AnimatedSection>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularDestinations.map((dest, i) => (
            <AnimatedSection key={dest.slug} delay={i * 0.1}>
              <Link href={`/destination/${dest.slug}`}>
                <div className="glass-sm rounded-2xl overflow-hidden card-hover cursor-pointer h-full">
                  <div className="h-48 relative overflow-hidden">
                    <SafeImage
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      fallbackText={dest.name.slice(0, 1)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 text-xs rounded-full bg-white/20 backdrop-blur-md text-white">
                      {dest.region}
                    </span>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-xl font-bold text-white">{dest.name}</h3>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)]">
                      <span className="flex items-center gap-1">
                        <Wallet size={12} />
                        {dest.budget}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {dest.month}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)]">{dest.style}</p>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Weekly Picks */}
      <section className="relative z-10 py-24 px-4 sm:px-6 bg-[var(--color-bg-secondary)]">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            本周<span className="gradient-text">精选推荐</span>
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto">
            每个主题都有专属目的地和路线，一键出发
          </p>
        </AnimatedSection>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {weeklyPicks.map((pick, i) => (
            <AnimatedSection key={pick.title} delay={i * 0.1}>
              <Link href={`/destination/${pick.slug}`}>
                <div className="glass-sm rounded-2xl overflow-hidden card-hover cursor-pointer h-full">
                  <div className="h-36 relative overflow-hidden">
                    <SafeImage
                      src={pick.image}
                      alt={pick.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      fallbackText={pick.title.slice(0, 1)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-3 left-3 w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${pick.color}30` }}>
                      <pick.icon size={20} style={{ color: pick.color }} />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm mb-1 text-[var(--color-text-primary)]">{pick.title}</h3>
                    <p className="text-xs text-[var(--color-text-secondary)]">{pick.desc}</p>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* AI Demo */}
      <section className="relative z-10 py-24 px-4 sm:px-6">
        <AnimatedSection className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-sm mb-6">
            <Sparkles size={16} className="text-[#7ED6C2]" />
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">
              AI-Powered Results
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            AI 正在<span className="gradient-text">真实生成</span>旅行方案
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto">
            不是示例数据，每一份方案都来自 AI 的实时计算
          </p>
        </AnimatedSection>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "杭州 · 2日City Walk",
              desc: "从小河直街到满觉陇，6个隐藏宝藏地点 + 3家独立咖啡馆，避开游客的人海",
              stats: "预算¥800 | 步行+地铁 | 6个推荐地点",
              image: "https://picsum.photos/600/400?random=13",
              slug: "hangzhou",
            },
            {
              title: "成都 · 3日慢生活",
              desc: "宽窄巷子→人民公园喝茶→太古里→火锅探店→大熊猫基地→九眼桥夜景",
              stats: "预算¥1500 | 地铁+打车 | 8个推荐地点",
              image: "https://picsum.photos/600/400?random=14",
              slug: "chengdu",
            },
            {
              title: "大理 · 4日摄影之旅",
              desc: "环洱海骑行→喜洲古镇→双廊日落→寂照庵→沙溪古镇，每一帧都是壁纸",
              stats: "预算¥2000 | 租车骑行 | 10个推荐地点",
              image: "https://picsum.photos/600/400?random=15",
              slug: "dali",
            },
          ].map((demo, i) => (
            <AnimatedSection key={demo.title} delay={i * 0.15}>
              <Link href={`/destination/${demo.slug}`}>
                <div className="glass-sm rounded-2xl overflow-hidden card-hover cursor-pointer h-full">
                  <div className="h-44 relative overflow-hidden">
                    <SafeImage
                      src={demo.image}
                      alt={demo.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      fallbackText={demo.title.slice(0, 1)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <h3 className="font-bold text-white">{demo.title}</h3>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{demo.desc}</p>
                    <div className="pt-2 border-t border-[var(--color-border)]">
                      <p className="text-[10px] text-[var(--color-text-secondary)]">{demo.stats}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/explorer"
            className="btn-primary inline-flex items-center gap-2"
          >
            探索更多目的地 <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-24 px-4 sm:px-6 bg-[var(--color-bg-secondary)]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: 18, label: "城市覆盖", suffix: "+" },
              { num: 8, label: "旅行风格分类", suffix: "" },
              { num: 77, label: "隐藏宝藏地点", suffix: "+" },
              { num: 18, label: "多城市路线库", suffix: "" },
            ].map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 0.15}>
                <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
                  <CountUp end={stat.num} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {stat.label}
                </p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-4 sm:px-6">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto glass p-10 sm:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4F8EF7]/5 via-transparent to-[#7ED6C2]/5" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                准备好开启你的{" "}
                <span className="gradient-text">下一段旅程</span> 了吗？
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-8 max-w-lg mx-auto">
                不用再翻几十篇攻略，不用做复杂的 Excel 表格。告诉 WanderAI 你的想法，3 秒生成专属旅行方案。
              </p>
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setTimeout(() => router.push("/planner"), 500);
                }}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Zap size={20} />
                开始规划
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-4 sm:px-6 border-t border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4F8EF7] to-[#7ED6C2] flex items-center justify-center">
              <span className="text-white font-bold text-xs">W</span>
            </div>
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">
              Wander<span className="gradient-text">AI</span>
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">
            &copy; 2024 WanderAI. Made for travelers, by travelers.
          </p>
        </div>
      </footer>
    </main>
  );
}

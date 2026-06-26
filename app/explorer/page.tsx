"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "../components/Navbar";
import AnimatedSection from "../components/AnimatedSection";
import { travelStyles } from "../lib/recommendation";
import {
  Compass,
  Zap,
  Coins,
  Camera,
  Coffee,
  TreePine,
  Landmark,
  Waves,
  Building2,
  MapPin,
  Clock,
  Wallet,
  Star,
  ArrowRight,
  X,
  Check,
} from "lucide-react";

// 城市名到 slug 映射
const citySlugMap: Record<string, string> = {
  "杭州": "hangzhou", "成都": "chengdu", "上海": "shanghai",
  "北京": "beijing", "大理": "dali", "厦门": "xiamen",
  "重庆": "chongqing", "西安": "xian", "广州": "guangzhou",
  "深圳": "shenzhen", "苏州": "suzhou", "南京": "nanjing",
  "青岛": "qingdao", "长沙": "changsha", "昆明": "kunming",
  "丽江": "lijiang", "哈尔滨": "haerbin", "三亚": "sanya",
};

function getDestinationUrl(destinations: string[]): string {
  for (const d of destinations) {
    const slug = citySlugMap[d];
    if (slug) return `/destination/${slug}`;
  }
  return "#";
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Zap,
  Coins,
  Camera,
  Coffee,
  TreePine,
  Landmark,
  Waves,
  Building2,
};

export default function ExplorerPage() {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-sm mb-6">
              <Compass size={16} className="text-[#4F8EF7]" />
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                Discover by Style
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold mb-4">
              <span className="gradient-text">目的地探索</span>
            </h1>
            <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto">
              不按城市分类，按旅行风格找到属于你的完美目的地
            </p>
          </motion.div>
        </div>
      </section>

      {/* Style Cards Grid */}
      <section className="px-4 sm:px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {travelStyles.map((style, i) => {
              const IconComp = iconMap[style.icon] || Compass;
              return (
                <AnimatedSection key={style.id} delay={i * 0.08}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    onClick={() =>
                      setSelectedStyle(
                        selectedStyle === style.id ? null : style.id
                      )
                    }
                    className="glass card-hover p-6 cursor-pointer relative overflow-hidden group h-full"
                  >
                    {/* Gradient Top Bar */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1.5"
                      style={{ background: style.gradient }}
                    />

                    {/* Gradient Background Blur */}
                    <div
                      className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 blur-3xl group-hover:opacity-20 transition-opacity"
                      style={{ background: style.gradient }}
                    />

                    <div className="relative z-10">
                      {/* Icon */}
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${style.gradient.split(",")[0].replace("linear-gradient(135deg, ", "")}, ${style.gradient.split(",")[1]?.trim() || ""})`,
                        }}
                      >
                        <IconComp size={26} className="text-white" />
                      </div>

                      <h3 className="text-lg font-bold mb-2 text-[var(--color-text-primary)]">
                        {style.name}
                      </h3>
                      <p className="text-sm text-[var(--color-text-secondary)] mb-4 line-clamp-2">
                        {style.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                          <Wallet size={12} className="text-[#7ED6C2]" />
                          {style.budget}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                          <Clock size={12} className="text-[#FFB4A2]" />
                          {style.season}
                        </div>
                      </div>

                      {/* Destination Pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {style.destinations.slice(0, 3).map((d) => (
                          <span
                            key={d}
                            className="px-2.5 py-1 text-xs rounded-full bg-[var(--color-border)] text-[var(--color-text-secondary)]"
                          >
                            {d}
                          </span>
                        ))}
                        {style.destinations.length > 3 && (
                          <span className="px-2.5 py-1 text-xs rounded-full bg-[#4F8EF7]/8 text-[#4F8EF7]">
                            +{style.destinations.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Expanded Detail */}
                      {selectedStyle === style.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-4 pt-4 border-t border-[var(--color-border)]"
                        >
                          <h4 className="font-semibold text-sm mb-2">
                            推荐目的地
                          </h4>
                          <div className="space-y-1.5">
                            {style.destinations.map((d) => (
                              <div
                                key={d}
                                className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]"
                              >
                                <MapPin size={12} className="text-[#4F8EF7]" />
                                {d}
                              </div>
                            ))}
                          </div>
                          <Link
                            href={getDestinationUrl(style.destinations)}
                            className="mt-4 w-full py-2.5 rounded-xl text-sm font-medium bg-[#4F8EF7]/10 text-[#4F8EF7] hover:bg-[#4F8EF7]/20 transition-colors flex items-center justify-center gap-1.5"
                          >
                            查看详情 <ArrowRight size={14} />
                          </Link>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="px-4 sm:px-6 pb-20">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto glass p-8 sm:p-12 text-center">
            <h3 className="text-2xl font-bold mb-8">
              找到属于你的{" "}
              <span className="gradient-text">旅行风格</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "旅行风格", value: "8", suffix: "种" },
                { label: "目的地覆盖", value: "150", suffix: "+" },
                { label: "隐藏宝藏", value: "8500", suffix: "+" },
                { label: "智能推荐", value: "98", suffix: "% 匹配" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold gradient-text">
                    {s.value}
                    <span className="text-base">{s.suffix}</span>
                  </div>
                  <div className="text-sm text-[var(--color-text-secondary)] mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>
    </main>
  );
}

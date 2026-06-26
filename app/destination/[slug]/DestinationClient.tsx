"use client";

import Link from "next/link";
import Navbar from "../../components/Navbar";
import SafeImage from "../../components/SafeImage";
import { getGemsByCity } from "../../lib/hidden-gems-data";
import { getRouteByCity } from "../../lib/route-data";
import {
  MapPin, Clock, Wallet, Sun, Calendar, TrendingUp,
  Star, Navigation, ArrowLeft, Sparkles,
  Bus, UtensilsCrossed, Building2, Bot,
} from "lucide-react";

interface DestData {
  name: string; enName: string; region: string;
  description: string; longDescription: string;
  bestSeasons: string; recommendedDays: string; avgBudget: string;
  highlights: string[];
  popularAreas: { name: string; desc: string; icon: string }[];
  tags: string[];
  heroImage: string;
}

interface ExtrasData {
  transport: { type: string; desc: string; tips: string }[];
  foodRecommendations: { name: string; type: string; desc: string; price: string }[];
  accommodations: { name: string; type: string; area: string; price: string; desc: string }[];
}

export default function DestinationClient({ slug, dest, extras }: { slug: string; dest: DestData; extras: ExtrasData }) {
  const gems = getGemsByCity(dest.name);
  const route = getRouteByCity(dest.name);

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6">
        <div className="absolute inset-0 top-0 h-[400px] overflow-hidden">
          <SafeImage
            src={dest.heroImage}
            alt={dest.name}
            fallbackSrc={`https://picsum.photos/1200/600?random=19${dest.enName.toLowerCase()},travel`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-[var(--color-bg)]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 pt-32">
          <Link href="/explorer" className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={16} /> 返回探索
          </Link>
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-3">{dest.name}</h1>
          <p className="text-lg text-white/80 mb-2">{dest.enName}</p>
          <p className="text-white/70 max-w-xl">{dest.description}</p>
        </div>
      </section>

      {/* Quick Info */}
      <section className="px-4 sm:px-6 -mt-8 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="glass p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#4F8EF7]/10 flex items-center justify-center">
                <Sun size={20} className="text-[#4F8EF7]" />
              </div>
              <div>
                <div className="text-xs text-[var(--color-text-secondary)]">最佳季节</div>
                <div className="text-sm font-semibold">{dest.bestSeasons.split("（")[0]}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#7ED6C2]/10 flex items-center justify-center">
                <Calendar size={20} className="text-[#7ED6C2]" />
              </div>
              <div>
                <div className="text-xs text-[var(--color-text-secondary)]">推荐天数</div>
                <div className="text-sm font-semibold">{dest.recommendedDays}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFB4A2]/10 flex items-center justify-center">
                <Wallet size={20} className="text-[#FFB4A2]" />
              </div>
              <div>
                <div className="text-xs text-[var(--color-text-secondary)]">人均预算</div>
                <div className="text-sm font-semibold">{dest.avgBudget}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center">
                <MapPin size={20} className="text-[#8B5CF6]" />
              </div>
              <div>
                <div className="text-xs text-[var(--color-text-secondary)]">所在区域</div>
                <div className="text-sm font-semibold">{dest.region}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="px-4 sm:px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">关于{dest.name}</h2>
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">{dest.longDescription}</p>

              <h3 className="text-lg font-bold mb-3">推荐玩法</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                {dest.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                    <div className="w-5 h-5 rounded bg-[#4F8EF7]/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp size={12} className="text-[#4F8EF7]" />
                    </div>
                    {h}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {dest.tags.map((t) => (
                  <span key={t} className="px-3 py-1 text-xs rounded-full bg-[var(--color-border)] text-[var(--color-text-secondary)]">
                    {t}
                  </span>
                ))}
              </div>

              <h3 className="text-lg font-bold mb-3">热门区域</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {dest.popularAreas.map((area) => (
                  <div key={area.name} className="glass-sm p-4">
                    <div className="font-semibold text-sm mb-1 flex items-center gap-2">
                      <MapPin size={14} className="text-[#4F8EF7]" />
                      {area.name}
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)]">{area.desc}</p>
                  </div>
                ))}
              </div>

              {/* Transport */}
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Bus size={18} className="text-[#4F8EF7]" /> 交通建议
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {extras.transport.map((t, i) => (
                  <div key={i} className="glass-sm p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-[#4F8EF7]/10 text-[#4F8EF7] font-medium">{t.type}</span>
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-1">{t.desc}</p>
                    <p className="text-xs text-[var(--color-text-tertiary)]">💡 {t.tips}</p>
                  </div>
                ))}
              </div>

              {/* Food */}
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <UtensilsCrossed size={18} className="text-[#FFB4A2]" /> 美食推荐
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {extras.foodRecommendations.map((f, i) => (
                  <div key={i} className="glass-sm p-4 flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FFB4A2]/10 flex items-center justify-center flex-shrink-0">
                      <UtensilsCrossed size={16} className="text-[#FFB4A2]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{f.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-border)] text-[var(--color-text-secondary)]">{f.type}</span>
                      </div>
                      <p className="text-xs text-[var(--color-text-secondary)] mb-1">{f.desc}</p>
                      <span className="text-xs font-medium text-[#FFB4A2]">{f.price}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Accommodation */}
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Building2 size={18} className="text-[#7ED6C2]" /> 推荐住宿
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {extras.accommodations.map((a, i) => (
                  <div key={i} className="glass-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm">{a.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-border)] text-[var(--color-text-secondary)]">{a.type}</span>
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] mb-2">{a.desc}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--color-text-tertiary)]">{a.area}</span>
                      <span className="font-medium text-[#7ED6C2]">{a.price}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Gallery — moved after new sections */}
              <h3 className="text-lg font-bold mb-4">{dest.name}掠影</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden bg-[var(--color-border)]">
                    <SafeImage
                      src={`https://picsum.photos/400/300?random=20${dest.enName.toLowerCase()},travel,${i}`}
                      alt={`${dest.name} ${i}`}
                      fallbackSrc={`https://picsum.photos/400/300?random=21${dest.enName.toLowerCase()}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="glass p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sun size={18} className="text-[#FFB4A2]" />
                  <h3 className="font-bold">最佳季节详情</h3>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)]">{dest.bestSeasons}</p>
              </div>

              <div className="glass p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Wallet size={18} className="text-[#7ED6C2]" />
                  <h3 className="font-bold">预算参考</h3>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)]">人均预算 {dest.avgBudget}，包含住宿、餐饮、门票等基本开销。</p>
                <div className="mt-3 space-y-1.5 text-xs text-[var(--color-text-secondary)]">
                  <div className="flex justify-between"><span>住宿</span><span className="font-medium">¥150-400/晚</span></div>
                  <div className="flex justify-between"><span>餐饮</span><span className="font-medium">¥80-150/天</span></div>
                  <div className="flex justify-between"><span>交通</span><span className="font-medium">¥50-100/天</span></div>
                  <div className="flex justify-between"><span>门票</span><span className="font-medium">¥100-300/天</span></div>
                </div>
              </div>

              {gems.length > 0 && (
                <div className="glass p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={18} className="text-[#7ED6C2]" />
                    <h3 className="font-bold">隐藏宝藏</h3>
                  </div>
                  <div className="space-y-2 mb-3">
                    {gems.slice(0, 3).map((g) => (
                      <div key={g.id} className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--color-border)]">
                          <SafeImage
                            src={g.imageUrl || ""}
                            alt={g.name}
                            fallbackText={g.name[0]}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-xs">{g.name}</div>
                          <div className="text-[10px] text-[var(--color-text-secondary)]">{g.tags?.slice(0, 2).join(" · ") || "Hidden"}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link href="/hidden-gems" className="text-xs text-[#4F8EF7] hover:underline">
                    查看全部 {gems.length} 个隐藏地点 →
                  </Link>
                </div>
              )}

              {route && (
                <div className="glass p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Navigation size={18} className="text-[#4F8EF7]" />
                    <h3 className="font-bold">推荐路线</h3>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] mb-2">{route.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {route.optimizedOrder.map((p, i) => (
                      <span key={p} className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-border)] text-[var(--color-text-secondary)]">
                        {i + 1}. {p}
                      </span>
                    ))}
                  </div>
                  <Link href="/route-optimizer" className="text-xs text-[#4F8EF7] hover:underline">
                    打开路线优化器 →
                  </Link>
                </div>
              )}

              {/* AI 行程 */}
              <div className="glass p-5 bg-gradient-to-br from-[#4F8EF7]/5 to-[#8B5CF6]/5 border border-[#4F8EF7]/20">
                <div className="flex items-center gap-2 mb-3">
                  <Bot size={18} className="text-[#8B5CF6]" />
                  <h3 className="font-bold">AI 智能行程</h3>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] mb-3">
                  告诉 AI 你的天数、兴趣和预算，5 秒内生成专属{dest.name}行程。
                </p>
                <Link
                  href={`/planner?city=${slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-xl bg-gradient-to-r from-[#4F8EF7] to-[#8B5CF6] text-white hover:opacity-90 transition-opacity"
                >
                  <Sparkles size={14} /> 立即规划 {dest.name} 行程
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

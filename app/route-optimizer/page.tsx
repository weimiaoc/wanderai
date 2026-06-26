"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import AnimatedSection from "../components/AnimatedSection";
import { cityRoutes, getRouteByCity, getRouteCities, CityRoute } from "../lib/route-data";
import {
  Route,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  X,
  Plus,
  Navigation,
  Timer,
  Zap,
  Check,
  TrendingDown,
  Footprints,
  Train,
  Bus,
  ChevronDown,
} from "lucide-react";

const cityNames = getRouteCities();

function RouteMapVisual({ optimized }: { optimized: string[] }) {
  const n = optimized.length;
  const centerX = 50;
  const centerY = 50;
  const radius = 35;

  const positions: Record<string, { x: number; y: number }> = {};
  optimized.forEach((name, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    positions[name] = { x, y };
  });

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[var(--color-border)]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#F0F7FF] to-[#F5FFF5] dark:from-[#1A2A3E] dark:to-[#1A2E26]">
        <svg className="absolute inset-0 w-full h-full opacity-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={`${(i + 1) * 12.5}%`} x2="100%" y2={`${(i + 1) * 12.5}%`} stroke="currentColor" strokeWidth="0.5" />
          ))}
        </svg>

        {optimized.length > 1 && (
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id="routeGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4F8EF7" />
                <stop offset="50%" stopColor="#7ED6C2" />
                <stop offset="100%" stopColor="#FFB4A2" />
              </linearGradient>
            </defs>
            {optimized.map((name, i) => {
              if (i === n - 1) return null;
              const from = positions[name];
              const to = positions[optimized[i + 1]];
              if (!from || !to) return null;
              return (
                <line key={i} x1={`${from.x}%`} y1={`${from.y}%`} x2={`${to.x}%`} y2={`${to.y}%`}
                  stroke="url(#routeGrad2)" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
              );
            })}
          </svg>
        )}

        {optimized.map((name, i) => {
          const pos = positions[name];
          if (!pos) return null;
          return (
            <div key={name} style={{ left: `${pos.x}%`, top: `${pos.y}%` }} className="absolute -translate-x-1/2 -translate-y-1/2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.12 }}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4F8EF7] to-[#7ED6C2] text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-[#4F8EF7]/30"
              >
                {i + 1}
              </motion.div>
              <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="text-[10px] text-[var(--color-text-secondary)]">{name}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function RouteOptimizerPage() {
  const [selectedCity, setSelectedCity] = useState<string>("杭州");
  const [places, setPlaces] = useState<string[]>([]);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [optimized, setOptimized] = useState<string[] | null>(null);
  const [timeSaved, setTimeSaved] = useState("");
  const [resultCity, setResultCity] = useState("");
  const [cityRoute, setCityRoute] = useState<CityRoute | null>(null);

  const handleLoadCity = (city: string) => {
    setSelectedCity(city);
    setShowCityPicker(false);
    const route = getRouteByCity(city);
    if (route) {
      setCityRoute(route);
      setPlaces(route.places.map((p: {name: string}) => p.name));
      setOptimized(null);
      setTimeSaved("");
    }
  };

  const removePlace = (name: string) => {
    setPlaces(places.filter((p) => p !== name));
    setOptimized(null);
  };

  const handleOptimize = () => {
    const route = getRouteByCity(selectedCity);
    if (route) {
      setOptimized(route.optimizedOrder);
      setTimeSaved(route.estimatedTimeSaved);
      setResultCity(route.city);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />

      <section className="pt-28 pb-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-sm mb-6">
              <Route size={16} className="text-[#FFB4A2]" />
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                覆盖{cityNames.length}个城市 · Smart Route Optimization
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold mb-4">
              智能路线<span className="gradient-text">优化器</span>
            </h1>
            <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto">
              选择城市自动加载示例路线，AI 计算最优游览顺序
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* City Selector */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <button
                onClick={() => setShowCityPicker(!showCityPicker)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass text-sm font-medium hover:bg-[var(--color-border)] transition-colors"
              >
                <MapPin size={16} className="text-[#4F8EF7]" />
                {selectedCity}
                <ChevronDown size={14} className={`transition-transform ${showCityPicker ? "rotate-180" : ""}`} />
              </button>
              {showCityPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-2 left-0 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto w-36"
                >
                  {cityNames.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleLoadCity(city)}
                      className={`w-full px-4 py-2.5 text-sm hover:bg-[var(--color-border)] transition-colors text-left ${
                        city === selectedCity ? "bg-[#4F8EF7]/8 text-[#4F8EF7] font-medium" : ""
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </motion.div>
              )}
              <button
                onClick={handleLoadCity.bind(null, selectedCity)}
                className="ml-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[#4F8EF7] text-white hover:bg-[#4F8EF7]/90 transition-colors"
              >
                加载示例路线
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left - Input */}
            <div className="lg:col-span-5">
              <AnimatedSection>
                <div className="glass p-6 space-y-5">
                  <h3 className="font-bold flex items-center gap-2">
                    <MapPin size={18} className="text-[#4F8EF7]" />
                    {selectedCity} · 路线地点
                  </h3>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                      已选择 {places.length} 个地点
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {places.map((place, i) => (
                      <motion.div
                        key={place}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-border)]"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-gradient-to-br from-[#4F8EF7] to-[#7ED6C2] text-white flex items-center justify-center text-xs font-bold">
                            {i + 1}
                          </span>
                          <span className="text-sm font-medium">{place}</span>
                        </div>
                        <button
                          onClick={() => removePlace(place)}
                          className="p-1 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </div>

                  {cityRoute && (
                    <div className="pt-2 border-t border-[var(--color-border)]">
                      <p className="text-xs text-[var(--color-text-secondary)] mb-2">
                        推荐交通：{cityRoute.recommendedTransport}
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        预计总时长：{cityRoute.totalDuration}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleOptimize}
                    disabled={places.length < 2}
                    className={`btn-primary w-full flex items-center justify-center gap-2 ${
                      places.length < 2 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <Zap size={18} />
                    优化路线
                  </button>
                </div>
              </AnimatedSection>
            </div>

            {/* Right - Results */}
            <div className="lg:col-span-7">
              {!optimized && (
                <div className="flex items-center justify-center h-full min-h-[300px]">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFB4A2]/10 to-[#4F8EF7]/10 flex items-center justify-center mx-auto mb-4">
                      <Route size={28} className="text-[#FFB4A2]/40" />
                    </div>
                    <p className="text-[var(--color-text-secondary)]">选择城市 → 加载路线 → 点击优化</p>
                  </div>
                </div>
              )}

              {optimized && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="glass p-4">
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <Navigation size={16} className="text-[#4F8EF7]" />
                      {resultCity} · 优化路线
                    </h4>
                    <RouteMapVisual optimized={optimized} />
                  </div>

                  <div className="glass p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7ED6C2]/20 to-[#4F8EF7]/20 flex items-center justify-center">
                        <TrendingDown size={22} className="text-[#7ED6C2]" />
                      </div>
                      <div>
                        <div className="text-sm text-[var(--color-text-secondary)]">路线优化结果</div>
                        <div className="text-xl font-bold gradient-text">{timeSaved}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-lg bg-[var(--color-border)] flex items-center justify-center">
                          <X size={12} className="text-red-400" />
                        </div>
                        <span className="text-sm font-medium text-[var(--color-text-secondary)]">原始顺序</span>
                      </div>
                      <div className="space-y-1">
                        {places.map((p, i) => (
                          <div key={p} className="text-xs text-[var(--color-text-secondary)] py-1">
                            <span className="font-mono mr-2">{i + 1}.</span>{p}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="glass p-5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#4F8EF7] to-[#7ED6C2]" />
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-lg bg-[#7ED6C2]/15 flex items-center justify-center">
                          <Check size={12} className="text-[#7ED6C2]" />
                        </div>
                        <span className="text-sm font-medium text-[#4F8EF7]">优化后</span>
                      </div>
                      <div className="space-y-1">
                        {optimized.map((p, i) => (
                          <div key={p} className="text-xs text-[var(--color-text-primary)] py-1 font-medium">
                            <span className="font-mono mr-2 text-[#4F8EF7]">{i + 1}.</span>{p}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {cityRoute && (
                    <div className="glass p-5">
                      <h4 className="font-bold mb-3 flex items-center gap-2">
                        <Train size={16} className="text-[#4F8EF7]" />
                        推荐交通方式
                      </h4>
                      <p className="text-sm text-[var(--color-text-secondary)]">{cityRoute.recommendedTransport}</p>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-1">预计总时长：{cityRoute.totalDuration}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

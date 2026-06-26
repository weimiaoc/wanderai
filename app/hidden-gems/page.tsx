"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import AnimatedSection from "../components/AnimatedSection";
import HiddenGemCard from "../components/HiddenGemCard";
import { allHiddenGems, getGemCities, getGemsByCity, GemSpot } from "../lib/hidden-gems-data";
import {
  Map,
  Sparkles,
  MapPin,
  Navigation,
  Compass,
  Eye,
  ChevronDown,
  Search,
} from "lucide-react";

export default function HiddenGemsPage() {
  const cities = getGemCities();
  const [selectedCity, setSelectedCity] = useState<string>("杭州");
  const [activeSpot, setActiveSpot] = useState<string | null>(null);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const currentSpots = getGemsByCity(selectedCity);

  const handleSpotClick = (id: string) => {
    setActiveSpot(activeSpot === id ? null : id);
    const card = cardRefs.current[id];
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const handleCardClick = (id: string) => {
    setActiveSpot(id);
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-sm mb-6">
              <Eye size={16} className="text-[#7ED6C2]" />
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                Beyond Tourist Traps
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold mb-4">
              发现旅行攻略{" "}
              <span className="gradient-text">不会告诉你</span> 的地方
            </h1>
            <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto mb-6">
              覆盖全国{cities.length}个城市，{allHiddenGems.length}+隐藏宝藏地点，本地人私藏清单
            </p>
          </motion.div>

          {/* City Picker */}
          <div className="flex justify-center">
            <div className="relative">
              <button
                onClick={() => setShowCityPicker(!showCityPicker)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass text-sm font-medium hover:bg-[var(--color-border)] transition-colors"
              >
                <MapPin size={16} className="text-[#4F8EF7]" />
                {selectedCity}
                <span className="text-xs text-[var(--color-text-secondary)] ml-1">
                  {currentSpots.length}个地点
                </span>
                <ChevronDown size={14} className={`transition-transform ${showCityPicker ? "rotate-180" : ""}`} />
              </button>

              {showCityPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-2 left-0 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto w-48"
                >
                  {cities.map((city) => {
                    const count = getGemsByCity(city).length;
                    return (
                      <button
                        key={city}
                        onClick={() => {
                          setSelectedCity(city);
                          setShowCityPicker(false);
                          setActiveSpot(null);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-[var(--color-border)] transition-colors ${
                          city === selectedCity ? "bg-[#4F8EF7]/8 text-[#4F8EF7] font-medium" : ""
                        }`}
                      >
                        <span>{city}</span>
                        <span className="text-xs text-[var(--color-text-secondary)]">{count}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map + Cards Layout */}
      <section className="px-4 sm:px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left - City Image */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
              <AnimatedSection>
                <div className="glass p-4">
                  <div className="flex items-center gap-2 mb-4 px-2">
                    <Compass size={18} className="text-[#4F8EF7]" />
                    <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                      {selectedCity} · 隐藏宝藏地图
                    </span>
                    <span className="ml-auto text-xs text-[var(--color-text-secondary)]">
                      {currentSpots.length} 个地点
                    </span>
                  </div>
                  <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden">
                    <img
                      src={`https://picsum.photos/600/750?random=17${selectedCity.toLowerCase()},street,local`}
                      alt={selectedCity}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://picsum.photos/600/750?random=18";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {/* Location markers overlay */}
                    <div className="absolute inset-0">
                      {currentSpots.map((spot, i) => {
                        const top = 15 + (i * 18) % 75;
                        const left = 20 + (i * 25) % 65;
                        const isActive = activeSpot === spot.id;
                        return (
                          <motion.button
                            key={spot.id}
                            className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                            style={{ top: `${top}%`, left: `${left}%` }}
                            animate={{ scale: isActive ? 1.3 : 1 }}
                            whileHover={{ scale: 1.2 }}
                            onClick={() => handleSpotClick(spot.id)}
                          >
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-lg ${
                                isActive
                                  ? "bg-[#4F8EF7] text-white shadow-[#4F8EF7]/40"
                                  : "bg-white/90 dark:bg-gray-800/90 text-[#4F8EF7]"
                              }`}
                            >
                              <MapPin size={12} />
                            </div>
                            {isActive && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap"
                              >
                                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#4F8EF7] text-white shadow-lg">
                                  {spot.name}
                                </span>
                              </motion.div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white/80 text-xs">
                        点击地图标记探索隐藏地点
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Right - Cards */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-[#7ED6C2]" />
                <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                  点击卡片查看详情 · 地图联动高亮
                </span>
              </div>
              {currentSpots.length === 0 ? (
                <div className="glass p-12 text-center">
                  <Search size={32} className="mx-auto mb-3 text-[var(--color-text-secondary)]" />
                  <p className="text-[var(--color-text-secondary)]">该城市暂无隐藏宝藏数据</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentSpots.map((spot, i) => (
                    <div
                      key={spot.id}
                      ref={(el) => {
                        cardRefs.current[spot.id] = el;
                      }}
                    >
                      <HiddenGemCard
                        spot={spot}
                        index={i}
                        isActive={activeSpot === spot.id}
                        onClick={() => handleCardClick(spot.id)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

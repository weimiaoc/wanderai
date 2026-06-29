"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import AnimatedSection from "../components/AnimatedSection";
import { getSavedTrips, deleteTrip, getFavorites, toggleFavorite, SavedTrip, FavoritedDestination } from "../lib/storage";
import { destinations } from "../lib/recommendation";
import {
  Heart,
  MapPin,
  Clock,
  Wallet,
  Calendar,
  Trash2,
  Download,
  Sparkles,
  ChevronRight,
  Users,
  Coffee,
  Camera,
  Footprints,
  Bookmark,
  Globe,
  Compass,
  Star,
  BarChart3,
  ArrowRight,
  X,
} from "lucide-react";
import Link from "next/link";

export default function MyTripsPage() {
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [favorites, setFavorites] = useState<FavoritedDestination[]>([]);
  const [activeTab, setActiveTab] = useState<"trips" | "favorites">("trips");
  const [selectedTrip, setSelectedTrip] = useState<SavedTrip | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    setTrips(getSavedTrips());
    setFavorites(getFavorites());
  }, []);

  const getSlug = (cityName: string): string => {
    const dest = destinations.find((d) => d.name === cityName);
    return dest?.id || cityName;
  };

  const handleDelete = (id: string) => {
    deleteTrip(id);
    setTrips(trips.filter((t) => t.id !== id));
    if (selectedTrip?.id === id) setSelectedTrip(null);
  };

  const handleExport = async () => {
    if (!selectedTrip) return;
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
    }, 1500);
  };

  const getInterestIcon = (interest: string) => {
    switch (interest) {
      case "咖啡馆": return <Coffee size={12} />;
      case "摄影": return <Camera size={12} />;
      case "City Walk": return <Footprints size={12} />;
      case "美食": return <span className="text-xs">🍜</span>;
      default: return <Star size={12} />;
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-sm mb-4">
                  <Bookmark size={16} className="text-[#7ED6C2]" />
                  <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                    Your Travel Library
                  </span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-bold">
                  我的<span className="gradient-text">旅行库</span>
                </h1>
                <p className="text-[var(--color-text-secondary)] mt-2">
                  保存的旅行方案与收藏的目的地
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <section className="px-4 sm:px-6 pb-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("trips")}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === "trips"
                  ? "bg-[#4F8EF7] text-white shadow-lg shadow-[#4F8EF7]/25"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]"
              }`}
            >
              旅行方案 ({trips.length})
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === "favorites"
                  ? "bg-[#FFB4A2] text-white shadow-lg shadow-[#FFB4A2]/25"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]"
              }`}
            >
              收藏 ({favorites.length})
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 sm:px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {activeTab === "trips" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Trip List */}
              <div className="lg:col-span-5 space-y-4">
                {trips.length === 0 && (
                  <div className="glass p-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4F8EF7]/10 to-[#7ED6C2]/10 flex items-center justify-center mx-auto mb-4">
                      <Globe size={28} className="text-[#4F8EF7]/30" />
                    </div>
                    <h3 className="font-bold mb-2">还没有旅行方案</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                      去 AI 规划页面生成你的第一个旅行方案
                    </p>
                    <Link
                      href="/planner"
                      className="btn-primary inline-flex items-center gap-2"
                    >
                      <Sparkles size={16} />
                      开始规划
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                )}

                {trips.map((trip, i) => (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedTrip(trip)}
                    className={`glass-sm p-5 cursor-pointer transition-all duration-300 ${
                      selectedTrip?.id === trip.id
                        ? "border-[#4F8EF7] shadow-lg shadow-[#4F8EF7]/10"
                        : "card-hover"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F8EF7] to-[#7ED6C2] flex items-center justify-center text-white font-bold">
                          {trip.destination[0]}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm">
                            {trip.name}
                          </h3>
                          <p className="text-xs text-[var(--color-text-secondary)]">
                            {trip.departureCity} → {trip.destination}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(trip.id);
                        }}
                        className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-[var(--color-text-secondary)] transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-[var(--color-text-secondary)]">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {trip.days}天
                      </span>
                      <span className="flex items-center gap-1">
                        <Wallet size={12} />
                        ¥{trip.budget.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        {trip.travelers}人
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {trip.interests.map((int) => (
                        <span
                          key={int}
                          className="px-2 py-0.5 text-xs rounded-full bg-[#4F8EF7]/8 text-[#4F8EF7] flex items-center gap-1"
                        >
                          {getInterestIcon(int)}
                          {int}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-[var(--color-text-secondary)]">
                      创建于 {new Date(trip.createdAt).toLocaleDateString("zh-CN")}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Trip Detail */}
              <div className="lg:col-span-7">
                {!selectedTrip && trips.length > 0 && (
                  <div className="flex items-center justify-center h-full min-h-[400px]">
                    <p className="text-[var(--color-text-secondary)]">
                      选择左侧方案查看详情
                    </p>
                  </div>
                )}

                {selectedTrip && (
                  <AnimatedSection>
                    <div className="glass p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h2 className="text-2xl font-bold">
                            {selectedTrip.name}
                          </h2>
                          <p className="text-[var(--color-text-secondary)] mt-1">
                            {selectedTrip.departureCity} → {selectedTrip.destination} · {selectedTrip.days}天 · ¥{selectedTrip.budget.toLocaleString()} · {selectedTrip.travelers}人
                          </p>
                        </div>
                        <button
                          onClick={handleExport}
                          disabled={exporting}
                          className="btn-secondary flex items-center gap-2 text-sm"
                        >
                          {exporting ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity }}
                              >
                                <Sparkles size={16} />
                              </motion.div>
                              导出中...
                            </>
                          ) : (
                            <>
                              <Download size={16} />
                              导出 PDF
                            </>
                          )}
                        </button>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-4 gap-4 mb-6">
                        {[
                          { label: "天数", value: selectedTrip.days, unit: "天", icon: Clock },
                          { label: "预算", value: `¥${selectedTrip.budget.toLocaleString()}`, unit: "", icon: Wallet },
                          { label: "人数", value: selectedTrip.travelers, unit: "人", icon: Users },
                          { label: "节奏", value: selectedTrip.pace === "relaxed" ? "慢旅行" : selectedTrip.pace === "intensive" ? "特种兵" : "平衡", unit: "", icon: Compass },
                        ].map((stat) => (
                          <div
                            key={stat.label}
                            className="text-center p-3 rounded-xl bg-[var(--color-border)]"
                          >
                            <stat.icon size={14} className="mx-auto mb-1 text-[#4F8EF7]" />
                            <div className="text-lg font-bold gradient-text">
                              {stat.value}
                            </div>
                            <div className="text-xs text-[var(--color-text-secondary)]">
                              {stat.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Interests */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {selectedTrip.interests.map((int) => (
                          <span
                            key={int}
                            className="tag tag-active flex items-center gap-1.5"
                          >
                            {getInterestIcon(int)}
                            {int}
                          </span>
                        ))}
                      </div>

                      {/* View Detail */}
                      <div className="p-6 rounded-xl bg-[var(--color-border)] text-center">
                        <Link
                          href={`/city/${getSlug(selectedTrip.destination)}`}
                          className="btn-primary inline-flex items-center gap-2"
                        >
                          查看详情 <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </AnimatedSection>
                )}
              </div>
            </div>
          )}

          {activeTab === "favorites" && (
            <div>
              {favorites.length === 0 && (
                <div className="glass p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFB4A2]/10 to-[#4F8EF7]/10 flex items-center justify-center mx-auto mb-4">
                    <Heart size={28} className="text-[#FFB4A2]/30" />
                  </div>
                  <h3 className="font-bold mb-2">还没有收藏</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                    浏览目的地时点击心形图标即可收藏
                  </p>
                  <Link
                    href="/explorer"
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <Compass size={16} />
                    探索目的地
                    <ArrowRight size={16} />
                  </Link>
                </div>
              )}

              {favorites.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favorites.map((fav, i) => (
                    <motion.div
                      key={fav.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass-sm card-hover p-5"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFB4A2] to-[#4F8EF7] flex items-center justify-center text-white font-bold">
                            {fav.name[0]}
                          </div>
                          <div>
                            <h3 className="font-bold text-sm">{fav.name}</h3>
                            <p className="text-xs text-[var(--color-text-secondary)]">
                              收藏于 {new Date(fav.favoritedAt).toLocaleDateString("zh-CN")}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            toggleFavorite(fav);
                            setFavorites(getFavorites());
                          }}
                          className="text-red-400"
                        >
                          <Heart size={16} fill="currentColor" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

// WanderAI Recommendation Engine v2
// 18-city independent itinerary database, 1-7 day guide-style plans

import { cityPlans } from "./city-plans";

// ============ Interfaces ============

export type TravelStyle = "classic" | "food" | "nature" | "culture" | "family";

export interface TravelPreferences {
  budget: number;
  days: number;
  travelers: number;
  departureCity: string;
  interests: string[];
  pace: "relaxed" | "balanced" | "intensive";
  travelStyle?: TravelStyle;
}

export interface DayPlan {
  day: number;
  title: string;
  theme: string;
  highlights: string[];
  tip: string;
  activities?: { time: string; type: string; name: string; cost: number; description: string; duration: string }[];
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  region: string;
  matchScore: number;
  description: string;
  reasons: string[];
  estimatedCost: {
    transport: number; accommodation: number; food: number;
    activities: number; shopping: number; total: number;
  };
  bestSeason: string;
  tripLength: { min: number; ideal: number; max: number };
  hiddenGems: HiddenSpot[];
  dailyPlan: DayPlan[];
  tags: string[];
  imageGradient: string;
}

export interface HiddenSpot {
  id: string; name: string; lat: number; lng: number;
  description: string; reason: string; bestTime: string;
  estimatedTime: string; cost: string; nearbySpots: string[]; imageColor: string;
}

export interface PersonalizedRoute {
  original: string[];
  optimized: string[];
  timeSaved: string;
  steps: RouteStep[];
}

export interface RouteStep {
  order: number; name: string; description: string;
  arrivalTime: string; duration: string; transportMode: string; cost: string;
}

// ============ 18 City Destination Database ============

const destinations: Destination[] = [
  {
    id: "hangzhou", name: "杭州", country: "中国", region: "华东",
    matchScore: 0,
    description: "西湖烟雨，龙井茶香，一座让时光慢下来的城市。",
    reasons: [],
    estimatedCost: { transport: 1000, accommodation: 1900, food: 1000, activities: 425, shopping: 0, total: 5650 },
    bestSeason: "3-5月、9-11月",
    tripLength: { min: 1, ideal: 3, max: 7 },
    hiddenGems: [
      { id: "hg-hz-1", name: "小河直街", lat: 30.324, lng: 120.137, description: "运河边保留最完整的历史街区。", reason: "游客稀少，体验真正的老杭州。", bestTime: "下午 2:00-6:00", estimatedTime: "2-3小时", cost: "免费", nearbySpots: ["桥西历史街区", "运河天地"], imageColor: "#8BA888" },
      { id: "hg-hz-2", name: "法喜寺旁小路", lat: 30.238, lng: 120.116, description: "一条鲜有人知的山径通往茶园。", reason: "本地人的秘密花园。", bestTime: "清晨 6:00-9:00", estimatedTime: "1.5-2小时", cost: "免费", nearbySpots: ["法喜寺", "灵隐寺"], imageColor: "#5B8C5A" },
    ],
    dailyPlan: [],
    tags: ["City Walk", "咖啡馆", "摄影", "历史文化", "美食", "自然风光"],
    imageGradient: "linear-gradient(135deg, #4F8EF7, #7ED6C2)",
  },
  {
    id: "chongqing", name: "重庆", country: "中国", region: "西南",
    matchScore: 0,
    description: "8D魔幻山城，火锅的故乡，轻轨穿楼而过。",
    reasons: [],
    estimatedCost: { transport: 1150, accommodation: 1900, food: 1000, activities: 375, shopping: 0, total: 5800 },
    bestSeason: "3-5月、10-11月",
    tripLength: { min: 1, ideal: 3, max: 7 },
    hiddenGems: [
      { id: "hg-cq-1", name: "鹅岭二厂", lat: 29.555, lng: 106.538, description: "老印刷厂改造的文创园。", reason: "《从你的全世界路过》取景地，看渝中全景。", bestTime: "下午 3:00-6:00", estimatedTime: "2小时", cost: "免费", nearbySpots: ["鹅岭公园", "李子坝"], imageColor: "#708090" },
    ],
    dailyPlan: [],
    tags: ["美食", "夜景", "City Walk", "摄影", "历史文化"],
    imageGradient: "linear-gradient(135deg, #EF4444, #F97316)",
  },
  {
    id: "chengdu", name: "成都", country: "中国", region: "西南",
    matchScore: 0,
    description: "美食天堂，慢生活之都，来了就不想走的城市。",
    reasons: [],
    estimatedCost: { transport: 1150, accommodation: 1900, food: 1000, activities: 460, shopping: 0, total: 5900 },
    bestSeason: "3-6月、9-11月",
    tripLength: { min: 1, ideal: 3, max: 7 },
    hiddenGems: [
      { id: "hg-cd-1", name: "人民公园鹤鸣茶社", lat: 30.659, lng: 104.053, description: "百年茶馆，竹椅盖碗茶。", reason: "体验地道成都慢生活。", bestTime: "下午 2:00-5:00", estimatedTime: "2小时", cost: "¥20-40", nearbySpots: ["宽窄巷子", "锦里"], imageColor: "#A0522D" },
    ],
    dailyPlan: [],
    tags: ["美食", "历史文化", "City Walk", "自然风光"],
    imageGradient: "linear-gradient(135deg, #FFB4A2, #FF8A7A)",
  },
  {
    id: "xian", name: "西安", country: "中国", region: "西北",
    matchScore: 0,
    description: "十三朝古都，兵马俑守护的千年长安。",
    reasons: [],
    estimatedCost: { transport: 1050, accommodation: 1900, food: 1000, activities: 550, shopping: 0, total: 5900 },
    bestSeason: "3-5月、9-11月",
    tripLength: { min: 1, ideal: 3, max: 7 },
    hiddenGems: [
      { id: "hg-xa-1", name: "洒金桥", lat: 34.268, lng: 108.934, description: "比回民街更地道的回坊美食街。", reason: "本地人真正吃美食的地方。", bestTime: "傍晚 5:00-9:00", estimatedTime: "1.5小时", cost: "¥30-80", nearbySpots: ["回民街", "钟楼"], imageColor: "#B8860B" },
    ],
    dailyPlan: [],
    tags: ["历史文化", "美食", "博物馆", "夜景"],
    imageGradient: "linear-gradient(135deg, #DC2626, #B45309)",
  },
  {
    id: "beijing", name: "北京", country: "中国", region: "华北",
    matchScore: 0,
    description: "红墙黄瓦紫禁城，胡同深处的帝都烟火。",
    reasons: [],
    estimatedCost: { transport: 1500, accommodation: 1900, food: 1000, activities: 475, shopping: 0, total: 6300 },
    bestSeason: "4-5月、9-10月",
    tripLength: { min: 1, ideal: 4, max: 7 },
    hiddenGems: [
      { id: "hg-bj-1", name: "五道营胡同", lat: 39.946, lng: 116.410, description: "比南锣鼓巷安静十倍的文艺胡同。", reason: "独立小店、咖啡馆与老北京生活并存。", bestTime: "下午 2:00-6:00", estimatedTime: "2小时", cost: "免费", nearbySpots: ["国子监", "雍和宫"], imageColor: "#8B4513" },
    ],
    dailyPlan: [],
    tags: ["历史文化", "美食", "博物馆", "City Walk"],
    imageGradient: "linear-gradient(135deg, #DC2626, #F59E0B)",
  },
  {
    id: "shanghai", name: "上海", country: "中国", region: "华东",
    matchScore: 0,
    description: "咖啡馆密度全国第一，从法租界到外滩，每个街区都有惊喜。",
    reasons: [],
    estimatedCost: { transport: 1500, accommodation: 1900, food: 1000, activities: 675, shopping: 0, total: 6650 },
    bestSeason: "3-5月、10-11月",
    tripLength: { min: 1, ideal: 3, max: 7 },
    hiddenGems: [
      { id: "hg-sh-1", name: "永康路咖啡街", lat: 31.211, lng: 121.449, description: "每10步一家独立咖啡馆。", reason: "上海咖啡文化的精髓。", bestTime: "下午 2:00-6:00", estimatedTime: "2小时", cost: "¥40-80", nearbySpots: ["武康路", "安福路"], imageColor: "#8B4513" },
    ],
    dailyPlan: [],
    tags: ["咖啡馆", "City Walk", "美食", "摄影", "购物"],
    imageGradient: "linear-gradient(135deg, #7B68EE, #4F8EF7)",
  },
  {
    id: "guangzhou", name: "广州", country: "中国", region: "华南",
    matchScore: 0,
    description: "食在广州，早茶文化渗透到每个清晨。",
    reasons: [],
    estimatedCost: { transport: 1300, accommodation: 1900, food: 1000, activities: 450, shopping: 0, total: 6100 },
    bestSeason: "10-12月、3-5月",
    tripLength: { min: 1, ideal: 3, max: 7 },
    hiddenGems: [
      { id: "hg-gz-1", name: "东山口", lat: 23.129, lng: 113.289, description: "民国洋楼群，有广州鼓浪屿之称。", reason: "红砖洋楼+独立咖啡馆，文艺到骨子里。", bestTime: "下午 2:00-6:00", estimatedTime: "2-3小时", cost: "免费", nearbySpots: ["培正路", "均益路"], imageColor: "#C41E3A" },
    ],
    dailyPlan: [],
    tags: ["美食", "City Walk", "历史文化", "购物"],
    imageGradient: "linear-gradient(135deg, #E74C3C, #F39C12)",
  },
  {
    id: "shenzhen", name: "深圳", country: "中国", region: "华南",
    matchScore: 0,
    description: "年轻之城，山海连城，最美海岸线公园。",
    reasons: [],
    estimatedCost: { transport: 1300, accommodation: 1900, food: 1000, activities: 415, shopping: 0, total: 6050 },
    bestSeason: "10-4月",
    tripLength: { min: 1, ideal: 2, max: 7 },
    hiddenGems: [
      { id: "hg-sz-1", name: "华侨城创意园", lat: 22.539, lng: 113.976, description: "旧厂房改造的艺术街区。", reason: "周末市集+独立书店+设计商店。", bestTime: "周末下午", estimatedTime: "2-3小时", cost: "免费", nearbySpots: ["世界之窗", "锦绣中华"], imageColor: "#4682B4" },
    ],
    dailyPlan: [],
    tags: ["City Walk", "摄影", "海边", "购物"],
    imageGradient: "linear-gradient(135deg, #2E86AB, #A2D5C6)",
  },
  {
    id: "suzhou", name: "苏州", country: "中国", region: "华东",
    matchScore: 0,
    description: "园林甲天下，小桥流水，吴侬软语。",
    reasons: [],
    estimatedCost: { transport: 850, accommodation: 1900, food: 1000, activities: 425, shopping: 0, total: 5450 },
    bestSeason: "3-5月、9-11月",
    tripLength: { min: 1, ideal: 2, max: 7 },
    hiddenGems: [
      { id: "hg-sz-1", name: "艺圃", lat: 31.316, lng: 120.607, description: "藏在巷弄里的小园林，本地人最爱。", reason: "比拙政园安静十倍，门票仅10元。", bestTime: "上午 9:00-11:00", estimatedTime: "1-1.5小时", cost: "¥10", nearbySpots: ["山塘街", "石路"], imageColor: "#5B8C5A" },
    ],
    dailyPlan: [],
    tags: ["历史文化", "古镇", "摄影", "City Walk"],
    imageGradient: "linear-gradient(135deg, #059669, #34D399)",
  },
  {
    id: "nanjing", name: "南京", country: "中国", region: "华东",
    matchScore: 0,
    description: "六朝古都，梧桐大道，金陵烟雨。",
    reasons: [],
    estimatedCost: { transport: 850, accommodation: 1900, food: 1000, activities: 425, shopping: 0, total: 5450 },
    bestSeason: "3-5月、10-11月",
    tripLength: { min: 1, ideal: 3, max: 7 },
    hiddenGems: [
      { id: "hg-nj-1", name: "颐和路", lat: 32.053, lng: 118.769, description: "1500米民国公馆区，200多栋别墅。", reason: "秋天梧桐金黄，南京最美街道。", bestTime: "下午 3:00-5:00", estimatedTime: "1.5小时", cost: "免费", nearbySpots: ["先锋书店", "上海路"], imageColor: "#DAA520" },
    ],
    dailyPlan: [],
    tags: ["历史文化", "美食", "City Walk", "博物馆"],
    imageGradient: "linear-gradient(135deg, #78716C, #A8A29E)",
  },
  {
    id: "changsha", name: "长沙", country: "中国", region: "华中",
    matchScore: 0,
    description: "星城不夜天，茶颜悦色的快乐老家。",
    reasons: [],
    estimatedCost: { transport: 850, accommodation: 1900, food: 1000, activities: 415, shopping: 0, total: 5450 },
    bestSeason: "3-5月、10-11月",
    tripLength: { min: 1, ideal: 2, max: 7 },
    hiddenGems: [
      { id: "hg-cs-1", name: "潮宗街", lat: 28.204, lng: 112.972, description: "长沙新晋网红街区。", reason: "韩国街头既视感，拍照超出片。", bestTime: "下午 3:00-6:00", estimatedTime: "1.5小时", cost: "免费", nearbySpots: ["IFS", "五一广场"], imageColor: "#FF69B4" },
    ],
    dailyPlan: [],
    tags: ["美食", "夜景", "City Walk", "摄影"],
    imageGradient: "linear-gradient(135deg, #F97316, #EF4444)",
  },
  {
    id: "qingdao", name: "青岛", country: "中国", region: "华东",
    matchScore: 0,
    description: "红瓦绿树，碧海蓝天，啤酒泡沫里的浪漫。",
    reasons: [],
    estimatedCost: { transport: 1050, accommodation: 1900, food: 1000, activities: 415, shopping: 0, total: 5750 },
    bestSeason: "5-10月",
    tripLength: { min: 1, ideal: 3, max: 7 },
    hiddenGems: [
      { id: "hg-qd-1", name: "小麦岛", lat: 36.060, lng: 120.383, description: "新晋日落打卡圣地。", reason: "人少景美，日落时分拍剪影绝佳。", bestTime: "日落前1小时", estimatedTime: "1.5小时", cost: "免费", nearbySpots: ["极地海洋世界", "石老人"], imageColor: "#87CEEB" },
    ],
    dailyPlan: [],
    tags: ["海边", "美食", "摄影", "City Walk"],
    imageGradient: "linear-gradient(135deg, #0EA5E9, #06B6D4)",
  },
  {
    id: "xiamen", name: "厦门", country: "中国", region: "华东",
    matchScore: 0,
    description: "海上花园鼓浪屿，文艺到骨子里的鹭岛。",
    reasons: [],
    estimatedCost: { transport: 1000, accommodation: 1900, food: 1000, activities: 425, shopping: 0, total: 5650 },
    bestSeason: "3-5月、10-12月",
    tripLength: { min: 1, ideal: 3, max: 7 },
    hiddenGems: [
      { id: "hg-xm-1", name: "华新路", lat: 24.452, lng: 118.088, description: "老别墅区，不在书店所在地。", reason: "比鼓浪屿安静，地道厦门生活。", bestTime: "下午 2:00-5:00", estimatedTime: "1.5小时", cost: "免费", nearbySpots: ["中山公园", "百家村"], imageColor: "#8FBC8F" },
    ],
    dailyPlan: [],
    tags: ["海边", "咖啡", "摄影", "City Walk"],
    imageGradient: "linear-gradient(135deg, #60A5FA, #34D399)",
  },
  {
    id: "kunming", name: "昆明", country: "中国", region: "西南",
    matchScore: 0,
    description: "春城无处不飞花，四季如春的慵懒日光。",
    reasons: [],
    estimatedCost: { transport: 1350, accommodation: 1900, food: 1000, activities: 450, shopping: 0, total: 6100 },
    bestSeason: "全年皆宜",
    tripLength: { min: 1, ideal: 3, max: 7 },
    hiddenGems: [
      { id: "hg-km-1", name: "斗南花市", lat: 24.903, lng: 102.774, description: "亚洲最大鲜花交易市场。", reason: "鲜花按斤卖，10块钱买一怀春天。", bestTime: "上午 9:00-11:00", estimatedTime: "2小时", cost: "¥10-50", nearbySpots: ["滇池", "官渡古镇"], imageColor: "#FF69B4" },
    ],
    dailyPlan: [],
    tags: ["自然风光", "摄影", "美食", "City Walk"],
    imageGradient: "linear-gradient(135deg, #F472B6, #A78BFA)",
  },
  {
    id: "dali", name: "大理", country: "中国", region: "西南",
    matchScore: 0,
    description: "苍山洱海，风花雪月，理想中的诗与远方。",
    reasons: [],
    estimatedCost: { transport: 1350, accommodation: 1900, food: 1000, activities: 415, shopping: 0, total: 6050 },
    bestSeason: "3-5月、9-11月",
    tripLength: { min: 2, ideal: 4, max: 7 },
    hiddenGems: [
      { id: "hg-dl-1", name: "寂照庵", lat: 25.680, lng: 100.138, description: "最美尼姑庵，多肉植物天堂。", reason: "免费斋饭好吃，环境静谧。", bestTime: "上午 11:00前", estimatedTime: "2小时", cost: "免费", nearbySpots: ["感通索道", "苍山"], imageColor: "#228B22" },
    ],
    dailyPlan: [],
    tags: ["自然风光", "摄影", "古镇", "咖啡馆"],
    imageGradient: "linear-gradient(135deg, #06B6D4, #8B5CF6)",
  },
  {
    id: "lijiang", name: "丽江", country: "中国", region: "西南",
    matchScore: 0,
    description: "一米阳光，纳西古城，玉龙雪山下的人间烟火。",
    reasons: [],
    estimatedCost: { transport: 1500, accommodation: 1900, food: 1000, activities: 450, shopping: 0, total: 6300 },
    bestSeason: "4-10月",
    tripLength: { min: 2, ideal: 4, max: 7 },
    hiddenGems: [
      { id: "hg-lj-1", name: "白沙古镇", lat: 26.978, lng: 100.219, description: "比大研和束河更原始的纳西古镇。", reason: "抬头就是雪山，游客少得感人。", bestTime: "上午 9:00-12:00", estimatedTime: "2-3小时", cost: "免费", nearbySpots: ["玉湖村", "文海"], imageColor: "#DEB887" },
    ],
    dailyPlan: [],
    tags: ["古镇", "自然风光", "摄影", "历史文化"],
    imageGradient: "linear-gradient(135deg, #8B5CF6, #EC4899)",
  },
  {
    id: "haerbin", name: "哈尔滨", country: "中国", region: "东北",
    matchScore: 0,
    description: "东方莫斯科，冰雪王国，面包石铺就的欧陆风情。",
    reasons: [],
    estimatedCost: { transport: 1750, accommodation: 1900, food: 1000, activities: 450, shopping: 0, total: 6800 },
    bestSeason: "12-2月（冰雪）、6-8月（避暑）",
    tripLength: { min: 1, ideal: 3, max: 7 },
    hiddenGems: [
      { id: "hg-heb-1", name: "老道外中华巴洛克", lat: 45.777, lng: 126.637, description: "百年前的中国巴洛克建筑群。", reason: "比中央大街更原生态。", bestTime: "上午 9:00-12:00", estimatedTime: "2小时", cost: "免费", nearbySpots: ["靖宇街", "道外小吃"], imageColor: "#D2691E" },
    ],
    dailyPlan: [],
    tags: ["历史文化", "美食", "摄影", "City Walk"],
    imageGradient: "linear-gradient(135deg, #93C5FD, #60A5FA)",
  },
  {
    id: "sanya", name: "三亚", country: "中国", region: "华南",
    matchScore: 0,
    description: "东方夏威夷，椰风海韵，中国最南端的热带天堂。",
    reasons: [],
    estimatedCost: { transport: 2750, accommodation: 1900, food: 1000, activities: 525, shopping: 0, total: 8400 },
    bestSeason: "10-4月",
    tripLength: { min: 2, ideal: 4, max: 7 },
    hiddenGems: [
      { id: "hg-sy-1", name: "后海村", lat: 18.221, lng: 109.653, description: "三亚最后的渔村。", reason: "比三亚湾安静，冲浪新手天堂。", bestTime: "上午 8:00-11:00", estimatedTime: "半天", cost: "免费", nearbySpots: ["蜈支洲岛", "海棠湾"], imageColor: "#00CED1" },
    ],
    dailyPlan: [],
    tags: ["海边", "自然风光", "摄影", "美食"],
    imageGradient: "linear-gradient(135deg, #06B6D4, #F59E0B)",
  },
];

// ============ Interest Tag Weights ============

const interestWeights: Record<string, string[]> = {
  "摄影": ["摄影", "City Walk", "自然风光", "古镇"],
  "美食": ["美食", "City Walk", "夜市"],
  "自然风光": ["自然风光", "户外", "摄影"],
  "历史文化": ["历史文化", "博物馆", "古镇"],
  "咖啡馆": ["咖啡馆", "City Walk", "摄影"],
  "咖啡": ["咖啡馆", "City Walk", "摄影"],
  "City Walk": ["City Walk", "咖啡馆", "摄影", "美食"],
  "夜景": ["夜景", "City Walk", "摄影"],
  "博物馆": ["博物馆", "历史文化"],
  "购物": ["购物", "City Walk", "美食"],
  "露营": ["自然风光", "户外", "海边"],
  "海边": ["海边", "自然风光", "摄影"],
  "古镇": ["古镇", "历史文化", "摄影"],
};

// ============ Travel Style Weights for Plan Filtering ============

const styleThemes: Record<TravelStyle, string[]> = {
  classic: ["经典打卡", "城市精华", "核心景点", "经典", "城市地标", "都市"],
  food: ["美食", "寻味", "好吃", "烟火", "夜市", "小吃", "早茶", "火锅"],
  nature: ["自然", "风光", "山海", "户外", "生态", "海岸", "骑行", "徒步"],
  culture: ["历史", "文化", "博物", "艺术", "古迹", "文明", "遗产", "千年"],
  family: ["亲子", "乐园", "动物", "科普", "轻松", "休闲", "适合全家"],
};

function styleScore(planThemes: string[], style: TravelStyle): number {
  if (!style || style === "classic") return 1; // classic = no filter, return all
  const keywords = styleThemes[style] || [];
  let score = 0;
  for (const t of planThemes) {
    for (const kw of keywords) {
      if (t.includes(kw)) { score += 3; break; }
    }
  }
  return score;
}

// ============ Daily Plan Generator ============

export function generateDailyPlan(dest: Destination, prefs: TravelPreferences): DayPlan[] {
  const maxDays = dest.tripLength.max || 7;
  const days = Math.min(prefs.days, maxDays);

  // 1) Try city-specific plans
  const cityPlan = cityPlans[dest.id];
  if (cityPlan && cityPlan[days]) {
    let plans = cityPlan[days];

    // Apply travel style filtering
    const style = prefs.travelStyle || "classic";
    if (style !== "classic" && days >= 2) {
      // For multi-day trips, reorder/select based on style relevance
      const scored: { p: any; i: number; s: number }[] = plans.map((p: any, i: number) => ({ p, i, s: styleScore([p.theme], style) }));
      // Keep all plans but sort by style relevance (keep day order within groups)
      const top = scored.filter(x => x.s > 0);
      const rest = scored.filter(x => x.s === 0);
      const reordered = [...top.sort((a, b) => b.s - a.s), ...rest];
      plans = reordered.map(x => x.p);
    }

    return plans;
  }

  // 2) Fallback: use day 2 plan as template (should not happen with 18 cities covered)
  const fallback = cityPlans[dest.id]?.[2] || [];
  return fallback.slice(0, days);
}

export function getMaxDays(cityId: string): number {
  const dest = destinations.find(d => d.id === cityId);
  return dest?.tripLength.max || 7;
}

// ============ Recommendation Engine ============

export function getRecommendations(prefs: TravelPreferences): Destination[] {
  const scored = destinations.map((dest) => {
    let score = 0;
    for (const interest of prefs.interests) {
      const relatedTags = interestWeights[interest] || [interest];
      for (const tag of relatedTags) {
        if (dest.tags.includes(tag)) { score += 3; }
      }
      if (dest.tags.includes(interest)) { score += 5; }
    }
    const budgetDiff = Math.abs(dest.estimatedCost.total - prefs.budget);
    if (budgetDiff < 500) score += 10;
    else if (budgetDiff < 1000) score += 7;
    else if (budgetDiff < 2000) score += 4;
    else if (budgetDiff < 4000) score += 1;
    if (prefs.days >= dest.tripLength.min && prefs.days <= dest.tripLength.ideal + 2) { score += 8; }
    else if (prefs.days >= dest.tripLength.ideal - 1) { score += 4; }
    if (prefs.days <= 2) {
      if (dest.region === "华东" && prefs.departureCity === "上海") score += 6;
      if (dest.region === "华南" && prefs.departureCity === "深圳") score += 6;
      if (dest.region === "西南" && prefs.departureCity === "成都") score += 6;
    }
    if (prefs.travelers > 4 && dest.tags.includes("美食")) score += 3;
    if (prefs.travelers === 1 && dest.tags.includes("咖啡馆")) score += 3;
    if (prefs.pace === "relaxed" && dest.tags.includes("自然风光")) score += 3;
    if (prefs.pace === "intensive" && dest.tags.includes("City Walk")) score += 3;
    return { ...dest, matchScore: Math.round(score), reasons: generateReasons(dest, prefs) };
  });
  return scored.filter((d) => d.matchScore > 0).sort((a, b) => b.matchScore - a.matchScore).slice(0, 8);
}

function generateReasons(dest: Destination, prefs: TravelPreferences): string[] {
  const reasons: string[] = [];
  const matchedInterests = prefs.interests.filter((i) => dest.tags.some((t) => t === i));
  if (matchedInterests.length > 0) { reasons.push(`完美匹配你的「${matchedInterests.slice(0, 2).join("」「")}」偏好`); }
  const budgetDiff = dest.estimatedCost.total - prefs.budget;
  if (Math.abs(budgetDiff) < 500) { reasons.push("预算完美契合"); }
  else if (budgetDiff < 0) { reasons.push(`比预算低 ¥${Math.abs(budgetDiff)}，可以省下钱多喝几杯咖啡`); }
  if (prefs.days >= dest.tripLength.ideal) { reasons.push(`时间充裕，可以放慢脚步感受`); }
  if (dest.hiddenGems.length >= 2) { reasons.push(`拥有 ${dest.hiddenGems.length} 个隐藏打卡点`); }
  return reasons;
}

// ============ Route Optimization ============

export function optimizeRoute(
  places: { name: string; lat: number; lng: number }[]
): { optimized: string[]; timeSaved: string; steps: RouteStep[] } {
  if (places.length <= 2) {
    return {
      optimized: places.map((p) => p.name),
      timeSaved: "路线已是最优",
      steps: places.map((p, i) => ({ order: i + 1, name: p.name, description: "", arrivalTime: `Day 1 ${9 + i * 2}:00`, duration: "1.5小时", transportMode: "步行/地铁", cost: "¥10" })),
    };
  }
  const visited = new Set<number>();
  const order: number[] = [0]; visited.add(0);
  while (visited.size < places.length) {
    let last = order[order.length - 1], nearest = -1, minDist = Infinity;
    for (let i = 0; i < places.length; i++) {
      if (visited.has(i)) continue;
      const dist = Math.sqrt((places[last].lat - places[i].lat) ** 2 + (places[last].lng - places[i].lng) ** 2);
      if (dist < minDist) { minDist = dist; nearest = i; }
    }
    if (nearest >= 0) { visited.add(nearest); order.push(nearest); }
  }
  const optimized = order.map((i) => places[i].name);
  const steps: RouteStep[] = optimized.map((name, i) => ({
    order: i + 1, name,
    description: i === 0 ? "出发起点" : "从上一站前往",
    arrivalTime: `Day 1 ${9 + i * 2}:${(i * 30) % 60 < 10 ? "0" : ""}${(i * 30) % 60}`,
    duration: "1.5小时",
    transportMode: i <= 1 ? "步行" : "地铁/公交",
    cost: i <= 1 ? "¥0" : `¥${Math.floor(Math.random() * 5 + 3)}`,
  }));
  return { optimized, timeSaved: "预计节省 25% 路程时间", steps };
}

// ============ Travel Styles & Demo ============

export const travelStyles = [
  { id: "classic" as TravelStyle, name: "经典打卡", icon: "Zap", description: "必去景点一网打尽，经典不留遗憾。", budget: "¥3,000-6,700", season: "全年皆宜", destinations: ["北京", "西安", "上海", "杭州"], gradient: "linear-gradient(135deg, #6366F1, #8B5CF6)" },
  { id: "food" as TravelStyle, name: "美食探索", icon: "UtensilsCrossed", description: "从街头小吃到老字号，吃遍一座城。", budget: "¥3,100-7,400", season: "全年皆宜", destinations: ["成都", "重庆", "长沙", "广州"], gradient: "linear-gradient(135deg, #EF4444, #F97316)" },
  { id: "nature" as TravelStyle, name: "自然风光", icon: "TreePine", description: "在雪山湖泊间找回平静。", budget: "¥3,000-7,100", season: "5-10月", destinations: ["大理", "昆明", "三亚", "青岛"], gradient: "linear-gradient(135deg, #059669, #10B981)" },
  { id: "culture" as TravelStyle, name: "历史文化", icon: "Landmark", description: "触摸千年时光，读懂一座城。", budget: "¥2,900-5,900", season: "全年皆宜", destinations: ["北京", "西安", "南京", "苏州"], gradient: "linear-gradient(135deg, #DC2626, #B45309)" },
  { id: "family" as TravelStyle, name: "亲子家庭", icon: "Baby", description: "轻松不累，大人小孩都开心。", budget: "¥3,200-7,800", season: "寒暑假最佳", destinations: ["广州", "深圳", "厦门", "三亚"], gradient: "linear-gradient(135deg, #F59E0B, #EC4899)" },
];

export const demoPreset: TravelPreferences = {
  departureCity: "上海", budget: 5000, days: 2, travelers: 1,
  interests: ["咖啡馆", "摄影", "City Walk"], pace: "balanced",
  travelStyle: "classic",
};

export { destinations };

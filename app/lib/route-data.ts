// WanderAI Route Optimizer — 15 城市完整示例路线库
// 每个城市包含至少 5 个地点的路线，及优化后排序、时间估算、推荐交通

export interface CityRoute {
  city: string;
  region: string;
  places: { name: string; lat: number; lng: number; type: string }[];
  optimizedOrder: string[];
  estimatedTimeSaved: string;
  totalDuration: string;
  recommendedTransport: string;
  description: string;
}

export const cityRoutes: CityRoute[] = [
  {
    city: "北京",
    region: "华北",
    description: "中轴线+胡同深度游，从故宫周边到胡同咖啡馆",
    totalDuration: "一天（约8小时）",
    estimatedTimeSaved: "节省约 35% 往返路程",
    recommendedTransport: "地铁+共享单车",
    places: [
      { name: "故宫", lat: 39.916, lng: 116.397, type: "景点" },
      { name: "景山公园", lat: 39.923, lng: 116.396, type: "景点" },
      { name: "杨梅竹斜街", lat: 39.893, lng: 116.395, type: "胡同" },
      { name: "五道营胡同", lat: 39.945, lng: 116.41, type: "胡同" },
      { name: "簋街", lat: 39.938, lng: 116.428, type: "美食" },
      { name: "南锣鼓巷", lat: 39.937, lng: 116.403, type: "胡同" },
    ],
    optimizedOrder: [
      "故宫", "景山公园", "南锣鼓巷", "五道营胡同",
      "簋街", "杨梅竹斜街",
    ],
  },
  {
    city: "上海",
    region: "华东",
    description: "法租界文艺一日，从老洋房到外滩夜景",
    totalDuration: "一天（约8小时）",
    estimatedTimeSaved: "节省约 30% 路程时间",
    recommendedTransport: "地铁+步行",
    places: [
      { name: "南昌路", lat: 31.215, lng: 121.458, type: "街区" },
      { name: "武康大楼", lat: 31.21, lng: 121.44, type: "地标" },
      { name: "1933老场坊", lat: 31.258, lng: 121.495, type: "艺术" },
      { name: "外滩", lat: 31.24, lng: 121.49, type: "夜景" },
      { name: "新天地", lat: 31.22, lng: 121.47, type: "商圈" },
      { name: "M50创意园", lat: 31.248, lng: 121.43, type: "艺术" },
    ],
    optimizedOrder: [
      "M50创意园", "新天地", "南昌路",
      "武康大楼", "1933老场坊", "外滩",
    ],
  },
  {
    city: "杭州",
    region: "华东",
    description: "西湖秘境+运河文艺一日",
    totalDuration: "一天（约8小时）",
    estimatedTimeSaved: "节省约 40% 路程时间",
    recommendedTransport: "地铁+公交+步行",
    places: [
      { name: "西湖", lat: 30.2417, lng: 120.1408, type: "景点" },
      { name: "法喜寺", lat: 30.238, lng: 120.116, type: "寺庙" },
      { name: "小河直街", lat: 30.324, lng: 120.137, type: "街区" },
      { name: "龙井村", lat: 30.22, lng: 120.115, type: "茶山" },
      { name: "馒头山社区", lat: 30.245, lng: 120.168, type: "社区" },
    ],
    optimizedOrder: [
      "法喜寺", "龙井村", "西湖",
      "馒头山社区", "小河直街",
    ],
  },
  {
    city: "苏州",
    region: "华东",
    description: "古城巷弄+园林茶馆慢生活",
    totalDuration: "一天（约7小时）",
    estimatedTimeSaved: "节省约 25% 路程时间",
    recommendedTransport: "地铁+步行",
    places: [
      { name: "拙政园", lat: 31.326, lng: 120.625, type: "园林" },
      { name: "平江路", lat: 31.315, lng: 120.633, type: "街区" },
      { name: "苏州博物馆", lat: 31.324, lng: 120.623, type: "博物馆" },
      { name: "葑门横街", lat: 31.298, lng: 120.645, type: "美食" },
      { name: "山塘街", lat: 31.32, lng: 120.59, type: "街区" },
    ],
    optimizedOrder: [
      "苏州博物馆", "拙政园", "平江路",
      "葑门横街", "山塘街",
    ],
  },
  {
    city: "南京",
    region: "华东",
    description: "民国漫步+先锋书店+秦淮夜泊",
    totalDuration: "一天（约8小时）",
    estimatedTimeSaved: "节省约 30% 路程时间",
    recommendedTransport: "地铁+步行",
    places: [
      { name: "颐和路", lat: 32.055, lng: 118.768, type: "街区" },
      { name: "先锋书店", lat: 32.052, lng: 118.77, type: "书店" },
      { name: "老门东", lat: 32.015, lng: 118.788, type: "街区" },
      { name: "夫子庙", lat: 32.02, lng: 118.79, type: "景点" },
      { name: "科巷", lat: 32.04, lng: 118.79, type: "美食" },
      { name: "玄武湖", lat: 32.07, lng: 118.79, type: "自然" },
    ],
    optimizedOrder: [
      "玄武湖", "颐和路", "先锋书店",
      "科巷", "老门东", "夫子庙",
    ],
  },
  {
    city: "成都",
    region: "西南",
    description: "文艺成都一天：从工业艺术区到深夜小酒馆",
    totalDuration: "一天（约9小时）",
    estimatedTimeSaved: "节省约 25% 路程时间",
    recommendedTransport: "地铁+共享单车",
    places: [
      { name: "东郊记忆", lat: 30.66, lng: 104.12, type: "艺术区" },
      { name: "宽窄巷子", lat: 30.668, lng: 104.053, type: "街区" },
      { name: "文殊院香园", lat: 30.675, lng: 104.068, type: "茶馆" },
      { name: "玉林路", lat: 30.625, lng: 104.048, type: "美食" },
      { name: "太古里", lat: 30.653, lng: 104.083, type: "商圈" },
      { name: "無早书店", lat: 30.65, lng: 104.078, type: "书店" },
    ],
    optimizedOrder: [
      "文殊院香园", "宽窄巷子", "無早书店",
      "太古里", "东郊记忆", "玉林路",
    ],
  },
  {
    city: "重庆",
    region: "西南",
    description: "8D魔幻一日：悬崖步道、老茶馆、天台日落",
    totalDuration: "一天（约8小时）",
    estimatedTimeSaved: "节省约 30% 路程时间",
    recommendedTransport: "轻轨+步行（穿舒适的鞋！）",
    places: [
      { name: "交通茶馆", lat: 29.51, lng: 106.547, type: "茶馆" },
      { name: "鹅岭贰厂", lat: 29.55, lng: 106.54, type: "天台" },
      { name: "山城巷", lat: 29.553, lng: 106.572, type: "步道" },
      { name: "洪崖洞", lat: 29.563, lng: 106.578, type: "夜景" },
      { name: "下浩里老街", lat: 29.545, lng: 106.59, type: "街区" },
    ],
    optimizedOrder: [
      "交通茶馆", "鹅岭贰厂", "山城巷",
      "下浩里老街", "洪崖洞",
    ],
  },
  {
    city: "西安",
    region: "西北",
    description: "古都慢时光：书院门笔墨香到洒金桥烟火气",
    totalDuration: "一天（约8小时）",
    estimatedTimeSaved: "节省约 28% 路程时间",
    recommendedTransport: "地铁+步行",
    places: [
      { name: "兵马俑", lat: 34.385, lng: 109.273, type: "景点" },
      { name: "碑林博物馆", lat: 34.255, lng: 108.948, type: "博物馆" },
      { name: "书院门", lat: 34.255, lng: 108.943, type: "街区" },
      { name: "洒金桥", lat: 34.268, lng: 108.935, type: "美食" },
      { name: "大雁塔", lat: 34.215, lng: 108.96, type: "景点" },
      { name: "大唐不夜城", lat: 34.21, lng: 108.963, type: "夜景" },
    ],
    optimizedOrder: [
      "兵马俑", "洒金桥", "书院门",
      "碑林博物馆", "大雁塔", "大唐不夜城",
    ],
  },
  {
    city: "厦门",
    region: "华东",
    description: "海岛文艺一天：沙坡尾渔港到老别墅书店",
    totalDuration: "一天（约7小时）",
    estimatedTimeSaved: "节省约 22% 路程时间",
    recommendedTransport: "公交+步行",
    places: [
      { name: "沙坡尾", lat: 24.44, lng: 118.08, type: "艺术区" },
      { name: "第八菜市场", lat: 24.452, lng: 118.08, type: "美食" },
      { name: "鼓浪屿", lat: 24.448, lng: 118.068, type: "景点" },
      { name: "不在书店", lat: 24.448, lng: 118.078, type: "书店" },
      { name: "环岛路", lat: 24.435, lng: 118.105, type: "自然" },
    ],
    optimizedOrder: [
      "第八菜市场", "不在书店", "鼓浪屿",
      "沙坡尾", "环岛路",
    ],
  },
  {
    city: "广州",
    region: "华南",
    description: "西关旧梦：恩宁路骑楼到东山口红砖洋楼",
    totalDuration: "一天（约8小时）",
    estimatedTimeSaved: "节省约 25% 路程时间",
    recommendedTransport: "地铁+步行",
    places: [
      { name: "恩宁路", lat: 23.118, lng: 113.235, type: "街区" },
      { name: "上下九", lat: 23.12, lng: 113.245, type: "商圈" },
      { name: "东山口", lat: 23.125, lng: 113.295, type: "街区" },
      { name: "泮塘五约", lat: 23.125, lng: 113.23, type: "古村" },
      { name: "1200bookshop", lat: 23.133, lng: 113.328, type: "书店" },
      { name: "珠江新城", lat: 23.12, lng: 113.32, type: "夜景" },
    ],
    optimizedOrder: [
      "泮塘五约", "恩宁路", "上下九",
      "东山口", "1200bookshop", "珠江新城",
    ],
  },
  {
    city: "深圳",
    region: "华南",
    description: "周末逃离：蛇口海边美术馆到华侨城创意市集",
    totalDuration: "一天（约7小时）",
    estimatedTimeSaved: "节省约 20% 路程时间",
    recommendedTransport: "地铁",
    places: [
      { name: "海上世界文化艺术中心", lat: 22.485, lng: 113.915, type: "艺术" },
      { name: "华侨城创意园", lat: 22.543, lng: 113.97, type: "艺术区" },
      { name: "较场尾", lat: 22.58, lng: 114.485, type: "海边" },
      { name: "深圳湾公园", lat: 22.52, lng: 113.95, type: "自然" },
      { name: "蛇口老街", lat: 22.49, lng: 113.92, type: "美食" },
    ],
    optimizedOrder: [
      "海上世界文化艺术中心", "蛇口老街", "深圳湾公园",
      "华侨城创意园", "较场尾",
    ],
  },
  {
    city: "大理",
    region: "西南",
    description: "洱海西线：日出码头、稻田咖啡、扎染体验",
    totalDuration: "一天（约9小时）",
    estimatedTimeSaved: "节省约 35% 路程时间",
    recommendedTransport: "电动车/租车",
    places: [
      { name: "龙龛码头", lat: 25.63, lng: 100.18, type: "日出点" },
      { name: "大理古城", lat: 25.678, lng: 100.158, type: "古城" },
      { name: "喜洲古镇", lat: 25.855, lng: 100.118, type: "古镇" },
      { name: "周城扎染", lat: 25.89, lng: 100.105, type: "非遗" },
      { name: "崇圣寺三塔", lat: 25.705, lng: 100.143, type: "景点" },
    ],
    optimizedOrder: [
      "龙龛码头", "大理古城", "崇圣寺三塔",
      "周城扎染", "喜洲古镇",
    ],
  },
  {
    city: "丽江",
    region: "西南",
    description: "避开人潮：白沙壁画、文海花海、忠义市场",
    totalDuration: "一天（约9小时）",
    estimatedTimeSaved: "节省约 30% 路程时间",
    recommendedTransport: "租车",
    places: [
      { name: "白沙古镇", lat: 26.958, lng: 100.215, type: "古镇" },
      { name: "文海", lat: 26.99, lng: 100.17, type: "自然" },
      { name: "束河古镇", lat: 26.92, lng: 100.198, type: "古镇" },
      { name: "忠义市场", lat: 26.868, lng: 100.232, type: "美食" },
      { name: "大研古城", lat: 26.875, lng: 100.234, type: "古城" },
    ],
    optimizedOrder: [
      "忠义市场", "大研古城", "束河古镇",
      "白沙古镇", "文海",
    ],
  },
  {
    city: "青岛",
    region: "华东",
    description: "红瓦绿树：梧桐隧道、大学路转角、啤酒夜市",
    totalDuration: "一天（约7小时）",
    estimatedTimeSaved: "节省约 22% 路程时间",
    recommendedTransport: "公交+步行",
    places: [
      { name: "八大关", lat: 36.053, lng: 120.355, type: "街区" },
      { name: "大学路鱼山路转角", lat: 36.065, lng: 120.338, type: "地标" },
      { name: "栈桥", lat: 36.063, lng: 120.315, type: "景点" },
      { name: "黄岛路菜市场", lat: 36.067, lng: 120.318, type: "美食" },
      { name: "信号山", lat: 36.065, lng: 120.33, type: "观景" },
    ],
    optimizedOrder: [
      "栈桥", "黄岛路菜市场", "大学路鱼山路转角",
      "信号山", "八大关",
    ],
  },
  {
    city: "长沙",
    region: "华中",
    description: "星城一日：岳麓书院到太平街夜市",
    totalDuration: "一天（约8小时）",
    estimatedTimeSaved: "节省约 25% 路程时间",
    recommendedTransport: "地铁+步行",
    places: [
      { name: "岳麓书院", lat: 28.185, lng: 112.935, type: "景点" },
      { name: "橘子洲头", lat: 28.178, lng: 112.953, type: "景点" },
      { name: "太平街", lat: 28.193, lng: 112.97, type: "美食" },
      { name: "IFS国金中心", lat: 28.195, lng: 112.975, type: "商圈" },
      { name: "超级文和友", lat: 28.19, lng: 112.975, type: "美食" },
      { name: "湖南博物院", lat: 28.21, lng: 112.99, type: "博物馆" },
    ],
    optimizedOrder: [
      "岳麓书院", "橘子洲头", "湖南博物院",
      "太平街", "IFS国金中心", "超级文和友",
    ],
  },
];

export function getRouteByCity(city: string): CityRoute | undefined {
  return cityRoutes.find((r) => r.city === city);
}

export function getRouteCities(): string[] {
  return cityRoutes.map((r) => r.city);
}

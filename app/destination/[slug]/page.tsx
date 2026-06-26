import { notFound } from "next/navigation";
import DestinationClient from "./DestinationClient";

// 目的地完整数据库
const destinationData: Record<string, {
  name: string; enName: string; region: string;
  description: string; longDescription: string;
  bestSeasons: string; recommendedDays: string; avgBudget: string;
  highlights: string[];
  popularAreas: { name: string; desc: string; icon: string }[];
  tags: string[];
  heroImage: string;
}> = {
  hangzhou: { name:"杭州",enName:"Hangzhou",region:"华东",description:"西湖烟雨，龙井茶香，一座让时光慢下来的城市。",longDescription:"杭州的美藏在西湖的晨雾里、龙井的茶山上、运河的窄巷中。这里不是一座需要'打卡'的城市，而是一座适合'住下来'的城市。清晨六点的法喜寺旁小径，午后小河直街的独立咖啡馆，傍晚馒头山社区的炊烟——这些才是杭州真正的打开方式。",bestSeasons:"3-5月（春天花开）、9-11月（秋天桂香）",recommendedDays:"2-3天",avgBudget:"¥1500-2500/人",highlights:["西湖环湖","龙井茶山徒步","运河老街漫步","灵隐·法喜寺探幽","杭帮菜寻味"],popularAreas:[{name:"西湖景区",desc:"断桥、白堤、苏堤、孤山环湖一线",icon:"Landmark"},{name:"运河区",desc:"小河直街、桥西历史街区、拱宸桥",icon:"MapPin"},{name:"龙井茶山",desc:"龙井村、满觉陇、九溪烟树",icon:"Camera"},{name:"湖滨商圈",desc:"in77、嘉里中心、武林路女装街",icon:"Wallet"}],tags:["City Walk","咖啡馆","摄影","历史文化","美食"],heroImage:"https://picsum.photos/1200/600?random=22"},
  chengdu: { name:"成都",enName:"Chengdu",region:"西南",description:"美食天堂，慢生活之都，来了就不想走的城市。",longDescription:"成都的魅力不在景点，在街边的盖碗茶、深夜的串串香、玉林路的小酒馆。你可以上午在文殊院喝禅茶，下午在無早书店翻独立杂志，晚上在芳草街吃六婆串串，凌晨在东郊记忆听一场LiveHouse。成都的一天，从慢开始，以慢结束。",bestSeasons:"3-6月、9-11月",recommendedDays:"3-4天",avgBudget:"¥1800-3000/人",highlights:["玉林路美食夜","文殊院禅茶体验","东郊记忆看展","大熊猫基地","太古里逛吃"],popularAreas:[{name:"玉林-芳草街",desc:"小酒馆、独立书店、深夜串串",icon:"Coffee"},{name:"太古里-春熙路",desc:"潮流地标、IFS熊猫、無早书店",icon:"Wallet"},{name:"文殊院片区",desc:"禅茶、素食、非遗蜀绣体验",icon:"Landmark"},{name:"东郊记忆",desc:"工业风文创园、艺术展览、LiveHouse",icon:"Camera"}],tags:["美食","历史文化","City Walk","咖啡馆"],heroImage:"https://picsum.photos/1200/600?random=23"},
  shanghai: { name:"上海",enName:"Shanghai",region:"华东",description:"咖啡馆密度全国第一，从法租界到外滩，每个街区都有惊喜。",longDescription:"上海不是只有外滩和东方明珠。真正的上海藏在南昌路的梧桐影里、M50的画廊中、衡山·和集的杂志架前。法租界的每一条小马路都值得花一个下午慢慢走，每个拐角都可能遇到一家让你想坐下来的咖啡馆。",bestSeasons:"3-5月、10-11月",recommendedDays:"2-3天",avgBudget:"¥2000-3500/人",highlights:["法租界City Walk","M50当代艺术","外滩夜景","老场坊建筑探秘","衡山·和集书店"],popularAreas:[{name:"法租界",desc:"武康路、南昌路、思南路老洋房漫步",icon:"MapPin"},{name:"外滩-南京路",desc:"万国建筑群、外滩夜景、和平饭店",icon:"Camera"},{name:"M50-1933",desc:"苏州河畔艺术区、老场坊建筑奇观",icon:"Landmark"},{name:"静安-衡复",desc:"衡山·和集书店、独立咖啡馆聚集",icon:"Coffee"}],tags:["咖啡馆","City Walk","美食","摄影","购物"],heroImage:"https://picsum.photos/1200/600?random=24"},
  beijing: { name:"北京",enName:"Beijing",region:"华北",description:"千年古都与现代文化的碰撞，胡同深处的故事等你发现。",longDescription:"北京的精华不在长安街的宽度，而在杨梅竹斜街的深处、五道营胡同的咖啡馆里、红砖美术馆的光影中。故宫值得去，但去过之后请钻进胡同——模范书局里的雕版印刷、教堂穹顶下的阅读、黄昏时分鼓楼下的鸽哨声，才是真北京。",bestSeasons:"4-5月、9-10月",recommendedDays:"3-4天",avgBudget:"¥2000-3500/人",highlights:["故宫·景山一线","杨梅竹斜街书店漫游","五道营胡同咖啡馆","红砖美术馆","簋街宵夜"],popularAreas:[{name:"故宫-景山-前门",desc:"中轴线精华、杨梅竹斜街胡同探秘",icon:"Landmark"},{name:"雍和宫-五道营",desc:"寺庙、胡同咖啡馆、独立设计店",icon:"Coffee"},{name:"798-红砖",desc:"当代艺术区、红砖建筑美学",icon:"Camera"},{name:"鼓楼-后海",desc:"钟鼓楼、烟袋斜街、什刹海落日",icon:"MapPin"}],tags:["历史文化","摄影","美食","博物馆"],heroImage:"https://picsum.photos/1200/600?random=25"},
  dali: { name:"大理",enName:"Dali",region:"西南",description:"苍山洱海，风花雪月，理想中的诗与远方。",longDescription:"大理的浪漫不只在双廊的海景客栈里，更在龙龛码头清晨六点的日出、喜洲稻田边的一杯咖啡、周城阿妈手中翻飞的扎染布中。这里是你可以关掉手机、租一辆电动车沿着洱海没有目的骑行的地方。",bestSeasons:"全年皆宜（3-5月最佳）",recommendedDays:"3-5天",avgBudget:"¥1500-2500/人",highlights:["龙龛码头日出","喜洲稻田咖啡","周城扎染体验","环洱海骑行","床单厂周末市集"],popularAreas:[{name:"大理古城",desc:"人民路、洋人街、床单厂艺术区",icon:"MapPin"},{name:"喜洲-周城",desc:"白族民居、稻田景观、扎染体验",icon:"Landmark"},{name:"洱海西线",desc:"龙龛码头、才村、S弯骑行道",icon:"Camera"},{name:"双廊-挖色",desc:"海景客栈、南诏风情岛",icon:"Star"}],tags:["自然风光","摄影","古镇","咖啡馆","海边"],heroImage:"https://picsum.photos/1200/600?random=26"},
  xiamen: { name:"厦门",enName:"Xiamen",region:"华东",description:"鼓浪屿琴声悠扬，环岛路海风吹拂，文艺青年的精神故乡。",longDescription:"厦门是一个就算什么都不做、只是在沙坡尾的咖啡馆里对着渔港发呆也很幸福的城市。第八菜市场里阿婆的闽南话、不在书店院里大榕树的沙沙声、环岛路上骑行时扑面而来的海风——这些才是鼓浪屿之外的真厦门。",bestSeasons:"3-5月、10-12月",recommendedDays:"2-3天",avgBudget:"¥1500-2500/人",highlights:["沙坡尾艺术西区","第八菜市场寻味","鼓浪屿老别墅","不在书店发呆","环岛路骑行"],popularAreas:[{name:"沙坡尾-厦大",desc:"渔港文创区、大学路咖啡馆、猫街",icon:"Coffee"},{name:"鼓浪屿",desc:"老别墅、钢琴博物馆、日光岩",icon:"Landmark"},{name:"中山路-八市",desc:"骑楼老街、第八菜市场地道小吃",icon:"Wallet"},{name:"环岛路-曾厝垵",desc:"海岸线骑行、曾厝垵文创村",icon:"Camera"}],tags:["海边","咖啡馆","摄影","City Walk","美食"],heroImage:"https://picsum.photos/1200/600?random=27"},
  nanjing: { name:"南京",enName:"Nanjing",region:"华东",description:"六朝古都，梧桐大道，历史与现代交织的温柔城市。",longDescription:"南京的魅力在于层次——颐和路的梧桐树影里藏着民国往事，先锋书店的地下空间里堆着思想之光，科巷菜场的烟火气里飘着鸭血粉丝汤的香。这座城市不需要刻意规划，随意走进一条梧桐大道，就能遇到惊喜。",bestSeasons:"3-5月、10-11月",recommendedDays:"2-3天",avgBudget:"¥1500-2200/人",highlights:["颐和路民国漫步","先锋书店朝圣","老门东非遗探访","玄武湖日落","科巷小吃"],popularAreas:[{name:"鼓楼-颐和路",desc:"民国公馆区、先锋书店、南大周边",icon:"MapPin"},{name:"秦淮-老门东",desc:"夫子庙、老门东街区、中华门城墙",icon:"Landmark"},{name:"玄武湖-紫金山",desc:"玄武湖公园、明孝陵、中山陵",icon:"Camera"},{name:"新街口-科巷",desc:"商圈核心、科巷美食街地道小吃",icon:"Wallet"}],tags:["历史文化","美食","摄影","博物馆","City Walk"],heroImage:"https://picsum.photos/1200/600?random=28"},
  chongqing: { name:"重庆",enName:"Chongqing",region:"西南",description:"8D魔幻城市，火锅飘香，每一层都有不同的风景。",longDescription:"在重庆，你永远不知道自己在第几层。交通茶馆的竹椅坐了三十年没变，山城巷的灯笼在悬崖边亮起，鹅岭贰厂的天台上两江交汇尽收眼底。这是一座需要你穿最舒服的鞋、带着最大的胃来的城市。",bestSeasons:"3-5月、9-10月",recommendedDays:"2-3天",avgBudget:"¥1200-2000/人",highlights:["山城巷悬崖步道","交通茶馆怀旧","鹅岭贰厂天台","下浩里老街","洪崖洞夜景"],popularAreas:[{name:"渝中母城",desc:"解放碑、洪崖洞、山城巷、十八梯",icon:"MapPin"},{name:"南岸-龙门浩",desc:"下浩里老街、长江索道、南山夜景",icon:"Camera"},{name:"九龙坡-黄桷坪",desc:"交通茶馆、川美涂鸦街、铁路中学",icon:"Landmark"},{name:"观音桥-九街",desc:"时尚商圈、九街夜生活",icon:"Wallet"}],tags:["美食","夜景","City Walk","摄影"],heroImage:"https://picsum.photos/1200/600?random=29"},
  xian: { name:"西安",enName:"Xi'an",region:"西北",description:"十三朝古都，城墙根下的烟火与书院门的墨香。",longDescription:"西安不止有兵马俑。书院门里毛笔在宣纸上沙沙作响，洒金桥的胡辣汤冒着白气，半坡艺术区的涂鸦墙见证着古都的另一种活力。白天在碑林读千年石刻，晚上在大唐不夜城的灯火里穿越回长安。",bestSeasons:"3-5月、9-10月",recommendedDays:"3-4天",avgBudget:"¥1800-2800/人",highlights:["兵马俑震撼","书院门笔墨飘香","洒金桥地道美食","城墙骑行","大唐不夜城"],popularAreas:[{name:"钟楼-回民街",desc:"钟鼓楼、洒金桥美食、回民街夜市",icon:"MapPin"},{name:"碑林-书院门",desc:"碑林博物馆、书院门文化街、关中书院",icon:"Landmark"},{name:"大雁塔-大唐不夜城",desc:"大雁塔、曲江书城、不夜城灯光秀",icon:"Camera"},{name:"临潼-兵马俑",desc:"秦始皇兵马俑、华清池",icon:"Star"}],tags:["历史文化","美食","摄影","博物馆"],heroImage:"https://picsum.photos/1200/600?random=30"},
  guangzhou: { name:"广州",enName:"Guangzhou",region:"华南",description:"食在广州，从西关骑楼到东山口红砖洋楼，老城的每一面都值得品味。",longDescription:"广州是吃货的天堂也是City Walk爱好者的宝藏。清晨在恩宁路的骑楼下喝一碗艇仔粥，上午在东山口的红砖洋楼间穿梭，下午在1200bookshop翻书到天黑，晚上去珠江新城看小蛮腰亮灯。一天下来，你会发现广州比想象中更有味道。",bestSeasons:"10-12月（秋高气爽）",recommendedDays:"2-3天",avgBudget:"¥1500-2500/人",highlights:["恩宁路骑楼漫步","东山口红砖洋楼","1200bookshop深夜书店","泮塘五约古村","珠江夜游"],popularAreas:[{name:"西关-恩宁路",desc:"骑楼老街、永庆坊、荔枝湾、泮塘五约",icon:"Landmark"},{name:"东山口",desc:"红砖洋楼、独立咖啡馆、逵园艺术馆",icon:"Coffee"},{name:"珠江新城",desc:"广州塔、花城广场、K11、1200bookshop",icon:"Camera"},{name:"上下九-沙面",desc:"商业步行街、沙面欧式建筑群",icon:"MapPin"}],tags:["美食","City Walk","摄影","咖啡馆"],heroImage:"https://picsum.photos/1200/600?random=31"},
  shenzhen: { name:"深圳",enName:"Shenzhen",region:"华南",description:"周末逃离的理想距离，从山海到都市，24小时切换。",longDescription:"深圳是座被低估的旅行城市。蛇口的海边美术馆面朝大海，华侨城创意园的周末市集永远有新鲜事，较场尾的彩色民宿让你以为到了东南亚。这里是周末逃离的最佳目的地——周五下班出发，周日晚上回来，刚好。",bestSeasons:"10-12月",recommendedDays:"1-2天",avgBudget:"¥1200-2000/人",highlights:["蛇口海上世界艺术中心","华侨城创意市集","较场尾民宿村","深圳湾公园骑行","蛇口老街海鲜"],popularAreas:[{name:"蛇口",desc:"海上世界艺术中心、蛇口老街美食",icon:"Camera"},{name:"华侨城",desc:"创意园北区、T街市集、独立咖啡馆",icon:"Coffee"},{name:"大鹏半岛",desc:"较场尾民宿、杨梅坑、大鹏所城",icon:"Star"},{name:"南山-深圳湾",desc:"深圳湾公园、人才公园、万象天地",icon:"MapPin"}],tags:["海边","咖啡馆","夜景","购物","周末短逃离"],heroImage:"https://picsum.photos/1200/600?random=32"},
  suzhou: { name:"苏州",enName:"Suzhou",region:"华东",description:"园林之城，平江路深处藏着最江南的慢生活。",longDescription:"苏州的精华不在拙政园的人潮里，而在平江路深处的丁香巷、葑门横街清晨的糕团香气、丝绸博物馆里非遗传承人的指尖。找一家临河的茶馆，泡一壶碧螺春，听一段评弹——这才是苏州最正确的打开方式。",bestSeasons:"3-5月、9-11月",recommendedDays:"2-3天",avgBudget:"¥1500-2200/人",highlights:["平江路深巷探秘","葑门横街早点","丝绸博物馆","拙政园·苏博","山塘街夜景"],popularAreas:[{name:"平江路-观前街",desc:"平江路主街及深巷、丁香巷评弹茶馆",icon:"MapPin"},{name:"拙政园-苏博",desc:"拙政园、苏州博物馆、忠王府",icon:"Landmark"},{name:"葑门-十全街",desc:"葑门横街菜市场、十全街咖啡",icon:"Wallet"},{name:"山塘-石路",desc:"七里山塘、阊门、石路商圈",icon:"Camera"}],tags:["City Walk","摄影","古建筑","美食"],heroImage:"https://picsum.photos/1200/600?random=33"},
  qingdao: { name:"青岛",enName:"Qingdao",region:"华东",description:"红瓦绿树，碧海蓝天，啤酒与海风的自由之城。",longDescription:"青岛的美在于它的不刻意——八大关的梧桐隧道秋天金黄一片，大学路的网红转角后面藏着整条街的文艺，黄岛路菜市场的大爷拎着塑料袋打散啤。在这座城市，最好的行程就是没有行程，随便走走就是风景。",bestSeasons:"5-10月",recommendedDays:"2-3天",avgBudget:"¥1500-2200/人",highlights:["八大关梧桐隧道","大学路咖啡馆巡礼","栈桥海鸥","信号山日落","黄岛路散啤体验"],popularAreas:[{name:"八大关-太平角",desc:"万国建筑、梧桐隧道、第二海水浴场",icon:"Camera"},{name:"老城-大学路",desc:"网红转角、咖啡馆、老舍故居、信号山",icon:"Coffee"},{name:"栈桥-中山路",desc:"栈桥海鸥、天主教堂、黄岛路市场",icon:"MapPin"},{name:"崂山-石老人",desc:"崂山风景区、石老人海水浴场",icon:"Star"}],tags:["海边","摄影","美食","City Walk","咖啡馆"],heroImage:"https://picsum.photos/1200/600?random=34"},
  changsha: { name:"长沙",enName:"Changsha",region:"华中",description:"不夜之城，湘江边的烟火与太平街的臭豆腐香。",longDescription:"长沙是一座24小时不打烊的城市。早上在岳麓书院读千年学府，中午在湖南博物院看辛追夫人，下午在橘子洲头散步，晚上从太平街吃到超级文和友，凌晨在解放西的霓虹灯下发现——哦，长沙的夜才刚刚开始。",bestSeasons:"3-5月、9-11月",recommendedDays:"2-3天",avgBudget:"¥1200-2000/人",highlights:["岳麓书院","橘子洲头","太平街美食","超级文和友","湖南博物院"],popularAreas:[{name:"岳麓山-大学城",desc:"岳麓书院、爱晚亭、麓山南路小吃",icon:"Landmark"},{name:"橘子洲-五一广场",desc:"橘子洲头、IFS国金中心、太平街",icon:"MapPin"},{name:"湖南博物院-烈士公园",desc:"辛追夫人、马王堆汉墓文物",icon:"Star"},{name:"解放西-文和友",desc:"超级文和友、解放西酒吧街",icon:"Camera"}],tags:["美食","夜景","历史文化","City Walk"],heroImage:"https://picsum.photos/1200/600?random=35"},
  kunming: { name:"昆明",enName:"Kunming",region:"西南",description:"春城无处不飞花，四季如春的避世天堂。",longDescription:"昆明是一座被阳光眷顾的城市。翠湖公园的红嘴鸥每年如期而至，篆新农贸市场的菌子季节让人疯狂，斗南花市的鲜花论斤卖——这座城市最奢侈的浪漫就是便宜。在昆明，不需要赶路，随便找个公园喝杯茶就是一天。",bestSeasons:"全年皆宜",recommendedDays:"2-3天",avgBudget:"¥1200-2000/人",highlights:["翠湖公园喂海鸥","篆新农贸市场寻味","斗南花市买花","西山龙门","滇池日落"],popularAreas:[{name:"翠湖-云大",desc:"翠湖公园、云南大学、文林街咖啡馆",icon:"Coffee"},{name:"篆新-南强街",desc:"篆新农贸市场、南强街夜市美食",icon:"Wallet"},{name:"滇池-西山",desc:"滇池海埂公园、西山龙门、民族村",icon:"Camera"},{name:"斗南-呈贡",desc:"斗南花市亚洲最大、捞鱼河湿地公园",icon:"Star"}],tags:["自然风光","美食","摄影","咖啡馆"],heroImage:"https://picsum.photos/1200/600?random=36"},
  lijiang: { name:"丽江",enName:"Lijiang",region:"西南",description:"雪山脚下的柔软时光，纳西古乐与民谣的故乡。",longDescription:"丽江早已不是那个'艳遇之城'的刻板印象。玉湖村的石头房子对着玉龙雪山，白沙古镇的铜器匠人还在叮叮当当，文海的野花一年四季交替开放。找一个雪山观景的民宿，白天骑马去玉湖，晚上在古城听纳西古乐——这才是丽江的正确打开方式。",bestSeasons:"3-5月、9-11月",recommendedDays:"3-4天",avgBudget:"¥2000-3500/人",highlights:["玉龙雪山登顶","玉湖村骑马","白沙古镇手作","文海野花秘境","大研古城夜游"],popularAreas:[{name:"大研古城",desc:"四方街、大水车、酒吧街、木府",icon:"MapPin"},{name:"束河古镇",desc:"束河古镇、白沙壁画、玉湖村",icon:"Landmark"},{name:"玉龙雪山",desc:"冰川公园、蓝月谷、甘海子",icon:"Camera"},{name:"拉市海-文海",desc:"拉市海湿地、文海花海、指云寺",icon:"Star"}],tags:["古镇","自然风光","摄影","美食"],heroImage:"https://picsum.photos/1200/600?random=37"},
  haerbin: { name:"哈尔滨",enName:"Harbin",region:"东北",description:"东方莫斯科，冰雪奇缘里的童话世界。",longDescription:"哈尔滨的冬天是冰雪筑成的童话，中央大街的面包石在路灯下泛着光，索菲亚教堂的洋葱顶在飘雪中格外圣洁。夏天的哈尔滨同样迷人——松花江畔的晚风、老道外的巴洛克建筑、锅包肉和哈尔滨啤酒，让你爱上这座北方城市的坦荡与热烈。",bestSeasons:"12-2月（冰雪节）、6-8月（避暑）",recommendedDays:"3-4天",avgBudget:"¥1800-3000/人",highlights:["冰雪大世界","中央大街","圣索菲亚教堂","松花江畔","老道外中华巴洛克"],popularAreas:[{name:"中央大街",desc:"面包石步行街、马迭尔冰棍、华梅西餐厅",icon:"MapPin"},{name:"太阳岛-冰雪大世界",desc:"太阳岛公园、冰雪大世界（冬季）",icon:"Camera"},{name:"道外-老道外",desc:"中华巴洛克建筑群、张包铺、老鼎丰",icon:"Landmark"},{name:"松花江-斯大林公园",desc:"松花江索道、防洪纪念塔、斯大林公园",icon:"Star"}],tags:["冰雪","摄影","美食","建筑","冬季运动"],heroImage:"https://picsum.photos/1200/600?random=38"},
  sanya: { name:"三亚",enName:"Sanya",region:"华南",description:"东方夏威夷，椰风海韵下最纯粹的度假时光。",longDescription:"三亚不需要复杂的攻略——找一片好沙滩、一家舒服的酒店、几顿新鲜的海鲜，就是完美的假期。但要真正玩出三亚的味道，请解锁这些隐藏关卡：后海村的冲浪初体验、第一市场的海鲜加工、鹿回头的山顶日落、蜈支洲岛的玻璃海。",bestSeasons:"10-4月（旺季）",recommendedDays:"3-5天",avgBudget:"¥3000-6000/人",highlights:["蜈支洲岛潜水","后海村冲浪","亚龙湾沙滩","第一市场海鲜","鹿回头日落"],popularAreas:[{name:"亚龙湾",desc:"天下第一湾、热带天堂森林公园、太阳湾公路",icon:"Camera"},{name:"海棠湾",desc:"蜈支洲岛、后海村冲浪、亚特兰蒂斯",icon:"Star"},{name:"三亚湾-市区",desc:"椰梦长廊、第一市场海鲜、鹿回头",icon:"MapPin"},{name:"大东海",desc:"大东海沙滩、小东海赶海、半山半岛",icon:"Wallet"}],tags:["海边","度假","潜水","美食","摄影"],heroImage:"https://picsum.photos/1200/600?random=39"},
};


// 每个目的地的额外详情
const detailExtras: Record<string, {
  transport: { type: string; desc: string; tips: string }[];
  foodRecommendations: { name: string; type: string; desc: string; price: string }[];
  accommodations: { name: string; type: string; area: string; price: string; desc: string }[];
}> = {
  hangzhou: {
    transport: [
      { type: "高铁", desc: "杭州东站/杭州站，华东核心枢纽", tips: "上海出发1小时即达，南京出发1.5小时" },
      { type: "市内交通", desc: "地铁覆盖主要景区，公交可到西湖周边", tips: "推荐骑行+地铁，西湖景区周末单双号限行" },
    ],
    foodRecommendations: [
      { name: "西湖醋鱼", type: "杭帮菜", desc: "酸甜鲜嫩，楼外楼/知味观经典", price: "¥68-128" },
      { name: "片儿川", type: "面食", desc: "杭州人的早餐标配，雪菜笋片配肉丝", price: "¥15-25" },
      { name: "龙井虾仁", type: "杭帮菜", desc: "龙井茶香配鲜嫩虾仁", price: "¥88-168" },
      { name: "葱包烩", type: "小吃", desc: "河坊街/南宋御街必尝", price: "¥8-15" },
    ],
    accommodations: [
      { name: "西湖周边民宿", type: "精品民宿", area: "满觉陇/四眼井", price: "¥300-800/晚", desc: "茶山环绕，安静文艺" },
      { name: "青年旅舍", type: "青旅", area: "西湖/河坊街", price: "¥60-120/晚", desc: "适合独行客，交通便利" },
      { name: "市区商务酒店", type: "酒店", area: "湖滨/武林", price: "¥400-1000/晚", desc: "购物觅食方便" },
    ],
  },
  chengdu: {
    transport: [
      { type: "飞机", desc: "成都双流/天府双机场", tips: "天府机场较远，优先选双流" },
      { type: "市内交通", desc: "地铁线路密集，打车起步价低", tips: "推荐地铁+共享单车，春熙路附近步行即可" },
    ],
    foodRecommendations: [
      { name: "火锅", type: "川菜", desc: "小龙坎/大龙燚/蜀大侠三大派", price: "¥80-150/人" },
      { name: "串串香", type: "川菜", desc: "玉林路/芳草街遍地都是", price: "¥30-80/人" },
      { name: "龙抄手", type: "小吃", desc: "皮薄馅大，红油/清汤两吃", price: "¥12-20" },
      { name: "夫妻肺片", type: "凉菜", desc: "麻辣鲜香，开胃神器", price: "¥25-40" },
    ],
    accommodations: [
      { name: "太古里周边", type: "设计师酒店", area: "太古里/春熙路", price: "¥500-1200/晚", desc: "潮流核心区" },
      { name: "玉林路民宿", type: "民宿", area: "玉林/芳草街", price: "¥200-500/晚", desc: "烟火气+小酒馆" },
      { name: "文殊院周边", type: "禅意民宿", area: "文殊院", price: "¥300-600/晚", desc: "安静禅意" },
    ],
  },
  shanghai: {
    transport: [
      { type: "高铁/飞机", desc: "虹桥枢纽（高铁+机场）、浦东机场", tips: "优先虹桥，到市区仅30分钟地铁" },
      { type: "市内交通", desc: "地铁几乎覆盖全城，打车较贵", tips: "地铁+共享单车是最优解" },
    ],
    foodRecommendations: [
      { name: "生煎包", type: "小吃", desc: "大壶春/小杨生煎，底脆肉鲜", price: "¥12-20" },
      { name: "本帮菜", type: "上海菜", desc: "红烧肉、油爆虾、草头圈子", price: "¥80-150/人" },
      { name: "小笼包", type: "小吃", desc: "南翔馒头店、佳家汤包", price: "¥25-45" },
      { name: "葱油拌面", type: "面食", desc: "简单但上瘾的上海本味", price: "¥10-20" },
    ],
    accommodations: [
      { name: "法租界老洋房", type: "精品民宿", area: "武康路/南昌路", price: "¥500-1500/晚", desc: "梧桐树下的老上海" },
      { name: "外滩江景酒店", type: "高端酒店", area: "外滩/陆家嘴", price: "¥1000-3000/晚", desc: "黄浦江夜景" },
      { name: "静安寺周边", type: "商务酒店", area: "静安寺", price: "¥400-800/晚", desc: "交通便利" },
    ],
  },
  beijing: {
    transport: [
      { type: "高铁/飞机", desc: "北京南站/北京西站/首都机场/大兴机场", tips: "优先北京南站和首都机场，离市区近" },
      { type: "市内交通", desc: "地铁超级发达，公交也方便", tips: "打车避开早晚高峰，推荐地铁+步行" },
    ],
    foodRecommendations: [
      { name: "北京烤鸭", type: "京菜", desc: "全聚德/大董/四季民福", price: "¥200-400/只" },
      { name: "炸酱面", type: "面食", desc: "海碗居/方砖厂69号", price: "¥20-35" },
      { name: "涮羊肉", type: "京菜", desc: "东来顺/聚宝源铜锅涮", price: "¥100-180/人" },
      { name: "豆汁儿焦圈", type: "小吃", desc: "胡同里的地道北京味儿", price: "¥5-10" },
    ],
    accommodations: [
      { name: "胡同四合院", type: "精品民宿", area: "南锣鼓巷/五道营", price: "¥500-1500/晚", desc: "住进老北京" },
      { name: "故宫周边", type: "高端酒店", area: "王府井/东华门", price: "¥800-2000/晚", desc: "步行到故宫" },
      { name: "三里屯周边", type: "设计师酒店", area: "三里屯/工体", price: "¥400-800/晚", desc: "潮流夜生活" },
    ],
  },
};

// 默认交通、美食、住宿（未详细录入的城市用这个）
const defaultExtras = {
  transport: [
    { type: "高铁/飞机", desc: "各大城市均有直达", tips: "提前订票更优惠" },
    { type: "市内交通", desc: "地铁/公交/打车", tips: "推荐地铁+共享单车" },
  ],
  foodRecommendations: [
    { name: "当地特色菜", type: "本地菜", desc: "必吃推荐", price: "¥50-100/人" },
    { name: "小吃街", type: "小吃", desc: "夜市/美食街", price: "¥20-50/人" },
  ],
  accommodations: [
    { name: "市中心酒店", type: "酒店", area: "市中心", price: "¥300-600/晚", desc: "交通便利" },
    { name: "特色民宿", type: "民宿", area: "景区附近", price: "¥200-500/晚", desc: "体验当地生活" },
  ],
};

// 获取某个城市的额外详情
function getDetailExtras(slug: string) {
  return detailExtras[slug] || defaultExtras;
}

export function generateStaticParams() {
  return Object.keys(destinationData).map((slug) => ({ slug }));
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dest = destinationData[slug];
  if (!dest) notFound();
  const extras = getDetailExtras(slug);
  return <DestinationClient slug={slug} dest={dest} extras={extras} />;
}

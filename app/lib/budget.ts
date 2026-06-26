// WanderAI Budget Engine
// Real data-driven cost estimation for 18 Chinese cities

export type AccommodationTier = "budget" | "comfort" | "luxury";
export type TravelStyle = "classic" | "food" | "nature" | "culture" | "family";

// ----- Transport (round-trip flight, per person, tier-2 city average) -----
const transportRange: Record<string, [number, number]> = {
  北京: [1000, 2000],
  上海: [1000, 2000],
  三亚: [1500, 4000],
  成都: [700, 1600],
  重庆: [700, 1600],
  西安: [600, 1500],
  广州: [800, 1800],
  深圳: [800, 1800],
  南京: [500, 1200],
  苏州: [500, 1200],
  长沙: [500, 1200],
  厦门: [600, 1400],
  昆明: [900, 1800],
  大理: [900, 1800],
  丽江: [1000, 2000],
  青岛: [600, 1500],
  哈尔滨: [1000, 2500],
  杭州: [600, 1400],
};

// ----- Accommodation per night -----
const accommodationRange: Record<AccommodationTier, [number, number]> = {
  budget: [200, 350],
  comfort: [350, 600],
  luxury: [700, 1500],
};

// ----- Meals per day -----
const mealsRange: Record<AccommodationTier, [number, number]> = {
  budget: [80, 120],
  comfort: [150, 250],
  luxury: [350, 600],
};

// ----- Attractions (real estimates per city) -----
const attractionsRange: Record<string, [number, number]> = {
  北京: [150, 250],
  西安: [200, 350],
  杭州: [100, 200],
  上海: [200, 600],
  成都: [120, 250],
  重庆: [50, 150],
  三亚: [150, 350],
  广州: [100, 250],
  深圳: [80, 200],
  南京: [100, 200],
  苏州: [100, 200],
  长沙: [80, 200],
  厦门: [100, 200],
  昆明: [100, 250],
  大理: [80, 200],
  丽江: [100, 250],
  青岛: [80, 200],
  哈尔滨: [100, 250],
};

// ----- Local transport per day -----
const localTransportRange: [number, number] = [30, 80];

// ----- Style multiplier -----
const styleMultiplier: Record<TravelStyle, { transport: number; accommodation: number; meals: number; attractions: number }> = {
  classic:    { transport: 1.0, accommodation: 1.0, meals: 1.0,  attractions: 1.0 },
  food:       { transport: 1.0, accommodation: 1.0, meals: 1.25, attractions: 1.0 },
  nature:     { transport: 1.0, accommodation: 0.95, meals: 0.95, attractions: 0.9 },
  culture:    { transport: 1.0, accommodation: 1.0, meals: 1.0,  attractions: 1.1 },
  family:     { transport: 1.0, accommodation: 1.2, meals: 1.1,  attractions: 1.2 },
};

// ----- Budget tier mapping from user input -----
function inferTier(budget: number, days: number, travelers: number): AccommodationTier {
  const perDayBudget = budget / (days * Math.max(travelers, 1));
  if (perDayBudget < 350) return "budget";
  if (perDayBudget < 800) return "comfort";
  return "luxury";
}

export interface BudgetBreakdown {
  transport: [number, number];
  accommodation: [number, number];
  meals: [number, number];
  attractions: [number, number];
  localTransport: [number, number];
}

export interface BudgetResult {
  totalRange: [number, number];
  perPerson: [number, number];
  breakdown: BudgetBreakdown;
}

export function calculateBudget(
  cityName: string,
  days: number,
  travelers: number,
  style: TravelStyle = "classic",
  budget?: number
): BudgetResult {
  const tier: AccommodationTier = budget ? inferTier(budget, days, travelers) : "comfort";
  const nights = Math.max(days - 1, 1);
  const mult = styleMultiplier[style] || styleMultiplier.classic;

  const transport = transportRange[cityName] || [600, 1500];
  const accommodation = accommodationRange[tier];
  const meals = mealsRange[tier];
  const attractions = attractionsRange[cityName] || [100, 300];
  const localT = localTransportRange;

  const calc = (r: [number, number], m: number = 1) =>
    [Math.round(r[0] * m), Math.round(r[1] * m)] as [number, number];

  const breakdown: BudgetBreakdown = {
    transport: calc(transport, mult.transport),
    accommodation: calc([accommodation[0] * nights, accommodation[1] * nights], mult.accommodation),
    meals: calc([meals[0] * days, meals[1] * days], mult.meals),
    attractions: calc(attractions, mult.attractions),
    localTransport: calc([localT[0] * days, localT[1] * days]),
  };

  const perPersonMin =
    breakdown.transport[0] +
    breakdown.accommodation[0] +
    breakdown.meals[0] +
    breakdown.attractions[0] +
    breakdown.localTransport[0];
  const perPersonMax =
    breakdown.transport[1] +
    breakdown.accommodation[1] +
    breakdown.meals[1] +
    breakdown.attractions[1] +
    breakdown.localTransport[1];

  const totalMin = perPersonMin * travelers;
  const totalMax = perPersonMax * travelers;

  return {
    totalRange: [totalMin, totalMax],
    perPerson: [perPersonMin, perPersonMax],
    breakdown,
  };
}

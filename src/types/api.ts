export interface GeminiRouteRequest {
  destination: string;
  days: number;
  interests: string[];
  budgetLevel: string;
}

export interface GeminiRouteResponse {
  itinerary: string;
  recommendedPlaces: string[];
  estimatedCost: number;
}

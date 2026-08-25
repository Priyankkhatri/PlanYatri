export const generateItineraryFromAI = async (destination: string, days: number) => {
  return {
    destination,
    days,
    summary: `Handcrafted ${days}-day luxury itinerary for ${destination}`,
    recommendations: ['Luxury Spa', 'Michelin Restaurant', 'Historical Landmarks']
  };
};

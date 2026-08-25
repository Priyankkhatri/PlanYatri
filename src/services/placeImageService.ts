import { DESTINATION_IMAGES } from '@/data/images';

export const fetchPlaceImage = async (query: string): Promise<string> => {
  const key = query.toLowerCase();
  for (const name in DESTINATION_IMAGES) {
    if (key.includes(name)) return DESTINATION_IMAGES[name];
  }
  return DESTINATION_IMAGES.paris;
};

import { DESTINATION_IMAGES } from '@/data/images';

export const fetchPlaceImage = async (q: string): Promise<string> => {
  return DESTINATION_IMAGES.swiss;
};

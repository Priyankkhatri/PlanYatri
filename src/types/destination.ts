export interface Destination {
  id: string;
  name: string;
  country: string;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  tags: string[];
  priceLevel: 'budget' | 'moderate' | 'luxury';
  popularFor: string;
}

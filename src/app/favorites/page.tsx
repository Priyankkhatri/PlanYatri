'use client';

import React from 'react';
import { FavoriteItem } from '@/components/favorites/FavoriteItem';
import { DESTINATION_IMAGES } from '@/data/images';
export default function FavoritesPage() {
  return (
    <div className="favorites-container">
      <h2>Saved Destinations</h2>
      <div className="fav-grid">
        <FavoriteItem title="Kyoto Sanctuary" image={DESTINATION_IMAGES.tokyo} />
        <FavoriteItem title="Swiss Alps Resort" image={DESTINATION_IMAGES.swiss} />
      </div>
    </div>
  );
}

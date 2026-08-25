import React from 'react';
export const FavoriteItem: React.FC<{ title: string; image: string }> = ({ title, image }) => {
  return (
    <div className="fav-item">
      <img src={image} alt={title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
      <div style={{ padding: 14 }}>
        <h4>{title}</h4>
      </div>
    </div>
  );
};

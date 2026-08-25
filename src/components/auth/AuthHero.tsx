import React from 'react';
export const AuthHero: React.FC = () => {
  return (
    <div className="auth-hero">
      <div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 48, fontWeight: 800 }}>PlanYatri</h1>
        <p style={{ marginTop: 12, color: '#A1A1AA', fontSize: 16 }}>Curated Luxury Travel & Intelligent Itineraries</p>
      </div>
      <div>
        <blockquote style={{ fontStyle: 'italic', fontSize: 20, borderLeft: '2px solid #D4A843', paddingLeft: 16 }}>
          "The journey of a thousand miles begins with a single, perfectly orchestrated step."
        </blockquote>
      </div>
    </div>
  );
};

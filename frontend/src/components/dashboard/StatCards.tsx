import React from 'react';

export const StatCards = () => {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="p-6 bg-white rounded-xl border border-[#EFEAE2]">
        <span className="text-xs text-gray-500 uppercase">Active Trips</span>
        <h3 className="text-3xl font-extrabold mt-1">02</h3>
      </div>
      <div className="p-6 bg-white rounded-xl border border-[#EFEAE2]">
        <span className="text-xs text-gray-500 uppercase">Saved Bookmarks</span>
        <h3 className="text-3xl font-extrabold mt-1">14</h3>
      </div>
      <div className="p-6 bg-white rounded-xl border border-[#EFEAE2]">
        <span className="text-xs text-gray-500 uppercase">Budget Spent</span>
        <h3 className="text-3xl font-extrabold mt-1">$3,050</h3>
      </div>
    </div>
  );
};

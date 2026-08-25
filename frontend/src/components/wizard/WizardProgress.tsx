'use client';
import React from 'react';

interface Props {
  currentStep: number;
  totalSteps?: number;
  title: string;
}

export const WizardProgress: React.FC<Props> = ({ currentStep, totalSteps = 6, title }) => {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 space-y-3">
      <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-gray-500">
        <span>Step {currentStep} of {totalSteps}: {title}</span>
        <span className="text-[#4D41DF]">{percentage}% Completed</span>
      </div>
      <div className="w-full h-2 bg-[#EFEAE2] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#4D41DF] to-[#914800] transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

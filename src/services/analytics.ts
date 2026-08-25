export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  console.log(`[PlanYatri Analytics] Event: ${eventName}`, properties || {});
};

export const trackPageView = (pageName: string) => {
  console.log(`[PlanYatri Analytics] PageView: ${pageName}`);
};

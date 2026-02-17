// PostHog type declarations for global window object
interface Window {
  posthog?: {
    capture: (eventName: string, properties?: Record<string, unknown>) => void;
    identify: (distinctId: string, properties?: Record<string, unknown>) => void;
    reset: () => void;
    captureException: (error: Error, properties?: Record<string, unknown>) => void;
    isFeatureEnabled: (key: string) => boolean | undefined;
    getFeatureFlag: (key: string) => string | boolean | undefined;
  };
}

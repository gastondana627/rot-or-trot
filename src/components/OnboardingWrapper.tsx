import { MobileOnboarding } from './MobileOnboarding';
import { WebOnboarding } from './WebOnboarding';       

export function OnboardingWrapper({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="w-full min-h-screen bg-[#090514] text-white relative z-50">
      {/* Renders Mobile Onboarding on small screens, hidden on md+ */}
      <div className="block md:hidden h-full">
        <MobileOnboarding onComplete={onComplete} />
      </div>

      {/* Renders Web Onboarding on medium screens and up, hidden on mobile */}
      <div className="hidden md:block h-full">
        <WebOnboarding onComplete={onComplete} />
      </div>
    </div>
  );
}
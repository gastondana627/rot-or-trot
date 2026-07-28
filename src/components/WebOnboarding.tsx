import { useState, useEffect } from "react";
import { ArrowRight, Eye, EyeOff, KeyRound, Rocket, Star, Video } from "lucide-react";
import { Switch } from "@/components/ui/switch";

// 1. Paste the UI inside the return() for Webpage S2 (Built for Developers) here
function WebStep1({ onNext }: { onNext: () => void }) {
  return (
    <div>
       {/* PASTE WEB S2 INNER HTML HERE */}
       {/* Find the "NEXT" button and add onClick={onNext} */}
    </div>
  );
}

// 2. Paste the UI inside the return() for Webpage S1 (Creator Studio / Next Step) here
function WebStep2({ onComplete }: { onComplete: () => void }) {
  return (
    <div>
       {/* PASTE WEB S1 INNER HTML HERE */}
    </div>
  );
}

// 3. This controls the web flow!
export function WebOnboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);

  if (step === 1) return <WebStep1 onNext={() => setStep(2)} />;
  return <WebStep2 onComplete={onComplete} />;
}
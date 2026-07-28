import { useState, useEffect } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Compass, Home, Plus, Radio, Terminal, User } from "lucide-react";
import { Button } from "@/components/ui/button";

// 1. Paste the UI inside the return() for Mobile S1 here
function MobileStep1({ onNext }: { onNext: () => void }) {
  return (
    <div>
      {/* PASTE S1 INNER HTML HERE */}
      {/* Example: Find your "NEXT ➔" button and add onClick={onNext} */}
    </div>
  );
}

// 2. Paste the UI inside the return() for Mobile S2 here
function MobileStep2({ onComplete }: { onComplete: () => void }) {
  return (
    <div>
      {/* PASTE S2 INNER HTML HERE */}
      {/* Example: Find your "ENTER THE APP 🐎" button and add onClick={onComplete} */}
    </div>
  );
}

// 3. This controls which screen shows up!
export function MobileOnboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);

  if (step === 1) return <MobileStep1 onNext={() => setStep(2)} />;
  return <MobileStep2 onComplete={onComplete} />;
}
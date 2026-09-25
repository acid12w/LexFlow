"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

import ClientForm from "./clientForm/page";
import MatterForm from "./matterForm/page";
import MatterSuccess from "./success/page";

export interface ActiveClientState {
  id: string;
  firstName: string;
  lastName: string;
  refrenceNumber: string;
  selectedClientId: string;
}

const STEPS = [
  { id: 1, name: "Select Client" },
  { id: 2, name: "Matter Details" },
  { id: 3, name: "Success" },
] as const;

export default function MatterField() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeClient, setActiveClient] = useState<ActiveClientState>({
    id: "",
    firstName: "",
    lastName: "",
    refrenceNumber: "",
    selectedClientId: "",
  });

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Step 1 Validation Guard: Client must be selected
  const isStep1Valid = Boolean(
    activeClient.id || activeClient.selectedClientId
  );

  return (
    <div className="w-full max-w-2xl p-6 m-auto space-y-6">
      {/* Header Progress Indicator */}
      {currentStep !== 3 && (
        <div className="flex items-center justify-between border-b pb-4">
          {STEPS.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isCompleted
                      ? "bg-muted text-foreground border"
                      : "bg-muted/40 text-muted-foreground"
                  }`}
                >
                  {step.id}
                </div>
                <span
                  className={`text-sm font-medium ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Step Content */}
      <div className="py-2">
        {currentStep === 1 && (
          <ClientForm
            handleSelect={setActiveClient}
            selectedClientId={activeClient.id || activeClient.selectedClientId}
          />
        )}

        {currentStep === 2 && (
          <MatterForm
            activeClient={activeClient}
            onSuccess={handleNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 3 && <MatterSuccess />}
      </div>

      {/* Footer Navigation: Render ONLY on Step 1 */}
      {currentStep === 1 && (
        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" disabled></Button>

          <Button type="button" onClick={handleNext} disabled={!isStep1Valid}>
            Next Step
          </Button>
        </div>
      )}
    </div>
  );
}

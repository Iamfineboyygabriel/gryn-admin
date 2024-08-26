import React from "react";

interface Step {
  step: number;
  label: string;
}

interface StepIndicatorProps {
  currentStep: number;
  completedSteps: number[];
}

const VisaStepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  completedSteps,
}) => {
  const steps: Step[] = [
    { step: 1, label: "Personal Details" },
    { step: 2, label: "Destination Details" },
    { step: 3, label: "Upload Document" },
  ];

  return (
    <div className="mt-[1.5em] flex font-outfit items-center">
      {steps.map(({ step, label }, index) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div
              className={`step mb-2 rounded-full px-[20px] py-[10px] ${
                completedSteps.includes(step)
                  ? "bg-primary-700 text-white dark:bg-gray-700 dark:text-white"
                  : currentStep === step
                  ? "bg-gray-100 font-semibold text-black"
                  : "bg-gray-100 font-semibold text-black"
              }`}
            >
              {step}
            </div>
            <p
              className={`mt-2 text-sm font-light ${
                completedSteps.includes(step)
                  ? "font-medium text-primary-700 dark:text-white"
                  : currentStep === step
                  ? "text-black"
                  : "text-gray-500"
              }`}
            >
              {label}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div className="flex items-center justify-center">
              <div className="h-[2px] w-[100px] bg-gray-100"></div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default VisaStepIndicator;

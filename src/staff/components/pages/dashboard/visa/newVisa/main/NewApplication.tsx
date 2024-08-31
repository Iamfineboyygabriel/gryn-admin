import React, { useState } from "react";
import { button } from "../../../../../../../shared/buttons/Button";
import VisaStepIndicator from "../../../../../../../shared/visaStepIndicator/VisaStepIndicator";
import { useNavigate } from "react-router";
import StepOne from "../stepOne/StepOne";
import StepTwo from "../stepTwo/StepTwo";
import StepThree from "../stepThree/StepThree";

const NewApplication = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const [stepOneData, setStepOneData] = useState<{
    firstName: string;
    lastName: string;
    otherName: string;
    email: string;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    otherName: "",
  });

  const navigate = useNavigate();

  const handleBackClick = async () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const handleNextClick = (data?: { newApplicationId?: string; moveToStepThree?: boolean }) => {
    if (data?.newApplicationId) {
      setApplicationId(data.newApplicationId);
    }

    if (data?.moveToStepThree) {
      setCurrentStep(3);
      setCompletedSteps([1, 2]);
    } else if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      setCompletedSteps([...completedSteps, currentStep]);
    }
  };

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold dark:text-white">Visa Application</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white px-[2em] py-3 pb-[10em] dark:bg-gray-800">
        <header>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-medium dark:text-gray-700">
                Visa Application /
                <span className="ml-1 font-medium text-primary-700 dark:text-white">
                  New Application
                </span>
              </h1>
            </div>
            <button.PrimaryButton onClick={handleBackClick} className="btn-2">
              Back
            </button.PrimaryButton>
          </div>
        </header>
        <VisaStepIndicator
          currentStep={currentStep}
          completedSteps={completedSteps}
        />
        <div className="mt-[2em]">
          {currentStep === 1 && (
            <StepOne
              onNext={(data: {
                firstName: string;
                lastName: string;
                otherName: string;
                email: string;
              }) => {
                setStepOneData({
                  firstName: data.firstName,
                  lastName: data.lastName,
                  otherName: data.otherName,
                  email: data.email,
                });
                handleNextClick();
              }}
            />
          )}
          {currentStep === 2 && (
            <StepTwo
              onNext={handleNextClick}
              applicationId={applicationId}
              stepOneData={stepOneData}
            />
          )}
          {currentStep === 3 && (
            <StepThree
              onNext={handleNextClick}
              onPrevious={handleBackClick}
              applicationId={applicationId}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default NewApplication;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepIndicator from "../../../../../../../shared/stepIndicator/StepIndicator";
import StepOne from "../stepOne/StepOne";
import StepTwo from "../stepTwo/StepTwo";
import StepThree from "../stepThree/StepThree";
import { button } from "../../../../../../../shared/buttons/Button";

const NewApplication = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const [stepOneData, setStepOneData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    otherName: "",
  });

  const navigate = useNavigate();

  const handleBackClick = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const handleNextClick = (data?: { newApplicationId?: string }) => {
    if (data?.newApplicationId) {
      setApplicationId(data.newApplicationId);
    }

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }

    if (currentStep < 3) {
      setCurrentStep((prevStep) => prevStep + 1);
    } else {
      navigate("/student/dashboard/application/application_successful");
    }
  };

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold dark:text-white">Application</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white px-[2em] py-3 pb-[10em] dark:bg-gray-800">
        <header>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-medium dark:text-gray-700">
                Manage Application /
                <span className="ml-1 font-medium text-primary-700 dark:text-white">
                  New Application
                </span>
              </h1>
            </div>
            <button.PrimaryButton className="btn-2" onClick={handleBackClick}>
              Back
            </button.PrimaryButton>
          </div>
        </header>
        <StepIndicator
          currentStep={currentStep}
          completedSteps={completedSteps}
          customLabels={[
            "Personal Details",
            "Destination Details",
            "Upload Document",
          ]}
        />
        <div className="mt-[2em]">
          {currentStep === 1 && (
            <StepOne
              onNext={(data: any) => {
                setStepOneData(data);
                handleNextClick();
              }}
            />
          )}
          {currentStep === 2 && (
            <StepTwo
              onNext={(data) => {
                console.log("StepTwo onNext called with data:", data);
                handleNextClick(data);
              }}
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

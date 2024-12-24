import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StepIndicator from "../../../shared/stepIndicator/StepIndicator";
import { button } from "../../../shared/buttons/Button";
import PersonalDetails from "../personalDetails/PersonalDetails";
import BankDetails from "../bankDetails/BankDetails";
import UploadedRegistrationDocument from "../uploadedRegistrationDoc/UploadedRegistrationDocument";

interface AgentData {
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  middleName: string;
  userId: string;
  bankAccounts: Array<{
    bankCode: string;
    accountName: string;
    accountNumber: string;
  }>;
  profile: {
    firstName: string;
    lastName: string;
    userId: string;
    [key: string]: any;
  };
}

const UpdateAgent = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const location = useLocation();
  const agentData: AgentData = location.state?.agentData;

  const navigate = useNavigate();

  const handleBackClick = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const handleNextClick = (data?: { newApplicationId?: string }) => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/student/dashboard/application/application_successful");
    }
  };

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">Application</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white px-[2em] py-3 pb-[10em] dark:bg-gray-800">
        <header>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-medium">
                Update Agent /
                <span className="ml-1 font-medium text-primary-700">
                  View Application
                </span>
              </h1>
            </div>
            <button.PrimaryButton className="btn-2" onClick={handleBackClick}>
              Back
            </button.PrimaryButton>
          </div>
        </header>
        <StepIndicator
          customLabels={[
            "Personal Details",
            "Bank Details",
            "Uploaded Document",
          ]}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />
        <div className="mt-[2em]">
          {currentStep === 1 && (
            <PersonalDetails agentData={agentData} onNext={handleNextClick} />
          )}
          {currentStep === 2 && (
            <BankDetails agentData={agentData} onNext={handleNextClick} />
          )}
          {currentStep === 3 && (
            <UploadedRegistrationDocument
              onNext={handleNextClick}
              agentData={agentData}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default UpdateAgent;

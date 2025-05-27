import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StepIndicator from "../../../../../../../shared/stepIndicator/StepIndicator";
import { button } from "../../../../../../../shared/buttons/Button";
import PersonalDetails from "../personalDetails/PersonalDetails";
import Degree from "../degree/Degree";
import UploadedDocuments from "../uploadedDocuments/UploadedDocuments";

interface StudentData {
  id: number;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  middleName: string;
  dateOfBirth: string;
  address: string;
  localGovtArea: string;
  state: string;
  country: string;
  internationalPassportNumber: string;
  status: string;
  userId: string;
  agentId: string | null;
  staffId: string | null;
  isAssignedToStaff: boolean;
  isAssignedToAgent: boolean;
  createdAt: string;
  updatedAt: string;
  payment: any;
}

const UpdateApplication = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const location = useLocation();
  const studentData: StudentData = location.state?.studentData;

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
      setCurrentStep(currentStep + 1);
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
                  Update Application
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
        />
        <div className="mt-[2em]">
          {currentStep === 1 && (
            <PersonalDetails
              studentData={studentData}
              onNext={(data: any) => {
                handleNextClick();
              }}
            />
          )}
          {currentStep === 2 && (
            <Degree
              studentData={studentData}
              onNext={(data: any) => handleNextClick(data)}
              applicationId={applicationId}
            />
          )}
          {currentStep === 3 && (
            <UploadedDocuments
              onNext={handleNextClick}
              onPrevious={handleBackClick}
              studentData={studentData}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default UpdateApplication;

import { useState } from "react";
import { useNavigate } from "react-router";
import StepIndicator from "../../../../../../../shared/stepIndicator/StepIndicator";
import StepOne from "../stepOne/StepOne";
import StepTwo from "../stepTwo/StepTwo";
import StepThree from "../stepThree/StepThree";
import { button } from "../../../../../../../shared/buttons/Button";

type CustomCountry = {
  cca2: string;
  name: string;
};

const NewApplication = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedDegree, setSelectedDegree] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const [stepOneData, setStepOneData] = useState<{
    firstName: string;
    lastName: string;
    middleName: string;
    dateOfBirth: string;
    address: string;
    email: string;
    state: string;
    localGovtArea: string;
    country: CustomCountry | null;
    internationalPassportNumber: string;
    phoneNumber: string;
    selectedDate: string;
  }>({
    firstName: "",
    lastName: "",
    middleName: "",
    dateOfBirth: "",
    address: "",
    email: "",
    state: "",
    localGovtArea: "",
    country: null,
    internationalPassportNumber: "",
    phoneNumber: "",
    selectedDate: "",
  });

  const navigate = useNavigate();

  const handleBackClick = async () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const handleNextClick = (data?: {
    newApplicationId?: string;
    selectedDegree?: string;
  }) => {
    if (data?.newApplicationId) {
      setApplicationId(data.newApplicationId);
    }
    if (data?.selectedDegree) {
      setSelectedDegree(data.selectedDegree);
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
        />
        <div className="mt-[2em]">
          {currentStep === 1 && (
            <StepOne
              onNext={(data: {
                firstName: string;
                lastName: string;
                middleName: string;
                dateOfBirth: string;
                address: string;
                email: string;
                state: string;
                localGovtArea: string;
                country: CustomCountry | null;
                internationalPassportNumber: string;
                phoneNumber: string;
                selectedDate: string;
              }) => {
                setStepOneData({
                  firstName: data.firstName,
                  lastName: data.lastName,
                  middleName: data.middleName,
                  dateOfBirth: data.dateOfBirth,
                  address: data.address,
                  email: data.email,
                  state: data.state,
                  localGovtArea: data.localGovtArea,
                  country: data.country,
                  internationalPassportNumber: data.internationalPassportNumber,
                  phoneNumber: data.phoneNumber,
                  selectedDate: data.selectedDate,
                });
                handleNextClick();
              }}
            />
          )}
          {currentStep === 2 && (
            <StepTwo
              onNext={(data) => handleNextClick(data)}
              setSelectedDegree={setSelectedDegree}
              applicationId={applicationId}
              stepOneData={stepOneData}
            />
          )}
          {currentStep === 3 && (
            <StepThree
              onNext={handleNextClick}
              onPrevious={handleBackClick}
              selectedDegree={selectedDegree}
              applicationId={applicationId}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default NewApplication;

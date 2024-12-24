import { useNavigate } from "react-router";
import Bachelors from "../degreeType/bachelo/Bachelors";
import Masters from "../degreeType/masters/Masters";
import Doctorial from "../degreeType/doctorials/Doctorial";
import { toast } from "react-toastify";
import InternationalYearOne from "../degreeType/internationalYearOne/InternationalYearOne";
import PreMasters from "../degreeType/preMasters/PreMasters";
import UnderGraduate from "../degreeType/underGraduate/UnderGraduate";

interface StepThreeProps {
  onNext: () => void;
  onPrevious: () => void;
  selectedDegree: string | null;
  applicationId: string | null;
}
const StepThree = ({
  onNext,
  selectedDegree,
  applicationId,
}: StepThreeProps) => {
  const navigate = useNavigate();
  const handleNextStep = () => {
    navigate("/student/dashboard/application/application_successful");
    onNext();
  };

  const renderStep = () => {
    if (!selectedDegree) {
      toast("Select a degree");
    }

    switch (selectedDegree) {
      case "BACHELOR":
        return (
          <Bachelors onNext={handleNextStep} applicationId={applicationId} />
        );
      case "MASTERS":
        return (
          <Masters onNext={handleNextStep} applicationId={applicationId} />
        );
      case "DOCTORATE":
        return (
          <Doctorial onNext={handleNextStep} applicationId={applicationId} />
        );
      case "INTERNATIONAL_YEAR_ONE":
        return (
          <InternationalYearOne
            onNext={handleNextStep}
            applicationId={applicationId}
          />
        );
      case "PRE_MASTERS":
        return (
          <PreMasters onNext={handleNextStep} applicationId={applicationId} />
        );
      case "UNDERGRADUATE":
        return (
          <UnderGraduate
            onNext={handleNextStep}
            applicationId={applicationId}
          />
        );
      default:
        return <p>Invalid degree selected.</p>;
    }
  };

  return <main>{renderStep()}</main>;
};

export default StepThree;

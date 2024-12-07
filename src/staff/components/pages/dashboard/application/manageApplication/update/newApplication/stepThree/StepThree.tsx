// import { useNavigate } from "react-router";
// import Bachelors from "../degree/bachelo/Bachelors";
// import Masters from "../degree/masters/Masters";
// import Doctorial from "../degree/doctorials/Doctorial";
// import { toast } from "react-toastify";

// interface StepThreeProps {
//   onNext: () => void;
//   onPrevious: () => void;
//   selectedDegree: string | null;
//   applicationId: string | null;
// }
// const StepThree = ({
//   onNext,
//   onPrevious,
//   selectedDegree,
//   applicationId,
// }: StepThreeProps) => {
//   const navigate = useNavigate();
//   const handleNextStep = () => {
//     navigate("/student/dashboard/application/application_successful");
//     onNext();
//   };

//   const renderStep = () => {
//     if (!selectedDegree) {
//       toast("Select a degree");
//     }

//     switch (selectedDegree) {
//       case "BACHELOR":
//         return (
//           <Bachelors onNext={handleNextStep} applicationId={applicationId} />
//         );
//       case "MASTERS":
//         return (
//           <Masters onNext={handleNextStep} applicationId={applicationId} />
//         );
//       case "DOCTORATE":
//         return (
//           <Doctorial onNext={handleNextStep} applicationId={applicationId} />
//         );
//       default:
//         return <p>Invalid degree selected.</p>;
//     }
//   };

//   return (
//     <main>
//       <button onClick={onPrevious}>Back</button>
//       {renderStep()}
//     </main>
//   );
// };

// export default StepThree;

interface StepThreeProps {
  onNext: () => void;
  onPrevious: () => void;
  selectedDegree: string | null;
  applicationId: string | null;
}
const StepThree = ({
  onNext,
  onPrevious,
  selectedDegree,
  applicationId,
}: StepThreeProps) => {
  return <div>StepThree</div>;
};

export default StepThree;

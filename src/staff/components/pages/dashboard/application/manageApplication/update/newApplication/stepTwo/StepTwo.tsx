// import { useState } from "react";
// import { AppDispatch } from "../../../../../../shared/redux/store";
// import { createApplication } from "../../../../../../shared/redux/student/slices/application.slices";
// import { useAppDispatch } from "../../../../../../shared/redux/hooks/reduxHooks";
// import { studentDegree } from "../../../../../../data/data";
// import { button } from "../../../../../../shared/buttons/Button";
// import activeCertificate from "../../../../../../assets/svg/ActiveCertificate.svg";
// import { CgAsterisk } from "react-icons/cg";
// import { toast } from "react-toastify";
// import ReactLoading from "react-loading";

// type CustomCountry = {
//   cca2: string;
//   name: string;
// };

// const StepTwo = ({
//   onNext,
//   setSelectedDegree,
//   applicationId,
//   stepOneData,
// }: {
//   onNext: (data: {
//     newApplicationId?: string;
//     selectedDegree?: string;
//   }) => void;
//   setSelectedDegree: (degree: string) => void;
//   applicationId: string | null;
//   stepOneData: {
//     firstName: string;
//     lastName: string;
//     middleName: string;
//     dateOfBirth: string;
//     address: string;
//     state: string;
//     localGovtArea: string;
//     country: CustomCountry | null;
//     internationalPassportNumber: string;
//     phoneNumber: string;
//     selectedDate: string;
//   };
// }) => {
//   const [university, setUniversity] = useState("");
//   const [course, setCourse] = useState("");
//   const [degreeType, setDegreeType] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const dispatch: AppDispatch = useAppDispatch();

//   const submitDegree = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setLoading(true);

//     if (degreeType) {
//       setSelectedDegree(degreeType);
//       try {
//         const body = {
//           ...stepOneData,
//           course,
//           university,
//           degreeType,
//         };

//         const response = await dispatch(createApplication(body)).unwrap();

//         if (response.status === 201) {
//           const newApplicationId = response.data.application.id;
//           onNext({ newApplicationId, selectedDegree: degreeType });
//         } else {
//           toast.error(response.data.message);
//         }
//       } catch (error: any) {
//         toast.error(error.message);
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       toast("Kindly select a degree");
//       setLoading(false);
//     }
//   };

//   const handleDegreeSelect = (degree: string) => {
//     setDegreeType(degree);
//   };

//   return (
//     <main className="font-outfit">
//       <header>
//         <h2 className="text-xl font-semibold dark:text-white">Degree</h2>
//       </header>
//       <form onSubmit={submitDegree}>
//         <div className="flex flex-col gap-[1.5em]">
//           <div className="mt-[2em] flex w-[40%] flex-col gap-[1.5em]">
//             <div className="w-full">
//               <label
//                 htmlFor="university"
//                 className="flex-start flex font-medium dark:text-white"
//               >
//                 University
//                 <CgAsterisk className="text-red-500" />
//               </label>
//               <input
//                 name="university"
//                 id="university"
//                 type="text"
//                 onChange={(e) => setUniversity(e.target.value)}
//                 value={university}
//                 className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none dark:border-none dark:bg-gray-700 dark:text-white"
//               />
//             </div>
//           </div>
//           <p>What do you want to study abroad</p>
//           <div className="flex w-[70%] gap-[2em]">
//             {studentDegree?.map((text, index) => (
//               <div
//                 key={index}
//                 className={`flex w-full cursor-pointer flex-col gap-[1em] rounded-lg px-[20px] py-[1.5em] dark:bg-gray-700 dark:text-white ${degreeType === text.value ? "bg-primary-700 text-white" : "bg-purple-white text-primary-700"}`}
//                 onClick={() => handleDegreeSelect(text.value)}
//               >
//                 <header>
//                   <div className="flex justify-between">
//                     <img
//                       src={
//                         degreeType === text.value
//                           ? activeCertificate
//                           : text.iconA
//                       }
//                       alt="certificate_icon"
//                     />
//                     <img src={text.iconB} alt="circle_icon" />
//                   </div>
//                 </header>
//                 <div
//                   className={`text-xl dark:text-white ${degreeType === text.value ? "text-white" : "text-primary-700"}`}
//                 >
//                   <h1>{text.titleA}</h1>
//                   <h1>{text.titleB}</h1>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="w-[40%]">
//             <label
//               htmlFor="course"
//               className="flex-start flex font-medium dark:text-white"
//             >
//               Course
//               <CgAsterisk className="text-red-500" />
//             </label>
//             <input
//               name="course"
//               id="course"
//               onChange={(e) => setCourse(e.target.value)}
//               value={course}
//               className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none dark:border-none dark:bg-gray-700 dark:text-white"
//             />
//           </div>
//         </div>

//         <button.PrimaryButton
//           className="m-auto mt-[5em] w-[30%] justify-center gap-2 rounded-full bg-linear-gradient py-[11px] text-center font-medium text-white"
//           type="submit"
//           disabled={loading}
//         >
//           {loading ? (
//             <ReactLoading color="#FFFFFF" width={25} height={25} type="spin" />
//           ) : (
//             "Continue"
//           )}
//         </button.PrimaryButton>
//       </form>
//     </main>
//   );
// };

// export default StepTwo;

import React from "react";

type CustomCountry = {
  cca2: string;
  name: string;
};

const StepTwo = ({
  onNext,
  setSelectedDegree,
  applicationId,
  stepOneData,
}: {
  onNext: (data: {
    newApplicationId?: string;
    selectedDegree?: string;
  }) => void;
  setSelectedDegree: (degree: string) => void;
  applicationId: string | null;
  stepOneData: {
    firstName: string;
    lastName: string;
    middleName: string;
    dateOfBirth: string;
    address: string;
    state: string;
    localGovtArea: string;
    country: CustomCountry | null;
    internationalPassportNumber: string;
    phoneNumber: string;
    selectedDate: string;
  };
}) => {
  return <div>StepTwo</div>;
};

export default StepTwo;

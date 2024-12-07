// import { useState, useRef } from "react";
// import useCountries, {
//   useStates,
// } from "../../../../../../shared/redux/hooks/useCountries";
// import CustomDatePicker from "../../../../../../shared/utils/CustomeDatePicker";
// import useClickOutside from "../../../../../../shared/utils/useClickOutside";
// import { button } from "../../../../../../shared/buttons/Button";
// import Flag from "react-world-flags";
// import { CgAsterisk } from "react-icons/cg";
// import { IoIosArrowDown } from "react-icons/io";
// import ReactLoading from "react-loading";
// import { toast } from "react-toastify";

// interface Country {
//   name: string;
//   cca2: string;
// }

// const StepOne = ({ onNext }: any) => {
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [middleName, setMiddleName] = useState("");
//   const [dateOfBirth, setDateOfBirth] = useState("");
//   const [address, setAddress] = useState("");
//   const [state, setState] = useState<string | null>(null);
//   const [localGovtArea, setLocalGovtArea] = useState("");
//   const [country, setCountry] = useState<Country | null>(null);
//   const [internationalPassportNumber, setInternationalPassportNumber] =
//     useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);

//   const [loading, setLoading] = useState(false);

//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const stateDropdownRef = useRef<HTMLDivElement>(null);

//   useClickOutside(dropdownRef, () => setIsDropdownOpen(false));
//   useClickOutside(stateDropdownRef, () => setIsStateDropdownOpen(false));

//   const { countries } = useCountries();
//   const { states, loading: statesLoading } = useStates();

//   const handleDateChange = (date: any) => {
//     setSelectedDate(date);
//     setDateOfBirth(date);
//   };

//   const handleStateSelect = (selectedState: string) => {
//     setState(selectedState);
//     setIsStateDropdownOpen(false);
//   };

//   const handleCountrySelect = (country: Country) => {
//     setCountry(country);
//     setIsDropdownOpen(false);
//   };

//   const areFieldsFilled = () => {
//     return (
//       firstName &&
//       lastName &&
//       dateOfBirth &&
//       address &&
//       localGovtArea &&
//       state &&
//       country &&
//       phoneNumber &&
//       internationalPassportNumber
//     );
//   };

//   const submitApplication: React.FormEventHandler<HTMLFormElement> = async (
//     event,
//   ) => {
//     event.preventDefault();
//     if (!areFieldsFilled()) {
//       toast.error("All fields must be filled");
//       return;
//     }

//     setLoading(true);

//     setTimeout(() => {
//       const body = {
//         firstName,
//         lastName,
//         middleName,
//         dateOfBirth,
//         address,
//         phoneNumber,
//         localGovtArea,
//         state,
//         country: country ? country.name : null,
//         internationalPassportNumber,
//       };
//       onNext(body);
//       setLoading(false);
//     }, 3000);
//   };

//   return (
//     <main className="font-outfit">
//       <header>
//         <h2 className="text-xl font-semibold dark:text-white">
//           Personal Details
//         </h2>
//       </header>
//       <form
//         className="mt-[2em] w-[77%] dark:text-white"
//         onSubmit={submitApplication}
//       >
//         <div className="flex flex-row gap-[3em]">
//           <div className="w-full">
//             <label htmlFor="firstName" className="flex-start flex font-medium">
//               First Name
//               <CgAsterisk className="text-red-500" />
//             </label>
//             <input
//               id="firstName"
//               name="firstName"
//               onChange={(e) => setFirstName(e.target.value)}
//               className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
//             />
//           </div>
//           <div className="w-full">
//             <label htmlFor="lastName" className="flex-start flex font-medium">
//               Last Name
//               <CgAsterisk className="text-red-500" />
//             </label>
//             <input
//               id="lastName"
//               name="lastName"
//               type="text"
//               onChange={(e) => setLastName(e.target.value)}
//               className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
//             />
//           </div>
//         </div>

//         <div className="mt-[1em] flex flex-row gap-[3em]">
//           <div className="w-full">
//             <label htmlFor="middleName" className="flex-start flex font-medium">
//               Middle Name
//               <span className="ml-2 font-normal text-grey">(Optional)</span>
//             </label>
//             <input
//               id="middleName"
//               name="middleName"
//               onChange={(e) => setMiddleName(e.target.value)}
//               className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none dark:text-white"
//             />
//           </div>
//           <div className="w-full">
//             <label
//               htmlFor="phoneNumber"
//               className="flex-start flex font-medium"
//             >
//               Phone Number
//               <CgAsterisk className="text-red-500" />
//             </label>
//             <input
//               id="phoneNumber"
//               name="phoneNumber"
//               type="text"
//               onChange={(e) => setPhoneNumber(e.target.value)}
//               className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
//             />
//           </div>
//         </div>

//         <div className="mt-[1em] flex flex-row gap-[3em]">
//           <div className="w-full">
//             <label
//               htmlFor="dateOfBirth"
//               className="flex-start flex font-medium"
//             >
//               Date of Birth
//               <CgAsterisk className="text-red-500" />
//             </label>
//             <CustomDatePicker
//               selected={selectedDate}
//               onChange={handleDateChange}
//             />
//           </div>
//           <div className="w-full">
//             <label htmlFor="address" className="flex-start flex font-medium">
//               Address
//               <CgAsterisk className="text-red-500" />
//             </label>
//             <input
//               id="address"
//               name="address"
//               type="text"
//               onChange={(e) => setAddress(e.target.value)}
//               className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
//             />
//           </div>
//         </div>

//         <div className="mt-[1em] flex flex-row gap-[3em]">
//           <div className="w-full">
//             <label
//               htmlFor="localGovtArea"
//               className="flex-start flex font-medium"
//             >
//               L.G.A
//               <CgAsterisk className="text-red-500" />
//             </label>
//             <input
//               id="localGovtArea"
//               name="localGovtArea"
//               onChange={(e) => setLocalGovtArea(e.target.value)}
//               className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
//             />
//           </div>

//           <div className="relative w-full" ref={dropdownRef}>
//             <label htmlFor="state" className="flex-start flex font-medium">
//               State <CgAsterisk className="text-red-500" />
//             </label>
//             <button
//               type="button"
//               className="border-border bg-input text-textp mt-[10px] w-full rounded-lg border-[2px] bg-inherit p-3 text-left"
//               onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
//             >
//               {state ? (
//                 <div className="flex items-center">{state}</div>
//               ) : (
//                 <div className="flex items-center justify-between">
//                   <p>Select State</p>
//                   <IoIosArrowDown className="ml-2" />
//                 </div>
//               )}
//             </button>
//             {isStateDropdownOpen && (
//               <div className="absolute mt-1 h-[13em] w-full overflow-auto bg-white px-3 py-2 shadow-lg">
//                 {statesLoading ? (
//                   <ReactLoading
//                     color="#000000"
//                     width={25}
//                     height={25}
//                     type="spin"
//                   />
//                 ) : (
//                   states?.map((state: any) => (
//                     <div
//                       key={state}
//                       onClick={() => handleStateSelect(state)}
//                       className="cursor-pointer p-2 hover:bg-gray-200"
//                     >
//                       {state}
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="mt-[1em] flex flex-row gap-[3em]">
//           <div className="w-full">
//             <label htmlFor="country" className="flex-start flex font-medium">
//               Country
//               <CgAsterisk className="text-red-500" />
//             </label>
//             <div className="relative mt-1" ref={dropdownRef}>
//               <button
//                 type="button"
//                 className="border-border bg-input text-textp mt-[10px] w-full rounded-lg border-[2px] bg-inherit p-3 text-left"
//                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               >
//                 {country ? (
//                   <div className="flex items-center">
//                     <Flag
//                       code={country.cca2}
//                       alt={country.name}
//                       style={{ width: 24, height: 16, marginRight: 8 }}
//                     />
//                     {country.name}
//                   </div>
//                 ) : (
//                   <div className="flex justify-between">
//                     <p>Select Country</p>
//                     <IoIosArrowDown className="ml-2" />
//                   </div>
//                 )}
//               </button>
//               {isDropdownOpen && (
//                 <div className="absolute mt-1 h-[13em] w-full overflow-auto bg-white shadow-lg">
//                   {loading ? (
//                     <div className="flex h-full items-center justify-center">
//                       <ReactLoading
//                         type="spin"
//                         color="#000000"
//                         height={50}
//                         width={50}
//                       />
//                     </div>
//                   ) : (
//                     countries?.map((country) => (
//                       <button
//                         key={country?.cca2}
//                         onClick={() => handleCountrySelect(country)}
//                         className="flex w-full items-center p-3 text-left hover:bg-gray-200 dark:hover:bg-gray-700"
//                       >
//                         <Flag
//                           code={country?.cca2}
//                           alt={country?.name}
//                           style={{ width: 24, height: 16, marginRight: 8 }}
//                         />
//                         {country?.name}
//                       </button>
//                     ))
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//           <div className="w-full">
//             <label htmlFor="lastName" className="flex-start flex font-medium">
//               Internation Passport Number
//               <CgAsterisk className="text-red-500" />
//             </label>
//             <input
//               id="lastName"
//               name="lastName"
//               type="text"
//               onChange={(e) => setInternationalPassportNumber(e.target.value)}
//               className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
//             />
//           </div>
//         </div>

//         <div className="mr-auto mt-4">
//           <button.PrimaryButton
//             className="m-auto mt-[5em] w-[37%] justify-center gap-2 rounded-full bg-linear-gradient py-[11px] text-center font-medium text-white"
//             type="submit"
//             disabled={loading}
//           >
//             {loading ? (
//               <ReactLoading
//                 color="#FFFFFF"
//                 width={25}
//                 height={25}
//                 type="spin"
//               />
//             ) : (
//               "Save and Continue"
//             )}
//           </button.PrimaryButton>
//         </div>
//       </form>
//     </main>
//   );
// };

// export default StepOne;

import React from "react";

const StepOne = ({ onNext }: any) => {
  return <div>StepOne</div>;
};

export default StepOne;

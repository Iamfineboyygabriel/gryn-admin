// import { useRef, useState } from "react";
// import { button } from "../../../../../../../shared/buttons/Button";
// import { toast } from "react-toastify";
// import ReactLoading from "react-loading";
// import CustomDatePicker from "../../../../../../../shared/utils/CustomeDatePicker";
// import { useCountries } from "../../../../../../../shared/redux/hooks/shared/getUserProfile";
// import { IoIosArrowDown } from "react-icons/io";
// import Flag from "react-world-flags";
// import useClickOutside from "../../../../../../../shared/utils/useClickOutside";
// import { AppDispatch } from "../../../../../../../shared/redux/store";
// import { useAppDispatch } from "../../../../../../../shared/redux/hooks/shared/reduxHooks";
// import { createVisaApplication } from "../../../../../../../shared/redux/shared/slices/shareApplication.slices";

// interface CreateApplicationBody {
//   firstName: string;
//   lastName: string;
//   otherName?: string;
//   email: string;
//   passportNumber: string;
//   issuedDate: string;
//   expiryDate: string;
//   destination: string | null;
//   agentEmail: string;
//   schoolName: string;
// }

// interface Country {
//   name: string;
//   cca2: string;
// }

// const StepTwo = ({
//   onNext,
//   stepOneData,
// }: {
//   onNext: (data: { newApplicationId?: string }) => void;
//   applicationId: string | null;
//   stepOneData: {
//     firstName: string;
//     lastName: string;
//     otherName: string;
//     email: string;
//   };
// }) => {
//   const [issuedDate, setIssuedDate] = useState<Date | null>(null);
//   const [expiryDate, setExpiryDate] = useState<Date | null>(null);
//   const [passportNumber, setPassportNumber] = useState("");
//   const [destination, setDestination] = useState<Country | null>(null);
//   const [agentEmail, setAgentEmail] = useState("");
//   const [schoolName, setSchoolName] = useState("");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const dropdownRef = useRef<HTMLDivElement>(null);
//   useClickOutside(dropdownRef, () => setIsDropdownOpen(false));
//   const dispatch: AppDispatch = useAppDispatch();

//   const [loading, setLoading] = useState(false);
//   const { countries } = useCountries();

//   const validateFields = () => {
//     if (!destination || !issuedDate || !expiryDate) {
//       return "Please fill in destination, issued date, and expiry date.";
//     }
//     return null;
//   };

//   const submitApplication = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     const validationError = validateFields();
//     if (validationError) {
//       toast.error(validationError);
//       return;
//     }
//     setLoading(true);

//     try {
//       const body: CreateApplicationBody = {
//         ...stepOneData,
//         issuedDate: issuedDate?.toISOString().split("T")[0] || "",
//         passportNumber,
//         expiryDate: expiryDate?.toISOString().split("T")[0] || "",
//         destination: destination?.name || null,
//         agentEmail,
//         schoolName,
//       };

//       const response = await dispatch(createVisaApplication(body)).unwrap();

//       if (response.status === 201) {
//         const newApplicationId = response.data.application.id;
//         onNext({ newApplicationId });
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error: any) {
//       toast.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCountrySelect = (country: Country) => {
//     setDestination(country);
//     setIsDropdownOpen(false);
//   };

//   return (
//     <main className="font-outfit">
//       <header>
//         <h2 className="text-xl font-semibold dark:text-white">Degree</h2>
//       </header>
//       <form
//         onSubmit={submitApplication}
//         className="mt-[2em] w-[77%] dark:text-white"
//       >
//         <div className="flex flex-col gap-[1.5em]">
//           <div className="mt-[1em] flex flex-row gap-[3em]">
//             <div className="w-full">
//               <label
//                 htmlFor="passportNumber"
//                 className="flex-start flex font-medium"
//               >
//                 Passport Number
//               </label>
//               <input
//                 id="passportNumber"
//                 name="passportNumber"
//                 required
//                 disabled={loading}
//                 type="text"
//                 onChange={(e) => setPassportNumber(e.target.value)}
//                 className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
//               />
//             </div>

//             <div className="w-full">
//               <label
//                 htmlFor="issuedDate"
//                 className="flex-start flex font-medium"
//               >
//                 Issued Date
//               </label>
//               <CustomDatePicker
//                 selected={issuedDate}
//                 onChange={(date: any) => setIssuedDate(date)}
//               />
//             </div>
//           </div>

//           <div className="mt-[1em] flex flex-row gap-[3em]">
//             <div className="w-full">
//               <label
//                 htmlFor="expiryDate"
//                 className="flex-start flex font-medium"
//               >
//                 Expiry Date
//               </label>
//               <CustomDatePicker
//                 selected={expiryDate}
//                 onChange={(date: any) => setExpiryDate(date)}
//               />
//             </div>

//             <div className="w-full">
//               <label htmlFor="country" className="flex-start flex font-medium">
//                 Destination
//               </label>
//               <div className="relative mt-1" ref={dropdownRef}>
//                 <button
//                   type="button"
//                   disabled={loading}
//                   className="border-border bg-input text-textp mt-[10px] w-full rounded-lg border-[2px] bg-inherit p-3 text-left"
//                   onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                 >
//                   {destination ? (
//                     <div className="flex items-center">
//                       <Flag
//                         code={destination.cca2}
//                         alt={destination.name}
//                         style={{ width: 24, height: 16, marginRight: 8 }}
//                       />
//                       {destination.name}
//                     </div>
//                   ) : (
//                     <div className="flex justify-between">
//                       <p>Select Country</p>
//                       <IoIosArrowDown className="ml-2" />
//                     </div>
//                   )}
//                 </button>
//                 {isDropdownOpen && (
//                   <div className="absolute mt-1 h-[13em] w-full overflow-auto bg-white shadow-lg dark:bg-gray-600">
//                     {loading ? (
//                       <div className="flex gap-2 p-3">
//                         <ReactLoading
//                           type="spin"
//                           color="#000000"
//                           height={25}
//                           width={25}
//                         />
//                         <span>Please wait...</span>
//                       </div>
//                     ) : (
//                       countries?.map((country) => (
//                         <button
//                           key={country.cca2}
//                           type="button"
//                           onClick={() => handleCountrySelect(country)}
//                           className="flex w-full items-center p-3 text-left hover:bg-gray-200 dark:hover:bg-gray-800"
//                         >
//                           <Flag
//                             code={country.cca2}
//                             alt={country.name}
//                             style={{ width: 24, height: 16, marginRight: 8 }}
//                           />
//                           {country.name}
//                         </button>
//                       ))
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="mt-[1em] flex flex-row gap-[3em]">
//             <div className="w-full">
//               <label htmlFor="schoolName" className="flex-start font-medium">
//                 School Name
//               </label>
//               <input
//                 id="schoolName"
//                 name="schoolName"
//                 onChange={(e) => setSchoolName(e.target.value)}
//                 className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none dark:text-white"
//               />
//             </div>
//             <div className="w-full">
//               <label
//                 htmlFor="assignedAgent"
//                 className="flex-start flex font-medium"
//               >
//                 Agent Email Address
//               </label>
//               <input
//                 id="assignedAgent"
//                 name="assignedAgent"
//                 type="text"
//                 required
//                 disabled={loading}
//                 onChange={(e) => setAgentEmail(e.target.value)}
//                 className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none dark:text-white"
//               />
//             </div>
//           </div>
//         </div>

//         <button.PrimaryButton
//           type="submit"
//           disabled={loading}
//           className="m-auto mt-[5em] w-[37%] justify-center gap-2 rounded-full bg-linear-gradient py-[11px] text-center font-medium text-white"
//         >
//           {loading ? (
//             <ReactLoading type="spin" color="#ffffff" height={25} width={25} />
//           ) : (
//             "Save & Continue"
//           )}
//         </button.PrimaryButton>
//       </form>
//     </main>
//   );
// };

// export default StepTwo;

import { useState } from "react";
import { button } from "../../../../../../../shared/buttons/Button";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import CustomDatePicker from "../../../../../../../shared/utils/CustomeDatePicker";
import { useCountries } from "../../../../../../../shared/redux/hooks/shared/getUserProfile";
import Flag from "react-world-flags";
import { AppDispatch } from "../../../../../../../shared/redux/store";
import { useAppDispatch } from "../../../../../../../shared/redux/hooks/shared/reduxHooks";
import { createVisaApplication } from "../../../../../../../shared/redux/shared/slices/shareApplication.slices";
import { Dropdown } from "../../../../../../../shared/dropDown/DropDown";

interface CreateApplicationBody {
  firstName: string;
  lastName: string;
  otherName?: string;
  email: string;
  passportNumber: string;
  issuedDate: string;
  expiryDate: string;
  destination: string | null;
  agentEmail: string;
  schoolName: string;
}

interface Destination {
  name: string;
  cca2: string;
}

const StepTwo = ({
  onNext,
  stepOneData,
}: {
  onNext: (data: {
    newApplicationId?: string;
    moveToStepThree?: boolean;
  }) => void;
  applicationId: string | null;
  stepOneData: {
    firstName: string;
    lastName: string;
    otherName: string;
    email: string;
  };
}) => {
  const [issuedDate, setIssuedDate] = useState<Date | null>(null);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [passportNumber, setPassportNumber] = useState("");
  const [destination, setDestination] = useState<Destination | null>(null);
  const [agentEmail, setAgentEmail] = useState("");
  const [schoolName, setSchoolName] = useState("");

  const dispatch: AppDispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const { countries, loading: countriesLoading } = useCountries();

  const destinationDropdownItems = countries.map((country) => ({
    name: country.name,
    cca2: country.cca2,
    label: (
      <div className="flex items-center">
        <Flag
          code={country.cca2}
          alt={country.name}
          style={{ width: 24, height: 16, marginRight: 8 }}
        />
        {country.name}
      </div>
    ),
  }));

  const validateFields = () => {
    if (!destination || !issuedDate || !expiryDate) {
      return "Please fill in destination, issued date, and expiry date.";
    }
    return null;
  };

  const submitApplication = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateFields();
    if (validationError) {
      toast.error(validationError);
      return;
    }
    setLoading(true);

    try {
      const body: CreateApplicationBody = {
        ...stepOneData,
        issuedDate: issuedDate?.toISOString().split("T")[0] || "",
        passportNumber,
        expiryDate: expiryDate?.toISOString().split("T")[0] || "",
        destination: destination?.name || null,
        agentEmail,
        schoolName,
      };

      const response = await dispatch(createVisaApplication(body)).unwrap();

      if (response.status === 201) {
        const newApplicationId = response.data.application.id;
        onNext({ newApplicationId, moveToStepThree: true });
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleCountrySelect: any = (item: any) => {
    setDestination({ name: item.name, cca2: item.cca2 });
  };

  return (
    <main className="font-outfit">
      <header>
        <h2 className="text-xl font-semibold dark:text-white">Degree</h2>
      </header>
      <form
        onSubmit={submitApplication}
        className="mt-[2em] w-[77%] dark:text-white"
      >
        <div className="flex flex-col gap-[1.5em]">
          <div className="mt-[1em] flex flex-col lg:flex-row gap-[1em] lg:gap-[3em]">
            <div className="w-full">
              <label
                htmlFor="passportNumber"
                className="flex-start flex font-medium"
              >
                Passport Number
              </label>
              <input
                id="passportNumber"
                name="passportNumber"
                required
                disabled={loading}
                type="text"
                onChange={(e) => setPassportNumber(e.target.value)}
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
              />
            </div>

            <div className="w-full">
              <label
                htmlFor="issuedDate"
                className="flex-start flex font-medium"
              >
                Issued Date
              </label>
              <input
                type="date"
                name="date"
                id="date"
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                onChange={(e) => setPassportNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="lg:mt-[1em] flex flex-col lg:flex-row gap-[1em] lg:gap-[3em]">
            <div className="w-full">
              <label
                htmlFor="expiryDate"
                className="flex-start flex font-medium"
              >
                Expiry Date
              </label>
              <input
                type="date"
                onChange={(date: any) => setExpiryDate(date)}
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                name="expDate"
                id="expDate"
              />
            </div>

            <div className="w-full">
              <Dropdown
                label="Destination"
                items={destinationDropdownItems}
                selectedItem={
                  destination
                    ? {
                        name: destination.name,
                        cca2: destination.cca2,
                        label: destinationDropdownItems.find(
                          (item) => item.name === destination.name
                        )?.label,
                      }
                    : null
                }
                onSelectItem={handleCountrySelect}
                asterisk
                searchVisible
                loading={countriesLoading}
                placeholder="Destination"
              />
            </div>
          </div>
          <div className="lg:mt-[1em] flex flex-col lg:flex-row gap-[1em] lg:gap-[3em]">
            <div className="w-full">
              <label htmlFor="schoolName" className="flex-start font-medium">
                School Name
              </label>
              <input
                id="schoolName"
                name="schoolName"
                onChange={(e) => setSchoolName(e.target.value)}
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="assignedAgent"
                className="flex-start flex font-medium"
              >
                Agent Email Address
              </label>
              <input
                id="assignedAgent"
                name="assignedAgent"
                type="text"
                required
                disabled={loading}
                onChange={(e) => setAgentEmail(e.target.value)}
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button.PrimaryButton
          type="submit"
          disabled={loading}
          className="m-auto mt-[5em] w-[37%] justify-center gap-2 rounded-full bg-linear-gradient py-[11px] text-center font-medium text-white"
        >
          {loading ? (
            <ReactLoading type="spin" color="#ffffff" height={25} width={25} />
          ) : (
            "Save & Continue"
          )}
        </button.PrimaryButton>
      </form>
    </main>
  );
};

export default StepTwo;

import React, { useRef, useState } from "react";
import { useAppDispatch } from "../../../../../../../shared/redux/hooks/shared/reduxHooks";
import { createVisaApplication } from "../../../../../../../shared/redux/shared/slices/shareApplication.slices";
import useClickOutside from "../../../../../../../shared/utils/useClickOutside";
import { button } from "../../../../../../../shared/buttons/Button";
import { IoIosArrowDown } from "react-icons/io";
import ReactLoading from "react-loading";
import Flag from "react-world-flags";
import { toast } from "react-toastify";
import { AppDispatch } from "../../../../../../../shared/redux/store";
import { countries } from "../../../../../../../data/data";

interface CreateApplicationBody {
  firstName: string;
  lastName: string;
  otherName?: string;
  email: string;
  passportNumber: string;
  issuedDate: string;
  expiryDate: string;
  destination: string;
  // agentEmail: string;
  schoolName: string;
}

interface Country {
  name: string;
  cca2: string;
}

interface StepTwoProps {
  onNext: (data: { newApplicationId?: string }) => void;
  applicationId: string | null;
  stepOneData: {
    firstName: string;
    lastName: string;
    otherName: string;
    email: string;
  };
}

const StepTwo: React.FC<StepTwoProps> = ({
  onNext,
  stepOneData,
  applicationId,
}) => {
  const [issuedDate, setIssuedDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [destination, setDestination] = useState<Country | null>(null);
  // const [agentEmail, setAgentEmail] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setIsDropdownOpen(false));
  const dispatch: AppDispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);

  const validateFields = () => {
    if (
      !destination ||
      !issuedDate ||
      !expiryDate ||
      !passportNumber
      // !agentEmail
    ) {
      return "Please fill in all required fields.";
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
        issuedDate,
        passportNumber,
        expiryDate,
        destination: destination?.name || "",
        // agentEmail,
        schoolName,
      };

      const response = await dispatch(createVisaApplication(body)).unwrap();
      if (response.status === 201 && response.data?.id) {
        const newApplicationId = response.data.id;
        onNext({ newApplicationId });
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data ||
        error.message ||
        "An error occurred";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCountrySelect = (country: Country) => {
    setDestination(country);
    setIsDropdownOpen(false);
  };

  return (
    <main className="font-outfit">
      <header>
        <h2 className="text-xl font-semibold">Degree</h2>
      </header>
      <form
        onSubmit={submitApplication}
        className="mt-[2em] w-[84%] lg:w-[77%]"
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
                type="tel"
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
                id="date"
                onChange={(e) => setIssuedDate(e.target.value)}
                required
                disabled={loading}
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
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
                id="expiryDate"
                onChange={(e) => setExpiryDate(e.target.value)}
                required
                disabled={loading}
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
              />
            </div>

            <div className="w-full">
              <label htmlFor="country" className="flex-start flex font-medium">
                Destination
              </label>
              <div className="relative mt-1" ref={dropdownRef}>
                <button
                  type="button"
                  disabled={loading}
                  className="border-border bg-input text-textp mt-[10px] w-full rounded-lg border-[2px] bg-inherit p-3 text-left"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {destination ? (
                    <div className="flex items-center">
                      <Flag
                        code={destination.cca2}
                        alt={destination.name}
                        style={{ width: 24, height: 16, marginRight: 8 }}
                      />
                      {destination.name}
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <p>Select Country</p>
                      <IoIosArrowDown className="ml-2" />
                    </div>
                  )}
                </button>
                {isDropdownOpen && (
                  <div className="absolute mt-1 h-[13em] w-full overflow-auto bg-white shadow-lg dark:bg-gray-600">
                    {loading ? (
                      <div className="flex gap-2 p-3">
                        <ReactLoading
                          type="spin"
                          color="#000000"
                          height={25}
                          width={25}
                        />
                        <span>Please wait...</span>
                      </div>
                    ) : (
                      countries?.map((country) => (
                        <button
                          key={country.cca2}
                          type="button"
                          onClick={() => handleCountrySelect(country)}
                          className="flex w-full items-center p-3 text-left hover:bg-gray-200 dark:hover:bg-gray-800"
                        >
                          <Flag
                            code={country.cca2}
                            alt={country.name}
                            style={{ width: 24, height: 16, marginRight: 8 }}
                          />
                          {country.name}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:mt-[1em] flex flex-col lg:flex-row gap-[1em] w-1/2 lg:gap-[3em]">
            <div className="w-full">
              <label htmlFor="schoolName" className="flex-start font-medium">
                School Name
              </label>
              <input
                id="schoolName"
                name="schoolName"
                type="text"
                onChange={(e) => setSchoolName(e.target.value)}
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none dark:text-white"
              />
            </div>
            {/* <div className="w-full">
              <label
                htmlFor="assignedAgent"
                className="flex-start flex font-medium"
              >
                Agent Email Address
              </label>
              <input
                id="assignedAgent"
                name="assignedAgent"
                type="email"
                required
                disabled={loading}
                onChange={(e) => setAgentEmail(e.target.value)}
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none dark:text-white"
              />
            </div> */}
          </div>
        </div>

        <button.PrimaryButton
          type="submit"
          disabled={loading}
          className="m-auto mt-[5em] w-[50%] lg:w-[37%] justify-center gap-2 rounded-full bg-linear-gradient py-[11px] text-center font-medium text-white"
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

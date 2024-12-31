import { useState } from "react";
import { button } from "../../../../../../../shared/buttons/Button";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import Flag from "react-world-flags";
import { AppDispatch } from "../../../../../../../shared/redux/store";
import { useAppDispatch } from "../../../../../../../shared/redux/hooks/shared/reduxHooks";
import { createVisaApplication } from "../../../../../../../shared/redux/shared/slices/shareApplication.slices";
import { Dropdown } from "../../../../../../../shared/dropDown/DropDown";
import { countries } from "../../../../../../../data/data";

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

interface ApiResponse {
  status: number;
  message: string;
  data: {
    id: number;
    firstName: string;
    lastName: string;
    // ... other fields
  };
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
  const [issuedDate, setIssuedDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [destination, setDestination] = useState<Destination | null>(null);
  const [agentEmail, setAgentEmail] = useState("");
  const [schoolName, setSchoolName] = useState("");

  const dispatch: AppDispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);

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
        issuedDate: issuedDate ? `${issuedDate}T00:00:00Z` : "",
        passportNumber,
        expiryDate: expiryDate ? `${expiryDate}T00:00:00Z` : "",
        destination: destination?.name || null,
        agentEmail,
        schoolName,
      };

      const response = (await dispatch(
        createVisaApplication(body)
      ).unwrap()) as ApiResponse;

      if (response.status === 201 && response.data) {
        const newApplicationId = String(response.data.id); // Convert to string since onNext expects string
        onNext({ newApplicationId, moveToStepThree: true });
      } else {
        toast.error(response.message || "Failed to create application");
      }
    } catch (error: any) {
      toast.error(
        error.message || "An error occurred while creating the application"
      );
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
        <h2 className="text-xl font-semibold">Degree</h2>
      </header>
      <form onSubmit={submitApplication} className="mt-[2em] w-[77%]">
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
                onChange={(e) => setIssuedDate(e.target.value)}
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
                onChange={(e) => setExpiryDate(e.target.value)}
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

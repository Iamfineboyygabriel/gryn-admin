import { useCallback, useState } from "react";
import { button } from "../../../../../../../shared/buttons/Button";
import { CgAsterisk } from "react-icons/cg";
import ReactLoading from "react-loading";
import {
  Dropdown,
  DropdownItem,
} from "../../../../../../../shared/dropDown/DropDown";

const StepOne = ({ onNext }: any) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [otherName, setOtherName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("");

  const visaTypes = [
    { name: "Tourist Visa", value: "TOURIST_VISA" },
    { name: "Study Visa", value: "STUDY_VISA" },
    { name: "Freelance Visa", value: "FREELANCE_VISA" },
  ];

  const handleSelectVisaType = useCallback((item: DropdownItem) => {
    setType(item?.value || "");
  }, []);

  const submitApplication: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();

    if (!firstName || !lastName || !email || !type) {
      alert("Please fill in all required fields including visa type");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const body = {
        firstName,
        lastName,
        otherName,
        email,
        type,
      };
      onNext(body);
      setLoading(false);
    }, 3000);
  };

  return (
    <main className="font-outfit">
      <header>
        <h2 className="text-xl font-semibold">Personal Details</h2>
      </header>
      <form
        className="mt-[2em] w-[84%] grid grid-cols-2 gap-4  lg:w-[77%]"
        onSubmit={submitApplication}
      >
        <div className="w-full">
          <label htmlFor="firstName" className="flex-start flex font-medium">
            First Name
            <CgAsterisk className="text-red-500" />
          </label>
          <input
            id="firstName"
            name="firstName"
            required
            disabled={loading}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
          />
        </div>
        <div className="w-full">
          <label htmlFor="lastName" className="flex-start flex font-medium">
            Last Name
            <CgAsterisk className="text-red-500" />
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            disabled={loading}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
          />
        </div>

        <div className="w-full">
          <label htmlFor="otherName" className="flex-start font-medium">
            Other Name (Optional)
          </label>
          <input
            id="otherName"
            name="otherName"
            value={otherName}
            onChange={(e) => setOtherName(e.target.value)}
            className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none dark:text-white"
          />
        </div>
        <div className="w-full">
          <label htmlFor="email" className="flex-start flex font-medium">
            Email Address
            <CgAsterisk className="text-red-500" />
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            disabled={loading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
          />
        </div>

        <div className="mt-[1em] ">
          <Dropdown
            label="Visa Type"
            labelClassName="text-grey-primary"
            className="text-purple-deep "
            items={visaTypes}
            selectedItem={
              type ? visaTypes.find((item) => item.value === type) : null
            }
            onSelectItem={handleSelectVisaType}
            asterisk
            placeholder="Select a Visa Type"
          />
        </div>

        <div className="col-span-2 mt-8 flex justify-center">
          <button.PrimaryButton
            className="w-full max-w-[250px] justify-center gap-2 rounded-full bg-linear-gradient py-[11px] text-center font-medium text-white"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <ReactLoading
                color="#FFFFFF"
                width={25}
                height={25}
                type="spin"
              />
            ) : (
              "Save and Continue"
            )}
          </button.PrimaryButton>
        </div>
      </form>
    </main>
  );
};

export default StepOne;

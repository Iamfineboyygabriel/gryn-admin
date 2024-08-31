import { useState } from "react";
import { button } from "../../../../../../../../shared/buttons/Button";
import Flag from "react-world-flags";
import { CgAsterisk } from "react-icons/cg";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import {
  useCountries,
  useStates,
} from "../../../../../../../../shared/redux/hooks/shared/getUserProfile";
import CustomDatePicker from "../../../../../../../../shared/utils/CustomeDatePicker";
import { Dropdown } from "../../../../../../../../shared/dropDown/DropDown";
import { formatDateApplication } from "../../../../../../../../shared/utils/dateFormat";

interface Country {
  name: string;
  cca2: string ;
}

const StepOne = ({ onNext }: any) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState<string | null>(null);
  const [localGovtArea, setLocalGovtArea] = useState("");
  const [country, setCountry] = useState<Country | null>(null);
  const [internationalPassportNumber, setInternationalPassportNumber] =
    useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const [loading, setLoading] = useState(false);

  const { countries, loading: countriesLoading } = useCountries();
  const { states, loading: statesLoading } = useStates();
  const statesData = states;

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
    setDateOfBirth(date);
  };

  const areFieldsFilled = () => {
    return (
      firstName &&
      lastName &&
      dateOfBirth &&
      address &&
      localGovtArea &&
      state &&
      country &&
      phoneNumber &&
      internationalPassportNumber
    );
  };

  const submitApplication: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();
    if (!areFieldsFilled()) {
      toast.error("All fields must be filled");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const body = {
        firstName,
        lastName,
        middleName,
        dateOfBirth: formatDateApplication(selectedDate),
        address,
        phoneNumber,
        localGovtArea,
        state,
        country: country ? country.name : null,
        internationalPassportNumber,
      };
      console.log("body", body);
      onNext(body);
      setLoading(false);
    }, 3000);
  };

  const stateDropdownItems: any = statesData.map((state) => ({
    name: state,
  }));

  const countryDropdownItems = countries.map((country) => ({
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

  const handleStateSelect: any = (item: any) => {
    setState(item.name);
  };

  const handleCountrySelect: any = (item: any) => {
    setCountry({ name: item.name, cca2: item.cca2 });
  };



  return (
    <main className="font-outfit">
      <header>
        <h2 className="text-xl font-semibold dark:text-white">
          Personal Details
        </h2>
      </header>
      <form
        className="mt-[2em] w-[77%] dark:text-white"
        onSubmit={submitApplication}
      >
        <div className="flex flex-row gap-[3em]">
          <div className="w-full">
            <label htmlFor="firstName" className="flex-start flex font-medium">
              First Name
              <CgAsterisk className="text-red-500" />
            </label>
            <input
              id="firstName"
              name="firstName"
              onChange={(e) => setFirstName(e.target.value)}
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
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
              onChange={(e) => setLastName(e.target.value)}
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-[1em] flex flex-row gap-[3em]">
          <div className="w-full">
            <label htmlFor="middleName" className="flex-start flex font-medium">
              Middle Name
              <span className="ml-2 font-normal text-grey">(Optional)</span>
            </label>
            <input
              id="middleName"
              name="middleName"
              onChange={(e) => setMiddleName(e.target.value)}
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none dark:text-white"
            />
          </div>
          <div className="w-full">
            <label
              htmlFor="phoneNumber"
              className="flex-start flex font-medium"
            >
              Phone Number
              <CgAsterisk className="text-red-500" />
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-[1em] flex flex-row gap-[3em]">
          <div className="w-full">
            <label
              htmlFor="dateOfBirth"
              className="flex-start flex font-medium"
            >
              Date of Birth
              <CgAsterisk className="text-red-500" />
            </label>
            <CustomDatePicker
              selected={selectedDate}
              onChange={handleDateChange}
            />
          </div>
          <div className="w-full">
            <label htmlFor="address" className="flex-start flex font-medium">
              Address
              <CgAsterisk className="text-red-500" />
            </label>
            <input
              id="address"
              name="address"
              type="text"
              onChange={(e) => setAddress(e.target.value)}
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-[1em] flex flex-row gap-[3em]">
          <div className="w-full">
            <label
              htmlFor="localGovtArea"
              className="flex-start flex font-medium"
            >
              L.G.A
              <CgAsterisk className="text-red-500" />
            </label>
            <input
              id="localGovtArea"
              name="localGovtArea"
              onChange={(e) => setLocalGovtArea(e.target.value)}
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
            />
          </div>
          <Dropdown
            label="Select State"
            items={stateDropdownItems}
            selectedItem={state ? { name: state } : null}
            onSelectItem={handleStateSelect}
            asterisk
            searchVisible
            loading={statesLoading}
          />
        </div>

        <div className="mt-[1em] flex flex-row gap-[3em]">
          <div className="w-full">
            <Dropdown
              label="Select Country"
              items={countryDropdownItems}
              selectedItem={
                country
                  ? {
                      name: country.name,
                      cca2: country.cca2,
                      label: countryDropdownItems.find(
                        (item) => item.name === country.name
                      )?.label,
                    }
                  : null
              }
              onSelectItem={handleCountrySelect}
              asterisk
              searchVisible
              loading={countriesLoading}
            />
          </div>
          <div className="w-full">
            <label
              htmlFor="passportNumber"
              className="flex-start flex font-medium"
            >
              International Passport Number
              <CgAsterisk className="text-red-500" />
            </label>
            <input
              id="passportNumber"
              name="passportNumber"
              type="text"
              onChange={(e) => setInternationalPassportNumber(e.target.value)}
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
            />
          </div>
        </div>

        <div className="mr-auto mt-4">
          <button.PrimaryButton
            className="m-auto mt-[5em] w-[37%] justify-center gap-2 rounded-full bg-linear-gradient py-[11px] text-center font-medium text-white"
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

import { useEffect, useState } from "react";
import { updateStudentApplication } from "../../../../../../../../shared/redux/shared/services/shareApplication.services";
import { button } from "../../../../../../../../shared/buttons/Button";
import { CgAsterisk } from "react-icons/cg";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const PersonalDeatils = ({ onNext, studentData }: any) => {
  const [firstName, setFirstName] = useState(studentData?.firstName || "");
  const [lastName, setLastName] = useState(studentData?.lastName || "");
  const [middleName, setMiddleName] = useState(studentData?.middleName || "");
  const [intake, setIntake] = useState(studentData?.intake || "");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState(
    studentData?.dateOfBirth
      ? dayjs(studentData.dateOfBirth).format("YYYY-MM-DD")
      : ""
  );
  const [address, setAddress] = useState(studentData?.address || "");
  const [state, setState] = useState(studentData?.state || "");
  const [localGovtArea, setLocalGovtArea] = useState(
    studentData?.localGovtArea || ""
  );
  const [country, setCountry] = useState(studentData?.country || "");
  const [internationalPassportNumber, setInternationalPassportNumber] =
    useState(studentData?.internationalPassportNumber || "");
  const [phoneNumber, setPhoneNumber] = useState(
    studentData?.phoneNumber || ""
  );

  useEffect(() => {
    if (studentData?.intake) {
      const [intakeYear, intakeMonth] = studentData.intake.split("-");
      if (intakeYear && intakeMonth) {
        const monthIndex = parseInt(intakeMonth, 10) - 1;
        if (monthIndex >= 0 && monthIndex < months.length) {
          setMonth(months[monthIndex]);
          setYear(intakeYear);
        }
      }
    }
  }, [studentData]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) =>
    (currentYear + i).toString()
  );

  const handleDateSelection = () => {
    if (month && year) {
      const monthIndex = months.findIndex((m) => m === month) + 1;
      const formattedMonth = String(monthIndex).padStart(2, "0");
      const formattedDate = `${year}-${formattedMonth}`;
      setIntake(formattedDate);
      setIsDatePickerOpen(false);
    } else {
      toast.error("Please select both month and year");
    }
  };

  const toggleDatePicker = () => {
    setIsDatePickerOpen(!isDatePickerOpen);
  };

  const [loading, setLoading] = useState(false);

  const updateDetails = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const body = {
        firstName,
        lastName,
        middleName,
        dateOfBirth: dayjs(dateOfBirth).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
        address,
        state,
        localGovtArea,
        country,
        internationalPassportNumber,
        phoneNumber,
        intake,
      };
      const response = await updateStudentApplication(studentData.id, body);
      onNext();
      toast.success(response?.message);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="font-outfit">
      <header>
        <h2 className="text-xl font-semibold">Personal Details</h2>
      </header>
      <form
        className="mt-[2em] w-full md:w-[90%] lg:w-[77%]"
        onSubmit={updateDetails}
      >
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 lg:gap-[2em]">
          <div className="w-full">
            <label
              htmlFor="intake"
              className="flex-start flex font-medium dark:text-white"
            >
              Intake (Month/Year)
              <CgAsterisk className="text-red-500" />
            </label>

            <div className="relative">
              <input
                type="text"
                id="intake"
                name="intake"
                value={month && year ? `${month} ${year}` : ""}
                onClick={toggleDatePicker}
                readOnly
                required
                placeholder="Select Month/Year"
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none dark:border-none dark:bg-gray-700 dark:text-white cursor-pointer"
                aria-required="true"
                role="combobox"
                aria-expanded={isDatePickerOpen}
                aria-haspopup="listbox"
              />

              {isDatePickerOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white">
                          Month
                        </label>
                        <select
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                          value={month}
                          onChange={(e) => setMonth(e.target.value)}
                        >
                          <option value="">Select Month</option>
                          {months.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white">
                          Year
                        </label>
                        <select
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                        >
                          <option value="">Select Year</option>
                          {years.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setIsDatePickerOpen(false)}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleDateSelection}
                        className="px-4 py-2 bg-primary-700 text-white rounded-lg"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

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
            <label htmlFor="middleName" className="flex-start flex font-medium">
              Middle Name
              <span className="ml-2 font-normal text-grey">(Optional)</span>
            </label>
            <input
              id="middleName"
              name="middleName"
              disabled={loading}
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
            />
          </div>

          <div className="w-full">
            <label htmlFor="dob" className="flex-start flex font-medium">
              Date of Birth
              <CgAsterisk className="text-red-500" />
            </label>
            <input
              id="dob"
              name="dob"
              type="text"
              required
              disabled={loading}
              value={dateOfBirth}
              placeholder="YYYY-MM-DD"
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
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
              required
              disabled={loading}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
            />
          </div>

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
              required
              disabled={loading}
              value={localGovtArea}
              onChange={(e) => setLocalGovtArea(e.target.value)}
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
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
              required
              disabled={loading}
              value={internationalPassportNumber}
              onChange={(e) => setInternationalPassportNumber(e.target.value)}
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
            />
          </div>

          <div className="w-full">
            <label htmlFor="country" className="flex-start flex font-medium">
              Country
              <CgAsterisk className="text-red-500" />
            </label>
            <input
              id="country"
              name="country"
              type="text"
              required
              disabled={loading}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
            />
          </div>

          <div className="w-full">
            <label htmlFor="state" className="flex-start flex font-medium">
              State
              <CgAsterisk className="text-red-500" />
            </label>
            <input
              id="state"
              name="state"
              type="text"
              required
              disabled={loading}
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
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
              required
              disabled={loading}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
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

export default PersonalDeatils;

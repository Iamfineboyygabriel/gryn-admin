import React, { useState } from "react";
import { CgAsterisk } from "react-icons/cg";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import { button } from "../../../../../../../../shared/buttons/Button";
import activeCertificate from "../../../../../../../../assets/svg/ActiveCertificate.svg";
import { AppDispatch } from "../../../../../../../../shared/redux/store";
import { useAppDispatch } from "../../../../../../../../shared/redux/hooks/shared/reduxHooks";
import { createApplication } from "../../../../../../../../shared/redux/shared/slices/shareApplication.slices";
import { studentDegree } from "../../../../../../../../data/data";
import {
  Dropdown,
  DropdownItem,
} from "../../../../../../../../shared/dropDown/DropDown";

type CustomCountry = {
  cca2: string;
  name: string;
};

interface StepTwoProps {
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
    email: string;
    state: string;
    localGovtArea: string;
    country: CustomCountry | null;
    internationalPassportNumber: string;
    phoneNumber: string;
    selectedDate: string;
  };
}

const StepTwo: React.FC<StepTwoProps> = ({
  onNext,
  setSelectedDegree,
  applicationId,
  stepOneData,
}) => {
  const [university, setUniversity] = useState("");
  const [course, setCourse] = useState("");
  const [degreeType, setDegreeType] = useState<DropdownItem | null>(null);
  const [selectedBox, setSelectedBox] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [intake, setIntake] = useState("");

  const dispatch: AppDispatch = useAppDispatch();

  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const bachelorTypes: DropdownItem[] = [
    { name: "BACHELOR" },
    { name: "INTERNATIONAL_YEAR_ONE" },
    { name: "PRE_MASTERS" },
    { name: "UNDERGRADUATE" },
  ];

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

  const handleSelectItem = (item: DropdownItem | null) => {
    setDegreeType(item);
  };

  const submitDegree = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    let finalDegreeType: string | null = selectedBox;
    if (selectedBox === "BACHELOR" && degreeType && degreeType.name) {
      finalDegreeType = degreeType.name;
    }

    if (finalDegreeType) {
      setSelectedDegree(finalDegreeType);
      try {
        const body = {
          ...stepOneData,
          course,
          university,
          degreeType: finalDegreeType,
          intake,
        };

        const response = await dispatch(createApplication(body)).unwrap();

        if (response.status === 201) {
          const newApplicationId = response.data.application.id;
          onNext({ newApplicationId, selectedDegree: finalDegreeType });
        } else {
          toast.error(response.data.message);
        }
      } catch (error: any) {
        toast.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      toast("Kindly select a degree");
      setLoading(false);
    }
  };

  const handleDegreeSelect = (degree: string) => {
    setSelectedBox(degree);
    if (degree !== "BACHELOR") {
      setDegreeType(null);
    }
  };

  return (
    <main className="font-outfit">
      <header>
        <h2 className="text-xl font-semibold">Degree</h2>
      </header>
      <form onSubmit={submitDegree}>
        <div className="flex mt-[2em] flex-col gap-[1.5em]">
          <div className="lg:w-[40%] w-[80%] flex flex-col">
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
                value={intake ? `${month} ${year}` : ""}
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
          <div className="flex w-full lg:w-[40%] flex-col gap-[1.5em]">
            <div className="w-full">
              <label
                htmlFor="university"
                className="flex-start flex font-medium"
              >
                University
                <CgAsterisk className="text-red-500" />
              </label>
              <input
                name="university"
                id="university"
                type="text"
                required
                disabled={loading}
                onChange={(e) => setUniversity(e.target.value)}
                value={university}
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none dark:border-none dark:bg-gray-700"
                aria-required="true"
                aria-invalid={university === "" ? "true" : "false"}
              />
            </div>
          </div>
          <p>What do you want to study abroad?</p>
          <div className="flex w-full lg:w-[70%] gap-[2em]">
            {studentDegree?.map((text, index) => (
              <div
                key={index}
                className={`flex w-full cursor-pointer flex-col gap-[1em] rounded-lg px-[20px] py-[1.5em] dark:bg-gray-700 ${
                  selectedBox === text.value
                    ? "bg-primary-700 text-white"
                    : "bg-purple-white text-primary-700"
                }`}
                onClick={() => handleDegreeSelect(text.value)}
                role="button"
                aria-pressed={selectedBox === text.value}
              >
                <header>
                  <div className="flex justify-between">
                    <img
                      src={
                        selectedBox === text.value
                          ? activeCertificate
                          : text.iconA
                      }
                      alt="certificate_icon"
                    />
                    <img src={text.iconB} alt="circle_icon" />
                  </div>
                </header>
                <div
                  className={`text-xl ${
                    selectedBox === text.value
                      ? "text-white"
                      : "text-primary-700"
                  }`}
                >
                  <h1>{text.titleA}</h1>
                  <h1>{text.titleB}</h1>
                </div>
              </div>
            ))}
          </div>

          {selectedBox === "BACHELOR" && (
            <div className="w-[40%] flex flex-col gap-[1.2em]">
              <Dropdown
                label="Bachelor Degree Type"
                labelClassName="text-grey-primary"
                className="text-purple-deep"
                items={bachelorTypes}
                selectedItem={degreeType}
                onSelectItem={handleSelectItem}
                placeholder="Select Degree Type"
              />
            </div>
          )}

          <div className="lg:w-[40%] w-full flex flex-col gap-[1.2em]">
            <label htmlFor="course" className="flex-start flex font-medium">
              Course
              <CgAsterisk className="text-red-500" />
            </label>
            <input
              name="course"
              id="course"
              onChange={(e) => setCourse(e.target.value)}
              required
              value={course}
              disabled={loading}
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none dark:border-none"
              aria-required="true"
              aria-invalid={course === "" ? "true" : "false"}
            />
          </div>
        </div>

        <button.PrimaryButton
          className="m-auto mt-[5em] w-[30%] justify-center gap-2 rounded-full bg-linear-gradient py-[11px] text-center font-medium text-white"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <ReactLoading color="#FFFFFF" width={25} height={25} type="spin" />
          ) : (
            "Continue"
          )}
        </button.PrimaryButton>
      </form>
    </main>
  );
};

export default StepTwo;

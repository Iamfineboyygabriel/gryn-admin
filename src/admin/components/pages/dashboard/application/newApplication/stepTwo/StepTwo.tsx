import React, { useState } from "react";
import { CgAsterisk } from "react-icons/cg";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import { button } from "../../../../../../../shared/buttons/Button";
import activeCertificate from "../../../../../../../assets/svg/ActiveCertificate.svg";
import { AppDispatch } from "../../../../../../../shared/redux/store";
import { useAppDispatch } from "../../../../../../../shared/redux/hooks/shared/reduxHooks";
import { createApplication } from "../../../../../../../shared/redux/shared/slices/shareApplication.slices";
import { studentDegree } from "../../../../../../../data/data";
import { Dropdown, DropdownItem } from "../../../../../../../shared/dropDown/DropDown";

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

  const dispatch: AppDispatch = useAppDispatch();

  const bachelorTypes: DropdownItem[] = [
    { name: "BACHELOR" },
    { name: "INTERNATIONAL_YEAR_ONE" },
    { name: "PRE_MASTERS" },
    { name: "UNDERGRADUATE" }
  ];
  
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
        <h2 className="text-xl font-semibold dark:text-white">Degree</h2>
      </header>
      <form onSubmit={submitDegree}>
        <div className="flex flex-col gap-[1.5em]">
          <div className="mt-[2em] flex w-[40%] flex-col gap-[1.5em]">
            <div className="w-full">
              <label
                htmlFor="university"
                className="flex-start flex font-medium dark:text-white"
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
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none dark:border-none dark:bg-gray-700 dark:text-white"
                aria-required="true"
                aria-invalid={university === "" ? "true" : "false"}
              />
            </div>
          </div>
          <p className="dark:text-white">What do you want to study abroad?</p>
          <div className="flex w-[70%] gap-[2em]">
            {studentDegree?.map((text, index) => (
              <div
                key={index}
                className={`flex w-full cursor-pointer flex-col gap-[1em] rounded-lg px-[20px] py-[1.5em] dark:bg-gray-700 dark:text-white ${selectedBox === text.value ? "bg-primary-700 text-white" : "bg-purple-white text-primary-700"}`}
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
                  className={`text-xl dark:text-white ${selectedBox === text.value ? "text-white" : "text-primary-700"}`}
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
                placeholder= "Select a Degree Type"
              />
            </div>
          )}

          <div className="w-[40%] flex flex-col gap-[1.2em]">
            <label
              htmlFor="course"
              className="flex-start flex font-medium dark:text-white"
            >
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
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none dark:border-none dark:bg-gray-700 dark:text-white"
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
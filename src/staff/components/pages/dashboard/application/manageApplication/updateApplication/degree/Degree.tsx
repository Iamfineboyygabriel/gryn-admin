import { useState, useEffect } from "react";
import { CgAsterisk } from "react-icons/cg";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import { button } from "../../../../../../../../shared/buttons/Button";
import activeCertificate from "../../../../../../../../assets/svg/ActiveCertificate.svg";
import { AppDispatch } from "../../../../../../../../shared/redux/store";
import { useAppDispatch } from "../../../../../../../../shared/redux/hooks/shared/reduxHooks";
import { updateStudentDegreeApplication } from "../../../../../../../../shared/redux/shared/services/shareApplication.services";
import { Dropdown, DropdownItem } from "../../../../../../../../shared/dropDown/DropDown";
import { studentDegree } from "../../../../../../../../data/data";

const bachelorTypes: DropdownItem[] = [
  { name: "BACHELOR" },
  { name: "INTERNATIONAL_YEAR_ONE" },
  { name: "PRE_MASTERS" },
  { name: "UNDERGRADUATE" },
];

const Degree = ({
  applicationId,
  studentData,
  onNext,
}: {
  applicationId: any;
  studentData: any;
  onNext: any,
}) => {
  const [university, setUniversity] = useState(studentData?.degree?.university || "");
  const [course, setCourse] = useState(studentData?.degree?.course || "");
  const [degreeType, setDegreeType] = useState<DropdownItem | null>(null);
  const [selectedDegreeOption, setSelectedDegreeOption] = useState<string | null>(
    studentData?.degree?.degreeType || null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const selectedOption = bachelorTypes?.find(
      (option) => option?.name === studentData?.degree?.degreeType
    );
    setDegreeType(selectedOption || null);
    setSelectedDegreeOption(studentData?.degree?.degreeType || null);
  }, [studentData?.degree?.degreeType]);

  const updateDetails = async () => {
    setLoading(true);
    try {
      const body = {
        university,
        degreeType: selectedDegreeOption || "",
        course,
      };
      const response = await updateStudentDegreeApplication(studentData.id, body);
      onNext()
      toast.success(response?.message);
    } catch (error:any) {
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="font-outfit">
      <header>
        <h2 className="text-xl font-semibold dark:text-white">Degree</h2>
      </header>
      <form>
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
                onChange={(e) => setUniversity(e.target.value)}
                value={university}
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none dark:border-none dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <p>Your selected degree type (cannot be changed)</p>
          <div className="flex w-[70%] gap-[2em]">
            {studentDegree?.map((text, index) => (
              <div
                key={index}
                className={`flex w-full flex-col gap-[1em] rounded-lg px-[20px] py-[1.5em] dark:bg-gray-700 dark:text-white ${
                  selectedDegreeOption === text.value
                    ? "bg-primary-700 text-white"
                    : "bg-purple-white text-primary-700 opacity-50"
                }`}
              >
                <header>
                  <div className="flex justify-between">
                    <img
                      src={
                        selectedDegreeOption === text?.value
                          ? activeCertificate
                          : text?.iconA
                      }
                      alt="certificate_icon"
                    />
                    <img src={text?.iconB} alt="circle_icon" />
                  </div>
                </header>
                <div
                  className={`text-xl dark:text-white ${
                    selectedDegreeOption === text?.value
                      ? "text-white"
                      : "text-primary-700"
                  }`}
                >
                  <h1>{text?.titleA}</h1>
                  <h1>{text?.titleB}</h1>
                </div>
              </div>
            ))}
          </div>

          <div className="w-[40%] flex flex-col gap-[1.2em]">
            <Dropdown
              label="Degree Type (Read-only)"
              labelClassName="text-grey-primary"
              className="text-purple-deep"
              items={bachelorTypes}
              selectedItem={degreeType}
              onSelectItem={() => {}} 
              disabled={true} 
            />
          </div>

          <div className="w-[40%]">
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
              value={course}
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none dark:border-none dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <button.PrimaryButton
          onClick={updateDetails}
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

export default Degree;
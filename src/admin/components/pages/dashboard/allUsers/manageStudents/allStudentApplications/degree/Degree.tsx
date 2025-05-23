import { useEffect, useState } from "react";
import { useApplicationDetails } from "../../../../../../../../shared/redux/hooks/shared/getUserProfile";

const Degree = ({ applicationId }: any) => {
  const { applicationDetails, loading: applicationLoading } =
    useApplicationDetails(applicationId);
  const [country, setCountry] = useState("");
  const [university, setUniversity] = useState("");
  const [degreeType, setDegreeType] = useState("");
  const [course, setCourse] = useState("");
  const [applicationStatus, setApplicationStatus] = useState("");

  useEffect(() => {
    if (applicationDetails?.data) {
      setCountry(applicationDetails?.data?.degree?.country || "");
      setUniversity(applicationDetails?.data?.degree?.university || "");
      setDegreeType(applicationDetails?.data?.degree?.degreeType || "");
      setCourse(applicationDetails.data?.degree?.course || "");
      setCourse(applicationDetails.data?.degree?.course || "");
      setCourse(applicationDetails.data?.degree?.course || "");
      setApplicationStatus(applicationDetails.data?.applicationStatus || "");
    }
  }, [applicationDetails]);

  return (
    <main className="font-outfit">
      <header>
        <h2 className="text-xl font-semibold">Degree</h2>
      </header>
      {applicationLoading && (
        <small className="mt-2 block">please wait...</small>
      )}
      <div className="mt-[2em] flex flex-col gap-[1.5em]">
        <div className="flex w-[60%] flex-col gap-[1.2em]">
          <div className="w-full">
            <label htmlFor="country" className="flex-start flex font-medium">
              Country
            </label>
            <input
              id="country"
              name="country"
              value={country}
              readOnly
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
            />
          </div>
          <div className="w-full">
            <label htmlFor="university" className="flex-start flex font-medium">
              University
            </label>
            <input
              id="university"
              name="university"
              value={university}
              readOnly
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
            />
          </div>
          <div className="w-full">
            <label htmlFor="degree" className="flex-start flex font-medium">
              What do you want to study abroad
            </label>
            <input
              id="degree"
              name="degree"
              type="text"
              value={degreeType}
              readOnly
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
            />
          </div>
          <div className="w-full">
            <label htmlFor="course" className="flex-start flex font-medium">
              Course
            </label>
            <input
              id="course"
              name="course"
              type="text"
              value={course}
              readOnly
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
            />
          </div>
        </div>
        <div></div>
      </div>
    </main>
  );
};

export default Degree;

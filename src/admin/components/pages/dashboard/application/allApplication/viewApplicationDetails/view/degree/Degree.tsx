// import { useApplicationDetails } from "../../../../../../../../../shared/redux/hooks/shared/getUserProfile";

const Degree = ({ applicationId }: any) => {
  // const { applicationDetails, loading: applicationLoading } =
  //   useApplicationDetails(applicationId);

  return (
    <main className="font-outfit">
      <header>
        <h2 className="text-xl font-semibold dark:text-white">Degree</h2>
      </header>
      {/* {applicationLoading && (
        <small className="mt-2 block">please wait...</small>
      )} */}
      <div className="mt-[2em] flex flex-col gap-[1.5em]">
        <div className="flex w-[40%] flex-col gap-[1.2em]">
          <div className="w-full">
            <label
              htmlFor="country"
              className="flex-start flex font-medium dark:text-white"
            >
              Country
            </label>
            <input
              id="country"
              name="country"
              // value={country}
              readOnly
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none dark:text-white"
            />
          </div>
          <div className="w-full">
            <label
              htmlFor="university"
              className="flex-start flex font-medium dark:text-white"
            >
              University
            </label>
            <input
              id="university"
              name="university"
              // value={university}
              readOnly
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none dark:text-white"
            />
          </div>
          <div className="w-full">
            <label
              htmlFor="degree"
              className="flex-start flex font-medium text-black dark:text-white"
            >
              What do you want to study abroad
            </label>
            <input
              id="degree"
              name="degree"
              type="text"
              // value={degreeType}
              readOnly
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none dark:border-none dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="w-full">
            <label
              htmlFor="course"
              className="flex-start flex font-medium dark:text-white"
            >
              Course
            </label>
            <input
              id="course"
              name="course"
              type="text"
              // value={course}
              readOnly
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none dark:border-none dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Degree;

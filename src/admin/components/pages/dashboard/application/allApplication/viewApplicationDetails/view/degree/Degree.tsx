import React from "react";
import { useApplicationDetails } from "../../../../../../../../../shared/redux/hooks/shared/getUserProfile";

const SkeletonField = () => (
  <div className="animate-pulse">
    <div className="h-4 w-1/4 bg-gray-200 rounded mb-2"></div>
    <div className="h-10 bg-gray-200 rounded"></div>
  </div>
);

const Degree: React.FC<{ applicationId: any }> = ({ applicationId }) => {
  const { applicationDetails, loading } = useApplicationDetails(applicationId);

  const renderField = (label: string, value: string | undefined) => (
    <div className="w-full">
      <label className="flex-start flex font-medium dark:text-white">
        {label}
      </label>
      {loading ? (
        <SkeletonField />
      ) : (
        <input
          value={value || ""}
          readOnly
          className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none dark:text-white"
        />
      )}
    </div>
  );

  return (
    <main className="font-outfit">
      <header>
        <h2 className="text-xl font-semibold dark:text-white">Degree</h2>
      </header>
      <div className="mt-[2em] flex flex-col gap-[1.5em]">
        <div className="flex w-[70%] lg:w-[55%] flex-col gap-[1.2em]">
          {renderField(
            "Application Status",
            applicationDetails?.data?.applicationStatus
          )}
          {renderField("Country", applicationDetails?.data?.degree?.country)}
          {renderField(
            "University",
            applicationDetails?.data?.degree?.university
          )}
          {renderField(
            "What do you want to study abroad",
            applicationDetails?.data?.degree?.degreeType
          )}
          {renderField("Course", applicationDetails?.data?.degree?.course)}
        </div>
      </div>
    </main>
  );
};

export default Degree;

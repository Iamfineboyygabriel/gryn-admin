import React from "react";
import dayjs from "dayjs";
import { useVisaApplicationDetails } from "../../../../../../../shared/redux/hooks/shared/getUserProfile";

const SkeletonField = () => (
  <div className="animate-pulse">
    <div className="h-4 w-1/4 bg-gray-200 rounded mb-2"></div>
    <div className="h-10 bg-gray-200 rounded"></div>
  </div>
);

const PersonalDetails: React.FC<{ applicationId: any }> = ({
  applicationId,
}) => {
  const { applicationDetails, loading } = useVisaApplicationDetails(applicationId);

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
        <h2 className="text-xl font-semibold dark:text-white">
          Personal Details
        </h2>
      </header>
      <form className="mt-[2em] w-[77%] dark:text-white">
        <div className="flex flex-row gap-[3em]">
          {renderField("First Name", applicationDetails?.data?.firstName)}
          {renderField("Last Name", applicationDetails?.data?.lastName)}
        </div>
        <div className="mt-[1em] flex flex-row gap-[3em]">
          {renderField("Middle Name", applicationDetails?.data?.otherName)}
          {renderField("Email Address", applicationDetails?.data?.email)}
        </div>
      </form>
    </main>
  );
};

export default PersonalDetails;

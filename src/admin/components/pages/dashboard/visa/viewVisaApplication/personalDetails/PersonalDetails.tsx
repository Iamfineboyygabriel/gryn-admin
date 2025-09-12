import React from "react";
import { useVisaApplicationDetails } from "../../../../../../../shared/redux/hooks/shared/getUserProfile";

const SkeletonField = () => (
  <div className="animate-pulse">
    <div className="h-4 w-1/4 bg-gray-200 rounded mb-2"></div>
    <div className="h-10 bg-gray-200 rounded"></div>
  </div>
);

const visaTypes = [
  { name: "Tourist Visa", value: "TOURIST_VISA" },
  { name: "Study Visa", value: "STUDY_VISA" },
  { name: "Freelance Visa", value: "FREELANCE_VISA" },
];

const getVisaTypeName = (value?: string) => {
  return visaTypes.find((item) => item.value === value)?.name || value || "";
};

const PersonalDetails: React.FC<{ applicationId: any }> = ({
  applicationId,
}) => {
  const { applicationDetails, loading } =
    useVisaApplicationDetails(applicationId);

  const renderField = (label: string, value: string | undefined) => (
    <div className="w-full">
      <label className="flex-start flex font-medium">{label}</label>
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
        <h2 className="text-xl font-semibold">Personal Details</h2>
      </header>
      <form className="mt-[2em] grid grid-cols-2 w-[77%] gap-4">
        {renderField("First Name", applicationDetails?.data?.firstName)}
        {renderField("Last Name", applicationDetails?.data?.lastName)}
        {renderField("Middle Name", applicationDetails?.data?.otherName)}
        {renderField("Email Address", applicationDetails?.data?.email)}
        {renderField(
          "Visa Type",
          getVisaTypeName(applicationDetails?.data?.type)
        )}
      </form>
    </main>
  );
};

export default PersonalDetails;

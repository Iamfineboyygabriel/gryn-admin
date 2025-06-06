import React from "react";
import dayjs from "dayjs";
import { useApplicationDetails } from "../../../../../../../../../shared/redux/hooks/shared/getUserProfile";

const SkeletonField = () => (
  <div className="animate-pulse">
    <div className="h-4 w-1/4 bg-gray-200 rounded mb-2"></div>
    <div className="h-10 bg-gray-200 rounded"></div>
  </div>
);

const PersonalDetails: React.FC<{ applicationId: any }> = ({
  applicationId,
}) => {
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
      <header className="flex justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Personal Details</h2>
          {applicationDetails?.data?.staff && (
            <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <span>Assigned to:</span>
              <span className="font-medium">
                {applicationDetails?.data?.staff?.email}
              </span>
            </div>
          )}
        </div>
      </header>
      <form className="mt-[2em] w-[85%]">
        <div className="flex flex-col lg:flex-row gap-[1em] lg:gap-[3em]">
          {renderField("First Name", applicationDetails?.data?.firstName)}
          {renderField("Last Name", applicationDetails?.data?.lastName)}
        </div>
        <div className="mt-[1em] flex flex-col lg:flex-row gap-[1em] lg:gap-[3em]">
          {renderField("Middle Name", applicationDetails?.data?.middleName)}
          {renderField("Phone Number", applicationDetails?.data?.phoneNumber)}
        </div>
        <div className="mt-[1em] flex flex-col lg:flex-row gap-[1em] lg:gap-[3em]">
          {renderField(
            "Date of Birth",
            applicationDetails?.data?.dateOfBirth
              ? dayjs(applicationDetails.data.dateOfBirth).format("YYYY-MM-DD")
              : ""
          )}
          {renderField("Address", applicationDetails?.data?.address)}
        </div>
        <div className="mt-[1em] flex flex-col lg:flex-row gap-[1em] lg:gap-[3em]">
          {renderField("L.G.A", applicationDetails?.data?.localGovtArea)}
          {renderField("State", applicationDetails?.data?.state)}
        </div>
        <div className="mt-[1em] flex flex-col lg:flex-row gap-[1em] lg:gap-[3em]">
          {renderField("Country", applicationDetails?.data?.country)}
          {renderField(
            "International Passport Number",
            applicationDetails?.data?.internationalPassportNumber
          )}
        </div>
        <div className="mt-[1em] flex flex-col lg:flex-row gap-[1em] lg:gap-[3em]">
          {renderField("Email", applicationDetails?.data?.email)}
          {renderField("Intake", applicationDetails?.data?.intake)}{" "}
        </div>
      </form>
    </main>
  );
};

export default PersonalDetails;

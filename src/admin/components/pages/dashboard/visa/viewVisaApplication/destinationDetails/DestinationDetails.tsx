import React from "react";
import { useVisaApplicationDetails } from "../../../../../../../shared/redux/hooks/shared/getUserProfile";

const SkeletonField = () => (
  <div className="animate-pulse">
    <div className="h-4 w-1/4 bg-gray-200 rounded mb-2"></div>
    <div className="h-10 bg-gray-200 rounded"></div>
  </div>
);

const DestinationDetails: React.FC<{ applicationId: any }> = ({
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
        <h2 className="text-xl font-semibold">Destination Details</h2>
      </header>
      <form className="mt-[2em] flex flex-col gap-[1em] w-[88%]">
        <div className="flex flex-col lg:flex-row  gap-[1em] lg:gap-[3em]">
          {renderField(
            "Passport Number",
            applicationDetails?.data?.passportNumber
          )}
          {renderField(
            "Issued Date",
            applicationDetails?.data?.issuedDate
              ? new Date(applicationDetails?.data?.issuedDate)
                  ?.toISOString()
                  .split("T")[0]
              : "-"
          )}
        </div>
        <div className="flex flex-col lg:flex-row  gap-[1em] lg:gap-[3em]">
          {renderField(
            "Expiry Date",
            applicationDetails?.data?.expiryDate
              ? new Date(applicationDetails?.data?.expiryDate)
                  ?.toISOString()
                  .split("T")[0]
              : "-"
          )}
          {renderField("Destination", applicationDetails?.data?.destination)}
        </div>
        <div className="flex flex-col lg:flex-row  gap-[1em] lg:gap-[3em]">
          {renderField("School Name", applicationDetails?.data?.schoolName)}
          {renderField("Assigned Agent", applicationDetails?.data?.destination)}
        </div>
      </form>
    </main>
  );
};

export default DestinationDetails;

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { button } from "../../../../../../shared/buttons/Button";
import StaffEmailEnquiries from "../../../../../../shared/modal/StaffEmailEnquiries";

const ViewDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const enquiryData = location.state;
  const id = enquiryData.id;
  const handleBackClick = () => {
    navigate(-1);
  };

  const formatData = (value: string) => value || "Not Provided";

  return (
    <main className="mt-[1.3em] font-outfit">
      <header>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>
      </header>
      <div className="mt-[1.3em] h-auto w-full overflow-auto rounded-lg bg-white px-[1em] py-3 pb-[10em]">
        <header>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-medium">
                Enquiries /{" "}
                <span className="ml-1 font-medium">All Enquiries</span> /
                <span className="ml-1 font-medium text-primary-700">
                  View Details
                </span>
              </h1>
            </div>
            <button.PrimaryButton className="btn-2" onClick={handleBackClick}>
              Back
            </button.PrimaryButton>
          </div>
        </header>

        <section className="mt-[1em] grid w-full max-w-[80%] grid-cols-1 gap-[1.8em] text-grey md:grid-cols-2">
          <div className="w-full">
            <label
              htmlFor="firstName"
              className="flex-start flex gap-3 font-medium text-grey-primary dark:text-white"
            >
              Full Name
            </label>
            <div className="relative flex text-center">
              <input
                name="fullName"
                id="fullName"
                value={formatData(enquiryData?.fullName)}
                readOnly
                className="focus:border-border border-border mt-[1em] flex w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
              />
            </div>
          </div>

          <div className="w-full">
            <label
              htmlFor="email"
              className="flex-start flex gap-3 font-medium text-grey-primary"
            >
              Email Address
            </label>
            <div className="relative flex text-center">
              <input
                name="email"
                id="email"
                value={formatData(enquiryData?.email)}
                readOnly
                className="focus:border-border border-border mt-[1em] flex w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
              />
            </div>
          </div>

          <div className="w-full">
            <label
              htmlFor="currentLocation"
              className="flex-start flex gap-3 font-medium text-grey-primary"
            >
              Current Location
            </label>
            <div className="relative flex text-center">
              <input
                name="currentLocation"
                id="currentLocation"
                value={formatData(enquiryData?.currentLocation)}
                readOnly
                className="focus:border-border border-border mt-[1em] flex w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
              />
            </div>
          </div>

          <div className="w-full">
            <label
              htmlFor="phoneNumber"
              className="flex-start flex gap-3 font-medium text-grey-primary"
            >
              Phone Number
            </label>
            <div className="relative flex text-center">
              <input
                name="phoneNumber"
                id="phoneNumber"
                value={formatData(enquiryData?.phoneNumber)}
                readOnly
                className="focus:border-border border-border mt-[1em] flex w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
              />
            </div>
          </div>

          <div className="w-full">
            <label
              htmlFor="sponsor"
              className="flex-start flex gap-3 font-medium text-grey-primary"
            >
              Sponsor
            </label>
            <div className="relative flex text-center">
              <input
                name="sponsor"
                id="sponsor"
                value={formatData(enquiryData?.sponsor)}
                readOnly
                className="focus:border-border border-border mt-[1em] flex w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
              />
            </div>
          </div>
        </section>

        <header className="mt-[1.5em]">
          <h1 className="font-medium text-lg text-gray-400">Degree Details</h1>
        </header>
        <section className="mt-[1.3em] grid w-full max-w-[80%] grid-cols-1 gap-[1.8em] text-grey md:grid-cols-2">
          <div className="w-full">
            <label
              htmlFor="desiredLocation"
              className="flex-start flex gap-3 font-medium text-grey-primary"
            >
              Desired Location
            </label>
            <div className="relative flex text-center">
              <input
                name="desiredLocation"
                id="desiredLocation"
                value={formatData(enquiryData?.desiredLocation)}
                readOnly
                className="focus:border-border border-border mt-[1em] flex w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
              />
            </div>
          </div>

          <div className="w-full">
            <label
              htmlFor="degreeType"
              className="flex-start flex gap-3 font-medium text-grey-primary"
            >
              Degree Type
            </label>
            <div className="relative flex text-center">
              <input
                name="degreeType"
                id="degreeType"
                value={formatData(enquiryData?.degreeType)}
                readOnly
                className="focus:border-border border-border mt-[1em] flex w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
              />
            </div>
          </div>

          <div className="w-full">
            <label
              htmlFor="course"
              className="flex-start flex gap-3 font-medium text-grey-primary"
            >
              Desired Course
            </label>
            <div className="relative flex text-center">
              <input
                name="course"
                id="course"
                value={formatData(enquiryData?.course)}
                readOnly
                className="focus:border-border border-border mt-[1em] flex w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ViewDetails;

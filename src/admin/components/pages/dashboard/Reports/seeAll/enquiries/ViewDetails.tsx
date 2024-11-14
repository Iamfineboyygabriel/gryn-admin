import React, { useState } from "react";
import { button } from "./../../../../../../../shared/buttons/Button";
import { useNavigate, useLocation } from "react-router";
import Modal from "../../../../../../../shared/modal/Modal";
import StaffEmailEnquiries from "../../../../../../../shared/modal/StaffEmailEnquiries";

const ViewDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const enquiryData = location.state;
  const id = enquiryData.id;
  console.log("en", enquiryData);
  const [isAssignModal, setIsAssignModal] = useState(false);
  const handleBackClick = () => {
    navigate(-1);
  };

  const handleAssignOpenModal = () => setIsAssignModal(true);
  const handleAssignCloseModal = () => setIsAssignModal(false);

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
              First Name
            </label>
            <div className="relative flex text-center">
              <input
                name="firstName"
                id="firstName"
                value={formatData(enquiryData?.firstName)}
                readOnly
                className="focus:border-border border-border mt-[1em] flex w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
              />
            </div>
          </div>

          <div className="w-full">
            <label
              htmlFor="lastName"
              className="flex-start flex gap-3 font-medium text-grey-primary"
            >
              Last Name
            </label>
            <div className="relative flex text-center">
              <input
                name="lastName"
                id="lastName"
                value={formatData(enquiryData?.lastName)}
                readOnly
                className="focus:border-border border-border mt-[1em] flex w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
              />
            </div>
          </div>

          <div className="w-full">
            <label
              htmlFor="middleName"
              className="flex-start flex gap-3 font-medium text-grey-primary"
            >
              Middle Name
            </label>
            <div className="relative flex text-center">
              <input
                name="middleName"
                id="middleName"
                value={formatData(enquiryData?.middleName)}
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
        </section>

        <header className="mt-[1.5em]">
          <h1 className="font-medium text-lg text-gray-400">Degree Details</h1>
        </header>
        <section className="mt-[1.3em] grid w-full max-w-[80%] grid-cols-1 gap-[1.8em] text-grey md:grid-cols-2">
          <div className="w-full">
            <label
              htmlFor="country"
              className="flex-start flex gap-3 font-medium text-grey-primary"
            >
              Country
            </label>
            <div className="relative flex text-center">
              <input
                name="country"
                id="country"
                value={formatData(enquiryData?.country)}
                readOnly
                className="focus:border-border border-border mt-[1em] flex w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
              />
            </div>
          </div>

          <div className="w-full">
            <label
              htmlFor="university"
              className="flex-start flex gap-3 font-medium text-grey-primary"
            >
              University
            </label>
            <div className="relative flex text-center">
              <input
                name="university"
                id="university"
                value={formatData(enquiryData?.university)}
                readOnly
                className="focus:border-border border-border mt-[1em] flex w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
              />
            </div>
          </div>

          <div className="w-full">
            <label
              htmlFor="degree"
              className="flex-start flex gap-3 font-medium text-grey-primary"
            >
              Degree
            </label>
            <div className="relative flex text-center">
              <input
                name="degree"
                id="degree"
                value={formatData(enquiryData?.degree)}
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
              Course
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

        <div className="mt-7">
          <button.PrimaryButton
            onClick={handleAssignOpenModal}
            className="m-auto mt-[1.5em] px-[3em] justify-center gap-2 rounded-full bg-linear-gradient py-[11px] text-center font-medium text-white"
            type="submit"
          >
            Assign Staff
          </button.PrimaryButton>
        </div>
      </div>
      {isAssignModal && (
        <Modal
          isOpen={isAssignModal}
          onClose={handleAssignCloseModal}
          data-aos="zoom-in"
        >
          <StaffEmailEnquiries id={id} onClose={handleAssignCloseModal} />
        </Modal>
      )}
    </main>
  );
};

export default ViewDetails;

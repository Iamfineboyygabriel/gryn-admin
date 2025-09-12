import React, { useState } from "react";
import gryn_index_logo from "../../assets/svg/Gryn_Index _logo.svg";
import EnquiryStatusUpdateModal from "./UpdateEnquiryStatusModal";

enum EnquiryStatus {
  SUBMITTED = "SUBMITTED",
  COMPLETED = "COMPLETED",
  DECLINED = "DECLINED",
}

const EnquiryDetailModalStaff = ({ isOpen, onClose, enquiry }: any) => {
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  if (!enquiry) return null;

  const getStatusColor = (status: EnquiryStatus) => {
    switch (status) {
      case EnquiryStatus.SUBMITTED:
        return "text-blue-600 bg-blue-50 border-blue-200";
      case EnquiryStatus.COMPLETED:
        return "text-green-600 bg-green-50 border-green-200";
      case EnquiryStatus.DECLINED:
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusLabel = (status: EnquiryStatus) => {
    switch (status) {
      case EnquiryStatus.SUBMITTED:
        return "Submitted";
      case EnquiryStatus.COMPLETED:
        return "Completed";
      case EnquiryStatus.DECLINED:
        return "Declined";
      default:
        return status || "Submitted";
    }
  };

  return (
    <>
      <main
        className={`fixed font-outfit inset-y-0 right-0 w-[500px] py-[1em] bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 mr-2 text-lg hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <div className="h-full flex flex-col">
          <div className="p-4">
            <div className="flex justify-center items-center">
              <div>
                <img
                  src={gryn_index_logo}
                  alt="gryn_logo"
                  className="w-[10em]"
                />
              </div>
            </div>
          </div>

          <div className="flex-grow mb-[1.5em] overflow-y-auto px-[1.5em]">
            <div className="flex border-b py-[1em] flex-col justify-center text-center">
              <div className="bg-purple-white py-[1.5em]">
                <h2 className="font-semibold text-xl text-primary-700">
                  Gryn Index Initiative Contact Form
                </h2>
              </div>
            </div>

            <div className="mt-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Current Status:
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    enquiry?.status
                  )}`}
                >
                  {getStatusLabel(enquiry?.status)}
                </span>
              </div>
            </div>

            <div className="space-y-6 mt-5 flex flex-col gap-[3px]">
              <div>
                <label
                  htmlFor="fullName"
                  className="flex-start flex font-medium"
                >
                  Full Name
                </label>
                <input
                  name="fullName"
                  id="fullName"
                  type="text"
                  value={enquiry?.fullName || ""}
                  readOnly
                  className="mt-[11px] w-full rounded-lg border-[2px] bg-gray-50 p-3 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="email" className="flex-start flex font-medium">
                  Email
                </label>
                <input
                  name="email"
                  id="email"
                  type="email"
                  value={enquiry?.email || ""}
                  readOnly
                  className="mt-[11px] w-full rounded-lg border-[2px] bg-gray-50 p-3 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="phoneNumber"
                  className="flex-start flex font-medium"
                >
                  Phone Number
                </label>
                <input
                  name="phoneNumber"
                  id="phoneNumber"
                  type="tel"
                  value={enquiry?.phoneNumber || ""}
                  readOnly
                  className="mt-[11px] w-full rounded-lg border-[2px] bg-gray-50 p-3 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="qualification"
                  className="flex-start flex font-medium"
                >
                  What is your highest Educational Qualification
                </label>
                <input
                  name="qualification"
                  id="qualification"
                  type="text"
                  value={enquiry?.highestEducation || ""}
                  readOnly
                  className="mt-[11px] w-full rounded-lg border-[2px] bg-gray-50 p-3 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="sponsor"
                  className="flex-start flex font-medium"
                >
                  How will you be sponsoring your study ?
                </label>
                <input
                  name="sponsor"
                  id="sponsor"
                  type="text"
                  value={enquiry?.sponsor || ""}
                  readOnly
                  className="mt-[11px] w-full rounded-lg border-[2px] bg-gray-50 p-3 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="flex-start flex font-medium"
                >
                  Where is your current location
                </label>
                <input
                  name="location"
                  id="location"
                  type="text"
                  value={enquiry?.currentLocation || ""}
                  readOnly
                  className="mt-[11px] w-full rounded-lg border-[2px] bg-gray-50 p-3 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="aboutUs"
                  className="flex-start flex font-medium"
                >
                  Where did you hear about us ?
                </label>
                <input
                  name="aboutUs"
                  id="aboutUs"
                  type="text"
                  value={enquiry?.hearAboutUs || ""}
                  readOnly
                  className="mt-[11px] w-full rounded-lg border-[2px] bg-gray-50 p-3 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="internationalPassport"
                  className="flex-start flex font-medium"
                >
                  Do you have an International Passport ?
                </label>
                <input
                  name="internationalPassport"
                  id="internationalPassport"
                  type="text"
                  value={enquiry?.isInternationalPassport ? "Yes" : "No"}
                  readOnly
                  className="mt-[11px] w-full rounded-lg border-[2px] bg-gray-50 p-3 focus:outline-none"
                />
              </div>

              <button
                onClick={() => setStatusModalOpen(true)}
                className="m-auto px-[2em] items-center flex justify-center gap-2 rounded-full bg-linear-gradient py-[11px] text-center font-medium text-white"
                type="button"
              >
                Update Enquiry Status
              </button>
            </div>
          </div>
        </div>
      </main>

      <EnquiryStatusUpdateModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        enquiry={enquiry}
      />
    </>
  );
};

export default EnquiryDetailModalStaff;

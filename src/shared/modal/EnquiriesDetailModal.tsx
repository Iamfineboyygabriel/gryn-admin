import { useState } from "react";
import gryn_index_logo from "../../assets/svg/Gryn_Index _logo.svg";
import { button } from "./../../shared/buttons/Button";
import StaffEmailEnquiries from "./StaffEmailEnquiries";
import Modal from "./Modal";

const EnquiryDetailModal = ({ isOpen, onClose, enquiry }: any) => {
  const [isAssignModal, setIsAssignModal] = useState(false);

  const handleAssignOpenModal = () => setIsAssignModal(true);
  const handleAssignCloseModal = () => setIsAssignModal(false);

  if (!enquiry) return null;

  return (
    <main
      className={`fixed font-outfit inset-y-0 right-0 w-[500px] bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out`}
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
              <img src={gryn_index_logo} alt="gryn_logo" className="w-[10em]" />
            </div>
          </div>
        </div>

        <div className="flex-grow mb-[1.5em] overflow-y-auto px-[1.5em]">
          <div className="flex border-b py-[1em] flex-col justify-center text-center">
            <div className="bg-purple-white py-[1.5em]">
              <h2 className="font-semibold text-xl text-primary-700">
                Gryn index Initiative Contact Form
              </h2>
            </div>
          </div>

          <div className="space-y-6  mt-5 flex flex-col gap-[3px]">
            <div>
              <label htmlFor="fullName" className="flex-start flex font-medium">
                Full Name
              </label>
              <input
                name="fullName"
                id="fullName"
                type="fullName"
                value={enquiry?.fullName}
                className="mt-[11px] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
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
                value={enquiry?.email}
                className="mt-[11px] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
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
                type="phoneNumber"
                value={enquiry?.phoneNumber}
                className="mt-[11px] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
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
                type="qualification"
                value={enquiry?.highestEducation}
                className="mt-[11px] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="sponsor" className="flex-start flex font-medium">
                How will you be sponsoring your study ?
              </label>
              <input
                name="sponsor"
                id="sponsor"
                type="sponsor"
                value={enquiry?.sponsor}
                className="mt-[11px] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="location" className="flex-start flex font-medium">
                Where is your current location
              </label>
              <input
                name="location"
                id="location"
                type="location"
                value={enquiry?.currentLocation}
                className="mt-[11px] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="aboutUs" className="flex-start flex font-medium">
                Where did you hear about us ?
              </label>
              <input
                name="aboutUs"
                id="aboutUs"
                type="aboutUs"
                value={enquiry?.hearAboutUs}
                className="mt-[11px] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-5 flex justify-center mb-9">
            <button.PrimaryButton
              onClick={handleAssignOpenModal}
              className="m-auto mt-[1.5em] px-[3em] justify-center gap-2 rounded-full bg-linear-gradient py-[11px] text-center font-medium text-white"
              type="submit"
            >
              Assign Enquiry
            </button.PrimaryButton>
          </div>
        </div>
      </div>
      {isAssignModal && (
        <Modal
          isOpen={isAssignModal}
          onClose={handleAssignCloseModal}
          data-aos="zoom-in"
        >
          <StaffEmailEnquiries
            id={enquiry.id}
            onClose={handleAssignCloseModal}
          />
        </Modal>
      )}
    </main>
  );
};

export default EnquiryDetailModal;

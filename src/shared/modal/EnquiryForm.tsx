import React, { useState } from "react";
import { CiLink } from "react-icons/ci";
import { Check } from "lucide-react";
import gryn_index_logo from "../../assets/svg/Gryn_Index _logo.svg";
import { button } from "./../../shared/buttons/Button";

const EnquiryForm = ({ onClose }: any) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText("https://grynindexedu.com/enquiry/");
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <main className="fixed font-outfit inset-y-0 right-0 w-[500px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
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
                readOnly
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
                readOnly
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
                readOnly
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
                readOnly
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
                readOnly
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
                readOnly
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
                readOnly
                className="mt-[11px] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="intlPassport"
                className="flex-start flex font-medium"
              >
                Do you have an International Passport ?
              </label>
              <input
                name="intlPassport"
                id="intlPassport"
                type="intlPassport"
                readOnly
                className="mt-[11px] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-5 flex justify-center mb-9">
            <button.PrimaryButton
              onClick={handleCopyLink}
              className={`m-auto mt-[1.5em] flex items-center px-[3em] justify-center gap-2 rounded-full bg-linear-gradient py-[11px] text-center font-medium text-white transition-all duration-300 ${
                copied ? "bg-green-500" : ""
              }`}
              type="button"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="animate-fade-in">Copied!</span>
                </>
              ) : (
                <>
                  <CiLink
                    size={15}
                    className={`transition-transform ${
                      copied ? "scale-110" : ""
                    }`}
                  />
                  <span>Copy Link</span>
                </>
              )}
            </button.PrimaryButton>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EnquiryForm;

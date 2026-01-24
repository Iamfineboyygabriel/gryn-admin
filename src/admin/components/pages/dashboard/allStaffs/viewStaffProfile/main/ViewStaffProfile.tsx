import { useState } from "react";
import PersonalDetails from "../personalDetails/PersonalDetails";
import BankDetails from "../bankDetails/BankDetails";
import { useLocation, useNavigate } from "react-router";
import { button } from "../../../../../../../shared/buttons/Button";
import UploadedDocuments from "../uplodadedDocuments/UploadedDocuments";
import AssignedAgents from "../assignedAgents/AssignedAgents";
import StaffPayments from "../staffPayment/StaffPayments";
import Invoices from "../invoices/Invoices";
import Activity from "../activity/Activity";
import Salary from "../salary/main/Salary";

interface LocationState {
  staffEmail: string;
}

const ViewStaffProfile = () => {
  const location = useLocation();
  const { staffEmail } = location.state as LocationState;

  const [activeLink, setActiveLink] = useState("personalDetails");
  const navigate = useNavigate();

  const handleBackClick = async () => {
    navigate(-1);
  };

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">User Management</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white py-3 pb-[10em]">
        <header className="px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-medium dark:text-gray-700">
                All Staffs /
                <span className="ml-1 font-medium text-primary-700">
                  View Details
                </span>
              </h1>
            </div>
            <div>
              <button.PrimaryButton className="btn-2" onClick={handleBackClick}>
                Back
              </button.PrimaryButton>
            </div>
          </div>
        </header>
        <div>
          <nav className="relative">
            <div className="scrollbar-hide flex gap-6 overflow-x-auto border-b-[3px] border-gray-100 px-8 mt-[10px]">
              {[
                { id: "personalDetails", label: "Personal Details" },
                { id: "bankDetails", label: "Bank Details" },
                { id: "uploadedDocuments", label: "Uploaded Documents" },
                { id: "assignedAgents", label: "Assigned Agents" },
                { id: "staffPayments", label: "Staff Payments" },
                { id: "invoices", label: "Invoices" },
                { id: "salary", label: "Salary/loan" },
                { id: "activity", label: "Activity" },
              ].map(({ id, label }) => (
                <div
                  key={id}
                  className={`shrink-0 cursor-pointer whitespace-nowrap py-3 ${
                    activeLink === id
                      ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700"
                      : "text-lg font-light text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveLink(id)}
                >
                  {label}
                </div>
              ))}
            </div>
          </nav>
          <section className="mt-8 px-8">
            {activeLink === "personalDetails" && (
              <PersonalDetails staffEmail={staffEmail} />
            )}
            {activeLink === "bankDetails" && (
              <BankDetails staffEmail={staffEmail} />
            )}
            {activeLink === "uploadedDocuments" && (
              <UploadedDocuments staffEmail={staffEmail} />
            )}
            {activeLink === "assignedAgents" && (
              <AssignedAgents staffEmail={staffEmail} />
            )}
            {activeLink === "staffPayments" && (
              <StaffPayments staffEmail={staffEmail} />
            )}
            {activeLink === "invoices" && <Invoices staffEmail={staffEmail} />}
            {activeLink === "salary" && <Salary staffEmail={staffEmail} />}
            {activeLink === "activity" && <Activity staffEmail={staffEmail} />}
          </section>
        </div>
      </div>
    </main>
  );
};

export default ViewStaffProfile;

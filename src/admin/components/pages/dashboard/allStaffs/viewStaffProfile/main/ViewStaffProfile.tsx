import { useState } from "react";
import PersonalDetails from "../personalDetails/PersonalDetails"
import BankDetails from "../bankDetails/BankDetails"
import { useLocation, useNavigate, useParams } from "react-router";
import { button } from "../../../../../../../shared/buttons/Button";
import UploadedDocuments from "../uplodadedDocuments/UploadedDocuments";
import AssignedAgents from "../assignedAgents/AssignedAgents";
import StaffPayments from "../staffPayment/StaffPayments";
import Invoices from "../invoices/Invoices";
import Activity from "../activity/Activity";
import Salary from "../salary/main/Salary";
import { PrivateElement } from "../../../../../../../shared/redux/hooks/admin/PrivateElement";

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
      <h1 className="text-2xl font-bold dark:text-white">User Management</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white py-3 pb-[10em]">
        <header className="px-[2em]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-medium dark:text-gray-700">
                All Staffs /
                <span className="ml-1 font-medium text-primary-700 dark:text-white">
                  View Details
                </span>
              </h1>
            </div>
            <button.PrimaryButton className="btn-2" onClick={handleBackClick}>
              Back
            </button.PrimaryButton>
          </div>
        </header>
        <div>
          <nav>
            <div className="flex px-[1em] mt-[10px] gap-[12px] border-b-[3px] border-gray-100 text-base font-semibold">
              <div
                className={`cursor-pointer py-3 ${activeLink === "personalDetails" ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700 dark:text-white" : "text-lg font-light text-gray-500"}`}
                onClick={() => setActiveLink("personalDetails")}
              >
                Personal Details
              </div>

              <div
                className={`cursor-pointer py-3 ${activeLink === "bankDetails" ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700 dark:text-white" : "text-lg font-light text-gray-500"}`}
                onClick={() => setActiveLink("bankDetails")}
              >
                Bank Details
              </div>

              <div
                className={`cursor-pointer py-3 ${activeLink === "uploadedDocuments" ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700 dark:text-white" : "text-lg font-light text-gray-500"}`}
                onClick={() => setActiveLink("uploadedDocuments")}
              >
                Uploaded Documents
              </div>

              <div
                className={`cursor-pointer py-3 ${activeLink === "assignedAgents" ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700 dark:text-white" : "text-lg font-light text-gray-500"}`}
                onClick={() => setActiveLink("assignedAgents")}
              >
                Assigned Agents
              </div>

              <div
                className={`cursor-pointer py-3 ${activeLink === "staffPayments" ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700 dark:text-white" : "text-lg font-light text-gray-500"}`}
                onClick={() => setActiveLink("staffPayments")}
              >
               Staff Payments
              </div>
              
              <div
                className={`cursor-pointer py-3 ${activeLink === "invoices" ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700 dark:text-white" : "text-lg font-light text-gray-500"}`}
                onClick={() => setActiveLink("invoices")}
              >
               Invoices
              </div>
              
              <div
                className={`cursor-pointer py-3 ${activeLink === "salary" ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700 dark:text-white" : "text-lg font-light text-gray-500"}`}
                onClick={() => setActiveLink("salary")}
              >
               Salary/loan
              </div>

              <div
                className={`cursor-pointer py-3 ${activeLink === "activity" ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700 dark:text-white" : "text-lg font-light text-gray-500"}`}
                onClick={() => setActiveLink("activity")}
              >
               Activity
              </div>
            </div>
          </nav>
          <section className="mt-8 px-[2em]">
            {activeLink === "personalDetails" && <PersonalDetails staffEmail={staffEmail}/>}
            {activeLink === "bankDetails" && <BankDetails staffEmail={staffEmail}/>}
            {activeLink === "uploadedDocuments" && <UploadedDocuments staffEmail={staffEmail}/>}
            {activeLink === "assignedAgents" && <AssignedAgents staffEmail={staffEmail}/>}
            {activeLink === "staffPayments" && <StaffPayments staffEmail={staffEmail}/>}
            {activeLink === "invoices" && <Invoices staffEmail={staffEmail} />}
            {activeLink === "salary" && <Salary staffEmail={staffEmail} />}
            {activeLink === "activity" && <Activity staffEmail={staffEmail}/>}
          </section>
        </div>
      </div>
    </main>
  );
};

export default ViewStaffProfile;
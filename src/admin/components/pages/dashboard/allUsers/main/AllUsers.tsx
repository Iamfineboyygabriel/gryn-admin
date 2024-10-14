import { useState } from "react";
import { button } from "../../../../../../shared/buttons/Button";
import ManageStudents from "../manageStudents/main/ManageStudents";
import ManageAgents from "../manageAgents/main/ManageAgents";
import PendingAgents from "../pendingAgents/main/PendingAgents";
import Enquiries from "../enquiries/main/AllEnquiries";
import { PrivateElement } from "../../../../../../shared/redux/hooks/admin/PrivateElement";

const AllUsers = () => {
  const [activeLink, setActiveLink] = useState("manageStudents");

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">User Management</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white px-[2em] py-3 pb-[10em]">
        <div>
          <nav>
            <div className="flex gap-[2em] border-b-[2px] border-gray-100 py-4 text-base font-semibold">
            <PrivateElement feature="ALL_USERS" page="Manage Students">
            <div
                className={`${
                  activeLink === "manageStudents"
                    ? "bg-purple-white text-primary-700"
                    : "bg-gray-100 text-grey-primary"
                } cursor-pointer rounded-lg px-[1em] py-[10px] font-medium`}
                onClick={() => setActiveLink("manageStudents")}
              >
                <button.PrimaryButton className="m-auto flex justify-center gap-2 font-medium text-black">
                  Manage Student
                </button.PrimaryButton>
              </div>
             </PrivateElement>
      
             <PrivateElement feature="ALL_USERS" page="Manage Agents">
             <div
                className={`${
                  activeLink === "manageAgents"
                    ? "bg-purple-white text-primary-700"
                    : "bg-gray-100 text-grey-primary"
                } cursor-pointer rounded-lg px-[1em] py-[10px] font-medium`}
                onClick={() => setActiveLink("manageAgents")}
              >
                <button.PrimaryButton className="m-auto flex justify-center gap-2 font-medium text-black">
                  Manage Agents
                </button.PrimaryButton>
              </div>
             </PrivateElement>

             <PrivateElement feature="ALL_USERS" page="Pending Agents">
             <div
                className={`${
                  activeLink === "pendingAgents"
                    ? "bg-purple-white text-primary-700"
                    : "bg-gray-100 text-grey-primary"
                } cursor-pointer rounded-lg px-[1em] py-[10px] font-medium`}
                onClick={() => setActiveLink("pendingAgents")}
              >
                <button.PrimaryButton className="m-auto flex justify-center gap-2 font-medium text-black">
                  Pending Agents
                </button.PrimaryButton>
              </div>
             </PrivateElement>
                
                
             <PrivateElement feature="ALL_USERS" page="Enquires">
             <div
                className={`${
                  activeLink === "enquiries"
                    ? "bg-purple-white text-primary-700"
                    : "bg-gray-100 text-grey-primary"
                } cursor-pointer rounded-lg px-[1em] py-[10px] font-medium`}
                onClick={() => setActiveLink("enquiries")}
              >
                <button.PrimaryButton className="m-auto flex justify-center gap-2 font-medium text-black">
                  Enquiries
                </button.PrimaryButton>
              </div>
             </PrivateElement>
             
            
            </div>
          </nav>
          <section className="mt-3">
            {activeLink === "manageStudents" && <ManageStudents />}
            {activeLink === "manageAgents" && <ManageAgents />}
            {activeLink === "pendingAgents" && <PendingAgents />}
            {activeLink === "enquiries" && <Enquiries />}
          </section>
        </div>
      </div>
    </main>
  );
};

export default AllUsers;

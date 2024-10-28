import { useState, useMemo } from "react";
import NewRole from "../staffRole/NewRole";
import AdminRole from "../adminRole/AdminRole";
import { button } from "../../../../../../../../../shared/buttons/Button";
import { useNavigate } from "react-router";
import Privileges from "../../privileges/Privileges";
import StaffPrivileges from "../../privileges/StaffPriviledges";


const RoleDetails = () => {
  const [activeLink, setActiveLink] = useState("adminRole");

  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate(-1);
  };


  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold dark:text-white">Settings</h1>
      <div className="mt-[1em] px-[1.5em] h-auto w-full overflow-auto rounded-lg bg-white py-3 pb-[10em] dark:bg-gray-800">
      <header>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-medium dark:text-gray-700">
              Role Management /{' '}
              <span className="ml-1 font-medium text-primary-700 dark:text-white">
                New Role
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
            <div className="flex px-[2em] gap-[2em] border-b-[3px] border-gray-100 text-base font-semibold dark:border-white">
            <div
                className={`cursor-pointer py-3 ${activeLink === "adminRole" ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700 dark:text-white" : "text-lg font-light text-gray-500"}`}
                onClick={() => setActiveLink("adminRole")}
              >
                Admin Role
              </div>
              <div
                className={`cursor-pointer py-3 ${activeLink === "staffRole" ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700 dark:text-white" : "text-lg font-light text-gray-500"}`}
                onClick={() => setActiveLink("staffRole")}
              >
                Staff Role
              </div>
              <div
                className={`cursor-pointer py-3 ${activeLink === "privileges" ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700 dark:text-white" : "text-lg font-light text-gray-500"}`}
                onClick={() => setActiveLink("privileges")}
              >
             Admin Privileges
              </div>
              <div
                className={`cursor-pointer py-3 ${activeLink === "staff" ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700 dark:text-white" : "text-lg font-light text-gray-500"}`}
                onClick={() => setActiveLink("staff")}
              >
             Staff Privileges
              </div>
            </div>
          </nav>
          <section className="mt-8">
            {activeLink === "staffRole" && <NewRole />}
            {activeLink === "adminRole" && <AdminRole />}
            {activeLink === "privileges" && <Privileges />}
            {activeLink === "staff" && <StaffPrivileges />}
          </section>
        </div>
      </div>
    </main>
  );
};

export default RoleDetails;
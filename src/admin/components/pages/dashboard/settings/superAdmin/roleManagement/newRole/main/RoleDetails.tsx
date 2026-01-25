import { useState,} from "react";
import NewRole from "../staffRole/NewRole";
import AdminRole from "../adminRole/AdminRole";
import Privileges from "../../privileges/Privileges";
import StaffPrivileges from "../../privileges/StaffPriviledges";

const RoleDetails = () => {
  const [activeLink, setActiveLink] = useState("adminRole");

  return (
    <main className="font-outfit">
      <div className="px-[1.5em] h-auto w-full overflow-auto rounded-lg bg-white pb-[10em]">
        <div>
          <nav>
            <div className="scrollbar-hide flex gap-8 border-b-[3px] border-gray-100 px-8">
              <div
                className={`shrink-0 cursor-pointer whitespace-nowrap py-3  ${
                  activeLink === "adminRole"
                    ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700"
                    : "text-lg font-light text-gray-500"
                }`}
                onClick={() => setActiveLink("adminRole")}
              >
                Admin Role
              </div>
              <div
                className={`shrink-0 cursor-pointer whitespace-nowrap py-3 ${
                  activeLink === "staffRole"
                    ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700"
                    : "text-lg font-light text-gray-500"
                }`}
                onClick={() => setActiveLink("staffRole")}
              >
                Staff Role
              </div>
              <div
                className={`shrink-0 cursor-pointer whitespace-nowrap py-3  ${
                  activeLink === "privileges"
                    ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700 dark:text-white"
                    : "text-lg font-light text-gray-500"
                }`}
                onClick={() => setActiveLink("privileges")}
              >
                Admin Privileges
              </div>
              <div
                className={`shrink-0 cursor-pointer whitespace-nowrap py-3 ${
                  activeLink === "staff"
                    ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700"
                    : "text-lg font-light text-gray-500"
                }`}
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

import React, { useState, useMemo } from "react";
import BasicInfo from "./nested/BasicInfo";
import Password from "./nested/Password";
import AdminManagement from "./superAdmin/adminManagement/main/AdminManagement";
import RoleManagement from "./superAdmin/roleManagement/main/RoleManagement";
import { useCurrentUser } from "../../../../../shared/redux/hooks/shared/getUserProfile";

const Settings = () => {
  const [activeLink, setActiveLink] = useState("basicInfo");
  const { userDetails } = useCurrentUser();

  const isSuperAdmin = useMemo(() => userDetails?.data?.role === "SUPER_ADMIN", [userDetails]);

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold dark:text-white">Settings</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white px-[2em] py-3 pb-[10em] dark:bg-gray-800">
        <div>
          <nav>
            <div className="flex gap-[2em] border-b-[3px] border-gray-100 text-base font-semibold dark:border-white">
              <div
                className={`cursor-pointer py-3 ${activeLink === "basicInfo" ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700 dark:text-white" : "text-lg font-light text-gray-500"}`}
                onClick={() => setActiveLink("basicInfo")}
              >
                Basic Info
              </div>
              <div
                className={`cursor-pointer py-3 ${activeLink === "password" ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700 dark:text-white" : "text-lg font-light text-gray-500"}`}
                onClick={() => setActiveLink("password")}
              >
                Password
              </div>
              {isSuperAdmin && (
                <>
                  <div
                    className={`cursor-pointer py-3 ${activeLink === "adminManagement" ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700 dark:text-white" : "text-lg font-light text-gray-500"}`}
                    onClick={() => setActiveLink("adminManagement")}
                  >
                    Admin Management
                  </div>
                  <div
                    className={`cursor-pointer py-3 ${activeLink === "roleManagement" ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700 dark:text-white" : "text-lg font-light text-gray-500"}`}
                    onClick={() => setActiveLink("roleManagement")}
                  >
                    Role Management
                  </div>
                </>
              )}
            </div>
          </nav>
          <section className="mt-8">
            {activeLink === "basicInfo" && <BasicInfo />}
            {activeLink === "password" && <Password />}
            {isSuperAdmin && activeLink === "adminManagement" && <AdminManagement />}
            {isSuperAdmin && activeLink === "roleManagement" && <RoleManagement />}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Settings;
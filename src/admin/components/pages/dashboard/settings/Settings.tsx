import { useState, useMemo } from "react";
import BasicInfo from "./nested/BasicInfo";
import Password from "./nested/Password";
import AdminManagement from "./superAdmin/adminManagement/main/AdminManagement";
import RoleDetails from "./superAdmin/roleManagement/newRole/main/RoleDetails";
import useUserProfile, { useCurrentUser } from "../../../../../shared/redux/hooks/shared/getUserProfile";
import Activity from "./nested/Activity";
import { PrivateElement } from "../../../../../shared/redux/hooks/admin/PrivateElement";

const Settings = () => {
  const [activeLink, setActiveLink] = useState("basicInfo");
  const { userProfile } = useUserProfile();

  const isSuperAdmin = useMemo(() => userProfile?.user?.role === "SUPER_ADMIN", [userProfile]);

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white py-3 pb-[10em] ">
        <div>
          <nav>
            <div className="flex px-[2em] gap-[2em] border-b-[3px] border-gray-100 text-base font-semibold">
              <div
                className={`cursor-pointer py-3 ${activeLink === "basicInfo" ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700" : "text-lg font-light"}`}
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
             
             <div
                className={`cursor-pointer py-3 ${activeLink === "activity" ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700 dark:text-white" : "text-lg font-light text-gray-500"}`}
                onClick={() => setActiveLink("activity")}
              >
                Activity
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
            {activeLink === "activity" && <Activity />}
            {isSuperAdmin && activeLink === "adminManagement" && <AdminManagement />}
            {isSuperAdmin && activeLink === "roleManagement" && <RoleDetails />}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Settings;
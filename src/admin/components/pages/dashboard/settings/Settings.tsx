import { useState, useMemo } from "react";
import BasicInfo from "./nested/BasicInfo";
import Password from "./nested/Password";
import AdminManagement from "./superAdmin/adminManagement/main/AdminManagement";
import RoleDetails from "./superAdmin/roleManagement/newRole/main/RoleDetails";
import useUserProfile from "../../../../../shared/redux/hooks/shared/getUserProfile";
import Activity from "./nested/Activity";

const Settings = () => {
  const [activeLink, setActiveLink] = useState("basicInfo");
  const { userProfile } = useUserProfile();

  const isSuperAdmin = useMemo(
    () => userProfile?.user?.role === "SUPER_ADMIN",
    [userProfile]
  );

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="mt-4 h-auto w-full rounded-lg bg-white py-3 pb-40">
        <div>
          <nav className="relative">
            <div className="scrollbar-hide flex gap-8 overflow-x-auto border-b-[3px] border-gray-100 px-8">
              <div
                className={`shrink-0 cursor-pointer whitespace-nowrap py-3 ${
                  activeLink === "basicInfo"
                    ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700"
                    : "text-lg font-light text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveLink("basicInfo")}
              >
                Basic Info
              </div>

              <div
                className={`shrink-0 cursor-pointer whitespace-nowrap py-3 ${
                  activeLink === "password"
                    ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700"
                    : "text-lg font-light text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveLink("password")}
              >
                Password
              </div>

              <div
                className={`shrink-0 cursor-pointer whitespace-nowrap py-3 ${
                  activeLink === "activity"
                    ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700"
                    : "text-lg font-light text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveLink("activity")}
              >
                Activity
              </div>

              {isSuperAdmin && (
                <>
                  <div
                    className={`shrink-0 cursor-pointer whitespace-nowrap py-3 ${
                      activeLink === "adminManagement"
                        ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700"
                        : "text-lg font-light text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveLink("adminManagement")}
                  >
                    Admin Management
                  </div>
                  <div
                    className={`shrink-0 cursor-pointer whitespace-nowrap py-3 ${
                      activeLink === "roleManagement"
                        ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700"
                        : "text-lg font-light text-gray-500 hover:text-gray-700"
                    }`}
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
            {isSuperAdmin && activeLink === "adminManagement" && (
              <AdminManagement />
            )}
            {isSuperAdmin && activeLink === "roleManagement" && <RoleDetails />}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Settings;

import { useState } from "react";
import BasicInfo from "./nested/BasicInfo";
import Password from "./nested/Password";

const Settings = () => {
  const [activeLink, setActiveLink] = useState("basicInfo");

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white px-[2em] py-3 pb-[10em]">
        <div>
          <nav>
            <div className="flex gap-[2em] border-b-[3px] border-gray-100 text-base font-semibold">
              <div
                className={`cursor-pointer py-3 ${activeLink === "basicInfo" ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700" : "text-lg font-light text-gray-500"}`}
                onClick={() => setActiveLink("basicInfo")}
              >
                Basic Info
              </div>
              <div
                className={`cursor-pointer py-3 ${activeLink === "password" ? "border-b-[3px] border-primary-700 text-lg font-medium text-primary-700" : "text-lg font-light text-gray-500"}`}
                onClick={() => setActiveLink("password")}
              >
                Password
              </div>
            </div>
          </nav>
          <section className="mt-8">
            {activeLink === "basicInfo" && <BasicInfo />}
            {activeLink === "password" && <Password />}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Settings;

import { useState } from "react";
import ManageAgents from "./manageAgents/main/ManageAgent";
import { button } from "../../../../../shared/buttons/Button";
import ManageApplication from "./manageApplication/main/ManageApplication";
import ManageStudents from "./manageStudents/main/ManageStudents";

const Application = () => {
  const [activeLink, setActiveLink] = useState("manageApplication");

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">Application</h1>
      <div className="mt-[1em] h-auto w-full  rounded-lg bg-white px-[2em] py-3 pb-[10em]">
        <div>
          <nav>
            <div className="flex gap-[2em] border-b-[2px] border-gray-100 py-4 text-base font-semibold">
              <div
                className={`${
                  activeLink === "manageApplication"
                    ? "bg-purple-white text-primary-700"
                    : "bg-gray-100 text-grey-primary"
                } cursor-pointer rounded-lg px-[1em] py-[10px] font-medium`}
                onClick={() => setActiveLink("manageApplication")}
              >
                <button.PrimaryButton className="m-auto flex justify-center gap-2 font-medium text-black">
                  Manage Application
                </button.PrimaryButton>
              </div>
              <div
                className={`${
                  activeLink === "manageStudents"
                    ? "bg-purple-white text-primary-700"
                    : "bg-gray-100 text-grey-primary"
                } cursor-pointer rounded-lg px-[1em] py-[10px] font-medium`}
                onClick={() => setActiveLink("manageStudents")}
              >
                <button.PrimaryButton className="m-auto flex justify-center gap-2 font-medium text-black">
                  Assigned Student
                </button.PrimaryButton>
              </div>
              <div
                className={`${
                  activeLink === "manageAgents"
                    ? "bg-purple-white text-primary-700"
                    : "bg-gray-100 text-grey-primary"
                } cursor-pointer rounded-lg px-[1em] py-[10px] font-medium`}
                onClick={() => setActiveLink("manageAgents")}
              >
                <button.PrimaryButton className="m-auto flex justify-center gap-2 font-medium text-black">
                  Assigned Agents
                </button.PrimaryButton>
              </div>
            </div>
          </nav>
          <section className="mt-3">

            {activeLink === "manageApplication" && <ManageApplication />}
            {activeLink === "manageStudents" && <ManageStudents />}
            {activeLink === "manageAgents" && <ManageAgents />}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Application;

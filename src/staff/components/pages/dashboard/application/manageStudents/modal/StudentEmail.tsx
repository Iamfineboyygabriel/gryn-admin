import { button } from "../../../../../../../shared/buttons/Button";
import { CgAsterisk } from "react-icons/cg";

const StudentEmail = ({ onClose }: any) => {
  return (
    <main className="px-[4em] py-[3em] font-outfit">
      <div className="m-auto w-[26em]">
        <header className="flex flex-col gap-[1.2em]">
          <h1 className="text-center text-3xl font-bold text-grey-primary">
            Students
          </h1>
          <div className="text-center font-light text-grey">
            <p className="font-extralight text-lg">
              Enter the details of the student
            </p>
          </div>
        </header>
        <div className="mt-[2em]">
          <label
            htmlFor="email"
            className="flex-start flex font-semibold text-sm"
          >
            Email Address
            <CgAsterisk className="ml-1 text-red-500" />
          </label>
          <input
            name="email"
            id="email"
            type="email"
            className="mt-[11px] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
          />
        </div>
        <button.PrimaryButton className="m-auto mt-[2em] justify-center flex rounded-full bg-linear-gradient w-[55%] py-[8px] text-lg font-semibold text-white">
          Continue
        </button.PrimaryButton>
      </div>
    </main>
  );
};

export default StudentEmail;

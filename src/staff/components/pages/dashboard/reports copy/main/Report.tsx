import Counts from "../counts/Counts";
import MostApplied from "../../../../../../shared/mostApplied/MostApplied";
import { button } from "../../../../../../shared/buttons/Button";
import plus from "../../../../../../assets/svg/Upload.svg";
import ApexChart from "../../../../../../shared/chart/ApexChart";

const Report = () => {
  return (
    <main className="font-outfit">
      <header>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Reports</h1>
          <button.PrimaryButton className="flex gap-2 rounded-full bg-linear-gradient px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300 hover:bg-primary-700 hover:text-white">
            <img src={plus} alt="cross" />
            Download Report
          </button.PrimaryButton>
        </div>
      </header>
      <div className="mt-[1em] flex flex-col gap-[1.2em]">
        <Counts />
        <MostApplied />
        <ApexChart/>
      </div>
    </main>
  );
};

export default Report;

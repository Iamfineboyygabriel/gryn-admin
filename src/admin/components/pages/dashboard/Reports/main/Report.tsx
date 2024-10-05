import MostApplied from "../../../../../../shared/mostApplied/MostApplied";
import Counts from "../counts/Counts";
import TopPeople from "../../home/topPeople/TopPeople";
import ApexChart from "../../../../../../shared/chart/ApexChart";
import TotalNumber from "../totalNumber/TotalNumber";
import Transaction from "../transaction/Transaction";
import PieChartEnquired from "../pieChart/PieChartEnquires";
import PieChartEnquires from "../pieChart/PieChartEnquires";

const Home = () => {

  return (
    <div>
      <h1 className="text-2xl font-bold">Reports</h1>
      <div className="mt-[1em] h-auto flex flex-col gap-[1em] w-full overflow-auto rounded-lg p-3">
        <Counts />
        <TotalNumber/>
        <Transaction/>
        <TopPeople />
        <MostApplied />
        <PieChartEnquires/>
        <ApexChart/>
      </div>
    </div>
  );
};

export default Home;

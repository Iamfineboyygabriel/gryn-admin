import MostApplied from "../../../../../../shared/mostApplied/MostApplied";
import Counts from "../Counts";
import TopPeople from "../topPeople/TopPeople";
import ApexChart from "../../../../../../shared/chart/ApexChart";
import Status from "../Status/Status";

const Home = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Overview</h1>
      <div className="mt-[1em] h-auto flex flex-col gap-[1em] w-full rounded-lg p-3">
        <Counts />
        <TopPeople />
        <MostApplied />
        <ApexChart />
        <Status />
      </div>
    </div>
  );
};

export default Home;

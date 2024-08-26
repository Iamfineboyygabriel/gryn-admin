import MostApplied from "../../../../../../shared/mostApplied/MostApplied";
import Counts from "../Counts";
import TopPeople from "../topPeople/TopPeople";

const Home = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Overview</h1>
      <div className="mt-[1em] h-auto flex flex-col gap-[1em] w-full overflow-auto rounded-lg p-3">
        <Counts />
        <TopPeople />
        <MostApplied />
      </div>
    </div>
  );
};

export default Home;

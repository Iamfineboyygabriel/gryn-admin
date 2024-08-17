import Counts from "../counts/Counts";
import MostApplied from "../mostApplied/MostApplied";
import Stats from "../stats/Stats";

const Report = () => {
  return (
    <main className="font-outfit">
      <header>
        <h1 className="text-2xl font-bold">Reports</h1>
      </header>
      <div className="mt-[1.2em] flex flex-col gap-[1.2em]">
        <Stats />
        <Counts />
        <MostApplied />
      </div>
    </main>
  );
};

export default Report;

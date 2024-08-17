import Counts from "./Counts";
import RecentActivity from "./RecentActivity";
import RecentApplication from "./RecentApplication";

const Home = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Overview</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white p-3">
        <Counts />
        <RecentApplication/>
        <RecentActivity/>
      </div>
    </div>
  );
};

export default Home;

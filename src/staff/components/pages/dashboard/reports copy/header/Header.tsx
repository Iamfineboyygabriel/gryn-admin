import reportIcon from "../../../../../../assets/svg/Report.svg";

const Header = () => {
  return (
    <main className="font-outfit">
      <div className="bg-report flex w-full justify-between rounded-lg p-[1em]">
        <div className="flex flex-col gap-[1em] text-white">
          <div className="font-medium">
            <h1>Total Commission</h1>
            <p>Balance</p>
          </div>
          <div>
            <h1 className="text-2xl font-bold">N 200,000</h1>
          </div>
        </div>
        <img src={reportIcon} alt="report_icon" className="w-[8em]" />
      </div>
    </main>
  );
};

export default Header;

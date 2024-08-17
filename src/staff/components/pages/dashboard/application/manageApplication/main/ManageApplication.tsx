import { button } from "../../../../../../../shared/buttons/Button";
import plus from "../../../../../../../assets/svg/plus.svg";
import Sort from "../sort/Sort";
import AllApplication from "../allApplication/AllApplication";

const ManageApplication = () => {
  return (
    <main className="font-outfit">
      <header className="flex justify-between">
        <h1 className="font-medium text-lg">All Application</h1>
        <div className="flex gap-2">
          <button.PrimaryButton className="mt-[1em] flex gap-2 rounded-full bg-primary-200 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300 hover:bg-primary-700 hover:text-white">
            <img src={plus} alt="plus" />
            Update Application
          </button.PrimaryButton>
          <button.PrimaryButton className="mt-[1em] flex gap-2 rounded-full bg-primary-700 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300 hover:bg-primary-700 hover:text-white">
            <img src={plus} alt="plus" />
            New Application
          </button.PrimaryButton>
          <button.PrimaryButton className="mt-[1em] flex gap-2 rounded-full bg-primary-700 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300 hover:bg-primary-700 hover:text-white">
            <img src={plus} alt="plus" />
            Direct Application
          </button.PrimaryButton>
        </div>
      </header>
      <Sort />
      <AllApplication />
    </main>
  );
};

export default ManageApplication;

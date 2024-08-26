import { button } from "../../../../../../shared/buttons/Button";
import plus from "../../../../../../assets/svg/plus.svg";
import AllApplication from "../allApplication/main/AllApplication";
import { Link } from "react-router-dom";

const Application = () => {
  return (
    <main className="font-outfit">
      <header>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Application</h1>
          <div className="flex gap-[1em]">
            <button.PrimaryButton className="flex gap-2 bg-approve rounded-full px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300 hover:bg-primary-700 hover:text-white">
              <img src={plus} alt="cross" />
              Direct Application
            </button.PrimaryButton>
            <button.PrimaryButton className="flex gap-2 bg-pink-primary rounded-full px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300 hover:bg-primary-700 hover:text-white">
              <img src={plus} alt="cross" />
              Update Application
            </button.PrimaryButton>
            <Link to="/admin/dashboard/application/new_application">
              <button.PrimaryButton className="flex gap-2 bg-primary-700 rounded-full px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300 hover:bg-primary-700 hover:text-white">
                <img src={plus} alt="cross" />
                New Application
              </button.PrimaryButton>
            </Link>
          </div>
        </div>
      </header>
      <AllApplication />
    </main>
  );
};

export default Application;

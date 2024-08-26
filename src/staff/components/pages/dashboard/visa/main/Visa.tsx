import { FiSearch } from "react-icons/fi";
import { button } from "../../../../../../shared/buttons/Button";
import plus from "../../../../../../assets/svg/plus.svg";
import { Link } from "react-router-dom";

const Visa = () => {
  return (
    <main>
      <h1 className="text-2xl font-bold dark:text-white">Visa Application</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white p-3 pb-[10em] dark:bg-gray-800">
        <div className="flex justify-between">
          <div className="flex items-center gap-[1em]">
            <div className="relative w-full">
              <input
                type="text"
                className="border-border w-full rounded-full border-[1px] bg-gray-100 py-2 pl-2 pr-[3em] text-sm focus:border-grey-primary focus:outline-none dark:bg-gray-700 dark:text-white"
                placeholder="Search..."
              />
              <FiSearch className="absolute right-[1em] top-1/2 -translate-y-1/2 transform text-lg text-gray-500" />
            </div>
          </div>
          <Link to="/staff/dashboard/visa/new_application">
            <button.PrimaryButton className="mt-[1em] flex gap-2 rounded-full bg-linear-gradient px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300 hover:bg-primary-700 hover:text-white">
              <img src={plus} alt="cross" />
              New Application
            </button.PrimaryButton>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Visa;

import { useNavigate } from "react-router";
import { FiSearch } from "react-icons/fi";
import { RxTriangleDown } from "react-icons/rx";
import { useState } from "react";
import ViewApplication from "./ViewDetails";

const ApplicationDetails = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">Application</h1>
      <header className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white p-3 pb-[10em]">
        <div className="flex items-center justify-between">
          <h1 className="font-medium">
            Manage Application /
            <span className="ml-1 font-medium text-primary-700">
              Application Details
            </span>
          </h1>
          <button
            className="gap-2 rounded-lg bg-purple-pink p-[12px] font-medium text-primary-700"
            onClick={handleBackClick}
          >
            Back
          </button>
        </div>

        <div className="mt-[1em]">
          <h1 className="text-xl font-semibold text-black">Bola Tinubu</h1>
          <p className="mt-[1em] font-medium">All Applications</p>
        </div>

        <section className="mt-[1em]">
          <div className="flex justify-between">
            <div className="flex items-center gap-[1em]">
              <div className="relative w-full">
                <input
                  type="text"
                  className="w-full rounded-full bg-gray-100 py-2 pl-2 pr-[3em] text-sm"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <FiSearch className="absolute right-[1em] top-1/2 -translate-y-1/2 transform text-lg text-gray-500" />
              </div>
              <div className="flex items-center rounded-lg bg-gray-100 px-3 py-2">
                <p className="whitespace-nowrap text-sm">Sort Order</p>
                <RxTriangleDown className="ml-1" />
              </div>
              <div className="flex items-center rounded-lg bg-gray-100 px-3 py-2">
                <p className="whitespace-nowrap text-sm">Status</p>
                <RxTriangleDown className="ml-1" />
              </div>
            </div>
          </div>
        </section>

        <ViewApplication />
      </header>
    </main>
  );
};

export default ApplicationDetails;

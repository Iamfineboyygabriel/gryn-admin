import { FiSearch } from "react-icons/fi";

const Sort = () => {
  return (
    <main className="mt-[2em]">
      <div className="flex">
        <div className="flex items-center gap-[1em]">
          <div className="relative w-full">
            <input
              type="text"
              className="w-full rounded-full bg-gray-100 py-2 pl-2 pr-[3em] text-sm"
              placeholder="Search"
            />
            <FiSearch className="absolute right-[1em] top-1/2 -translate-y-1/2 transform text-lg text-gray-500" />
          </div>
          <div className="flex cursor-pointer items-center rounded-lg bg-gray-100 px-3 py-2">
            <p className="whitespace-nowrap text-sm">Sort by Name</p>
          </div>
          <div className="flex cursor-pointer items-center rounded-lg bg-gray-100 px-3 py-2">
            <p className="whitespace-nowrap text-sm">Sort by Status</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Sort;

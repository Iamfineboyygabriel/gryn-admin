import { StaffStats } from "../../../../../../data/data";

const Counts = () => {
  return (
    <main className="font-outfit">
      <div className="grid grid-cols-1 gap-5 rounded-lg font-medium text-grey-primary md:grid-cols-2 lg:grid-cols-4">
        {StaffStats.map((text, index) => (
          <div
            key={index}
            className="w-full rounded-lg bg-white px-[20px] py-[1.5em] transition-colors duration-300"
          >
            <header>
              <h1>{text.label}</h1>
              <h1>{text.p}</h1>
            </header>
            <h1 className="mt-[1.5em] text-2xl">{text.figure}</h1>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Counts;

const Data = [
  {
    label: "Total Number of",
    p: "Applications",
    figure: "35",
  },
  {
    label: "Number of Completed",
    p: "Application",
    figure: "20",
  },
  {
    label: "Number of Pending",
    p: "Applications",
    figure: "15",
  },
  {
    label: "Number of",
    p: "Agents",
    figure: "15",
  },
];

const Counts = () => {
 

  return (
    <main>
      <div className="flex justify-between gap-3 rounded-lg font-medium text-grey-primary">
        {Data.map((text, index) => (
          <div
            key={index}
            className="w-full rounded-lg bg-purple-white px-[20px] py-[1.5em] transition-colors duration-300 hover:bg-primary-700 hover:text-white dark:bg-gray-700"
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

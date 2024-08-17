const Data = [
  {
    label: "Total Number of",
    p: "Students",
    figure: "35",
  },
  {
    label: "Total Number of",
    p: "Application",
    figure: "20",
  },
  {
    label: "Number of Completed",
    p: "Applications",
    figure: "15",
  },
  {
    label: "Number of Pending",
    p: "Applications",
    figure: "200,000",
  },
];

const Counts = () => {
  return (
    <main className="font-outfit">
      <div className="flex justify-between gap-3 rounded-lg font-medium text-grey-primary">
        {Data.map((text, index) => (
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

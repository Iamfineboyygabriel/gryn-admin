const countries = [
  {
    name: "Deji Otunba",
    role: "Customer Relation",
  },
  {
    name: "Margaret Simeon",
    role: "Office Admin",
  },
  {
    name: "Jude Alaba",
    role: "Executive Admin",
  },
  {
    name: "Juniro Ese",
    role: "Customer Relations",
  },
];
const schools = [
  {
    name: "Adeola Olaniyi",
    figure: "NGN 400,000",
  },
  {
    name: "Matthew Simeon",
    figure: "NGN 300,000",
  },
  {
    name: "Peace Deborah",
    figure: "NGN 200,000",
  },
  {
    name: "Adedeji Adebayo",
    figure: "NGN 100,000",
  },
];

const TopPeople = () => {
  return (
    <main className="font-outfit">
      <div className="flex justify-between gap-[1em]">
        <div className="h-auto w-full rounded-lg bg-white px-[2.5em] py-[1.3em]">
          <header>
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold text-grey-primary">
                Top Staffs
              </h1>
              <p className="font-medium text-primary-700">See All</p>
            </div>
          </header>
          <div className="flex mt-[1em] justify-between">
            <small>Name</small>
            <small>Designation</small>
          </div>
          <div className="mt-[1em] flex flex-col gap-[1.2em]">
            {countries.map((name, index) => (
              <div className="flex items-center justify-between" key={index}>
                <div className="flex items-center gap-[1em] font-lg">
                  <p>{index + 1}</p>
                  <p>{name.name}</p>
                </div>
                <div>
                  <h1 className="font-bold">{name.role}</h1>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-auto w-full rounded-lg bg-white px-[2.5em] py-[1.3em]">
          <header>
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold text-grey-primary">
                Top Agents
              </h1>
              <p className="font-medium text-primary-700">See All</p>
            </div>
          </header>

          <div className="flex mt-[1em] justify-between">
            <small>Name</small>
            <small>Commission</small>
          </div>

          <div className="mt-[1em] flex flex-col gap-[1.2em]">
            {schools.map((name, index) => (
              <div className="flex items-center justify-between" key={index}>
                <div className="flex font-lg items-center gap-[1em]">
                  <p>{index + 1}</p>
                  <p>{name.name}</p>
                </div>
                <div>
                  <h1 className="font-bold">{name.figure}</h1>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default TopPeople;

import uk from "../../../../../../assets/svg/UK.svg";
import us from "../../../../../../assets/svg/US.svg";
import chaina from "../../../../../../assets/svg/Chaina.svg";
import japan from "../../../../../../assets/svg/Japan.svg";

const countries = [
  {
    country: "United Kingdom",
    img: uk,
    total: "200",
  },
  {
    country: "United States of America",
    img: us,
    total: "100",
  },
  {
    country: "China",
    img: chaina,
    total: "60",
  },
  {
    country: "Japan",
    img: japan,
    total: "40",
  },
];
const schools = [
  {
    school: "Harvard University",
    img: uk,
    total: "100",
  },
  {
    school: "Imperial College London",
    img: us,
    total: "50",
  },
  {
    school: "Peking University",
    img: chaina,
    total: "30",
  },
  {
    school: "University of Tokyo",
    img: japan,
    total: "25",
  },
];

const MostApplied = () => {
  return (
    <main className="font-outfit">
      <div className="flex justify-between gap-[1em]">
        <div className="h-auto w-full rounded-lg bg-white px-[2.5em] py-[1.3em]">
          <header>
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold text-grey-primary">
                Most Applied Countries
              </h1>
              <p className="font-medium text-primary-700">No. of Students</p>
            </div>
          </header>
          <div className="mt-[1em] flex flex-col gap-[1.2em]">
            {countries.map((country, index) => (
              <div className="flex items-center justify-between" key={index}>
                <div className="flex items-center gap-[0.5em]">
                  <img
                    src={country.img}
                    alt={country.country}
                    className="w-6"
                  />
                  <small>{country.country}</small>
                </div>
                <div>
                  <h1 className="font-semibold">{country.total}</h1>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-auto w-full rounded-lg bg-white px-[2.5em] py-[1.3em]">
          <header>
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold text-grey-primary">
                Most Applied Schools
              </h1>
              <p className="font-medium text-primary-700">No. of Students</p>
            </div>
          </header>
          <div className="mt-[1em] flex flex-col gap-[1.2em]">
            {schools.map((school, index) => (
              <div className="flex items-center justify-between" key={index}>
                <div className="flex items-center gap-[0.5em]">
                  <img src={school.img} alt={school.school} className="w-6" />
                  <small>{school.school}</small>
                </div>
                <div>
                  <h1 className="font-semibold">{school.total}</h1>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MostApplied;

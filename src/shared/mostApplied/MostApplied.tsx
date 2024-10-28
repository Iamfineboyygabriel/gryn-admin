import {
  useTopCountries,
  useTopUniversities,
} from "../redux/hooks/shared/getUserProfile";
import ReactCountryFlag from "react-country-flag";
import { countries } from "countries-list";
import transaction from "../../assets/svg/Transaction.svg";

const getCountryCode = (countryName: any) => {
  const countryEntry = Object.entries(countries).find(
    ([code, country]) =>
      country.name.toLowerCase() === countryName.toLowerCase()
  );
  return countryEntry ? countryEntry[0] : "UN";
};

const MostApplied = () => {
  const { userTopCountries } = useTopCountries();
  const { userTopUniversities } = useTopUniversities();

  return (
    <main className="font-outfit">
      <div className="flex justify-between gap-[1em] h-[300px]">
        <div className="w-full overflow-y-auto rounded-lg bg-white px-[2.5em] py-[1.3em] flex flex-col">
          <header>
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold text-grey-primary">
                Most Applied Countries
              </h1>
              {/* <p className="font-medium text-primary-700">See All</p> */}
            </div>
          </header>
          <div>
          </div>
          <div className="flex mt-[1em] items-center justify-between">
          <small className="font-medium">Country</small>
          <small className="font-medium">No. of Students</small>
          </div>

          {userTopCountries?.data?.length > 0 ? (
            <div className="mt-[1em] flex-grow">
              <div className="flex flex-col gap-[1.2em]">
                {userTopCountries.data.map((country: any, index: number) => (
                  <div
                    className="flex items-center justify-between"
                    key={index}
                  >
                    <div className="flex items-center gap-[0.5em]">
                      <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                        <div
                          className="rounded-full overflow-hidden"
                          style={{
                            width: "2em",
                            height: "2em",
                          }}
                        >
                          <ReactCountryFlag
                            countryCode={getCountryCode(country.name)}
                            svg
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            title={country.name}
                          />
                        </div>
                      </div>
                      <small>{country.name}</small>
                    </div>
                    <div>
                      <h1 className="font-semibold">
                        {country.applicationCount}
                      </h1>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-[2em] flex flex-col items-center justify-center">
              <img src={transaction} alt="No applications" />
              <p className="mt-2 text-sm text-gray-500 dark:text-white">
                No Data Available.
              </p>
            </div>
          )}
        </div>

        <div className="w-full overflow-y-auto rounded-lg bg-white px-[2.5em] py-[1.3em] flex flex-col">
          <header>
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold text-grey-primary">
                Most Applied Schools
              </h1>
              {/* <p className="font-medium text-primary-700">See All</p> */}
            </div>
          </header>

          <div className="flex mt-[1em] items-center justify-between">
          <small className="font-medium">Schools</small>
          <small className="font-medium">No. of Applications</small>
          </div>

          {userTopUniversities?.data?.length > 0 ? (
            <div className="mt-[1em] flex-grow">
              <div className="flex flex-col gap-[1.2em]">
                {userTopUniversities.data.map((school: any, index: number) => (
                  <div
                    className="flex items-center justify-between"
                    key={index}
                  >
                    <div className="flex items-center gap-[0.5em]">
                      <small>{school.name}</small>
                    </div>
                    <div>
                      <h1 className="font-semibold">
                        {school.applicationCount}
                      </h1>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-[2em] flex flex-col items-center justify-center">
              <img src={transaction} alt="No applications" />
              <p className="mt-2 text-sm text-gray-500 dark:text-white">
                No Data Available.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default MostApplied;

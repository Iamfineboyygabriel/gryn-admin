const PersonalDetails = () => {
  return (
    <main className="font-outfit">
      <header>
        <h2 className="text-xl font-semibold dark:text-white">
          Personal Details
        </h2>
      </header>

      <form className="mt-[2em] w-[77%] dark:text-white">
        <div className="flex flex-row gap-[3em]">
          <div className="w-full">
            <label htmlFor="firstName" className="flex-start flex font-medium">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
            />
          </div>

          <div className="w-full">
            <label htmlFor="lastName" className="flex-start flex font-medium">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-[1em] flex flex-row gap-[3em]">
          <div className="w-full">
            <label htmlFor="middleName" className="flex-start flex font-medium">
              Middle Name
              <span className="ml-2 font-normal text-grey">(Optional)</span>
            </label>
            <input
              id="middleName"
              name="middleName"
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none dark:text-white"
            />
          </div>
          <div className="w-full">
            <label htmlFor="email" className="flex-start flex font-medium">
              Phone Number
            </label>
            <input
              id="email"
              name="email"
              type="text"
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-[1em] flex flex-row gap-[3em]">
          <div className="w-full">
            <label htmlFor="firstName" className="flex-start flex font-medium">
              Date of Birth
            </label>
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="dateOfBirth"
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
            />
          </div>
          <div className="w-full">
            <label htmlFor="lastName" className="flex-start flex font-medium">
              Address
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-[1em] flex flex-row gap-[3em]">
          <div className="w-full">
            <label htmlFor="lga" className="flex-start flex font-medium">
              L.G.A
            </label>
            <input
              id="lga"
              name="lga"
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
            />
          </div>

          <div className="relative w-full">
            <label htmlFor="state" className="flex-start flex font-medium">
              State
            </label>
            <input
              id="state"
              name="state"
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-[1em] flex flex-row gap-[3em]">
          <div className="w-full">
            <label htmlFor="country" className="flex-start flex font-medium">
              Country
            </label>
            <input
              id="country"
              name="country"
              type="text"
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
            />
          </div>

          <div className="w-full">
            <label
              htmlFor="internationalPassportNumber"
              className="flex-start flex font-medium"
            >
              International Passport Number
            </label>
            <input
              id="internationalPassportNumber"
              name="internationalPassportNumber"
              type="text"
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
            />
          </div>
        </div>
      </form>
    </main>
  );
};

export default PersonalDetails;

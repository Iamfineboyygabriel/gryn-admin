const Degree = () => {
  return (
    <main className="font-outfit">
      <header>
        <h2 className="text-xl font-semibold dark:text-white">Degree</h2>
      </header>

      <div className="mt-[2em] flex flex-col gap-[1.5em]">
        <div className="flex w-[40%] flex-col gap-[1.2em]">
          <div className="w-full">
            <label htmlFor="country" className="flex-start flex font-medium">
              Country
            </label>
            <input
              id="country"
              name="country"
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none dark:text-white"
            />
          </div>
          <div className="w-full">
            <label htmlFor="university" className="flex-start flex font-medium">
              University
            </label>
            <input
              id="university"
              name="university"
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none dark:text-white"
            />
          </div>
          <div className="w-full">
            <label
              htmlFor="degree"
              className="flex-start flex font-medium dark:text-white"
            >
              What do you want to study abroad
            </label>
            <input
              id="degree"
              name="degree"
              type="text"
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none dark:border-none dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="w-full">
            <label
              htmlFor="course"
              className="flex-start flex font-medium dark:text-white"
            >
              Course
            </label>
            <input
              id="course"
              name="course"
              type="text"
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none dark:border-none dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        <div></div>
      </div>
    </main>
  );
};

export default Degree;

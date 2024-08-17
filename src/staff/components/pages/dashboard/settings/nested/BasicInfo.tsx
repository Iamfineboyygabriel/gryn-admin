import user from "../../../../../../assets/png/avatar.png";

const BasicInfo = () => {


  return (
    <main>
      <header>
        <h1 className="text-xl font-medium">Basic Infomation</h1>
      </header>
      <div className="mt-[1em] flex items-center gap-[1em]">
        <div>
          <label htmlFor="file-input">
            <div className="relative h-24 w-24 cursor-pointer overflow-hidden rounded-full bg-gray-200">
          
                <img
                  src={ user}
                  alt="profile"
                  className="h-full w-full object-cover"
                />
              <input
                type="file"
                id="file-input"
                className="hidden"
                accept="image/*"
              />
            </div>
          </label>
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-medium">Adeola Olaniyi</h1>
          <p className="text-sm font-medium text-completed">Staff</p>
        </div>
      </div>
      <form className="mt-[1.5em] w-full">
        <div className="mt-[1em] flex flex-col gap-3 lg:w-[50%]">
          <div className="w-full">
            <label
              htmlFor="firstName"
              className="flex-start flex gap-3 font-medium text-grey-primary"
            >
              First Name
            </label>
            <div className="relative flex text-center">
              <input
                name="firstName"
                id="firstName"
                className="focus:border-focus:outline-none border-border mt-[1em] flex w-full rounded-lg border-[2px] bg-inherit p-3"
              />
            </div>
          </div>

          <div className="w-full">
            <label
              htmlFor="lastName"
              className="flex-start flex gap-3 font-medium text-grey-primary"
            >
              Last Name
            </label>
            <div className="relative flex text-center">
              <input
                name="lastName"
                id="lastName"
                className="border-border focus:border-side mt-[1em] flex w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
              />
            </div>
          </div>

          <div className="w-full">
            <label
              htmlFor="emailAddress"
              className="flex-start flex gap-3 font-medium text-grey-primary"
            >
              Email Address
            </label>
            <div className="relative flex items-center text-center">
              <input
                name="emailAddress"
                id="emailAddress"
                className="border-border focus:border-side mt-[1em] flex w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </form>
    </main>
  );
};

export default BasicInfo;

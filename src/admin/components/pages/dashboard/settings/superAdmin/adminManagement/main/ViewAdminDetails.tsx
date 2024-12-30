import { button } from "../../../../../../../../shared/buttons/Button";

const ViewAdminDetails = () => {
  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">Staff Management</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white px-[2em] py-3 pb-[10em]">
        <header>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-medium">
                Admin Management /{" "}
                <span className="ml-1 font-medium text-primary-700">
                  New Admin
                </span>
              </h1>
            </div>
            <button.PrimaryButton className="btn-2">Back</button.PrimaryButton>
          </div>
        </header>
        <header>
          <h1 className="text-2xl mt-[1.5em] font-bold">Personal Details</h1>
        </header>
        <form className="mt-[1.5em] w-full max-w-4xl">
          <div className="flex flex-wrap gap-[2em]">
            <div className="w-full md:w-[48%]">
              <label
                htmlFor="firstName"
                className="flex items-center font-medium"
              >
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                required
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
              />
            </div>
            <div className="w-full md:w-[48%]">
              <label
                htmlFor="lastName"
                className="flex items-center font-medium"
              >
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-[2em] mt-[1em]">
            <div className="w-full md:w-[48%]">
              <label
                htmlFor="middleName"
                className="flex items-center font-medium"
              >
                Other Name{" "}
                <span className="text-gray-500 ml-1">(Optional)</span>
              </label>
              <input
                id="middleName"
                name="middleName"
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
              />
            </div>
            <div className="w-full md:w-[48%]">
              <label htmlFor="email" className="flex items-center font-medium">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
              />
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ViewAdminDetails;

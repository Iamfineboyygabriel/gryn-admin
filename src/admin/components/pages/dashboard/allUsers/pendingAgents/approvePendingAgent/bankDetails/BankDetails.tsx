const SkeletonField = () => (
  <div className="animate-pulse">
    <div className="h-4 w-1/4 bg-gray-200 rounded mb-2"></div>
    <div className="h-10 bg-gray-200 rounded"></div>
  </div>
);

const BankDetails = ({
  agentData, loading
}: any) => {
    const bankAccount = agentData?.bankAccounts?.[0];
    const renderField = (label: string, value: string | undefined) => (
        <div className="w-full">
          <label className="flex-start flex font-medium dark:text-white">
            {label}
          </label>
          {loading ? (
            <SkeletonField />
          ) : (
            <input
              value={value || ""}
              readOnly
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none dark:text-white"
            />
          )}
        </div>
    );

    return (
        <main className="font-outfit">
            <header>
                <h2 className="text-xl font-semibold dark:text-white">
                  Bank Details
                </h2>
            </header>
            <form className="mt-[2em] w-[40%] dark:text-white">
                <div className="grid grid-cols-1 gap-[1.5em]">
                    {renderField("Bank Name", bankAccount?.bankName)} 
                    {renderField("Account Number", bankAccount?.accountNumber)}
                    {renderField("Account Name", bankAccount?.accountName)}
                </div>
            </form>
        </main>
    );
};

export default BankDetails;

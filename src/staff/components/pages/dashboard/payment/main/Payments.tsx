import { useState } from "react";
import { button } from "../../../../../../shared/buttons/Button";
import AllPayment from "../allPayment/main/AllPayment";
import AllInvoices from "../allInvoices/main/AllInvoices";
import AllDrafts from "../drafts/main/AllDrafts";
import AllBudgets from "../allBudgets/AllBudgets";
import SalaryLoan from "../salaryLoan/SalaryLoan";

const Payments = () => {
  const [activeLink, setActiveLink] = useState("allPayments");

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">Payments</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white px-[2em] py-3 pb-[10em]">
        <div>
          <nav className="overflow-x-auto">
            <div className="flex gap-[2em] border-b-[2px] border-gray-100 py-4 text-base font-semibold">
              <div
                className={`${
                  activeLink === "allPayments"
                    ? "bg-purple-white text-primary-700"
                    : "bg-gray-100 text-grey-primary"
                } cursor-pointer rounded-lg px-[1em] whitespace-nowrap py-[10px] font-medium`}
                onClick={() => setActiveLink("allPayments")}
              >
                <button.PrimaryButton className="m-auto flex justify-center gap-2 font-medium text-black">
                  All Payments
                </button.PrimaryButton>
              </div>
              <div
                className={`${
                  activeLink === "allInvoices"
                    ? "bg-purple-white text-primary-700"
                    : "bg-gray-100 text-grey-primary"
                } cursor-pointer rounded-lg whitespace-nowrap px-[1em] py-[10px] font-medium`}
                onClick={() => setActiveLink("allInvoices")}
              >
                <button.PrimaryButton className="m-auto flex justify-center gap-2 font-medium text-black">
                  All Invoices
                </button.PrimaryButton>
              </div>

              <div
                className={`${
                  activeLink === "allDrafts"
                    ? "bg-purple-white text-primary-700"
                    : "bg-gray-100 text-grey-primary"
                } cursor-pointer rounded-lg px-[1em] whitespace-nowrap py-[10px] font-medium`}
                onClick={() => setActiveLink("allDrafts")}
              >
                <button.PrimaryButton className="m-auto flex justify-center gap-2 font-medium text-black">
                  All Drafts
                </button.PrimaryButton>
              </div>

              <div
                className={`${
                  activeLink === "allBudgets"
                    ? "bg-purple-white text-primary-700"
                    : "bg-gray-100 text-grey-primary"
                } cursor-pointer rounded-lg whitespace-nowrap px-[1em] py-[10px] font-medium`}
                onClick={() => setActiveLink("allBudgets")}
              >
                <button.PrimaryButton className="m-auto flex justify-center gap-2 font-medium text-black">
                  All Budgets
                </button.PrimaryButton>
              </div>

              <div
                className={`${
                  activeLink === "salaryLoan"
                    ? "bg-purple-white text-primary-700"
                    : "bg-gray-100 text-grey-primary"
                } cursor-pointer rounded-lg px-[1em] py-[10px] font-medium`}
                onClick={() => setActiveLink("salaryLoan")}
              >
                <button.PrimaryButton className="m-auto flex justify-center gap-2 font-medium text-black">
                  Salary/Loan
                </button.PrimaryButton>
              </div>
            </div>
          </nav>
          <section className="mt-3">
            {activeLink === "allPayments" && <AllPayment />}
            {activeLink === "allInvoices" && <AllInvoices />}
            {activeLink === "allDrafts" && <AllDrafts />}
            {activeLink === "allBudgets" && <AllBudgets />}
            {activeLink === "salaryLoan" && <SalaryLoan />}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Payments;

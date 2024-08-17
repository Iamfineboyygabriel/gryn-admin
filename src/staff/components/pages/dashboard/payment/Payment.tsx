import PaymentSort from "./Sort";
import PaymentData from "./PaymentData";

const Payments = () => {
  return (
    <main>
      <h1 className="text-2xl font-bold">Payments</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white p-3 pb-[10em]">
        <PaymentSort />
        <PaymentData />
      </div>
    </main>
  );
};

export default Payments;

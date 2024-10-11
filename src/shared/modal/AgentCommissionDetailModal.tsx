import gryn_index_logo from "../../assets/svg/Gryn_Index _logo.svg";
import Success from "../../assets/svg/ResetPassword.svg";
import dayjs from 'dayjs';


const AgentCommissionDetailModal = ({ isOpen, onClose, payment }:any) => {
  if (!payment) return null;

  return (
    <main className={`fixed font-outfit inset-y-0 right-0 w-full sm:w-96 bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
      <div className="h-full flex flex-col">
        <div className="p-4">
          <div className="flex justify-between items-center">
            <div><img src={gryn_index_logo} alt="gryn_logo" className='w-[7em]' /></div>
            <button onClick={onClose} className="text-gray-500 text-lg hover:text-gray-700">
              &times;
            </button>
          </div>
        </div>
        <div className="flex-grow overflow-y-auto px-[1.5em]">
          <div className='flex border-b py-[1em] flex-col justify-center text-center'>
             <div className='flex justify-center'>
              <img src={Success} alt="success"className='w-[5em]' />
             </div>
             <p className='font-semibold'>Payment Success!</p>
             <div className='bg-purple-white mt-[1em] py-[6px]'>
                 <h1>
                   <p className="font-semibold text-primary-700 text-2xl">NGN {payment?.amount || '-'}</p>
                 </h1>
             </div>
          </div>
          <div className="space-y-6 flex flex-col gap-[3px]">
            <div className='flex justify-between'>
              <p className="text-sm text-gray-500">Amount.</p>
              <p className="font-semibold text-sm">NGN {payment?.amount || '-'}</p>
            </div>

            <div className='flex justify-between'>
              <p className="text-sm text-gray-500">Payment Time.</p>
              <p className="font-medium">
              {payment?.createdAt 
                  ? dayjs(payment?.createdAt).format("DD-MM-YYYY, HH:mm:ss") 
                  : '-'}
              </p>
            </div>

            <div className='flex justify-between'>
              <p className="text-sm text-gray-500">Sender Name.</p>
              <p className="font-medium">
              {payment?.senderName || '-'}
              </p>
            </div>
         </div>
      </div>
    </div>
    </main>
  );
};

export default AgentCommissionDetailModal;


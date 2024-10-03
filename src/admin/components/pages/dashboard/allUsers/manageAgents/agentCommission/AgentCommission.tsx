import React, { useState } from 'react'
import { button } from "../../../../../../../shared/buttons/Button";
import plus from "../../../../../../../assets/svg/plus.svg";
import { FiSearch } from 'react-icons/fi';
import Modal from '../../../../../../../shared/modal/Modal';
import FindStudentByAll from '../../../application/modal/FindStudentByAll';


const AgentCommission = () => {
  const [isFindByModalOpen, setIsFindByModalOpen] = useState(false);
  
  const handleFindByAllOpen = async () => setIsFindByModalOpen(true);
  const handleFindByAllClose = () => setIsFindByModalOpen(false);

  return (
 <div className="relative">
        <header className="flex items-center justify-between">
        <div className="flex items-center mt-3 w-64 rounded-full border-[1px] border-border bg-gray-100 dark:bg-gray-700">
          <input
            type="text"
            className="flex-grow rounded-full bg-transparent py-2 pl-4 pr-2 text-sm focus:border-grey-primary focus:outline-none"
            placeholder="Search"
          />
          <FiSearch className="mr-3 text-lg text-gray-500" />
        </div>

          <div className="flex gap-2">
              <button.PrimaryButton onClick={handleFindByAllOpen} className="mt-[1em] flex gap-2 rounded-full bg-primary-700 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300">
                <img src={plus} alt="plus" />
                New Commission
              </button.PrimaryButton>
          </div>
        </header>
        {isFindByModalOpen && (
          <Modal
            isOpen={isFindByModalOpen}
            onClose={handleFindByAllClose}
            data-aos="zoom-in"
          >
            <FindStudentByAll redirectTo='/admin/dashboard/all_users/agent_details/new_commission'/>
          </Modal>
        )}
      </div>
  )
}

export default AgentCommission
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import transaction from "../../../../../../../assets/svg/Transaction.svg";
import { useAgentCommission } from '../../../../../../../shared/redux/hooks/shared/getUserProfile';
import { button } from "../../../../../../../shared/buttons/Button";
import plus from "../../../../../../../assets/svg/plus.svg";
import Modal from '../../../../../../../shared/modal/Modal';
import AgentCommissionDetailModal from '../../../../../../../shared/modal/AgentCommissionDetailModal';
import FindStudentByAll from '../../../../../../../admin/components/pages/dashboard/application/modal/FindStudentByAll';

const SkeletonRow: React.FC = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 6 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

interface CommissionItem {
  id: number;
  amount: number;
  applicationId: number;
  documentId: number;
  createdAt: string;
  updatedAt: string,
  application: {
    country: string;
    firstName: string;
    lastName: string;
    middleName: string;
  }
}

const AgentCommission = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const [isFindByModalOpen, setIsFindByModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<CommissionItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFindByAllOpen = async () => setIsFindByModalOpen(true);
  const handleFindByAllClose = () => setIsFindByModalOpen(false);
  const formatData = useCallback((data: any) => (data ? data : "-"), []);

  const formatAmount = (amount:any) => {
    if (!amount && amount !== 0) return "-";
    return amount?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const { agentCommissions, loading, error, fetchAgentPayments } = useAgentCommission();
   
  const handleViewDetails = (payment: CommissionItem) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (agentId) {
      fetchAgentPayments(agentId);
    }
  }, [agentId, fetchAgentPayments]);

  const renderTableBody = useCallback(() => {
    if (loading) {
      return Array.from({ length: 6 })?.map((_, index) => <SkeletonRow key={index} />);
    }

    if (agentCommissions && agentCommissions?.length > 0) {
      return agentCommissions?.map((commission: CommissionItem, index: number) => (
        <tr key={commission?.id} className="text-[14px] border-b border-gray-200 leading-[20px] text-grey-primary font-medium">
          <td className="py-[16px] px-[24px]">{index + 1}</td>
          <td className="py-[16px] px-[24px]">{commission?.application?.lastName} {commission?.application?.middleName} {commission?.application?.firstName}</td>
          <td className="py-[16px] px-[24px]">-</td>
          <td className="py-[16px] px-[24px]">-</td>
          <td className="py-[16px] px-[24px]">{commission?.application?.country}</td>
          <td className="py-[16px] px-[24px]">
            {commission?.amount ? formatAmount(commission?.amount) : '-'}
          </td>
          <td className="flex items-center whitespace-nowrap px-6 py-4">
            <button 
              onClick={() => handleViewDetails(commission)}
              className="cursor-pointer font-semibold text-primary-700"
            >
              View details
            </button>
          </td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
            <div className="mt-[2em] flex flex-col items-center justify-center">
              <img src={transaction} alt="No applications" />
              <p className="mt-2 text-sm text-gray-500 dark:text-white">No commission records found.</p>
            </div>
          </td>
        </tr>
      );
    }
  }, [loading, agentCommissions]);

  return (
    <main className="font-outfit">
      <div className="relative">
        <header className="flex items-center justify-between">
          <h1 className="font-semibold text-xl">All Payments</h1>
        </header>
        <table className="w-full mt-4 border-collapse">
          <thead className="text-gray-500 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Student Name</th>
              <th className="px-6 py-3 text-left text-sm font-normal">University</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Degree</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Country</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Action</th>
            </tr>
          </thead>
          <tbody>{renderTableBody()}</tbody>
        </table>
      </div>
      {isFindByModalOpen && (
        <Modal
          isOpen={isFindByModalOpen}
          onClose={handleFindByAllClose}
          data-aos="zoom-in"
        >
          <FindStudentByAll redirectTo='/admin/dashboard/all_users/agent_details/new_commission'/>
        </Modal>
      )}
      {isModalOpen && selectedPayment && (
        <AgentCommissionDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          payment={selectedPayment}
        />
      )}
    </main>
  );
};

export default AgentCommission;
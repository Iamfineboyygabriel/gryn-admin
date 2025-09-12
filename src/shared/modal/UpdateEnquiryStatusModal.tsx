import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "./Modal";
import { updateEnquiryStatus } from "../redux/admin/slices/application.slices";

enum EnquiryStatus {
  SUBMITTED = "SUBMITTED",
  COMPLETED = "COMPLETED",
  DECLINED = "DECLINED",
}

interface EnquiryStatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  enquiry: any;
}

const EnquiryStatusUpdateModal: React.FC<EnquiryStatusUpdateModalProps> = ({
  isOpen,
  onClose,
  enquiry,
}) => {
  const dispatch = useDispatch();
  const [selectedStatus, setSelectedStatus] = useState<EnquiryStatus>(
    enquiry?.status || EnquiryStatus.SUBMITTED
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusUpdate = async () => {
    if (!enquiry?.id) return;

    setIsLoading(true);
    try {
      await dispatch(
        updateEnquiryStatus({
          body: { status: selectedStatus },
          enquiryId: enquiry.id,
        }) as any
      );

      onClose();
    } catch (error) {
      console.error("Failed to update enquiry status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusLabel = (status: EnquiryStatus) => {
    switch (status) {
      case EnquiryStatus.SUBMITTED:
        return "Submitted";
      case EnquiryStatus.COMPLETED:
        return "Completed";
      case EnquiryStatus.DECLINED:
        return "Declined";
      default:
        return status;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-md p-6">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Update Enquiry Status
          </h2>
          <p className="text-gray-600">
            Change the status for {enquiry?.fullName}'s enquiry
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="status-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select New Status
            </label>
            <select
              id="status-select"
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value as EnquiryStatus)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.values(EnquiryStatus).map((status) => (
                <option key={status} value={status}>
                  {getStatusLabel(status)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleStatusUpdate}
            disabled={isLoading || selectedStatus === enquiry?.status}
            className="flex-1 px-4 py-2 bg-linear-gradient text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Updating...</span>
              </div>
            ) : (
              "Update Status"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EnquiryStatusUpdateModal;

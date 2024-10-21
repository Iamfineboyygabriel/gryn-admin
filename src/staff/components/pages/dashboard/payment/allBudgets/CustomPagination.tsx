import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

interface CustomPaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  hasMore: boolean;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({ currentPage, onPageChange, hasMore }) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-full bg-gray-100 text-gray-600 disabled:opacity-50"
      >
        <ChevronLeftIcon size={20} />
      </button>
      <span className="text-sm font-medium">Page {currentPage}</span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasMore}
        className="p-2 rounded-full bg-gray-100 text-gray-600 disabled:opacity-50"
      >
        <ChevronRightIcon size={20} />
      </button>
    </div>
  );
};

export default CustomPagination;
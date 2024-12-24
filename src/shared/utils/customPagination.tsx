import React from 'react';
import { Pagination, PaginationItem } from '@mui/material';
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

interface CustomPaginationProps {
  currentPage: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  hasMore: boolean;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({ currentPage, onPageChange, hasMore }) => {
  return (
    <Pagination
      page={currentPage}
      onChange={onPageChange}
      count={hasMore ? currentPage + 1 : currentPage}
      renderItem={(item) => (
        <PaginationItem
          components={{ previous: IoIosArrowBack, next: IoIosArrowForward }}
          {...item}
          disabled={item.type === 'previous' ? currentPage === 1 : !hasMore && item.type === 'next'}
        />
      )}
    />
  );
};

export default CustomPagination;
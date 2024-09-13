import React from "react";
import { Pagination } from "@mui/material";

interface CustomPaginationProps {
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  isCurrentPageEmpty: boolean;
  count?: number;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  page,
  onChange,
  isCurrentPageEmpty,
  count
}) => {
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    if (value > page && isCurrentPageEmpty) {
      return;
    }
    onChange(event, value);
  };

  return (
    <Pagination
      count={count}
      page={page}
      onChange={handleChange}
      color="primary"
      shape="rounded"
    />
  );
};

export default CustomPagination;
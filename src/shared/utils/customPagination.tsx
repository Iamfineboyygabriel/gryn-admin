import React from "react";
import { Pagination } from "@mui/material";

interface CustomPaginationProps {
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  isCurrentPageEmpty: boolean;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  page,
  onChange,
  isCurrentPageEmpty
}) => {
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    if (value > page && isCurrentPageEmpty) {
      return;
    }
    onChange(event, value);
  };

  return (
    <Pagination
      page={page}
      count={isCurrentPageEmpty ? page : page + 1}
      onChange={handleChange}
      color="primary"
      siblingCount={1}
      boundaryCount={1}
    />
  );
};

export default CustomPagination;
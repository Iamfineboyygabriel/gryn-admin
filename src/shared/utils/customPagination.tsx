import React from "react";
import { Pagination } from "@mui/material";

interface CustomPaginationProps {
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  hasMore: boolean;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  page,
  hasMore,
  onChange,
}) => {
  return (
    <Pagination
      page={page}
      count={hasMore ? page + 1 : page}
      onChange={onChange}
      color="primary"
      siblingCount={1}
      boundaryCount={1}
    />
  );
};

export default CustomPagination;

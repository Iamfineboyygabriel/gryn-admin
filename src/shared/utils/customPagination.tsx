import React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export interface CustomPaginationProps {
  totalPages: number;
  currentPage: number;
  handlePageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  totalPages,
  currentPage,
  handlePageChange,
}) => {
  return (
    <Stack spacing={2} direction="row">
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
      />
    </Stack>
  );
};

export default CustomPagination;

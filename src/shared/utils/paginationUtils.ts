import React from "react";

export interface PaginationData<T> {
  currentPage: number;
  totalPages: number;
  visibleData: T[];
  handlePageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

export const usePagination = <T>(
  data: T[],
  itemsPerPage: number,
): PaginationData<T> => {
  const [currentPage, setCurrentPage] = React.useState(1);

  const totalPages = Math.ceil(data?.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleData = data.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setCurrentPage(value);
  };

  return { currentPage, totalPages, visibleData, handlePageChange };
};

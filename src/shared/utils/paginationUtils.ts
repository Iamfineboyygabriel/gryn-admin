// import { useState, useMemo } from 'react';

// export const usePagination = (data: any[], itemsPerPage: number) => {
//   const [currentPage, setCurrentPage] = useState(1);

//   const totalPages = useMemo(() => Math.ceil(data.length / itemsPerPage), [data, itemsPerPage]);

//   const visibleData = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return data.slice(startIndex, startIndex + itemsPerPage);
//   }, [data, currentPage, itemsPerPage]);

//   const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
//     setCurrentPage(value);
//   };

//   return { currentPage, totalPages, visibleData, handlePageChange };
// };


import { useState } from "react";

export const usePagination = (totalItems: number, itemsPerPage: number) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  return { page, totalPages, handlePageChange };
};

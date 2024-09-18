import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { useCallback, useEffect, useState } from "react";
import {
  getAllApplication,
  getStats,
  setSearchTerm,
} from "../../admin/slices/application.slices";
import { setMessage } from "../../message.slices";

export const useStats = () => {
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const getApplicationStats = useSelector(
    (state: any) => state?.application?.getStats
  );

  const userToken = sessionStorage.getItem("userData");

  useEffect(() => {
    if (userToken) {
      setLoading(true);
      dispatch(getStats())
        .unwrap()
        .then(() => {})
        .catch((error: { message: any }) => {
          const errorMessage = error?.message;
          dispatch(setMessage(errorMessage));
        });
    } else {
      dispatch(setMessage("Token not found"));
    }
  }, [dispatch, userToken]);
  return { getApplicationStats, loading };
};


export const useAllApplication = () => {
  const dispatch: AppDispatch = useDispatch();
  const applications = useSelector((state: any) => state?.application?.allApplication?.applications);
  const totalPages = useSelector((state: any) => state?.application?.allApplication?.totalPages);
  const currentPage = useSelector((state: any) => state?.application?.allApplication?.currentPage);
  const loading = useSelector((state: any) => state?.application?.loading);
  const error = useSelector((state: any) => state.application.error);
  const searchTerm = useSelector((state: any) => state.application.searchTerm);

  const fetchApplications = useCallback(
    (page: number, limit: number) => {
      dispatch(getAllApplication({ page, limit, search: searchTerm || '' }));
    },
    [dispatch, searchTerm]
  );

  const updateSearchTerm = useCallback(
    (term: string) => {
      dispatch(setSearchTerm(term));
    },
    [dispatch]
  );

  return { applications, totalPages, currentPage, loading, error, searchTerm, fetchApplications, updateSearchTerm };
};
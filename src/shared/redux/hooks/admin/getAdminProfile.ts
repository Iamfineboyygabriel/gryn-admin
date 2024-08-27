import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { useCallback, useEffect, useState } from "react";
import {
  getAllApplication,
  getStats,
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
  const applications = useSelector((state: any) => state.application.allApplication.data);
  const loading = useSelector((state: any) => state.application.loading);

  const fetchApplications = useCallback(
    (page: number, limit: number) => {
      dispatch(getAllApplication({ page, limit }));
    },
    [dispatch]
  );

  return { applications, loading, fetchApplications };
};
import { useEffect, useState } from "react";
import { getStaffDashboardStats } from "../../admin/slices/application.slices";
import { setMessage } from "../../message.slices";
import { useAppDispatch, useAppSelector } from "../shared/reduxHooks";
import { AppDispatch } from "../../store";

export const useStaffStats = () => {
    const dispatch: AppDispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
  
    const getApplicationStats = useAppSelector(
      (state: any) => state?.application?.getStaffStats
    );
  
    const userToken = sessionStorage.getItem("userData");
  
    useEffect(() => {
      if (userToken) {
        setLoading(true);
        dispatch(getStaffDashboardStats())
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
  
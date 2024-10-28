import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { useCallback } from "react";
import { getAllNotification, getNotificationCount } from "../../admin/slices/notificationApplication.slices";

export const useNotification = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { notificationCount, isLoading, error } = useSelector(
      (state: any) => state.notificationApplication
    );
  
    const fetchNotificationCount = useCallback(() => {
      dispatch(getNotificationCount());
    }, [dispatch]);
  
    return {
      notificationCount,
      isLoading,
      error,
      fetchNotificationCount,
    };
  };
  
  export const useAllNotification = () => {
    const dispatch: AppDispatch = useDispatch();
    const updates = useSelector((state: any) => state?.notificationApplication?.allNotification?.notifications);
    const totalPages = useSelector((state: any) => state?.notificationApplication?.allNotification?.totalPages);
    const currentPage = useSelector((state: any) => state?.notificationApplication?.allNotification?.currentPage);
    const loading = useSelector((state: any) => state?.notificationApplication?.loading);
    const error = useSelector((state: any) => state?.notificationApplication?.error);
  
    const fetchNotification = useCallback(
      (page: number, limit: number) => {
        dispatch(getAllNotification({ page, limit }));
      },
      [dispatch]
    );
  
  
    return { updates, totalPages, currentPage, loading, error,  fetchNotification };
  };
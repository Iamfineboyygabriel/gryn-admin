import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAllApplication,
  getAllPendingApplication,
  getAllStudents,
  getStats,
  setAllApplicationSearchTerm,
  setAllStudentsSearchTerm,
  setAllPendingApplicationSearchTerm,
  getActivity,
  getAllStudentEmail,
  getAllAgentEmail,
  getAllAdminsEmail,
  getAllSchoolsListCountries,
  getAllAdminForSuperAdmin,
  setAllAdminSearchTerm,
  getAllStaffEmail,
} from "../../admin/slices/application.slices";
import { setMessage } from "../../message.slices";
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../rootReducer";
import { getAllDraftedNews, getAllNews, setAllDraftedNewsSearchTerm, setAllNewsSearchTerm } from "../../admin/slices/notificationApplication.slices";

export const selectUserActivity = createSelector(
  [(state: any) => state.application?.allActivity],
  (allActivity) => allActivity,
);

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
  const searchTerm = useSelector((state: any) => state.application.allApplicationSearchTerm);

  const fetchApplications = useCallback(
    (page: number, limit: number) => {
      dispatch(getAllApplication({ page, limit, search: searchTerm || '' }));
    },
    [dispatch, searchTerm]
  );

  const updateSearchTerm = useCallback(
    (term: string) => {
      dispatch(setAllApplicationSearchTerm(term));
    },
    [dispatch]
  );

  return { applications, totalPages, currentPage, loading, error, searchTerm, fetchApplications, updateSearchTerm };
};

export const useAllStudents = () => {
  const dispatch: AppDispatch = useDispatch();
  const useAllStudent = useSelector((state: any) => state?.application?.allStudents?.students);
  const totalPages = useSelector((state: any) => state?.application?.allStudents?.totalPages);
  const currentPage = useSelector((state: any) => state?.application?.allStudents?.currentPage);
  const loading = useSelector((state: any) => state?.application?.loading);
  const error = useSelector((state: any) => state.application.error);
  const searchTerm = useSelector((state: any) => state.application.allStudentsSearchTerm);

  const fetchApplications = useCallback(
    (page: number, limit: number) => {
      dispatch(getAllStudents({ page, limit, search: searchTerm || '' }));
    },
    [dispatch, searchTerm]
  );

  const updateSearchTerm = useCallback(
    (term: string) => {
      dispatch(setAllStudentsSearchTerm(term));
    },
    [dispatch]
  );

  return { useAllStudent, totalPages, currentPage, loading, error, searchTerm, fetchApplications, updateSearchTerm };
};

export const useAllPendingApplication = () => {
  const dispatch: AppDispatch = useDispatch();
  const applications = useSelector((state: any) => state?.application?.allPendingApplication?.applications);
  const totalPages = useSelector((state: any) => state?.application?.allPendingApplication?.totalPages);
  const currentPage = useSelector((state: any) => state?.application?.allPendingApplication?.currentPage);
  const loading = useSelector((state: any) => state?.application?.loading);
  const error = useSelector((state: any) => state.application.error);
  const searchTerm = useSelector((state: any) => state.application.allPendingApplicationSearchTerm);

  const fetchApplications = useCallback(
    (page: number, limit: number) => {
      dispatch(getAllPendingApplication({ page, limit, search: searchTerm || '' }));
    },
    [dispatch, searchTerm]
  );

  const updateSearchTerm = useCallback(
    (term: string) => {
      dispatch(setAllPendingApplicationSearchTerm(term));
    },
    [dispatch]
  );

  return { applications, totalPages, currentPage, loading, error, searchTerm, fetchApplications, updateSearchTerm };
};

export const useUserActivity = () => {
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const userActivity = useSelector(selectUserActivity);
  const userToken = sessionStorage.getItem("userData");

  const fetchActivity = useCallback(() => {
    if (userToken) {
      setLoading(true);
      dispatch(getActivity())
        .unwrap()
        .then(() => setLoading(false))
        .catch((error: any) => {
          const errorMessage = error.message;
          dispatch(setMessage(errorMessage));
          setLoading(false);
        });
    } else {
      dispatch(setMessage("Token not found"));
    }
  }, [userToken, dispatch]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  return useMemo(
    () => ({ userActivity, loading }),
    [userActivity, loading],
  );
};

export const useStudentEmails = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { studentsEmail, loading, error } = useSelector((state: RootState) => ({
    studentsEmail: state?.application?.allStudentsEmail?.studentsEmail,
    loading: state.application.loading,
    error: state.application.error,
  }));
  useEffect(() => {
    dispatch(getAllStudentEmail());
  }, [dispatch]);

  return { studentsEmail, loading, error };
};


export const useStaffEmails = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { staffEmail, loading, error } = useSelector((state: RootState) => ({
    staffEmail: state?.application?.allStaffEmail?.staffEmail,
    loading: state.application.loading,
    error: state.application.error,
  }));
  useEffect(() => {
    dispatch(getAllStaffEmail());
  }, [dispatch]);

  return { staffEmail, loading, error };
};

export const useAgentsEmails = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { agentsEmail, loading, error } = useSelector((state: RootState) => ({
    agentsEmail: state?.application?.allAgentsEmail?.agentsEmail,
    loading: state.application.loading,
    error: state.application.error,
  }));

  useEffect(() => {
    dispatch(getAllAgentEmail());
  }, [dispatch]);

  return { agentsEmail, loading, error };
};

export const useAdminsEmails = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { adminsEmail, loading, error } = useSelector((state: RootState) => ({
    adminsEmail: state?.application?.allAdminsEmail?.adminsEmail,
    loading: state.application.loading,
    error: state.application.error,
  }));

  useEffect(() => {
    dispatch(getAllAdminsEmail());
  }, [dispatch]);

  return { adminsEmail, loading, error };
};

export const useSchoolListCountries = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { listCountries, loading, error } = useSelector((state: RootState) => ({
    listCountries: state?.application?.allSchoolList?.listSchools,
    loading: state?.application?.loading,
    error: state?.application?.error,
  }));

  useEffect(() => {
    dispatch(getAllSchoolsListCountries());
  }, [dispatch]);

  return { listCountries, loading, error };
};


export const useAllAdminForSuperAdmin = () => {
  const dispatch: AppDispatch = useDispatch();
  const allAdmin:any = useSelector((state: RootState) => state?.application?.allAdmin);
  const loading = useSelector((state: RootState) => state?.application?.loading);
  const error = useSelector((state: RootState) => state?.application.error);
  const searchTerm = useSelector((state: RootState) => state?.application?.allAdminSearchTerm);

  const fetchAdmins = useCallback(
    (page?: number, limit?: number) => {
      return dispatch(getAllAdminForSuperAdmin({ page, limit, search: searchTerm }));
    },
    [dispatch, searchTerm]
  );

  const updateSearchTerm = useCallback(
    (term: string) => {
      dispatch(setAllAdminSearchTerm(term));
    },
    [dispatch]
  );

  return { 
    admins: allAdmin?.admins, 
    totalPages: allAdmin?.totalPages, 
    currentPage: allAdmin?.currentPage, 
    loading, 
    error, 
    searchTerm, 
    fetchAdmins, 
    updateSearchTerm 
  };
};

export const useAllNews = () => {
  const dispatch: AppDispatch = useDispatch();
  const allUserNews = useSelector((state: any) => state?.notificationApplication?.allNews?.news);
  const totalPages = useSelector((state: any) => state?.notificationApplication?.allNews?.totalPages);
  const currentPage = useSelector((state: any) => state?.notificationApplication?.allNews?.currentPage);
  const loading = useSelector((state: any) => state?.notificationApplication?.loading);
  const error = useSelector((state: any) => state.notificationApplication?.error);
  const searchTerm = useSelector((state: any) => state.notificationApplication?.allNewsSearchTerm);

  const fetchNews = useCallback(
    (page: number, limit: number) => {
      dispatch(getAllNews({ page, limit, search: searchTerm || '' }));
    },
    [dispatch, searchTerm]
  );

  const updateSearchTerm = useCallback(
    (term: string) => {
      dispatch(setAllNewsSearchTerm(term));
    },
    [dispatch]
  );

  return { allUserNews, totalPages, currentPage, loading, error, searchTerm, fetchNews, updateSearchTerm };
};

export const useAllDraftedNews = () => {
  const dispatch: AppDispatch = useDispatch();
  const allUserDraftedNews = useSelector((state: any) => state?.notificationApplication?.allDraftedNews?.draftedNews);
  const totalPages = useSelector((state: any) => state?.notificationApplication?.allDraftedNews?.totalPages);
  const currentPage = useSelector((state: any) => state?.notificationApplication?.allDraftedNews?.currentPage);
  const loading = useSelector((state: any) => state?.notificationApplication?.loading);
  const error = useSelector((state: any) => state?.notificationApplication?.error);
  const searchTerm = useSelector((state: any) => state?.notificationApplication?.allDraftedNewsSearchTerm);

  const fetchNews = useCallback(
    (page: number, limit: number) => {
      dispatch(getAllDraftedNews({ page, limit, search: searchTerm || '' }));
    },
    [dispatch, searchTerm]
  );

  const updateSearchTerm = useCallback(
    (term: string) => {
      dispatch(setAllDraftedNewsSearchTerm(term));
    },
    [dispatch]
  );

  return { allUserDraftedNews, totalPages, currentPage, loading, error, searchTerm, fetchNews, updateSearchTerm };
};
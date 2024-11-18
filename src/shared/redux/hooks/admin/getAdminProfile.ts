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
  getAllStaffForSuperAdmin,
  setAllStaffSearchTerm,
  getAllStaffEmail,
  setAllAdminSearchTerm,
  getAllAdminForSuperAdmin,
  getAllStaffSalaryPayment,
  setAllStaffSalarySearchTerm,
  getTopAgentCommission,
  setAllApplicationSortTerm,
  setAllApplicationStatusTerm,
  getAllDirectApplication,
  setAllDirectApplicationSearchTerm,
  setAllDirectApplicationSortTerm,
  setAllDirectApplicationStatusTerm,
  setAllDirectApplicationIsDirectTerm,
  getAdminEnquiresStats,
  getAllEnquiry,
  setAllEnquirySearchTerm,
} from "../../admin/slices/application.slices";
import { setMessage } from "../../message.slices";
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../rootReducer";
import {
  getAllDraftedNews,
  getAllNews,
  setAllDraftedNewsSearchTerm,
  setAllNewsSearchTerm,
} from "../../admin/slices/notificationApplication.slices";
import { getAllBanks } from "../../admin/slices/application.slices";
import { useQuery, useQueryClient } from "react-query";
import {
  findStaffAssignedAgent,
  findStaffDetailByEmail,
  findStaffInvoices,
} from "../../shared/services/shareApplication.services";
import { getAllStaffPayment } from "../../shared/slices/shareApplication.slices";

export interface StaffDetails {
  status: number;
  data: {
    profile: {
      firstName: string;
      lastName: string;
      publicURL: string;
      middleName: string;
      email: string;
      userId: string;
      gender: string;
      avatar: {
        publicURL: string;
      };
    };
    role: string;
    phoneNumber: string;
    dateOfBirth: string;
    address: string;
    designation: string;
    localGovtArea: string;
    state: string;
    country: string;
    internationalPassportNumber: string;
    status: string;
    userId: string;
    bankAccounts: {
      accountName: string;
      accountNumber: string;
      bankName: string;
    };
    staffRegistrationDoc: {
      id: string;
      name: string;
      publicURL: string;
      documentType: string;
      uploadType: string;
      applicationId: number;
      paymentId: null;
      agentId: null;
      remark: string;
      status: "PENDING" | "APPROVED" | "REJECTED";
    }[];
  };
}

export interface AdminDetails {
  status: number;
  data: {
    profile: {
      firstName: string;
      lastName: string;
      publicURL: string;
      middleName: string;
      email: string;
      userId: string;
      gender: string;
      avatar: {
        publicURL: string;
      };
    };
    role: string;
    phoneNumber: string;
    dateOfBirth: string;
    address: string;
    designation: string;
    localGovtArea: string;
    state: string;
    country: string;
    internationalPassportNumber: string;
    status: string;
    userId: string;
    bankAccounts: {
      accountName: string;
      accountNumber: string;
      bankName: string;
    };
    staffRegistrationDoc: {
      id: string;
      name: string;
      publicURL: string;
      documentType: string;
      uploadType: string;
      applicationId: number;
      paymentId: null;
      agentId: null;
      remark: string;
      status: "PENDING" | "APPROVED" | "REJECTED";
    }[];
  };
}

export interface StaffAssignedAgent {
  status: number;
  data: {
    firstName: string;
    lastName: string;
    publicURL: string;
    middleName: string;
    email: string;
    id: string;
    phoneNumber: string;
    dateOfBirth: string;
    address: string;
    localGovtArea: string;
    state: string;
    country: string;
    internationalPassportNumber: string;
    status: string;
    userId: string;
  };
}

export interface StaffInvoices {
  data: {
    invoices: {
      id: number;
      invoiceDate: string;
      invoiceNumber: string;
      dueDate: string;
      status: string;
      item: {
        amount: any;
      };
    };
  };
}

export const selectUserActivity = createSelector(
  [(state: any) => state.application?.allActivity],
  (allActivity) => allActivity
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
  const applications = useSelector(
    (state: any) => state?.application?.allApplication?.applications
  );
  const totalPages = useSelector(
    (state: any) => state?.application?.allApplication?.totalPages
  );
  const currentPage = useSelector(
    (state: any) => state?.application?.allApplication?.currentPage
  );
  const loading = useSelector((state: any) => state?.application?.loading);
  const error = useSelector((state: any) => state?.application?.error);
  const searchTerm = useSelector(
    (state: any) => state?.application?.allApplicationSearchTerm
  );
  const sortTerm = useSelector(
    (state: any) => state?.application?.allApplicationSortTerm
  );
  const statusTerm = useSelector(
    (state: any) => state?.application?.allApplicationStatusTerm
  );

  const fetchApplications = useCallback(
    (page: number, limit: number) => {
      dispatch(
        getAllApplication({
          page,
          limit,
          search: searchTerm || "",
          sort: sortTerm || "",
          status: statusTerm || "",
        })
      );
    },
    [dispatch, searchTerm, sortTerm, statusTerm]
  );

  const updateSearchTerm = useCallback(
    (term: string) => {
      dispatch(setAllApplicationSearchTerm(term));
    },
    [dispatch]
  );

  const updateSortTerm = useCallback(
    (term: string) => {
      dispatch(setAllApplicationSortTerm(term));
    },
    [dispatch]
  );
  const updateStatusTerm = useCallback(
    (term: string) => {
      dispatch(setAllApplicationStatusTerm(term));
    },
    [dispatch]
  );

  return {
    applications,
    totalPages,
    currentPage,
    loading,
    error,
    searchTerm,
    sortTerm,
    statusTerm,
    updateStatusTerm,
    fetchApplications,
    updateSearchTerm,
    updateSortTerm,
  };
};

export const useAllDirectApplication = () => {
  const dispatch: AppDispatch = useDispatch();
  const applications = useSelector(
    (state: any) => state?.application?.allDirect?.applications
  );
  const totalPages = useSelector(
    (state: any) => state?.application?.allDirect?.totalPages
  );
  const currentPage = useSelector(
    (state: any) => state?.application?.allDirect?.currentPage
  );
  const loading = useSelector((state: any) => state?.application?.loading);
  const error = useSelector((state: any) => state?.application?.error);
  const searchTerm = useSelector(
    (state: any) => state?.application?.allDirectApplicationSearchTerm
  );
  const sortTerm = useSelector(
    (state: any) => state?.application?.allDirectApplicationSortTerm
  );
  const statusTerm = useSelector(
    (state: any) => state?.application?.allDirectApplicationStatusTerm
  );
  const isDirectTerm = useSelector(
    (state: any) => state?.application?.allDirectApplicationIsDirectTerm
  );

  const fetchApplications = useCallback(
    (page: number, limit: number) => {
      dispatch(
        getAllDirectApplication({
          page,
          limit,
          search: searchTerm || "",
          sort: sortTerm || "",
          status: statusTerm || "",
          isDirect: isDirectTerm || false,
        })
      );
    },
    [dispatch, searchTerm, sortTerm, statusTerm, isDirectTerm]
  );

  const updateSearchTerm = useCallback(
    (term: string) => {
      dispatch(setAllDirectApplicationSearchTerm(term));
    },
    [dispatch]
  );

  const updateSortTerm = useCallback(
    (term: string) => {
      dispatch(setAllDirectApplicationSortTerm(term));
    },
    [dispatch]
  );

  const updateStatusTerm = useCallback(
    (term: string) => {
      dispatch(setAllDirectApplicationStatusTerm(term));
    },
    [dispatch]
  );

  const updateIsDirectTerm = useCallback(
    (term: any) => {
      dispatch(setAllDirectApplicationIsDirectTerm(term));
    },
    [dispatch]
  );

  return {
    applications,
    totalPages,
    currentPage,
    loading,
    error,
    searchTerm,
    sortTerm,
    statusTerm,
    isDirectTerm,
    updateIsDirectTerm,
    updateStatusTerm,
    fetchApplications,
    updateSearchTerm,
    updateSortTerm,
  };
};

export const useAllStudents = () => {
  const dispatch: AppDispatch = useDispatch();
  const useAllStudent = useSelector(
    (state: any) => state?.application?.allStudents?.students
  );
  const totalPages = useSelector(
    (state: any) => state?.application?.allStudents?.totalPages
  );
  const currentPage = useSelector(
    (state: any) => state?.application?.allStudents?.currentPage
  );
  const loading = useSelector((state: any) => state?.application?.loading);
  const error = useSelector((state: any) => state.application.error);
  const searchTerm = useSelector(
    (state: any) => state.application.allStudentsSearchTerm
  );

  const fetchApplications = useCallback(
    (page: number, limit: number) => {
      dispatch(getAllStudents({ page, limit, search: searchTerm || "" }));
    },
    [dispatch, searchTerm]
  );

  const updateSearchTerm = useCallback(
    (term: string) => {
      dispatch(setAllStudentsSearchTerm(term));
    },
    [dispatch]
  );

  return {
    useAllStudent,
    totalPages,
    currentPage,
    loading,
    error,
    searchTerm,
    fetchApplications,
    updateSearchTerm,
  };
};

export const useTopAgentCommisson = () => {
  const dispatch: AppDispatch = useDispatch();
  const useTopCommission = useSelector(
    (state: any) => state?.application?.allAgentCommission?.topAgentCommission
  );
  const totalPages = useSelector(
    (state: any) => state?.application?.allAgentCommission?.totalPages
  );
  const currentPage = useSelector(
    (state: any) => state?.application?.allAgentCommission?.currentPage
  );
  const loading = useSelector((state: any) => state?.application?.loading);
  const error = useSelector((state: any) => state?.application?.error);

  const fetchCommissions = useCallback(
    (page: number, limit: number) => {
      dispatch(getTopAgentCommission({ page, limit }));
    },
    [dispatch]
  );

  return {
    useTopCommission,
    totalPages,
    currentPage,
    loading,
    error,
    fetchCommissions,
  };
};

export const useAllPendingApplication = () => {
  const dispatch: AppDispatch = useDispatch();
  const applications = useSelector(
    (state: any) => state?.application?.allPendingApplication?.applications
  );
  const totalPages = useSelector(
    (state: any) => state?.application?.allPendingApplication?.totalPages
  );
  const currentPage = useSelector(
    (state: any) => state?.application?.allPendingApplication?.currentPage
  );
  const loading = useSelector((state: any) => state?.application?.loading);
  const error = useSelector((state: any) => state.application.error);
  const searchTerm = useSelector(
    (state: any) => state.application.allPendingApplicationSearchTerm
  );

  const fetchApplications = useCallback(
    (page: number, limit: number) => {
      dispatch(
        getAllPendingApplication({ page, limit, search: searchTerm || "" })
      );
    },
    [dispatch, searchTerm]
  );

  const updateSearchTerm = useCallback(
    (term: string) => {
      dispatch(setAllPendingApplicationSearchTerm(term));
    },
    [dispatch]
  );

  return {
    applications,
    totalPages,
    currentPage,
    loading,
    error,
    searchTerm,
    fetchApplications,
    updateSearchTerm,
  };
};

export const useUserActivity = () => {
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const userActivity = useSelector(selectUserActivity);
  const userToken = sessionStorage.getItem("userData");

  const fetchActivity = useCallback(
    (page: number = 1, itemsLimit: number = 10) => {
      if (userToken) {
        setLoading(true);
        dispatch(getActivity({ page: Number(page), limit: Number(itemsLimit) }))
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
    },
    [userToken, dispatch]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      fetchActivity(page, limit);
    },
    [fetchActivity, limit]
  );

  useEffect(() => {
    fetchActivity(currentPage, limit);
  }, [fetchActivity, currentPage, limit]);

  return useMemo(
    () => ({
      userActivity,
      loading,
      currentPage,
      limit,
      handlePageChange,
    }),
    [userActivity, loading, currentPage, limit, handlePageChange]
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

export const useAdminEmails = () => {
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

export const useAllStaffForSuperAdmin = () => {
  const dispatch: AppDispatch = useDispatch();
  const allAdmin: any = useSelector(
    (state: RootState) => state?.application?.allStaff
  );
  const loading = useSelector(
    (state: RootState) => state?.application?.loading
  );
  const error = useSelector((state: RootState) => state?.application.error);
  const searchTerm = useSelector(
    (state: RootState) => state?.application?.allStaffSearchTerm
  );

  const fetchAdmins = useCallback(
    (page?: number, limit?: number) => {
      return dispatch(
        getAllStaffForSuperAdmin({ page, limit, search: searchTerm })
      );
    },
    [dispatch, searchTerm]
  );

  const updateSearchTerm = useCallback(
    (term: string) => {
      dispatch(setAllStaffSearchTerm(term));
    },
    [dispatch]
  );

  return {
    admins: allAdmin?.staffs,
    totalPages: allAdmin?.totalPages,
    currentPage: allAdmin?.currentPage,
    loading,
    error,
    searchTerm,
    fetchAdmins,
    updateSearchTerm,
  };
};

export const useAllNews = () => {
  const dispatch: AppDispatch = useDispatch();
  const allUserNews = useSelector(
    (state: any) => state?.notificationApplication?.allNews?.news
  );
  const totalPages = useSelector(
    (state: any) => state?.notificationApplication?.allNews?.totalPages
  );
  const currentPage = useSelector(
    (state: any) => state?.notificationApplication?.allNews?.currentPage
  );
  const loading = useSelector(
    (state: any) => state?.notificationApplication?.loading
  );
  const error = useSelector(
    (state: any) => state.notificationApplication?.error
  );
  const searchTerm = useSelector(
    (state: any) => state.notificationApplication?.allNewsSearchTerm
  );

  const fetchNews = useCallback(
    (page: number, limit: number) => {
      dispatch(getAllNews({ page, limit, search: searchTerm || "" }));
    },
    [dispatch, searchTerm]
  );

  const updateSearchTerm = useCallback(
    (term: string) => {
      dispatch(setAllNewsSearchTerm(term));
    },
    [dispatch]
  );

  return {
    allUserNews,
    totalPages,
    currentPage,
    loading,
    error,
    searchTerm,
    fetchNews,
    updateSearchTerm,
  };
};

export const useAllDraftedNews = () => {
  const dispatch: AppDispatch = useDispatch();
  const allUserDraftedNews = useSelector(
    (state: any) => state?.notificationApplication?.allDraftedNews?.draftedNews
  );
  const totalPages = useSelector(
    (state: any) => state?.notificationApplication?.allDraftedNews?.totalPages
  );
  const currentPage = useSelector(
    (state: any) => state?.notificationApplication?.allDraftedNews?.currentPage
  );
  const loading = useSelector(
    (state: any) => state?.notificationApplication?.loading
  );
  const error = useSelector(
    (state: any) => state?.notificationApplication?.error
  );
  const searchTerm = useSelector(
    (state: any) => state?.notificationApplication?.allDraftedNewsSearchTerm
  );

  const fetchNews = useCallback(
    (page: number, limit: number) => {
      dispatch(getAllDraftedNews({ page, limit, search: searchTerm || "" }));
    },
    [dispatch, searchTerm]
  );

  const updateSearchTerm = useCallback(
    (term: string) => {
      dispatch(setAllDraftedNewsSearchTerm(term));
    },
    [dispatch]
  );

  return {
    allUserDraftedNews,
    totalPages,
    currentPage,
    loading,
    error,
    searchTerm,
    fetchNews,
    updateSearchTerm,
  };
};

export const useBanks = () => {
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const allBanks = useSelector(
    (state: any) => state?.application?.allBanks?.data?.data || []
  );

  useEffect(() => {
    if (allBanks?.length === 0) {
      setLoading(true);
      dispatch(getAllBanks())
        .unwrap()
        .then(() => setLoading(false))
        .catch((error: any) => {
          const errorMessage = error?.message || "Failed to fetch banks";
          dispatch(setMessage(errorMessage));
          setLoading(false);
        });
    }
  }, [dispatch, allBanks?.length]);

  return { allBanks, loading };
};

export const useStaffDetails = (staffEmail: string) => {
  const dispatch = useDispatch();

  const {
    data: staffDetail,
    isLoading: loading,
    error,
  } = useQuery<StaffDetails, Error>(
    ["staffDetail", staffEmail],
    async () => {
      if (!staffEmail) {
        throw new Error("No email provided");
      }
      const endpoint = `/admin/users/staff/find/email?email=${staffEmail}`;
      return await findStaffDetailByEmail(endpoint);
    },
    {
      enabled: !!staffEmail,
      onError: (error) => {
        dispatch(setMessage(error.message));
      },
    }
  );

  return { staffDetail: staffDetail ?? null, loading, error };
};

export const useAdminDetails = (adminEmail: string) => {
  const dispatch = useDispatch();

  const {
    data: adminDetail,
    isLoading: loading,
    error,
  } = useQuery<AdminDetails, Error>(
    ["adminDetail", adminEmail],
    async () => {
      if (!adminEmail) {
        throw new Error("No email provided");
      }
      const endpoint = `/admin/users/staff/find/email?email=${adminEmail}`;
      return await findStaffDetailByEmail(endpoint);
    },
    {
      enabled: !!adminEmail,
      onError: (error) => {
        dispatch(setMessage(error.message));
      },
    }
  );

  return { adminDetail: adminDetail ?? null, loading, error };
};

export const useStaffAssignedAgents = (staffId: string) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const {
    data: agentDetail,
    isLoading: loading,
    error,
  } = useQuery<StaffAssignedAgent, Error>(
    ["agentDetail", staffId],
    async () => {
      if (!staffId) {
        throw new Error("No id provided");
      }
      const endpoint = `/admin/users/staff/${staffId}`;
      return await findStaffAssignedAgent(endpoint);
    },
    {
      enabled: !!staffId,
      onError: (error: any) => {
        dispatch(setMessage(error?.message));
      },
      staleTime: 0,
      cacheTime: 1000 * 60 * 5,
    }
  );

  const clearAgentData = useCallback(() => {
    queryClient.removeQueries(["agentDetail", staffId]);
  }, [queryClient, staffId]);

  return { agentDetail: agentDetail ?? null, loading, error, clearAgentData };
};

export const useStaffInvoices = (
  staffId: string,
  page: number,
  limit: number
) => {
  const dispatch = useDispatch();
  const {
    data: staffInvoices,
    isLoading: loading,
    error,
  } = useQuery<StaffInvoices, Error>(
    ["staffInvoices", staffId],
    async () => {
      if (!staffId) {
        throw new Error("No id provided");
      }
      const endpoint = `/admin/users/staff/${staffId}/invoices?page=${page}&limit=${limit}`;
      return await findStaffInvoices(endpoint);
    },
    {
      enabled: !!staffId,
      keepPreviousData: true,
      onError: (error) => {
        dispatch(setMessage(error.message));
      },
    }
  );

  return { staffInvoices: staffInvoices ?? null, loading, error };
};

export const useAllAdminForSuperAdmin = () => {
  const dispatch: AppDispatch = useDispatch();
  const allAdmin: any = useSelector(
    (state: RootState) => state?.application?.allAdmin
  );
  const loading = useSelector(
    (state: RootState) => state?.application?.loading
  );
  const error = useSelector((state: RootState) => state?.application.error);
  const searchTerm = useSelector(
    (state: RootState) => state?.application?.allAdminSearchTerm
  );

  const fetchAdmins = useCallback(
    (page?: number, limit?: number) => {
      return dispatch(
        getAllAdminForSuperAdmin({ page, limit, search: searchTerm })
      );
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
    updateSearchTerm,
  };
};

export const useAllSalary = () => {
  const dispatch: AppDispatch = useDispatch();
  const salaries = useSelector(
    (state: any) => state?.application?.allStaffPayments?.payments
  );
  const totalPages = useSelector(
    (state: any) => state?.application?.allStaffPaments?.totalPages
  );
  const currentPage = useSelector(
    (state: any) => state?.application?.allStaffPayments?.currentPage
  );
  const loading = useSelector((state: any) => state?.application?.loading);
  const error = useSelector((state: any) => state.application.error);
  const searchTerm = useSelector(
    (state: any) => state?.application?.allSalarySearchTerm
  );

  const fetchSalaries = useCallback(
    (page: number, limit: number, status: string) => {
      dispatch(
        getAllStaffSalaryPayment({
          page,
          limit,
          search: searchTerm || "",
          status,
        })
      );
    },
    [dispatch, searchTerm]
  );

  const updateSearchTerm = useCallback(
    (term: string) => {
      dispatch(setAllStaffSalarySearchTerm(term));
    },
    [dispatch]
  );

  return {
    salaries,
    totalPages,
    currentPage,
    loading,
    error,
    searchTerm,
    fetchSalaries,
    updateSearchTerm,
  };
};

export const useEnquiriesData = () => {
  const dispatch: AppDispatch = useDispatch();
  const enquiriesData = useSelector(
    (state: any) => state?.application?.getEnquiriesChatStats
  );
  useEffect(() => {
    dispatch(getAdminEnquiresStats());
  }, [dispatch]);

  const formatData = (rawData: any) => {
    if (!rawData?.data?.enqStats) return [];
    const colorMap: any = {
      INSTAGRAM: "#FFA500",
      FACEBOOK: "#800080",
      LINKEDIN: "#008000",
      TIKTOK: "#00BFFF",
      TWITTER: "#1DA1F2",
      YOUTUBE: "#8A2BE2",
      OTHERS: "#FF0000",
    };

    return rawData?.data?.enqStats?.map((item: any) => ({
      name: item?.platform?.charAt(0) + item?.platform?.slice(1)?.toLowerCase(),
      value: item?.count,
      percentage: item?.percentage,
      color: colorMap[item?.platform] || "#FF0000",
    }));
  };

  return {
    data: formatData(enquiriesData),
    total: enquiriesData?.data?.totalEnquiry,
    isLoading: !enquiriesData,
  };
};

export const useAllEnquiryData = (
  initialPage: number = 1,
  initialLimit: number = 10,
  initialSearch: string = ""
) => {
  const dispatch: AppDispatch = useDispatch();
  const { allEnquiry, allEnquirySearchTerm, loading } = useSelector(
    (state: any) => state?.application
  );
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [search, setSearch] = useState(initialSearch);

  const fetchEnquiries = useCallback(() => {
    const validPage = Math.max(1, page);
    if (validPage !== page) {
      setPage(validPage);
      return;
    }
    dispatch(getAllEnquiry({ page: validPage, limit, search }));
  }, [dispatch, page, limit, search]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const handleSearch = (newSearch: string) => {
    setPage(1);
    setSearch(newSearch);
    dispatch(setAllEnquirySearchTerm(newSearch));
  };

  const handlePageChange: any = (newPage: number) => {
    if (newPage < 1) return;

    if (!allEnquiry?.data?.length && newPage > 1) {
      setPage(1);
      return;
    }

    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setPage(1);
    setLimit(newLimit);
  };

  return {
    enquiries: allEnquiry?.data,
    currentPage: page,
    search: allEnquirySearchTerm,
    handleSearch,
    handlePageChange,
    handleLimitChange,
    loading,
  };
};

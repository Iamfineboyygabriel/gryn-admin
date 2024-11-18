import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getAllAgents,
  getAllApplicationPayment,
  getAllStaffPayment,
  getAllBudget,
  getAllDraftItems,
  getAllInvoice,
  getAllPendingAgents,
  getAllVisaApplication,
  getCurrentUser,
  getTopCountries,
  getTopUniversities,
  getUserProfile,
  setAllAgentSearchTerm,
  setAllApplicationPaymentSearchTerm,
  setAllPendingAgentSearchTerm,
  setAllVisaApplicationSearchTerm,
  updateProfile,
  uploadAvatar,
  getStaffSalary,
  getAgentCommission,
  clearPaymentData,
} from "../../shared/slices/shareApplication.slices";
import { AppDispatch } from "../../store";
import { setMessage } from "../../message.slices";
import {
  getSingleAgentApplication,
  getSingleStudentApplication,
  getStudentApplication,
  getVisaApplicationDetails,
} from "../../shared/services/shareApplication.services";
import { useQuery } from "react-query";
import { getAllStaffForSuperAdmin } from "../../admin/slices/application.slices";
import { useAppSelector } from "./reduxHooks";
import { getAllBanks } from "../../admin/services/application.services";

interface UpdateProfile {
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}

export interface ApplicationDetails {
  status: number;
  message: string;
  data: {
    email: string;
    id: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    middleName: string;
    dateOfBirth: string;
    address: string;
    localGovtArea: string;
    state: string;
    country: string;
    internationalPassportNumber: string;
    status: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    staff: {
      email: string;
    };
    degree: {
      id: number;
      country: string;
      university: string;
      degreeType: string;
      course: string;
      applicationId: number;
      createdAt: string;
      updatedAt: string;
    };
    documents: {
      id: string;
      name: string;
      publicURL: string;
      documentType: string;
      uploadType: string;
      applicationId: number;
      paymentId: null;
      agentId: null;
      createdAt: string;
      updatedAt: string;
      remark: string;
      status: "PENDING" | "APPROVED" | "REJECTED";
    }[];
    payment: {
      id?: string;
      documents: {
        id: string;
        name: string;
        publicURL: string;
        documentType: string;
        uploadType: string;
        applicationId: number;
        paymentId: null;
        agentId: null;
        createdAt: string;
        updatedAt: string;
        remark: string;
        status: "PENDING" | "APPROVED" | "REJECTED";
      }[];
    };
  };
}

export interface VisaApplicationDetails {
  status: number;
  message: string;
  data: {
    email: string;
    otherName: string;
    id: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    middleName: string;
    localGovtArea: string;
    issuedDate: string;
    agentId: string;
    expiryDate: string;
    document: {
      id: string;
      name: string;
      publicURL: string;
      documentType: string;
      uploadType: string;
      applicationId: number;
      agentId: null;
      remark: string;
      status: "PENDING" | "APPROVED" | "REJECTED";
    }[];
    agent: {
      profile: {
        email: string;
      };
    };
    destination: string;
    schoolName: string;
    state: string;
    country: string;
    passportNumber: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface Country {
  name: string;
  cca2: string;
}

interface State {
  name: string;
}

export const UseUserProfile = () => {
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const userToken = sessionStorage.getItem("userData");

  const userProfile = useSelector(
    (state: any) => state.shareApplication?.userProfile?.data?.userprofile
  );

  useEffect(() => {
    if (userToken) {
      setLoading(true);
      dispatch(getUserProfile())
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
  }, [dispatch, userToken]);

  const updateUserProfile = async (body: UpdateProfile) => {
    if (!userToken) {
      dispatch(setMessage("Token not found"));
      return;
    }
    setLoading(true);
    try {
      const response = await dispatch(updateProfile(body)).unwrap();
      dispatch(getUserProfile()).unwrap();
      setLoading(false);
      return response;
    } catch (error: any) {
      const errorMessage = error?.message;
      dispatch(setMessage(errorMessage));
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  const uploadUserAvatar = async (selectedFile: File) => {
    if (userToken && selectedFile) {
      try {
        let body = new FormData();
        body.append("file", selectedFile);
        await dispatch(uploadAvatar(body)).unwrap();
        dispatch(getUserProfile()).unwrap();
        userProfile();
      } catch (error: any) {}
    } else {
      dispatch(setMessage("Token not found"));
    }
  };
  return { userProfile, loading, updateUserProfile, uploadUserAvatar };
};

export const useCurrentUser = () => {
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const userDetails = useSelector(
    (state: any) => state.shareApplication?.currentUser
  );
  const userToken = sessionStorage.getItem("userData");

  useEffect(() => {
    if (userToken) {
      setLoading(true);
      dispatch(getCurrentUser())
        .unwrap()
        .then(() => setLoading(false))
        .catch((error: any) => {
          const errorMessage = error.message || "Failed to fetch user details";
          dispatch(setMessage(errorMessage));
          setLoading(false);
        });
    } else {
      dispatch(setMessage("Token not found"));
    }
  }, [dispatch, userToken]);

  return { userDetails, loading };
};

export default UseUserProfile;

export const useApplicationDetails = (applicationId: string) => {
  const dispatch = useDispatch();

  const {
    data: applicationDetails,
    isLoading: loading,
    error,
  } = useQuery<ApplicationDetails, Error>(
    ["applicationDetails", applicationId],
    async () => {
      if (!applicationId) {
        throw new Error("No application ID provided");
      }
      const endpoint = `/admin/application/${applicationId}`;
      return await getStudentApplication(endpoint);
    },
    {
      enabled: !!applicationId,
      onError: (error) => {
        dispatch(setMessage(error.message));
      },
    }
  );

  return { applicationDetails, loading, error };
};

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const mappedCountries = data?.map((country: any) => ({
          name: country?.name?.common,
          cca2: country?.cca2,
        }));
        setCountries(mappedCountries);
      } catch (error) {
        setError("Error fetching countries");
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, loading, error };
};

export const useStates = () => {
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStates = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "https://nga-states-lga.onrender.com/fetch"
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setStates(data);
      } catch (error) {
        setError("Error fetching states");
        console.error("Error fetching states:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, []);

  return { states, loading, error };
};

export const useTopCountries = () => {
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const userTopCountries = useSelector(
    (state: any) => state.shareApplication?.topCountries
  );
  const userToken = sessionStorage.getItem("userData");

  useEffect(() => {
    if (userToken) {
      setLoading(true);
      dispatch(getTopCountries())
        .unwrap()
        .then(() => setLoading(false))
        .catch((error: any) => {
          const errorMessage = error.message || "Failed to fetch top countries";
          dispatch(setMessage(errorMessage));
          setLoading(false);
        });
    } else {
      dispatch(setMessage("Token not found"));
    }
  }, [dispatch, userToken]);

  return { userTopCountries, loading };
};

export const useTopUniversities = () => {
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const userTopUniversities = useSelector(
    (state: any) => state.shareApplication?.topUniversities
  );
  const userToken = sessionStorage.getItem("userData");

  useEffect(() => {
    if (userToken) {
      setLoading(true);
      dispatch(getTopUniversities())
        .unwrap()
        .then(() => setLoading(false))
        .catch((error: any) => {
          const errorMessage =
            error.message || "Failed to fetch top universities";
          dispatch(setMessage(errorMessage));
          setLoading(false);
        });
    } else {
      dispatch(setMessage("Token not found"));
    }
  }, [dispatch, userToken]);

  return { userTopUniversities, loading };
};

export const useAllAgent = () => {
  const dispatch: AppDispatch = useDispatch();
  const agents = useSelector(
    (state: any) => state?.shareApplication?.allAgents?.agents || []
  );
  const totalPages = useSelector(
    (state: any) => state?.shareApplication?.allAgents?.totalPages || 0
  );
  const currentPage = useSelector(
    (state: any) => state?.shareApplication?.allAgents?.currentPage || 1
  );
  const loading = useSelector(
    (state: any) => state?.shareApplication?.loading || false
  );
  const error = useSelector(
    (state: any) => state?.shareApplication?.error || null
  );
  const searchTerm = useSelector(
    (state: any) => state?.shareApplication?.searchTerm || ""
  );

  const fetchAgents = useCallback(
    (page: number, limit: number) => {
      dispatch(getAllAgents({ page, limit, search: searchTerm || "" }));
    },
    [dispatch, searchTerm]
  );

  const updateSearchTerm = useCallback(
    (term: string) => {
      dispatch(setAllAgentSearchTerm(term));
    },
    [dispatch]
  );

  return {
    agents,
    totalPages,
    currentPage,
    loading,
    error,
    searchTerm,
    fetchAgents,
    updateSearchTerm,
  };
};

export const useAllDraftItems = () => {
  const dispatch: AppDispatch = useDispatch();
  const draftItems = useSelector(
    (state: any) => state.shareApplication?.allDraftItems?.data?.data
  );
  const totalPages = useSelector(
    (state: any) => state?.shareApplication?.allDraftItems?.totalPages || 0
  );
  const currentPage = useSelector(
    (state: any) => state?.shareApplication?.allDraftItems?.currentPage || 1
  );
  const loading = useSelector(
    (state: any) => state?.shareApplication?.loading || false
  );

  const fetchDraftItems = useCallback(
    (page: number, limit: number) => {
      dispatch(getAllDraftItems({ page, limit }));
    },
    [dispatch]
  );

  return { draftItems, loading, fetchDraftItems, totalPages, currentPage };
};

export const useAllInvoice = () => {
  const dispatch: AppDispatch = useDispatch();
  const useInvoice = useSelector(
    (state: any) => state.shareApplication?.allInvoice?.data?.data
  );
  const totalPages = useSelector(
    (state: any) => state?.shareApplication?.allInvoice?.totalPages || 0
  );
  const currentPage = useSelector(
    (state: any) => state?.shareApplication?.allInvoice?.currentPage || 1
  );
  const loading = useSelector(
    (state: any) => state?.shareApplication?.loading || false
  );

  const fetchInvoice = useCallback(
    (page: number, limit: number) => {
      dispatch(getAllInvoice({ page, limit }));
    },
    [dispatch]
  );

  return { useInvoice, loading, fetchInvoice, totalPages, currentPage };
};

export const useSingleStudentApplication = (
  studentId: string,
  options: {
    page: number;
    limit: number;
    search: string;
    sort: string;
    status: string;
  }
) => {
  const dispatch = useDispatch();

  const { data, isLoading, error } = useQuery(
    ["applicationDetails", studentId, options],
    async () => {
      if (!studentId) {
        throw new Error("No student ID provided");
      }

      const { page, limit, search, sort, status } = options;
      const endpoint = `/admin/application/student/${studentId}?page=${page}&limit=${limit}&search=${encodeURIComponent(
        search
      )}${sort ? `&sort=${sort}` : ""}&status=${status}`;

      const response = await getSingleStudentApplication(endpoint);
      return response.data;
    },
    {
      enabled: !!studentId,
      onError: (error: any) => {
        dispatch(setMessage(error.message));
      },
    }
  );

  return { applicationDetails: data, loading: isLoading, error };
};

export const useSingleAgentApplication = (
  agentId: string,
  options: {
    page: number;
    limit: number;
    search: string;
    sort: string;
    status: string;
  }
) => {
  const dispatch = useDispatch();

  const { data, isLoading, error } = useQuery(
    ["applicationDetails", agentId, options],
    async () => {
      if (!agentId) {
        throw new Error("No student ID provided");
      }

      const { page, limit, search, sort, status } = options;
      const endpoint = `/admin/users/agent/${agentId}/applications?page=${page}&limit=${limit}&search=${encodeURIComponent(
        search
      )}${sort ? `&sort=${sort}` : ""}&status=${status}`;

      const response = await getSingleStudentApplication(endpoint);
      return response.data;
    },
    {
      enabled: !!agentId,
      onError: (error: any) => {
        dispatch(setMessage(error.message));
      },
    }
  );

  return { applicationDetails: data, loading: isLoading, error };
};

export const useAllVisa = () => {
  const dispatch: AppDispatch = useDispatch();
  const visa = useSelector(
    (state: any) => state?.shareApplication?.allVisa?.visas || []
  );
  const totalPages = useSelector(
    (state: any) => state?.shareApplication?.allVisa?.totalPages || 0
  );
  const currentPage = useSelector(
    (state: any) => state?.shareApplication?.allVisa?.currentPage || 1
  );
  const loading = useSelector(
    (state: any) => state?.shareApplication?.loading || false
  );
  const error = useSelector(
    (state: any) => state?.shareApplication?.error || null
  );
  const searchTerm = useSelector(
    (state: any) => state?.shareApplication?.allVisaApplicationSearchTerm || ""
  );

  const fetchApplications = useCallback(
    (page: number, limit: number) => {
      dispatch(
        getAllVisaApplication({ page, limit, search: searchTerm || "" })
      );
    },
    [dispatch, searchTerm]
  );

  const updateSearchTerm = useCallback(
    (term: string) => {
      dispatch(setAllVisaApplicationSearchTerm(term));
    },
    [dispatch]
  );

  return {
    visa,
    totalPages,
    currentPage,
    loading,
    error,
    searchTerm,
    fetchApplications,
    updateSearchTerm,
  };
};

export const useAllPendingAgents = () => {
  const dispatch: AppDispatch = useDispatch();
  const agents = useSelector(
    (state: any) => state?.shareApplication?.allPendingAgents?.allPending || []
  );
  const totalPages = useSelector(
    (state: any) => state?.shareApplication?.allPendingAgents?.totalPages || 0
  );
  const currentPage = useSelector(
    (state: any) => state?.shareApplication?.allPendingAgents?.currentPage || 1
  );
  const loading = useSelector(
    (state: any) => state?.shareApplication?.loading || false
  );
  const error = useSelector(
    (state: any) => state?.shareApplication?.error || null
  );
  const searchTerm = useSelector(
    (state: any) => state?.shareApplication?.searchTerm || ""
  );

  const fetchAgents = useCallback(
    (page: number, limit: number) => {
      dispatch(getAllPendingAgents({ page, limit, search: searchTerm || "" }));
    },
    [dispatch, searchTerm]
  );

  const updateSearchTerm = useCallback(
    (term: string) => {
      dispatch(setAllPendingAgentSearchTerm(term));
    },
    [dispatch]
  );

  return {
    agents,
    totalPages,
    currentPage,
    loading,
    error,
    searchTerm,
    fetchAgents,
    updateSearchTerm,
  };
};

export const useVisaApplicationDetails = (applicationId: string) => {
  const dispatch = useDispatch();
  const {
    data: applicationDetails,
    isLoading: loading,
    error,
  } = useQuery<VisaApplicationDetails, Error>(
    ["applicationDetails", applicationId],
    async () => {
      if (!applicationId) {
        throw new Error("No application ID provided");
      }
      const endpoint = `/visa/${applicationId}`;
      return await getVisaApplicationDetails(endpoint);
    },
    {
      enabled: !!applicationId,
      onError: (error) => {
        dispatch(setMessage(error.message));
      },
    }
  );

  return { applicationDetails, loading, error };
};

export const useBudgetFetch = (initialPage = 1, initialLimit = 10) => {
  const dispatch: AppDispatch = useDispatch();
  const { allBudgets, loading, error, sort, status, month, search } =
    useSelector((state: any) => state.shareApplication);

  useEffect(() => {
    dispatch(
      getAllBudget({
        page: initialPage,
        limit: initialLimit,
        sort,
        status,
        month,
        search,
      })
    );
  }, [dispatch, initialPage, initialLimit, sort, status, month, search]);

  return {
    budgets: allBudgets,
    loading,
    error,
  };
};

export const useAllApplicationPayment = () => {
  const dispatch: AppDispatch = useDispatch();
  const allApplicationPayment = useSelector(
    (state: any) => state?.shareApplication?.allAppPayment?.payments || []
  );
  const totalPages = useSelector(
    (state: any) => state?.shareApplication?.allPayment?.totalPages || 0
  );
  const currentPage = useSelector(
    (state: any) => state?.shareApplication?.allPayment?.currentPage || 1
  );
  const loading = useSelector(
    (state: any) => state?.shareApplication?.loading || false
  );
  const error = useSelector(
    (state: any) => state?.shareApplication?.error || null
  );
  const searchTerm = useSelector(
    (state: any) => state?.shareApplication?.searchTerm || ""
  );

  const fetchApplicationPayments = useCallback(
    (page: number, limit: number) => {
      dispatch(
        getAllApplicationPayment({ page, limit, search: searchTerm || "" })
      );
    },
    [dispatch, searchTerm]
  );

  const updateSearchTerm = useCallback(
    (term: string) => {
      dispatch(setAllApplicationPaymentSearchTerm(term));
    },
    [dispatch]
  );

  return {
    allApplicationPayment,
    totalPages,
    currentPage,
    loading,
    error,
    searchTerm,
    fetchApplicationPayments,
    updateSearchTerm,
  };
};

export const useAllStaffPayment = () => {
  const dispatch: AppDispatch = useDispatch();
  const allStaffInvoicePayment = useSelector(
    (state: any) => state?.shareApplication?.allStaffPayment?.payments || []
  );
  const totalPages = useSelector(
    (state: any) => state?.shareApplication?.allStaffPayment?.totalPages || 0
  );
  const currentPage = useSelector(
    (state: any) => state?.shareApplication?.allStaffPayment?.currentPage || 1
  );
  const loading = useSelector(
    (state: any) => state?.shareApplication?.loading || false
  );
  const error = useSelector(
    (state: any) => state?.shareApplication?.error || null
  );

  const fetchStaffPayments = useCallback(
    (id: string, page: number, limit: number) => {
      dispatch(getAllStaffPayment({ id, page, limit }));
    },
    [dispatch]
  );

  const clearPayments = useCallback(() => {
    dispatch(clearPaymentData());
  }, [dispatch]);

  return {
    allStaffInvoicePayment,
    totalPages,
    currentPage,
    loading,
    error,
    fetchStaffPayments,
    clearPayments,
  };
};

export const useStaffSalary = () => {
  const dispatch: AppDispatch = useDispatch();
  const staffSalary = useSelector(
    (state: any) => state?.shareApplication?.allStaffSalary?.payments || []
  );
  const currentPage = useSelector(
    (state: any) => state?.shareApplication?.allStaffSalary?.currentPage || 1
  );
  const loading = useSelector(
    (state: any) => state?.shareApplication?.loading || false
  );
  const error = useSelector(
    (state: any) => state?.shareApplication?.error || null
  );

  const fetchStaffPayments = useCallback(
    (id: string, page: number) => {
      dispatch(getStaffSalary({ id, page }));
    },
    [dispatch]
  );

  return { staffSalary, loading, error, fetchStaffPayments, currentPage };
};

export const useAgentCommission = () => {
  const dispatch: AppDispatch = useDispatch();
  const agentCommissions = useSelector(
    (state: any) => state?.shareApplication?.allAgentCommission?.payments || []
  );
  const loading = useSelector(
    (state: any) => state?.shareApplication?.loading || false
  );
  const error = useSelector(
    (state: any) => state?.shareApplication?.error || null
  );

  const fetchAgentPayments = useCallback(
    (id: string) => {
      dispatch(getAgentCommission({ id }));
    },
    [dispatch]
  );

  return { agentCommissions, loading, error, fetchAgentPayments };
};

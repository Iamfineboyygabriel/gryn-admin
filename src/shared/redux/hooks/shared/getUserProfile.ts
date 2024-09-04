import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getAllAgents,
  getAllDraftItems,
  getAllInvoice,
  getAllPendingAgents,
  getAllStudents,
  getAllVisaApplication,
  getCurrentUser,
  getTopCountries,
  getTopUniversities,
  getUserProfile,
  updateProfile,
  uploadAvatar,
} from "../../shared/slices/shareApplication.slices";
import { AppDispatch } from "../../store";
import { setMessage } from "../../message.slices";
import {
  getSingleStudentApplication,
  getStudentApplication,
} from "../../shared/services/shareApplication.services";
import { useQuery } from "react-query";

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
    id: number;
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
      id: number;
      name: string;
      publicURL: string;
      documentType: string;
      uploadType: string;
      applicationId: number;
      paymentId: null;
      agentId: null;
      createdAt: string;
      updatedAt: string;
    }[];
  };
}

interface Country {
  name: string;
  cca2: string;
}

interface State {
  name: string;
}

export const useUserProfile = () => {
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

export default useUserProfile;

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

export const useAllStudent = () => {
  const dispatch: AppDispatch = useDispatch();
  const useAllStudents = useSelector(
    (state: any) => state.shareApplication.allStudents
  );
  const loading = useSelector((state: any) => state.shareApplication.loading);

  const fetchApplications = useCallback(
    (page: number, limit: number) => {
      dispatch(getAllStudents({ page, limit }));
    },
    [dispatch]
  );

  return { useAllStudents, fetchApplications, loading };
};

export const useAllAgent = () => {
  const dispatch: AppDispatch = useDispatch();
  const useAgents = useSelector(
    (state: any) => state.shareApplication?.allAgents.data
  );
  console.log("agent hook", useAgents);

  const loading = useSelector((state: any) => state.shareApplication.loading);

  const fetchAgents = useCallback(
    (page: number, limit: number) => {
      dispatch(getAllAgents({ page, limit }));
    },
    [dispatch]
  );

  return { useAgents, loading, fetchAgents };
};
export const useAllDraftItems = () => {
  const dispatch: AppDispatch = useDispatch();
  const draftItems = useSelector(
    (state: any) => state.shareApplication.allDraftItems
  );
  const loading = useSelector((state: any) => state.shareApplication.loading);

  const fetchDraftItems = useCallback(
    (page: number, limit: number) => {
      dispatch(getAllDraftItems({ page, limit }));
    },
    [dispatch]
  );

  return { draftItems, fetchDraftItems, loading };
};

export const useAllInvoice = () => {
  const dispatch: AppDispatch = useDispatch();
  const useInvoice = useSelector(
    (state: any) => state.shareApplication?.allInvoice.data
  );
  const loading = useSelector((state: any) => state.shareApplication.loading);

  const fetchInvoice = useCallback(
    (page: number, limit: number) => {
      dispatch(getAllInvoice({ page, limit }));
    },
    [dispatch]
  );

  return { useInvoice, loading, fetchInvoice };
};

export const useSingleStudentApplication = (studentId?: string) => {
  const dispatch = useDispatch();

  const { data, isLoading, error } = useQuery(
    ["applicationDetails", studentId],
    async () => {
      if (!studentId) {
        throw new Error("No student ID provided");
      }
      const endpoint = `/admin/application/student/${studentId}`;
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

export const useAllVisa = () => {
  const dispatch: AppDispatch = useDispatch();
  const allVisa = useSelector((state: any) => state.shareApplication.allVisa);
  const error = useSelector((state: any) => state.shareApplication.error);

  const fetchVisa = useCallback(
    (page: number, limit: number) => {
      dispatch(getAllVisaApplication({ page, limit }));
    },
    [dispatch]
  );

  useEffect(() => {
    if (allVisa.data === null && !allVisa.loading) {
      fetchVisa(1, 10);
    }
  }, [allVisa, allVisa.loading, fetchVisa]);

  return {
    visaData: allVisa.data,
    totalItems: allVisa.totalItems,
    loading: allVisa.loading,
    error,
    fetchVisa,
  };
};

export const useAllPendingAgents = () => {
  const dispatch: AppDispatch = useDispatch();
  const useAllPending = useSelector(
    (state: any) => state.shareApplication.pendingAgents
  );
  console.log("usePend", useAllPending);

  const fetchAgents = useCallback(
    (page: number, limit: number) => {
      dispatch(getAllPendingAgents({ page, limit }));
    },
    [dispatch]
  );

  return { useAllPending, fetchAgents };
};

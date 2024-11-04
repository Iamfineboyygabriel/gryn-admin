import axios from "axios";
import authHeader from "../../headers";

const API_URL = process.env.REACT_APP_API_URL;
const API_URL_Add_New_School = process.env.REACT_APP_API_URL + "/school";

interface SubmitBankDetailsParams {
  accountNumber: string;
  accountName: string;
  bankCode: string;
  bankName:string;
}

const handleApiError = (error: any) => {
  if (!error?.response) {
    throw new Error("Network Error: Please check your internet connection.");
  }
  throw error.response.data || error;
};


const getStats = async () => {
  const url = `${API_URL}/admin/application/dashboard-stats`;
  try {
    const response = await axios.get(url, { headers: authHeader() });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getStaffDashboardStats = async () => {
  const url = `${API_URL}/admin/application/staff/dashboard-stats`;
  try {
    const response = await axios.get(url, { headers: authHeader() });
    return response.data;
  } catch (error) {
    throw error;
  }
};


const getAllApplication = async (page: number, limit: number, search: string = '', sort: string = '', status:string) => {
  const url = `${API_URL}/admin/application?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}${sort ? `&sort=${sort}` : ''}&status=${status}`;
  try {
    const response = await axios.get(url, { headers: authHeader() });
    const token = response?.data?.data?.tokens?.accessToken;
    if (token) {
      sessionStorage.setItem("userData", token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};


const getAllStudents = async (page: number, limit: number, search: string = '') => {
  const url = `${API_URL}/admin/users/students?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
  try {
    const response = await axios.get(url, { headers: authHeader() });
    const token = response?.data?.data?.tokens?.accessToken;
    if (token) {
      sessionStorage.setItem("userData", token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};


const getTopAgentCommission = async (page: number, limit: number) => {
  const url = `${API_URL}/admin/users/agent/commissions?page=${page}&limit=${limit}`;
  try {
    const response = await axios.get(url, { headers: authHeader() });
    const token = response?.data?.data?.tokens?.accessToken;
    if (token) {
      sessionStorage.setItem("userData", token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};


const getAllPendingApplication = async (page: number, limit: number, search: string = '') => {
  const url = `${API_URL}/admin/application/pending?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
  try {
    const response = await axios.get(url, { headers: authHeader() });
    const token = response?.data?.data?.tokens?.accessToken;
    if (token) {
      sessionStorage.setItem("userData", token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getActivity = async (page: number, limit: number) => {
  const url = `${process.env.REACT_APP_API_URL}/activity?page=${page}&limit=${limit}`;
  try {
    const response = await axios({
      url,
      headers: authHeader(),
      method: "get",
    });
    const token = response?.data?.data?.tokens?.accessToken;
    if (token) {
      sessionStorage.setItem("userData", token);
    }
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const getUserActivity = async (userId: string, page: number, limit: number) => {
  const url = `${process.env.REACT_APP_API_URL}/activity/${userId}?page=${page}&limit=${limit}`;
  try {
    const response = await axios({
      url,
      headers: authHeader(),
      method: "get",
    });
    const token = response?.data?.data?.tokens?.accessToken;
    if (token) {
      sessionStorage.setItem("userData", token);
    }
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const addNewSchool = async (body: any) => {
  try {
    const token = sessionStorage.getItem("userData");
    const response = await axios.post(API_URL_Add_New_School, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    handleApiError(error);
  }
};

export const findSchoolLinkByCountryAndUniversity = async (endpoint: any) => {
  const url = `${process.env.REACT_APP_API_URL}${endpoint}`;
  try {
    const response = await axios.get(url, {
      headers: authHeader(),
    });
    const token = response?.data?.data?.tokens?.accessToken;
    if (token) {
      sessionStorage.setItem("userData", token);
    }
    return response.data;
  } catch (error: any) {
    if (!error.response) {
      throw new Error("Network Error: Please check your internet connection.");
    }
    throw error.response.data;
  }
};

const getAllStudentEmail = async () => {
  const url = `${API_URL}/admin/users/students/emails`;
  try {
    const response = await axios.get(url, { headers: authHeader() });
    const token = response?.data?.data?.tokens?.accessToken;
    if (token) {
      sessionStorage.setItem("userData", token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAllStaffEmail = async () => {
  const url = `${API_URL}/admin/users/staffs/emails`;
  try {
    const response = await axios.get(url, { headers: authHeader() });
    const token = response?.data?.data?.tokens?.accessToken;
    if (token) {
      sessionStorage.setItem("userData", token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAllAdminsEmail = async () => {
  const url = `${API_URL}/admin/users/admins/emails`;
  try {
    const response = await axios.get(url, { headers: authHeader() });
    const token = response?.data?.data?.tokens?.accessToken;
    if (token) {
      sessionStorage.setItem("userData", token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};


const getAllAgentsEmail = async () => {
  const url = `${API_URL}/admin/users/agents/emails`;
  try {
    const response = await axios.get(url, { headers: authHeader() });
    const token = response?.data?.data?.tokens?.accessToken;
    if (token) {
      sessionStorage.setItem("userData", token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAllSchoolsListCountries = async () => {
  const url = `${API_URL}/school/country`;
  try {
    const response = await axios.get(url, { headers: authHeader() });
    const token = response?.data?.data?.tokens?.accessToken;
    if (token) {
      sessionStorage.setItem("userData", token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getAllStaffForSuperAdmin = async (page?: number, limit?: number, search: string = '') => {
  let url = `${API_URL}/admin/users/admin/staffs?`;
  
  if (page !== undefined) url += `page=${page}&`;
  if (limit !== undefined) url += `limit=${limit}&`;
  if (search) url += `search=${encodeURIComponent(search)}`;

  try {
    const response = await axios.get(url, { headers: authHeader() });
    const token = response?.data?.data?.tokens?.accessToken;
    if (token) {
      sessionStorage.setItem("userData", token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAllActivity = async (page: number, limit: number, search: string = '') => {
  const url = `${API_URL}/admin/application?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
  try {
    const response = await axios.get(url, { headers: authHeader() });
    const token = response?.data?.data?.tokens?.accessToken;
    if (token) {
      sessionStorage.setItem("userData", token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateApplicationDocument = async (
  endpoint: string,
  formData: FormData,
) => {
  const url = `${process.env.REACT_APP_API_URL}${endpoint}`;
  try {
    const response = await axios({
      url,
      headers: {
        ...authHeader(),
        "Content-Type": "multipart/form-data",
      },
      method: "patch",
      data: formData,
    });

    const token = response?.data?.data?.tokens?.accessToken;
    if (token) {
      sessionStorage.setItem("userData", token);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const findSchoolByCountryName = async (endpoint: any) => {
  const url = `${process.env.REACT_APP_API_URL}${endpoint}`;
  try {
    const response = await axios.get(url, {
      headers: authHeader(),
    });
    const token = response?.data?.data?.tokens?.accessToken;
    if (token) {
      sessionStorage.setItem("userData", token);
    }
    return response.data;
  } catch (error: any) {
    if (!error.response) {
      throw new Error("Network Error: Please check your internet connection.");
    }
    throw error.response.data;
  }
};

const assignAgentToStaff = async (agentId: string, email: string) => {
  const url = `${process.env.REACT_APP_API_URL}/admin/users/assign/agent/${agentId}?email=${email}`;
  try {
    const response = await axios({
      url,
      headers: authHeader(),
      method: "patch",
    });
    const token = response?.data?.data?.tokens?.accessToken;
    if (token) {
      sessionStorage.setItem("userData", token);
    }
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const assignApplicationToStaff = async (applicationId: string, email: string) => {
  const url = `${process.env.REACT_APP_API_URL}/admin/application/staff/assign/${applicationId}?email=${email}`;
  try {
    const response = await axios({
      url,
      headers: authHeader(),
      method: "patch",
    });
    const token = response?.data?.data?.tokens?.accessToken;
    if (token) {
      sessionStorage.setItem("userData", token);
    }
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const assignApplicationToAgent = async (applicationId: string, agentEmail: string, staffEmail: string) => {
  const url = `${process.env.REACT_APP_API_URL}/admin/application/agent/assign/${applicationId}?agentEmail=${agentEmail}&staffEmail=${staffEmail}`;
  try {
    const response = await axios({
      url,
      headers: authHeader(),
      method: "patch",
    });
    const token = response?.data?.data?.tokens?.accessToken;
    if (token) {
      sessionStorage.setItem("userData", token);
    }
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};


export const getAllBanks = async () => {
  const url = `${API_URL}/auth/bank/list`;
  try {
    const response = await axios.get(url, { headers: authHeader() });
    const token = response.data.data?.accessToken;
    if (token) {
      sessionStorage.setItem("userData", token);
    }
    return response.data;
  } catch (error: any) {
    if (!error.response) {
      throw new Error("Network Error: Please check your internet connection.");
    }
    throw error.response.data;
  }
};

export const getAccountName = async (endpoint: any) => {
  const url = `${process.env.REACT_APP_API_URL}${endpoint}`;
  try {
    const response = await axios.get(url, {
      headers: authHeader(),
    });
    const token = response.data.data?.accessToken;
    if (token) {
      sessionStorage.setItem("userData", token);
    }
    return response.data;
  } catch (error: any) {
    if (!error.response) {
      throw new Error("Network Error: Please check your internet connection.");
    }
    throw error.response.data;
  }
};

export const submitBankDetails = async (
  email: string,
  { accountNumber, accountName, bankCode, bankName }: SubmitBankDetailsParams,
) => {
  const url = `${process.env.REACT_APP_API_URL}/auth/bankInfo?email=${encodeURIComponent(email)}`;
  try {
    const response = await axios.post(
      url,
      {
        accountNumber,
        accountName,
        bankCode,
        bankName,
      },
      {
        headers: authHeader(),
      },
    );
    return response.data;
  } catch (error: any) {
    if (!error.response) {
      throw new Error("Network Error: Please check your internet connection.");
    }
    throw error.response.data;
  }
};

export const updateBankDetails = async (
  { accountNumber, accountName, bankCode, bankName }: SubmitBankDetailsParams,
) => {
  const url = `${process.env.REACT_APP_API_URL}/admin/users/bank_details`;
  try {
    const response = await axios.patch(
      url,
      {
        accountNumber,
        accountName,
        bankCode,
        bankName,
      },
      {
        headers: authHeader(),
      },
    );
    return response.data;
  } catch (error: any) {
    if (!error.response) {
      throw new Error("Network Error: Please check your internet connection.");
    }
    throw error.response.data;
  }
};

export const uploadApplication = async (endpoint: string, body: FormData) => {
  const url = `${API_URL}${endpoint}`;
  try {
    const token = sessionStorage.getItem("userData");
    const headers = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const response = await axios.post(url, body, { headers });
    return response.data;
  } catch (error: any) {
    if (!error.response) {
      throw new Error("Network Error: Please check your internet connection.");
    }
    throw error.response.data;
  }
};


export const getAllAdminForSuperAdmin = async (page?: number, limit?: number, search: string = '') => {
  let url = `${API_URL}/admin/users/admin?`;
  
  if (page !== undefined) url += `page=${page}&`;
  if (limit !== undefined) url += `limit=${limit}&`;
  if (search) url += `search=${encodeURIComponent(search)}`;

  try {
    const response = await axios.get(url, { headers: authHeader() });
    const token = response?.data?.data?.tokens?.accessToken;
    if (token) {
      sessionStorage.setItem("userData", token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAllStaffSalaryPayment = async (page: number, limit: number, search: string = '', status = '') => {
  const url = `${API_URL}/invoice/payments?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&status=${status}`;
  try {
    const response = await axios.get(url, { headers: authHeader() });
    const token = response?.data?.data?.tokens?.accessToken;
    if (token) {
      sessionStorage.setItem("userData", token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAdminApplicationStatsBar = async (days: number) => {
  const url = `${API_URL}/admin/application/stats/bar?days=${days}`;
  try {
    const response = await axios.get(url, { headers: authHeader() });
    const token = response?.data?.data?.tokens?.accessToken;
    if (token) {
      sessionStorage.setItem("userData", token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAdminApexChartStats = async (month: number, year: number, status = '') => {
  const url = `${API_URL}/admin/application/stats/weekly?month=${month}&year=${year}&status=${status}`;
  try {
    const response = await axios.get(url, { headers: authHeader() });
    const token = response?.data?.data?.tokens?.accessToken;
    if (token) {
      sessionStorage.setItem("userData", token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateApplicationToCompleted = async (body: any, applicationId: any) => {
  const url = `${process.env.REACT_APP_API_URL}/admin/application/${applicationId}`;
  try {
    const response = await axios({
      url,
      headers: authHeader(),
      method: "patch",
      data: body,
    });
    const token = response.data.data?.accessTokenEncrypt;
    if (token) {
      sessionStorage.setItem("userData", token);
    }
    return response.data;
  } catch (error: any) {
    handleApiError(error);
  }
};

export async function updatePayment(endpoint: string, body: FormData) {
  const url = `${process.env.REACT_APP_API_URL}${endpoint}`;
  try {
    const token = sessionStorage.getItem("userData");
    const headers = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const response = await axios.patch(url, body, { headers });
    return response.data;
  } catch (error: any) {
    handleApiError(error);
  }
}


const applicationServices = {
  getStats,
  getStaffDashboardStats,
  getAllApplication,
  getAllPendingApplication,
  getAllStaffForSuperAdmin,
  getAllAdminForSuperAdmin,
  getAllStudents,
  getActivity,
  addNewSchool,
  getAllStudentEmail,
  getAllAgentsEmail,
  getAllAdminsEmail,
  getAllStaffEmail,
  getAllSchoolsListCountries,
  getAllActivity,
  updateApplicationDocument,
  assignAgentToStaff,
  assignApplicationToStaff,
  assignApplicationToAgent,
  getAllBanks,
  getAccountName,
  submitBankDetails,
  getAllStaffSalaryPayment,
  getTopAgentCommission,
  getUserActivity,
  getAdminApplicationStatsBar,
  getAdminApexChartStats,
  updateApplicationToCompleted,
};

export default applicationServices;
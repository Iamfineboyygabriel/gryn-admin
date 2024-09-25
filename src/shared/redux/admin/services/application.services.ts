import axios from "axios";
import authHeader from "../../headers";

const API_URL = process.env.REACT_APP_API_URL;
const API_URL_Add_New_School = process.env.REACT_APP_API_URL + "/admin/users/student";


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

const getAllApplication = async (page: number, limit: number, search: string = '') => {
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

const getActivity = async () => {
  const url = `${process.env.REACT_APP_API_URL}/activity`;
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

const applicationServices = {
  getStats,
  getStaffDashboardStats,
  getAllApplication,
  getAllPendingApplication,
  getAllAdminForSuperAdmin,
  getAllStudents,
  getActivity,
  addNewSchool,
  getAllStudentEmail,
  getAllAgentsEmail,
  getAllAdminsEmail,
  getAllSchoolsListCountries,
  getAllActivity
};

export default applicationServices;
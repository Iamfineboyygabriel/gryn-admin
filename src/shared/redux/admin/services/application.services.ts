import axios from "axios";
import authHeader from "../../headers";

const API_URL = process.env.REACT_APP_API_URL;

const getStats = async () => {
  const url = `${API_URL}/admin/application/dashboard-stats`;
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

const getAllAdminForSuperAdmin = async (page: number, limit: number, search: string = '') => {
  const url = `${API_URL}/admin/users/admin?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
  try {
    const response = await axios.get(url, { headers: authHeader() });
    console.log("Admin data response:", response.data);
    const token = response?.data?.data?.tokens?.accessToken;
    if (token) {
      sessionStorage.setItem("userData", token);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching admin data:", error);
    throw error;
  }
};

const applicationServices = {
  getStats,
  getAllApplication,
  getAllPendingApplication,
  getAllAdminForSuperAdmin,
};

export default applicationServices;
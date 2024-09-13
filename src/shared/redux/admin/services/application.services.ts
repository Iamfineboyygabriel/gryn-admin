import axios from "axios";
import authHeader from "../../headers";

const getStats = async () => {
  const url =
    process.env.REACT_APP_API_URL + "/admin/application/dashboard-stats";
  return await axios({
    url,
    headers: authHeader(),
    method: "get",
  }).then((response: any) => {
    return response.data;
  });
};

const getAllApplication = async (page: number, limit: number, search: string = '') => {
  const url = `${process.env.REACT_APP_API_URL}/admin/application?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
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
    throw error;
  }
};

const applicationServices = {
  getStats,
  getAllApplication,
};

export default applicationServices;

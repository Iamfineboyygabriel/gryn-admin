import axios from "axios";
import authHeader from "../../headers";

const handleApiError = (error: any) => {
    if (!error.response) {
      throw new Error("Network Error: Please check your internet connection.");
    }
    throw error.response.data || error;
  };
  
  const getUserProfile = async () => {
    const url = `${process.env.REACT_APP_API_URL}/users/admin/profile`;
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
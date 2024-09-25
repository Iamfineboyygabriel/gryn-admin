import axios from "axios";
import authHeader from "../../headers";

const API_URL_CREATE_NEWS = process.env.REACT_APP_API_URL + "/news";
const API_URL_CREATE_NEWS_DRAFT = process.env.REACT_APP_API_URL + "/news/draft";

const handleApiError = (error: any) => {
    if (!error.response) {
      throw new Error("Network Error: Please check your internet connection.");
    }
    throw error.response.data || error;
  };

const createNews = async (body: any) => {
    try {
      const token = sessionStorage.getItem("userData");
      const response = await axios.post(API_URL_CREATE_NEWS, body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      handleApiError(error);
    }
  };
  
  const createNewsDraft = async (body: any) => {
    try {
      const token = sessionStorage.getItem("userData");
      const response = await axios.post(API_URL_CREATE_NEWS_DRAFT, body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      handleApiError(error);
    }
  };

const notificationApplicationServices = {
    createNews,
    createNewsDraft,
}

export default notificationApplicationServices;


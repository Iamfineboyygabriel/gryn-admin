import axios from "axios";
import authHeader from "../../headers";

const API_URL_CREATE_NEWS = process.env.REACT_APP_API_URL + "/news";
const API_URL_CREATE_NEWS_DRAFT = process.env.REACT_APP_API_URL + "/news/draft";
const API_URL = process.env.REACT_APP_API_URL;

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
   
  const getAllNews = async (page: number, limit: number, search: string = '') => {
    const url = `${API_URL}/news?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
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


  const getAllDraftedNews = async (page: number, limit: number, search: string = '') => {
    const url = `${API_URL}/news/draft?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
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

  const CreateNotification = async (userId:any, body:any) => {
    const url = `${process.env.REACT_APP_API_URL}/notification/${userId}`;
    try {
      const response = await axios({
        url,
        headers: authHeader(),
        method: "post",
        data: body,
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

const getAllNotification = async (page: number, limit: number) => {
  const url = `${process.env.REACT_APP_API_URL}/notification?page=${page}&limit=${limit}`;
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


const updateNotificationStatus = async (notificationId: string) => {
  const url = `${process.env.REACT_APP_API_URL}/notification/status/${notificationId}`;
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
    throw error;
  }
};

const getNotificationCount = async () => {
  const url = `${process.env.REACT_APP_API_URL}/notification/count`;
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
  }catch (error) {
      throw error;
    }
};


const deleteNews = async (newsId: any) => {
  const url = `${process.env.REACT_APP_API_URL}/news/${newsId}`;
  try {
    const response = await axios({
      url,
      headers: authHeader(),
      method: "delete",
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


const notificationApplicationServices = {
    createNews,
    createNewsDraft,
    getAllNews,
    getAllDraftedNews,
    CreateNotification,
    getAllNotification,
    getNotificationCount,
    updateNotificationStatus,
    deleteNews,
}

export default notificationApplicationServices;


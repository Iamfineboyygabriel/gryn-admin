import axios from "axios";
import authHeader from "../../headers";

interface ApiResponse<T> {
  data: T;
  message: string;
}

const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    console.error("API Request Failed", {
      method: error.config?.method,
      url: error.config?.url,
      data: error.config?.data,
    });

    throw error.response?.data || new Error("Network Error");
  }
  throw error;
};

const updateTokenInStorage = (response: any) => {
  const token = response?.data?.tokens?.accessToken;
  if (token) {
    sessionStorage.setItem("userData", token);
  }
};
const searchUser = async (search: string = "") => {
  const url = `${
    process.env.REACT_APP_API_URL
  }/chat/users?search=${encodeURIComponent(search)}`;
  try {
    const response = await axios.get(url, { headers: authHeader() });
    updateTokenInStorage(response.data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const CreateChat = async (userId: string) => {
  const url = `${process.env.REACT_APP_API_URL}/chat/${userId}`;
  try {
    const response = await axios.post(url, {}, { headers: authHeader() });
    updateTokenInStorage(response.data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const findChatByUserId = async (userId: string) => {
  const url = `${process.env.REACT_APP_API_URL}/chat/${userId}`;
  try {
    const response = await axios.get(url, { headers: authHeader() });
    updateTokenInStorage(response.data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const UpDateReadStatus = async (chatId: string) => {
  const url = `${process.env.REACT_APP_API_URL}/chat/status/${chatId}`;
  try {
    const response = await axios.patch(url, {}, { headers: authHeader() });
    updateTokenInStorage(response.data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const findAllUserChat = async () => {
  const url = `${process.env.REACT_APP_API_URL}/chat/chat`;
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

const findUserUnreadMessageCount = async () => {
  const url = `${process.env.REACT_APP_API_URL}/chat/message/unread/count`;
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

const messageServices = {
  searchUser,
  CreateChat,
  findChatByUserId,
  findAllUserChat,
  findUserUnreadMessageCount,
  UpDateReadStatus,
};

export default messageServices;

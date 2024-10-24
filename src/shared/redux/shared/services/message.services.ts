import axios from "axios";
import authHeader from "../../headers";

const handleApiError = (error: any) => {
    if (!error.response) {
      throw new Error("Network Error: Please check your internet connection.");
    }
    throw error.response.data || error;
  };
  
  const searchUser = async (search: string = '') => {
    const url = `${process.env.REACT_APP_API_URL}/chat/users?search=${encodeURIComponent(search)}`;
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

  const CreateChat = async (userId:any) => {
    const url = `${process.env.REACT_APP_API_URL}/chat/${userId}`;
    try {
      const response = await axios({
        url,
        headers: authHeader(),
        method: "post",
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

  const findChatById = async (chatId: string ) => {
    const url = `${process.env.REACT_APP_API_URL}/chat/${chatId}`;
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

  const SendMessage = async (chatId:any, body:any) => {
    const url = `${process.env.REACT_APP_API_URL}/admin/users/salary/${chatId}`;
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

  const UpDateReadStatus = async (chatId:any, body:any) => {
    const url = `${process.env.REACT_APP_API_URL}/admin/users/salary/${chatId}`;
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

  const messageServices = {
    searchUser,
    CreateChat,
    findChatById,
    findAllUserChat,
    findUserUnreadMessageCount,
    SendMessage,
    UpDateReadStatus,
  };
  
  export default messageServices;
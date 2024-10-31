import axios from "axios";
import authHeader from "../../headers";

const handleApiError = (error: any) => {
  console.error('API Error:', error);
  
  if (axios.isAxiosError(error)) {
    console.error('Request that failed:', {
      method: error.config?.method,
      url: error.config?.url,
      data: error.config?.data,
      headers: error.config?.headers
    });
    
    if (!error.response) {
      throw new Error("Network Error: Please check your internet connection.");
    }
    throw error.response.data || error;
  }
  
  throw error;
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

  const findChatByUserId = async (userId:any) => {
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

  const SendMessage = async (chatId: string, body: any) => {
    if (!chatId) {
      throw new Error('Chat ID is required');
    }
    const url = `${process.env.REACT_APP_API_URL}/chat/send/${chatId}`;
    console.log('SendMessage: Attempting request', {
      url,
      method: 'POST',
      headers: authHeader(),
      body
    });
  
    try {
      const response = await axios({
        url,
        headers: {
          ...authHeader(),
          'Content-Type': 'application/json'
        },
        method: "post",
        data: body,
      });
    
      const token = response?.data?.data?.tokens?.accessToken;
      if (token) {
        sessionStorage.setItem("userData", token);
      }
  
      return response.data;
    } catch (error) {
      return handleApiError(error);
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
    findChatByUserId,
    findAllUserChat,
    findUserUnreadMessageCount,
    SendMessage,
    UpDateReadStatus,
  };
  
  export default messageServices;
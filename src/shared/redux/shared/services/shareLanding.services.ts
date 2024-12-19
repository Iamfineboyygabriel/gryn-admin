

import axios from "axios";
import socket from "../../../../socket/socket";
const API_URL_LOGIN_USER = process.env.REACT_APP_API_URL + "/auth/login";
const API_URL_LOGOUT_USER = process.env.REACT_APP_API_URL + "/auth/logout";

interface SubmitBankDetailsParams {
  accountNumber: string;
  accountName: string;
  bankCode: string;
  bankName: string;
}

interface LogoutRequestBody {
  id: string;
}

const loginUser = async (body: any) => {
  try {
    const response = await axios.post(API_URL_LOGIN_USER, body);
    const token = response?.data?.data?.tokens?.accessToken;
    if (token) {
      socket.auth = { token };
      socket.disconnect();
      socket.connect();
      sessionStorage.setItem("userData", token);
    } else {
      socket.disconnect();
      console.error("Token not found in response data:", response.data);
    }

    return response?.data;
  } catch (error: any) {
    if (!error.response) {
      throw new Error("Network Error: Please check your internet connection.");
    }
    throw error.response.data;
  }
};

export const ResetPassword = async (
  token: string,
  email: string,
  password: { password: string }
) => {
  const url = `${process.env.REACT_APP_API_URL}/auth/reset-password?token=${token}&email=${email}`;
  try {
    const response = await axios({
      url,
      method: "post",
      data: password,
    });
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
  { accountNumber, accountName, bankCode, bankName }: SubmitBankDetailsParams
) => {
  const url = `${
    process.env.REACT_APP_API_URL
  }/auth/bankInfo?email=${encodeURIComponent(email)}`;
  try {
    const response = await axios.post(url, {
      accountNumber,
      accountName,
      bankCode,
      bankName,
    });
    return response.data;
  } catch (error: any) {
    if (!error.response) {
      throw new Error("Network Error: Please check your internet connection.");
    }
    throw error.response.data;
  }
};

export const logOutUser = async (userId: string) => {
  try {
    const body: LogoutRequestBody = {
      id: userId,
    };

    const response = await axios.post(API_URL_LOGOUT_USER, body);

    const token = response?.data?.data?.tokens?.accessToken;
    if (token) {
      sessionStorage.setItem("userData", token);
    } else {
      console.error("Token not found in response data:", response.data);
    }

    return response?.data;
  } catch (error: any) {
    if (!error.response) {
      throw new Error("Network Error: Please check your internet connection.");
    }
    throw error.response.data;
  }
};

const sharedLandingServices = {
  loginUser,
  ResetPassword,
  logOutUser,
};

export default sharedLandingServices;

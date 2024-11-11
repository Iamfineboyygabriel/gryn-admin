import axios from "axios";
import { UseSocket } from "../../../../context/SocketContext";
// import { useSocket } from "../../../../context/SocketContext";
const API_URL_LOGIN_USER = process.env.REACT_APP_API_URL + "/auth/login";

interface SubmitBankDetailsParams {
  accountNumber: string;
  accountName: string;
  bankCode: string;
  bankName:string;
}

const {connectSocket} = UseSocket()

const loginUser = async (body: any) => {
  try {
    const response = await axios.post(API_URL_LOGIN_USER, body);

    const token = response?.data?.data?.tokens?.accessToken;
    if (token) {
      sessionStorage.setItem("userData", token);
      connectSocket(token)
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

export const ResetPassword = async (token: string, email: string, password: { password: string }) => {
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
  { accountNumber, accountName, bankCode, bankName }: SubmitBankDetailsParams,
) => {
  const url = `${process.env.REACT_APP_API_URL}/auth/bankInfo?email=${encodeURIComponent(email)}`;
  try {
    const response = await axios.post(
      url,
      {
        accountNumber,
        accountName,
        bankCode,
        bankName,
      }
    );
    return response.data;
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
};



export default sharedLandingServices;
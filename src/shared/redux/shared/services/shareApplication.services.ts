import axios from "axios";
import authHeader from "../../headers";

const API_URL_UPLOAD_AVATAR =
  process.env.REACT_APP_API_URL + "/media/upload-avatar";

const API_URL_CREATE_APPLICATION =
  process.env.REACT_APP_API_URL + "/admin/application";

const API_URL_CREATE_VISA_APPLICATION = process.env.REACT_APP_API_URL + "/visa";

const API_URL_CREATE_INVOICE = process.env.REACT_APP_API_URL + "/invoice";

const API_URL_CREATE_DRAFT = process.env.REACT_APP_API_URL + "/invoice/draft";

const API_URL_CREATE_STUDENT = process.env.REACT_APP_API_URL + "/admin/users/student";

interface UpdateProfile {
  email?: string;
  firstName?: string;
  lastName?: string;
}

interface UpdatePassword {
  oldPassword: string;
  newPasssword: string;
}

interface UpdateApplication {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: String;
  state?: string;
  localGovtArea?: string;
  country?: string;
  internationalPassportNumber?: string;
  degreeType?: string;
}

interface UpdateDegree {
  country?: string;
  university?: string;
  degreeType?: string;
  course?: string;
}

interface CreateApplicationBody {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  state?: string;
  localGovtArea?: string;
  country: CustomCountry | null;
  internationalPassportNumber?: string;
  degreeType?: string;
  course?: string;
  university?: string;
}

type CustomCountry = {
  cca2: string;
  name: string;
};

interface UpdateStudentBody {
  email?: string;
  firstName?: string;
  lastName?: string;
  middleName?:string;
}

const handleApiError = (error: any) => {
  if (!error.response) {
    throw new Error("Network Error: Please check your internet connection.");
  }
  throw error.response.data || error;
};

const getUserProfile = async () => {
  const url = `${process.env.REACT_APP_API_URL}/users/profile`;
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

const getCurrentUser = async () => {
  const url = `${process.env.REACT_APP_API_URL}/users`;
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

const uploadAvatar = async (body: any) => {
  try {
    const response = await axios.post(API_URL_UPLOAD_AVATAR, body, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("userData")}`,
      },
    });
    if (response?.data) {
      return response.data;
    } else {
      throw new Error("Unexpected response structure");
    }
  } catch (error: any) {
    if (!error.response) {
      throw new Error("Network Error: Please check your internet connection.");
    }
    throw error.response.data;
  }
};

const updateProfile = async (body: UpdateProfile) => {
  const url = `${process.env.REACT_APP_API_URL}/users/profile`;
  try {
    const response = await axios({
      url,
      headers: authHeader(),
      method: "patch",
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

const updatePassword = async (body: UpdatePassword) => {
  const url = `${process.env.REACT_APP_API_URL}/users/change-password`;
  try {
    const response = await axios({
      url,
      headers: authHeader(),
      method: "patch",
      data: body,
    });
    const token = response.data.data?.accessTokenEncrypt;
    if (token) {
      sessionStorage.setItem("userData", token);
    }
    return response.data;
  } catch (error: any) {
    handleApiError(error);
  }
};

export const getStudentApplication = async (endpoint: any) => {
  const url = `${process.env.REACT_APP_API_URL}${endpoint}`;
  try {
    const response = await axios.get(url, {
      headers: authHeader(),
    });
    const token = response?.data?.data?.tokens?.accessToken;
    if (token) {
      sessionStorage.setItem("userData", token);
    }
    return response.data;
  } catch (error: any) {
    handleApiError(error);
  }
};

export const updateApplication = async (
  id: string,
  body: UpdateApplication
) => {
  const url = `${process.env.REACT_APP_API_URL}/application/${id}`;
  try {
    const response = await axios({
      url,
      headers: authHeader(),
      method: "patch",
      data: body,
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

export const updateDegree = async (id: string, body: UpdateDegree) => {
  const url = `${process.env.REACT_APP_API_URL}/application/degree/${id}`;
  try {
    const response = await axios({
      url,
      headers: authHeader(),
      method: "patch",
      data: body,
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

export const updateApplicationDocument = async (
  endpoint: string,
  formData: FormData
) => {
  const url = `${process.env.REACT_APP_API_URL}${endpoint}`;
  try {
    const response = await axios({
      url,
      headers: {
        ...authHeader(),
        "Content-Type": "multipart/form-data",
      },
      method: "patch",
      data: formData,
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

const createVisaApplication = async (body: any) => {
  try {
    const token = sessionStorage.getItem("userData");
    const response = await axios.post(API_URL_CREATE_VISA_APPLICATION, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }catch (error: any) {
    handleApiError(error);
  }
};

export async function uploadApplication(endpoint: string, body: FormData) {
  const url = `${process.env.REACT_APP_API_URL}${endpoint}`;
  try {
    const token = sessionStorage.getItem("userData");
    const headers = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const response = await axios.post(url, body, { headers });
    return response.data;
  } catch (error: any) {
    if (!error.response) {
      throw new Error("Network Error: Please check your internet connection.");
    }
    throw error.response.data;
  }
}

const getTopCountries = async () => {
  const url = `${process.env.REACT_APP_API_URL}/admin/application/top-countries`;
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

const getTopUniversities = async () => {
  const url = `${process.env.REACT_APP_API_URL}/admin/application/top-universities`;
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

const getAllStudents = async (page: number, limit: number) => {
  const url = `${process.env.REACT_APP_API_URL}/admin/users/students?page=${page}&limit=${limit}`;
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

const getAllAgents = async (page: number, limit: number, search: string = '') => {
  const url = `${process.env.REACT_APP_API_URL}/admin/users/agents?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
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



const createInvoice = async (body: any) => {
  try {
    const token = sessionStorage.getItem("userData");
    const response = await axios.post(API_URL_CREATE_INVOICE, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    handleApiError(error);
  }
};

const createDraft = async (body: any) => {
  try {
    const token = sessionStorage.getItem("userData");
    const response = await axios.post(API_URL_CREATE_DRAFT, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    handleApiError(error);
  }
};

const getAllDraftItems = async (page: number, limit: number) => {
  const url = `${process.env.REACT_APP_API_URL}/invoice/draft/items?page=${page}&limit=${limit}`;
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

const getAllInvoice = async (page: number, limit: number) => {
  const url = `${process.env.REACT_APP_API_URL}/invoice?page=${page}&limit=${limit}`;
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

export const getSingleStudentApplication = async (endpoint: any) => {
  const url = `${process.env.REACT_APP_API_URL}${endpoint}`;
  try {
    const response = await axios.get(url, {
      headers: authHeader(),
    });
    const token = response?.data?.data?.tokens?.accessToken;
    if (token) {
      sessionStorage.setItem("userData", token);
    }
    return response.data;
  } catch (error: any) {
    if (!error.response) {
      throw new Error("Network Error: Please check your internet connection.");
    }
    throw error.response.data;
  }
};

const createApplication = async (body: CreateApplicationBody) => {
  try {
    const token = sessionStorage.getItem("userData");
    const response = await axios.post(API_URL_CREATE_APPLICATION, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    if (!error.response) {
      throw new Error("Network Error: Please check your internet connection.");
    }
    throw new Error(error.response.data.message || "An error occurred.");
  }
};

const getStudentUniversities = async () => {
  const url = `${process.env.REACT_APP_API_URL}/application/student/university`;
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
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch universities"
    );
  }
};

const getAllVisaApplication = async (page: number, limit: number, search: string = '') => {
  const url = `${process.env.REACT_APP_API_URL}/visa?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
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

const getAllPendingAgents = async (page: number, limit: number, search: string = '') => {
  const url = `${process.env.REACT_APP_API_URL}/admin/users/pending/agents?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
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

const createStudent = async (body: any) => {
  try {
    const token = sessionStorage.getItem("userData");
    const response = await axios.post(API_URL_CREATE_STUDENT, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    handleApiError(error);
  }
};


const findStudentByEmail = async (email: string) => {
  const url = `${process.env.REACT_APP_API_URL}/admin/users/students/email`;
  try {
    const response = await axios({
      url,
      method: "get",
      headers: authHeader(),
      params: { email }, 
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

const updateStudentCreated = async (body: UpdateStudentBody, userId: string) => {
  const url = `${process.env.REACT_APP_API_URL}/admin/users/students/${userId}`;
  try {
    const response = await axios({
      url,
      headers: authHeader(),
      method: "patch",
      data: body,
    });
    const token = response?.data?.data?.tokens?.accessToken;
    if (token) {
      sessionStorage.setItem("userData", token);
    }
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

const shareApplicationServices = {
  getUserProfile,
  uploadAvatar,
  updateProfile,
  updatePassword,
  getCurrentUser,
  updateApplication,
  updateDegree,
  updateApplicationDocument,
  createVisaApplication,
  uploadApplication,
  getTopCountries,
  getTopUniversities,
  getAllStudents,
  getAllAgents,
  createInvoice,
  createDraft,
  getAllDraftItems,
  getAllInvoice,
  getSingleStudentApplication,
  createApplication,
  getStudentUniversities,
  getAllVisaApplication,
  getAllPendingAgents,
  createStudent,
  findStudentByEmail,
  updateStudentCreated,
};

export default shareApplicationServices;

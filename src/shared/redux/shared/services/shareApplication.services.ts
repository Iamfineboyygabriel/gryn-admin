import axios from "axios";
import authHeader from "../../headers";

const API_URL_UPLOAD_AVATAR =
  process.env.REACT_APP_API_URL + "/media/upload-avatar";

const API_URL_CREATE_APPLICATION =
  process.env.REACT_APP_API_URL + "/admin/application";

const API_URL_CREATE_VISA_APPLICATION = process.env.REACT_APP_API_URL + "/visa";

const API_URL_CREATE_INVOICE = process.env.REACT_APP_API_URL + "/invoice";

const API_URL_CREATE_INVOICE_PAYMENT_STAFF = process.env.REACT_APP_API_URL + "/invoice/payment";

const API_URL_CREATE_BUDGET = process.env.REACT_APP_API_URL + "/budget";

const API_URL_CREATE_DRAFT = process.env.REACT_APP_API_URL + "/invoice/draft";

const API_URL_CREATE_STUDENT = process.env.REACT_APP_API_URL + "/admin/users/student";

const API_URL_CREATE_STAFF = process.env.REACT_APP_API_URL + "/admin/users/staff";

const API_URL_CREATE_ADMIN = process.env.REACT_APP_API_URL + "/admin/users/admin";

const API_URL_UPDATE_ROLE = process.env.REACT_APP_API_URL + "/admin/users/role";

const API_URL_CREATE_AGENT = process.env.REACT_APP_API_URL + "/admin/users/agent";

const API_URL_FINDSTUDENTBY_EMAIL_UNIVERSITY_DEGREE = process.env.REACT_APP_API_URL + "/admin/application/byNameUniversityAndDegree";

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

interface UpdateStaff {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  gender?: string;
}


interface UpdateDegree {
  country?: string;
  university?: string;
  course?:string;
  degreeType?: string;
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

interface CreateVisaApplicationBody {
  firstName: string;
  lastName: string;
  otherName?: string;
  email: string;
  passportNumber: string;
  issuedDate: string;
  expiryDate: string;
  destination: string | null;
  agentEmail: string;
  schoolName: string;
}

type CustomCountry = {
  cca2: string;
  name: string;
};

interface UpdateStudentBody {
  firstName?: string;
  lastName?: string;
  // middleName?:string;
}

interface UpdateBankDetailsBody {
  bankCode?: string;
  accountName?: string;
  accountNumber?:string;
}

interface BudgetParams {
  page: number;
  limit: number;
  status?: string;
  search?: string;
  month?: string;
  sort?: string;
}

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

export const getVisaApplicationDetails = async (endpoint: any) => {
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

const createVisaApplication = async (body: CreateVisaApplicationBody) => {
  try {
    const token = sessionStorage.getItem("userData");
    const response = await axios.post(API_URL_CREATE_VISA_APPLICATION, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.log("services error",error)
    if (!error.response) {
      throw new Error("Network Error: Please check your internet connection.");
    }
    throw new Error(error.response.data.message || "An error occurred.");
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

const createInvoicePaymentForStaff = async (body: any) => {
  try {
    const token = sessionStorage.getItem("userData");
    const response = await axios.post(API_URL_CREATE_INVOICE_PAYMENT_STAFF, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    handleApiError(error);
  }
};

const createBudget = async (body: any) => {
  try {
    const token = sessionStorage.getItem("userData");
    const response = await axios.post(API_URL_CREATE_BUDGET, body, {
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

export const getSingleAgentApplication = async (endpoint: any) => {
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

const createAgent = async (body: any) => {
  try {
    const token = sessionStorage.getItem("userData");
    const response = await axios.post(API_URL_CREATE_AGENT, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    handleApiError(error);
  }
};

const createStaff = async (body: any) => {
  try {
    const token = sessionStorage.getItem("userData");
    const response = await axios.post(API_URL_CREATE_STAFF, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    handleApiError(error);
  }
};

const createAdmin = async (body: any) => {
  try {
    const token = sessionStorage.getItem("userData");
    const response = await axios.post(API_URL_CREATE_ADMIN, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    handleApiError(error);
  }
};

const updateRole = async (body: any) => {
  try {
    const token = sessionStorage.getItem("userData");
    const response = await axios.patch(API_URL_UPDATE_ROLE, body, {
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

const findAgentByEmail = async (email: string) => {
  const url = `${process.env.REACT_APP_API_URL}/admin/users/agent/email`;
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

const findStaffByEmail = async (email: string) => {
  const url = `${process.env.REACT_APP_API_URL}/admin/users/staff/find/email`;
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

const updateAgentCreated = async (body: UpdateStudentBody, userId: string) => {
  const url = `${process.env.REACT_APP_API_URL}/admin/users/agent/${userId}`;
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

const updateAgentBankDetails = async (body: UpdateBankDetailsBody) => {
  const url = `${process.env.REACT_APP_API_URL}/admin/users/bank_details`;
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

const findStudentByEmailUniversityDegree = async (body: any) => {
  try {
    const token = sessionStorage.getItem("userData");
    const response = await axios.post(API_URL_FINDSTUDENTBY_EMAIL_UNIVERSITY_DEGREE, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    handleApiError(error);
  }
};

export const updateStudentApplication = async (
  id: string,
  body: UpdateApplication,
) => {
  const url = `${process.env.REACT_APP_API_URL}/admin/application/${id}`;
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

export const updateStaff = async (
  id: string,
  body: UpdateStaff,
) => {
  const url = `${process.env.REACT_APP_API_URL}/admin/users/staff/${id}`;
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

export const updateStudentDegreeApplication = async (
  id: string,
  body: UpdateDegree,
) => {
  const url = `${process.env.REACT_APP_API_URL}/admin/application/degree/${id}`;
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

export const updateDocumentStatus = async (id: string, remark: string) => {
  const url = `${process.env.REACT_APP_API_URL}/media/document/${id}?remark=${remark}`;
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

export const approveAgent = async (userID: string) => {
  const url = `${process.env.REACT_APP_API_URL}/admin/users/approve/agent/${userID}`;
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
    throw handleApiError(error);
  }
};

export const rejectAgent = async (userID: string) => {
  const url = `${process.env.REACT_APP_API_URL}/admin/users/reject/agent/${userID}`;
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
    throw handleApiError(error);
  }
};

export async function uploadVisaApplicationDocument(endpoint: string, body: FormData) {
  const url = `${process.env.REACT_APP_API_URL}${endpoint}`;
  try {
    const token = sessionStorage.getItem("userData");
    const headers = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const response = await axios.post(url, body, { headers });
    return response.data;
  } catch (error: any) {
    handleApiError(error);
  }
}

const getAllBudget = async ({
  page,
  limit,
  status = '',
  search = '',
  month = '',
  sort = ''
}: BudgetParams) => {
  const url = new URL(`${process.env.REACT_APP_API_URL}/budget`);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('limit', limit.toString());
  if (status) url.searchParams.append('status', status);
  if (search) url.searchParams.append('search', search);
  if (month) url.searchParams.append('month', month);
  if (sort) url.searchParams.append('sort', sort);

  try {
    const response = await axios({
      url: url.toString(),
      headers: authHeader(),
      method: 'get',
    });

    const token = response?.data?.data?.tokens?.accessToken;
    if (token) {
      sessionStorage.setItem('userData', token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDraftItemById = async (endpoint: any) => {
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

export const updateRegistrationUploadedDocument = async (
  endpoint: string,
  formData: FormData,
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

export const getAccountInfo = async (code: number, account_number:string) => {
  const url = `${process.env.REACT_APP_API_URL}/auth/bank/accountInfo`;
  try {
    const response = await axios({
      url,
      method: "get",
      headers: authHeader(),
      params: { code,account_number }, 
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

export const findStaffDetailByEmail = async (endpoint:any) => {
  const url = `${process.env.REACT_APP_API_URL}${endpoint}`;
  try {
    const response = await axios({
      url,
      method: "get",
      headers: authHeader(),
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

export const findAdminDetailByEmail = async (endpoint:any) => {
  const url = `${process.env.REACT_APP_API_URL}${endpoint}`;
  try {
    const response = await axios({
      url,
      method: "get",
      headers: authHeader(),
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

export const updateStaffRegistrationDocument = async (
  endpoint: string,
  formData: FormData,
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

export const findStaffAssignedAgent = async (endpoint:any) => {
  const url = `${process.env.REACT_APP_API_URL}${endpoint}`;
  try {
    const response = await axios({
      url,
      method: "get",
      headers: authHeader(),
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

export const findStaffInvoices = async (endpoint:any) => {
  const url = `${process.env.REACT_APP_API_URL}${endpoint}`;
  try {
    const response = await axios({
      url,
      method: "get",
      headers: authHeader(),
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

export async function uploadPayment(endpoint: string, body: FormData) {
  const url = `${process.env.REACT_APP_API_URL}${endpoint}`;
  try {
    const token = sessionStorage.getItem("userData");
    const headers = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const response = await axios.post(url, body, { headers });
    return response.data;
  } catch (error: any) {
    handleApiError(error);
  }
}

const getAllApplicationPayment = async (page: number, limit: number, search: string = '') => {
  const url = `${process.env.REACT_APP_API_URL}/admin/application/payment?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
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


const uploadApplicationCommissionPayment = async (
  applicationId: string,
  data: FormData
) => {
  const url = `${process.env.REACT_APP_API_URL}/media/application/${applicationId}/commission`;
  try {
    const response = await axios({
      url,
      headers: {
        ...authHeader(),
        "Content-Type": "multipart/form-data",
      },
      method: "post",
      data: data,
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

export const approveInvoiceAdmin = async (invoiceID: string) => {
  const url = `${process.env.REACT_APP_API_URL}/invoice/complete/${invoiceID}`;
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
    throw handleApiError(error);
  }
};


export const approveInvoiceSuperAdmin = async (invoiceID: string) => {
  const url = `${process.env.REACT_APP_API_URL}/invoice/approve/${invoiceID}`;
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
    throw handleApiError(error);
  }
};


export const approveBudgetAdmin = async (budgetID: string) => {
  const url = `${process.env.REACT_APP_API_URL}/budget/complete/${budgetID}`;
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
    throw handleApiError(error);
  }
};


export const approveBudgetSuperAdmin = async (budgetID: string) => {
  const url = `${process.env.REACT_APP_API_URL}/budget/approve/${budgetID}`;
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
    throw handleApiError(error);
  }
};


const uploadStaffInvoicePaymentDocument = async (
  invoiceId: string,
  data: FormData
) => {
  const url = `${process.env.REACT_APP_API_URL}/media/invoice/upload-doc/${invoiceId}`;
  try {
    const response = await axios({
      url,
      headers: {
        ...authHeader(),
        "Content-Type": "multipart/form-data",
      },
      method: "post",
      data: data,
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


const budgetUploadPaymentDocument = async (
  budgetId: string,
  data: FormData
) => {
  const url = `${process.env.REACT_APP_API_URL}/media/budget/upload-doc/${budgetId}`;
  try {
    const response = await axios({
      url,
      headers: {
        ...authHeader(),
        "Content-Type": "multipart/form-data",
      },
      method: "post",
      data: data,
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

const getAllStaffPayment = async (id:string, page: number, limit: number) => {
  const url = `${process.env.REACT_APP_API_URL}/admin/users/staff/${id}/payments?page=${page}&limit=${limit}`;
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

const CreateSalary = async (staffId:any, body:any) => {
  const url = `${process.env.REACT_APP_API_URL}/admin/users/salary/${staffId}`;
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

const getStaffSalary = async (id:string, page: number,) => {
  const url = `${process.env.REACT_APP_API_URL}/admin/users/salary/${id}?page=${page}`;
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

const getAgentCommission = async (id:string) => {
  const url = `${process.env.REACT_APP_API_URL}/admin/application/agent/commission/${id}`;
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

const UpdatePagePermission = async (email: string, body: any) => {
  const url = `${process.env.REACT_APP_API_URL}/admin/users/pagePermission?email=${email}`; 

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

const getUserPermittedPages = async (id:string) => {
  const url = `${process.env.REACT_APP_API_URL}/admin/users/staff/page/${id}`;
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
  createAgent,
  updateAgentCreated,
  findAgentByEmail,
  findStudentByEmailUniversityDegree ,
  updateStudentApplication,
  updateDocumentStatus,
  approveAgent,
  rejectAgent,
  updateAgentBankDetails,
  uploadVisaApplicationDocument,
  getVisaApplicationDetails,
  getAllBudget,
  createBudget,
  findStaffByEmail,
  getDraftItemById,
  updateRegistrationUploadedDocument,
  getAllApplicationPayment,
  createStaff,
  createInvoicePaymentForStaff,
  uploadApplicationCommissionPayment,
  createAdmin,
  approveInvoiceAdmin,
  updateRole,
  uploadStaffInvoicePaymentDocument,
  getAllStaffPayment,
  CreateSalary,
  getStaffSalary,
  getAgentCommission,
  UpdatePagePermission,
  getUserPermittedPages,
  budgetUploadPaymentDocument,
};

export default shareApplicationServices;

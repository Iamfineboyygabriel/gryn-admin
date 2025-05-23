import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { setMessage } from "../../message.slices";
import applicationServices from "../services/application.services";

interface BankDetails {
  accountNumber: string;
  accountName: string;
  bankCode: string;
  bankName: string;
}

interface AgentDetails {
  firstName: string;
  lastName: string;
  gender: string;
  middleName: string;
}

export const getStats = createAsyncThunk("application/getStats", async () => {
  try {
    const data = await applicationServices.getStats();
    return data;
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    throw new Error(message);
  }
});

export const getStaffDashboardStats = createAsyncThunk(
  "application/getStaffDashboardStats",
  async () => {
    try {
      const data = await applicationServices.getStaffDashboardStats();
      return data;
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      throw new Error(message);
    }
  }
);

export const getAllApplication = createAsyncThunk(
  "application/getAllApplication",
  async ({
    page,
    limit,
    search,
    sort,
    status,
  }: {
    page: number;
    limit: number;
    search: string;
    sort: string;
    status: string;
  }) => {
    const response = await applicationServices.getAllApplication(
      page,
      limit,
      search,
      sort,
      status
    );
    return {
      applications: response.data.applications,
      totalPages: response.data.totalPages,
      currentPage: page,
    };
  }
);

export const getAllDirectApplication = createAsyncThunk(
  "application/getAllDirectApplication",
  async ({
    page,
    limit,
    search,
    sort,
    status,
    isDirect,
  }: {
    page: number;
    limit: number;
    search: string;
    sort: string;
    status: string;
    isDirect: any;
  }) => {
    const response = await applicationServices.getAllDirectApplication(
      page,
      limit,
      search,
      sort,
      status,
      isDirect
    );
    return {
      applications: response.data.applications,
      totalPages: response.data.totalPages,
      currentPage: page,
    };
  }
);

export const getAllStudents = createAsyncThunk(
  "application/getAllStudents",
  async ({
    page,
    limit,
    search,
  }: {
    page: number;
    limit: number;
    search: string;
  }) => {
    const response = await applicationServices.getAllStudents(
      page,
      limit,
      search
    );
    return {
      students: response.data,
      totalPages: response.data.totalPages,
      currentPage: page,
    };
  }
);

export const getTopAgentCommission = createAsyncThunk(
  "application/getTopAgentCommission ",
  async ({ page, limit }: { page: number; limit: number }) => {
    const response = await applicationServices.getTopAgentCommission(
      page,
      limit
    );
    return {
      topAgentCommission: response.data,
      totalPages: response.data.totalPages,
      currentPage: page,
    };
  }
);

export const getAllPendingApplication = createAsyncThunk(
  "application/getAllPendingApplication",
  async ({
    page,
    limit,
    search,
  }: {
    page: number;
    limit: number;
    search: string;
  }) => {
    const response = await applicationServices.getAllPendingApplication(
      page,
      limit,
      search
    );
    return {
      applications: response.data,
      totalPages: response.data.totalPages,
      currentPage: page,
    };
  }
);

export const getActivity = createAsyncThunk(
  "application/getActivity",
  async ({ page, limit }: { page: number; limit: number }, thunkAPI) => {
    try {
      const data = await applicationServices.getActivity(page, limit);
      return data;
    } catch (error: any) {
      const message = error.message;
      error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getUserActivity = createAsyncThunk(
  "application/getUserActivity",
  async (
    { userId, page, limit }: { userId: string; page: number; limit: number },
    thunkAPI
  ) => {
    try {
      const data = await applicationServices.getUserActivity(
        userId,
        page,
        limit
      );
      return data;
    } catch (error: any) {
      const message = error.message;
      error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addNewSchool = createAsyncThunk(
  "application/addNewSchool",
  async (body: any, thunkAPI) => {
    try {
      const data = await applicationServices.addNewSchool(body);
      return data;
    } catch (error: any) {
      const message = error;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllStudentEmail = createAsyncThunk(
  "application/getAllStudentEmail",
  async (_, thunkAPI) => {
    try {
      const response = await applicationServices.getAllStudentEmail();
      return {
        studentsEmail: response.data,
      };
    } catch (error: any) {
      const message = error.message || "An error occurred";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllAgentEmail = createAsyncThunk(
  "application/getAllAgentEmail",
  async (_, thunkAPI) => {
    try {
      const response = await applicationServices.getAllAgentsEmail();
      return {
        agentsEmail: response.data,
      };
    } catch (error: any) {
      const message = error.message || "An error occurred";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllStaffEmail = createAsyncThunk(
  "application/getAllStaffEmail",
  async (_, thunkAPI) => {
    try {
      const response = await applicationServices.getAllStaffEmail();
      return {
        staffEmail: response.data,
      };
    } catch (error: any) {
      const message = error.message || "An error occurred";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllAdminsEmail = createAsyncThunk(
  "application/getAllAdminsEmail",
  async (_, thunkAPI) => {
    try {
      const response = await applicationServices.getAllAdminsEmail();
      return {
        adminsEmail: response.data,
      };
    } catch (error: any) {
      const message = error.message || "An error occurred";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllSchoolsListCountries = createAsyncThunk(
  "application/getAllSchoolsListCountries",
  async (_, thunkAPI) => {
    try {
      const response = await applicationServices.getAllSchoolsListCountries();
      return {
        listSchools: response.data,
      };
    } catch (error: any) {
      const message = error.message || "An error occurred";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllStaffForSuperAdmin = createAsyncThunk(
  "application/getAllStaffForSuperAdmin",
  async ({
    page,
    limit,
    search,
  }: {
    page?: number;
    limit?: number;
    search: string;
  }) => {
    const response = await applicationServices.getAllStaffForSuperAdmin(
      page,
      limit,
      search
    );
    return {
      staffs: response,
      totalPages: response.totalPages || 0,
      currentPage: page || 1,
    };
  }
);

export const assignAgentToStaff = createAsyncThunk(
  "application/assignAgentToStaff",
  async ({ agentId, email }: { agentId: string; email: string }, thunkAPI) => {
    try {
      const data = await applicationServices.assignAgentToStaff(agentId, email);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const assignApplicationToStaff = createAsyncThunk(
  "application/assignApplicationToStaff",
  async (
    { applicationId, email }: { applicationId: string; email: string },
    thunkAPI
  ) => {
    try {
      const data = await applicationServices.assignApplicationToStaff(
        applicationId,
        email
      );
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const assignApplicationToAgent = createAsyncThunk(
  "application/assignApplicationToAgent",
  async (
    {
      applicationId,
      agentEmail,
      staffEmail,
    }: { applicationId: string; agentEmail: string; staffEmail: string },
    thunkAPI
  ) => {
    try {
      const data = await applicationServices.assignApplicationToAgent(
        applicationId,
        agentEmail,
        staffEmail
      );
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getAllBanks = createAsyncThunk(
  "application/getAllBanks",
  async (_, thunkAPI) => {
    try {
      const data = await applicationServices.getAllBanks();
      return data;
    } catch (error: any) {
      const message = error?.message || "Failed to fetch banks";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllAdminForSuperAdmin = createAsyncThunk(
  "application/getAllAdminForSuperAdmin",
  async ({
    page,
    limit,
    search,
  }: {
    page?: number;
    limit?: number;
    search: string;
  }) => {
    const response = await applicationServices.getAllAdminForSuperAdmin(
      page,
      limit,
      search
    );
    return {
      admins: response,
      totalPages: response.totalPages || 0,
      currentPage: page || 1,
    };
  }
);

export const getAllStaffSalaryPayment = createAsyncThunk(
  "application/ getAllStaffSalaryPayment",
  async ({
    page,
    limit,
    search,
    status,
  }: {
    page: number;
    limit: number;
    search: string;
    status: string;
  }) => {
    const response = await applicationServices.getAllStaffSalaryPayment(
      page,
      limit,
      search
    );
    return {
      payments: response.data,
      totalPages: response.data.totalPages,
      currentPage: page || 1,
    };
  }
);

export const getAdminApplicationStatsBar = createAsyncThunk(
  "application/getAdminApplicationStatsBar",
  async ({ days }: { days: number }) => {
    const response = await applicationServices.getAdminApplicationStatsBar(
      days
    );
    return response.data;
  }
);

export const getAdminEnquiresStats = createAsyncThunk(
  "application/getAdminEnquiresStats",
  async (_, thunkAPI) => {
    try {
      const data = await applicationServices.getAdminEnquiresStats();
      return data;
    } catch (error: any) {
      const message = error?.message || "Failed to fetch enquires";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAdminApexChartStats = createAsyncThunk(
  "application/getApexChartStats",
  async ({
    month,
    year,
    status,
  }: {
    month: number;
    year: number;
    status: string;
  }) => {
    const response = await applicationServices.getAdminApexChartStats(
      month,
      year,
      status
    );
    return response;
  }
);

export const updateApplicationToCompleted = createAsyncThunk(
  "application/updateApplicationToCompleted",
  async (
    { body, applicationId }: { body: any; applicationId: any },
    thunkAPI
  ) => {
    try {
      const data = await applicationServices.updateApplicationToCompleted(
        body,
        applicationId
      );
      return data;
    } catch (error: any) {
      error.toString();
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateUserBankDetails = createAsyncThunk(
  "application/updateBankDetails",
  async (
    { id, details }: { id: string; details: BankDetails },
    { dispatch }
  ) => {
    const response = await applicationServices.updateUserBankDetails(
      id,
      details
    );
    dispatch(setMessage(response));
    return response;
  }
);

export const updateAgent = createAsyncThunk(
  "application/updateAgent",
  async (
    { id, details }: { id: string; details: AgentDetails },
    { dispatch }
  ) => {
    const response = await applicationServices.updateAgent(id, details);
    dispatch(setMessage(response));
    return response;
  }
);

export const getAllEnquiry = createAsyncThunk(
  "application/getAllEnquiry",
  async ({
    page,
    limit,
    search,
  }: {
    page?: number;
    limit?: number;
    search: string;
  }) => {
    const response = await applicationServices.getAllEnquiry(
      page,
      limit,
      search
    );
    return {
      enq: response,
      totalPages: response.totalPages || 0,
      currentPage: page || 1,
    };
  }
);

export const assignEnquiryToStaff = createAsyncThunk(
  "application/assignEnquiryToStaff",
  async ({ id, email }: { id: string; email: string }, thunkAPI) => {
    try {
      const data = await applicationServices.assignEnquiryToStaff(id, email);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const clearStaffPayment = createAsyncThunk(
  "application/clearStaffPayment",
  async () => {
    return null;
  }
);

interface ApplicationState {
  allApplication: {
    applications: any[];
    totalPages: number;
    currentPage: number;
  };
  allDirect: {
    applications: any[];
    totalPages: number;
    currentPage: number;
  };
  allStaffPayments: {
    payments: any[];
    totalPages: number;
    currentPage: number;
  };
  allStudents: {
    students: any[];
    totalPages: number;
    currentPage: number;
  };
  allAgentCommission: {
    topAgentCommission: any[];
    totalPages: number;
    currentPage: number;
  };
  allPendingApplication: {
    applications: any[];
    totalPages: number;
    currentPage: number;
  };
  getStats: any;
  getBarChatStats: any;
  getEnquiriesChatStats: any;
  getApexChatStats: any;
  getStaffStats: any;
  markCompleted: null;
  registerSchool: null;
  assignAgent: null;
  assignApplicationStaff: null;
  assignEnquiryStaff: null;
  assignApplicationAgent: null;
  allBanks: null;
  allStaff: {
    staffs: any[] | null;
    totalPages: number;
    currentPage: number;
  };
  allAdmin: {
    admins: any[] | null;
    totalPages: number;
    currentPage: number;
  };
  allStudentsEmail: {
    studentsEmail: any[];
  };
  allStaffEmail: {
    staffEmail: any[];
  };
  allAgentsEmail: {
    agentsEmail: any[];
  };
  allAdminsEmail: {
    adminsEmail: any[];
  };
  allSchoolList: {
    listSchools: any[];
  };
  loading: boolean;
  error: string | null;
  allApplicationSearchTerm: string;
  allEnquirySearchTerm: string;
  allDirectApplicationSearchTerm: string;
  allDirectApplicationIsDirectTerm: any;
  allSalarySearchTerm: string;
  allStudentsSearchTerm: string;
  allPendingApplicationSearchTerm: string;
  allApplicationSortTerm: string;
  allDirectApplicationSortTerm: string;
  allStaffSearchTerm: string;
  allAdminSearchTerm: string;
  allActivity: {
    data: any[];
    currentPage: number;
  };
  allEnq: {
    enq: any[] | null;
    totalPages: number;
    currentPage: number;
  };
  allUserActivity: {
    data: any[];
    currentPage: number;
  };
  addSchool: null;
  allApplicationStatusTerm: string;
  allDirectApplicationStatusTerm: string;
  bankDetails: BankDetails | null;
  agentDetails: AgentDetails | null;
}

const initialState: ApplicationState = {
  getStats: null,
  getBarChatStats: null,
  getEnquiriesChatStats: null,
  getApexChatStats: null,
  getStaffStats: null,
  markCompleted: null,
  registerSchool: null,
  assignAgent: null,
  assignApplicationStaff: null,
  assignEnquiryStaff: null,
  assignApplicationAgent: null,
  allApplicationSortTerm: "",
  allDirectApplicationSortTerm: "",
  allBanks: null,
  allStaff: {
    staffs: [],
    totalPages: 0,
    currentPage: 1,
  },
  allAdmin: {
    admins: [],
    totalPages: 0,
    currentPage: 1,
  },
  allApplication: {
    applications: [],
    totalPages: 0,
    currentPage: 1,
  },
  allDirect: {
    applications: [],
    totalPages: 0,
    currentPage: 1,
  },
  allStaffPayments: {
    payments: [],
    totalPages: 0,
    currentPage: 1,
  },
  allStudents: {
    students: [],
    totalPages: 0,
    currentPage: 1,
  },
  allAgentCommission: {
    topAgentCommission: [],
    totalPages: 0,
    currentPage: 1,
  },
  allStudentsEmail: {
    studentsEmail: [],
  },
  allStaffEmail: {
    staffEmail: [],
  },
  allAgentsEmail: {
    agentsEmail: [],
  },
  allAdminsEmail: {
    adminsEmail: [],
  },
  allSchoolList: {
    listSchools: [],
  },
  allPendingApplication: {
    applications: [],
    totalPages: 0,
    currentPage: 1,
  },
  loading: false,
  error: null,
  allApplicationSearchTerm: "",
  allEnquirySearchTerm: "",
  allDirectApplicationSearchTerm: "",
  allDirectApplicationIsDirectTerm: "",
  allSalarySearchTerm: "",
  allStudentsSearchTerm: "",
  allPendingApplicationSearchTerm: "",
  allApplicationStatusTerm: "",
  allDirectApplicationStatusTerm: "",
  allStaffSearchTerm: "",
  allAdminSearchTerm: "",
  allActivity: {
    data: [],
    currentPage: 1,
  },
  allEnq: {
    enq: [],
    totalPages: 0,
    currentPage: 1,
  },
  allUserActivity: {
    data: [],
    currentPage: 1,
  },
  addSchool: null,
  bankDetails: null,
  agentDetails: null,
};

export const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    setAllApplicationSearchTerm: (state, action: PayloadAction<string>) => {
      state.allApplicationSearchTerm = action.payload;
    },
    setAllEnquirySearchTerm: (state, action: PayloadAction<string>) => {
      state.allEnquirySearchTerm = action.payload;
    },
    setAllDirectApplicationSearchTerm: (
      state,
      action: PayloadAction<string>
    ) => {
      state.allDirectApplicationSearchTerm = action.payload;
    },
    setAllDirectApplicationIsDirectTerm: (
      state,
      action: PayloadAction<string>
    ) => {
      state.allDirectApplicationIsDirectTerm = action.payload;
    },
    setAllStaffSalarySearchTerm: (state, action: PayloadAction<string>) => {
      state.allSalarySearchTerm = action.payload;
    },
    setAllStudentsSearchTerm: (state, action: PayloadAction<string>) => {
      state.allStudentsSearchTerm = action.payload;
    },
    setAllPendingApplicationSearchTerm: (
      state,
      action: PayloadAction<string>
    ) => {
      state.allPendingApplicationSearchTerm = action.payload;
    },
    setAllStaffSearchTerm: (state, action: PayloadAction<string>) => {
      state.allStaffSearchTerm = action.payload;
    },
    setAllAdminSearchTerm: (state, action: PayloadAction<string>) => {
      state.allAdminSearchTerm = action.payload;
    },
    setAllApplicationSortTerm: (state, action: PayloadAction<string>) => {
      state.allApplicationSortTerm = action.payload;
    },
    setAllDirectApplicationSortTerm: (state, action: PayloadAction<string>) => {
      state.allDirectApplicationSortTerm = action.payload;
    },
    setAllApplicationStatusTerm: (state, action: PayloadAction<string>) => {
      state.allApplicationStatusTerm = action.payload;
    },
    setAllDirectApplicationStatusTerm: (
      state,
      action: PayloadAction<string>
    ) => {
      state.allDirectApplicationStatusTerm = action.payload;
    },
    clearData: (state) => {
      state.allUserActivity = { data: [], currentPage: 1 };
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getStats.fulfilled, (state, action: PayloadAction<any>) => {
        state.getStats = action.payload;
      })
      .addCase(getStats.rejected, (state, action) => {
        state.getStats = null;
        const errorMessage =
          action.error.message || "Failed to fetch admin stats.";
        setMessage(errorMessage);
      })
      .addCase(
        getAdminApplicationStatsBar.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.getBarChatStats = action.payload;
        }
      )
      .addCase(getAdminApplicationStatsBar.rejected, (state, action) => {
        state.getBarChatStats = null;
        const errorMessage =
          action.error.message || "Failed to fetch admin stats.";
        setMessage(errorMessage);
      })

      .addCase(
        getAdminEnquiresStats.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.getEnquiriesChatStats = action.payload;
        }
      )
      .addCase(getAdminEnquiresStats.rejected, (state, action) => {
        state.getEnquiriesChatStats = null;
        const errorMessage =
          action.error.message || "Failed to fetch admin stats.";
        setMessage(errorMessage);
      })

      .addCase(
        getAdminApexChartStats.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.getApexChatStats = action.payload;
        }
      )
      .addCase(getAdminApexChartStats.rejected, (state, action) => {
        state.getApexChatStats = null;
        const errorMessage =
          action.error.message || "Failed to fetch admin stats.";
        setMessage(errorMessage);
      })

      .addCase(
        getStaffDashboardStats.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.getStaffStats = action.payload;
        }
      )
      .addCase(getStaffDashboardStats.rejected, (state, action) => {
        state.getStaffStats = null;
        const errorMessage =
          action.error.message || "Failed to fetch staff stats.";
        setMessage(errorMessage);
      })
      .addCase(getAllApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllApplication.fulfilled,
        (
          state,
          action: PayloadAction<{
            applications: any[];
            totalPages: number;
            currentPage: number;
          }>
        ) => {
          state.loading = false;
          state.allApplication = action.payload;
        }
      )
      .addCase(getAllApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch applications";
      })

      .addCase(getAllDirectApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllDirectApplication.fulfilled,
        (
          state,
          action: PayloadAction<{
            applications: any[];
            totalPages: number;
            currentPage: number;
          }>
        ) => {
          state.loading = false;
          state.allDirect = action.payload;
        }
      )
      .addCase(getAllDirectApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch applications";
      })

      .addCase(getAllStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllStudents.fulfilled,
        (
          state,
          action: PayloadAction<{
            students: any[];
            totalPages: number;
            currentPage: number;
          }>
        ) => {
          state.loading = false;
          state.allStudents = {
            students: action.payload.students,
            totalPages: action.payload.totalPages,
            currentPage: action.payload.currentPage,
          };
        }
      )
      .addCase(getAllStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch all students";
      })

      .addCase(getTopAgentCommission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getTopAgentCommission.fulfilled,
        (
          state,
          action: PayloadAction<{
            topAgentCommission: any[];
            totalPages: number;
            currentPage: number;
          }>
        ) => {
          state.loading = false;
          state.allAgentCommission = {
            topAgentCommission: action.payload.topAgentCommission,
            totalPages: action.payload.totalPages,
            currentPage: action.payload.currentPage,
          };
        }
      )
      .addCase(getTopAgentCommission.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch all agent commission";
      })

      .addCase(getAllPendingApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllPendingApplication.fulfilled,
        (
          state,
          action: PayloadAction<{
            applications: any[];
            totalPages: number;
            currentPage: number;
          }>
        ) => {
          state.loading = false;
          state.allPendingApplication = action.payload;
        }
      )
      .addCase(getAllPendingApplication.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch pending applications";
      })

      .addCase(getAllStaffForSuperAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllStaffForSuperAdmin.fulfilled,
        (
          state,
          action: PayloadAction<{
            staffs: any[];
            totalPages: number;
            currentPage: number;
          }>
        ) => {
          state.loading = false;
          state.allStaff = action.payload;
        }
      )
      .addCase(getAllStaffForSuperAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch admins";
      })

      .addCase(getAllAdminForSuperAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllAdminForSuperAdmin.fulfilled,
        (
          state,
          action: PayloadAction<{
            admins: any[];
            totalPages: number;
            currentPage: number;
          }>
        ) => {
          state.loading = false;
          state.allAdmin = action.payload;
        }
      )
      .addCase(getAllAdminForSuperAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch admins";
      })

      .addCase(getActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getActivity.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: any[];
            currentPage: number;
          }>
        ) => {
          state.loading = false;
          state.allActivity = action.payload;
        }
      )
      .addCase(getActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch admins";
      })

      .addCase(getUserActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUserActivity.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: any[];
            currentPage: number;
          }>
        ) => {
          state.loading = false;
          state.allUserActivity = action.payload;
        }
      )
      .addCase(getUserActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch admins";
      })

      .addCase(addNewSchool.fulfilled, (state, action: PayloadAction<any>) => {
        state.addSchool = action.payload;
      })
      .addCase(addNewSchool.rejected, (state, action) => {
        state.addSchool = null;
        const errorMessage = action.error.message || "school failed to create";
        setMessage(errorMessage);
      })

      .addCase(getAllStudentEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllStudentEmail.fulfilled,
        (
          state,
          action: PayloadAction<{
            studentsEmail: any[];
          }>
        ) => {
          state.loading = false;
          state.allStudentsEmail = {
            studentsEmail: action.payload.studentsEmail,
          };
        }
      )
      .addCase(getAllStudentEmail.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch all students email";
      })

      .addCase(getAllStaffEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllStaffEmail.fulfilled,
        (
          state,
          action: PayloadAction<{
            staffEmail: any[];
          }>
        ) => {
          state.loading = false;
          state.allStaffEmail = {
            staffEmail: action.payload.staffEmail,
          };
        }
      )
      .addCase(getAllStaffEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch all staff email";
      })

      .addCase(getAllAgentEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllAgentEmail.fulfilled,
        (
          state,
          action: PayloadAction<{
            agentsEmail: any[];
          }>
        ) => {
          state.loading = false;
          state.allAgentsEmail = {
            agentsEmail: action.payload.agentsEmail,
          };
        }
      )
      .addCase(getAllAgentEmail.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch all agents email";
      })

      .addCase(getAllAdminsEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllAdminsEmail.fulfilled,
        (
          state,
          action: PayloadAction<{
            adminsEmail: any[];
          }>
        ) => {
          state.loading = false;
          state.allAdminsEmail = {
            adminsEmail: action.payload.adminsEmail,
          };
        }
      )
      .addCase(getAllAdminsEmail.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch all admins email";
      })

      .addCase(getAllSchoolsListCountries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllSchoolsListCountries.fulfilled,
        (
          state,
          action: PayloadAction<{
            listSchools: any[];
          }>
        ) => {
          state.loading = false;
          state.allSchoolList = {
            listSchools: action.payload.listSchools,
          };
        }
      )
      .addCase(getAllSchoolsListCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch all school list";
      })

      .addCase(assignAgentToStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        assignAgentToStaff.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.assignAgent = action.payload;
          state.error = null;
        }
      )
      .addCase(assignAgentToStaff.rejected, (state, action) => {
        state.loading = false;
        state.assignAgent = null;
        state.error =
          (action.payload as string) || "Failed to update user profile.";
      })

      .addCase(assignApplicationToStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        assignApplicationToStaff.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.assignApplicationStaff = action.payload;
          state.error = null;
        }
      )
      .addCase(assignApplicationToStaff.rejected, (state, action) => {
        state.loading = false;
        state.assignApplicationStaff = null;
        state.error =
          (action.payload as string) ||
          "Failed to assign application to staff.";
      })

      .addCase(assignApplicationToAgent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        assignApplicationToAgent.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.assignApplicationAgent = action.payload;
          state.error = null;
        }
      )
      .addCase(assignApplicationToAgent.rejected, (state, action) => {
        state.loading = false;
        state.assignApplicationAgent = null;
        state.error =
          (action.payload as string) ||
          "Failed to assign application to agent.";
      });

    builder.addCase(
      getAllBanks.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.allBanks = action.payload;
      }
    );
    builder
      .addCase(getAllBanks.rejected, (state, action) => {
        state.allBanks = null;
      })

      .addCase(getAllStaffSalaryPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllStaffSalaryPayment.fulfilled,
        (
          state,
          action: PayloadAction<{
            payments: any[];
            totalPages: number;
            currentPage: number;
          }>
        ) => {
          state.loading = false;
          state.allStaffPayments = action.payload;
        }
      )
      .addCase(getAllStaffSalaryPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch applications";
      })

      .addCase(updateApplicationToCompleted.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplicationToCompleted.fulfilled, (state, action) => {
        state.loading = false;
        state.markCompleted = action.payload as null;
      })
      .addCase(updateApplicationToCompleted.rejected, (state) => {
        state.loading = false;
        state.markCompleted = null;
      })

      .addCase(
        updateUserBankDetails.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.bankDetails = action.payload;
        }
      )
      .addCase(updateUserBankDetails.rejected, (state, action) => {
        state.bankDetails = null;
        const errorMessage =
          action.error.message || "failed to update user bank details";
        setMessage(errorMessage);
      })

      .addCase(getAllEnquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllEnquiry.fulfilled,
        (
          state,
          action: PayloadAction<{
            enq: any[];
            totalPages: number;
            currentPage: number;
          }>
        ) => {
          state.loading = false;
          state.allEnq = action.payload;
        }
      )
      .addCase(getAllEnquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch enq";
      })

      .addCase(assignEnquiryToStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        assignEnquiryToStaff.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.assignEnquiryStaff = action.payload;
          state.error = null;
        }
      )
      .addCase(assignEnquiryToStaff.rejected, (state, action) => {
        state.loading = false;
        state.assignEnquiryStaff = null;
        state.error =
          (action.payload as string) || "Failed to assign enquiry to staff.";
      });
  },
});

export const {
  setAllApplicationSearchTerm,
  setAllEnquirySearchTerm,
  setAllDirectApplicationSearchTerm,
  setAllDirectApplicationIsDirectTerm,
  setAllStaffSalarySearchTerm,
  setAllStudentsSearchTerm,
  setAllPendingApplicationSearchTerm,
  setAllStaffSearchTerm,
  setAllAdminSearchTerm,
  setAllApplicationSortTerm,
  setAllDirectApplicationSortTerm,
  setAllApplicationStatusTerm,
  setAllDirectApplicationStatusTerm,
} = applicationSlice.actions;
export const { clearData } = applicationSlice.actions;

export default applicationSlice.reducer;

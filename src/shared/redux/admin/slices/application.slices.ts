import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { setMessage } from "../../message.slices";
import applicationServices from "../services/application.services";

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

export const getStaffDashboardStats = createAsyncThunk("application/getStaffDashboardStats", async () => {
  try {
    const data = await applicationServices.getStaffDashboardStats();
    return data;
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    throw new Error(message);
  }
});


export const getAllApplication = createAsyncThunk(
  "application/getAllApplication",
  async ({ page, limit, search }: { page: number; limit: number; search: string }) => {
    const response = await applicationServices.getAllApplication(page, limit, search);
    return {
      applications: response.data.applications,
      totalPages: response.data.totalPages,
      currentPage: page
    };
  }
);

export const getAllStudents = createAsyncThunk(
  "application/getAllStudents",
  async ({ page, limit, search }: { page: number; limit: number; search: string }) => {
    const response = await applicationServices.getAllStudents(page, limit, search);
    return {
      students: response.data, 
      totalPages: response.data.totalPages,
      currentPage: page
    };
  }
);

export const getAllPendingApplication = createAsyncThunk(
  "application/getAllPendingApplication",
  async ({ page, limit, search }: { page: number; limit: number; search: string }) => {
    const response = await applicationServices.getAllPendingApplication(page, limit, search);
    return {
      applications: response.data,
      totalPages: response.data.totalPages,
      currentPage: page
    };
  }
);

export const getAllAdminForSuperAdmin = createAsyncThunk(
  "application/getAllAdminForSuperAdmin",
  async ({ page, limit, search }: { page: number; limit: number; search: string }) => {
    const response = await applicationServices.getAllAdminForSuperAdmin(page, limit, search);
    return {
      allAdmin: response.data, 
      totalPages: response.data.totalPages,
      currentPage: page
    };
  }
);

interface ApplicationState {
  allApplication: {
    applications: any[];
    totalPages: number;
    currentPage: number;
  };
  allStudents: {
    students: any[];
    totalPages: number;
    currentPage: number;
  };
  allPendingApplication: {
    applications: any[];
    totalPages: number;
    currentPage: number;
  };
  getStats: any;
  getStaffStats: any;
  allAdmin: {
    admins: any; 
    totalPages: number;
    currentPage: number;
  };
  loading: boolean;
  error: string | null;
  allApplicationSearchTerm: string;
  allStudentsSearchTerm: string;
  allPendingApplicationSearchTerm: string;
  allAdminSearchTerm: string;
}

const initialState: ApplicationState = {
  getStats: null,
  getStaffStats: null,
  allAdmin: {
    admins: null,
    totalPages: 0,
    currentPage: 1,
  },
  allApplication: {
    applications: [],
    totalPages: 0,
    currentPage: 1,
  },
  allStudents: {
    students: [],
    totalPages: 0,
    currentPage: 1,
  },
  allPendingApplication: {
    applications: [],
    totalPages: 0,
    currentPage: 1,
  },
  loading: false,
  error: null,
  allApplicationSearchTerm: '',
  allStudentsSearchTerm: '',
  allPendingApplicationSearchTerm: '',
  allAdminSearchTerm: '',
};

export const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    setAllApplicationSearchTerm: (state, action: PayloadAction<string>) => {
      state.allApplicationSearchTerm = action.payload;
    },
    setAllStudentsSearchTerm: (state, action: PayloadAction<string>) => {
      state.allStudentsSearchTerm = action.payload;
    },
    setAllPendingApplicationSearchTerm: (state, action: PayloadAction<string>) => {
      state.allPendingApplicationSearchTerm = action.payload;
    },
    setAllAdminSearchTerm: (state, action: PayloadAction<string>) => {
      state.allAdminSearchTerm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStats.fulfilled, (state, action: PayloadAction<any>) => {
        state.getStats = action.payload;
      })
      .addCase(getStats.rejected, (state, action) => {
        state.getStats = null;
        const errorMessage = action.error.message || "Failed to fetch admin stats.";
        setMessage(errorMessage);
      })
      .addCase(getStaffDashboardStats.fulfilled, (state, action: PayloadAction<any>) => {
        state.getStaffStats = action.payload;
      })
      .addCase(getStaffDashboardStats.rejected, (state, action) => {
        state.getStaffStats = null;
        const errorMessage = action.error.message || "Failed to fetch staff stats.";
        setMessage(errorMessage);
      })
      .addCase(getAllApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllApplication.fulfilled, (state, action: PayloadAction<{
        applications: any[];
        totalPages: number;
        currentPage: number;
      }>) => {
        state.loading = false;
        state.allApplication = action.payload;
      })
      .addCase(getAllApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch applications";
      })
      .addCase(getAllStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllStudents.fulfilled, (state, action: PayloadAction<{
        students: any[];
        totalPages: number;
        currentPage: number;
      }>) => {
        state.loading = false;
        state.allStudents = {
          students: action.payload.students,
          totalPages: action.payload.totalPages,
          currentPage: action.payload.currentPage
        };
      })
      .addCase(getAllStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch all students";
      })
      .addCase(getAllPendingApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPendingApplication.fulfilled, (state, action: PayloadAction<{
        applications: any[];
        totalPages: number;
        currentPage: number;
      }>) => {
        state.loading = false;
        state.allPendingApplication = action.payload;
      })
      .addCase(getAllPendingApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch pending applications";
      })
      .addCase(getAllAdminForSuperAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAdminForSuperAdmin.fulfilled, (state, action: PayloadAction<{
        allAdmin: any;
        totalPages: number;
        currentPage: number;
      }>) => {
        state.loading = false;
        state.allAdmin = {
          admins: action.payload.allAdmin,
          totalPages: action.payload.totalPages,
          currentPage: action.payload.currentPage
        };
      })
      .addCase(getAllAdminForSuperAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch admin data";
      });
  },
});

export const {
  setAllApplicationSearchTerm,
  setAllStudentsSearchTerm,
  setAllPendingApplicationSearchTerm,
  setAllAdminSearchTerm,
} = applicationSlice.actions;

export default applicationSlice.reducer;
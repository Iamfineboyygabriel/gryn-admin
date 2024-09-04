import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { setMessage } from "../../message.slices";
import shareApplicationServices from "../services/shareApplication.services";

interface UpdateProfile {
  email?: string;
  firstName?: string;
  lastName?: string;
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

export const getUserProfile = createAsyncThunk(
  "shareApplication/getProfile",
  async (_, thunkAPI) => {
    try {
      const data = await shareApplicationServices.getUserProfile();
      return data;
    } catch (error: any) {
      const message = error.message;
      error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "shareApplication/getCurrentProfile",
  async (_, thunkAPI) => {
    try {
      const data = await shareApplicationServices.getCurrentUser();
      return data;
    } catch (error: any) {
      const message = error.message || "Failed to fetch user details";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  "shareApplication/uploadProfile",
  async (body: any, thunkAPI) => {
    try {
      const data = await shareApplicationServices.uploadAvatar(body);
      return data;
    } catch (error: any) {
      const message = error.message || "Something went wrong!";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "shareApplication/updateProfile",
  async (body: UpdateProfile, thunkAPI) => {
    try {
      const data = await shareApplicationServices.updateProfile(body);
      return data;
    } catch (error: any) {
      error.toString();
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const updatePassword = createAsyncThunk(
  "shareApllication/updatePassword",
  async (body: any, thunkAPI) => {
    try {
      const data = await shareApplicationServices.updatePassword(body);
      return data;
    } catch (error: any) {
      error.toString();
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createVisaApplication = createAsyncThunk(
  "sharedApllication/createVisaApplication",
  async (body: any, thunkAPI) => {
    try {
      const data = await shareApplicationServices.createVisaApplication(body);
      return data;
    } catch (error: any) {
      const message = error;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getTopCountries = createAsyncThunk(
  "shareApplication/getTopCountries",
  async (_, thunkAPI) => {
    try {
      const data = await shareApplicationServices.getTopCountries();
      return data;
    } catch (error: any) {
      const message = error.message;
      error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getTopUniversities = createAsyncThunk(
  "shareApplication/getTopUniversities",
  async (_, thunkAPI) => {
    try {
      const data = await shareApplicationServices.getTopUniversities();
      return data;
    } catch (error: any) {
      const message = error.message;
      error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllStudents = createAsyncThunk(
  "shareApplication/getAllStudents",
  async ({ page, limit }: { page: number; limit: number }, thunkAPI) => {
    try {
      const data = await shareApplicationServices.getAllStudents(page, limit);
      return data;
    } catch (error: any) {
      const message = error.message;
      error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllAgents = createAsyncThunk(
  "shareApplication/getAllAgents",
  async ({ page, limit }: { page: number; limit: number }, thunkAPI) => {
    try {
      const data = await shareApplicationServices.getAllAgents(page, limit);
      console.log("Ddd", data);
      return data;
    } catch (error: any) {
      const message = error.message;
      error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createInvoice = createAsyncThunk(
  "shareApplication/createInvoice",
  async (body: any, thunkAPI) => {
    try {
      const data = await shareApplicationServices.createInvoice(body);
      return data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong!";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createDraft = createAsyncThunk(
  "shareApplication/createDraft",
  async (body: any, thunkAPI) => {
    try {
      const data = await shareApplicationServices.createDraft(body);
      return data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong!";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllDraftItems = createAsyncThunk(
  "shareApplication/getAllDraftItems",
  async ({ page, limit }: { page: number; limit: number }, thunkAPI) => {
    try {
      const data = await shareApplicationServices.getAllDraftItems(page, limit);
      return data;
    } catch (error: any) {
      const message = error.message;
      error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllInvoice = createAsyncThunk(
  "shareApplication/getAllInvoice",
  async ({ page, limit }: { page: number; limit: number }, thunkAPI) => {
    try {
      const data = await shareApplicationServices.getAllInvoice(page, limit);
      return data;
    } catch (error: any) {
      const message = error.message;
      error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createApplication = createAsyncThunk(
  "shareApplication/createApplication",
  async (body: CreateApplicationBody, thunkAPI) => {
    try {
      const data = await shareApplicationServices.createApplication(body);
      return data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong!";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const getAllVisaApplication = createAsyncThunk(
  "shareApplication/getAllVisaApplication",
  async ({ page, limit }: { page: number; limit: number }, thunkAPI) => {
    try {
      return await shareApplicationServices.getAllVisaApplication(page, limit);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "An error occurred");
    }
  }
);

export const getAllPendingAgents = createAsyncThunk(
  "shareApplication/getAllPendingAgents",
  async ({ page, limit }: { page: number; limit: number }, thunkAPI) => {
    try {
      const data = await shareApplicationServices.getAllPendingAgents(
        page,
        limit
      );
      console.log("Data", data);
      return data;
    } catch (error: any) {
      const message = error.message;
      error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

interface ApplicationState {
  allStudents: {
    data: {
      students: any[];
    } | null;
    totalItems: number;
  };
  loading: boolean;
  userProfile: null;
  currentUser: null;
  avatarUrl: null;
  updateProfile: null;
  updatePassword: null;
  registerVisaApplication: null;
  topCountries: null;
  topUniversities: null;
  allAgents: {
    data: {
      agents: any[];
    } | null;
    totalItems: number;
  };
  registerInvoice: null;
  registerDraft: null;
  allDraftItems: {
    data: {
      draftsItems: any[];
    } | null;
    totalItems: number;
  };
  allInvoice: {
    data: {
      invoice: any[];
    } | null;
    totalItems: number;
  };
  registerApplication: null;
  registerVisaAppliction: null;
  allVisa: {
    data: any[] | null;
    totalItems: number;
    loading: boolean;
  };
  pendingAgents: {
    data: {
      pendingAgents: any[];
    } | null;
    totalItems: number;
  };
}

const initialState: ApplicationState = {
  userProfile: null,
  currentUser: null,
  avatarUrl: null,
  updateProfile: null,
  updatePassword: null,
  registerVisaApplication: null,
  topCountries: null,
  topUniversities: null,
  allStudents: {
    data: null,
    totalItems: 0,
  },
  loading: false,
  allAgents: {
    data: null,
    totalItems: 0,
  },
  registerInvoice: null,
  registerDraft: null,
  allDraftItems: {
    data: null,
    totalItems: 0,
  },
  allInvoice: {
    data: null,
    totalItems: 0,
  },
  registerApplication: null,
  registerVisaAppliction: null,
  allVisa: {
    data: null,
    totalItems: 0,
    loading: false,
  },
  pendingAgents: {
    data: null,
    totalItems: 0,
  },
};

export const shareApplicationSlice = createSlice({
  name: "shareApplication",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(
        getUserProfile.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.userProfile = action.payload;
        }
      )
      .addCase(getUserProfile.rejected, (state, action) => {
        state.userProfile = null;
        const errorMessage =
          action.error.message || "Failed to fetch user profile.";
        setMessage(errorMessage);
      })

      .addCase(
        getCurrentUser.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.currentUser = action.payload;
        }
      )
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.currentUser = null;
        const errorMessage =
          action.error.message || "Failed to fetch current user profile.";
        setMessage(errorMessage);
      })

      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.avatarUrl = action.payload.data.publicURL;
      })

      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<any>) => {
        state.updateProfile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateProfile = null;
        const errorMessage =
          action.error.message || "Failed to update user profile.";
        setMessage(errorMessage);
      })

      .addCase(updatePassword.fulfilled, (state, action) => {
        state.updatePassword = action.payload as null;
      })
      .addCase(updatePassword.rejected, (state) => {
        state.updatePassword = null;
      })

      .addCase(
        createVisaApplication.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.registerVisaApplication = action.payload;
        }
      )
      .addCase(createVisaApplication.rejected, (state, action) => {
        state.registerVisaApplication = null;
        const errorMessage =
          action.error.message || "Visa Application creation failed.";
        setMessage(errorMessage);
      })

      .addCase(
        getTopCountries.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.topCountries = action.payload;
        }
      )
      .addCase(getTopCountries.rejected, (state, action) => {
        state.topCountries = null;
        const errorMessage =
          action.error.message || "Failed to fetch top countries";
        setMessage(errorMessage);
      })

      .addCase(
        getTopUniversities.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.topUniversities = action.payload;
        }
      )
      .addCase(getTopUniversities.rejected, (state, action) => {
        state.topUniversities = null;
        const errorMessage =
          action.error.message || "Failed to fetch top universities.";
        setMessage(errorMessage);
      })

      .addCase(getAllStudents.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getAllStudents.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.allStudents.data = action.payload.data;
          state.allStudents.totalItems = action.payload.totalItems;
          state.loading = false;
        }
      )

      .addCase(getAllStudents.rejected, (state, action) => {
        state.allStudents = {
          data: null,
          totalItems: 0,
        };
        const errorMessage =
          action.error.message || "Failed to fetch all students.";
        setMessage(errorMessage);
      })

      .addCase(getAllAgents.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllAgents.fulfilled, (state, action: PayloadAction<any>) => {
        state.allAgents.data = action.payload.data;
        state.allAgents.totalItems = action.payload.totalItems;
        state.loading = false;
      })

      .addCase(getAllAgents.rejected, (state, action) => {
        state.allAgents = {
          data: null,
          totalItems: 0,
        };
        const errorMessage =
          action.error.message || "Failed to fetch all agents.";
        setMessage(errorMessage);
      })

      .addCase(createInvoice.fulfilled, (state, action: PayloadAction<any>) => {
        state.registerInvoice = action.payload;
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.registerInvoice = null;
        const errorMessage = action.error.message || "Invoice creation failed.";
        setMessage(errorMessage);
      })

      .addCase(createDraft.fulfilled, (state, action: PayloadAction<any>) => {
        state.registerDraft = action.payload;
      })
      .addCase(createDraft.rejected, (state, action) => {
        state.registerDraft = null;
        const errorMessage = action.error.message || "Draft creation failed.";
        setMessage(errorMessage);
      })

      .addCase(
        getAllDraftItems.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.allDraftItems = action.payload;
          state.allInvoice.totalItems = action.payload.totalItems;
          state.loading = false;
        }
      )
      .addCase(getAllDraftItems.rejected, (state, action) => {
        state.allDraftItems = {
          data: null,
          totalItems: 0,
        };
      })

      .addCase(getAllInvoice.fulfilled, (state, action: PayloadAction<any>) => {
        state.allInvoice = action.payload;
        state.allInvoice.totalItems = action.payload.totalItems;
        state.loading = false;
      })
      .addCase(getAllInvoice.rejected, (state, action) => {
        state.allInvoice = {
          data: null,
          totalItems: 0,
        };
      })

      .addCase(
        createApplication.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.registerApplication = action.payload;
        }
      )
      .addCase(createApplication.rejected, (state, action) => {
        state.registerApplication = null;
        const errorMessage =
          action.error.message || "Application creation failed.";
        setMessage(errorMessage);
      })
      .addCase(getAllVisaApplication.pending, (state) => {
        state.allVisa.loading = true;
        state.allVisa.data = null;
        state.allVisa.totalItems = 0;
      })
      .addCase(getAllVisaApplication.fulfilled, (state, action) => {
        if (action.payload && action.payload.data) {
          state.allVisa.data = action.payload.data;
          state.allVisa.totalItems = action.payload.totalItems;
        } else {
          state.allVisa.data = null;
          state.allVisa.totalItems = 0;
        }
        state.allVisa.loading = false;
      })
      .addCase(getAllVisaApplication.rejected, (state, action) => {
        state.allVisa.loading = false;
        state.allVisa.data = null;
        state.allVisa.totalItems = 0;
      })

      .addCase(getAllPendingAgents.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getAllPendingAgents.fulfilled,
        (state, action: PayloadAction<any>) => {
          console.log("steee", action.payload);
          state.pendingAgents.data = action.payload.data;
          state.pendingAgents.totalItems = action.payload.totalItems;
          state.loading = false;
        }
      )

      .addCase(getAllPendingAgents.rejected, (state, action) => {
        state.pendingAgents = {
          data: null,
          totalItems: 0,
        };
        const errorMessage =
          action.error.message || "Failed to fetch all students.";
        setMessage(errorMessage);
      });
  },
});

const { reducer } = shareApplicationSlice;
export default reducer;

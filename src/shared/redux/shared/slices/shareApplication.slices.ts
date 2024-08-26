import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { setMessage } from "../../message.slices";
import shareApplicationServices from "../services/shareApplication.services";

interface UpdateProfile {
  email?: string;
  firstName?: string;
  lastName?: string;
}

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
  "sharedApllication/updatePassword",
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
  "sharedApllication/createApplication",
  async (body: any, thunkAPI) => {
    try {
      const data = await shareApplicationServices.createVisaApplication(body);
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
  async (_, thunkAPI) => {
    try {
      const data = await shareApplicationServices.getAllStudents();
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
  async (_, thunkAPI) => {
    try {
      const data = await shareApplicationServices.getAllAgents();
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

export const shareApplicationSlice = createSlice({
  name: "shareApplication",
  initialState: {
    userProfile: null,
    currentUser: null,
    avatarUrl: null,
    updateProfile: null,
    updatePassword: null,
    registerVisaApplication: null,
    topCountries: null,
    topUniversities: null,
    allStudents: null,
    allAgents: null,
    registerInvoice: null,
    registerDraft: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getUserProfile.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.userProfile = action.payload;
      }
    );
    builder.addCase(getUserProfile.rejected, (state, action) => {
      state.userProfile = null;
      const errorMessage =
        action.error.message || "Failed to fetch user profile.";
      setMessage(errorMessage);
    });

    builder.addCase(
      getCurrentUser.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.currentUser = action.payload;
      }
    );
    builder.addCase(getCurrentUser.rejected, (state, action) => {
      state.currentUser = null;
      const errorMessage =
        action.error.message || "Failed to fetch current user profile.";
      setMessage(errorMessage);
    });

    builder.addCase(uploadAvatar.fulfilled, (state, action) => {
      state.avatarUrl = action.payload.data.publicURL;
    });

    builder.addCase(
      updateProfile.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.updateProfile = action.payload;
      }
    );
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.updateProfile = null;
      const errorMessage =
        action.error.message || "Failed to update user profile.";
      setMessage(errorMessage);
    });

    builder.addCase(updatePassword.fulfilled, (state, action) => {
      state.updatePassword = action.payload as null;
    });
    builder.addCase(updatePassword.rejected, (state) => {
      state.updatePassword = null;
    });

    builder.addCase(
      createVisaApplication.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.registerVisaApplication = action.payload;
      }
    );
    builder.addCase(createVisaApplication.rejected, (state, action) => {
      state.registerVisaApplication = null;
      const errorMessage =
        action.error.message || "Visa Application creation failed.";
      setMessage(errorMessage);
    });

    builder.addCase(
      getTopCountries.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.topCountries = action.payload;
      }
    );
    builder.addCase(getTopCountries.rejected, (state, action) => {
      state.topCountries = null;
      const errorMessage =
        action.error.message || "Failed to fetch top countries";
      setMessage(errorMessage);
    });

    builder.addCase(
      getTopUniversities.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.topUniversities = action.payload;
      }
    );
    builder.addCase(getTopUniversities.rejected, (state, action) => {
      state.topUniversities = null;
      const errorMessage =
        action.error.message || "Failed to fetch top universities.";
      setMessage(errorMessage);
    });

    builder.addCase(
      getAllStudents.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.allStudents = action.payload;
      }
    );
    builder.addCase(getAllStudents.rejected, (state, action) => {
      state.allStudents = null;
      const errorMessage =
        action.error.message || "Failed to fetch all students";
      setMessage(errorMessage);
    });

    builder.addCase(
      getAllAgents.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.allAgents = action.payload;
      }
    );
    builder.addCase(getAllAgents.rejected, (state, action) => {
      state.allAgents = null;
      const errorMessage = action.error.message || "Failed to fetch all agents";
      setMessage(errorMessage);
    });

    builder.addCase(
      createInvoice.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.registerInvoice = action.payload;
      }
    );
    builder.addCase(createInvoice.rejected, (state, action) => {
      state.registerInvoice = null;
      const errorMessage =
        action.error.message || "Application creation failed.";
      setMessage(errorMessage);
    });

    builder.addCase(
      createDraft.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.registerDraft = action.payload;
      }
    );
    builder.addCase(createDraft.rejected, (state, action) => {
      state.registerDraft = null;
      const errorMessage =
        action.error.message || "Application creation failed.";
      setMessage(errorMessage);
    });
  },
});

const { reducer } = shareApplicationSlice;
export default reducer;

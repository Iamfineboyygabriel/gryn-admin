import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { setMessage } from "../../message.slices";
import sharedLandingServices from "../services/shareLanding.services";

interface User {
  role: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  data: User;
}

interface SharedState {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  error: string | null;
}

export const login = createAsyncThunk<LoginResponse, LoginPayload>(
  "shared/login",
  async (body, thunkAPI) => {
    try {
      const data = await sharedLandingServices.loginUser(body);
      return data;
    } catch (error: any) {
      const message = error.response.message || "Something went wrong";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'shared/resetPassword',
  async ({ 
    token, 
    email, 
    password 
  }: { 
    token: string; 
    email: string; 
    password: string;
  }, thunkAPI) => {
    try {
      const response = await sharedLandingServices.ResetPassword(token, email, { password });
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState: SharedState = {
  user: null,
  isLoading: false,
  isLoggedIn: false,
  error: null,
};

const sharedSlice = createSlice({
  name: "shared",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.isLoading = false;
          state.isLoggedIn = true;
          state.user = action.payload.data;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.error = action.payload as string;
      })

      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

const { reducer } = sharedSlice;
export default reducer;

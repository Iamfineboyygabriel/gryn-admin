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
      });
  },
});

const { reducer } = sharedSlice;
export default reducer;

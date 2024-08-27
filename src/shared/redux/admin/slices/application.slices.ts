
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

export const getAllApplication = createAsyncThunk(
  "application/getAllApplication",
  async ({ page, limit }: { page: number; limit: number }, thunkAPI) => {
    try {
      const data = await applicationServices.getAllApplication(page, limit);
      return data;
    } catch (error: any) {
      const message = error.message;
      error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

interface ApplicationState {
  allApplication: {
    data: {
      applications: any[];
    } | null;
    totalItems: number;
  };
  loading: boolean;
  getStats: null;
}

const initialState: ApplicationState = {
  getStats: null,
  allApplication: {
    data: null,
    totalItems: 0,
  },
  loading: false,
};

export const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStats.fulfilled, (state, action: PayloadAction<any>) => {
        state.getStats = action.payload;
      })
      .addCase(getStats.rejected, (state, action) => {
        state.getStats = null;
        const errorMessage =
          action.error.message || "Failed to fetch user stats.";
        setMessage(errorMessage);
      })
      .addCase(getAllApplication.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getAllApplication.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.allApplication.data = action.payload.data;
          state.allApplication.totalItems = action.payload.totalItems;
          state.loading = false;
        }
      )
      .addCase(getAllApplication.rejected, (state, action) => {
        state.allApplication = {
          data: null,
          totalItems: 0,
        };
        state.loading = false;
        const errorMessage =
          action.error.message || "Failed to fetch all applications";
        setMessage(errorMessage);
      });
  },
});

export default applicationSlice.reducer;
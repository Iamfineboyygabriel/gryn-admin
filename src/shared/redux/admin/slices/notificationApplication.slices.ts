import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { setMessage } from "../../message.slices";
import { RootState } from "../../store";
import notificationApplicationServices from "../services/notificationApplication.services";

export const createNews = createAsyncThunk(
    "shareApplication/createNews",
    async (body: any, thunkAPI) => {
      try {
        const data = await notificationApplicationServices.createNews(body);
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

  export const createNewsDrafs = createAsyncThunk(
    "shareApplication/createNewsDraft",
    async (body: any, thunkAPI) => {
      try {
        const data = await notificationApplicationServices.createNewsDraft(body);
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

  
interface ApplicationState {
    registerNews: null;
    registerNewsDraft: null;
    loading: boolean;
    error: string | null;
    sort: string | null;
    status: string | null;
    month: string | null;
    search: string;
    searchTerm: string;
  }
  
  const initialState: ApplicationState = {
    registerNews: null,
    registerNewsDraft: null,
    loading: false,
    error: null,
    sort: null,
    status: null,
    month: null,
    search: '',
    searchTerm: "",
  };



export const notificationApplicationSlice = createSlice({
    name: "notificationApplication",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
  .addCase(createNews.fulfilled, (state, action: PayloadAction<any>) => {
    state.registerNews = action.payload;
  })
  .addCase(createNews.rejected, (state, action) => {
    state.registerNews = null;
    const errorMessage = action.error.message || "News creation failed.";
    setMessage(errorMessage);
  })

  .addCase(createNewsDrafs.fulfilled, (state, action: PayloadAction<any>) => {
    state.registerNewsDraft = action.payload;
  })
  .addCase(createNewsDrafs.rejected, (state, action) => {
    state.registerNewsDraft = null;
    const errorMessage = action.error.message || "News drafts creation failed.";
    setMessage(errorMessage);
  })
}
})

  const { reducer } = notificationApplicationSlice;
  export default reducer;

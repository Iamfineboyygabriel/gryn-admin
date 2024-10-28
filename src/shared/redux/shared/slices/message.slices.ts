import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import messageServices from "../services/message.services";
import { setMessage } from "../../message.slices";
import { responsiveFontSizes } from "@mui/material";

interface User {
  email: any;
  id: string;
  name: string;
}

interface Chat {
  user: any;
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
}

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface MessageState {
  search: string;
  users: User[];
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
}

const initialState: MessageState = {
  search: '',
  users: [],
  chats: [],
  currentChat: null,
  messages: [],
  loading: false,
  error: null,
  unreadCount: 0
};

export const searchUser = createAsyncThunk(
  "message/searchUser",
  async (search: string = '', thunkAPI) => {
    try {
      const response = await messageServices.searchUser(search);
      console.log("reee",response.data)
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createChat = createAsyncThunk(
  "message/createChat",
  async (userId: string, thunkAPI) => {
    try {
      const response = await messageServices.CreateChat(userId);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchChatById = createAsyncThunk(
  "message/fetchChatById",
  async (chatId: string, thunkAPI) => {
    try {
      const response = await messageServices.findChatById(chatId);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchAllUserChats = createAsyncThunk(
  "message/fetchAllUserChats",
  async (_, thunkAPI) => {
    try {
      const response = await messageServices.findAllUserChat();
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  "message/fetchUnreadCount",
  async (_, thunkAPI) => {
    try {
      const response = await messageServices.findUserUnreadMessageCount();
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  "message/sendMessage",
  async ({ chatId, body }: { chatId: string; body: any }, thunkAPI) => {
    try {
      const response = await messageServices.SendMessage(chatId, body);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateReadStatus = createAsyncThunk(
  "message/updateReadStatus",
  async ({ chatId, body }: { chatId: string; body: any }, thunkAPI) => {
    try {
      const response = await messageServices.UpDateReadStatus(chatId, body);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    clearCurrentChat: (state) => {
      state.currentChat = null;
      state.messages = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(searchUser.pending, (state) => {
      state.loading = true;
      state.error = null;
      console.log("Search pending...");
    })
    .addCase(searchUser.fulfilled, (state, action) => {
      console.log("Search fulfilled, payload:", action.payload);
      state.loading = false;
      state.users = action.payload;
    })
    .addCase(searchUser.rejected, (state, action) => {
      console.log("Search rejected:", action.payload);
      state.loading = false;
      state.error = action.payload as string;
    })

      .addCase(createChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.loading = false;
        state.chats.unshift(action.payload);
        state.currentChat = action.payload;
      })
      .addCase(createChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        setMessage(state.error || "Failed to create chat");
      })

      .addCase(fetchChatById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChat = action.payload;
        state.messages = action.payload.messages || [];
      })
      .addCase(fetchChatById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        setMessage(state.error || "Failed to fetch chat");
      })

      .addCase(fetchAllUserChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUserChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchAllUserChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        setMessage(state.error || "Failed to fetch chats");
      })

      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })

      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentChat?.id === action.payload.chatId) {
          state.messages.push(action.payload);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        setMessage(state.error || "Failed to send message");
      })

      .addCase(updateReadStatus.fulfilled, (state, action) => {
        const chatId = action.payload.chatId;
        state.messages = state.messages.map(message => 
          message.chatId === chatId ? { ...message, read: true } : message
        );
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      });
  },
});

export const { setSearch, clearCurrentChat, clearError } = messageSlice.actions;

export const selectMessageState = (state: { message: MessageState }) => state.message;

const { reducer } = messageSlice;
export default reducer;
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  createAction,
} from "@reduxjs/toolkit";
import messageServices from "../services/message.services";
import { setMessage } from "../../message.slices";

interface User {
  id: string;
  email: string;
  name?: string;
  profile: {
    email: string;
    avatar?: {
      publicURL?: string;
    };
  };
}

interface Message {
  id: string | number; // Updated to match API response
  chatId: string;
  senderId: string;
  content?: string;
  message: string;
  timestamp?: string;
  createdAt: string;
  read: boolean;
  sender: User;
}

interface Chat {
  id: string;
  sender: User;
  receiver: User;
  messages: Message[];
  createdAt: string;
  participants: User[];
  unreadCount: number;
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
  currentUserId: string;
}

const initialState: MessageState = {
  search: "",
  users: [],
  chats: [],
  currentChat: null,
  messages: [],
  loading: false,
  error: null,
  unreadCount: 0,
  currentUserId: "",
};

export const searchUser = createAsyncThunk(
  "message/searchUser",
  async (search: string = "", thunkAPI) => {
    try {
      const response = await messageServices.searchUser(search);
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

export const fetchChatByUserId = createAsyncThunk(
  "message/fetchChatById",
  async (userId: string, thunkAPI) => {
    try {
      const response = await messageServices.findChatByUserId(userId);
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

export const updateReadStatus = createAsyncThunk(
  "message/updateReadStatus",
  async (
    { chatId, currentUserId }: { chatId: string; currentUserId: string },
    thunkAPI
  ) => {
    console.log(
      `Updating read status for chat: ${chatId}, user: ${currentUserId}`
    );
    try {
      const response = await messageServices.UpDateReadStatus(chatId);
      return { ...response.data, currentUserId };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const messageRead = createAction<{
  chatId: string;
  userId: string;
}>("message/messageRead");

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
    setCurrentUserId: (state, action: PayloadAction<string>) => {
      state.currentUserId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(searchUser.rejected, (state, action) => {
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
      .addCase(fetchChatByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChat = action.payload;
        // Sort messages by createdAt
        state.messages = (action.payload.messages || []).sort(
          (a: any, b: any) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      })
      .addCase(fetchChatByUserId.rejected, (state, action) => {
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
        // Sort messages in each chat
        state.chats = action.payload.map((chat: Chat) => ({
          ...chat,
          messages: (chat.messages || []).sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          ),
        }));
      })
      .addCase(fetchAllUserChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("fetchAllUserChats error:", action.payload);
        setMessage(state.error || "Failed to fetch chats");
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.count || 0;
      })
      .addCase(updateReadStatus.fulfilled, (state, action) => {
        const { chatId, currentUserId } = action.meta.arg;
        state.messages = state.messages.map((message) =>
          message.chatId === chatId && message.senderId !== currentUserId
            ? { ...message, read: true }
            : message
        );
        state.chats = state.chats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: chat.messages.map((msg) =>
                  msg.senderId !== currentUserId ? { ...msg, read: true } : msg
                ),
                unreadCount: 0,
              }
            : chat
        );
        state.unreadCount = state.chats.reduce((count, chat) => {
          return (
            count +
            chat.messages.filter(
              (msg) => !msg.read && msg.senderId !== currentUserId
            ).length
          );
        }, 0);
      })
      .addCase(messageRead, (state, action) => {
        const { chatId, userId } = action.payload;
        state.chats = state.chats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: chat.messages.map((msg) =>
                  msg.senderId !== userId ? { ...msg, read: true } : msg
                ),
                unreadCount: 0,
              }
            : chat
        );
        state.unreadCount = state.chats.reduce((count, chat) => {
          return (
            count +
            chat.messages.filter(
              (msg) => !msg.read && msg.senderId !== state.currentUserId
            ).length
          );
        }, 0);
      });
  },
});

export const { setSearch, clearCurrentChat, clearError, setCurrentUserId } =
  messageSlice.actions;

export const selectMessageState = (state: { message: MessageState }) =>
  state.message;

export default messageSlice.reducer;

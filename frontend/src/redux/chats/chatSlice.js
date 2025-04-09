import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

// Fetch all chats for the user
export const fetchChats = createAsyncThunk('chats/fetchChats', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/chats');
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Fetch messages for a specific chat
export const fetchChatMessages = createAsyncThunk('chats/fetchChatMessages', async (chatId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/chats/${chatId}`);
    return { chatId, messages: response.data.data };
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Send a message
export const sendMessage = createAsyncThunk('chats/sendMessage', async ({ chatId, content }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/chats/${chatId}/message`, { content });
    return { chatId, message: response.data.data };
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Create a new chat
export const createChat = createAsyncThunk('chats/createChat', async ({ friendId }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/chats', { participantId: friendId }); // Use participantId
    return response.data.data; // Assuming the API returns the new chat object
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const chatSlice = createSlice({
  name: 'chats',
  initialState: {
    chats: [],
    messages: {},
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.chats = action.payload;
      })
      .addCase(fetchChatMessages.fulfilled, (state, action) => {
        state.messages[action.payload.chatId] = action.payload.messages;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        if (!state.messages[action.payload.chatId]) {
          state.messages[action.payload.chatId] = [];
        }
        state.messages[action.payload.chatId].push(action.payload.message);
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.chats.push(action.payload); // Add the new chat to the chats array
      });
  },
});

export default chatSlice.reducer;
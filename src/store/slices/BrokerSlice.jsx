import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/brokers";

export const fetchBrokers = createAsyncThunk(
  "brokers/fetchBrokers",
  async () => {
    const response = await axios.get(API_URL);
    return response.data;
  }
);

export const createBrokers = createAsyncThunk(
  "brokers/createBrokers",
  async (data) => {
    const response = await axios.post(API_URL, data);
    return response.data;
  }
);

export const deleteBrokers = createAsyncThunk(
  "brokers/deleteBrokers",
  async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  }
);

export const updateBrokers = createAsyncThunk(
  "brokers/updateBrokers",
  async (broker) => {
    const resp = await axios.put(`${API_URL}/${broker.id}`, broker);
    return resp.data;
  }
);

export const brokerSlice = createSlice({
  name: "brokers",
  initialState: {
    status: "idle",
    items: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBrokers.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchBrokers.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.items = action.payload;
    });
    builder.addCase(fetchBrokers.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
    builder.addCase(createBrokers.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });
    builder.addCase(deleteBrokers.fulfilled, (state, action) => {
      state.items = state.items.filter(
        (broker) => broker.id !== action.payload
      );
    });
    builder.addCase(updateBrokers.fulfilled, (state, action) => {
      state.items = state.items.map((broker) =>
        broker.id === action.payload.id ? action.payload : broker
      );
    });
  },
});
export default brokerSlice.reducer;

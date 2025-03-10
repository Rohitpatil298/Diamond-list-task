import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/transactions";

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async () => {
    const response = await axios.get(API_URL);
    return response.data;
  }
);

export const createTransaction = createAsyncThunk(
  "transactions/createTransaction",
  async (data) => {
    const response = await axios.post(API_URL, data);
    return response.data;
  }
);

export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async (transaction) => {
    const response = await axios.put(
      `${API_URL}/${transaction.id}`,
      transaction
    );
    return response.data;
  }
);

export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  }
);

export const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    status: "idle",
    items: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTransactions.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchTransactions.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.items = action.payload;
    });
    builder.addCase(fetchTransactions.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
    builder.addCase(createTransaction.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });
    builder.addCase(updateTransaction.fulfilled, (state, action) => {
      state.items = state.items.map((transaction) =>
        transaction.id === action.payload.id ? action.payload : transaction
      );
    });
    builder.addCase(deleteTransaction.fulfilled, (state, action) => {
      state.items = state.items.filter(
        (transaction) => transaction.id !== action.payload
      );
    });
  },
});
export default transactionSlice.reducer;

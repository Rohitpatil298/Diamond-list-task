import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/diamonds";

export const fetchDiamonds = createAsyncThunk(
  "diamonds/fetchDiamonds",
  async () => {
    const response = await axios.get(API_URL);
    return response.data;
  }
);

export const deleteDiamonds = createAsyncThunk(
  "diamonds/deleteDiamonds",
  async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  }
);

export const diamondSlice = createSlice({
  name: "diamonds",
  initialState: {
    status: "idle",
    items: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDiamonds.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchDiamonds.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.items = action.payload;
    });
    builder.addCase(fetchDiamonds.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
    builder.addCase(deleteDiamonds.fulfilled, (state, action) => {
      state.items = state.items.filter(
        (diamond) => diamond.id !== action.payload
      );
    });
  },
});
export default diamondSlice.reducer;

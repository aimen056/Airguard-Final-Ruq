
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

// Fetch reports from backend
export const fetchReports = createAsyncThunk("pollution/fetchReports", async () => {
  try {
    const response = await axios.get('/api/reports');
    console.log("API Response:", response.data); // Log the API response
    return Array.isArray(response.data) ? response.data : []; // Ensure it's an array
  } catch (error) {
    console.error("Error fetching reports:", error);
    toast.error("Failed to fetch pollution reports.");
    throw error;
  }
});

// Add a new report
export const addReport = createAsyncThunk("pollution/addReport", async (report) => {
  const response = await axios.post('/api/reports', report);
  toast.success("Pollution report submitted!");
  return response.data;
});

// Edit a report
export const editReport = createAsyncThunk("pollution/editReport", async ({ id, ...report }) => {
  const response = await axios.put(`/api/reports/${id}`, report);
  toast.success("Pollution report updated!");
  return response.data;
});

// Delete a report
export const deleteReport = createAsyncThunk("pollution/deleteReport", async (id) => {
  await axios.delete(`/api/reports/${id}`);
  toast.success("Pollution report deleted!");
  return id;
});

// Slice
const repPollutionSlice = createSlice({
  name: "pollution",
  initialState: {
    pollutions: [], // Ensure initial state is an array
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pollutions = action.payload; // Ensure payload is an array
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addReport.fulfilled, (state, action) => {
        state.pollutions.push(action.payload);
      })
      .addCase(editReport.fulfilled, (state, action) => {
        const index = state.pollutions.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.pollutions[index] = action.payload;
        }
      })
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.pollutions = state.pollutions.filter((item) => item._id !== action.payload);
      });
  },
});

export default repPollutionSlice.reducer;
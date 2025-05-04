// Updated repPollutionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = "http://localhost:5002";

// Fetch reports from backend
export const fetchReports = createAsyncThunk(
  "pollution/fetchReports",
  async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/reports`);
      console.log("API Response:", response.data);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to fetch pollution reports.");
      throw error;
    }
  }
);

// Add a new report
export const addReport = createAsyncThunk(
  "pollution/addReport",
  async (report, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/reports`, report);
      toast.success("Pollution report submitted!");
      return response.data;
    } catch (error) {
      toast.error("Failed to submit report");
      return rejectWithValue(error.response.data);
    }
  }
);

// Edit a report
export const editReport = createAsyncThunk(
  "pollution/editReport",
  async ({ id, ...report }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/reports/${id}`,
        report
      );
      toast.success("Pollution report updated!");
      // Refetch reports to ensure UI is in sync
      dispatch(fetchReports());
      return response.data;
    } catch (error) {
      toast.error("Failed to update report");
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete a report
export const deleteReport = createAsyncThunk(
  "pollution/deleteReport",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/reports/${id}`);
      toast.success("Pollution report deleted!");
      return id;
    } catch (error) {
      toast.error("Failed to delete report");
      return rejectWithValue(error.response.data);
    }
  }
);

// Verify a report
export const verifyReport = createAsyncThunk(
  "pollution/verifyReport",
  async ({ id, isVerified }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/reports/${id}`, {
        isVerified
      });
      toast.success(`Report ${isVerified ? 'verified' : 'unverified'} successfully`);
      // Refetch reports to ensure UI is in sync
      dispatch(fetchReports());
      return response.data;
    } catch (error) {
      toast.error("Failed to verify report");
      return rejectWithValue(error.response.data);
    }
  }
);

// Resolve a report
export const resolveReport = createAsyncThunk(
  "pollution/resolveReport",
  async ({ id, resolved }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/reports/${id}`, {
        resolved
      });
      toast.success(`Report ${resolved ? 'resolved' : 'reopened'} successfully`);
      // Refetch reports to ensure UI is in sync
      dispatch(fetchReports());
      return response.data;
    } catch (error) {
      toast.error("Failed to update report status");
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const repPollutionSlice = createSlice({
  name: "pollution",
  initialState: {
    pollutions: [],
    status: "idle",
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
        state.pollutions = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addReport.fulfilled, (state, action) => {
        state.pollutions.push(action.payload);
      })
      .addCase(editReport.fulfilled, (state, action) => {
        const index = state.pollutions.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.pollutions[index] = action.payload;
        }
      })
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.pollutions = state.pollutions.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(verifyReport.fulfilled, (state, action) => {
        const index = state.pollutions.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.pollutions[index].isVerified = action.payload.isVerified;
        }
      })
      .addCase(resolveReport.fulfilled, (state, action) => {
        const index = state.pollutions.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.pollutions[index].resolved = action.payload.resolved;
        }
      });
  },
});

export default repPollutionSlice.reducer;
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type {
  Job,
  JobStatus,
  JobStatusCounts,
} from '../types/job';

interface JobsState {
  jobs: Job[];
  statusCounts: JobStatusCounts;
  currentPage: number;
  limit: number;
  total: number;
  totalPages: number;
  selectedStatus: JobStatus | 'all';
  loading: boolean;
  error: string | null;
}

const initialState: JobsState = {
  jobs: [],
  statusCounts: {
    pending: 0,
    running: 0,
    completed: 0,
    failed: 0,
  },
  currentPage: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  selectedStatus: 'all',
  loading: false,
  error: null,
};

const jobsSlice = createSlice({
  name: 'jobs',

  initialState,

  reducers: {
    setJobs: (
      state,
      action: PayloadAction<{
        jobs: Job[];
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      }>,
    ) => {
      state.jobs = action.payload.jobs;
      state.currentPage = action.payload.page;
      state.limit = action.payload.limit;
      state.total = action.payload.total;
      state.totalPages = action.payload.totalPages;
    },

    setStatusCounts: (
      state,
      action: PayloadAction<JobStatusCounts>,
    ) => {
      state.statusCounts = action.payload;
    },

    addJob: (state, action: PayloadAction<Job>) => {
      state.jobs.unshift(action.payload);
    },

    updateJob: (state, action: PayloadAction<Job>) => {
      const index = state.jobs.findIndex(
        (job) => job.id === action.payload.id,
      );

      if (index !== -1) {
        state.jobs[index] = action.payload;
      }
    },

    removeJob: (state, action: PayloadAction<string>) => {
      state.jobs = state.jobs.filter(
        (job) => job.id !== action.payload,
      );
    },

    setSelectedStatus: (
      state,
      action: PayloadAction<JobStatus | 'all'>,
    ) => {
      state.selectedStatus = action.payload;
      state.currentPage = 1;
    },

    setCurrentPage: (
      state,
      action: PayloadAction<number>,
    ) => {
      state.currentPage = action.payload;
    },

    setLoading: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.loading = action.payload;
    },

    setError: (
      state,
      action: PayloadAction<string | null>,
    ) => {
      state.error = action.payload;
    },
  },
});

export const {
  setJobs,
  setStatusCounts,
  addJob,
  updateJob,
  removeJob,
  setSelectedStatus,
  setCurrentPage,
  setLoading,
  setError,
} = jobsSlice.actions;

export default jobsSlice.reducer;
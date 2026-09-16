export type JobStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed';

export interface Job {
  id: string;
  title: string;
  type: string;
  status: JobStatus;
  createdAt: string;
}

export interface CreateJobPayload {
  title: string;
  type: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetJobsResponse {
  data: Job[];
  pagination: Pagination;
}

export interface JobStatusCounts {
  pending: number;
  running: number;
  completed: number;
  failed: number;
}

export interface CreateJobResponse {
  message: string;
  data: Job;
}

export interface UpdateJobStatusResponse {
  message: string;
  data: Job;
}

export interface DeleteJobResponse {
  message: string;
}

export interface ApiErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}
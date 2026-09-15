import api from './api';

import type {
  CreateJobPayload,
  CreateJobResponse,
  DeleteJobResponse,
  GetJobsResponse,
  JobStatus,
  JobStatusCounts,
  UpdateJobStatusResponse,
} from '../types/job';

export const getJobs = async (
  page: number = 1,
  limit: number = 10,
  status?: JobStatus,
): Promise<GetJobsResponse> => {
  const response = await api.get<GetJobsResponse>('/jobs', {
    params: {
      page,
      limit,
      ...(status ? { status } : {}),
    },
  });

  return response.data;
};

export const getJobStatusCounts =
  async (): Promise<JobStatusCounts> => {
    const response =
      await api.get<JobStatusCounts>('/jobs/counts');

    return response.data;
  };

export const createJob = async (
  jobData: CreateJobPayload,
): Promise<CreateJobResponse> => {
  const response = await api.post<CreateJobResponse>(
    '/jobs',
    jobData,
  );

  return response.data;
};

export const updateJobStatus = async (
  id: string,
  status: JobStatus,
): Promise<UpdateJobStatusResponse> => {
  const response =
    await api.patch<UpdateJobStatusResponse>(
      `/jobs/${id}/status`,
      { status },
    );

  return response.data;
};

export const deleteJob = async (
  id: string,
): Promise<DeleteJobResponse> => {
  const response = await api.delete<DeleteJobResponse>(
    `/jobs/${id}`,
  );

  return response.data;
};
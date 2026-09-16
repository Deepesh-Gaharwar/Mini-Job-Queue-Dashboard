import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import Button from '../components/Button';
import CreateJobModal from '../components/jobs/CreateJobModal';
import ErrorMessage from '../components/ErrorMessage';
import JobFilters from '../components/JobFilters';
import JobTable from '../components/jobs/JobTable';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';
import StatusCards from '../components/StatusCards';

import { useAppDispatch, useAppSelector } from '../redux/hooks';

import {
  setCurrentPage,
  setError,
  setJobs,
  setLoading,
  setSelectedStatus,
  setStatusCounts,
} from '../redux/jobsSlice';

import {
  createJob,
  deleteJob,
  getJobStatusCounts,
  getJobs,
  updateJobStatus,
} from '../services/jobsService';

import type { JobStatus } from '../types/job';

function Dashboard() {
  const dispatch = useAppDispatch();

  const {
    jobs,
    statusCounts,
    currentPage,
    limit,
    total,
    totalPages,
    selectedStatus,
    loading,
    error,
  } = useAppSelector((state) => state.jobs);

  const [actionLoadingId, setActionLoadingId] =
    useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] =
    useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const status =
        selectedStatus === 'all'
          ? undefined
          : selectedStatus;

      const [jobsResponse, countsResponse] =
        await Promise.all([
          getJobs(currentPage, limit, status),
          getJobStatusCounts(),
        ]);

      const { pagination } = jobsResponse;

      dispatch(setStatusCounts(countsResponse));

      if (
        pagination.totalPages > 0 &&
        currentPage > pagination.totalPages
      ) {
        dispatch(
          setCurrentPage(pagination.totalPages),
        );
        return;
      }

      if (
        pagination.totalPages === 0 &&
        currentPage !== 1
      ) {
        dispatch(setCurrentPage(1));
        return;
      }

      dispatch(
        setJobs({
          jobs: jobsResponse.data,
          page: pagination.page,
          limit: pagination.limit,
          total: pagination.total,
          totalPages: pagination.totalPages,
        }),
      );
    } catch (err) {
      console.error(
        'Failed to fetch dashboard data:',
        err,
      );

      dispatch(
        setError(
          'Unable to load jobs. Please try again.',
        ),
      );
    } finally {
      dispatch(setLoading(false));
    }
  }, [
    dispatch,
    currentPage,
    limit,
    selectedStatus,
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleStatusChange = (
    status: JobStatus | 'all',
  ) => {
    dispatch(setSelectedStatus(status));
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handleCreateJob = async (
    title: string,
    type: string,
  ) => {
    try {
      const response = await createJob({
        title,
        type,
      });

      toast.success(response.message);

      await fetchDashboardData();
    } catch (err: any) {
      console.error(
        'Failed to create job:',
        err,
      );

      const message =
        err?.response?.data?.message ||
        'Failed to create job. Please try again.';

      const errorMessage = Array.isArray(message)
        ? message.join(', ')
        : message;

      toast.error(errorMessage);

      throw err;
    }
  };

  const handleJobStatusChange = async (
    id: string,
    status: JobStatus,
  ) => {
    try {
      setActionLoadingId(id);

      const response = await updateJobStatus(
        id,
        status,
      );

      toast.success(response.message);

      await fetchDashboardData();
    } catch (err: any) {
      console.error(
        'Failed to update job status:',
        err,
      );

      const message =
        err?.response?.data?.message ||
        'Failed to update job status. Please try again.';

      const errorMessage = Array.isArray(message)
        ? message.join(', ')
        : message;

      toast.error(errorMessage);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteJob = async (id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this job?',
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoadingId(id);

      const response = await deleteJob(id);

      toast.success(response.message);

      await fetchDashboardData();
    } catch (err: any) {
      console.error(
        'Failed to delete job:',
        err,
      );

      const message =
        err?.response?.data?.message ||
        'Failed to delete job. Please try again.';

      const errorMessage = Array.isArray(message)
        ? message.join(', ')
        : message;

      toast.error(errorMessage);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Job Queue Dashboard
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Monitor and manage your background jobs.
            </p>
          </div>

          <Button
            type="button"
            onClick={() =>
              setIsCreateModalOpen(true)
            }
          >
            Create Job
          </Button>
        </header>

        <div className="space-y-6">
          <StatusCards
            onStatusSelect={handleStatusChange}
          />

          <section className="rounded-lg border border-gray-200 bg-white p-6">
            <JobFilters
              onStatusChange={handleStatusChange}
            />

            {loading && (
              <div className="mt-6 flex min-h-40 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Spinner />
                  Loading jobs...
                </div>
              </div>
            )}

            {!loading && error && (
              <div className="mt-6">
                <ErrorMessage
                  message={error}
                  onRetry={fetchDashboardData}
                />
              </div>
            )}

            {!loading && !error && (
              <div className="mt-6">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing {jobs.length} of {total} jobs
                  </p>
                </div>

                <JobTable
                  jobs={jobs}
                  actionLoadingId={actionLoadingId}
                  onStatusChange={
                    handleJobStatusChange
                  }
                  onDelete={handleDeleteJob}
                />

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </section>
        </div>
      </div>

      <CreateJobModal
        isOpen={isCreateModalOpen}
        onClose={() =>
          setIsCreateModalOpen(false)
        }
        onCreate={handleCreateJob}
      />
    </main>
  );
}

export default Dashboard;
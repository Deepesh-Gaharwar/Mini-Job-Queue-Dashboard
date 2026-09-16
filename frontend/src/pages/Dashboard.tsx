import { useEffect } from 'react';

import JobFilters from '../components/JobFilters';
import StatusCards from '../components/StatusCards';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  setError,
  setJobs,
  setLoading,
  setSelectedStatus,
  setStatusCounts,
} from '../redux/jobsSlice';

import {
  getJobStatusCounts,
  getJobs,
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
    selectedStatus,
    loading,
    error,
  } = useAppSelector((state) => state.jobs);

  useEffect(() => {
    const fetchDashboardData = async () => {
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

        dispatch(
          setJobs({
            jobs: jobsResponse.data,
            page: jobsResponse.pagination.page,
            limit: jobsResponse.pagination.limit,
            total: jobsResponse.pagination.total,
            totalPages: jobsResponse.pagination.totalPages,
          }),
        );

        dispatch(setStatusCounts(countsResponse));
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
    };

    fetchDashboardData();
  }, [
    dispatch,
    currentPage,
    limit,
    selectedStatus,
  ]);

  const handleStatusChange = (
    status: JobStatus | 'all',
  ) => {
    dispatch(setSelectedStatus(status));
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Job Queue Dashboard
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Monitor and manage your background jobs.
          </p>
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
              <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
                <p className="text-sm text-gray-600">
                  Loading jobs...
                </p>
              </div>
            )}

            {!loading && error && (
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-6">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            )}

            {!loading && !error && (
              <div className="mt-6">
                {jobs.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                    <p className="text-sm font-medium text-gray-700">
                      No jobs found
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      There are no jobs matching the selected
                      status.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm text-gray-600">
                      Showing {jobs.length} of {total} jobs
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
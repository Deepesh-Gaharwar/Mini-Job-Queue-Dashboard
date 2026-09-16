import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../redux/hooks';

import {
  setError,
  setJobs,
  setLoading,
  setStatusCounts,
} from '../redux/jobsSlice';

import {
  getJobStatusCounts,
  getJobs,
} from '../services/jobsService';

function Dashboard() {
  const dispatch = useAppDispatch();

  const {
    jobs,
    statusCounts,
    currentPage,
    limit,
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

        const [jobsResponse, countsResponse] = await Promise.all([
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
        console.error('Failed to fetch dashboard data:', err);

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
  }, [dispatch, currentPage, limit, selectedStatus]);

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Job Queue Dashboard
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Monitor and manage your background jobs.
          </p>
        </div>

        {loading && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
            <p className="text-sm text-gray-600">
              Loading jobs...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <p className="text-sm text-red-700">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Status Overview
              </h2>

              <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">
                    Pending
                  </p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {statusCounts.pending}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">
                    Running
                  </p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {statusCounts.running}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">
                    Completed
                  </p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {statusCounts.completed}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">
                    Failed
                  </p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {statusCounts.failed}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Jobs
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Total jobs: {jobs.length}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Dashboard;
import { useAppSelector } from '../redux/hooks';
import type { JobStatus } from '../types/job';

interface JobFiltersProps {
  onStatusChange: (status: JobStatus | 'all') => void;
}

function JobFilters({
  onStatusChange,
}: JobFiltersProps) {
  const selectedStatus = useAppSelector(
    (state) => state.jobs.selectedStatus,
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Jobs
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Filter jobs by their current status.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <label
          htmlFor="status-filter"
          className="text-sm font-medium text-gray-700"
        >
          Status
        </label>

        <select
          id="status-filter"
          value={selectedStatus}
          onChange={(event) =>
            onStatusChange(
              event.target.value as JobStatus | 'all',
            )
          }
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="running">Running</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>
    </div>
  );
}

export default JobFilters;
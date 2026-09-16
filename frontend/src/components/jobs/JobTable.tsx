import JobRow from './JobRow';

import type { Job, JobStatus } from '../../types/job';

interface JobTableProps {
  jobs: Job[];
  actionLoadingId: string | null;
  onStatusChange: (
    id: string,
    status: JobStatus,
  ) => void;
  onDelete: (id: string) => void;
}

function JobTable({
  jobs,
  actionLoadingId,
  onStatusChange,
  onDelete,
}: JobTableProps) {
  if (jobs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <p className="text-sm font-medium text-gray-700">
          No jobs found
        </p>

        <p className="mt-1 text-sm text-gray-500">
          There are no jobs matching the selected status.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Title
            </th>

            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Type
            </th>

            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Status
            </th>

            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Created At
            </th>

            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white">
          {jobs.map((job) => (
            <JobRow
              key={job.id}
              job={job}
              actionLoading={actionLoadingId === job.id}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default JobTable;
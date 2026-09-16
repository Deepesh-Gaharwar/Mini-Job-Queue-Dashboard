import { Check, CircleAlert, Play, Trash2 } from 'lucide-react';

import StatusBadge from './StatusBadge';

import type { Job, JobStatus } from '../../types/job';

interface JobRowProps {
  job: Job;
  actionLoading: boolean;
  onStatusChange: (
    id: string,
    status: JobStatus,
  ) => void;
  onDelete: (id: string) => void;
}

function JobRow({
  job,
  actionLoading,
  onStatusChange,
  onDelete,
}: JobRowProps) {
  const canStart = job.status === 'pending';

  const canComplete = job.status === 'running';

  const canFail =
    job.status === 'pending' ||
    job.status === 'running';

  return (
    <tr className="border-b border-gray-200 last:border-b-0">
      <td className="px-4 py-4">
        <div className="font-medium text-gray-900">
          {job.title}
        </div>
      </td>

      <td className="px-4 py-4">
        <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
          {job.type}
        </span>
      </td>

      <td className="px-4 py-4">
        <StatusBadge status={job.status} />
      </td>

      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
        {new Date(job.createdAt).toLocaleString()}
      </td>

      <td className="px-4 py-4">
        <div className="flex flex-wrap items-center gap-2">
          {canStart && (
            <button
              type="button"
              disabled={actionLoading}
              onClick={() =>
                onStatusChange(job.id, 'running')
              }
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Play size={14} />
              Start
            </button>
          )}

          {canComplete && (
            <button
              type="button"
              disabled={actionLoading}
              onClick={() =>
                onStatusChange(job.id, 'completed')
              }
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check size={14} />
              Complete
            </button>
          )}

          {canFail && (
            <button
              type="button"
              disabled={actionLoading}
              onClick={() =>
                onStatusChange(job.id, 'failed')
              }
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CircleAlert size={14} />
              Fail
            </button>
          )}

          <button
            type="button"
            disabled={actionLoading}
            onClick={() => onDelete(job.id)}
            className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={14} />
            Delete
          </button>

          {actionLoading && (
            <span className="text-xs text-gray-500">
              Updating...
            </span>
          )}
        </div>
      </td>
    </tr>
  );
}

export default JobRow;
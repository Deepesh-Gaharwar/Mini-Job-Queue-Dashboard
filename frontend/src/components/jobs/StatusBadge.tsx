import type { JobStatus } from '../../types/job';

interface StatusBadgeProps {
  status: JobStatus;
}

const statusStyles: Record<JobStatus, string> = {
  pending: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
  running: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  completed: 'bg-green-50 text-green-700 ring-green-600/20',
  failed: 'bg-red-50 text-red-700 ring-red-600/20',
};

function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
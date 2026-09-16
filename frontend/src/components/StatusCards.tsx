import { useAppSelector } from '../redux/hooks';
import type { JobStatus } from '../types/job';

interface StatusCardsProps {
  onStatusSelect?: (status: JobStatus) => void;
}

const statusConfig: {
  status: JobStatus;
  label: string;
}[] = [
  {
    status: 'pending',
    label: 'Pending',
  },
  {
    status: 'running',
    label: 'Running',
  },
  {
    status: 'completed',
    label: 'Completed',
  },
  {
    status: 'failed',
    label: 'Failed',
  },
];

function StatusCards({ onStatusSelect }: StatusCardsProps) {
  const { statusCounts, selectedStatus } = useAppSelector(
    (state) => state.jobs,
  );

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Status Overview
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Current status of all jobs.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statusConfig.map(({ status, label }) => {
          const isSelected = selectedStatus === status;

          return (
            <button
              key={status}
              type="button"
              onClick={() => onStatusSelect?.(status)}
              className={`rounded-lg border p-4 text-left transition ${
                isSelected
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <p className="text-sm text-gray-500">
                {label}
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {statusCounts[status]}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default StatusCards;
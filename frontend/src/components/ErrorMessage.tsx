import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

function ErrorMessage({
  message,
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6">
      <div className="flex items-start gap-3">
        <AlertCircle
          size={20}
          className="mt-0.5 shrink-0 text-red-600"
        />

        <div>
          <p className="text-sm font-medium text-red-800">
            Something went wrong
          </p>

          <p className="mt-1 text-sm text-red-700">
            {message}
          </p>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 text-sm font-medium text-red-800 underline underline-offset-2 hover:text-red-900"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ErrorMessage;
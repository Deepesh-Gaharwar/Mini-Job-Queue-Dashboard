import { useState } from 'react';

import Button from '../Button';
import Modal from '../Modal';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (
    title: string,
    type: string,
  ) => Promise<void>;
}

function CreateJobModal({
  isOpen,
  onClose,
  onCreate,
}: CreateJobModalProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [submitting, setSubmitting] =
    useState(false);
  const [validationError, setValidationError] =
    useState<string | null>(null);

  const resetForm = () => {
    setTitle('');
    setType('');
    setValidationError(null);
  };

  const handleClose = () => {
    if (submitting) {
      return;
    }

    resetForm();
    onClose();
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedType = type.trim();

    if (!trimmedTitle) {
      setValidationError('Job title is required.');
      return;
    }

    if (trimmedTitle.length > 100) {
      setValidationError(
        'Job title must be 100 characters or less.',
      );
      return;
    }

    if (!trimmedType) {
      setValidationError('Job type is required.');
      return;
    }

    if (trimmedType.length > 50) {
      setValidationError(
        'Job type must be 50 characters or less.',
      );
      return;
    }

    try {
      setValidationError(null);
      setSubmitting(true);

      await onCreate(
        trimmedTitle,
        trimmedType,
      );

      resetForm();
      onClose();
    } catch {
      // Parent handles the API error/toast.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Job"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div>
          <label
            htmlFor="job-title"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Job Title
          </label>

          <input
            id="job-title"
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="e.g. Generate monthly report"
            maxLength={100}
            disabled={submitting}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:bg-gray-100"
          />

          <p className="mt-1 text-xs text-gray-500">
            Maximum 100 characters.
          </p>
        </div>

        <div>
          <label
            htmlFor="job-type"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Job Type
          </label>

          <input
            id="job-type"
            type="text"
            value={type}
            onChange={(event) =>
              setType(event.target.value)
            }
            placeholder="e.g. report"
            maxLength={50}
            disabled={submitting}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:bg-gray-100"
          />

          <p className="mt-1 text-xs text-gray-500">
            Maximum 50 characters.
          </p>
        </div>

        {validationError && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2">
            <p className="text-sm text-red-700">
              {validationError}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={submitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            loading={submitting}
          >
            Create Job
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateJobModal;
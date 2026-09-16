import { LoaderCircle } from 'lucide-react';

interface SpinnerProps {
  size?: number;
}

function Spinner({ size = 20 }: SpinnerProps) {
  return (
    <LoaderCircle
      size={size}
      className="animate-spin text-gray-600"
      aria-label="Loading"
    />
  );
}

export default Spinner;
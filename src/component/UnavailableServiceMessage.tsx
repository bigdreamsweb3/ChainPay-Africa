import React from "react";

interface UnavailableServiceMessageProps {
  serviceName: string;
}

const UnavailableServiceMessage: React.FC<UnavailableServiceMessageProps> = ({ serviceName }) => {
  return (
    <div className="text-center bg-chainpay-blue-light/25 dark:bg-chainpay-blue-dark/10 rounded-lg p-6 max-w-md mx-auto transition-colors duration-300">
      <svg
        className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 9l4-4 4 4m0 6l-4 4-4-4"
        />
      </svg>
      <p className="text-lg font-semibold text-gray-700 dark:text-text-light mb-2">
        {serviceName} is currently unavailable
      </p>
      <p className="text-sm text-gray-500 dark:text-text-muted/70">
        We&apos;re working hard to bring this service to you soon!
      </p>
      <p className="text-xs text-blue-500 dark:text-blue-400 mt-4 font-medium">
        (Coming Soon)
      </p>
    </div>
  );
};

export default UnavailableServiceMessage;

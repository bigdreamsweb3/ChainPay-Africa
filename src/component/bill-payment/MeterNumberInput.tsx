import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Asterisk } from 'lucide-react';

interface MeterNumberInputProps {
  error?: string;
}

const MeterNumberInput: React.FC<MeterNumberInputProps> = ({ error }) => {
  const { register } = useFormContext();

  return (
    <div className="space-y-3 bg-white dark:bg-background-dark rounded-lg p-4 shadow-md dark:shadow-lg dark:shadow-background-dark/20 border border-chainpay-blue-light/20 dark:border-chainpay-blue-dark/20 transition-colors duration-300">
      <label className="text-sm font-medium text-gray-700 dark:text-text-light flex items-center gap-1">
        <Asterisk className="w-4 h-4 text-chainpay-blue" />
        Meter Number
      </label>
      <div className="relative">
        <Asterisk className="absolute left-3 top-1/2 transform -translate-y-1/2 text-chainpay-blue-light dark:text-chainpay-blue-dark/70 w-4 h-4" />
        <input
          type="text"
          placeholder="Enter meter number"
          {...register("meterNumber", {
            required: "Meter number is required",
            validate: (value) => {
              const isValid = /^\d{11}$/.test(value);
              return isValid || "Meter number must be 11 digits";
            },
          })}
          className="w-full h-10 pl-9 pr-3 text-sm font-medium rounded-lg border border-chainpay-blue-light/30 dark:border-chainpay-blue-dark/30
            hover:border-chainpay-blue dark:hover:border-chainpay-blue-dark focus:outline-none focus:ring-2 focus:ring-chainpay-blue dark:focus:ring-chainpay-blue-dark focus:border-chainpay-blue dark:focus:border-chainpay-blue-dark
            bg-white dark:bg-background-dark placeholder:text-chainpay-blue-light/50 dark:placeholder:text-chainpay-blue-dark/50 transition-all duration-200 shadow-sm"
        />
      </div>
      {error && <p className="mt-1 text-sm text-status-error font-medium">{error}</p>}
    </div>
  );
};

export default MeterNumberInput; 
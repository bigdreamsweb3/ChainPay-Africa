import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Asterisk } from 'lucide-react';

interface MeterNumberInputProps {
  error?: string;
}

const MeterNumberInput: React.FC<MeterNumberInputProps> = ({ error }) => {
  const { register } = useFormContext();

  return (
    <div className="space-y-3 bg-white rounded-lg p-4 shadow-md border border-chainpay-blue-light/20">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
        <Asterisk className="w-4 h-4 text-chainpay-blue" />
        Meter Number
      </label>
      <div className="relative">
        <Asterisk className="absolute left-3 top-1/2 transform -translate-y-1/2 text-chainpay-blue-light w-4 h-4" />
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
          className="w-full h-10 pl-9 pr-3 text-sm font-medium rounded-lg border border-chainpay-blue-light/30
            hover:border-chainpay-blue focus:outline-none focus:ring-2 focus:ring-chainpay-blue focus:border-chainpay-blue
            bg-white placeholder:text-chainpay-blue-light/50 transition-all duration-200 shadow-sm"
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600 font-medium">{error}</p>}
    </div>
  );
};

export default MeterNumberInput; 
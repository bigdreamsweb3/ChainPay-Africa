import React from 'react';
import { useFormContext } from 'react-hook-form';

interface MeterNumberInputProps {
  error?: string;
}

const MeterNumberInput: React.FC<MeterNumberInputProps> = ({ error }) => {
  const { register } = useFormContext();

  return (
    <div>
      <label className="block text-sm text-gray-700 mb-2">Meter Number</label>
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
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default MeterNumberInput; 
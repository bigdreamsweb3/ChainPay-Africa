"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  Wifi,
  Zap,
  CreditCard,
  DollarSign,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const billPaymentSchema = z.object({
  serviceType: z.enum(["airtime", "data", "electricity"]),
  phoneNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{10}$/.test(val), {
      message: "Phone number must be 10 digits",
    }),
  meterNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{11}$/.test(val), {
      message: "Meter number must be 11 digits",
    }),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0,
      {
        message: "Amount must be a positive number",
      }
    ),
  paymentToken: z.enum(["BNB", "USDC"]),
});

type BillPaymentFormData = z.infer<typeof billPaymentSchema>;

const services = [
  { id: "airtime", name: "Airtime", icon: Smartphone },
  { id: "data", name: "Data", icon: Wifi },
  { id: "electricity", name: "Electricity", icon: Zap },
] as const;

const paymentTokens = [
  { id: "BNB", name: "BNB", description: "Pay with BNB", icon: CreditCard },
  { id: "USDC", name: "USDC", description: "Pay with USDC", icon: DollarSign },
];

const steps = ["Service", "Details", "Payment", "Confirm"];

export default function BillPaymentForm() {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<BillPaymentFormData>({
    resolver: zodResolver(billPaymentSchema),
    defaultValues: {
      serviceType: "airtime",
      paymentToken: "BNB",
    },
  });

  const selectedService = watch("serviceType");
  const selectedToken = watch("paymentToken");

  const onSubmit = async (data: BillPaymentFormData) => {
    console.log(data);
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSubmitStatus("success");
      reset();
      setStep(0);
    } catch (error) {
      console.log(error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () =>
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  useEffect(() => {
    if (submitStatus !== "idle") {
      const timer = setTimeout(() => setSubmitStatus("idle"), 3000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        className="bg-white rounded-3xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="py-4 px-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="tex-lg font-semibold text-gray-800">Bill Payment</h2>
          <p className="text-sm text-gray-500">
            Step {step + 1} of {steps.length}
          </p>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {step === 0 && (
                  <div className="flex flex-col items-start gap-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Service
                    </label>

                    <div className="flex flex-wrap gap-7">
                      {services.map((service) => (
                        <Controller
                          key={service.id}
                          name="serviceType"
                          control={control}
                          render={({ field }) => (
                            <div className="flex flex-col items-center w-fit">
                              <button
                                type="button"
                                onClick={() => field.onChange(service.id)}
                                className={`p-4 rounded-lg transition-all flex flex-col items-center border-2 ${
                                  field.value === service.id
                                    ? "bg-blue-100 border-2 border-blue-500"
                                    : "bg-gray-100 border-2 border-transparent hover:bg-gray-200"
                                }`}
                              >
                                <service.icon className="w-6 h-6" />
                              </button>
                              <span className="text-sm">{service.name}</span>
                            </div>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <>
                    <div>
                      <label
                        htmlFor="input"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        {selectedService === "electricity"
                          ? "Meter Number"
                          : "Phone Number"}
                      </label>
                      <input
                        id="input"
                        type={
                          selectedService === "electricity" ? "text" : "tel"
                        }
                        placeholder={`Enter ${
                          selectedService === "electricity"
                            ? "meter number"
                            : "phone number"
                        }`}
                        {...register(
                          selectedService === "electricity"
                            ? "meterNumber"
                            : "phoneNumber"
                        )}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors[
                        selectedService === "electricity"
                          ? "meterNumber"
                          : "phoneNumber"
                      ] && (
                        <p className="mt-1 text-sm text-red-600">
                          {
                            errors[
                              selectedService === "electricity"
                                ? "meterNumber"
                                : "phoneNumber"
                            ]?.message
                          }
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="amount"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Amount
                      </label>
                      <input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="Enter amount"
                        {...register("amount")}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.amount && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.amount.message}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {["10", "20", "50", "100"].map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => setValue("amount", amount)}
                          className="px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                        >
                          {amount}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {step === 2 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Payment Token
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {paymentTokens.map((token) => (
                        <div key={token.id}>
                          <input
                            type="radio"
                            id={token.id}
                            value={token.id}
                            {...register("paymentToken")}
                            className="sr-only"
                          />
                          <label
                            htmlFor={token.id}
                            className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                              selectedToken === token.id
                                ? "bg-blue-100 border-blue-500"
                                : "bg-white border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            <token.icon className="w-6 h-6 mb-2" />
                            <span className="text-lg font-semibold">
                              {token.name}
                            </span>
                            <span className="text-sm text-gray-600">
                              {token.description}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Confirm Payment</h3>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <p>
                        <strong>Service:</strong> {watch("serviceType")}
                      </p>
                      <p>
                        <strong>
                          {watch("serviceType") === "electricity"
                            ? "Meter Number"
                            : "Phone Number"}
                        </strong>
                        :{" "}
                        {watch("serviceType") === "electricity"
                          ? watch("meterNumber")
                          : watch("phoneNumber")}
                      </p>
                      <p>
                        <strong>Amount:</strong> {watch("amount")}
                      </p>
                      <p>
                        <strong>Payment Token:</strong> {watch("paymentToken")}
                      </p>
                    </div>
                  </div>
                )}
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="px-6 py-4 flex justify-between">
          {step > 0 && (
            <button
              onClick={prevStep}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-800 rounded-xl hover:opacity-90 transition-opacity"
            >
              Previous
            </button>
          )}
          {step < steps.length - 1 ? (
            <button
              onClick={nextStep}
              className="lex items-center gap-2 px-6 py-2 bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-xl hover:opacity-90 transition-opacity"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {isSubmitting ? "Processing..." : "Confirm Payment"}
            </button>
          )}
        </div>
        <AnimatePresence>
          {submitStatus !== "idle" && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className={`p-4 ${
                submitStatus === "success" ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {submitStatus === "success" ? (
                <div className="flex items-center text-status-success">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Payment successful!
                </div>
              ) : (
                <div className="flex items-center text-status-error">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Payment failed. Please try again.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

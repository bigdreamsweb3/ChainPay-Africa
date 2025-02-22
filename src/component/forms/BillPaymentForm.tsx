"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
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
  ArrowLeft,
} from "lucide-react";
import PhoneNumberInput from "./InputComponents/NetworkPhoneHandler";
import MeterNumberInput from "./InputComponents/MeterNumberInput";

const billPaymentSchema = z.object({
  serviceType: z.enum(["airtime", "data", "electricity"]),
  phoneNumber: z.string().optional(),
  meterNumber: z.string().optional(),
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

const BillPaymentForm: React.FC = () => {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [carrier, setCarrier] = useState<{ id: string | null; name: string | null; iconUrl: string | null }>({
    id: null,
    name: null,
    iconUrl: null,
  });

  const methods = useForm<BillPaymentFormData>({
    resolver: zodResolver(billPaymentSchema),
    defaultValues: {
      serviceType: undefined,
      paymentToken: "BNB",
    },
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = methods;

  const selectedService = watch("serviceType");
  const selectedToken = watch("paymentToken");

  const onSubmit = async (data: BillPaymentFormData) => {
    const purchaseData = {
      ...data,
      network: (selectedService === "airtime" || selectedService === "data") ? carrier : null,
    };
    console.log(purchaseData);
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSubmitStatus("success");
      reset(); // Reset form only after successful submission
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
    <FormProvider {...methods}>
      <motion.div
        className="w-full max-w-md mx-auto bg-white rounded-lg shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="p-4">
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
                  <div className="flex flex-wrap justify-start gap-6">
                    {services.map((service) => (
                      <Controller
                        key={service.id}
                        name="serviceType"
                        control={control}
                        render={({ field }) => (
                          <div className="flex flex-col items-center w-fit">
                            <button
                              type="button"
                              onClick={() => {
                                field.onChange(service.id);
                                nextStep();
                              }}
                              aria-label={`Select ${service.name}`}
                              className="p-2 rounded-full transition-all duration-300 ease-in-out flex flex-col items-center w-full border-2 border-blue-100/50 bg-blue-200/70"
                            >
                              <service.icon className="w-10 h-10 text-brand-primary rounded-full p-2" />
                            </button>
                            <span className="mt-2 text-sm font-medium text-gray-700 text-center">
                              {service.name}
                            </span>
                          </div>
                        )}
                      />
                    ))}
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={prevStep}
                        className="p-2 rounded-full hover:bg-gray-100 flex items-center gap-2"
                      >
                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                        <span className="text-sm text-gray-700 capitalize">
                          {watch("serviceType")}
                        </span>
                      </button>
                    </div>

                    {selectedService === "electricity" ? (
                      <MeterNumberInput error={errors.meterNumber?.message} />
                    ) : (
                      <PhoneNumberInput
                        error={errors.phoneNumber?.message}
                        onCarrierChange={(carrier) => setCarrier(carrier)}
                      />
                    )}

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Amount
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Enter amount"
                        {...register("amount")}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                      />
                      {errors.amount && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.amount.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={prevStep}
                        className="p-2 rounded-full hover:bg-gray-100 flex items-center gap-2"
                      >
                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                        <span className="text-sm text-gray-700 capitalize">
                          {watch("serviceType")}
                        </span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm text-gray-700">
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
                              className={`p-4 rounded-lg flex flex-col items-center transition-all ${
                                selectedToken === token.id
                                  ? "bg-blue-50 border border-blue-500"
                                  : "bg-gray-50 hover:bg-gray-100"
                              }`}
                            >
                              <token.icon className="w-6 h-6 text-gray-700" />
                              <span className="mt-2 text-sm text-gray-700">
                                {token.name}
                              </span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={prevStep}
                        className="p-2 rounded-full hover:bg-gray-100 flex items-center gap-2"
                      >
                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                        <span className="text-sm text-gray-700 capitalize">
                          {watch("serviceType")}
                        </span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Confirm Payment
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>Service:</strong> {watch("serviceType")}
                        </p>
                        <p className="text-sm text-gray-700">
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
                        { (selectedService === "airtime" || selectedService === "data") && carrier && (
                          <p className="text-sm text-gray-700">
                            <strong>Network:</strong> {carrier.name}
                          </p>
                        )}
                        <p className="text-sm text-gray-700">
                          <strong>Amount:</strong> {watch("amount")}
                        </p>
                        <p className="text-sm text-gray-700">
                          <strong>Payment Token:</strong>{" "}
                          {watch("paymentToken")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </motion.div>
          </AnimatePresence>
        </div>

        {step > 0 && step < steps.length - 1 && (
          <div className="p-4 border-t border-gray-100 flex justify-between">
            <button
              onClick={prevStep}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Previous
            </button>
            <button
              onClick={nextStep}
              className="px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
            >
              Next
            </button>
          </div>
        )}

        {step === steps.length - 1 && (
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="w-full px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
            >
              {isSubmitting ? "Processing..." : "Confirm Payment"}
            </button>
          </div>
        )}

        <AnimatePresence>
          {submitStatus !== "idle" && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className={`p-4 ${
                submitStatus === "success" ? "bg-green-50" : "bg-red-50"
              }`}
            >
              {submitStatus === "success" ? (
                <div className="flex items-center text-green-700">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Payment successful!
                </div>
              ) : (
                <div className="flex items-center text-red-700">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Payment failed. Please try again.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </FormProvider>
  );
};

export default BillPaymentForm;
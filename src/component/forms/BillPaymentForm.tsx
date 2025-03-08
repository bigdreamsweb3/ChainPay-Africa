"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import PhoneNumberInput from "./InputComponents/NetworkPhoneHandler";
import MeterNumberInput from "./InputComponents/MeterNumberInput";
import PaymentReceipt from "../PaymentReceipt";
import ServiceSelection from "./SelectionComponents/ServiceSelection";
import { useAcceptedTokens, PaymentToken } from "@/utils/web3/config";
import UnavailableServiceMessage from "./UnavailableServiceMessage";
import PaymentTokenSelector from "./SelectionComponents/PaymentTokenSelector";
import PaymentConfirmation from "./PaymentConfirmation";
import { appConfig } from "@/app-config";

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
  paymentToken: z.string(),
});

type BillPaymentFormData = z.infer<typeof billPaymentSchema>;

const steps = ["Service", "Details", "Payment", "Confirm"];

const BillPaymentForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [transactionDetails, setTransactionDetails] = useState<{
    transactionId: string;
    timestamp: string;
    blockchainTxHash: string;
    blockNumber: number;
    gasUsed: string;
    walletAddress: string;
  } | null>(null);
  const [carrier, setCarrier] = useState<{
    id: string | null;
    name: string | null;
    iconUrl: string | null;
    enum_value: number;
  }>({
    id: null,
    name: null,
    iconUrl: null,
    enum_value: 0,
  });
  const [unavailableServiceMessage, setUnavailableServiceMessage] = useState<
    string | null
  >(null);
  const [selectedTokenId, setSelectedTokenId] = useState<string>("");

  const methods = useForm<BillPaymentFormData>({
    resolver: zodResolver(billPaymentSchema),
    defaultValues: {
      serviceType: "airtime",
      paymentToken: "",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = methods;

  const selectedService = watch("serviceType");

  const paymentTokens: PaymentToken[] = useAcceptedTokens();
  const selectedTokenDetails = paymentTokens.find(
    (token) => token.id === selectedTokenId
  );

  useEffect(() => {
    if (appConfig.availableServices.includes("Airtime")) {
      setValue("serviceType", "airtime");
      setStep(1);
      setUnavailableServiceMessage(null);
    } else {
      setStep(0);
      setUnavailableServiceMessage("Airtime");
    }
  }, [setValue]);

  const onSubmit = async (data: BillPaymentFormData) => {
    console.log("Submitting payment with data:", data);
    const purchaseData = {
      ...data,
      network:
        selectedService === "airtime" || selectedService === "data"
          ? carrier
          : null,
    };
    console.log(purchaseData);
    setIsSubmitting(true);
    setSubmitStatus("processing");
    try {
      // Simulate API call and blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSubmitStatus("success");
      setTransactionDetails({
        transactionId: `TXN${Math.random()
          .toString(36)
          .substr(2, 9)
          .toUpperCase()}`,
        timestamp: new Date().toLocaleString(),
        blockchainTxHash: `0x${Math.random().toString(36).substr(2, 40)}`,
        blockNumber: Math.floor(Math.random() * 1000000) + 1,
        gasUsed: (Math.random() * 0.1).toFixed(8),
        walletAddress: `0x${Math.random().toString(36).substr(2, 40)}`,
      });
    } catch (error) {
      console.error(error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () =>
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const resetForm = () => {
    reset();
    setStep(1);
    setSubmitStatus("idle");
    setTransactionDetails(null);
  };

  useEffect(() => {
    if (submitStatus === "error") {
      const timer = setTimeout(() => setSubmitStatus("idle"), 3000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const isAvailable = appConfig.availableServices.includes(
    selectedService.charAt(0).toUpperCase() + selectedService.slice(1)
  );

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col items-center justify-center gap-2.5 sm:gap-5">
        <ServiceSelection
          control={methods.control}
          selectedService={selectedService}
          setStep={setStep}
          setUnavailableServiceMessage={setUnavailableServiceMessage}
        />

        <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6">

          <AnimatePresence>
            {selectedService && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                {unavailableServiceMessage ? (
                  <UnavailableServiceMessage serviceName={selectedService} />
                ) : submitStatus === "success" && transactionDetails ? (
                  <PaymentReceipt
                    transactionId={transactionDetails.transactionId}
                    serviceType={selectedService}
                    amount={watch("amount") || ""}
                    paymentToken={
                      selectedTokenDetails ? selectedTokenDetails.symbol : ""
                    }
                    recipientInfo={
                      selectedService === "electricity"
                        ? watch("meterNumber") || ""
                        : watch("phoneNumber") || ""
                    }
                    timestamp={transactionDetails.timestamp}
                    blockchainTxHash={transactionDetails.blockchainTxHash}
                    blockNumber={transactionDetails.blockNumber}
                    gasUsed={transactionDetails.gasUsed}
                    walletAddress={transactionDetails.walletAddress}
                    onReset={resetForm}
                  />
                ) : (
                  <div className="space-y-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                      >
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                          {step === 1 && (
                            <>
                              {selectedService === "electricity" ? (
                                <MeterNumberInput
                                  error={errors.meterNumber?.message}
                                />
                              ) : (
                                <PhoneNumberInput
                                  error={errors.phoneNumber?.message}
                                  onCarrierChange={(carrier) => setCarrier(carrier)}
                                />
                              )}

                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Amount
                                </label>
                                <input
                                  type="number"
                                  step="0.01"
                                  placeholder="Enter amount"
                                  {...register("amount")}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.amount && (
                                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.amount.message}
                                  </p>
                                )}
                              </div>

                              <div className="pt-2">
                                <PaymentTokenSelector
                                  paymentTokens={paymentTokens}
                                  selectedToken={selectedTokenId}
                                  setSelectedToken={setSelectedTokenId}
                                />
                              </div>
                            </>
                          )}

                          {step === 2 && (
                            <PaymentConfirmation
                              selectedService={selectedService}
                              watch={watch}
                              carrier={carrier}
                              selectedTokenDetails={selectedTokenDetails}
                            />
                          )}
                        </form>
                      </motion.div>
                    </AnimatePresence>

                    {submitStatus !== "success" && isAvailable && (
                      <>
                        {step > 0 && step < steps.length - 2 && (
                          <div className="flex justify-between pt-3 border-t border-gray-100">
                            {step > 1 && (
                              <button
                                type="button"
                                onClick={prevStep}
                                disabled={isSubmitting}
                                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                              >
                                Previous
                              </button>
                            )}

                            <div className="flex items-center gap-2 w-full justify-end">
                              <motion.button
                                type="button"
                                whileInView={{ scale: 1.02 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={nextStep}
                                className="relative gap-2 py-2 rounded-lg text-sm md:text-base transition-all duration-200 ease-in-out flex flex-col items-center w-24 border-brand-primary bg-gradient-to-r from-[#0099FF] to-[#0066FF] text-white shadow-md"
                              >
                                Next
                              </motion.button>
                            </div>
                          </div>
                        )}

                        <AnimatePresence>
                          {submitStatus === "error" && (
                            <motion.div
                              initial={{ opacity: 0, y: 50 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 50 }}
                              className="p-4 mt-4 bg-red-50 rounded-lg"
                            >
                              <div className="flex items-center text-red-700">
                                <AlertCircle className="w-5 h-5 mr-2" />
                                Payment failed. Please try again.
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </FormProvider>
  );
};

export default BillPaymentForm;
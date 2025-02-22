"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  DollarSign,
  AlertCircle,
  Loader2,
  ArrowLeft,
  X,
} from "lucide-react";
import PhoneNumberInput from "./InputComponents/NetworkPhoneHandler";
import MeterNumberInput from "./InputComponents/MeterNumberInput";
import PaymentReceipt from "../PaymentReceipt";
import ServiceSelection from "./InputComponents/ServiceSelection";

import { getBalance } from "@wagmi/core";
import { useAccount } from "wagmi";
import { wagmiConfig } from "@/utils/web3/config";

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

const BillPaymentForm: React.FC = () => {
  const { address } = useAccount();
  const [step, setStep] = useState(0);
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
  }>({
    id: null,
    name: null,
    iconUrl: null,
  });

  const [paymentTokens, setPaymentTokens] = useState([
    { id: "BNB", name: "BNB", description: "Pay with BNB", icon: CreditCard },
    { id: "USDC", name: "USDC", description: "Pay with USDC", icon: DollarSign },
  ]);

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

  const Balance = async () => {
    if (!address) {
      throw new Error("Address is undefined. Please connect your wallet.");
    }

    const balance = await getBalance(wagmiConfig, {
      address: address,
    });

    return balance.symbol;
  };

  const updatePaymentTokens = useCallback(async () => {
    const networkTokenSymbol = await Balance();
    
    setPaymentTokens((prevTokens) => [
      { id: networkTokenSymbol, name: networkTokenSymbol, description: `Pay with ${networkTokenSymbol}`, icon: CreditCard },
      ...prevTokens.slice(1),
    ]);
  }, [Balance]);

  useEffect(() => {
    updatePaymentTokens();
  }, [address, updatePaymentTokens]);

  const steps = ["Service", "Details", "Payment", "Confirm"];

  const onSubmit = async (data: BillPaymentFormData) => {
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
    setStep(0);
    setSubmitStatus("idle");
    setTransactionDetails(null);
  };

  useEffect(() => {
    if (submitStatus === "error") {
      const timer = setTimeout(() => setSubmitStatus("idle"), 3000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col items-center justify-center gap-4">
        <ServiceSelection
          control={control}
          selectedService={selectedService}
          setStep={setStep}
        />

        <AnimatePresence>
          {selectedService && (
            <motion.div
              className="w-full max-w-md mx-auto bg-gradient-to-br from-blue-100 to-blue-100 rounded-2xl shadow-sm p-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {submitStatus === "success" && transactionDetails ? (
                <PaymentReceipt
                  transactionId={transactionDetails.transactionId}
                  serviceType={selectedService}
                  amount={watch("amount") || ""}
                  paymentToken={selectedToken}
                  recipientInfo={
                    selectedService === "electricity"
                      ? watch("meterNumber") || ""
                      : watch("phoneNumber") || ""
                  }
                  timestamp={transactionDetails.timestamp}
                  blockchainTxHash={transactionDetails.blockchainTxHash}
                  blockNumber={transactionDetails.blockNumber}
                  gasUsed={transactionDetails.gasUsed}
                  onReset={resetForm}
                  walletAddress={transactionDetails.walletAddress}
                />
              ) : (
                <div className="p-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                    >
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                      >
                        {step === 1 && (
                          <div className="space-y-6">
                            <div className="flex items-center">
                              <button
                                type="button"
                                onClick={() => {
                                  prevStep();
                                  reset({ serviceType: undefined });
                                }}
                                className="p-2 rounded-md bg-gray-400 text-white hover:bg-red-500 transition-colors duration-200 flex items-center gap-2"
                              >
                                {step === 1 ? (
                                  <X className="w-5 h-5" />
                                ) : (
                                  <ArrowLeft className="w-5 h-5" />
                                )}
                              </button>

                              <span className="text-sm bg-white p-2 rounded-lg text-blue-600 font-bold capitalize ml-2">
                                {selectedService}
                              </span>
                            </div>

                            {selectedService === "electricity" ? (
                              <MeterNumberInput
                                error={errors.meterNumber?.message}
                              />
                            ) : (
                              <PhoneNumberInput
                                error={errors.phoneNumber?.message}
                                onCarrierChange={(carrier) =>
                                  setCarrier(carrier)
                                }
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
                            <div className="flex items-center">
                              <button
                                type="button"
                                onClick={prevStep}
                                className="p-2 rounded-md bg-yellow-400 text-white hover:bg-yellow-500 transition-colors duration-200 flex items-center gap-2"
                              >
                                <ArrowLeft className="w-5 h-5" />
                              </button>

                              <span className="text-sm bg-white p-2 rounded-lg text-blue-600 font-bold capitalize ml-2">
                                {selectedService}
                              </span>
                            </div>

                            <div className="space-y-4">
                              <label className="block text-sm text-gray-700 font-bold">
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
                                          ? "bg-green-100 border-2 border-green-500"
                                          : "bg-white hover:bg-gray-100"
                                      }`}
                                    >
                                      <token.icon className="w-8 h-8 text-blue-600" />
                                      <span className="mt-2 text-sm font-bold text-gray-700">
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
                            <div className="flex items-center">
                              <button
                                type="button"
                                onClick={prevStep}
                                className="p-2 rounded-md bg-green-400 text-white hover:bg-green-500 transition-colors duration-200 flex items-center gap-2"
                              >
                                <ArrowLeft className="w-5 h-5" />
                              </button>

                              <span className="text-sm bg-white p-2 rounded-lg text-blue-600 font-bold capitalize ml-2">
                                {selectedService}
                              </span>
                            </div>

                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-gray-800">
                                Confirm Payment
                              </h3>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-700">
                                  <strong>Service:</strong> {selectedService}
                                </p>
                                <p className="text-sm text-gray-700">
                                  <strong>
                                    {selectedService === "electricity"
                                      ? "Meter Number"
                                      : "Phone Number"}
                                  </strong>
                                  :{" "}
                                  {selectedService === "electricity"
                                    ? watch("meterNumber")
                                    : watch("phoneNumber")}
                                </p>
                                {(selectedService === "airtime" ||
                                  selectedService === "data") &&
                                  carrier && (
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
              )}

              {submitStatus !== "success" && (
                <>
                  {step > 0 && step < steps.length - 1 && (
                    <div className="p-4 border-t border-gray-100 flex justify-between w-full max-w-md mx-auto">
                      {step > 1 && (
                        <button
                          type="button"
                          onClick={prevStep}
                          disabled={isSubmitting}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                          Previous
                        </button>
                      )}

                      <div className="flex items-center gap-2 w-full justify-end">
                        <button
                          type="button"
                          onClick={nextStep}
                          className="px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                  {step === steps.length - 1 && (
                    <div className="p-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center justify-center"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Confirm Payment"
                        )}
                      </button>
                    </div>
                  )}

                  <AnimatePresence>
                    {submitStatus === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="p-4 bg-red-50"
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FormProvider>
  );
};

export default BillPaymentForm;

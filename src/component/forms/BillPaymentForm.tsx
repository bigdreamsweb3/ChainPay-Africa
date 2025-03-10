"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Loader2 } from "lucide-react";
import { useAccount, useConnect } from "wagmi";
import PhoneNumberInput from "./InputComponents/NetworkPhoneHandler";
import MeterNumberInput from "./InputComponents/MeterNumberInput";
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
      (val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) >= 50, // Ensure amount is at least 50
      {
        message: "Minimum amount is 50 credit units",
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
  const [isConverting, setIsConverting] = useState(false);
  const [convertedAmount, setConvertedAmount] = useState<string>("0.00");
  const [displayAmount, setDisplayAmount] = useState<string>("0");
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
  const [isPaymentConfirmationOpen, setIsPaymentConfirmationOpen] = useState(false);
  const [serviceSwitchCount, setServiceSwitchCount] = useState(0);
  const prevServiceRef = useRef<string | null>(null);

  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  const methods = useForm<BillPaymentFormData>({
    resolver: zodResolver(billPaymentSchema),
    defaultValues: {
      serviceType: "airtime",
      paymentToken: "",
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = methods;

  const selectedService = watch("serviceType");
  const amount = watch("amount");

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

  // Track service changes to optimize calculations
  useEffect(() => {
    // Only count actual changes
    if (prevServiceRef.current !== selectedService && prevServiceRef.current !== null) {
      setServiceSwitchCount(count => count + 1);
    }
    prevServiceRef.current = selectedService;
  }, [selectedService]);

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
    } catch (error) {
      console.error(error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  useEffect(() => {
    if (submitStatus === "error") {
      const timer = setTimeout(() => setSubmitStatus("idle"), 3000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const isAvailable = appConfig.availableServices.includes(
    selectedService.charAt(0).toUpperCase() + selectedService.slice(1)
  );

  // Open the payment confirmation modal
  const openPaymentConfirmation = () => setIsPaymentConfirmationOpen(true);

  // Close the payment confirmation modal
  const closePaymentConfirmation = () => setIsPaymentConfirmationOpen(false);

  // Handle wallet connection
  const connectWallet = () => {
    if (connectors.length > 0) {
      connect({ connector: connectors[0] });
    }
  };

  // Check if the amount is valid (at least 50)
  const isAmountValid = !isNaN(Number(amount)) && Number(amount) >= 50;

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col items-center justify-center gap-2 sm:gap-3">
        <ServiceSelection
          control={methods.control}
          selectedService={selectedService}
          setStep={setStep}
          setUnavailableServiceMessage={setUnavailableServiceMessage}
          preserveCalculation={true}
        />

        <div className="w-full max-w-md">
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
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                      >
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
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
                                <PaymentTokenSelector
                                  paymentTokens={paymentTokens}
                                  selectedToken={selectedTokenId}
                                  setSelectedToken={(tokenId) => {
                                    setSelectedTokenId(tokenId);
                                    setValue("paymentToken", tokenId);
                                  }}
                                  setIsConverting={setIsConverting}
                                  setConvertedAmount={setConvertedAmount}
                                  setDisplayAmount={setDisplayAmount}
                                />
                              </div>
                            </>
                          )}

                          <button
                            type="button"
                            onClick={isConnected ? openPaymentConfirmation : connectWallet}
                            disabled={
                              isConnected
                                ? !isValid || !isAmountValid || isSubmitting || isConverting // Disable if amount is invalid or conversion in progress
                                : false
                            }
                            className="w-full h-[40px] rounded-md bg-blue-600 text-white font-semibold transition duration-200 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? (
                              <Loader2 className="w-5 h-5 mx-auto animate-spin" />
                            ) : isConverting ? (
                              <span className="flex items-center justify-center">
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Calculating price...
                              </span>
                            ) : isConnected ? (
                              "Pay"
                            ) : (
                              "Connect Wallet"
                            )}
                          </button>
                        </form>
                      </motion.div>
                    </AnimatePresence>

                    {submitStatus !== "success" && isAvailable && (
                      <>
                        {step > 0 && step < steps.length - 2 && (
                          <div className="flex flex-col gap-2 pt-2 border-t border-gray-200">
                            {step > 1 && (
                              <button
                                type="button"
                                onClick={prevStep}
                                disabled={isSubmitting}
                                className="px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                              >
                                Previous
                              </button>
                            )}
                          </div>
                        )}

                        <AnimatePresence>
                          {submitStatus === "error" && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              className="mt-2 px-3 py-2 rounded-lg bg-red-50 border border-red-100"
                            >
                              <p className="text-sm text-red-600 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                There was an error processing your payment. Please try
                                again.
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    )}

                    {/* Payment Confirmation Modal */}
                    {isPaymentConfirmationOpen && (
                      <PaymentConfirmation
                        selectedService={selectedService}
                        watch={watch}
                        carrier={carrier}
                        selectedTokenDetails={selectedTokenDetails}
                        onClose={closePaymentConfirmation}
                        setParentIsConverting={setIsConverting}
                        convertedAmount={convertedAmount}
                        displayAmount={displayAmount}
                        skipInitialConversion={true}
                      />
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
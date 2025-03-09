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

                              <div className="space-y-4">
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
                              onClose={() => setStep(1)}
                            />
                          )}
                        </form>
                      </motion.div>
                    </AnimatePresence>

                    {submitStatus !== "success" && isAvailable && (
                      <>
                        {step > 0 && step < steps.length - 2 && (
                          <div className="flex flex-col gap-4 pt-3 border-t border-gray-100">
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

                            <motion.button
                              type="button"
                              whileInView={{ scale: 1.02 }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={nextStep}
                              className="inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-[38px] rounded-[13px] sm:h-[47px] sm:rounded-[15px] w-full bg-gradient-to-r from-[#0099FF] to-[#0066FF]"
                            >
                              <span className="text-[13px] font-bold leading-[16.25px] sm:text-[15px] sm:font-semibold sm:leading-[18.75px] text-white">
                                Pay
                              </span>
                            </motion.button>
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
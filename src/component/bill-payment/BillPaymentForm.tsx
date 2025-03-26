"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, Sparkles } from "lucide-react";
import PhoneNumberInput from "./NetworkPhoneHandler";
import MeterNumberInput from "./MeterNumberInput";
import ServiceSelection from "./ServiceSelection";
import { useAcceptedTokens, PaymentToken } from "@/utils/web3/config";
import UnavailableServiceMessage from "../UnavailableServiceMessage";
import PaymentTokenSelector from "./PaymentTokenSelector";
import PaymentConfirmation from "./PaymentConfirmation";
import { appConfig } from "@/app-config";
import { FuturisticButton } from "../ui";
import { usePayment, useSetPayment } from "@/hooks/states";
import { PaymentToken as TokenSelectorToken } from "@/constants/token";

// Adapter to convert between PaymentToken interfaces
const adaptPaymentTokens = (tokens: PaymentToken[]): TokenSelectorToken[] => {
  return tokens.map((token) => ({
    id: token.id,
    network: token.id.split("-")[0] || "ethereum",
    token: token.symbol,
    address: token.contractAddress,
    name: token.name,
    symbol: token.symbol,
    image: token.image,
  }));
};

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
  const [isSubmitting] = useState(false);
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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const prevServiceRef = useRef<string | null>(null);

  const methods = useForm<BillPaymentFormData>({
    resolver: zodResolver(billPaymentSchema),
    defaultValues: {
      serviceType: "airtime",
      paymentToken: "",
    },
  });

  const {
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const selectedService = watch("serviceType");
  const amount = watch("amount");
  const phoneNumber = watch("phoneNumber");
  const meterNumber = watch("meterNumber");

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

  // Track service changes to optimize calculations but simplify to just update the ref
  useEffect(() => {
    prevServiceRef.current = selectedService;
  }, [selectedService]);

  const payment = usePayment();
  const setPayment = useSetPayment();

  // Sync form data with payment state
  useEffect(() => {
    setPayment({
      amount: amount || "",
      phoneNumber: phoneNumber || "",
      meterNumber: meterNumber || "",
      tokenId: selectedTokenId || "",
      serviceType: selectedService,
      networkProvider: payment.networkProvider,
    });
  }, [
    amount,
    phoneNumber,
    meterNumber,
    selectedTokenId,
    selectedService,
    setPayment,
    payment.networkProvider,
  ]);

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

  const isPaymentValid = () => {
    // For airtime/data services
    if (selectedService === "airtime" || selectedService === "data") {
      return (
        amount &&
        parseFloat(amount) >= 50 &&
        selectedTokenId &&
        phoneNumber &&
        carrier.id !== null
      );
    }
    // For electricity service
    else if (selectedService === "electricity") {
      return (
        amount &&
        parseFloat(amount) >= 50 &&
        selectedTokenId &&
        meterNumber &&
        meterNumber.length === 11
      );
    }
    return false;
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if the form is valid first
    if (isPaymentValid()) {
      // Log that we're showing the payment confirmation
      console.log("Form is valid, showing payment confirmation");
      setShowConfirmation(true);
      return;
    }

    console.log("Form is not valid, cannot proceed to payment");
  };

  // Debug: log when the form validation state changes
  useEffect(() => {
    const formValid = isPaymentValid();
    console.log("Form valid:", formValid);
    console.log("Form data:", {
      amount,
      selectedTokenId,
      phoneNumber,
      meterNumber,
      carrier,
      serviceType: selectedService,
    });
  }, [
    amount,
    selectedTokenId,
    phoneNumber,
    meterNumber,
    carrier,
    selectedService,
    isPaymentValid,
  ]);

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col items-center justify-center gap-4 w-full overflow-hidden">
        <ServiceSelection
          control={methods.control}
          setStep={setStep}
          setUnavailableServiceMessage={setUnavailableServiceMessage}
          preserveCalculation={true}
        />

        <div className="w-full">
          {selectedService && (
            <div className="w-full">
              {unavailableServiceMessage ? (
                <UnavailableServiceMessage serviceName={selectedService} />
              ) : (
                <div className="w-full">
                  <div className="w-full">
                    <form
                      onSubmit={handleSubmitForm}
                      className="space-y-3 w-full"
                    >
                      {step === 1 && (
                        <>
                          {selectedService === "electricity" ? (
                            <MeterNumberInput
                              error={errors.meterNumber?.message}
                            />
                          ) : (
                            <PhoneNumberInput
                              error={errors.phoneNumber?.message}
                              onCarrierChange={(carrierData) => {
                                setCarrier(carrierData);
                                // Update the network provider in payment state
                                if (carrierData.name) {
                                  setPayment({
                                    ...payment,
                                    networkProvider: carrierData.name,
                                  });
                                }
                              }}
                            />
                          )}

                          <div className="w-full">
                            <PaymentTokenSelector
                              paymentTokens={adaptPaymentTokens(paymentTokens)}
                              selectedToken={selectedTokenId}
                              setSelectedToken={(tokenId: string) => {
                                setSelectedTokenId(tokenId);
                                setValue("paymentToken", tokenId);
                                // Update payment state with the selected token
                                setPayment({
                                  ...payment,
                                  tokenId: tokenId,
                                });
                              }}
                              setIsConverting={setIsConverting}
                              setConvertedAmount={setConvertedAmount}
                              setDisplayAmount={setDisplayAmount}
                            />
                          </div>
                        </>
                      )}

                      <div className="flex justify-center mt-4 sm:mt-6 max-w-md mx-auto">
                        <FuturisticButton
                          type="submit"
                          data-action="submit-payment"
                          disabled={!isPaymentValid() || isConverting}
                          variant="primary"
                          size="large"
                          fullWidth
                          icon={<Sparkles size={16} />}
                        >
                          Pay
                        </FuturisticButton>
                      </div>


                      
                    </form>
                  </div>

                  {submitStatus !== "success" && isAvailable && (
                    <>
                      {step > 0 && step < steps.length - 2 && (
                        <div className="flex flex-col gap-2 pt-2 border-t border-chainpay-blue-light/20 mt-3">
                          {step > 1 && (
                            <button
                              type="button"
                              onClick={prevStep}
                              disabled={isSubmitting}
                              className="px-3 py-2 text-sm text-chainpay-blue bg-chainpay-blue-light/10 rounded-md hover:bg-chainpay-blue-light/20 transition-colors duration-200 font-medium border border-chainpay-blue-light/20"
                            >
                              Previous
                            </button>
                          )}
                        </div>
                      )}

                      {submitStatus === "error" && (
                        <div className="mt-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200">
                          <p className="text-sm text-red-600 flex items-center gap-2 font-medium">
                            <AlertCircle className="w-4 h-4" />
                            There was an error processing your payment. Please
                            try again.
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Payment Confirmation Modal */}
                  {showConfirmation && (
                    <PaymentConfirmation
                      selectedService={selectedService}
                      watch={watch}
                      carrier={carrier}
                      selectedTokenDetails={selectedTokenDetails}
                      onClose={() => setShowConfirmation(false)}
                      setParentIsConverting={setIsConverting}
                      convertedAmount={convertedAmount}
                      displayAmount={displayAmount}
                      skipInitialConversion={true}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </FormProvider>
  );
};

export default BillPaymentForm;

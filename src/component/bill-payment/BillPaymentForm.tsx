"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, CreditCard } from "lucide-react";
import PhoneNumberInput from "./NetworkPhoneHandler";
import MeterNumberInput from "./MeterNumberInput";
import ServiceSelection from "./ServiceSelection";
import { useAcceptedTokens, PaymentToken } from "@/utils/web3/config";
import UnavailableServiceMessage from "../UnavailableServiceMessage";
import PaymentTokenSelector from "./PaymentTokenSelector";
import PaymentConfirmation from "./PaymentConfirmation";
import { appConfig } from "@/app-config";
import { usePayment, useSetPayment } from "@/hooks/states";
import { PaymentToken as TokenSelectorToken } from "@/constants/token";
import { ChainPayButton } from "../ui";
import {
  fetchConversionRate,
  convertAmount,
  handleConversionError,
} from "@/utils/conversionUtils";
import ConversionResultCard from "./ConversionResultCard";
import type { TokenData } from "@/types/token";

// Adapter to convert between PaymentToken interfaces
const adaptPaymentTokens = (tokens: PaymentToken[]): TokenSelectorToken[] => {
  return tokens.map((token) => ({
    id: token.id,
    network: token.network,
    token: token.token,
    address: token.address,
    name: token.name,
    symbol: token.symbol,
    image: token.image,
    icon: token.icon,
  }));
};

const billPaymentSchema = z.object({
  serviceType: z.enum(["airtime", "data", "electricity", "tv"]),
  phoneNumber: z.string().optional(),
  meterNumber: z.string().optional(),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) >= 50,
      { message: "Minimum amount is 50 credit units" }
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
  const [conversionRate, setConversionRate] = useState<string>("");
  const [conversionError, setConversionError] = useState<string | null>(null);
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
  const prevAmountRef = useRef<string>("");
  const prevTokenRef = useRef<string>("");
  const lastCalculationTimeRef = useRef<number>(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

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
  ) as PaymentToken | undefined;

  const tokenData: TokenData | undefined = selectedTokenDetails
    ? {
        id: selectedTokenDetails.id,
        network: selectedTokenDetails.network,
        token: selectedTokenDetails.token,
        address: selectedTokenDetails.address,
        icon: selectedTokenDetails.icon,
        symbol: selectedTokenDetails.symbol,
      }
    : undefined;

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

  useEffect(() => {
    prevServiceRef.current = selectedService;
  }, [selectedService]);

  const payment = usePayment();
  const setPayment = useSetPayment();

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

  const isPaymentValid = useCallback(() => {
    if (selectedService === "airtime" || selectedService === "data") {
      return (
        amount &&
        parseFloat(amount) >= 50 &&
        selectedTokenId &&
        phoneNumber &&
        carrier.id !== null
      );
    } else if (selectedService === "electricity") {
      return (
        amount &&
        parseFloat(amount) >= 50 &&
        selectedTokenId &&
        meterNumber &&
        meterNumber.length === 11
      );
    }
    return false;
  }, [
    amount,
    selectedTokenId,
    phoneNumber,
    meterNumber,
    carrier.id,
    selectedService,
  ]);

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (isPaymentValid()) {
      console.log("Form is valid, showing payment confirmation");
      setShowConfirmation(true);
      return;
    }

    console.log("Form is not valid, cannot proceed to payment");
  };

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

  useEffect(() => {
    const fetchRate = async () => {
      const rate = await fetchConversionRate();
      setConversionRate(rate);
    };
    fetchRate();
  }, []);

  const updateConversionAmount = async (amount: string, token: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (amount === prevAmountRef.current && token === prevTokenRef.current) {
      return;
    }

    setConversionError(null);

    debounceTimerRef.current = setTimeout(async () => {
      if (selectedTokenDetails && amount && !isNaN(Number(amount))) {
        try {
          prevAmountRef.current = amount;
          prevTokenRef.current = token;
          lastCalculationTimeRef.current = Date.now();

          setIsConverting(true);

          const formattedAmount = await convertAmount(
            amount,
            selectedTokenDetails
          );
          setDisplayAmount(formattedAmount);
          setConvertedAmount(formattedAmount);
        } catch (error) {
          console.error("Error converting amount:", error);
          setConversionError("Network error. Using estimated conversion rate.");

          const formattedAmount = handleConversionError(amount);
          setDisplayAmount(formattedAmount);
          setConvertedAmount(formattedAmount);
        } finally {
          setIsConverting(false);
        }
      } else {
        setDisplayAmount("0");
        setConvertedAmount("0");
      }
    }, 800);
  };

  useEffect(() => {
    if (amount && amount !== "0") {
      updateConversionAmount(amount, selectedTokenId);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [amount, selectedTokenId, updateConversionAmount]);

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col items-center justify-center gap-4 w-full">
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
                  <div className="max-w-md mx-auto">
                    <form onSubmit={handleSubmitForm} className="w-full">
                      {step === 1 && (
                        <div className="space-y-4">
                          <div className="bg-white backdrop-blur-sm border border-border-light/10 p-4 rounded-xl shadow-sm">
                            {selectedService === "electricity" ? (
                              <MeterNumberInput
                                error={errors.meterNumber?.message}
                              />
                            ) : (
                              <PhoneNumberInput
                                error={errors.phoneNumber?.message}
                                onCarrierChange={(carrierData) => {
                                  setCarrier(carrierData);
                                  if (carrierData.name) {
                                    setPayment({
                                      ...payment,
                                      networkProvider: carrierData.name,
                                    });
                                  }
                                }}
                              />
                            )}

                            <div className="mt-4">
                              <PaymentTokenSelector
                                paymentTokens={adaptPaymentTokens(
                                  paymentTokens
                                )}
                                selectedToken={selectedTokenId}
                                setSelectedToken={(tokenId: string) => {
                                  setSelectedTokenId(tokenId);
                                  setValue("paymentToken", tokenId);
                                  setPayment({ ...payment, tokenId });
                                }}
                              />
                            </div>
                          </div>

                          {tokenData && amount && amount !== "0" && (
                            <ConversionResultCard
                              selectedTokenData={tokenData}
                              creditAmount={amount}
                              localDisplayAmount={displayAmount}
                              conversionRate={conversionRate}
                              isConverting={isConverting}
                              conversionError={conversionError}
                            />
                          )}

                          <div className="pt-2 relative">
                            <div className="absolute inset-0 bg-chainpay-gold/20 blur-md opacity-30 rounded-lg"></div>
                            <ChainPayButton
                              type="submit"
                              data-action="submit-payment"
                              disabled={!isPaymentValid() || isConverting}
                              variant="primary"
                              size="large"
                              fullWidth
                              className="bg-gradient-to-r from-chainpay-blue to-chainpay-blue-dark border border-chainpay-blue-dark/20 hover:from-chainpay-blue-dark hover:to-[#3B82F6] hover:scale-105 hover:shadow-xl hover:shadow-[#3B82F6]/30 focus:ring-4 focus:ring-[#3B82F6]/50 transition-all duration-300"
                            >
                              <div className="flex items-center justify-center gap-2 text-white font-bold">
                                <CreditCard className="w-4 h-4" />
                                <span>Pay Now</span>
                              </div>
                            </ChainPayButton>
                          </div>
                        </div>
                      )}
                    </form>
                  </div>

                  {submitStatus !== "success" && isAvailable && (
                    <>
                      {step > 0 && step < steps.length - 2 && (
                        <div className="">
                          {step > 1 && (
                            <button
                              type="button"
                              onClick={prevStep}
                              disabled={isSubmitting}
                              className="px-3 py-2 text-sm text-text-primary bg-background-light rounded-md hover:bg-background-medium transition-colors duration-200 font-medium border border-border-light"
                            >
                              Previous
                            </button>
                          )}
                        </div>
                      )}

                      {submitStatus === "error" && (
                        <div className="mt-2 px-3 py-2 rounded-lg bg-status-error/5 border border-status-error/10">
                          <p className="text-sm text-status-error flex items-center gap-2 font-medium">
                            <AlertCircle className="w-4 h-4" />
                            There was an error processing your payment. Please
                            try again.
                          </p>
                        </div>
                      )}
                    </>
                  )}

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

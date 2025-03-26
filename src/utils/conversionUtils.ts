import { PaymentToken } from "@/constants/token";
import {
  convertCreditToTokenAmount,
  formatTokenAmountDisplay,
  getConversionRateDisplay,
} from "@/lib/CP_NGN_USD_Vendor";

// Function to fetch conversion rate
export const fetchConversionRate = async () => {
  return await getConversionRateDisplay();
};

// Function to convert credit to token amount
export const convertAmount = async (amount: string, selectedTokenData: PaymentToken) => {
  if (selectedTokenData && amount && !isNaN(Number(amount))) {
    const tokenAmount = await convertCreditToTokenAmount(Number(amount));
    return formatTokenAmountDisplay(tokenAmount);
  }
  return "0";
};

// Function to handle conversion error fallback
export const handleConversionError = (amount: string) => {
  const fallbackAmount = (Number(amount) / 1400).toFixed(6); // Approximate USD value
  return formatTokenAmountDisplay(fallbackAmount);
}; 
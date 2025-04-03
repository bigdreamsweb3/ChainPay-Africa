// import { PaymentToken } from "@/constants/token";
import axios from "axios";

// Simple rate configuration
const RATE_CONFIG = {
  minRate: 1520,          // Minimum rate
  maxRate: 1570,          // Maximum rate
  preferredRate: 1530,    // Preferred rate
  buffer: 0.05,           // 5% buffer
};

// Simple cache for rate
let rateCache = {
  value: 0,
  timestamp: 0,
  expiry: 300000 // 5 minutes
};

// Function to fetch rate from CoinGecko
const fetchExchangeRate = async (): Promise<number> => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=ngn",
      { timeout: 10000 }
    );
    return response.data.tether.ngn;
  } catch (error) {
    console.error('CoinGecko API error:', error);
    throw error;
  }
};

// Function to get rate with fallbacks
const getRateWithFallbacks = async (): Promise<number> => {
  try {
    return await fetchExchangeRate();
  } catch {
    console.error('Failed to fetch rate');
    return RATE_CONFIG.preferredRate;
  }
};

// Main rate fetching function
export const fetchNGNtoUSDRate = async (): Promise<number> => {
  // Check cache first
  if (rateCache.value && (Date.now() - rateCache.timestamp) < rateCache.expiry) {
    return rateCache.value;
  }

  try {
    const rate = await getRateWithFallbacks();
    // Apply buffer
    const finalRate = rate * (1 + RATE_CONFIG.buffer);
    
    // Cache the rate
    rateCache = {
      value: finalRate,
      timestamp: Date.now(),
      expiry: 300000
    };
    
    return finalRate;
  } catch {
    console.error("Failed to fetch exchange rate");
    return RATE_CONFIG.preferredRate;
  }
};

// Function to format token amount for display
export const formatTokenAmountDisplay = (amount: string, displayDecimals = 4): string => {
  if (!amount || isNaN(Number(amount))) {
    return "0";
  }
  return parseFloat(amount).toFixed(displayDecimals).replace(/\.?0+$/, "");
};

// Function to get conversion rate display
export const getConversionRateDisplay = async (tokenSymbol: string = "USDT"): Promise<string> => {
  try {
    const rate = await fetchNGNtoUSDRate();
    return `1 ${tokenSymbol} ≈ ${rate.toLocaleString()} NGN`;
  } catch {
    return `1 ${tokenSymbol} ≈ ${RATE_CONFIG.preferredRate.toLocaleString()} NGN`;
  }
};

// Function to convert token amount to token units (wei)
export const convertToTokenUnits = (tokenAmount: string, decimals = 18): string => {
  if (!tokenAmount || isNaN(Number(tokenAmount))) {
    return "0";
  }
  const amount = parseFloat(tokenAmount);
  const decimalFactor = 10 ** decimals;
  return Math.floor(amount * decimalFactor).toString();
};

// Function to convert credit units to token amount
export const convertCreditToTokenAmount = async (
  creditAmount: number
): Promise<string> => {
  try {
    // Get current NGN to USD rate
    const rate = await fetchNGNtoUSDRate();
    
    // Convert credit units to Naira (1000 credit units = 1000 Naira)
    const nairaAmount = creditAmount;
    
    // Convert Naira to USD using our rate
    const usdAmount = nairaAmount / rate;
    
    // For USDT/USDC, the amount is the same as USD
    return usdAmount.toFixed(6);
  } catch {
    console.error('Error in conversion');
    throw new Error('Failed to convert amount');
  }
}; 
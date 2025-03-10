import axios from "axios";

// Cache for exchange rates with expiration
let exchangeRateCache = {
    value: null,
    timestamp: 0,
    expiry: 5 * 60 * 1000, // 5 minutes in milliseconds
};

/**
 * Helper function to add a minimum delay to ensure loading indicators are visible
 * @param {Promise} promise - The promise to add delay to
 * @param {number} minDelay - Minimum delay in milliseconds
 * @returns {Promise} - A promise that resolves after the original promise and minimum delay
 */
export const withMinDelay = (promise, minDelay = 500) => {
    const delay = new Promise(resolve => setTimeout(resolve, minDelay));
    return Promise.all([promise, delay]).then(([result]) => result);
};

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - The async function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} - Result of the function or throws error after max retries
 */
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 300) => {
    let lastError;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            
            // Only retry on network errors, not on 4xx client errors
            if (error.response && error.response.status >= 400 && error.response.status < 500) {
                throw error;
            }

            // Calculate delay with exponential backoff
            const delay = baseDelay * Math.pow(2, attempt);
            console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw lastError;
};

export const getExchangeRate = async () => {
    const now = Date.now();
    
    // Return cached value if still valid
    if (
        exchangeRateCache.value && 
        (now - exchangeRateCache.timestamp) < exchangeRateCache.expiry
    ) {
        console.log("Using cached exchange rate:", exchangeRateCache.value);
        return exchangeRateCache.value;
    }

    try {
        const fetchRate = async () => {
            const response = await axios.get("https://api.binance.com/api/v3/ticker/price?symbol=USDTNGN");
            return parseFloat(response.data.price);
        };
        
        // Use the retry mechanism
        const rate = await retryWithBackoff(fetchRate);
        
        // Update cache
        exchangeRateCache = {
            value: rate,
            timestamp: now,
            expiry: 5 * 60 * 1000, // 5 minutes
        };
        
        console.log("NGN/USD Rate:", rate);
        return rate;
    } catch (error) {
        console.error("Failed to fetch exchange rate after retries:", error);
        
        // If we have a cached value, use it even if expired
        if (exchangeRateCache.value) {
            console.log("Using expired cached rate:", exchangeRateCache.value);
            return exchangeRateCache.value;
        }
        
        // Last resort fallback
        return 1400; // Default fallback rate
    }
};

export const convertCreditToUSD = async (creditUnits) => {
    try {
        const rate = await getExchangeRate();
        const usdAmount = creditUnits / rate;
        return usdAmount.toFixed(6); // Keep 6 decimal places
    } catch (error) {
        console.error("Error in convertCreditToUSD:", error);
        // Use a default conversion if we can't get the rate
        return (creditUnits / 1400).toFixed(6);
    }
};

/**
 * Formats a number to a user-friendly display format with appropriate decimal places
 * @param {string|number} amount - The amount to format
 * @param {number} displayDecimals - Number of decimal places to display (default: 4)
 * @returns {string} - Formatted amount string
 */
export const formatTokenAmountDisplay = (amount, displayDecimals = 4) => {
    if (!amount || isNaN(Number(amount))) {
        return "0";
    }
    
    // Parse as float and format with specified decimal places
    const formattedAmount = parseFloat(amount).toFixed(displayDecimals);
    
    // Remove trailing zeros after decimal point
    return formattedAmount.replace(/\.?0+$/, "");
};

/**
 * Converts credit units to the equivalent amount in the selected token
 * @param {number} creditUnits - The amount of credit units to convert
 * @param {Object} tokenDetails - The details of the selected token
 * @returns {Promise<string>} - The equivalent amount in the selected token (human readable format)
 */
export const convertCreditToTokenAmount = async (creditUnits, tokenDetails) => {
    try {
        // First convert credit units to USD equivalent
        const usdAmount = await convertCreditToUSD(creditUnits);
        
        // For now, we're assuming a 1:1 conversion for tokens pegged to USD like XUSD
        // In a real-world scenario, you might want to fetch the actual token price from an API
        if (tokenDetails.symbol === "XUSD") {
            return usdAmount;
        }
        
        // For other tokens, you would implement appropriate conversion logic here
        // For example, if you had an XFI token with a different value:
        // if (tokenDetails.symbol === "XFI") {
        //     const xfiRate = await getXFIRate();
        //     return (parseFloat(usdAmount) / xfiRate).toFixed(6);
        // }
        
        // Default fallback (should be replaced with actual conversion logic)
        return usdAmount;
    } catch (error) {
        console.error("Error converting credit to token amount:", error);
        // Provide a better estimate based on token type
        if (tokenDetails && tokenDetails.symbol === "XUSD") {
            return (creditUnits / 1400).toFixed(4); // Rough estimate using fallback rate
        }
        return "0.00"; // Return zero as fallback
    }
};

/**
 * Converts a human-readable token amount to the smallest token unit (wei equivalent)
 * @param {string|number} tokenAmount - The human-readable token amount
 * @param {number} decimals - The token's decimal places (default: 18)
 * @returns {string} - The token amount in its smallest unit as a string
 */
export const convertToTokenUnits = (tokenAmount, decimals = 18) => {
    if (!tokenAmount || isNaN(Number(tokenAmount))) {
        return "0";
    }
    
    // Convert to a number and ensure we have the proper precision
    const amount = parseFloat(tokenAmount);
    const decimalFactor = 10 ** decimals;
    
    // Calculate the token units and round down to be safe
    const tokenUnits = Math.floor(amount * decimalFactor);
    
    return tokenUnits.toString();
};

import axios from "axios";

/**
 * Helper function to add a minimum delay to ensure loading indicators are visible
 * @param {Promise} promise - The promise to add delay to
 * @param {number} minDelay - Minimum delay in milliseconds
 * @returns {Promise} - A promise that resolves after the original promise and minimum delay
 */
const withMinDelay = (promise, minDelay = 500) => {
    const delay = new Promise(resolve => setTimeout(resolve, minDelay));
    return Promise.all([promise, delay]).then(([result]) => result);
};

export const getExchangeRate = async () => {
    try {
        const responsePromise = axios.get("https://api.binance.com/api/v3/ticker/price?symbol=USDTNGN");
        const response = await withMinDelay(responsePromise);
        const rate = parseFloat(response.data.price);
        console.log("NGN/USD Rate:", rate);
        return rate;
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        return 1400; // Default fallback rate
    }
};

export const convertCreditToUSD = async (creditUnits) => {
    const rate = await getExchangeRate();
    const usdAmount = creditUnits / rate;
    return usdAmount.toFixed(6); // Keep 6 decimal places
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

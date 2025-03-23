/**
 * Formats a token price with appropriate decimal places and currency symbol
 * @param value The value to format
 * @param currency The currency symbol (default: $)
 * @param decimals The number of decimal places (default: 2)
 * @returns Formatted price string
 */
export function formatTokenPrice(value: number, currency: string = '$', decimals: number = 2): string {
  if (isNaN(value)) return `${currency}0.00`;
  
  // Format based on value size
  if (value >= 1000000) {
    return `${currency}${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `${currency}${(value / 1000).toFixed(2)}K`;
  } else if (value >= 1) {
    return `${currency}${value.toFixed(decimals)}`;
  } else if (value > 0) {
    // For small values, show more decimals
    return `${currency}${value.toFixed(Math.min(6, decimals + 4))}`;
  } else {
    return `${currency}0.00`;
  }
}

/**
 * Formats a wallet address for display by truncating the middle
 * @param address The wallet address
 * @param startChars Number of characters to show at the start (default: 6)
 * @param endChars Number of characters to show at the end (default: 4)
 * @returns Formatted address (e.g., "0x1234...5678")
 */
export function formatWalletAddress(address: string, startChars: number = 6, endChars: number = 4): string {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  
  return `${address.substring(0, startChars)}...${address.substring(address.length - endChars)}`;
}

/**
 * Formats a timestamp into a human-readable date/time
 * @param timestamp The timestamp (in milliseconds) to format
 * @param includeTime Whether to include the time in the output (default: true)
 * @returns Formatted date/time string
 */
export function formatDateTime(timestamp: number, includeTime: boolean = true): string {
  const date = new Date(timestamp);
  
  // Date portion
  const dateOptions: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric'
  };
  
  // Time portion (if requested)
  if (includeTime) {
    return new Intl.DateTimeFormat('en-US', {
      ...dateOptions,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  } else {
    return new Intl.DateTimeFormat('en-US', dateOptions).format(date);
  }
}

/**
 * Creates a delay using a Promise
 * @param ms Milliseconds to delay
 * @returns Promise that resolves after the specified delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generates a random ID string
 * @param length Length of the ID (default: 10)
 * @returns Random ID string
 */
export function generateRandomId(length: number = 10): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
}

/**
 * A simple validator for checking if a value exists and has the expected type
 * @param value The value to validate
 * @param type The expected type ('string', 'number', 'boolean', 'object', 'array')
 * @returns Boolean indicating if the value is valid
 */
export function isValidValue(
  value: unknown, 
  type: 'string' | 'number' | 'boolean' | 'object' | 'array'
): boolean {
  if (value === undefined || value === null) return false;
  
  switch (type) {
    case 'string':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number' && !isNaN(value);
    case 'boolean':
      return typeof value === 'boolean';
    case 'object':
      return typeof value === 'object' && !Array.isArray(value);
    case 'array':
      return Array.isArray(value);
    default:
      return false;
  }
} 
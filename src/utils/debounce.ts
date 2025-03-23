/**
 * Creates a debounced function that delays invoking the provided function
 * until after the specified wait time has elapsed since the last time it was invoked.
 * 
 * @param func The function to debounce
 * @param wait The number of milliseconds to delay
 * @param immediate Whether to invoke the function immediately on the leading edge
 * @returns A debounced version of the original function
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
}

/**
 * Creates a throttled function that only invokes the provided function at most once
 * per every specified wait period. Useful for rate limiting events like scroll or resize.
 *
 * @param func The function to throttle
 * @param wait The number of milliseconds to throttle invocations to
 * @returns A throttled version of the original function
 */
export function throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number = 300
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  
  return (...args: Parameters<T>): void => {
    const now = Date.now();
    
    if (now - lastCall >= wait) {
      lastCall = now;
      func(...args);
    }
  };
} 
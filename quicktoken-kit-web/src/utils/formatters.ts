/**
 * Utility functions for formatting values in the application
 */

/**
 * Shortens an Ethereum address to a more readable format
 * @param address The full Ethereum address
 * @param chars Number of characters to show at start/end (default: 4)
 * @returns Shortened address with ellipsis in the middle
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  if (address.length <= chars * 2 + 3) return address;
  
  const start = address.substring(0, chars);
  const end = address.substring(address.length - chars);
  
  return `${start}...${end}`;
}

/**
 * Formats a number with commas and specified decimal places
 * @param value The number to format
 * @param decimals Number of decimal places (default: 2)
 * @returns Formatted number as string
 */
export function formatNumber(value: number | string, decimals = 2): string {
  if (value === undefined || value === null) return '0';
  
  // Convert string to number if needed
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  // Check if it's a valid number
  if (isNaN(num)) return '0';
  
  // Format with specified decimal places and add commas
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * Formats a currency value with symbol and decimal places
 * @param value The number to format
 * @param symbol Currency symbol (default: '$')
 * @param decimals Number of decimal places (default: 2)
 * @returns Formatted currency string
 */
export function formatCurrency(value: number | string, symbol = '$', decimals = 2): string {
  if (value === undefined || value === null) return `${symbol}0`;
  
  // Convert string to number if needed
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  // Check if it's a valid number
  if (isNaN(num)) return `${symbol}0`;
  
  // Format with specified decimal places and add commas
  return `${symbol}${num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}`;
}

/**
 * Formats a date/timestamp into a readable string
 * @param timestamp Date to format (Date object or timestamp)
 * @param format Format to use: 'short', 'long', or 'relative' (default: 'short')
 * @returns Formatted date string
 */
export function formatDate(timestamp: Date | number | string, format: 'short' | 'long' | 'relative' = 'short'): string {
  if (!timestamp) return '';
  
  // Convert to Date object if needed
  const date = timestamp instanceof Date 
    ? timestamp 
    : new Date(timestamp);
  
  // Check if date is valid
  if (isNaN(date.getTime())) return '';
  
  // Format based on specified format
  switch (format) {
    case 'long':
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
    case 'relative':
      const now = new Date();
      const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      // Less than a minute
      if (diff < 60) return 'just now';
      
      // Less than an hour
      if (diff < 3600) {
        const minutes = Math.floor(diff / 60);
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
      }
      
      // Less than a day
      if (diff < 86400) {
        const hours = Math.floor(diff / 3600);
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
      }
      
      // Less than a week
      if (diff < 604800) {
        const days = Math.floor(diff / 86400);
        return `${days} ${days === 1 ? 'day' : 'days'} ago`;
      }
      
      // Default to regular date format for older dates
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      
    default: // short
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
  }
} 
import { NetworkProviders } from '@/constants/network';

export const phoneNumberRegex = /^[0-9]{10,11}$/;

interface PhoneValidationResult {
  isValid: boolean;
  message?: string;
}

// Function to validate phone numbers based on Nigerian network providers
export function validatePhoneNumber(phoneNumber: string, provider: NetworkProviders): PhoneValidationResult {
  // Basic format validation
  if (!phoneNumberRegex.test(phoneNumber)) {
    return {
      isValid: false,
      message: 'Phone number must be 10-11 digits'
    };
  }

  // Format phone number (remove leading zero if it exists)
  const formattedNumber = phoneNumber.startsWith('0') 
    ? phoneNumber.substring(1) 
    : phoneNumber;

  // Ensure the number is 10 digits after formatting
  if (formattedNumber.length !== 10) {
    return {
      isValid: false,
      message: 'Phone number must be 10 digits (excluding country code)'
    };
  }

  // Validate network-specific prefixes
  switch (provider) {
    case NetworkProviders.MTN:
      // MTN prefixes: 0703, 0706, 0803, 0806, 0810, 0813, 0814, 0816, 0903, 0906, etc.
      const mtnPrefixes = ['703', '706', '803', '806', '810', '813', '814', '816', '903', '906'];
      if (!mtnPrefixes.some(prefix => formattedNumber.startsWith(prefix))) {
        return {
          isValid: false,
          message: 'Not a valid MTN number'
        };
      }
      break;
    
    case NetworkProviders.AIRTEL:
      // Airtel prefixes: 0701, 0708, 0802, 0808, 0812, 0902, etc.
      const airtelPrefixes = ['701', '708', '802', '808', '812', '902'];
      if (!airtelPrefixes.some(prefix => formattedNumber.startsWith(prefix))) {
        return {
          isValid: false,
          message: 'Not a valid Airtel number'
        };
      }
      break;
    
    case NetworkProviders.GLO:
      // Glo prefixes: 0705, 0805, 0807, 0811, 0815, 0905, etc.
      const gloPrefixes = ['705', '805', '807', '811', '815', '905'];
      if (!gloPrefixes.some(prefix => formattedNumber.startsWith(prefix))) {
        return {
          isValid: false,
          message: 'Not a valid Glo number'
        };
      }
      break;
    
    case NetworkProviders.ETISALAT:
      // 9Mobile (Etisalat) prefixes: 0809, 0817, 0818, 0908, 0909, etc.
      const etisalatPrefixes = ['809', '817', '818', '908', '909'];
      if (!etisalatPrefixes.some(prefix => formattedNumber.startsWith(prefix))) {
        return {
          isValid: false,
          message: 'Not a valid 9Mobile number'
        };
      }
      break;
    
    default:
      // If provider is not recognized, consider it valid (this is for flexibility)
      break;
  }

  // If we made it here, the phone number is valid for the specified provider
  return {
    isValid: true
  };
} 
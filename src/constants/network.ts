// Network providers in Nigeria
export enum NetworkProviders {
  MTN = 'MTN',
  AIRTEL = 'AIRTEL',
  GLO = 'GLO',
  ETISALAT = '9MOBILE'
}

// Service types for bill payments
export enum ServiceTypes {
  AIRTIME = 'AIRTIME',
  DATA = 'DATA',
  ELECTRICITY = 'ELECTRICITY',
  CABLE = 'CABLE',
  WATER = 'WATER'
}

// Mapping of networks to their service fees (in percentage)
export const networkServiceFees = {
  [NetworkProviders.MTN]: 0.5, // 0.5%
  [NetworkProviders.AIRTEL]: 0.5,
  [NetworkProviders.GLO]: 0.75,
  [NetworkProviders.ETISALAT]: 0.75
};

// Minimum transaction amounts per network (in NGN)
export const minimumTransactionAmounts = {
  [NetworkProviders.MTN]: 50,
  [NetworkProviders.AIRTEL]: 50,
  [NetworkProviders.GLO]: 50,
  [NetworkProviders.ETISALAT]: 50
};

// Maximum transaction amounts per network (in NGN)
export const maximumTransactionAmounts = {
  [NetworkProviders.MTN]: 5000,
  [NetworkProviders.AIRTEL]: 5000,
  [NetworkProviders.GLO]: 5000,
  [NetworkProviders.ETISALAT]: 5000
};

// Default data bundles for each network
export const dataPlans = {
  [NetworkProviders.MTN]: [
    { id: 'mtn-100mb', name: '100MB - 24hrs', value: 100, price: 100 },
    { id: 'mtn-1gb', name: '1GB - 30days', value: 1000, price: 300 },
    { id: 'mtn-2gb', name: '2GB - 30days', value: 2000, price: 500 },
    { id: 'mtn-5gb', name: '5GB - 30days', value: 5000, price: 1000 },
    { id: 'mtn-10gb', name: '10GB - 30days', value: 10000, price: 2000 }
  ],
  [NetworkProviders.AIRTEL]: [
    { id: 'airtel-100mb', name: '100MB - 24hrs', value: 100, price: 100 },
    { id: 'airtel-1gb', name: '1GB - 30days', value: 1000, price: 300 },
    { id: 'airtel-2gb', name: '2GB - 30days', value: 2000, price: 500 },
    { id: 'airtel-5gb', name: '5GB - 30days', value: 5000, price: 1000 },
    { id: 'airtel-10gb', name: '10GB - 30days', value: 10000, price: 2000 }
  ],
  [NetworkProviders.GLO]: [
    { id: 'glo-100mb', name: '100MB - 24hrs', value: 100, price: 100 },
    { id: 'glo-1gb', name: '1GB - 30days', value: 1000, price: 300 },
    { id: 'glo-2gb', name: '2GB - 30days', value: 2000, price: 500 },
    { id: 'glo-5gb', name: '5GB - 30days', value: 5000, price: 1000 },
    { id: 'glo-10gb', name: '10GB - 30days', value: 10000, price: 2000 }
  ],
  [NetworkProviders.ETISALAT]: [
    { id: '9mobile-100mb', name: '100MB - 24hrs', value: 100, price: 100 },
    { id: '9mobile-1gb', name: '1GB - 30days', value: 1000, price: 300 },
    { id: '9mobile-2gb', name: '2GB - 30days', value: 2000, price: 500 },
    { id: '9mobile-5gb', name: '5GB - 30days', value: 5000, price: 1000 },
    { id: '9mobile-10gb', name: '10GB - 30days', value: 10000, price: 2000 }
  ]
}; 
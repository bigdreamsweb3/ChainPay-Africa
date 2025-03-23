import { create } from 'zustand';

interface PaymentState {
  amount: string;
  tokenId: string;
  phoneNumber: string;
  meterNumber: string;
  serviceType: string;
  networkProvider: string;
}

interface PaymentStore {
  payment: PaymentState;
  setPayment: (payment: Partial<PaymentState>) => void;
  resetPayment: () => void;
}

// Add selected service type store
interface ServiceTypeStore {
  selectedServiceType: string;
  setSelectedServiceType: (type: string) => void;
}

const usePaymentStore = create<PaymentStore>((set) => ({
  payment: {
    amount: '',
    tokenId: '',
    phoneNumber: '',
    meterNumber: '',
    serviceType: '',
    networkProvider: '',
  },
  setPayment: (paymentUpdate) => set((state) => ({
    payment: { ...state.payment, ...paymentUpdate }
  })),
  resetPayment: () => set({
    payment: {
      amount: '',
      tokenId: '',
      phoneNumber: '',
      meterNumber: '',
      serviceType: '',
      networkProvider: '',
    }
  }),
}));

// Create the service type store
const useServiceTypeStore = create<ServiceTypeStore>((set) => ({
  selectedServiceType: '',
  setSelectedServiceType: (type) => set({ selectedServiceType: type }),
}));

export const usePayment = () => usePaymentStore((state) => state.payment);
export const useSetPayment = () => usePaymentStore((state) => state.setPayment);
export const useResetPayment = () => usePaymentStore((state) => state.resetPayment);

// Export service type hooks
export const useSelectedServiceType = () => useServiceTypeStore((state) => state.selectedServiceType);
export const useSetSelectedServiceType = () => useServiceTypeStore((state) => state.setSelectedServiceType); 
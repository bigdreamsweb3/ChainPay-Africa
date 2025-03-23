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

export const usePayment = () => usePaymentStore((state) => state.payment);
export const useSetPayment = () => usePaymentStore((state) => state.setPayment);
export const useResetPayment = () => usePaymentStore((state) => state.resetPayment); 
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface UserWallet {
  activeWallet: string | null;
  isConnected: boolean;
  chainId: number | null;
}

export const useUserWallet = (): UserWallet => {
  const { address, isConnected, chainId } = useAccount();
  const [activeWallet, setActiveWallet] = useState<string | null>(null);

  useEffect(() => {
    if (address) {
      setActiveWallet(address);
    } else {
      setActiveWallet(null);
    }
  }, [address]);

  return {
    activeWallet,
    isConnected,
    chainId: chainId || null
  };
}; 

// 
import { Connector } from "wagmi";

export const appConfig = {
  appFullName: "ChainPay",
  appNameWord1: "Chain",
  appNameWord2: "Pay",
  appDescription:
    "ChainPay is a platform for making payments on the blockchain.",
  appLogo: "/images/logo-removebg.png",
  appRegion: "Africa",
  appCountry: "Nigeria",
  countryTheme: {
    Nigeria: {
      primaryColor: "green-600",
      secondaryColor: "green-500",
      gradientFrom: "from-green-600",
      gradientTo: "to-green-500",
      borderColor: "border-green-500/30"
    }
  } as Record<string, {
    primaryColor: string;
    secondaryColor: string;
    gradientFrom: string;
    gradientTo: string;
    borderColor: string;
  }>,

  // Availables
  availableRegions: ["Africa"],
  availableCountries: ["Nigeria"],
  availableServices: ["Airtime"],
  availableNetworks: ["MTN", "Airtel", "Glo", "9Mobile"],
};

export const CONTRACT_ADDRESSES = {
  AIRTIME: process.env.NEXT_PUBLIC_AIRTIME_CONTRACT_ADDRESS || "0x147C0BE455151f7A610733413da07F04A3aD0fd4",
  VENDOR: process.env.NEXT_PUBLIC_VENDOR_CONTRACT_ADDRESS || "0x63d25E6a30c30F2499c8f3d52bEf5fDE8e804066",
};

export const RPC_URLS = {
  BASE_SEPOLIA: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || "https://base-sepolia.g.alchemy.com/v2/yVdus-sqxJkzkimp3MZ2B29ViIL7Y-FL",
};

export const NETWORK_TO_OPERATOR = {
  0: "535", // MTN
  1: "536", // Airtel
  2: "537", // Glo
  3: "538", // Etisalat
} as const;

export const BLOCK_EXPLORER_URLS = {
  BASE_SEPOLIA: "https://sepolia.basescan.org",
};

// 

// Custom wallet icon mapping (same as in WalletModal)
 const walletIcons: Record<string, string> = {
  MetaMask: "/icons/metamask.svg",
  WalletConnect: "/icons/walletconnect.svg",
  "Coinbase Wallet": "/icons/coinbase.svg",
  // Add more wallet icons as needed
};


export const getWalletIcon = (connector: Connector) => {
  return walletIcons[connector.name] || connector.icon || "/default-wallet-icon.svg";
};


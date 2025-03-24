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

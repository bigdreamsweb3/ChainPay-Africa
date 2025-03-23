export const appConfig = {
  appFullName: "ChainPay",
  appName: "Chain",
  appSubName: "Pay",
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
  appDescription:
    "ChainPay is a platform for making payments on the blockchain.",
  appLogo: "/images/logo-removebg.png",
// 
  // Available Regions
  availableRegions: ["Africa"],

  // Available Countries
  availableCountries: ["Nigeria"],

  // Available Services
  availableServices: ["Airtime"],

  // Available Networks
  availableNetworks: ["MTN", "Airtel", "Glo", "9Mobile"],
};

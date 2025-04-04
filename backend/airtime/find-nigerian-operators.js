import axios from "axios";
import { getAccessToken } from "./reloadly-airtime-sandbox.js";

// Functions to fetch Nigerian operators
async function fetchNigerianOperators() {
  try {
    const accessToken = await getAccessToken();
    
    // First check if we can search by country code
    const countryCode = "NG";
    const url = `https://topups-sandbox.reloadly.com/operators/countries/${countryCode}`;
    
    const response = await axios.get(url, {
      headers: {
        Accept: "application/com.reloadly.topups-v1+json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else {
      // Fallback to filtering all operators
      console.log("Couldn't get operators by country code. Fetching all operators...");
      const allOperatorsUrl = "https://topups-sandbox.reloadly.com/operators";
      
      const allResponse = await axios.get(allOperatorsUrl, {
        headers: {
          Accept: "application/com.reloadly.topups-v1+json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      if (allResponse.data && allResponse.data.content) {
        return allResponse.data.content.filter(op => 
          op.country && op.country.isoName === countryCode
        );
      } else {
        console.error("Unexpected response format:", allResponse.data);
        return [];
      }
    }
  } catch (error) {
    console.error("Error fetching Nigerian operators:", error.response?.data || error.message);
    return [];
  }
}

// Main function
async function main() {
  console.log("Fetching Nigerian mobile operators...");
  const nigerianOperators = await fetchNigerianOperators();
  
  if (nigerianOperators.length === 0) {
    console.log("No Nigerian operators found.");
    return;
  }
  
  console.log(`Found ${nigerianOperators.length} Nigerian operators:`);
  console.log("-------------------------------------------");
  
  nigerianOperators.forEach(op => {
    console.log(`ID: ${op.operatorId} | Name: ${op.name} | Bundle: ${op.bundle ? "Yes" : "No"} | Data: ${op.data ? "Yes" : "No"}`);
  });
  
  console.log("\nSuggested mapping for our contract:");
  console.log("-------------------------------------------");
  
  const networkToOperatorMap = {
    0: "", // MTN Nigeria
    1: "", // Airtel Nigeria
    2: "", // Glo Nigeria
    3: "", // 9mobile (Etisalat) Nigeria
  };
  
  // Try to find the operators automatically
  for (const op of nigerianOperators) {
    const name = op.name.toLowerCase();
    if (name.includes("mtn") && !op.bundle && !op.data) {
      networkToOperatorMap[0] = op.operatorId.toString();
      console.log(`Found MTN: ${op.name} (${op.operatorId})`);
    } else if (name.includes("airtel") && !op.bundle && !op.data) {
      networkToOperatorMap[1] = op.operatorId.toString();
      console.log(`Found Airtel: ${op.name} (${op.operatorId})`);
    } else if (name.includes("glo") && !op.bundle && !op.data) {
      networkToOperatorMap[2] = op.operatorId.toString();
      console.log(`Found Glo: ${op.name} (${op.operatorId})`);
    } else if ((name.includes("9mobile") || name.includes("etisalat")) && !op.bundle && !op.data) {
      networkToOperatorMap[3] = op.operatorId.toString();
      console.log(`Found 9mobile/Etisalat: ${op.name} (${op.operatorId})`);
    }
  }
  
  console.log("\nFinal mapping (copy this to your code):");
  console.log("-------------------------------------------");
  console.log(`const NETWORK_TO_OPERATOR_ID = {
  0: "${networkToOperatorMap[0]}", // MTN Nigeria
  1: "${networkToOperatorMap[1]}", // Airtel Nigeria
  2: "${networkToOperatorMap[2]}", // Glo Nigeria
  3: "${networkToOperatorMap[3]}", // 9mobile Nigeria
};`);
}

// Run the script
main(); 
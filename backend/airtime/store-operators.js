import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getAccessToken } from "./reloadly-airtime-sandbox.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to get all operators
async function getAllOperators() {
  try {
    console.log("Getting access token...");
    const accessToken = await getAccessToken();
    console.log("Access token received. Fetching operators...");
    
    const url = "https://topups-sandbox.reloadly.com/operators";
    
    console.log(`Making request to ${url}`);
    const response = await axios.get(url, {
      headers: {
        Accept: "application/com.reloadly.topups-v1+json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    console.log(`Received ${response.data.content?.length || 0} operators`);
    return response.data.content || [];
  } catch (error) {
    console.error("Error fetching operators:", error.response?.data || error.message);
    throw error;
  }
}

// Function to filter operators by country
function filterOperatorsByCountry(operators, countryCode) {
  return operators.filter(op => op.country?.isoName === countryCode);
}

// Function to write operators to a file
function writeOperatorsToFile(operators, fileName) {
  try {
    const filePath = path.join(__dirname, fileName);
    
    let fileContent = "Operator ID\tName\tCountry\tBundle\n";
    fileContent += "----------------------------------------\n";
    
    operators.forEach(op => {
      fileContent += `${op.operatorId}\t${op.name}\t${op.country?.name || 'Unknown'}\t${op.bundle ? 'Yes' : 'No'}\n`;
    });
    
    fs.writeFileSync(filePath, fileContent);
    console.log(`Operators saved to ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error writing to file ${fileName}:`, error);
    return false;
  }
}

// Function to write operators in JSON format
function writeOperatorsToJsonFile(operators, fileName) {
  try {
    const filePath = path.join(__dirname, fileName);
    
    const operatorsMap = operators.reduce((map, op) => {
      map[op.operatorId] = {
        name: op.name,
        country: op.country?.name || 'Unknown',
        countryCode: op.country?.isoName || 'Unknown',
        bundle: op.bundle,
        denominationType: op.denominationType,
      };
      return map;
    }, {});
    
    fs.writeFileSync(filePath, JSON.stringify(operatorsMap, null, 2));
    console.log(`Operators JSON saved to ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error writing JSON to file ${fileName}:`, error);
    return false;
  }
}

// Main function
async function main() {
  try {
    console.log("Fetching operators from Reloadly...");
    const operators = await getAllOperators();
    console.log(`Found ${operators.length} operators`);
    
    if (operators.length === 0) {
      console.error("No operators found. Check your Reloadly account and credentials.");
      return;
    }
    
    // Save all operators
    writeOperatorsToFile(operators, "all_operators.txt");
    writeOperatorsToJsonFile(operators, "all_operators.json");
    
    // Filter Nigerian operators
    const nigerianOperators = filterOperatorsByCountry(operators, "NG");
    console.log(`Found ${nigerianOperators.length} Nigerian operators`);
    
    if (nigerianOperators.length === 0) {
      console.log("No Nigerian operators found. Here are a few sample operators:");
      operators.slice(0, 5).forEach(op => {
        console.log(`- ${op.operatorId}: ${op.name} (${op.country?.isoName || 'Unknown'})`);
      });
    } else {
      writeOperatorsToFile(nigerianOperators, "nigerian_operators.txt");
      writeOperatorsToJsonFile(nigerianOperators, "nigerian_operators.json");
    }
    
    // Create mapping for our contract
    const networkToOperatorMap = {
      // Update these with the correct Nigerian operator IDs
      0: "", // MTN Nigeria
      1: "", // Airtel Nigeria
      2: "", // Glo Nigeria
      3: "", // 9mobile Nigeria
    };
    
    // Try to find the operators automatically
    for (const op of nigerianOperators) {
      const name = op.name.toLowerCase();
      if (name.includes("mtn")) {
        networkToOperatorMap[0] = op.operatorId.toString();
        console.log(`Found MTN: ${op.name} (${op.operatorId})`);
      } else if (name.includes("airtel")) {
        networkToOperatorMap[1] = op.operatorId.toString();
        console.log(`Found Airtel: ${op.name} (${op.operatorId})`);
      } else if (name.includes("glo")) {
        networkToOperatorMap[2] = op.operatorId.toString();
        console.log(`Found Glo: ${op.name} (${op.operatorId})`);
      } else if (name.includes("9mobile") || name.includes("etisalat")) {
        networkToOperatorMap[3] = op.operatorId.toString();
        console.log(`Found 9mobile/Etisalat: ${op.name} (${op.operatorId})`);
      }
    }
    
    // Save the mapping
    const filePath = path.join(__dirname, "network_mapping.json");
    fs.writeFileSync(filePath, JSON.stringify(networkToOperatorMap, null, 2));
    console.log(`Network mapping saved to ${filePath}`);
    
    // Print current mapping
    console.log("Network to Operator Mapping:");
    console.log(JSON.stringify(networkToOperatorMap, null, 2));
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

// Run the script
main(); 
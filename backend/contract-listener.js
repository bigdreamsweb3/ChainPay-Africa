import { ethers } from "ethers";
import { buyAirtime } from "./airtime/reloadly-airtime-sandbox.js";
import NETWORK_TO_OPERATOR from "./airtime/operator-mapping.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name using ES module approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read contract artifact
const contractArtifact = JSON.parse(
  fs.readFileSync(
    path.join(
      __dirname,
      "../evm-contracts/artifacts/evm-contracts/contracts/chainpay_airtime.sol/ChainPay_Airtime.json"
    ),
    "utf8"
  )
);

// Contract ABI from artifact
const CONTRACT_ABI = contractArtifact.abi;

// Contract address (replace with your deployed contract address on Base Sepolia    )
const CONTRACT_ADDRESS = "0xA124c1f8219068b4783424409518E4Ea014e4DD0";

// Base Goerli RPC URL using Alchemy
const RPC_URL =
  "https://base-sepolia.g.alchemy.com/v2/yVdus-sqxJkzkimp3MZ2B29ViIL7Y-FL";

async function verifyContract(contract) {
  try {
    // Get contract code
    const code = await contract.runner.provider.getCode(CONTRACT_ADDRESS);
    if (code === "0x") {
      throw new Error("No contract found at the specified address");
    }

    // Get contract events
    const events = CONTRACT_ABI.filter((item) => item.type === "event");
    console.log(
      "Available contract events:",
      events.map((e) => e.name)
    );

    // Check if AirtimePurchase event exists
    const hasAirtimePurchaseEvent = events.some(
      (event) => event.name === "AirtimePurchase"
    );
    if (!hasAirtimePurchaseEvent) {
      throw new Error("AirtimePurchase event not found in contract ABI");
    }

    return true;
  } catch (error) {
    console.error("Contract verification failed:", error);
    return false;
  }
}

async function startEventListener() {
  try {
    // Connect to Base Goerli with retry logic
    const provider = new ethers.JsonRpcProvider(RPC_URL);

    // Add retry logic for network connection
    let retries = 3;
    while (retries > 0) {
      try {
        const network = await provider.getNetwork();
        console.log("Connected to network:", {
          name: network.name,
          chainId: network.chainId,
        });
        break;
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        console.log(
          `Connection attempt failed. Retrying... (${retries} attempts left)`
        );
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
      }
    }

    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      provider
    );

    // Verify contract before starting listener
    const isValid = await verifyContract(contract);
    if (!isValid) {
      console.error(
        "Contract verification failed. Please check the contract address and ABI."
      );
      process.exit(1);
    }

    console.log(
      "Starting to listen for AirtimePurchase events on Base Sepolia..."
    );

    // Listen for AirtimePurchase events with error handling
    contract.on(
      "AirtimePurchase",
      async (
        txId,
        user,
        phoneNumber,
        amount,
        network,
        token,
        timestamp,
        creditAmount,
        event
      ) => {
        try {
          console.log("New AirtimePurchase event detected:", {
            txId: txId.toString(),
            user,
            phoneNumber,
            amount: amount.toString(),
            network: network.toString(),
            token,
            timestamp: timestamp.toString(),
            creditAmount,
            transactionHash: event.log.transactionHash,
          });

          // Get the operator ID for the network
          const operatorId = NETWORK_TO_OPERATOR[network];
          if (!operatorId) {
            console.error("Unsupported network:", network);
            return;
          }

          // Format phone number for Reloadly API
          const recipientPhone = {
            countryCode: "NG", // Nigeria
            number: phoneNumber.replace(/^\+/, ""), // Remove + if present
          };

          // Generate a custom identifier using the transaction ID
          const customIdentifier = `ChainPay-${txId.toString()}`;

          // Call the Reloadly API to purchase airtime
          const result = await buyAirtime(
            network, // Pass the network enum directly
            creditAmount, // Use creditAmount instead of amount.toString()
            recipientPhone,
            user, // Use the user's address as senderWallet
            customIdentifier
          );

          console.log("Airtime purchase completed:", result);
        } catch (error) {
          console.error("Error processing AirtimePurchase event:", error);
        }
      }
    );

    // Handle provider events (ethers.js v6)
    provider.on("network", (newNetwork, oldNetwork) => {
      console.log("Network changed:", {
        from: oldNetwork?.name,
        to: newNetwork.name,
      });
    });

    provider.on("error", (error) => {
      console.error("Provider error:", error);
    });

    console.log("Event listener is running on Base Sepolia...");
  } catch (error) {
    console.error("Error starting event listener:", error);
    process.exit(1); // Exit with error code
  }
}

// Start the event listener with process error handling
process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});

// Start the event listener
startEventListener().catch(console.error);

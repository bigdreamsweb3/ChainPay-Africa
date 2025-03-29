const { ethers } = require('ethers');
const { buyAirtime } = require('./airtime/reloadly-airtime-sandbox');
const fs = require('fs');
const path = require('path');

// Read contract artifact
const contractArtifact = JSON.parse(
    fs.readFileSync(
        path.join(__dirname, '../evm-contracts/artifacts/evm-contracts/contracts/chainpay_airtime.sol/ChainPay_Airtime.json'),
        'utf8'
    )
);

// Contract ABI from artifact
const CONTRACT_ABI = contractArtifact.abi;

// Contract address (replace with your deployed contract address on Base Goerli)
const CONTRACT_ADDRESS = "0x147C0BE455151f7A610733413da07F04A3aD0fd4";

// Base Goerli RPC URL using Alchemy
const RPC_URL = "https://base-sepolia.g.alchemy.com/v2/yVdus-sqxJkzkimp3MZ2B29ViIL7Y-FL";

// Network mapping from contract to Reloadly operator IDs
const NETWORK_TO_OPERATOR = {
    0: "535", // MTN
    1: "536", // Airtel
    2: "537", // Glo
    3: "538"  // Etisalat
};

async function startEventListener() {
    try {
        // Connect to Base Goerli with retry logic
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        
        // Add retry logic for network connection
        let retries = 3;
        while (retries > 0) {
            try {
                const network = await provider.getNetwork();
                console.log('Connected to network:', {
                    name: network.name,
                    chainId: network.chainId
                });
                break;
            } catch (error) {
                retries--;
                if (retries === 0) throw error;
                console.log(`Connection attempt failed. Retrying... (${retries} attempts left)`);
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
            }
        }

        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

        console.log('Starting to listen for AirtimePurchase events on Base Sepolia...');

        // Listen for AirtimePurchase events with error handling
        contract.on("AirtimePurchase", async (txId, user, phoneNumber, amount, network, token, timestamp, event) => {
            try {
                console.log('New AirtimePurchase event detected:', {
                    txId: txId.toString(),
                    user,
                    phoneNumber,
                    amount: amount.toString(),
                    network: network.toString(),
                    token,
                    timestamp: timestamp.toString(),
                    transactionHash: event.log.transactionHash
                });

                // Get the operator ID for the network
                const operatorId = NETWORK_TO_OPERATOR[network];
                if (!operatorId) {
                    console.error('Unsupported network:', network);
                    return;
                }

                // Format phone number for Reloadly API
                const recipientPhone = {
                    countryCode: 'NG', // Nigeria
                    number: phoneNumber.replace(/^\+/, '') // Remove + if present
                };

                // Generate a custom identifier using the transaction ID
                const customIdentifier = `ChainPay-${txId.toString()}`;

                // Call the Reloadly API to purchase airtime
                const result = await buyAirtime(
                    operatorId,
                    amount.toString(),
                    recipientPhone,
                    user, // Use the user's address as senderWallet
                    customIdentifier
                );

                console.log('Airtime purchase completed:', result);
            } catch (error) {
                console.error('Error processing AirtimePurchase event:', error);
            }
        });

        // Handle provider events (ethers.js v6)
        provider.on("network", (newNetwork, oldNetwork) => {
            console.log('Network changed:', {
                from: oldNetwork?.name,
                to: newNetwork.name
            });
        });

        provider.on("error", (error) => {
            console.error('Provider error:', error);
        });

        console.log('Event listener is running on Base Sepolia...');
    } catch (error) {
        console.error('Error starting event listener:', error);
        process.exit(1); // Exit with error code
    }
}

// Start the event listener with process error handling
process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    process.exit(1);
});

// Start the event listener
startEventListener().catch(console.error); 
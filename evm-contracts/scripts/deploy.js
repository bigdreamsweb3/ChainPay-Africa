const { ethers } = require("hardhat");

async function main() {
    const usdTokenAddress = "0x12e048d4f26f54c0625ef34fabd365e4f925f2ff";

    try {
        console.log("🔍 Fetching network details...");
        const network = await ethers.provider.getNetwork();
        console.log("🔗 Connected to network:", {
            name: network.name || "unknown",
            chainId: network.chainId.toString()
        });

        console.log("🔍 Fetching contract factory...");
        const Contract = await ethers.getContractFactory("ChainPay_Airtime");

        console.log("🔍 Deploying contract...");
        const contract = await Contract.deploy(usdTokenAddress);

        console.log("🔍 Waiting for deployment...");
        await contract.waitForDeployment();

        console.log("✅ Contract deployed successfully!");
        console.log("📍 Contract Address:", contract.target);
    } catch (error) {
        console.error("❌ Deployment failed!");
        console.error("Error details:", error);
        process.exit(1);
    }
}

// Run the deployment script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Unhandled error:", error);
        process.exit(1);
    });

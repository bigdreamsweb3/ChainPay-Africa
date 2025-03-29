const { ethers } = require("hardhat");

async function main() {
  // Token addresses on Base Sepolia
  const usdcAddress = "0xa4151B2B3e269645181dCcF2D426cE75fcbDeca9"; // USDC on Base Sepolia
  const usdtAddress = "0x900101d06A7426441Ae63e9AB3B9b0F63Be145F1"; // USDT on Base Sepolia

  try {
    console.log("🔍 Fetching network details...");
    const network = await ethers.provider.getNetwork();
    console.log("🔗 Connected to network:", {
      name: network.name || "unknown",
      chainId: network.chainId.toString(),
    });

    console.log("🔍 Fetching contract factory...");
    const Contract = await ethers.getContractFactory("ChainPay_Airtime");

    console.log("🔍 Deploying contract with USDC as initial token...");
    const contract = await Contract.deploy(usdcAddress);

    console.log("🔍 Waiting for deployment...");
    await contract.waitForDeployment();

    console.log("✅ Contract deployed successfully!");
    console.log("📍 Contract Address:", contract.target);
    console.log("🔍 Verify on,", network.name, `${contract.target}`);

    // Add USDT as accepted token
    console.log("🔍 Adding USDT as accepted token...");
    const addUsdtTx = await contract.addAcceptedToken(usdtAddress);
    await addUsdtTx.wait();
    console.log("✅ USDT added as accepted token!");
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

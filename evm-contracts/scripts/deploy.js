const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");
const { updateDeployment } = require("../deployments/index");
const hre = require("hardhat");

// Get contract name from the environment or use default
const CONTRACT_NAME = "ChainPay_Airtime";
const CHAIN_TYPE = "testnet";

// Import chain configs based on network ID
const getTokenConfigs = (chainId) => {
  try {
    let tokenConfig;

    // Testnets
    if (chainId === 84532) {
      // Base Sepolia
      tokenConfig = require(`../chains/${CHAIN_TYPE}/baseTokens.js`);
      return tokenConfig.baseSepoliaTokens || {};
    } else if (chainId === 10143) {
      // Monad Testnet
      tokenConfig = require(`../chains/${CHAIN_TYPE}/monadTokens.js`);
      return tokenConfig.monadTestnetTokens || {};
    }
    // Mainnets
    else if (chainId === 8453) {
      // Base Mainnet
      tokenConfig = require(`../chains/${CHAIN_TYPE}/baseTokens.js`);
      return tokenConfig.baseMainnetTokens || {};
    } else if (chainId === 1) {
      // Replace with actual Monad mainnet chain ID when it launches
      // Monad Mainnet
      tokenConfig = require(`../chains/${CHAIN_TYPE}/monadTokens.js`);
      return tokenConfig.monadMainnetTokens || {};
    } else {
      console.warn(`No token config found for chain ID ${chainId}`);
      return {};
    }
  } catch (error) {
    console.warn(
      `Error loading token config for chain ID ${chainId}:`,
      error.message
    );
    return {};
  }
};

async function main() {
  try {
    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log("🔍 Deploying contracts with account:", deployer.address);

    console.log("🔍 Fetching network details...");
    const network = await ethers.provider.getNetwork();
    console.log("🔗 Connected to network:", {
      name: network.name || "unknown",
      chainId: network.chainId.toString(),
    });

    // Get token addresses from chain config files
    const chainId = parseInt(network.chainId.toString());
    const tokenConfig = getTokenConfigs(chainId);

    const usdcAddress =
      tokenConfig.USDC || "0x6Ac3aB54Dc5019A2e57eCcb214337FF5bbD52897";
    const usdtAddress =
      tokenConfig.USDT || "0xd7e9C75C6C05FdE929cAc19bb887892de78819B7";

    console.log("🔍 Using token addresses:", {
      USDC: usdcAddress,
      USDT: usdtAddress,
    });

    console.log("🔍 Fetching contract factory...");
    const Contract = await ethers.getContractFactory(CONTRACT_NAME);

    console.log(
      `🔍 Deploying contract with USDC (${usdcAddress}) as initial token...`
    );
    const contract = await Contract.deploy(usdcAddress);

    console.log("🔍 Waiting for deployment...");
    await contract.waitForDeployment();

    console.log("✅ Contract deployed successfully!");
    console.log("📍 Contract Address:", contract.target);
    console.log("🔍 Network:", network.name, `Chain ID: ${chainId}`);

    // Add USDT as accepted token
    console.log(`🔍 Adding USDT (${usdtAddress}) as accepted token...`);
    const addUsdtTx = await contract.addAcceptedToken(usdtAddress);
    await addUsdtTx.wait();
    console.log("✅ USDT added as accepted token!");

    // Verify the contract on block explorer
    console.log("🔍 Starting contract verification process...");
    try {
      console.log("📝 Constructor arguments:", [usdcAddress]);

      await hre.run("verify:verify", {
        address: contract.target,
        constructorArguments: [usdcAddress],
        contract: `contracts/${CONTRACT_NAME}.sol:${CONTRACT_NAME}`,
      });

      console.log("✅ Contract verified successfully!");
    } catch (error) {
      console.warn("⚠️ Contract verification failed:", error.message);
      console.log("You can try verifying manually later using:");
      console.log(
        `npx hardhat verify --network ${network.name} ${contract.target} ${usdcAddress}`
      );
    }

    // Update the deployments file
    const today = new Date().toISOString().split("T")[0];

    // Update deployment information
    const deploymentInfo = {
      address: contract.target,
      deployedAt: today,
      version: "1.0.0",
      tokenAddresses: {
        USDC: usdcAddress,
        USDT: usdtAddress,
      },
    };

    const updatedDeployment = updateDeployment(
      chainId,
      CONTRACT_NAME,
      deploymentInfo
    );
    console.log("✅ Updated deployment information:", updatedDeployment);

    // Save the updated deployments back to the file
    const deploymentsPath = path.join(
      __dirname,
      "..",
      "deployments",
      "index.js"
    );

    // Read the current file
    const fileContent = fs.readFileSync(deploymentsPath, "utf8");

    // Replace the deployments object in the file
    const regex = /const deployments = ({[\s\S]*?});/;
    const updatedFileContent = fileContent.replace(
      regex,
      `const deployments = ${JSON.stringify(
        require("../deployments").deployments,
        null,
        2
      )};`
    );

    // Write back to the file
    fs.writeFileSync(deploymentsPath, updatedFileContent, "utf8");

    console.log(
      `✅ Updated deployments file for ${CONTRACT_NAME} on network ${chainId}`
    );

    // Also update frontend references if needed
    await updateFrontendReferences(chainId, CONTRACT_NAME, contract.target);

    console.log("🎉 Deployment process completed successfully!");
  } catch (error) {
    console.error("❌ Deployment failed!");
    console.error("Error details:", error);
    process.exit(1);
  }
}

/**
 * Updates any necessary frontend references to contracts
 */
async function updateFrontendReferences(
  chainId,
  contractName,
  contractAddress
) {
  try {
    // Update MonadChain.ts if needed
    if (chainId === 10143) {
      console.log("🔍 Updating MonadChain.ts reference...");
      const monadChainPath = path.join(
        __dirname,
        "..",
        "..",
        "src",
        "utils",
        "web3",
        "chains",
        CHAIN_TYPE,
        "MonadChain.ts"
      );

      if (fs.existsSync(monadChainPath)) {
        let content = fs.readFileSync(monadChainPath, "utf8");
        content = content.replace(
          /buyAiritimeContract: .*/,
          `buyAiritimeContract: "${contractAddress}",`
        );
        fs.writeFileSync(monadChainPath, content);
        console.log("✅ Updated MonadChain.ts with new contract address");
      }
    }

    // Update BaseChain.ts if needed
    if (chainId === 84532) {
      console.log("🔍 Updating BaseChain.ts reference...");
      const baseChainPath = path.join(
        __dirname,
        "..",
        "..",
        "src",
        "utils",
        "web3",
        "chains",
        CHAIN_TYPE,
        "BaseChain.ts"
      );

      if (fs.existsSync(baseChainPath)) {
        let content = fs.readFileSync(baseChainPath, "utf8");
        content = content.replace(
          /buyAiritimeContract: .*/,
          `buyAiritimeContract: "${contractAddress}",`
        );
        fs.writeFileSync(baseChainPath, content);
        console.log("✅ Updated BaseChain.ts with new contract address");
      }
    }
  } catch (error) {
    console.warn("⚠️ Error updating frontend references:", error.message);
  }
}

// Run the deployment script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Unhandled error:", error);
    process.exit(1);
  });

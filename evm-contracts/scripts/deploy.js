const { ethers } = require("hardhat");

async function main() {
    const usdcTokenAddress = "0x12e048d4f26f54c0625ef34fabd365e4f925f2ff"; // Replace with actual token address

    console.log("Deploying contract to network:", hre.network.name);
    console.log("Using RPC URL:", hre.network.config.url); // Log the RPC URL

    const Contract = await ethers.getContractFactory("ChainPay_Airtime");

    // Fetch the suggested gas fees from the network
    const feeData = await ethers.provider.getFeeData();
    console.log("Network suggested gas fees:", feeData);

    // Set priority fee dynamically (ensure it's at least the required minimum)
    const maxPriorityFeePerGas =
        feeData.maxPriorityFeePerGas || ethers.parseUnits("600", "gwei");
    const maxFeePerGas =
        feeData.maxFeePerGas || ethers.parseUnits("1000", "gwei");

    console.log(
        "Using Max Priority Fee Per Gas:",
        maxPriorityFeePerGas.toString()
    );
    console.log("Using Max Fee Per Gas:", maxFeePerGas.toString());

    // Estimate gas required for contract deployment
    const estimatedGas = await ethers.provider.estimateGas(
        Contract.getDeployTransaction(usdcTokenAddress)
    );

    console.log(`Estimated Gas Required: ${estimatedGas.toString()} units`);

    // Calculate total estimated cost (in native token)
    const estimatedCost = estimatedGas * maxFeePerGas;
    console.log(
        `Estimated Deployment Cost: ${ethers.formatUnits(
      estimatedCost,
      "ether"
    )} ETH`
    );

    // Deploy the contract with dynamically set gas fees
    let contract;
    try {
        contract = await Contract.deploy(usdcTokenAddress, {
            maxPriorityFeePerGas,
            maxFeePerGas,
        });
    } catch (error) {
        console.error("Contract deployment failed:", error);
        process.exit(1);
    }

    console.log("Deploying contract...");

    await contract.deployed();

    console.log("Contract deployed to:", contract.address);
    console.log("Contract object:", contract);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

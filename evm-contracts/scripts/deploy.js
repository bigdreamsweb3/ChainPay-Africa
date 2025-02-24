const { ethers } = require("hardhat");

async function main() {
    // Get the contract factory for your contract
    const Contract = await ethers.getContractFactory("ChainPay_Airtime");

    console.log("Deploying contract...");

    // Deploy the contract
    const contract = await Contract.deploy();

    console.log("Contract deployed to:", contract.address);
}

// Run the deploy script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
const { ethers } = require("hardhat");

async function main() {
    // Get the Contract factory
    const Contract = await ethers.getContractFactory("YourContractName");

    // Deploy the contract
    console.log("Deploying contract...");
    const contract = await Contract.deploy();

    console.log("Contract deployed to:", contract.address);
}

// Run the script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
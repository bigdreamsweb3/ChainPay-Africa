const { ethers } = require("hardhat");

async function main() {
    // Specify the address of the initial USDC token (or any other accepted token)
    const usdcTokenAddress = "0xea26a662333a2a5E87fB6851fc24a47fa53d98D1"; // Replace with the actual token address

    console.log("Deploying contract to network:", hre.network.name);

    // Get the contract factory
    const Contract = await ethers.getContractFactory("ChainPay_Airtime");

    // // 
    // console.log("Gas price set to:", gasPrice);
    // const maxPriorityFeePerGas = ethers.parseUnits("2", "gwei"); // Adjust as necessary
    console.log("Max priority fee per gas set to:", maxPriorityFeePerGas);
    const maxFeePerGas = ethers.parseUnits("30", "gwei"); // Adjust as necessary
    console.log("Max fee per gas set to:", maxFeePerGas);

    // Deploy the contract and pass the address of the accepted token to the constructor
    const contract = await Contract.deploy(usdcTokenAddress, {
        gasPrice,
        maxPriorityFeePerGas,
        maxFeePerGas,
    });

    console.log("Deploying contract...");

    await contract.deployed(); // Ensure contract is deployed before logging the address

    console.log("Contract deployed to:", contract.address);
}

// Run the deploy function
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
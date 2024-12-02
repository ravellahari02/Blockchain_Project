const hre = require("hardhat");

async function main() {
    const healthDataAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Use your deployed contract address
    const HealthData = await hre.ethers.getContractFactory("HealthData");
    const healthData = HealthData.attach(healthDataAddress);

    // Set a record for the caller
    const dataHash = "example_data_hash"; // Replace with your data hash
    const doctorAddress = "0x0000000000000000000000000000000000000001"; // Replace with a valid address
    
    const tx = await healthData.setRecord(dataHash, doctorAddress);
    await tx.wait(); // Wait for the transaction to be mined

    console.log("Record set successfully!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

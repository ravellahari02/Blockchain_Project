const hre = require("hardhat");

async function main() {
    const healthDataAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Use your deployed contract address
    const HealthData = await hre.ethers.getContractFactory("HealthData");
    const healthData = HealthData.attach(healthDataAddress);

    const record = await healthData.getRecord(); // Call the getRecord function
    console.log("Record:", record);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

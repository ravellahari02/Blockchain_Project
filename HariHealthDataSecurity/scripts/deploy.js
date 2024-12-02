const hre = require("hardhat");

async function main() {
    const HealthData = await hre.ethers.getContractFactory("HealthData");
    const healthData = await HealthData.deploy();

    await healthData.deployed();

    console.log("HealthData contract deployed to:", healthData.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

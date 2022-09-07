const { ethers, run, network } = require("hardhat");

async function main() {
  const coffeeFactory = await ethers.getContractFactory("BuyRoyACoffee");
  console.log("------------Deploying Contract-----------");
  const buyRoyACoffee = await coffeeFactory.deploy();
  await buyRoyACoffee.deployed();
  console.log("Contract deployed at: " + (await buyRoyACoffee.address));

  // we will now interact with the smart contract

  const balance = await buyRoyACoffee.showBalance();
  console.log(`Initial balance is ${balance} ether`);

  // calling the buyCoffee function

  const tipAmount = ethers.utils.parseEther("0.1");
  const name = "Roy";
  const message = "writingTest";
  const tx = await buyRoyACoffee.buyCoffee(tipAmount, name, message, {
    value: tipAmount,
  });
  const newBalance = await buyRoyACoffee.showBalance();
  const balanceInEth = ethers.utils.formatEther(newBalance.toString());
  console.log(`New Balance is ${balanceInEth} ethers`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

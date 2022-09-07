const { assert } = require("chai");
const { utils } = require("ethers");
const { ethers } = require("hardhat");

describe("BuyRoyACoffee", () => {
  let coffeeFactory;
  let buyRoyACoffee;

  beforeEach(async () => {
    coffeeFactory = await ethers.getContractFactory("BuyRoyACoffee");
    buyRoyACoffee = await coffeeFactory.deploy();
  });

  it("Should show the current balance of the contract as 0", async () => {
    const currentBalance = await buyRoyACoffee.showBalance();
    const expectedBalance = 0;
    assert.equal(currentBalance, expectedBalance);
  });

  it("Should update the balance of the contract after recieving a tip", async () => {
    const tipAmount = utils.parseEther("0.1");
    const name = "Roy";
    const message = "writingTest";
    const tx = await buyRoyACoffee.buyCoffee(tipAmount, name, message, {
      value: tipAmount,
    });
    const balance = await buyRoyACoffee.showBalance();
    assert.equal(balance.toString(), tipAmount.toString());
  });

  it("Shall display the keys in the memo", async () => {
    const tipAmount = utils.parseEther("0.1");
    const name = "Roy";
    const message = "writingTest";
    const tx = await buyRoyACoffee.buyCoffee(tipAmount, name, message, {
      value: tipAmount,
    });
    const res = await buyRoyACoffee.memos(0);
    assert.equal(name, res.name);
  });

  it("Should be able to withdraw the balance", async () => {
    const tipAmount = utils.parseEther("0.1");
    const name = "Roy";
    const message = "writingTest";
    const tx = await buyRoyACoffee.buyCoffee(tipAmount, name, message, {
      value: tipAmount,
    });
    await buyRoyACoffee.withdraw();
    const balance = await buyRoyACoffee.showBalance();
    assert.equal(balance, 0);
  });
});

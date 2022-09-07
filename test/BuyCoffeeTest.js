const { assert } = require("chai");
const { utils } = require("ethers");
const { ethers } = require("hardhat");

const abi = require("../utils/abi.json");

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

  it("Singer is equal to owner", async () => {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const tipAmount = utils.parseEther("0.1");
    const name = "Roy";
    const message = "writingTest";
    const tx = await buyRoyACoffee.buyCoffee(tipAmount, name, message, {
      value: tipAmount,
    });
    const ownerOfContract = await buyRoyACoffee.showOwner();
    assert.equal(owner.address, ownerOfContract.toString());
  });

  it("Should not be able to withdraw if !owner", async () => {
    const tipAmount = utils.parseEther("0.1");
    const name = "Roy";
    const message = "writingTest";
    const tx = await buyRoyACoffee.buyCoffee(tipAmount, name, message, {
      value: tipAmount,
    });
    const [owner, addr1, addr2] = await ethers.getSigners();
    const provider = await ethers.getDefaultProvider();
    const contract = new ethers.Contract(buyRoyACoffee.address, abi, provider);
    const contractWithWallet = contract.connect(addr1);
    let success;
    try {
      await contractWithWallet.withdraw();
    } catch (error) {
      success = false;
    }
    assert.equal(success, false);
  });
});

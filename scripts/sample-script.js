// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { default: accounts } = require("@openzeppelin/cli/lib/scripts/accounts");
const { ethers } = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const accounts = await ethers.getSigners();
  

  // We get the contract to deploy
  const SafeTrade = await ethers.getContractFactory("SafeTrade");
  const trade = await SafeTrade.deploy();

  await trade.deployed();
  console.log("SafeTrade deployed to:", trade.address);

  const price =  ethers.utils.parseEther("1.0")
  await trade.initTradeDetails(accounts[1].address, accounts[2].address, price);
  const buyer = await trade.buyer();
  const seller = await trade.seller();
  console.log("Trade details - Buyer", buyer, " Seller:", seller);

  console.log(await ethers.provider.getBalance(trade.address));

  const tx = await accounts[1].sendTransaction({
    to: trade.address,
    value: ethers.utils.parseEther("1.2")
  });

  tx.wait();
  console.log(await ethers.provider.getBalance(trade.address));

  await trade.checkFunds();
  console.log(await ethers.provider.getBalance(trade.address));

  await trade.connect(accounts[2]).acceptProductOrNot(true);
  console.log(await trade.tradeStatus());
  console

  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

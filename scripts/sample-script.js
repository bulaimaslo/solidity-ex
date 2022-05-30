// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { default: accounts } = require("@openzeppelin/cli/lib/scripts/accounts");
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const accounts = await hre.ethers.getSigners();
  

  // We get the contract to deploy
  const SafeTrade = await hre.ethers.getContractFactory("SafeTrade");
  const trade = await SafeTrade.deploy();

  await trade.deployed();
  console.log("SafeTrade deployed to:", trade.address);

  await trade.initTradeDetails(accounts[1].address, accounts[2].address,1000000);
  const buyer = await trade.buyer();
  const seller = await trade.seller();
  console.log("Trade details - Buyer", buyer, " Seller:", seller);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

const { expect } = require("chai");
const { Contract, utils } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

describe("SafeTrade contract", function () {

    const price =  ethers.utils.parseEther("1.0");

    beforeEach(async function() {
        [owner, buyer, seller, addr3, addr4] = await ethers.getSigners();

        SafeTrade = await ethers.getContractFactory("SafeTrade");
        safeTradeEth = await SafeTrade.deploy();
        safeTradeErc = await SafeTrade.deploy();
        await safeTradeEth.deployed();
        // safeTrade.initTradeDetails();
        

    });

    describe("Deployment", function () {
        it("Should set the right arbitrator", async function () {
            expect(await safeTradeEth.arbitrator()).to.equal(owner.address);
        });
    });

    describe("Trade Details initialization", function () {

        it("Should set the right parameters - eth payment", async function () {
            await safeTradeEth.initTradeDetails(seller.address, buyer.address, price);
            
            expect(await safeTradeEth.buyer()).to.equal(buyer.address);
            expect(await safeTradeEth.seller()).to.equal(seller.address);
            // expect(await safeTradeEth.token()).to.equal(0);
            expect(await safeTradeEth.tokenAmount()).to.equal(0);
            expect(await safeTradeEth.price()).to.equal(price);
        });
        
    });

    describe("Sending funds - Eth", function () {
        it("Should allow to send funds", async function () {
            const value = ethers.utils.parseEther("0.5")
            const tx = await buyer.sendTransaction({
                to: safeTradeEth.address,
                value: value
            });

            tx.wait();
            expect(await ethers.provider.getBalance(safeTradeEth.address)).to.equal(value);

            const value2 = ethers.utils.parseEther("0.7")
            const tx2 = await buyer.sendTransaction({
                to: safeTradeEth.address,
                value: value2
            });

            tx2.wait();
            expect(await ethers.provider.getBalance(safeTradeEth.address)).
                to.equal(ethers.utils.parseEther("1.2"));
        });

    });

    // describe("Accepting the product", function () {
    //     it("Should allow to accept state of received product or not")


    // });

    
    // describe("Access restriction", async function() {
    //     it("S")
    // }); 

});
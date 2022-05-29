const { expect } = require("chai");
const { Contract, utils } = require("chai");
const { ethers } = require("hardhat");

describe("SafeTrade contract", function () {

    beforeEach(async function() {
        [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();

        SafeTrade = await ethers.getContractFactory("SafeTrade");
        safeTrade = await SafeTrade.deploy();
        await safeTrade.deployed();
        // safeTrade.initTradeDetails();

    });

    describe("Deployment", function () {
        it("Should set the right arbitrator", async function () {
            expect(await safeTrade.arbitrator()).to.equal(owner.address);
        });
    });

});
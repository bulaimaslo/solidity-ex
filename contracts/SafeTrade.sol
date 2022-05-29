//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
// import "../node_modules/@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
// import "../node_modules/@openzeppelin/contracts/utils/Address.sol";
// import "../node_modules/@openzeppelin/contracts/utils/Context.sol";
import "./OZcontracts/contracts/token/ERC20/utils/SafeERC20.sol";
// import "./OZcontracts/utils/Address.sol";
// import "./OZcontracts/utils/Context.sol";


contract SafeTrade {
    event PaymentReceived(address from, uint256 amount, uint256 leftToPay);

    enum Status{INITIATED, MONEY_LOCKED, DISPUTE, ENDED}

    Status private tradeStatus;
    address public arbitrator;
    address payable public seller;
    address payable private buyer;
    IERC20 private currency;
    uint256 private tokenAmount;

    modifier arbitratorOnly() {
        require(msg.sender == arbitrator);
        _;
    }

    constructor() payable {
        arbitrator = msg.sender;
    }

    function initTradeDetails(address payable _seller,
                address payable _buyer,
                IERC20 _currency,
                uint256 _tokenAmount) public arbitratorOnly {

        require(_tokenAmount > 0, "Price must be greater than 0");

        seller = _seller;
        buyer = _buyer;
        currency = _currency;
        tokenAmount = _tokenAmount;
        tradeStatus = Status.INITIATED;
    }


    function payAndReturnChange() payable public {
        uint256 difference = tokenAmount - address(this).balance; 

        if (difference == 0) {
            tradeStatus = Status.MONEY_LOCKED;
        }
        else {
            payable(msg.sender).transfer(difference);
            // _tradeStatus = Status.MONEY_LOCKED;
        }
        emit PaymentReceived(msg.sender, msg.value, difference);
    }

    // function returnFunds(address acc) only owner

    // function PayAndReturnChange(IERC20 token, address account) payable {
    // }
}

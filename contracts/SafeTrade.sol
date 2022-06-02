//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
// import "../node_modules/@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./OZcontracts/contracts/token/ERC20/utils/SafeERC20.sol";


contract SafeTrade {
    enum Status{INITIATED, MONEY_LOCKED, DISPUTE, ENDED}

    Status public tradeStatus;
    address public arbitrator;
    address payable public seller;
    address payable public buyer;
    IERC20 private token;
    uint256 public tokenAmount;
    uint256 public price;

    modifier arbitratorOnly() {
        require(msg.sender == arbitrator);
        _;
    }

    constructor() payable {
        arbitrator = msg.sender;
    }

    receive() external payable virtual {}

    function initTradeDetails(address payable _seller,
                address payable _buyer,
                uint256 _price) public arbitratorOnly {

        require(_price > 0, "Price must be greater than 0");

        seller = _seller;
        buyer = _buyer;
        price = _price;
        tradeStatus = Status.INITIATED;
    }

    // function initTradeDetails(address payable _seller,
    //             address payable _buyer,          
    //             uint256 _tokenAmount,
    //             IERC20 _token) public arbitratorOnly {

    //     require(_tokenAmount > 0, "Token amount must be greater than 0");

    //     seller = _seller;
    //     buyer = _buyer;
    //     token = _token;
    //     tokenAmount = _tokenAmount;
    //     tradeStatus = Status.INITIATED;
    // }



    function checkFunds() payable public returns(bool) {
        console.log(tokenAmount);
        console.log(address(this).balance);
        
        if (tokenAmount > address(this).balance) {
            return false;
        } 

        uint256 difference = address(this).balance - tokenAmount; 
        if (difference == 0) {
            tradeStatus = Status.MONEY_LOCKED;
        }
        else {
            payable(msg.sender).transfer(difference);
            tradeStatus = Status.MONEY_LOCKED;
        }

        return true;
    }

    function acceptProductOrNot(bool accept) external {
        require(msg.sender == buyer, "Only buyer");
        if(accept) {
            releaseFundsToSeller();
            tradeStatus = Status.ENDED;
        } else {   
            tradeStatus = Status.DISPUTE;
        }
    }

    function releaseFundsToSeller() internal {
        //return Eth or ERC20
        if (tokenAmount == 0) {
            payable(seller).transfer(address(this).balance);
        } else {
            uint256 tokenBalance = IERC20(token).balanceOf(address(this));
            SafeERC20.safeTransfer(IERC20(token), payable(seller), tokenBalance);
        }
    }

    function resolveDispute(address _disputeWinner) external arbitratorOnly {

        payable(_disputeWinner).transfer(address(this).balance);
    }

    function resolveDispute(address _disputeWinner, address _token) external {
        uint256 tokenBalance = IERC20(_token).balanceOf(address(this));
        
        SafeERC20.safeTransfer(IERC20(_token), payable(_disputeWinner), tokenBalance);
    }

}

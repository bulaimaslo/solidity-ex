# SafeTrade
SafeTrade is a smart contract allowing users to secure the selling transaction of a physical object in exchange of Eth or any  ERC-20 token.
 
## Process of the transaction
1. Arbitrator deploys the contract and specifies trade details
2. Buyer locks funds in the contract.
3. Seller sends his product. \
4a. Buyer accepts the received product. \
5a. Funds are released to the seller. \
4b. Buyer does not accept the state of the received product. \
5b. Arbitrator solves the dispute and returns funds to the right person.  \


## Quickstart

1. Clone the repository
```bash
git clone https://github.com/bulaimaslo/solidity-ex/
cd solidity-ex
```
Install dependencies:
```
npm i
```

2. Now you can:
 - run scripts
```
npx hardhat scripts/sample-script.js
```
- run tests
```
npx hardhat test
```
- get coverage report
```
npx hardhat coverage
```

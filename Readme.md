# HIPR Network
![Crates.io](https://img.shields.io/crates/l/rustc-serialize.svg) ![GitHub release](https://img.shields.io/github/release/qubyte/rubidium.svg?style=flat-square)
## Human Initated Performance Reporting 
`Hercules' first Internal Control powered by Proof of Human Work` 

## Compatible with 
> - EOS
> - Ethereum

# Play, Win, Earn! 
Playing HIPR and provding Consensus on data integrity will earn you HERC tokens that can be leveraged in the platform to send and receive information over the network. 

## Deployed Contracts 
> - Main Ethereum Network
https://mainnet.infura.io/CHs7q12LsOAlHu4D3Kvr 
> - Test Ethereum Network (Ropsten)
https://ropsten.infura.io/CHs7q12LsOAlHu4D3Kvr 
> - Test Ethereum Network (Rinkeby)
https://rinkeby.infura.io/CHs7q12LsOAlHu4D3Kvr 
> - Test Ethereum Network (Kovan)
https://kovan.infura.io/CHs7q12LsOAlHu4D3Kvr 

## Getting Started:

### Installing Dependancies: 

```
sudo apt-get update
sudo apt-get install -y curl
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs node-gyp git build-essential
```
Confirm Node is available
```
nodejs --version
v8.9.4
node --version
v8.9.4
```
```
sudo npm install -g truffle@4.0.7
```
Confirm Truffle Version
```
truffle version
Truffle v4.0.7(core: 4.0.7)
Solidity v0.4.24 (solc-js)
```
```
truffle
Truffle v4.0.7 - a development framework for Ethereum
...
```
```
mkdir HIPR
cd ~/HIPR
mkdir HERC
cd HERC
truffle init
```
Clone this repo into the $PATH

#### Running Tests

Start Testrpc
```
npm run testrpc
```
Compile contracts
```
npm run compile
```
Run Tests
```
npm run test
```

### Contributing	

HERC protocol is an open source and community based project to which the core development team highly encourages fellow developers to build improvements and scale the future of the platform.  
To report bugs within the HERC smart contracts or unit tests, please create an issue in this repository. 

## HIPS
Parlimentary or Significant changes to HERC protocol's smart contracts, architecture, message format or functionality should be proposed in the 
[HERC Improvement Proposals (HIPS)](https://github.com/hercone/hips) repository. Follow the contribution guidelines provided therein :) 

### Coding Conventions
As we have found from other projects such as 0x and other Ethereum based platforms we use a custom set of [TSLint](https://palantir.github.io/tslint/) rules to enforce our coding conventions. 

In order to see style violation erros, install a tsliner for your text editor. e.g Atom's [atom-typescript](https://atom.io/packages/atom-typescript)

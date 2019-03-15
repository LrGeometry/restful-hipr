# HIPR Network
![Crates.io](https://img.shields.io/crates/l/rustc-serialize.svg) ![GitHub release](https://img.shields.io/github/release/qubyte/rubidium.svg?style=flat-square)
## Human Initated Performance Reporting 
`Hercules' first Internal Control powered by Proof of Human Work` 

## Compatible with 
> - Ethereum

# Play, Win, Earn! 
Playing HIPR and provding Consensus on data integrity will earn you HERC tokens that can be leveraged in the platform to send and receive information over the network. 

## Getting Started

### Install

#### Clone restful-hpir repo

```
git clone https://github.com/HERCone/restful-hipr
```

#### Configure *.env* file

Configure *.env* file for hd wallet signing by your private key. (see *.env.example*)
- set MNEMONIC environment variable for main network
- set MNEMONIC_ganache environment variable for ganache dev

*.env.example:*
```
MNEMONIC=dust fever scissors aware frown minor start ladder lobster success hundred clerk
MNEMONIC_ganache=dust fever scissors aware frown minor start ladder lobster success hundred clerk
```

#### Start service

Install node_modules:
```
cd restful-hipr
npm install
```

Run ***restfil-hipr*** on http://localhost:8086
```
./bin/www
```

Try [HIPR](https://github.com/HERCone/HIPR) locally

##### Expected output

```
using MNEMONIC_ganache for HD wallet
load abi from contracts/PlayerScore.abi.json
new contract success contracts/PlayerScore.abi.json at address: 0x11ee9ff611bd9d24fd760aef7980e0dd977f9f63
load abi from contracts/PuzzleManager.abi.json
new contract success contracts/PuzzleManager.abi.json at address: 0xf0831e19dadc09d13b1189a8c8b39b5ed90c23ac
We are listening on port 8086!
```

##### Possible errors

- Error: .env file not configured propertly
```
ERROR: .env file not found. HD wallet not works (see .env.example)
ERROR: MNEMONIC_ganache not found. HD wallet not works. Please configure .env file propertly
ERROR: Use it to sign transactions for addresses derived from a 12-word mnemonic
```

#### Main config file *config/default.json* details

Config options:

- mongodb - mongodb path
- blockchain
  - activeChain - active chain network pair [blockchain, network] (*default: ["eth", "main"]*)
  - eth - ethereum web3 configuration (*see network configuration sample*)
    - *"main"* - main net config
    - *"ganache"* - ganache config

**Network configuration sample**

Ganache configuration:

```
"ganache": {
    "HDWallet": "MNEMONIC_ganache",
    "HDWalletSignOnly": true,
    "contracts": {
        "PlayerScore": {
        "options": {
            "from": "0x2d7DCbCd35737890540DdEE4Aa229B2Cb15DE615"
        },
        "address": "0x11ee9ff611bd9d24fd760aef7980e0dd977f9f63",
        "abiPath": "contracts/PlayerScore.abi.json",
        "validation": {
            "contractName": "PlayerScore",
            "compiler": {
                "name": "solc",
                "version": "0.4.24+commit.e67f0147.Emscripten.clang"
            },
            "updatedAt": "2019-03-09T19:10:27.181Z",
            "validation": {
            "hash": "491a2b12f4c676d33ae5b058c4eb91b136f142cf9daedf2292032a416a629ef1",
            "deployDate": "2019-03-09T19:10:28.176Z",
            "deployBy": "HERC Team",
            "abiHash": "da93a7c2ca07139bf30a86a007e8b278f8b49fbce1d4b3ada773e3850db795fc",
            "sourceSize": 28216,
            "sourceLines": 336,
            "sourceHash": "705481fd5cd8a2647fd211a9ddc7afc44fb091d2a52460ab1a2c1701ff9d0cd7",
            "bytecodeHash": "839176fea52d6bcf2bf40e804a5042b95093eac62cb5122e1eafc6539e52d0f7",
            "buildHash": "3e89245ecc40b1c25ed3fc3f56279aa360f578f4195d88b26a9129370d17ae68"
            }
        },
        "from": "0x2d7DCbCd35737890540DdEE4Aa229B2Cb15DE615"
        },
        "PuzzleManager": {
        "options": {
            "from": "0x2d7DCbCd35737890540DdEE4Aa229B2Cb15DE615"
        },
        "address": "0xf0831e19dadc09d13b1189a8c8b39b5ed90c23ac",
        "abiPath": "contracts/PuzzleManager.abi.json",
        "validation": {
            "contractName": "PuzzleManager",
            "compiler": {
                "name": "solc",
                "version": "0.4.24+commit.e67f0147.Emscripten.clang"
            },
            "updatedAt": "2019-03-09T19:10:27.168Z",
            "validation": {
            "hash": "b59d1e18679eba6c980ac063b64d38a1ed35d4dbfdc1dbda5833e14d04755079",
            "deployDate": "2019-03-09T19:10:29.052Z",
            "deployBy": "HERC Team",
            "abiHash": "66d04ced002f87c1aad27660584cf20bf8f273af02a92a17f0dabe13367480e8",
            "sourceSize": 8101,
            "sourceLines": 140,
            "sourceHash": "ec3035e566c6a987b893157a45b221d55cb0821f3da72c861581b7fa22fa0988",
            "bytecodeHash": "c7a3e00d697ef00f44400e0a255defce86fdd68d77b53a93835a914aff0de91c",
            "buildHash": "2758c1b11ce408a00861f3d7091e217b89fd19eff688294f3f8e8233a600ffc1"
            }
        },
        "from": "0x2d7DCbCd35737890540DdEE4Aa229B2Cb15DE615"
    }
}    
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

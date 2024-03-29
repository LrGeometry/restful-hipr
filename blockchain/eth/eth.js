const 
    fs = require('fs'),
    Web3 = require('web3')

if (fs.existsSync(`${__dirname}/../../.env`)) {
    require('dotenv').config()
}
else {
    console.error('ERROR: .env file not found. HD wallet not works (see .env.example)')
}

const HDWalletProvider = require('truffle-hdwallet-provider');
    
var _web3 = {}

var playerScore
var puzzleManager

var options

var EthPlayerScore = new require('./modules/eth-player-score')
var EthAssetValidator = new require('./modules/eth-asset-validator')
var EthAssetValidatorSecure = new require('./modules/eth-asset-validator-secure')

class Eth {
    constructor (options) {
        this.options = options

        this.playerScore = null
        this.puzzleManager = null

        this.init(options)

        // Modules

        this.ethPlayerScore = this.lol(new EthPlayerScore())
        this.ethAssetValidator = this.lol(new EthAssetValidator())
        this.ethAssetValidatorSecure = this.lol(new EthAssetValidatorSecure())

        // Player score

        this.getTopScoresCount = this.ethPlayerScore.getTopScoresCount
        this.getTopScores = this.ethPlayerScore.getTopScores
        this.setScore = this.ethPlayerScore.setScore

        this.getTopScoresSecureCount = this.ethPlayerScore.getTopScoresSecureCount
        this.getTopScoresSecure = this.ethPlayerScore.getTopScoresSecure
        this.setScoreSecure = this.ethPlayerScore.setScoreSecure

        this.signAddressScore = this.ethPlayerScore.signAddressScore
        this.setScoreSecureSign = this.ethPlayerScore.setScoreSecureSign

        this.payoutSetup = this.ethPlayerScore.payoutSetup
        this.payoutSetSeason = this.ethPlayerScore.payoutSetSeason
        this.payoutToWinners = this.ethPlayerScore.payoutToWinners
        this.isSeasonOver = this.ethPlayerScore.isSeasonOver
        this.payoutInfo = this.ethPlayerScore.payoutInfo
        this.wipeScores = this.ethPlayerScore.wipeScores

        // Asset validator

        this.createPuzzle = this.ethAssetValidator.createPuzzle
        this.pushMetrics = this.ethAssetValidator.pushMetrics
        this.compareMetrics = this.ethAssetValidator.compareMetrics
        this.validateMetrics = this.ethAssetValidator.validateMetrics
        this.getPuzzleMetrics = this.ethAssetValidator.getPuzzleMetrics
        this.getPuzzleOriginalMetrics = this.ethAssetValidator.getPuzzleOriginalMetrics

        
        this.getRandomPuzzleStringByType = this.ethAssetValidatorSecure.getRandomPuzzleStringByType
        this.registerPuzzleAddress = this.ethAssetValidatorSecure.registerPuzzleAddress
        this.createPuzzleSecure = this.ethAssetValidatorSecure.createPuzzleSecure
        this.pushSecureMetrics = this.ethAssetValidatorSecure.pushSecureMetrics
        this.compareSecureMetrics = this.ethAssetValidatorSecure.compareSecureMetrics
    }

    lol (o) {
        let web3 = this.defaultWeb3()

        o.options = options
        o.puzzleManager = this.puzzleManager
        o.playerScore = this.playerScore

        return o
    }

    // web3:init [

    getWeb3 (url) {
        let web3 = _web3[url]
        if (web3 == undefined) {
            var provider
            if (options.HDWallet) {
                console.log(`using ${options.HDWallet} for HD wallet`)
                if (!process.env[options.HDWallet]) {
                    console.error(`ERROR: ${options.HDWallet} not found. HD wallet not works. Please configure .env file propertly`)
                    console.error('ERROR: Use it to sign transactions for addresses derived from a 12-word mnemonic')
                }
                else if (options.HDWalletSignOnly) {
                    this.hd = {}
                    this.hd.provider = new HDWalletProvider(process.env[options.HDWallet], url)
                    this.hd.accounts = []
                    for (var w in this.hd.provider.wallets) {
                        var wallet = this.hd.provider.wallets[w]
                        var privkey = wallet.getPrivateKey()
                        this.hd.accounts.push({account: w, privkey: privkey.toString('hex')})
                    }
                    this.hd.web3 = new Web3(this.hd.provider)
                    console.log('URL:', url)
                    console.log('deploy_account:', this.hd.provider.addresses[0])
                }
            }

            if (!provider) {
                provider = new Web3.providers.HttpProvider(url)
            }
            web3 = new Web3(provider)
            _web3[url] = web3
            this.initWeb3(web3)
        }
        return web3
    }

    defaultWeb3 () {
        let url = options.url
        return this.getWeb3(url)
    }

    // todo: review sigle instance 

    initWeb3 (web3) {
    //    web3.eth.subscribe('an_event', (error, event) => {})
        this.playerScore = this.contractInit(web3, options.contracts['PlayerScore'])
        this.puzzleManager = this.contractInit(web3, options.contracts['PuzzleManager'])
    }

    init (options_) {
        options = options_
        this.defaultWeb3()
    }

    // web3:init ]
    // web3:api [

    getAddress (index) {
        var web3 = this.defaultWeb3()
        if (options.HDWallet) {
            if (!process.env[options.HDWallet])
                return null
            var provider = new HDWalletProvider(process.env[options.HDWallet], options.url, index)
            return provider.addresses[0]
        }
        else {
            return web3.eth.personal.getAccounts()[index]
        }
    }

    getHDAccount (index) {
        if (options.HDWallet) {
            return this.hd.accounts[index]
        }
        return null
    }

    // web3:api ]
    // web3:contract [

    contractInit (web3, options) {
        
        console.log('load abi from', options.abiPath)

        var abi = JSON.parse(fs.readFileSync(options.abiPath))
        
        let contract = new web3.eth.Contract(abi, options.address, options.options)
    //    contract.events.an_event({}, (error, event) => {})
        
        if (!!contract)
            console.log('new contract success', options.abiPath, "at address:", options.address)

        return contract
    }

    // web3 events 1.0 common - todo: review [
    /*
        *** this is the prototype of:
        contractGetPastEvents (TYPE web3, URGENT TYPE contract, STRING eventName, ANY options, CB cb) {
    */

    contractGetPastEvents (contract, eventName, options, cb) {
        contract.getPastEvents(eventName, options, (error, results) => {
            if (error) {
                console.log(error)
                return
            }
            results.forEach(event => {
                cb(event)
            })
        })
    }

    getLastEvents () {
        // todo: 
    }

    async getEvents () {

    }

    contractAttachEvents () {
        this.contract.events.CreatePuzzle({}, (error, event) => {
            this.notify('CreatePuzzle', error, event);
        });
    }

    // web3 events 1.0 common - todo: review ]

    // web3:contract ]
    // web3 core ]

    async getEventForUniqueId (uniqueId) {
        let contract = this.puzzleManager
        let eventName = 'PuzzleCreated'
        let options = {}
//        let json = await new Promise(async resolve => 
//            resolve(await blockchain.getTopScoresCount()));

        // experimental cachedEvents
        // todo: review multiple requests errors processing
        this.cachedEvents = this.cachedEvents || {}
    
        let event = await new Promise(async (resolve, reject) => {
            contract.getPastEvents(eventName, options, (error, results) => {
                if (error) {
                    console.log('getPastEvents error', JSON.stringify(error))
                    return reject(error)
                }

                for (var i = 0; i < results.length; i++) {
                    var res = results[i]
                    console.log('getPastEvents res', JSON.stringify(res))
                    this.cachedEvents[res.returnValues.uniqueId] = res
                }

                let event = this.cachedEvents[uniqueId]
                
                console.log('getPastEvents event uniqueId', uniqueId, JSON.stringify(event))
                resolve(event)
            })
        })

        return event
    }
}

module.exports = Eth

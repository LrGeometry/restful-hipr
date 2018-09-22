const 
    fs = require('fs'),
    Web3 = require('web3')

var _web3 = {}

var playerScore
var puzzleManager

var options

class Eth {
    constructor (options) {
        this.options = options

        this.playerScore = null
        this.puzzleManager = null

        this.init(options)
    }

    // web3:init [

    getWeb3 (url) {
        let web3 = _web3[url]
        if (web3 == undefined) {
            web3 = new Web3(new Web3.providers.HttpProvider(url))
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

    contractGetPastEvents (web3, contract, eventName, options, cb) {
        let web3 = this.defaultWeb3()
        web3.contract.getPastEvents(eventName, options, (error, results) => {
            if (error) {
                console.log(error)
                return
            }
            results.forEach(event => {
                cb(event)
            })
        })
    }
/*
    *** this is the prototype of:
    contractGetPastEvents (TYPE web3, URGENT TYPE contract, STRING eventName, ANY options, CB cb) {

    contractGetPastEvents (web3, contract, eventName, options, cb) {
        web3.contract.getPastEvents(eventName, options, (error, results) => {
            if (error) {
                console.log(error)
                return
            }
            results.forEach(event => {
                cb(event)
            })
        })
    }
*/
    getLastEvents () {
        // todo: 
    }

    getEventsAsync () {

    }

    contractAttachEvents () {
        this.contract.events.CreatePuzzle({}, (error, event) => {
            this.notify('CreatePuzzle', error, event);
        });
    }



    // web3:contract ]
    // web3 core ]
    // utils [


    
    // utils ]
    // api [
    // PlayerScore [

    async getTopScoresCount () {
        try {
            let topScoresCount = await this.playerScore.methods.GetTopScoresCount().call({
    //            from,
    //            gas,
    //            gasPrice
            })
            return {
                topScoresCount: parseInt(topScoresCount)
            }
        }
        catch (e) {
            console.log('getTopScoresCount error', e.message)
            return {
                err: e.message
            }
        }
    }
    
    async getTopScores (index, count) {
        try {
            let web3 = this.defaultWeb3()
            let from = this.options.contracts.PlayerScore.options.from

            let topScores = []
            for (; count; count--, index++) {
                let score = await this.playerScore.methods.TopScores(index).call()
                topScores.push(score)
            }
            return {
                topScores
            }
        }
        catch (e) {
            console.log('getTopScores error', e.message)
            return {
                err: e.message
            }
        }
    }

    async setScore (score) {
        try {
            let web3 = this.defaultWeb3()
            let from = this.options.contracts.PlayerScore.options.from
            let gas = await this.playerScore.methods.SetScore(score).estimateGas()
            let result = await this.playerScore.methods.SetScore(score).send({
                from, 
                gas //: 4712388
            })
            return {
                result
            }
        }
        catch (e) {
            console.log('setScore error', e.message)
            return {
                err: e.message
            }
        }
    }

    // PlayerScore ]
    // PuzzleManager [

    async createPuzzle (metrics) {
        try {
            let web3 = this.defaultWeb3()
            let from = this.options.contracts.PuzzleManager.options.from
            let gas = await this.puzzleManager.methods.CreatePuzzle(metrics).estimateGas()
            let result = await this.puzzleManager.methods.CreatePuzzle(metrics).send({
                from,
                gas
            })
            var puzzleId // is event
            return {
                puzzleId: parseInt(puzzleId)
            }
        }
        catch (e) {
            console.log('createPuzzle error', e.message)
            return {
                err: e.message
            }
        }
    }

    async pushMetrics (puzzleId, metrics) {
        try {
            let web3 = this.defaultWeb3()
            let from = this.options.contracts.PuzzleManager.options.from
            let gas = await this.puzzleManager.methods.PushMetrics(puzzleId, metrics).estimateGas()
            let result = await this.puzzleManager.methods.PushMetrics(puzzleId, metrics).send({
                from, 
                gas
            })
            let res = await this.puzzleManager.methods.PushMetrics(puzzleId, metrics).call({
                from, 
                gas
            })
            return {
                result
            }
        }
        catch (e) {
            console.log('pushMetrics error', e.message)
            return {
                err: e.message
            }
        }
    }

    async compareMetrics (puzzleId) {
        try {
            let web3 = this.defaultWeb3()
            let from = this.options.contracts.PuzzleManager.options.from
            let gas = await this.puzzleManager.methods.CompareMetrics(puzzleId).estimateGas()
            let result = await this.puzzleManager.methods.CompareMetrics(puzzleId).call({
                from, 
                gas
            })
            return {
                result
            }
        }
        catch (e) {
            console.log('compareMetrics error', e.message)
            return {
                err: e.message
            }
        }
    }
    
    // PuzzleManager ]
    // api ]
}

module.exports = Eth

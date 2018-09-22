const
    Eos = require('./eos/eos'),
    Eth = require('./eth/eth')

/*
Main Ethereum Network
https://mainnet.infura.io/CHs7q12LsOAlHu4D3Kvr 
Test Ethereum Network (Ropsten)
https://ropsten.infura.io/CHs7q12LsOAlHu4D3Kvr 
Test Ethereum Network (Rinkeby)
https://rinkeby.infura.io/CHs7q12LsOAlHu4D3Kvr 
Test Ethereum Network (Kovan)
https://kovan.infura.io/CHs7q12LsOAlHu4D3Kvr 
*/

// web3:contract.methods [
/*
// PlayerScore [

    Score[] public TopScores;
    mapping(address=>int) public Scores;
    function SetScore(int score) public
    function GetTopScoresCount() view public returns (uint)

// PlayerScore ]
// PuzzleManager [

    function CreatePuzzle(string metrics) public returns(uint)
    function PushMetrics(uint puzzleId, string metrics) public returns(bool)
    function CompareMetrics(uint puzzleId) public view returns(bool)
    function GetPuzzleOriginalHash(uint puzzleId) public view returns(string)
    function GetPuzzleMetrics(uint puzzleId) public view returns(bytes)

    // new server api [

    function acceptPuzzle();

    // new server api ]
// PuzzleManager ]
*/
// web3:contract.methods ]

// API methods versions [
// method 0 - single address (dev) - current sign at server [
/*
    just sign web3 at server address (for Manu dev)
    direct REST from Unity (w/o web3 client side)
*/
// method 0 - single address (dev) - current sign at server ]
// method 1 - multiple address (old) - client/server, web3 client only sign [
/*
    client -> req method web service
    web service -> accpet request, made transaction -> ask for sign client
    client -> reply signed transaction to web service
    web service run blockchain method and return status

*/
// method 1 - multiple address (old) - client/server, web3 client only sign ]
// method 2 - multiple address (new) - web3 client js browser sign transaction and send to web service [
/*
    unity externsl call -> call hipr-client js
    client web3 create & sign transaction
    client send to blockchain
    client send to web service verify transaction (hash)
    web service verify & modify transaction
*/
// method 2 - multiple address (new) - web3 client js browser sign transaction and send to web service ]
// API methods versions ]
// Blockchain [

class Blockchain {
    constructor () {
        this.eos = null
        this.eth = null
        this.activeChain = null
    }

    init (options) {
        let activeChain = options.blockchain.activeChain,
            network = activeChain[0],
            name =  activeChain[1]

        if (network == 'eos') {
            this.eos = new Eos(options.blockchain[network][name])
            this.activeChain = this.eos
        }
        else if (network == 'eth') {
            this.eth = new Eth(options.blockchain[network][name])
            this.activeChain = this.eth
        }
        else
            throw 'no active chain ("eos" or "eth")'
    }

    // method 0 [
    // PlayerScore [

    async getTopScoresCount () {
        return await this.activeChain.getTopScoresCount()
    }

    async getTopScores (index, count) {
        return await this.activeChain.getTopScores(index, count)
    }

    async setScore (score) {
        return await this.activeChain.setScore(score)
    }

    // PlayerScore ]
    // PuzzleManager [

    async createPuzzle (metrics) {
        return await this.activeChain.createPuzzle(metrics)
    }

    async pushMetrics (puzzleId, metrics) {
        return await this.activeChain.pushMetrics(puzzleId, metrics)
    }
    
    async compareMetrics (puzzleId) {
        return await this.activeChain.compareMetrics(puzzleId)
    }

    async getPuzzleOriginalMetrics (puzzleId) {
        return await this.activeChain.getPuzzleOriginalMetrics(puzzleId)
    }
    
    async getPuzzleMetrics (puzzleId) {
        return await this.activeChain.getPuzzleMetrics(puzzleId)
    }
    
    // PuzzleManager ]
    // method 0 ]
    // method 1 [

    acceptPuzzle () {
        
    }

    // method 1 ]
    // method 2 [

    // method 2 ]
}

// Blockchain ]

module.exports = Blockchain

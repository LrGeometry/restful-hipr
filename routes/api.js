var express = require('express');
var router = express.Router();

var blockchain;
var options;
// todo: validate params

// init [

/**
 * @name init
 * @param {Blockchain} blockchain_ Blockchain
 * @param {ApiOptions} options_ Init options
 */

function init(blockchain_, options_) {
    blockchain = blockchain_;
    options = options_;
    ipfsGetFile()
}

const ipfsAPI = require('ipfs-api');

//connecting to the ipfs network via infura gateway
const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' })

function ipfsGetFile(req, res, next) {
    const validCID = 'QmQhM65XyqJ52QXWPz2opaGkALgH8XXhPn8n8nff4LDE6C'

    ipfs.files.get(validCID, function (err, files) {
      files.forEach((file) => {
        console.log(file.path)
        console.log(file.content.toString('utf8'))
      })
    })
}
// init ]

// api:PlayerScore [
    
/**
 * @name api/getTopScoresCount
 * @returns {Number} Total scores count
 */

router.get('/getTopScoresCount', async (req, res, next) => {
    let json = await new Promise(async resolve => 
        resolve(await blockchain.getTopScoresCount()));
    res.json(json);
});

/**
 * @name api/getTopScores
 * @param {Number} index Index
 * @param {Number} count Count
 * @returns {TopScoresArray} Top scores
 */

router.get('/getTopScores/:index/:count', async (req, res, next) => {
    let index = parseInt(req.params.index);
    let count = parseInt(req.params.count);
    let json = await new Promise(async resolve => 
        resolve(await blockchain.getTopScores(index, count)));
    res.json(json);
});

/**
 * @name api/setScore
 * @param {Number} score Player score
 * todo: review msg.sender address
 */

router.post('/setScore/:score', async (req, res, next) => {
    let score = parseInt(req.params.score);
    let json = await new Promise(async resolve => 
        resolve(await blockchain.setScore(score)));
    res.json(json);
});

// api:PlayerScore ]
// api:PuzzleManager [

// Y.1 EXTERNAL LINK [

// Julie: I dont want to overcomplicate things with post request. its a single get request at /0xaddress/ipfsHash

/**
 * @name api/ipfsRequest
 * @param {String} address 0xadddress
 * @param {String} ipfsHash ipfs hash
 * @returns {Number} Puzzle id
 */

router.get('/ipfsRequest/:address/:ipfsHash/:ipfsFilePath', async (req, res, next) => {
    let address = req.params.address
    let ipfsHash = req.params.ipfsHash
    ipfs.files.get(ipfsHash, function (err, files) {
        files.forEach(async (file) => {
            if (file.path == ipfsFilePath) {
                console.log(file.path)
                console.log(file.content.toString('utf8'))

                var params = {
                    ipfsHash: ipfsHash,
                    ipfsFilePath: ipfsFilePath,
                    content: content
                }

                let json = await new Promise(async resolve => 
                    resolve(await blockchain.registerPuzzleAddress(address, params)));
                res.json(json);
            }
        })
    })
});

// Y.1 EXTERNAL LINK ]
// X.1 SECURE PUZZLE [

/**
 * @name api/registerPuzzleAddress
 * @param {String} address 0xadddress
 * @param {String} params Params into hiprs like 'username/assetid/factomchainhash/ipfsHash/0xaddress'
 * @returns {Number} Puzzle id
 */

 router.post('/registerPuzzleAddress/:address/:params', async (req, res, next) => {
    let address = req.params.address
    let params = req.params.params
    let json = await new Promise(async resolve => 
        resolve(await blockchain.registerPuzzleAddress(address, params)));
    res.json(json);
});

/**
 * @name api/createPuzzleSecure
 * @param {String} address 0xadddress
 * @param {String} puzzleType Puzzle type ("rubic-cube", "15")
 * @param {String} plainTextMetrics Plain text metrics (optional for non-games)
 * @returns {Number} Puzzle id
 */

router.post('/createPuzzleSecure/:address/:puzzleType/:plainTextMetrics/:params', async (req, res, next) => {
    let address = req.params.address
    let puzzleType = req.params.puzzleType
    let plainTextMetrics = req.params.plainTextMetrics
    let params = JSON.parse(req.params.params)
    
    if (plainTextMetrics == 'undefined')
        plainTextMetrics = ''

    let json = await new Promise(async resolve => 
        resolve(await blockchain.createPuzzleSecure(address, puzzleType, plainTextMetrics, params, true)));
    res.json(json);
});

router.post('/validatePuzzleSecure/:puzzleId/:address/:score/:resultHash/:movesSet', async (req, res, next) => {
    var puzzleId = req.params.puzzleId
    var address = req.params.address
    var score = req.params.score
    var resultHash = req.params.resultHash
    var movesSet = req.params.movesSet
    let json = await new Promise(async resolve => 
        resolve(await blockchain.validatePuzzleSecure(puzzleId, address, score, resultHash, movesSet)));
    res.json(json);
});

/**byOwner
 * @name api/pushSecureMetrbyOwnerics
 * @param {Number} puzzleIdbyOwner Puzzle id
 * @param {String} metricsHash Puzzle metrics hash
 * @returns {Boolean} true if success
 */

router.post('/pushSecureMetrics/:puzzleId/:metricsHash', async (req, res, next) => {
    let puzzleId = parseInt(req.params.puzzleId)
    let metricsHash = req.params.metricsHash
    let json = await new Promise(async resolve => 
        resolve(await blockchain.pushSecureMetrics(puzzleId, metricsHash)));
    res.json(json);
});

/**
 * @name api/compareSecureMetrics
 * @param {Number} puzzleId Puzzle id
 * @returns {Boolean} true if equal
 * todo: review msg.sender address
 */

router.get('/compareSecureMetrics/:puzzleId', async (req, res, next) => {
    let puzzleId = parseInt(req.params.puzzleId)
    let json = await new Promise(async resolve => 
        resolve(await blockchain.compareSecureMetrics(puzzleId, true)));
    res.json(json);
});

// X.1 SECURE PUZZLE ]

module.exports = {
    init,
    router
};


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
        files.forEach((file) => {
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

router.post('/createPuzzleSecure/:address/:puzzleType/:plainTextMetrics', async (req, res, next) => {
    let address = req.params.address
    let puzzleType = req.params.puzzleType
    let plainTextMetrics = req.params.plainTextMetrics
    
    if (plainTextMetrics == 'undefined')
        plainTextMetrics = ''

    let json = await new Promise(async resolve => 
        resolve(await blockchain.createPuzzleSecure(address, puzzleType, plainTextMetrics, true)));
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
// X.2 UNSECURE PUZZLE [

/**
 * @name api/createPuzzle
 * @param {String} metrics Puzzle metrics
 * @returns {Number} Puzzle id
 */

router.post('/createPuzzle/:metrics', async (req, res, next) => {
    let metrics = req.params.metrics
    let json = await new Promise(async resolve => 
        resolve(await blockchain.createPuzzle(metrics, true)));
    res.json(json);
});

/**
 * @name api/pushMetrics
 * @param {Number} puzzleId Puzzle id
 * @param {String} metrics Puzzle metrics
 * @returns {Boolean} true if success
 */

router.post('/pushMetrics/:puzzleId/:metrics', async (req, res, next) => {
    let puzzleId = parseInt(req.params.puzzleId)
    let metrics = req.params.metrics
    let json = await new Promise(async resolve => 
        resolve(await blockchain.pushMetrics(puzzleId, metrics)));
    res.json(json);
});

/**
 * @name api/compareMetrics
 * @param {Number} puzzleId Puzzle id
 * @returns {Boolean} true if equal
 * todo: review msg.sender address
 */

router.get('/compareMetrics/:puzzleId', async (req, res, next) => {
    let puzzleId = parseInt(req.params.puzzleId)
    let json = await new Promise(async resolve => 
        resolve(await blockchain.compareMetrics(puzzleId)));
    res.json(json);
});

// X.2 UNSECURE PUZZLE ]

// TODO: recheck smart contract getPuzzleOriginalHash and getPuzzleOriginalMetrics [
// !!!

/**
 * @name api/getPuzzleOriginalMetrics
 * @param {Number} puzzleId Puzzle id
 * @returns {String} Puzzle hash
 * todo: review msg.sender address
 */

router.get('/getPuzzleOriginalMetrics/:puzzleId', async (req, res, next) => {
    let puzzleId = parseInt(req.params.puzzleId)
    let json = await new Promise(async resolve => 
        resolve(await blockchain.getPuzzleOriginalMetrics(puzzleId)));
    res.json(json);
});

// TODO: recheck smart contract getPuzzleOriginalHash and getPuzzleOriginalMetrics ]

/**
 * @name api/getPuzzleMetrics
 * @param {Number} puzzleId Puzzle id
 * @returns {String} Puzzle metrics
 * todo: review msg.sender address
 */

router.get('/getPuzzleMetrics/:puzzleId', async (req, res, next) => {
    let puzzleId = parseInt(req.params.puzzleId)
    let json = await new Promise(async resolve => 
        resolve(await blockchain.getPuzzleMetrics(puzzleId)));
    res.json(json);
});

// api:PuzzleManager ]

// new smartcontract sever verify logic [
// api:verifyPuzzle [

/**
 * Puzzle verification logic
 * 1. client: send puzzle soltion to web service
 * 2. web service: verify solution and if is valid:
 * 2.1 set validation flag in smart contract from admin-address
 * 2.2 reply to client success
 * 3. client: put their solution to blockchain
 * 4. smart contract: perform checks and logic
 * 4.1 if flag valid - all works normally, next puzzle
 * 4.2 else - exception
 */

/**
 * @name api/verifyPuzzle 
 * @param {Number} puzzleId
 * @param {Number} transactionId 
 * @returns {Boolean} success
 * todo: review msg.sender address
 */
/*
router.get('/verifyPuzzle', function(req, res, next) {
    res.json({success: true})
});
*/
// api:verifyPuzzle ]
// new smartcontract sever verify logic ]
// exports [

module.exports = {
    init,
    router
};

// exports ]

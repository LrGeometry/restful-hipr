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

/**
 * @name api/createPuzzle
 * @param {String} metrics Puzzle metrics
 * @returns {Number} Puzzle id
 */

router.post('/createPuzzle/:metrics', async (req, res, next) => {
    let metrics = req.params.metrics
    let json = await new Promise(async resolve => 
        resolve(await blockchain.createPuzzle(metrics)));
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

router.post('/compareMetrics/:puzzleId', async (req, res, next) => {
    let puzzleId = parseInt(req.params.puzzleId)
    let json = await new Promise(async resolve => 
        resolve(await blockchain.compareMetrics(puzzleId)));
    res.json(json);
});

// TODO: recheck smart contract getPuzzleOriginalHash and getPuzzleOriginalMetrics [
// !!!

/**
 * @name api/getPuzzleOriginalMetrics
 * @param {Number} puzzleId Puzzle id
 * @returns {String} Puzzle hash
 * todo: review msg.sender address
 */

router.post('/getPuzzleOriginalMetrics/:puzzleId', async (req, res, next) => {
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

router.post('/getPuzzleMetrics/:puzzleId', async (req, res, next) => {
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

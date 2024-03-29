const
    keccak256 = require('js-sha3').keccak256,
    Puzzle = require('./puzzle')

class AssetValidator {

    constructor (options) {
        this.game = new Puzzle(options)
    }

    // utils [
/*
    getRandomPuzzleStringByType (puzzleType) {
        let s = ''
        let arr = []
        if (puzzleType == 'rubic-cube') {
            for (let i = 0; i < 9 * 6; i++) {
                arr[i] = i
            }
        }
        else if (puzzleType == '15' || puzzleType == '15-test') {
            for (let i = 0; i < 15; i++) {
                arr[i] = i
            }
        }
        

        function shuffle(a) {
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        }
        
        if (puzzleType != '15-test')
            arr = shuffle(arr)

        s = arr.join()
        return s;
    }
    */
    // utils ]


    async registerPuzzleAddress (address, params) {
        var paramsHash = keccak256(JSON.stringify(params))
        await this.db.setPuzzleParams(address, paramsHash)
        return {
            address,
            params
        }
    }

    async puzzleCreateConfig (address, puzzleType, a, b, plainTextMetrics, params) {
        //        let uniqueId = `${Math.random()}-${new Date().getTime()}`
        let metrics
        let metricsHash
        let checkOwner

        // GENERATE PUZZLE [

        var puzzleField = this.game.generatePuzzle(puzzleType, '', a, b)

        var dbPuzzle = await this.db.setGamePuzzle({
            puzzleId: -1,
            validated: false,
            params: JSON.stringify(puzzleField)
        })

        // GENERATE PUZZLE ]

        if (plainTextMetrics != '') {
            metrics = plainTextMetrics 
            metricsHash = keccak256(metrics)
            checkOwner = false
        }
        else {
            let puzzleString = JSON.stringify(puzzleField) //this.getRandomPuzzleStringByType(puzzleType)
            let params = await this.db.getPuzzleParams(address)
            metrics = `${puzzleString}-${params ? params.params : 'null-params'}`
            metricsHash = keccak256(metrics)
            console.log(`creating secure puzzle metrics='${metrics}' hash=${metricsHash}`)
            checkOwner = true
        }
        metricsHash = '0x'+metricsHash //web3.fromAscii(metricsHash)

        return {
            id: dbPuzzle.id,
            plainTextMetrics,
            metricsHash,
            params,
            puzzleField,
            checkOwner
        }
    }

    async createPuzzleSecure (address, puzzleType, plainTextMetrics, params) {
        var config = this.puzzleCreateConfig(address, puzzleType, plainTextMetrics, params)
        var puzzle = await this.activeChain.createPuzzleSecure(address, puzzleType, config.plainTextMetrics, config.metricsHash, config.params, config.checkOwner) //, uniqueId)
        if (!puzzle.err) {
            puzzle.hash = config.metricsHash
            puzzle.field = config.puzzleField

            this.db.setGamePuzzle({
                puzzleId: puzzle.puzzleId,
                params: JSON.stringify(puzzle.field)
            })
        }
        return puzzle
    }

    async validatePuzzleSecure (puzzleId, address, score, resultHash, movesSet) {
        var puzzle = await this.db.getGamePuzzle(puzzleId)
        if (!puzzle || puzzle.err)
            return puzzle

        var field = JSON.parse(puzzle.params)
        var moves = JSON.parse(`${movesSet}`).moveset
        score = parseInt(score)

        if (!this.game.verifyPuzzle(field, moves, score))
            return {
                err: 'bad params'
            }

        var res = await this.pushSecureMetrics(puzzleId, resultHash)
        if (res.err) {
            return res
        }

        res = await this.compareSecureMetrics(puzzleId, address)
        if (res.err) {
            return {
                result: false,
                err: res.err
            }
        }

        if (!res) {
            return {
                result: false
            }
        }
        
        // SET SCORE

        res = await this.setScoreSecure(address, score)

        if (res.err) 
            return {
                result: false,
                err: res.err
            }

        return {
            //res
            result: true,
            tx 
        }
    }

    
    async validatePuzzleSecureSign (gameId, id, playerAddress, score, metrics, movesSet) {
        var puzzle = await this.db.getGamePuzzleById(id)
        if (!puzzle || puzzle.err)
            return puzzle

        // CHECK TWICE CALL

        if (puzzle.validated)
            return {
                err: 'invalid'
            }


        // VERIFY PUZZLE
        // todo: review puzzle 1

        if (gameId == 0) {
            var field = JSON.parse(puzzle.params)
            var moves = JSON.parse(`${movesSet}`).moveset
            score = parseInt(score)
    
            if (!this.game.verifyPuzzle(field, moves, score)) {
                return {
                    err: 'bad params'
                }
            }
        }

        // UPDATE DB

        puzzle.validated = true
        await this.db.saveGamePuzzle(puzzle)
//        puzzle = await this.db.getGamePuzzleById(id)

        // SIGN SCORE

        var sig = await this.activeChain.signAddressScore('web3.address', playerAddress, score, metrics)
        return {
            v: sig.v,
            r: sig.r,
            s: sig.s,
        }
    }

    async pushSecureMetrics (puzzleId, metrics) {
        return await this.activeChain.pushSecureMetrics(puzzleId, metrics)
    }
    
    async compareSecureMetrics (puzzleId, address) {
        return await this.activeChain.compareSecureMetrics(puzzleId, address)
    }
}

module.exports = AssetValidator

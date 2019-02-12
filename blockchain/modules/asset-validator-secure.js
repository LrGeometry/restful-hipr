const
    keccak256 = require('js-sha3').keccak256

class AssetValidator {

    // utils [

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
    
    // utils ]
    // game [

    dumpPuzzle(field) {
        var res = []
        console.log('dump puzzle:')
        for (var x = 0; x < field.length; x++) {
            var s = ''
            for (var y = 0; y < field[x].length; y++) {
                s += field[x][y] + ' '
                res.push(field[x][y])
            }
            console.log(s)
        }
        console.log('puzzle.field', JSON.stringify(res))
        return res
    }

    generatePuzzle (puzzleType, initString) {
        var maxX = 3
        var maxY = 3

        if (puzzleType == '15') {

            var field = []
            for (var i = 0; i < maxY; i++) {
                field[i] = []
                for (var j = 0; j < maxX; j++) {
                    var n = i * maxX + j
                    field[i].push(n)
                }
            }

            this.dumpPuzzle(field)

            var moves = []
            var movesCount = 30

            var emptyPosition = {
                x: 0,
                y: 0
            }

//            var 
            function getMoves(p) {
                var m = {
                    'L': {x:-1, y:0},
                    'R': {x:1, y:0},
                    'T': {x:0, y:-1},
                    'B': {x:0, y:1}
                }
                if (p.x == 0) delete m['L']
                if (p.x == maxX - 1) delete m['R']
                if (p.y == 0) delete m['T']
                if (p.y == maxY - 1) delete m['B']

                var a = []

                for (var k in m)
                    a.push(m[k])
                return a
            }

            for (var i = 0; i < movesCount; i++) {
                var p = emptyPosition

                var m = getMoves(p)

                console.log('p', p)
                console.log('m', m)

                var index = Math.round(Math.random() * (m.length - 1))

                console.log('index', index)

                var dir = m[index]

                console.log('dir', dir)

                var p1 = {x: p.x + dir.x, y: p.y + dir.y}

                console.log(p1)

                // swap
                var a = field[p.x][p.y]
                var b = field[p1.x][p1.y]
                field[p.x][p.y] = b
                field[p1.x][p1.y] = a

                moves.push([b, p1])

                emptyPosition = p1
            }

            console.log('moves', JSON.stringify(moves))
            
            var puzzleField = this.dumpPuzzle(field)
        }

        return puzzleField
    }

    // game ]

    async registerPuzzleAddress (address, params) {
        var paramsHash = keccak256(JSON.stringify(params))
        await this.db.setPuzzleParams(address, paramsHash)
        return {
            address,
            params
        }
    }

    async createPuzzleSecure (address, puzzleType, plainTextMetrics, params) {
//        let uniqueId = `${Math.random()}-${new Date().getTime()}`
        let metrics
        let metricsHash
        let checkOwner
        if (plainTextMetrics != '') {
            metrics = plainTextMetrics 
            metricsHash = keccak256(metrics)
            checkOwner = false
        }
        else {
            let puzzleString = this.getRandomPuzzleStringByType(puzzleType)
            let params = await this.db.getPuzzleParams(address)
            metrics = `${puzzleString}-${params.params}`
            metricsHash = keccak256(metrics)
            console.log(`creating secure puzzle metrics='${metrics}' hash=${metricsHash}`)
            checkOwner = true
        }
        metricsHash = '0x'+metricsHash //web3.fromAscii(metricsHash)
        var puzzle = await this.activeChain.createPuzzleSecure(address, puzzleType, plainTextMetrics, metricsHash, params, checkOwner) //, uniqueId)
        if (!puzzle.err) {
            puzzle.field = this.generatePuzzle("15")//puzzleType)
        }
        return puzzle
    }

    async pushSecureMetrics (puzzleId, metricsHash) {
        return await this.activeChain.pushSecureMetrics(puzzleId, metrics)
    }
    
    async compareSecureMetrics (puzzleId, byOwner) {
        return await this.activeChain.compareSecureMetrics(puzzleId, byOwner)
    }
}

module.exports = AssetValidator

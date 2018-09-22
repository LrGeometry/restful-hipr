// Test - RESTful Web Service - Method 0 - Dev API [

process.env.NODE_ENV = 'test';


let chai = require('chai');
let chaiHttp = require('chai-http');

let url = "http://localhost:8080/";
let server = require('../app');

chai.use(chaiHttp);
const should = chai.should();
const expect = chai.expect;

let defaultOptions = {
    "eth": {
        "address": "0xEFFEFEBF"
    }
}

//let options = defaultOptions
let options = require('./../config/test.json')

let testPuzzleId = 0

// test:api:PlayerScore [
// POST setScore [

describe('/POST api/1.0/setScore (score=42) => {result::web3.transactionObject}', () => {
    it('it should POST player score', (done) => {
        let score = 42.0;
        chai.request(url)
            .post(`api/1.0/setScore/${score}`)
            .end((err, res) => {
                err && err.should.be.null();
                res.should.have.status(200);
                res.body.should.exist;
                res.body.result.should.be.a("object")
                res.body.result.should.have.property('transactionHash')
                done();
            });
    });
});
    
// POST setScore ]
// GET getTopScoresCount [

describe('/GET api/1.0/getTopScoresCount => {topScoresCount::int}', () => {
    it('it should GET top scores count', (done) => {
        chai.request(url)
            .get('api/1.0/getTopScoresCount')
            .end((err, res) => {
                err && err.should.be.null();
                res.should.have.status(200);
                res.body.should.exist;
                res.body.topScoresCount.should.be.a("number")
                expect(res.body.topScoresCount).to.be.gt(0)
                done();
            });
    });
});

// GET getTopScoresCount ]
// GET getTopScore [

describe('/GET api/1.0/getTopScores (index=0, count=1) => {topScores::array[]}', () => {
    it('it should GET top score', (done) => {
        let index = 0;
        let count = 1;
        chai.request(url)
            .get(`api/1.0/getTopScores/${index}/${count}`)
            .end((err, res) => {
                err && err.should.be.null();
                res.should.have.status(200);
                res.body.should.exist;
                res.body.topScores.should.be.a("array")
                done();
            });
    });
});

// test:api:PlayerScore ]

// test:api:PuzzleManager [
// POST createPuzzle [

describe('/POST api/1.0/createPuzzle (metrics="metrics007") => {puzzleId:int}', () => {
    it('it should POST create puzzle', (done) => {
        let metrics = 'metrics007';
        chai.request(url)
            .post(`api/1.0/createPuzzle/${metrics}`)
            .end((err, res) => {
                err && err.should.be.null();
                res.should.have.status(200);
                res.body.should.exist;
                res.body.puzzleId.should.be.a("number")
                testPuzzleId = res.body.puzzleId
//                res.body.result.should.be.a("object")
//                res.body.result.should.have.property('transactionHash')
                done();
            });
    });
});

// POST createPuzzle ]
// POST pushMetrics [

describe('/POST api/1.0/pushMetrics (metrics="metrics007") => {result::web3.transactionObject}', () => {
    it('it should POST push metrics', (done) => {
        let puzzleId = testPuzzleId;
        let metrics = 'metrics007';
        chai.request(url)
            .post(`api/1.0/pushMetrics/${puzzleId}/${metrics}`)
            .end((err, res) => {
                err && err.should.be.null();
                res.should.have.status(200);
                res.body.should.exist;
                res.body.result.should.be.a("object")
                res.body.result.should.have.property('transactionHash')
                done();
            });
    });
});

// POST pushMetrics ]
// GET compareMetrics [

describe('/GET api/1.0/compareMetrics (puzzleId) => {result::bool}', () => {
    it('it should GET compare metrics', (done) => {
        let puzzleId = testPuzzleId;
        chai.request(url)
            .post(`api/1.0/compareMetrics/${puzzleId}`)
            .end((err, res) => {
                err && err.should.be.null();
                res.should.have.status(200);
                res.body.should.exist;
                res.body.result.should.equal(true)
                done();
            });
    });
});

// GET compareMetrics ]
// GET GetPuzzleOriginalMetrics [

describe('/GET api/1.0/getPuzzleOriginalMetrics (puzzleId) => {metrics::string}', () => {
    it('it should GET get puzzle original hash', (done) => {
        let puzzleId = testPuzzleId;
        chai.request(url)
            .post(`api/1.0/getPuzzleOriginalMetrics/${puzzleId}`)
            .end((err, res) => {
                err && err.should.be.null();
                res.should.have.status(200);
                res.body.should.exist;
                res.body.metrics.should.be.a("string")
                res.body.metrics.should.equal('metrics007')
                done();
            });
    });
});

// GET getPuzzleOriginalMetrics ]
// GET getPuzzleMetrics [

describe('/GET api/1.0/getPuzzleMetrics (puzzleId) => {metrics::string-hash}', () => {
    it('it should GET get puzzle metrics', (done) => {
        let puzzleId = testPuzzleId;
        chai.request(url)
            .post(`api/1.0/getPuzzleMetrics/${puzzleId}`)
            .end((err, res) => {
                err && err.should.be.null();
                res.should.have.status(200);
                res.body.should.exist;
                res.body.metrics.should.exist;
                res.body.metrics.should.be.a("string")
                res.body.metrics.should.equal('0xc843c6d4f14ee6a90da53c75724404742253f31039d737a487a187ddaad845c3c843c6d4f14ee6a90da53c75724404742253f31039d737a487a187ddaad845c3')
                done();
            });
    });
});
    /*
describe('/GET api/1.0/getPuzzleMetrics', () => {
    it('it should GET get puzzle original hash', (done) => {
        let puzzleId = 1;
        chai.request(server)
            .post(`api/1.0/getPuzzleMetrics/${puzzleId}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('string');
//                res.body.length.should.be.eql(0);
                done();
            });
    });
});

// GET getPuzzleMetrics ]
// test:api:PuzzleManager ]

// Test - RESTful Web Service - Method 0 - Dev API ]
*/
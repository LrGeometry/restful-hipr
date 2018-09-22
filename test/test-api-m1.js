// Test - RESTful Web Service - Method 1 - Blockchain backend verifier [
// GET verifyPuzzle [
/*
    describe('/GET verifyPuzzle', () => {
        it('it should GET verify puzzle', (done) => {
            let puzzleId = 1;
            chai.request(server)
                .post(`/verifyPuzzle/${puzzleId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('bool');
    //                res.body.length.should.be.eql(0);
                    done();
                });
        });
    });
*/
// GET verifyPuzzle ]
// Test - RESTful Web Service - Method 1 - Blockchain backend verifier ]
/*
// GET getScore [

describe('/GET api/2.0/getScore', () => {
    it('it should GET address score', (done) => {
        chai.request(server)
            .get('api/2.0/getScore')
            .end((err, res) => {
                err.should.be.null();
                res.should.have.status(200);
                done();
            });
    });
});
    
// GET getScore ]
*/    
/**
 * @name api/getScore
 * @param {Address} address Player address
 * @returns {Number} Player score
 */
/*
router.get('/getScore/:address', function(req, res, next) {
    let score = playerScore.methods.GetScore(req.param.address)
    res.json({score})
});
*/
//            address = web3.utils.toBN('0x9a4770D5CE5f30F9Db0c537f04a485836A72BDbF')
//              web3.eth.accounts[0], gas: 4712388

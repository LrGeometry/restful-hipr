const
    fs = require('fs'),
    solc = require('solc')

// paths [

const contractsPath = __dirname + "/../../contracts/assetVerification/contracts/"
const outdir = __dirname

console.log(__dirname)
console.log("contractsPath", contractsPath)
console.log("outdir", outdir)

// paths ]
// compile [

function compile(name, input) {

    console.log("compiling", name)
//    console.log(input)

    let compiledContract = solc.compile({sources: input}, 1)

//    console.log(compiledContract)

    let contract = compiledContract.contracts[name+'.sol:'+name]
    if (!contract) {
        console.log("failed to compile", name)
        return null
    }
    return contract
}

function compile_abi(name, input) {
    let contract = compile(name, input)
    if (!contract)
        return -1

    outfile = outdir + '/' + name + ".abi"

    console.log("write abi to", outfile)

    fs.writeFileSync(outfile, contract.interface)
}

// compile ]
// input:PuzzleManager [

var input = {
    'PuzzleManager.sol': fs.readFileSync(contractsPath + 'PuzzleManager.sol', 'utf8'),
    'base/Ownable.sol': fs.readFileSync(contractsPath + 'base/Ownable.sol', 'utf8')
}

compile_abi('PuzzleManager', input)

// input:PuzzleManager ]
// input:PlayerScore [

input = {
    'PlayerScore.sol': fs.readFileSync(contractsPath + 'PlayerScore.sol', 'utf8'),
}

compile_abi('PlayerScore', input)

// input:PlayerScore ]

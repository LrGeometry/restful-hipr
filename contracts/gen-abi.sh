echo '***'
echo "Error: gen-abi.sh is old version. Please use gen-contracts.js"
echo '***'

exit -1

CONTRACTS_PATH="../../contracts/assetVerification/contracts"

SCRIPT=$(readlink -f "$0")
SCRIPTPATH=$(dirname "$SCRIPT")

echo in:  $CONTRACTS_PATH
echo out: $SCRIPTPATH

cd $CONTRACTS_PATH
compile_abi () {
    FILE=$1
    echo Compile ABI $FILE
    solcjs --abi $FILE --outdir $SCRIPTPATH
}

compile_abi PlayerScore.sol
compile_abi PuzzleManager.sol

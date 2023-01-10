const fs = require('fs');
const snarkjs = require('snarkjs')

async function verifyProof(pathToProof, pathToPublic) {
// declare the data variable and initialize it to an empty object
let proof = await readFileData(`${pathToProof}`);
let publicSignals = await readFileData(`${pathToPublic}`);
let vkey = await readFileData(`src/artifacts/vkey.json`);

const res = await snarkjs.groth16.verify(vkey, publicSignals, proof);

if (res === true) {
  console.log("Verification OK");

  const parsedPubSignals = parsePublicSignals(publicSignals);

  console.log("Does this match the public root hash?", parsedPubSignals.rootHash);
  console.log("Does this match the total assets owned by the CEX?", parsedPubSignals.targetSum);
  console.log("Does this match the poseidon hash of your used ID and your balance?", parsedPubSignals.leafHash);
  console.log("Does this match your balance in the exchange?", parsedPubSignals.leafSum);

  // add a call to process.exit() to terminate the program
  process.exit();
} else {
  console.log("Invalid proof");
  // add a call to process.exit() to terminate the program
  process.exit();
}
}

async function readFileData(path) {
    // declare the data variable and initialize it to an empty object
    let data = {};
  
    try {
      // read the file using fs.readFile() and wait for it to complete
      const fileData = await fs.promises.readFile(path);
  
      // fileData is a Buffer, so we need to convert it to a string before parsing it as JSON
      data = JSON.parse(fileData.toString());
    } catch (err) {
      throw err;
    }
  
    return data;
  }


function parsePublicSignals(data) {

    const parsedPubSignals = {
        rootHash: data[0],
        targetSum: data[1],
        leafHash: data[2],
        leafSum: data[3],
    }

    return parsedPubSignals;
}
module.exports = verifyProof

const fs = require('fs');
const snarkjs = require('snarkjs');

function genInput(tree, index, targetSum) {

  if (index < 0 || index >= tree._nodes[0].length) {
    throw new Error('The leaf does not exist in this tree');
  }

  const siblingsHashes = [];
  const siblingsSums = [];
  const pathIndices = [];
  const leafIndex = index;

  for (var level = 0; level < tree._depth; level += 1) {
    var position = index % tree._arity;


    var levelStartIndex = index - position;
    var levelEndIndex = levelStartIndex + tree._arity;
    pathIndices[level] = position;

    for (var i = levelStartIndex; i < levelEndIndex; i += 1) {

        if (i != index) {
            if (i < tree._nodes[level].length) {
                siblingsHashes[level] = tree._nodes[level][i].hash;
                siblingsSums[level] = tree._nodes[level][i].sum;
            }
            else {
                siblingsHashes[level] = tree._zeroes[level].hash;
                siblingsSums[level] = tree._zeroes[level].sum;
            }
        }
    }
    index = Math.floor(index / tree._arity);
}

  const input = { 
    rootHash: tree._root.hash,
    targetSum,
    leafHash: tree._nodes[0][leafIndex].hash,
    leafSum: tree._nodes[0][leafIndex].sum,
    pathIndices,
    siblingsHashes,
    siblingsSums,
  };

  return input
}

async function genProof(input, pathToProof, pathToPublic) {

  const {proof, publicSignals} = await snarkjs.groth16.fullProve(input, `src/artifacts/pos-merkle-proof.wasm`, `src/artifacts/pos-merkle-proof_final.zkey`);

fs.writeFile(`${pathToProof}`, JSON.stringify(proof), (err) => {
    if (err) {
      console.error(err);
    }
  
    console.log(`Proof saved to ${pathToProof}`);
  });

  fs.writeFile(`${pathToPublic}`, JSON.stringify(publicSignals), (err) => {
    if (err) {
      console.error(err);
    }
  
    console.log(`Public signals saved to ${pathToPublic}`);
    process.exit();
  });

}

module.exports = {genInput, genProof};
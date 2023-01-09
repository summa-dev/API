import fs from 'fs'

export default function createProofWithTargetSumFromTreePath(
  pathToTree, 
  pathToProof,
  index,
  targetSum,
) {

  // fetch tree and parse it
  const parsedMst = JSON.parse(fs.readFileSync(pathToTree, 'utf8'));

  if (index < 0 || index >= parsedMst._nodes[0].length) {
    throw new Error('The leaf does not exist in this tree');
  }

  const siblingsHashes = [];
  const siblingsSums = [];
  const pathIndices = [];
  const leafIndex = index;

  for (var level = 0; level < parsedMst._depth; level += 1) {
    var position = index % parsedMst._arity;


    var levelStartIndex = index - position;
    var levelEndIndex = levelStartIndex + parsedMst._arity;
    pathIndices[level] = position;

    for (var i = levelStartIndex; i < levelEndIndex; i += 1) {

        if (i != index) {
            if (i < parsedMst._nodes[level].length) {
                siblingsHashes[level] = parsedMst._nodes[level][i].hash;
                siblingsSums[level] = parsedMst._nodes[level][i].sum;
            }
            else {
                siblingsHashes[level] = parsedMst._zeroes[level].hash;
                siblingsSums[level] = parsedMst._zeroes[level].sum;
            }
        }
    }
    index = Math.floor(index / parsedMst._arity);
}


  const proof = { 
    rootHash: parsedMst._root.hash,
    targetSum,
    leafHash: parsedMst._nodes[0][leafIndex].hash,
    leafSum: parsedMst._nodes[0][leafIndex].sum,
    pathIndices,
    siblingsHashes,
    siblingsSums,
  };

  fs.writeFileSync(pathToProof, JSON.stringify(proof, (_, v) => typeof v === 'bigint' ? v.toString() : v))

  return; 
}


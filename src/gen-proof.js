import fs from 'fs'

export default function genProofFromParsedMST(pathToTree, pathToProof, index, targetSum) {

    // fetch tree and parse it
    const parsedMst = JSON.parse(fs.readFileSync(pathToTree, 'utf8'));

    // get the depth, arity, nodes, zeroes and root from the parsedMst
    const { _depth, _arity, _nodes, _zeroes, _root } = parsedMst;

    if (index < 0 || index >= _nodes[0].length) {
      throw new Error('The leaf does not exist in this tree');
    }

    const siblingsHashes = [];
    const siblingsSums = [];
    const pathIndices = [];
    const leafIndex = index;

    console.log(index)

    for (var level = 0; level < _depth; level += 1) {
      var position = index % _arity;
      var levelStartIndex = index - position;
      var levelEndIndex = levelStartIndex + _arity;
      pathIndices[level] = position;
      for (var i = levelStartIndex; i < levelEndIndex; i += 1) {
          if (i !== index) {
              if (i < _nodes[level].length) {
                  siblingsHashes[level] = _nodes[level][i].hash;
                  siblingsSums[level] = _nodes[level][i].sum;
              }
              else {
                  siblingsHashes[level] = _zeroes[level].hash;
                  siblingsSums[level] = _zeroes[level].sum;
              }
          }
      }
      index = Math.floor(index / _arity);
  }
      
      // create proof object
      const proof = {
        rootHash: _root.hash,
        targetSum,
        leafHash: _nodes[0][leafIndex].hash,
        leafSum: _nodes[0][leafIndex].sum,
        pathIndices,
        siblingsHashes,
        siblingsSums,
      }

      fs.writeFileSync(pathToProof, JSON.stringify(proof, (_, v) => typeof v === 'bigint' ? v.toString() : v))

      return;
}


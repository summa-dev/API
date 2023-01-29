# pyt-pos

pyt-pos is a library to generate and verify pan-y-tomate Proof of Solvency. You only need to provide a csv file that contains the list of your users and their balance for a specific token. The library contains the apis to generate a proof of solvency for each user and verify it. 

```npm install pyt-pos```

```typescript
import { PytPos } from 'pyt-pos';
```

PytPos is a class that contains the core methods to let CEXs provide credible Proof Of Solvency to its users while maintaining secrecy over their Business Information thanks to zkSNARKs.
The exchange first needs to create a [Merkle Sum Tree](https://github.com/pan-y-tomate/pyt-merkle-sum-tree) from a csv file containing the username and balances of its users.
Then, it can generate a proof of solvency for a specific user using [zkSNARKs circuits](https://github.com/pan-y-tomate/pyt-circuits).
The proof doesn't reveal information such as the total balances of each user, the number of users and the total amount of liabilities are not revealed to the public.
The PytPos class also provides methods such that the user can verify the proof of solvency.

## APIs

\# **createMerkleSumTree**(pathToCsv: _string_): _IncrementalMerkleSumTree_

Creates a Merkle Sum Tree from a csv file containing the username and balances of the users.

```typescript

const pathToCsv = "test/entries/entry-16-valid.csv" 

const tree = PytPos.createMerkleSumTree(pathToCsv)
```

\# **generateProof**(merkleSumTree: _IncrementalMerkleSumTree_, userIndex _number_, assetsSum: _bigint_, proverArtifacts _SnarkProverArtifacts_): _FullProof_

Generates a proof of solvency for a specific user using a zkSNARK. Takes as input an instance of the Merkle Sum Tree, the index of the user in the Merkle Sum Tree file, the total assets owned by the exchange and the zkSNARK prover artifacts.

```typescript
const userIndex = 1
const assetsSum = BigInt(10000)
const pathToWasm = './test/artifacts/valid/pyt-pos-16.wasm'
const pathToZkey = './test/artifacts/valid/pyt-pos-16_final.zkey'

const proverArtifacts = {
    wasmFilePath: pathToWasm,
    zkeyFilePath: pathToZkey
}

const proof = await PytPos.generateProof(tree, userIndex, assetsSum, proverArtifacts)
```

> The available prover artifacts generated after a trusted-setup can be found in the [pyt-circuits](https://github.com/pan-y-tomate/pyt-circuits#trusted-setup-artifcats) repository. For now, the trusted setup is only available for a merkle sum tree with 16 levels.

\# **verifyProof**(proof: _FullProof_, verificationKey _JSON_): _boolean_

Verifies the zk proof of solvency generated for a specific user. Takes as input the proof and the verification key.

```typescript
const bool = await PytPos.verifyProof(proof, verificationKey)
```

> The available verification key generated after a trusted-setup can be found in the [pyt-circuits](https://github.com/pan-y-tomate/pyt-circuits#trusted-setup-artifcats) repository. For now, the verification key is only available for a merkle sum tree with 16 levels.

The implementer should make sure that the public signals of the proof of solvency generated for a specific user match the expected values in order to verify it. These can be access from the proof object. 

```typescript

const username = proof.parsedUsername // must match the username of the user the proof was generated for
const balance = proof.balance // must match the balance of the user the proof was generated for
const rootHash = proof.rootHash // must match the root hash of the merkle sum tree published by the exchange
const assetsSum = proof.assetsSum // must match the total assets owned by the exchange as published by the exchange

```

## Test 

```bash
$ npm run test
```


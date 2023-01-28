import { PytPos } from '../src/index';

describe("pyt proof-of-solvency test", () => {

    const tree = PytPos.createMerkleSumTree('./test/entries/entry-65536-valid.csv')

    const verificationKey : JSON = require('./artifacts/vkey.json')

    
    it("Should initialize a tree", () => {

        // using the same entries as in https://github.com/pan-y-tomate/pyt-merkle-sum-tree

    })

    // 3279597632

    it("Should generate a proof and verify starting from the tree", async () => {

        const proof = await PytPos.generateProofOfSolvency(tree, 0, BigInt(3279597635), {wasmFilePath: './test/artifacts/pyt-pos-16.wasm', zkeyFilePath: './test/artifacts/pyt-pos-16_final.zkey'})

        console.log(proof)

        const bool = await PytPos.verifyProofOfSolvency(proof, 'OiMkdfHE', BigInt(22404), BigInt('7262604482306299190562201099243401493089981632105252274221847019078402629098'), BigInt(3279597635), verificationKey)

        console.log(bool)

    })

})
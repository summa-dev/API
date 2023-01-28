import {Utils} from 'pyt-merkle-sum-tree'
import {FullProof } from './types/index'
import { groth16 } from "snarkjs"
import { poseidon } from 'circomlibjs';

export default function verifyProof(proof: FullProof, username: string, balance: bigint, expectedMerkleTreeRoot: bigint, expectedAssetsSum: bigint, verificationKey: JSON): boolean {

    const isValidZkProof: boolean = verifyZkProof(proof, verificationKey)

    const isValidPublicInputs: boolean = verifyPublicInputs(proof, username, balance, expectedMerkleTreeRoot, expectedAssetsSum)

    return isValidZkProof && isValidPublicInputs
}


function verifyZkProof (fullProof: FullProof, verificationKey: JSON): boolean {

    return groth16.verify(
        verificationKey, [
            fullProof.leafHash,
            fullProof.rootHash,
            fullProof.assetsSum
        ],
        fullProof.proof
    )
}

function verifyPublicInputs (proof: FullProof, username: string, balance: bigint, expectedMerkleTreeRoot: bigint, expectedAssetsSum: bigint): boolean {

    // check that the leafHash of the proof is equal to the hash of the username and balance
    const hashPreimage: bigint[] = [Utils.parseUsernameToBigInt(username), balance];
    const isValidLeafHash: boolean = proof.leafHash == poseidon(hashPreimage)

    // check that expectedMerkleTreeRoot is equal to the rootHash of the proof
    const isValidRootHash: boolean = proof.rootHash == expectedMerkleTreeRoot

    // check that expectedAssetsSum is equal to the assetsSum of the proof
    const isValidAssetsSum: boolean = proof.assetsSum == expectedAssetsSum

    return isValidRootHash && isValidAssetsSum && isValidLeafHash

}


import { IncrementalMerkleSumTree, MerkleProof } from 'pyt-merkle-sum-tree';
import { CircomInput, FullProof, SnarkProverArtifacts } from './types/index';
import { Utils } from 'pyt-merkle-sum-tree';
import { groth16 } from 'snarkjs';

/**
 * Build the input for the Circom circuit.
 * @param merkleSumTree The Merkle Sum Tree.
 * @param userIndex The index of the user in the Merkle Sum Tree.
 * @param assetsSum The sum of the assets of the exchange.
 * @returns The input for the Circom circuit
 */
function buildCircomInput(merkleSumTree: IncrementalMerkleSumTree, userIndex: number, assetsSum: bigint): CircomInput {

  const proofOfMembershipInput: MerkleProof = merkleSumTree.createProof(userIndex);

  const circomInput: CircomInput = {
    rootHash: proofOfMembershipInput.rootHash,
    username: proofOfMembershipInput.username,
    balance: proofOfMembershipInput.balance,
    pathIndices: proofOfMembershipInput.pathIndices,
    siblingsHashes: proofOfMembershipInput.siblingsHashes,
    siblingsSums: proofOfMembershipInput.siblingsSums,
    assetsSum: assetsSum,
  };

  return circomInput;
}

/**
 * Generate a proof of solvency.
 * @param merkleSumTree The Merkle Sum Tree.
 * @param userIndex The index of the user in the Merkle Sum Tree.
 * @param assetsSum The sum of the assets of the exchange.
 * @param proverArtifacts The prover artifacts.
 * @returns A proof of solvency.
 */
export default async function generateProof(
  merkleSumTree: IncrementalMerkleSumTree,
  userIndex: number,
  assetsSum: bigint,
  proverArtifacts: SnarkProverArtifacts,
): Promise<FullProof> {

  const circomInput: CircomInput = buildCircomInput(merkleSumTree, userIndex, assetsSum);

  const { proof, publicSignals } = await groth16.fullProve(
    circomInput,
    proverArtifacts.wasmFilePath,
    proverArtifacts.zkeyFilePath,
  );

  const parsedUsername = Utils.parseBigIntToUsername(circomInput.username);

  const fullProof: FullProof = {
    parsedUsername: parsedUsername,
    balance: circomInput.balance,
    rootHash: publicSignals[1],
    assetsSum: publicSignals[2],
    proof: proof,
  };

  return fullProof;
}

import { IncrementalMerkleSumTree, MerkleProof } from 'pyt-merkle-sum-tree';
import { CircomInput, FullProof, SnarkJSProverArtifacts, SnarkJSProof} from './types/index';
import { Utils } from 'pyt-merkle-sum-tree';
import { groth16 } from 'snarkjs';

/**
 * Generate a proof of solvency.
 * @param merkleSumTree The Merkle Sum Tree.
 * @param userIndex The index of the user in the Merkle Sum Tree.
 * @param assetsSum The sum of the assets of the exchange.
 * @param proverArtifacts The prover artifacts.
 * @returns A proof of solvency.
 */
export default async function generateProofForUser(
  merkleSumTree: IncrementalMerkleSumTree,
  userIndex: number,
  assetsSum: bigint,
  proverArtifacts: SnarkJSProverArtifacts,
): Promise<FullProof> {
  const circomInput: CircomInput = buildCircomInput(merkleSumTree, userIndex, assetsSum);

  const { proof, publicSignals } = await groth16.fullProve(
    circomInput,
    proverArtifacts.wasmFilePath,
    proverArtifacts.zkeyFilePath,
  );

  return buildFullProof(circomInput, publicSignals, proof);
}

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
    assetsSum,
  };

  return circomInput;
}

function buildFullProof (circomInput: CircomInput, publicSignals: bigint[], proof: SnarkJSProof): FullProof {
  
  const parsedUsername = Utils.stringifyUsername(circomInput.username);

  const fullProof: FullProof = {
    parsedUsername,
    balance: circomInput.balance,
    rootHash: publicSignals[1],
    assetsSum: publicSignals[2],
    proof,
  };

  return fullProof;
}

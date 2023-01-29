import { IncrementalMerkleSumTree, MerkleProof } from 'pyt-merkle-sum-tree';
import { CircomInput, FullProof, SnarkProverArtifacts } from './types/index';
import { Utils } from 'pyt-merkle-sum-tree';
import { groth16 } from 'snarkjs';

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

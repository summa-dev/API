import { IncrementalMerkleSumTree } from 'pyt-merkle-sum-tree';
import { FullProof, SnarkProverArtifacts } from './types/index';
/**
 * Generate a proof of solvency.
 * @param merkleSumTree The Merkle Sum Tree.
 * @param userIndex The index of the user in the Merkle Sum Tree.
 * @param assetsSum The sum of the assets of the exchange.
 * @param proverArtifacts The prover artifacts.
 * @returns A proof of solvency.
 */
export default function generateProof(merkleSumTree: IncrementalMerkleSumTree, userIndex: number, assetsSum: bigint, proverArtifacts: SnarkProverArtifacts): Promise<FullProof>;

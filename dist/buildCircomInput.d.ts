import { MerkleSumTree } from 'pyt-merkle-sum-tree';
import { CircomInput } from './types/index';
/**
 * Build the input for the Circom circuit.
 * @param merkleSumTree The Merkle Sum Tree generate by the prover.
 * @param userIndex The index of the user in the Merkle Sum Tree.
 * @param assetsSum The sum of the assets of the exchange.
 * @returns The input for the Circom circuit
 */
export default function buildCircomInput(merkleSumTree: MerkleSumTree, userIndex: number, assetsSum: bigint): CircomInput;

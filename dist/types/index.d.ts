import { Entry } from 'pyt-merkle-sum-tree';
export type CircomInput = {
    rootHash: bigint;
    username: bigint;
    balance: bigint;
    pathIndices: number[];
    siblingsHashes: bigint[];
    siblingsSums: bigint[];
    assetsSum: bigint;
};
export type Proof = {
    pi_a: bigint[];
    pi_b: bigint[][];
    pi_c: bigint[];
    protocol: string;
    curve: string;
};
export type SnarkProverArtifacts = {
    wasmFilePath: string;
    zkeyFilePath: string;
};
export type FullProof = {
    entry: Entry;
    rootHash: bigint;
    assetsSum: bigint;
    proof: Proof;
};

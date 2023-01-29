export type CircomInput = {
  rootHash: bigint;
  username: bigint;
  balance: bigint;
  pathIndices: number[];
  siblingsHashes: bigint[];
  siblingsSums: bigint[];
  assetsSum: bigint;
};

export type SnarkJSProof = {
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
  parsedUsername: string;
  balance: bigint;
  rootHash: bigint;
  assetsSum: bigint;
  proof: SnarkJSProof;
};

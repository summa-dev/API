export type BigNumberish = string | bigint;

export type CircomInput = {
  rootHash: BigNumberish;
  username: BigNumberish;
  balance: BigNumberish;
  pathIndices: number[];
  siblingsHashes: BigNumberish[];
  siblingsSums: BigNumberish[];
  assetsSum: BigNumberish;
};

export type SnarkJSProof = {
  pi_a: BigNumberish[];
  pi_b: BigNumberish[][];
  pi_c: BigNumberish[];
  protocol: string;
  curve: string;
};

export type SnarkProverArtifacts = {
  wasmFilePath: string;
  zkeyFilePath: string;
};

export type FullProof = {
  leafHash: BigNumberish;
  rootHash: BigNumberish;
  assetsSum: BigNumberish;
  proof: SnarkJSProof;
};

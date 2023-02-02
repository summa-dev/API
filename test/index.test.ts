import { Prover, UserVerifier, FullProof, SnarkProverArtifacts } from '../src/index';
import { IncrementalMerkleSumTree } from 'pyt-merkle-sum-tree';

describe('pyt proof-of-solvency test', () => {
  const tree = new IncrementalMerkleSumTree('./test/entries/entry-65536-valid.csv'); // The tree has 2**16 entries.
  const liabilitiesSum = tree.root.sum;

  const pathToValidWasm = './test/artifacts/valid/pyt-pos-16.wasm';
  const pathToValidZkey = './test/artifacts/valid/pyt-pos-16_final.zkey';

  const validProverArtifacts: SnarkProverArtifacts = {
    wasmFilePath: pathToValidWasm,
    zkeyFilePath: pathToValidZkey,
  };

  const pathToInvalidWasm = './test/artifacts/invalid/sempahore.wasm';

  const invalidProverArtifacts1: SnarkProverArtifacts = {
    wasmFilePath: pathToInvalidWasm,
    zkeyFilePath: pathToValidZkey,
  };

  const pathToInvalidZkey = './test/artifacts/invalid/sempahore.zkey';

  const invalidProverArtifacts2: SnarkProverArtifacts = {
    wasmFilePath: pathToValidWasm,
    zkeyFilePath: pathToInvalidZkey,
  };

  const validVerificationKey: JSON = require('./artifacts/valid/vkey.json');
  const invalidVerificationKey: JSON = require('./artifacts/invalid/semaphore.json');

  it('Should verify a proof generated for a user when assets sums > total sum of liabilities', async () => {
    const assetsSum = liabilitiesSum + BigInt(1);

    const prover = new Prover(tree, assetsSum, validProverArtifacts);

    const randomIndex = Math.floor(Math.random() * tree.leaves.length);

    const proof: FullProof = await prover.generateProofForUser(randomIndex);

    const userVerifier = new UserVerifier(
      tree.entries[randomIndex].username,
      tree.entries[randomIndex].balance,
      validVerificationKey,
    );

    const bool = await userVerifier.verifyProof(proof);

    expect(bool).toBe(true);
  });

  it('Should verify a proof generated for a user when assets sums = total sum of liabilities', async () => {
    const assetsSum = liabilitiesSum;

    const prover = new Prover(tree, assetsSum, validProverArtifacts);

    const randomIndex = Math.floor(Math.random() * tree.leaves.length);

    const proof: FullProof = await prover.generateProofForUser(randomIndex);

    const userVerifier = new UserVerifier(
      tree.entries[randomIndex].username,
      tree.entries[randomIndex].balance,
      validVerificationKey,
    );

    const bool = await userVerifier.verifyProof(proof);

    expect(bool).toBe(true);
  });

  it('Should throw an error generating for a user when assets sums < total sum of liabilities', async () => {
    const assetsSum = liabilitiesSum - BigInt(1);

    const prover = new Prover(tree, assetsSum, validProverArtifacts);

    const randomIndex = Math.floor(Math.random() * tree.leaves.length);

    // expect the function to throw an error
    await expect(prover.generateProofForUser(randomIndex)).rejects.toThrow();
  });

  it('Should not verify a proof generated for a different user', async () => {
    const assetsSum = liabilitiesSum + BigInt(1);

    const prover = new Prover(tree, assetsSum, validProverArtifacts);

    const randomIndex = Math.floor(Math.random() * tree.leaves.length);

    const proof: FullProof = await prover.generateProofForUser(randomIndex);

    const userVerifier = new UserVerifier(tree.entries[0].username, tree.entries[0].balance, validVerificationKey);

    const bool = await userVerifier.verifyProof(proof);

    expect(bool).toBe(false);
  });

  it('Should throw an error when generating a proof using an invalid wasm file', async () => {
    const assetsSum = liabilitiesSum + BigInt(1);

    const prover = new Prover(tree, assetsSum, invalidProverArtifacts1);

    const randomIndex = Math.floor(Math.random() * tree.leaves.length);

    // expect the function to throw an error
    await expect(prover.generateProofForUser(randomIndex)).rejects.toThrow();
  });

  it('Should throw an error when generating a proof using an invalid zkey file', async () => {
    const assetsSum = liabilitiesSum + BigInt(1);

    const prover = new Prover(tree, assetsSum, invalidProverArtifacts2);

    const randomIndex = Math.floor(Math.random() * tree.leaves.length);

    // expect the function to throw an error
    await expect(prover.generateProofForUser(randomIndex)).rejects.toThrow();
  });

  it('Should not verify a valid proof when using an invalid verification key', async () => {
    const assetsSum = liabilitiesSum + BigInt(1);

    const prover = new Prover(tree, assetsSum, validProverArtifacts);

    const randomIndex = Math.floor(Math.random() * tree.leaves.length);

    const proof: FullProof = await prover.generateProofForUser(randomIndex);

    const userVerifier = new UserVerifier(
      tree.entries[randomIndex].username,
      tree.entries[randomIndex].balance,
      invalidVerificationKey,
    );

    const bool = await userVerifier.verifyProof(proof);

    expect(bool).toBe(false);
  });
});

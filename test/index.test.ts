import { PytPos, FullProof, SnarkProverArtifacts } from '../src/index';

describe('pyt proof-of-solvency test', () => {
  const tree = PytPos.createMerkleSumTree('./test/entries/entry-65536-valid.csv');
  // The tree has 2**16 entries. The sum of the liabilities is 3279597632.
  const liabilitiesSum = BigInt(3279597632);

  const validVerificationKey: JSON = require('./artifacts/valid/vkey.json');
  const pathToValidWasm = './test/artifacts/valid/pyt-pos-16.wasm';
  const pathToValidZkey = './test/artifacts/valid/pyt-pos-16_final.zkey';

  const validProverArtifacts: SnarkProverArtifacts = {
    wasmFilePath: pathToValidWasm,
    zkeyFilePath: pathToValidZkey,
  };

  const invalidVerificationKey: JSON = require('./artifacts/invalid/semaphore.json');
  const pathToInvalidWasm = './test/artifacts/invalid/sempahore.wasm';
  const pathToInvalidZkey = './test/artifacts/invalid/sempahore.zkey';

  it('Should initialize a tree', () => {
    expect(tree).toBeDefined();
  });

  it('Should generate a valid proof starting from a random index of the tree and an assets sums > total sum of liabilities and valid artifacts', async () => {
    const randomIndex = Math.floor(Math.random() * tree.leaves.length);

    const assetsSum = liabilitiesSum + BigInt(1);

    const proof: FullProof = await PytPos.generateProof(tree, randomIndex, assetsSum, validProverArtifacts);

    const bool = await PytPos.verifyProof(proof, validVerificationKey);

    expect(bool).toBe(true);
  });

  it('Should generate a valid proof starting from index 0 where the public signals include the details of the user', async () => {
    const index = 0;

    const assetsSum = liabilitiesSum + BigInt(1);

    const proof: FullProof = await PytPos.generateProof(tree, index, assetsSum, validProverArtifacts);

    const bool = await PytPos.verifyProof(proof, validVerificationKey);

    expect(bool).toBe(true);
    expect(proof.parsedUsername).toBe('OiMkdfHE');
    expect(proof.balance).toBe(BigInt(22404));
  });

  it('Should generate a valid proof starting from a random index of the tree and an assets sums = total sum of liabilities and valid artifacts', async () => {
    const randomIndex = Math.floor(Math.random() * tree.leaves.length);

    const assetsSum = liabilitiesSum;

    const proof: FullProof = await PytPos.generateProof(tree, randomIndex, assetsSum, validProverArtifacts);

    const bool = await PytPos.verifyProof(proof, validVerificationKey);

    expect(bool).toBe(true);
  });

  it('Should generate a valid proof starting from a random index of the tree and an assets sums = total sum of liabilities and valid artifacts', async () => {
    const randomIndex = Math.floor(Math.random() * tree.leaves.length);

    const assetsSum = liabilitiesSum;

    const proof: FullProof = await PytPos.generateProof(tree, randomIndex, assetsSum, {
      wasmFilePath: pathToValidWasm,
      zkeyFilePath: pathToValidZkey,
    });

    const bool = await PytPos.verifyProof(proof, validVerificationKey);

    expect(bool).toBe(true);
  });

  it('Should throw an error when generating a proof starting from a random index of the tree and an assets sums < total sum of liabilities and valid artifacts', async () => {
    const randomIndex = Math.floor(Math.random() * tree.leaves.length);

    const assetsSum = liabilitiesSum - BigInt(1);

    // expect the function to throw an error
    await expect(
      PytPos.generateProof(tree, randomIndex, assetsSum, {
        wasmFilePath: pathToValidWasm,
        zkeyFilePath: pathToValidZkey,
      }),
    ).rejects.toThrow();
  });

  it('Should throw an error when generating a proof starting from a random index of the tree and an assets sums > total sum of liabilities and a path to an invalid wasm file', async () => {
    const randomIndex = Math.floor(Math.random() * tree.leaves.length);

    const assetsSum = liabilitiesSum + BigInt(1);

    // expect the function to throw an error
    await expect(
      PytPos.generateProof(tree, randomIndex, assetsSum, {
        wasmFilePath: pathToInvalidWasm,
        zkeyFilePath: pathToValidZkey,
      }),
    ).rejects.toThrow();
  });

  it('Should throw an error when generating a proof starting from a random index of the tree and an assets sums > total sum of liabilities and a path to an invalid zkey file', async () => {
    const randomIndex = Math.floor(Math.random() * tree.leaves.length);

    const assetsSum = liabilitiesSum + BigInt(1);

    // expect the function to throw an error
    await expect(
      PytPos.generateProof(tree, randomIndex, assetsSum, {
        wasmFilePath: pathToValidWasm,
        zkeyFilePath: pathToInvalidZkey,
      }),
    ).rejects.toThrow();
  });

  it('Should not verify a valid proof when using an invalid verification key', async () => {
    const randomIndex = Math.floor(Math.random() * tree.leaves.length);

    const assetsSum = liabilitiesSum + BigInt(1);

    const proof: FullProof = await PytPos.generateProof(tree, randomIndex, assetsSum, {
      wasmFilePath: pathToValidWasm,
      zkeyFilePath: pathToValidZkey,
    });

    const bool = await PytPos.verifyProof(proof, invalidVerificationKey);

    expect(bool).toBe(false);
  });
});

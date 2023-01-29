import { Utils } from 'pyt-merkle-sum-tree';
import { FullProof } from './types/index';
import { poseidon } from 'circomlibjs';

export default function verifyPublicSignals(
  proof: FullProof,
  username: string,
  balance: bigint,
  expectedMerkleTreeRoot: bigint,
  expectedAssetsSum: bigint,
): boolean {
  // check that the leafHash of the proof is equal to the hash of the username and balance
  const hashPreimage: bigint[] = [Utils.parseUsernameToBigInt(username), balance];
  const isValidLeafHash: boolean = proof.leafHash == poseidon(hashPreimage);

  // check that expectedMerkleTreeRoot is equal to the rootHash of the proof
  const isValidRootHash: boolean = proof.rootHash == expectedMerkleTreeRoot;

  // check that expectedAssetsSum is equal to the assetsSum of the proof
  const isValidAssetsSum: boolean = proof.assetsSum == expectedAssetsSum;

  return isValidRootHash && isValidAssetsSum && isValidLeafHash;
}

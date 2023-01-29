import { groth16 } from 'snarkjs';
import { FullProof } from './types/index';
import { Utils } from 'pyt-merkle-sum-tree';
import { poseidon } from 'circomlibjs';


/**
 * Verify a proof of solvency.
 * @param fullProof The proof to verify.
 * @param verificationKey The verification key.
 * @returns A boolean indicating if the proof is valid.
 */ 
export default async function verifyProof(fullProof: FullProof, verificationKey: JSON): Promise<boolean> {

  const leafHash: bigint = buildLeafHash(fullProof.parsedUsername, fullProof.balance);

  return await groth16.verify(
    verificationKey,
    [leafHash, fullProof.rootHash, fullProof.assetsSum],
    fullProof.proof,
  );
}

/**
 * Build a leaf hash from a username and a balance. The leaf hash is how an entry (username and balance) is stored in the Merkle Sum Tree.
 * @param parsedUsername The username of the user.
 * @param balance The balance of the user.
 * @returns A leaf hash.
 */
function buildLeafHash(parsedUsername: string, balance: bigint): bigint {
  const hashPreimage: bigint[] = [Utils.parseUsernameToBigInt(parsedUsername), balance];
  return poseidon(hashPreimage);
}

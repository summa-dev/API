import { groth16 } from 'snarkjs';
import { FullProof } from './types/index';
import { Utils } from 'pyt-merkle-sum-tree';
import { poseidon } from 'circomlibjs';


export default async function verifyProof(fullProof: FullProof, verificationKey: JSON): Promise<boolean> {

  const leafHash: bigint = buildLeafHash(fullProof.parsedUsername, fullProof.balance);

  return await groth16.verify(
    verificationKey,
    [leafHash, fullProof.rootHash, fullProof.assetsSum],
    fullProof.proof,
  );
}

function buildLeafHash(parsedUsername: string, balance: bigint): bigint {
  const hashPreimage: bigint[] = [Utils.parseUsernameToBigInt(parsedUsername), balance];
  return poseidon(hashPreimage);
}

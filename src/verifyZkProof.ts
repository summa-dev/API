import { groth16 } from 'snarkjs';
import { FullProof } from './types/index';

export default function verifyZkProof(fullProof: FullProof, verificationKey: JSON): boolean {
  return groth16.verify(
    verificationKey,
    [fullProof.leafHash, fullProof.rootHash, fullProof.assetsSum],
    fullProof.proof,
  );
}

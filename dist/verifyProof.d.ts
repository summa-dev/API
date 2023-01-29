import { FullProof } from './types/index';
/**
 * Verify a proof of solvency.
 * @param fullProof The proof to verify.
 * @param verificationKey The verification key.
 * @returns A boolean indicating if the proof is valid.
 */
export default function verifyProof(fullProof: FullProof, verificationKey: JSON): Promise<boolean>;

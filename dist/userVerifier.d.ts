import { FullProof } from './types';
/**
 * UserVerifier is a class that contains the core methods to let a user verify the solvency of a CEX.
 */
export default class UserVerifier {
    private readonly _verificationKey;
    private readonly username;
    private readonly balance;
    /**
     * Initializes the verifier
     * @param username The username of the user.
     * @param balance The balance of the user.
     * @param verificationKey The verification key of the verifier.
     */
    constructor(username: string, balance: bigint, verificationKey: JSON);
    /**
     * Verify a proof of solvency.
     * @param fullProof The proof of solvency.
     * @returns True if the proof is valid, false otherwise.
     */
    verifyProof(fullProof: FullProof): Promise<boolean>;
}

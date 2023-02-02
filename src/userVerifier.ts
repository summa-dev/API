import { FullProof } from './types';
import { groth16 } from 'snarkjs';

/**
 * UserVerifier is a class that contains the core methods to let a user verify the solvency of a CEX.
 */
export default class UserVerifier {

    private readonly _verificationKey: JSON;
    private readonly username: string;
    private readonly balance: bigint;
    
    /**
     * Initializes the verifier
     * @param verificationKey The verification key of the verifier.
     * @param username The username of the user.
     * @param balance The balance of the user.
    */
    constructor(
        username: string,
        balance: bigint,
        verificationKey: JSON,
    ) {
        this._verificationKey = verificationKey;
        this.username = username;
        this.balance = balance;
        // freeze the object to prevent any modification
        Object.freeze(this);

    }

    /**
     * Verify a proof of solvency.
     * @param fullProof The proof of solvency.
     * @returns True if the proof is valid, false otherwise.
    */
    public async verifyProof(fullProof: FullProof): Promise<boolean> {

        if (fullProof.entry.username !== this.username || fullProof.entry.balance !== this.balance) {
            return false;
        }

        const leafHash: bigint = fullProof.entry.computeLeaf().hash;

        return await groth16.verify(this._verificationKey, [leafHash, fullProof.rootHash, fullProof.assetsSum], fullProof.proof);

    }

}
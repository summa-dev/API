import { SnarkProverArtifacts, FullProof, CircomInput} from './types';
import { IncrementalMerkleSumTree, Entry } from 'pyt-merkle-sum-tree';
import { groth16 } from 'snarkjs';
import buildCircomInput from './buildCircomInput';


/**
 * Prover is a class that contains the core methods to let CEXs provide credible Proof Of Solvency to its users
 * while maintaining secrecy over their Business Information thanks to zkSNARKs.
 * The proof doesn't reveal any information such as the total balances of each users, the number of users and total amount of liabilities of the exchange.
 */
export default class Prover {

    private readonly _tree: IncrementalMerkleSumTree;
    private readonly _assetsSum: bigint;
    private readonly _proverArtifacts: SnarkProverArtifacts;
    
    /**
     * Initializes the prover
     * @param pathToCsv The path to the CSV file containing the users' usernames and balances.
     * @param assetsSum The total assets owned by the exchange.
     * @param proverArtifacts The artifacts of the prover.
     */
    constructor(
        tree: IncrementalMerkleSumTree,
        assetsSum: bigint,
        proverArtifacts: SnarkProverArtifacts,
    ) {
        this._tree = tree;
        this._assetsSum = assetsSum;
        this._proverArtifacts = proverArtifacts;

        // freeze the object to prevent any modification
        Object.freeze(this);
    }

    public get tree(): IncrementalMerkleSumTree {
        return this._tree;
    }

    public get assetsSum(): bigint {
        return this._assetsSum;
    }

    /**
     * Generate a proof of solvency for a specific user.
     * @param userIndex The index of the user in the csv file.
     * @returns A proof of solvency.
     */
    public async generateProofForUser(userIndex: number): Promise<FullProof> {

        const circomInput: CircomInput = buildCircomInput(this._tree, userIndex, this._assetsSum);

        const { proof, publicSignals } = await groth16.fullProve(
          circomInput,
          this._proverArtifacts.wasmFilePath,
          this._proverArtifacts.zkeyFilePath,
        );
      
        const entry = new Entry (circomInput.username, circomInput.balance);
      
        const fullProof: FullProof = {
          entry,
          rootHash: publicSignals[1],
          assetsSum: publicSignals[2],
          proof,
        };
      
        return fullProof;
    }

}
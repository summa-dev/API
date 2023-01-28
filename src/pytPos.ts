import {IncrementalMerkleSumTree} from 'pyt-merkle-sum-tree'
import {FullProof, SnarkProverArtifacts} from './types/index'
import generateProof from './generateProof'
import verifyProof from './verifyProof'


/**
 * Add here description
 */

export default class PytPos {

  /**
   * 
   */
  static createMerkleSumTree(pathToCsv: string): IncrementalMerkleSumTree {

    return new IncrementalMerkleSumTree(pathToCsv)

  }

  /**
   * 
   */
  static async generateProofOfSolvency(merkleSumTree: IncrementalMerkleSumTree, userIndex: number, assetsSum: bigint, proverArtifacts: SnarkProverArtifacts): Promise<FullProof> {

    return await generateProof(merkleSumTree, userIndex, assetsSum, proverArtifacts)
    }


  /**
   * 
   */
  static verifyProofOfSolvency(proof: FullProof, username: string, balance: bigint, expectedMerkleTreeRoot: bigint, expectedAssetsSum: bigint, verificationKey: JSON): boolean {

    return verifyProof(proof, username, balance, expectedMerkleTreeRoot, expectedAssetsSum, verificationKey)

    }


}

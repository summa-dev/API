import {IncrementalMerkleSumTree} from 'pyt-merkle-sum-tree'
import {FullProof, SnarkProverArtifacts} from './types/index'
import _generateProof from './generateProof'
import _verifyPublicSignals from './verifyPublicSignals'
import _verifyZkProof from './verifyZkProof'


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

    return await _generateProof(merkleSumTree, userIndex, assetsSum, proverArtifacts)
    
  }


  /**
   * 
   */
  static verifyZkProof(proof: FullProof, verificationKey: JSON): boolean {

    return _verifyZkProof(proof, verificationKey)

    }

  static verifyPublicSignals(proof: FullProof, username: string, balance: bigint, expectedMerkleTreeRoot: bigint, expectedAssetsSum: bigint): boolean {

    return _verifyPublicSignals(proof, username, balance, expectedMerkleTreeRoot, expectedAssetsSum)

    }


}

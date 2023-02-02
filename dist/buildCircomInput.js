"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Build the input for the Circom circuit.
 * @param merkleSumTree The Merkle Sum Tree generate by the prover.
 * @param userIndex The index of the user in the Merkle Sum Tree.
 * @param assetsSum The sum of the assets of the exchange.
 * @returns The input for the Circom circuit
 */
function buildCircomInput(merkleSumTree, userIndex, assetsSum) {
    var proofOfMembershipInput = merkleSumTree.createProof(userIndex);
    var circomInput = {
        rootHash: proofOfMembershipInput.rootHash,
        username: proofOfMembershipInput.entry.usernameToBigInt,
        balance: proofOfMembershipInput.entry.balance,
        pathIndices: proofOfMembershipInput.pathIndices,
        siblingsHashes: proofOfMembershipInput.siblingsHashes,
        siblingsSums: proofOfMembershipInput.siblingsSums,
        assetsSum: assetsSum,
    };
    return circomInput;
}
exports.default = buildCircomInput;

// import library for smt 
// Create a file from the tree and store it somewhere
import { IncrementalMerkleSumTree } from "ts-merkle-sum-tree"
import { poseidon } from "circomlibjs"
import fs from 'fs'
import getCSVEntries from '../utils/csv.js';

export default function initMST(pathToCsv, pathToTree) {
    // Create tree and insert 10 leaves
    let tree = new IncrementalMerkleSumTree(poseidon, 16) // Binary tree with 16 levels and poseidon hash function

    // read the csv file and insert the data in the tree
    const entries = getCSVEntries(pathToCsv);

    // add the entries to the tree
    for (let i = 0; i < entries.length; i++) {
        tree.insert(BigInt(entries[i].userID), BigInt(entries[i].balance));
    }

    fs.writeFileSync(pathToTree, JSON.stringify(tree, (_, v) => typeof v === 'bigint' ? v.toString() : v))

};







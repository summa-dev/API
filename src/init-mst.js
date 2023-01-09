// import library for smt 
// Create a file from the tree and store it somewhere
import { IncrementalMerkleSumTree } from "ts-merkle-sum-tree"
import { poseidon } from "circomlibjs"
import fs from 'fs'
import csv from 'csv-parser'


export default function initMST(pathToCsv, pathToTree) {
    // Create tree and insert 10 leaves
    let tree = new IncrementalMerkleSumTree(poseidon, 16) // Binary tree with 16 levels and poseidon hash function


    fs.createReadStream(pathToCsv)
    .pipe(csv())
    .on('data', (data) => {
        // insert the data in the tree
        tree.insert(BigInt(data.userID), BigInt(data.balance))
    })
    .on('end', () => {
        // store the tree in a json file
        fs.writeFileSync(pathToTree, JSON.stringify(tree, (_, v) => typeof v === 'bigint' ? v.toString() : v))
    });
};







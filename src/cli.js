const { Command } = require("commander");
const program = new Command();
const initSmt = require("./init-mst.js");
const { genProof, genInput } = require("./gen-proof.js");
const verifyProof = require("./verify-proof.js");
const getCSVEntries = require("../utils/csv.js");
const fs = require("fs");

program
  .name("pan-y-tomate-pos-demo")
  .description("CLI to demo the Pan y Tomate POS")
  .version("0.0.1");

program
  .command("init-mst")
  .description("Initialize the MST")
  .argument(
    "path/to/input/csv/file",
    "Path to the csv file that stores the entries"
  )
  .argument(
    "path/to/output/json/file",
    "Path to the json file where to store the tree"
  )
  .action((pathToCsv, pathToTree) => {
    // check that pathToCsv is a csv File
    if (!pathToCsv.endsWith(".csv")) {
      throw new Error("The input file is not a csv file");
    }

    // check that pathToTree is a json File
    if (!pathToTree.endsWith(".json")) {
      throw new Error("The output file is not a json file");
    }

    const entries = getCSVEntries(pathToCsv);
    
    // // get the height of the tree. For now it support height of 16 only.
    // const treeHeight = Math.ceil(Math.log2(entries.length));

    initSmt(entries, pathToTree);
  });

program
  .command("gen-proof")
  .description("Generate the proof for a specific entry in the tree")
  .argument(
    "path/to/input/json/file",
    "Path to the json file that stores the tree"
  )
  .argument(
    "path/to/output/proof/file",
    "Path to the json file where to store the proof"
  )
  .argument(
    "path/to/output/public/file",
    "Path to the json file where to store the public signals of the proof"
  )
  .argument("index", "index of the entry in the tree to generate the proof for")
  .argument("target sum", "target sum to generate the proof for")
  .action((pathToTree, pathToProof, pathToPublic, index, targetSum) => {
    // check that pathToTree is a json File
    if (!pathToTree.endsWith(".json")) {
      throw new Error("The output file is not a json file");
    }

    // check that pathToProof is a json File
    if (!pathToProof.endsWith(".json")) {
      throw new Error("The output file is not a json file");
    }

    const tree = JSON.parse(fs.readFileSync(pathToTree, "utf8"));

    const input = genInput(tree, index, targetSum);

    genProof(input, pathToProof, pathToPublic);
  });

program
  .command("verify-proof")
  .description("Verify POS for a specific user")
  .argument(
    "<path/to/input/proof/file>",
    "Path to the json file that stores the proof"
  )
  .argument(
    "<path/to/input/public/file>",
    "Path to the json file that stores the public signals of the proof"
  )
  .action(async (pathToProof, pathToPublic) => {
    await verifyProof(pathToProof, pathToPublic);
  });

program.parse();

const shell = require('shelljs');
const { expect } = require('chai');
const fs = require('fs')
const getCSVEntries = require('../utils/csv.js');

// 1st category of testing => MT creation
describe('POS CLI init-mst', () => {

    let csvFile;
    let mstFile;
    let entries;
    let parsedMst;

    beforeEach(async function () {

      csvFile = 'test/data.csv';
      mstFile = 'test/merkletree.json';  

      // exec the command with the csv file as inputFile and the mst file as outputFile
      shell.exec(`node src/cli.js init-mst ${csvFile} ${mstFile}`);

      // parse the entries from the csv file
      entries = getCSVEntries(csvFile);

      // parse the json file
      parsedMst = JSON.parse(fs.readFileSync(mstFile, 'utf8'));
    });

    it('should create a mst file in json', () => {
      // check if the file is created
      expect(fs.existsSync(mstFile)).to.be.true;
    });
  
    it('should create a mst that contain the correct number of entries', () => {
      // expect the tree to contain the same number of entries as the csv file
      expect(parsedMst._nodes[0].length).to.equal(entries.length);
    });
  
    it('should create a mst that contain the right values', () => {
    
      // expect the entries to match 
      for (let i = 0; i < entries.length; i++) {
        expect(parsedMst._nodes[0][i].sum).to.equal(entries[i].balance);
      }
    });
  
    it('should create a mst that contains the right root sum', () => {
      
      // get the root sum from the mst
      const rootSum = parsedMst._root.sum;
  
      // loop over the entries and get the sum of all the balances
      let sum = 0;
      for (let i = 0; i < entries.length; i++) {
        sum += parseInt(entries[i].balance);
      }
      // expect the root sum to be equal to the sum of all the balances
      expect(parseInt(rootSum)).to.equal(sum);
    });
});

describe('POS CLI proof', function async () {

    this.timeout(1000 * 1000);

    let csvFile;
    let mstFile;

    let proofFile;
    let publicFile;

    let entries;

    before(async function () {

      // generate valid proofs for each entry in the csv file
      // the total liabilities from the csv file is 4824
      csvFile = 'test/data.csv';
      mstFile = 'test/merkletree.json';  

      proofFile = 'test/proof.json';
      publicFile = 'test/public.json';

      proofFile = 'test/proof.json';  

      entries = getCSVEntries(csvFile);

      const targetSum = BigInt(10000)

      // generate a valid proof for each entry in the csv file
      // targetSum > total liabilities
      for (let i = 0; i < entries.length; i++) {
        shell.exec(`node src/cli.js gen-proof ${mstFile} test/proof${i}.json test/public${i}.json ${i} ${targetSum}`);
      }
    });

    it('should create a proof file in json', () => {
      // check if the file is created
      for (let i = 0; i < entries.length; i++) {
        expect(fs.existsSync(`test/proof${i}.json`)).to.be.true;
        expect(fs.existsSync(`test/public${i}.json`)).to.be.true;
      }
    });

    it('Should verify valid proofs', () => {

      // assert that the shell command throws no errors 
      for (let i = 0; i < entries.length; i++) {

      expect(() => {
          shell.exec(`node src/cli.js verify-proof test/proof${i}.json test/public${i}.json`);
       }).to.not.throw() 
      }
    });
});

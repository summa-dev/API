# POS-CLI

Command Line Interface to use the pan-y-tomate Proof Of Solvency Tooling. You only need to provide a csv file with the user_id and the amount of tokens they hold and the CLI will generate a proof for each user and verify it.

## Usage

The CLI comprises of three execs: 

**`init-mst`**

```bash
$ node src/cli init-mst data.csv mst.json
```

Parse the csv file provided as input (`data.csv`) into a Merkle Sum Tree and saves it in a json file provided as output `mst.json`. The csv file should be in the format of `userID,balance` (see `data.csv` for example).

**`gen-proof`**

```bash
$ node src/cli gen-proof mst.json proof.json public.json 1 2000
```

Starting from the data structure provided as input (`mst.json`), generate a proof for the user with index `1` in the csv file. The total assets held by the exchange is `2000`. 
The proof is saved in a json file provided as output (`proof.json`). The public signals is also saved in a json file provided as output (`public.json`)

> Note that the `index` is not the same as the `userID`. The `index` is the position of the user in the csv file. The first user will have index 0, an so on... The `userID` is the value of the first column of the csv file.

**`verify-proof`**

```bash
$ node src/cli verify-proof proof.json public.json
```

Starting from the proof provided as input (`proof.json`) and the public signals provided as input (`public.json`), the user can verify their own proof. The user is still required to check whether the public signals are correct.

## Core Deps

- [ts-merkle-sum-tree](https://github.com/pan-y-tomate/ts-merkle-sum-tree), APIs to create merkle sum tree in Typescript
- [zk-proof-of-solvency-prover](https://github.com/pan-y-tomate/zk-proof-of-solvency-prover), zkSNARK proving system for Proof Of Solvency. 

### To-dos

- [ ] Remove csv parser from dep
- [ ] Set Height of the MT
- [ ] Add gitignore 
- [ ] Cleanup package.json
- [ ] Change generate proof such that it generates a circom proof 
- [ ] Add verify proof function
- [ ] Prettify
- [ ] Specify where the artifcats come from
- [ ] Fix path in testing


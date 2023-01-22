#! /usr/bin/env node

import { Command } from "commander";
import {helloWorld} from './index';
const program = new Command();

program
  .name("pan-y-tomate-pos-demo")
  .description("CLI to demo the Pan y Tomate POS")
  .version("0.0.1");

program
  .command("hello")
  .action(() => {
    console.log(helloWorld());
});

program
  .command("verify-proof")
  .description("Verify POS for a specific user")
  .argument(
    "<path/to/input/proof/file>",
    "Path to the json file that stores the proof"
  )
  .action((arg : any) => {
    console.log(arg);
  });

program.parse(process.argv);

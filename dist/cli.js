"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var index_1 = require("./index");
var program = new commander_1.Command();
program
    .name("pan-y-tomate-pos-demo")
    .description("CLI to demo the Pan y Tomate POS")
    .version("0.0.1");
program
    .command("hello")
    .action(function () {
    console.log((0, index_1.helloWorld)());
});
program
    .command("verify-proof")
    .description("Verify POS for a specific user")
    .argument("<path/to/input/proof/file>", "Path to the json file that stores the proof")
    .action(function (arg) {
    console.log(arg);
});
program.parse(process.argv);

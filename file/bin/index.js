#!/usr/bin/env node

let program = require('commander');
let package = require('../package.json');
let hmm = require('./hmm');

program
    .version(package.version)
    .usage('<command> [options]');
program.command('hmm (orgin)')
    .description("下载货麦麦")
    .action(function (origin, some) {
        hmm(origin, some);
    })

program.parse(process.argv);
if (program.args.length == 0) {
    program.help();
}
import execa from "execa";
import { sync as findBin } from "resolve-bin";
import { Report } from "c8";
import * as fs from "node:fs";
import * as path from "node:path";
import * as crypto from "node:crypto";
import * as readline from "node:readline";

async function main() {
    if (process.env.NODE_V8_COVERAGE) {
        console.info("Code coverage enabled, will be processed by `nodejs_test`");
        console.table({
            V8_COVERAGE_DIR: process.env.NODE_V8_COVERAGE,
            OUTPUT_FILE: process.env.COVERAGE_OUTPUT_FILE,
        });
    }

    console.info("Running ava");
    await execa(findBin("ava"), [], { stdio: "inherit" });
}

main().catch(e => {
    console.error("An error occurred");
    console.error(e);
    process.exit(1);
});

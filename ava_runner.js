import execa from "execa";
import { sync as findBin } from "resolve-bin";
import { Report } from "c8";
import * as fs from "node:fs";
import * as path from "node:path";
import * as crypto from "node:crypto";
import * as readline from "node:readline";

async function main() {
    const coverageDir = process.env.COVERAGE_DIR;
    const outputFile = process.env.COVERAGE_OUTPUT_FILE;
    const sourceFileManifest = process.env.COVERAGE_MANIFEST;
    const tmpdir = process.env.TEST_TMPDIR;

    if (!sourceFileManifest || !tmpdir || !outputFile) {
        throw new Error();
    }

    const instrumentedSourceFiles = fs.readFileSync(sourceFileManifest).toString('utf8').split('\n');

    // c8 will name the output report file lcov.info
    // so we give it a dir that it can write to
    // later on we'll move and rename it into output_file as bazel expects
    const c8OutputDir = path.join(tmpdir, crypto.randomBytes(4).toString('hex'));
    fs.mkdirSync(c8OutputDir);

    const includes =
        instrumentedSourceFiles
            // the manifest may include files such as .bash so we want to reduce that down to the set
            // we can run coverage on in JS
            .filter(f => ['.js', '.jsx', '.cjs', '.ts', '.tsx', '.mjs'].includes(path.extname(f)))
            .map(f => {
                // at runtime we only run .js or .mjs
                // meaning that the coverage written by v8 will only include urls to .js or .mjs
                // so the source files need to be mapped from their input to output extensions
                // TODO: how do we know what source files produce .mjs or .cjs?
                const p = path.parse(f);
                let targetExt;
                switch (p.ext) {
                    case '.mjs':
                        targetExt = '.mjs';
                    default:
                        targetExt = '.js';
                }

                return path.format({ ...p, base: undefined, ext: targetExt });
            });

    let coverageEnabled = false;
    if (process.env.NODE_V8_COVERAGE) {
        console.info("Code coverage enabled");
        coverageEnabled = true;
    }

    console.info("Running ava");
    await execa(findBin("ava"), [], { stdio: "inherit" });

    console.info("Processing coverage");
    // If c8 experiences an error, it swallows it
    const c8Report = new Report({
        include: includes,
        // the test-exclude lib will include everything if our includes array is empty
        // so instead when it's empty exclude everything
        // but when it does have a value, we only want to use those includes, so don't exclude
        // anything
        exclude: includes.length === 0 ? ['**'] : [],
        reportsDirectory: c8OutputDir,
        // tempDirectory as actually the dir that c8 will read from for the v8 json files
        tempDirectory: coverageDir,
        resolve: '',
        all: true,
        // TODO: maybe add an attribute to allow more reporters
        // or maybe an env var?
        reporter: ['lcovonly'],
        allowExternal: false,
    });

    await c8Report.run();

    console.log(includes);
    console.log(fs.readdirSync(coverageDir));
    console.log(fs.readdirSync(c8OutputDir));
    console.log(fs.readFileSync(c8OutputDir + "/lcov.info", "utf-8"));

    // moves the report into the files bazel expects
    // and fixes the paths as we're moving it up 3 dirs
    const inputFile = path.join(c8OutputDir, 'lcov.info');
    // we want to do this 1 line at a time to avoid using too much memory
    const input = readline.createInterface({
        input: fs.createReadStream(inputFile),
    });
    const output = fs.createWriteStream(outputFile);

    input.on('line', line => {
        const patched = line.replace('SF:../../../', 'SF:')
        output.write(patched + '\n');
    });

    // console.log(await fs.readdir(process.env.NODE_V8_COVERAGE));
    // const files = await fs.readdir(process.env.NODE_V8_COVERAGE);
    // for (const file of files) {
    //     console.info(process.env.NODE_V8_COVERAGE + "/" + file, "utf-8");
    //     console.log(await fs.readFile(process.env.NODE_V8_COVERAGE + "/" + file, "utf-8"));
    // }
}

main().catch(e => {
    console.error("An error occurred");
    console.error(e);
    process.exit(1);
});

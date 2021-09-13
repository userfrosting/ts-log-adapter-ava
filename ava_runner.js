import execa from "execa";
import { sync as findBin } from "resolve-bin";

async function main() {
    if (process.env.NODE_V8_COVERAGE) {
        console.info("Code coverage enabled");
    }

    console.info("Running ava");
    await execa(findBin("ava"), [], { stdio: "inherit" });
}

main().catch(e => {
    console.error("An error occurred");
    console.error(e);
    process.exit(1);
});

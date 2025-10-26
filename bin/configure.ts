#!/usr/bin/env bun
import Logger from "@bejibun/logger";
import {isEmpty, isCommandExists} from "@bejibun/utils";
import path from "path";

if (!isCommandExists("git")) {
    Logger.setContext("BEJIBUN").error("The git command doesn't exists.");
    process.exit(1);
}

if (!isCommandExists("bun")) {
    Logger.setContext("BEJIBUN").error("The bun command doesn't exists.");
    process.exit(1);
}

const directory: string | undefined = process.argv.slice(2)[0];

if (isEmpty(directory)) {
    Logger.setContext("BEJIBUN").error("The destination directory not provided.");
    process.exit(1);
}

Logger.setContext("BEJIBUN").info("Cloning the project...");
Logger.empty();

Bun.spawnSync(["git", "clone", "https://github.com/crenata/bejibun.git", directory], {
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit"
});

Logger.empty();
Logger.setContext("BEJIBUN").info("Installing dependencies...");
Logger.empty();

const workingDirectory: string = path.resolve(process.cwd(), directory);

Bun.spawnSync(["bun", "install"], {
    cwd: workingDirectory,
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit"
});

Logger.empty();
Logger.setContext("BEJIBUN").info("Your framework is ready.., Happy Coding!.");
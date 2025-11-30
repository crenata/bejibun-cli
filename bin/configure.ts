#!/usr/bin/env bun
import Logger from "@bejibun/logger";
import {isEmpty, isCommandExists} from "@bejibun/utils";
import {rmSync} from "fs";
import path from "path";

const context: string = "Bejibun";

if (!isCommandExists("git")) {
    Logger.setContext(context).error("The git command doesn't exists.");
    process.exit(1);
}

if (!isCommandExists("bun")) {
    Logger.setContext(context).error("The bun command doesn't exists.");
    process.exit(1);
}

const directory: string | undefined = process.argv.slice(2)[0];

if (isEmpty(directory)) {
    Logger.setContext(context).error("The destination directory not provided.");
    process.exit(1);
}

Logger.setContext(context).info("Cloning the project...");
Logger.empty();

Bun.spawnSync(["git", "clone", "https://github.com/crenata/bejibun.git", directory], {
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit"
});

Logger.empty();
Logger.setContext(context).info("Installing dependencies...");
Logger.empty();

const workingDirectory: string = path.resolve(process.cwd(), directory);

Bun.spawnSync(["bun", "install"], {
    cwd: workingDirectory,
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit"
});

Logger.empty();
Logger.setContext(context).info("Removing .git directory...");
Logger.empty();

rmSync(path.resolve(workingDirectory, ".git"), {
    recursive: true,
    force: true
});

Logger.empty();
Logger.setContext(context).info("Creating .env...");
Logger.empty();

await Bun.write(
    path.resolve(workingDirectory, ".env"),
    (
        await Bun.file(path.resolve(workingDirectory, ".env.example")).text()
    ).replaceAll("Bejibun", directory)
);

Logger.empty();
Logger.setContext(context).info("Your framework is ready.., Happy Coding!.");
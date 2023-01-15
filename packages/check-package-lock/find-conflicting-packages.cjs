const fs = require("fs");

const packageLock = JSON.parse(fs.readFileSync("package-lock.json", "utf8"));
const packages = (packageLock && packageLock.packages) || {};

Object.keys(packages)
    .filter((p) => typeof p === "string")
    .filter((p) => !p.startsWith("node_modules/"))
    .filter((p) => p.includes("/node_modules/"))
    .forEach((p) => console.log(p));

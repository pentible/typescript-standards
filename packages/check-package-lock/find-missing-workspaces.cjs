const fs = require("fs");
const packageLock = JSON.parse(fs.readFileSync("package-lock.json", "utf8"));
const packages = (packageLock && packageLock.packages) || {};

Object.keys(packages)
    .filter((p) => typeof p === "string")
    .filter((p) => p.startsWith("packages/"))
    .filter((p) => !fs.existsSync(p))
    .forEach((p) => console.log(p));

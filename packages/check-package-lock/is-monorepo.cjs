const fs = require("fs");

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
if (packageJson && packageJson.workspaces) {
    process.exit(0);
}

process.exit(1);

const fs = require("fs");
const path = require("path");

const packageJsonPath = path.resolve(__dirname, "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

const version = packageJson.version || "0.0.0";
const parts = version.split(".").map(Number);

// Incrementa o patch (último número)
parts[2] = (parts[2] || 0) + 1;

const newVersion = parts.join(".");

packageJson.version = newVersion;

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log(`𑫰 Version bumped: ${version} → ${newVersion}`);

const fs = require("fs");
const pkg = require("./package.json");

const content = `window.APP_VERSION = '${pkg.version}';\n`;

if (!fs.existsSync("./dist/assets/js")) {
  fs.mkdirSync("./dist/assets/js", { recursive: true });
}

fs.writeFileSync("./dist/assets/js/version.js", content);

console.log(`𑫰 Generated version.js with version ${pkg.version}`);

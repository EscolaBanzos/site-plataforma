const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");
const CleanCSS = require("clean-css");
const UglifyJS = require("uglify-js");
const { minify: minifyHTML } = require("html-minifier");

try {
  // Deleta a pasta dist, se existir
  const distPath = path.resolve(__dirname, "dist");

  if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true });
    console.log("Pasta 'dist' deletada com sucesso.");
  }

  // Criar diretórios se não existirem
  fs.mkdirSync(path.resolve("./dist/assets/css"), { recursive: true });
  fs.mkdirSync(path.resolve("./dist/assets/js"), { recursive: true });
  fs.mkdirSync(path.resolve("./dist/forms"), { recursive: true }); // se for necessário

  // Minificar CSS de variáveis
  const variablecss = fs.readFileSync("./assets/css/variables.css", "utf8");
  const minifiedVariablecssCSS = new CleanCSS().minify(variablecss).styles;
  fs.writeFileSync("./dist/assets/css/variables.css", minifiedVariablecssCSS);

  // Minificar CSS principal
  const css = fs.readFileSync("./assets/css/style.css", "utf8");
  const minifiedCSS = new CleanCSS().minify(css).styles;
  fs.writeFileSync("./dist/assets/css/style.css", minifiedCSS);

  // Minificar JS
  const js = fs.readFileSync("./assets/js/main.js", "utf8");
  const minifiedJS = UglifyJS.minify(js);
  if (minifiedJS.error) {
    console.error("Erro ao minificar JS:", minifiedJS.error);
    process.exit(1);
  }
  fs.writeFileSync("./dist/assets/js/main.js", minifiedJS.code);

  // Copiar assets
  fse.copySync("./assets/images", "./dist/assets/images");
  fse.copySync("./assets/vendor", "./dist/assets/vendor");
  fse.copySync("./forms", "./dist/forms");

  // Minificar HTML
  const html = fs.readFileSync("./index.html", "utf8");
  const minifiedHTML = minifyHTML(html, {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true,
  });
  fs.writeFileSync("./dist/index.html", minifiedHTML);

  console.log("Arquivos minificados com sucesso!");
} catch (error) {
  console.error("Erro durante a minificação:", error);
  process.exit(1);
}

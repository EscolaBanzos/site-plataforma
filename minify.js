const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");
const CleanCSS = require("clean-css");
const UglifyJS = require("uglify-js");
const { minify: minifyHTML } = require("html-minifier");

// Caminhos
const distPath = path.resolve(__dirname, "dist");
const htmlPath = path.resolve("./index.html");

// Lê o HTML original
let html;
try {
  html = fs.readFileSync(htmlPath, "utf8");
} catch (e) {
  console.error("Erro ao ler index.html:", e);
  process.exit(1);
}

try {
  // Deleta a pasta dist, se existir
  if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true });
    console.log("🗑 Pasta 'dist' deletada com sucesso.");
  }

  // Criação da estrutura
  fs.mkdirSync(path.join(distPath, "assets/css"), { recursive: true });
  fs.mkdirSync(path.join(distPath, "assets/js"), { recursive: true });
  fs.mkdirSync(path.join(distPath, "forms"), { recursive: true });

  // Minificar variables.css
  const variablecss = fs.readFileSync("./assets/css/variables.css", "utf8");
  const minifiedVariableCSS = new CleanCSS().minify(variablecss).styles;
  fs.writeFileSync("./dist/assets/css/variables.min.css", minifiedVariableCSS);

  // Minificar style.css
  const styleCSS = fs.readFileSync("./assets/css/style.css", "utf8");
  const minifiedStyleCSS = new CleanCSS().minify(styleCSS).styles;
  fs.writeFileSync("./dist/assets/css/style.min.css", minifiedStyleCSS);

  // Minificar main.js
  const js = fs.readFileSync("./assets/js/main.js", "utf8");
  const minifiedJS = UglifyJS.minify(js);
  if (minifiedJS.error) {
    console.error("Erro ao minificar JS:", minifiedJS.error);
    process.exit(1);
  }
  fs.writeFileSync("./dist/assets/js/main.min.js", minifiedJS.code);

  // Copiar demais assets
  fse.copySync("./assets/images", "./dist/assets/images");
  fse.copySync("./assets/vendor", "./dist/assets/vendor");
  if (fs.existsSync("./forms")) {
    fse.copySync("./forms", "./dist/forms");
  }

  // Atualizar paths no HTML
  const updatedHtml = html
    .replace(/assets\/css\/variables\.css/g, "assets/css/variables.min.css")
    .replace(/assets\/css\/style\.css/g, "assets/css/style.min.css")
    .replace(/assets\/js\/main\.js/g, "assets/js/main.min.js");

  // Minificar HTML
  const minifiedHTML = minifyHTML(updatedHtml, {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true,
  });

  // Salvar HTML minificado
  fs.writeFileSync("./dist/index.html", minifiedHTML);

  console.log("✔ Minificação concluída com sucesso!");
} catch (error) {
  console.error("Erro durante a minificação:", error);
  process.exit(1);
}

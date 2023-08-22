// build.js
const esbuild = require("esbuild");

esbuild.build({
  entryPoints: ["./src/index.js"],
  outfile: "./public/assets/app.js",
  minify: true,
  bundle: true,
  loader: {
    ".js": "jsx",
  },
  plugins: [],
}).catch(() => process.exit(1));

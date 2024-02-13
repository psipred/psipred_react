// build.js
const esbuild = require("esbuild");
//console.log(process.env.PUBLIC_URL);
esbuild.build({
  entryPoints: ["./src/index.js"],
  outfile: "./public/static/js/app.js",
  minify: true,
  bundle: true,
  loader: {
    ".js": "jsx",
  },
  plugins: [],
  define: {"process.env.PUBLIC_URL": JSON.stringify(process.env.PUBLIC_URL), }
}).catch(() => process.exit(1));

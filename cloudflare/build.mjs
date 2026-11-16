import * as esbuild from "esbuild";
import { mkdirSync } from "node:fs";

mkdirSync(new URL("./dist/", import.meta.url), { recursive: true });

await esbuild.build({
  entryPoints: [new URL("./src/worker.js", import.meta.url).pathname],
  bundle: true,
  format: "esm",
  platform: "neutral",
  target: "es2022",
  outfile: new URL("./worker.js", import.meta.url).pathname,
  legalComments: "none",
});

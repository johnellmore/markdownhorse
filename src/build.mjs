#!/usr/bin/env node

/**
 * Build script which:
 * - re-generates the `index.html` file at the root of https://markdown.horse
 * - generates a new build of markdownhorse and places it in `static/`
 */

import * as esbuild from "esbuild";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { env } from "node:process";

function determineBuildVersion() {
  return 1; // TODO scan directory
}

function sha256Hash(str) {
  const hash = createHash("sha256");
  hash.update(str);
  return hash.digest("base64");
}

// perform the static build
const distFilename = `v${determineBuildVersion()}.js`;
const outputFile = `static/${distFilename}`;
const build = await esbuild.build({
  entryPoints: ["src/markdownhorse.js"],
  bundle: true,
  outfile: outputFile,
  loader: {
    ".css": "text",
  },
  // metafile: true
});
if (build.metafile) {
  writeFileSync('static/build-metafile.json', JSON.stringify(build.metafile));
}

// generate the index.html file
const bundleContents = readFileSync(outputFile);
const hash = sha256Hash(bundleContents);
const bundleSizeReadable = Math.floor(bundleContents.byteLength / 1024) + 'KB';
const integrity = `sha256-${hash}`;
const domain = env.BUILD_DOMAIN || "markdown.horse";
const protocol = domain === "markdown.horse" ? 'https' : 'http';
const scriptTag = `<script src="${protocol}://${domain}/${distFilename}" crossorigin integrity="${integrity}"></script>`;
// variable replacement
const interpolateVars = (str) => {
  return str
    .replaceAll("{LATEST_TAG}", scriptTag)
    .replaceAll("{BUILD_DOMAIN}", domain)
    .replaceAll("{BUNDLE_SIZE}", bundleSizeReadable);
}

const indexMd = readFileSync("src/index_template.md", "utf8");
const indexRendered = interpolateVars(indexMd);
writeFileSync("static/index.html", indexRendered);

const readmeMd = readFileSync("src/readme_template.md", "utf8");
const readmeRendered = interpolateVars(readmeMd);
writeFileSync("README.md", readmeRendered);

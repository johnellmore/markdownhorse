#!/usr/bin/env node

/**
 * Build script which:
 * - re-generates the `index.html` file at the root of https://markdown.horse
 * - generates a new build of markdownhorse and places it in `static/`, if its
 * different from the existing build
 */

import * as esbuild from "esbuild";
import { createHash } from "node:crypto";
import { unlinkSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { env } from "node:process";

function sha256Hash(str) {
  const hash = createHash("sha256");
  hash.update(str);
  return hash.digest("base64");
}

// perform the static build to a temp file
const buildOut = "static/tempbuild.js";
try {
  unlinkSync(buildOut);
} catch (e) {}
const build = await esbuild.build({
  entryPoints: ["src/markdownhorse.js"],
  bundle: true,
  outfile: buildOut,
  loader: {
    ".css": "text",
  },
  minify: true,
  // metafile: true
});
if (build.metafile) {
  writeFileSync("static/build-metafile.json", JSON.stringify(build.metafile));
}

// generate a SHA hash and see if this is a new build, or if we can just reuse
// the existing current one
const newHash = sha256Hash(readFileSync(buildOut));
const latestExistingBuildNum = readdirSync("static").reduce((acc, filename) => {
  if (filename.startsWith("v") && filename.endsWith(".js")) {
    const version = Number(filename.substring(1, filename.length - 3));
    if (version > acc) {
      return version;
    }
  }
  return acc;
}, 0);
const existingBuild = `static/v${latestExistingBuildNum}.js`;
const existingBuildHash = sha256Hash(readFileSync(existingBuild));
let distFilename;
if (existingBuildHash === newHash) {
  distFilename = `v${latestExistingBuildNum}.js`;
} else {
  // this is a new build, so we need to bump the version number and generate a
  // new build
  distFilename = `v${latestExistingBuildNum + 1}.js`;
  const outputFile = `static/${distFilename}`;
  writeFileSync(outputFile, readFileSync(buildOut));
}
unlinkSync(buildOut);

// generate the index.html file
const domain = env.BUILD_DOMAIN || "markdown.horse";
const protocol = domain === "markdown.horse" ? "https" : "http";
const scriptTag = `<script src="${protocol}://${domain}/${distFilename}" crossorigin integrity="sha256-${newHash}"></script>`;
// variable replacement
const interpolateVars = (str) => {
  return str
    .replaceAll("{LATEST_TAG}", scriptTag)
    .replaceAll("{BUILD_DOMAIN}", domain);
};

const sharedMd = readFileSync("src/shared_content.md", "utf8");
const sharedRendered = interpolateVars(sharedMd);

const indexMd = readFileSync("src/index_template.md", "utf8");
const indexRendered = interpolateVars(indexMd);
writeFileSync("static/index.html", indexRendered + "\n" + sharedRendered);

const readmeMd = readFileSync("src/readme_template.md", "utf8");
const readmeRendered = interpolateVars(readmeMd);
writeFileSync("README.md", readmeRendered + "\n" + sharedRendered);

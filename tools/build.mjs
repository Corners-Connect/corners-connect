/**
 * Builds the deployable prototype into /site.
 *
 *   /                  the marketing site
 *   /find/             Find Your Corner — the survey and comparison chart
 *   /app/              the city app (Bilbao)
 *   /onboarding/       the onboarding survey and dashboard
 *
 * Why a build step at all: the page sources leave out <!doctype html> so they can be
 * published as previews. Browsers fall into quirks mode without it, so we add the
 * wrapper here and rewrite the preview links to relative paths.
 *
 * Run: node tools/build.mjs
 */
import { mkdir, readFile, writeFile, copyFile, rm, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "site");

/** Preview URLs rewritten to paths that work on the live site. */
const LINK_MAP = [
  ["https://claude.ai/artifact/SyVrLipV63UHqEjPSweDyj", "/app/"],
  ["https://claude.ai/artifact/43EJ3fwJPR93fCKgvgraBM", "/onboarding/"],
  ["https://claude.ai/artifact/KgwCmfG8kqduNSqJDEsqDg", "/"]
];

const rewrite = (text) => LINK_MAP.reduce((acc, [from, to]) => acc.split(from).join(to), text);

/** The sources omit the document wrapper so they can be published as previews. */
function wrap(html) {
  if (/^\s*<!doctype/i.test(html)) return rewrite(html);
  return `<!doctype html>\n<html lang="en">\n${rewrite(html)}\n</html>\n`;
}

async function page(src, destDir, destName = "index.html") {
  await mkdir(join(OUT, destDir), { recursive: true });
  const html = await readFile(join(ROOT, src), "utf8");
  await writeFile(join(OUT, destDir, destName), wrap(html), "utf8");
}

async function asset(src, destDir, destName) {
  await mkdir(join(OUT, destDir), { recursive: true });
  const name = destName || src.split("/").pop();
  if (/\.(js|css|json|svg|txt)$/i.test(src)) {
    const text = await readFile(join(ROOT, src), "utf8");
    await writeFile(join(OUT, destDir, name), rewrite(text), "utf8");
  } else {
    await copyFile(join(ROOT, src), join(OUT, destDir, name));
  }
}

async function copyDir(src, destDir) {
  const from = join(ROOT, src);
  if (!existsSync(from)) return;
  await mkdir(join(OUT, destDir), { recursive: true });
  for (const entry of await readdir(from)) {
    const s = join(from, entry);
    if ((await stat(s)).isDirectory()) continue;
    await copyFile(s, join(OUT, destDir, entry));
  }
}

async function build() {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  // marketing site at the root
  await page("website/index.html", ".");
  await asset("website/styles.css", ".");
  await asset("website/site.js", ".");
  await asset("website/photos.js", ".");

  // the app
  await page("app/index.html", "app");
  await asset("app/app.css", "app");
  await asset("app/app.js", "app");
  await asset("app/photos.js", "app");

  // onboarding and dashboard
  await page("app/onboarding.html", "onboarding");
  await asset("app/onboarding.css", "onboarding");
  await asset("app/onboarding.js", "onboarding");

  // Find Your Corner (the single-file prototype at the repo root)
  await page("index.html", "find");

  // originals, handy for swapping in real photos later
  await copyDir("app/photos", "photos");

  // Pages serves what it is given; no Jekyll processing wanted
  await writeFile(join(OUT, ".nojekyll"), "", "utf8");

  const pages = ["index.html", "find/index.html", "app/index.html", "onboarding/index.html"];
  for (const p of pages) {
    const html = await readFile(join(OUT, p), "utf8");
    if (!/^<!doctype html>/i.test(html)) throw new Error(`missing doctype: ${p}`);
    if (html.includes("claude.ai/artifact/")) throw new Error(`preview link left in: ${p}`);
  }
  console.log(`built ${pages.length} pages into /site`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});

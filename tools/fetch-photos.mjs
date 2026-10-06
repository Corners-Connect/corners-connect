/**
 * Pulls freely-licensed photos from Wikimedia and prints the two blocks that go
 * into app/photos.js: the base64 map and the credit list.
 *
 *   node tools/fetch-photos.mjs mundaka ibiza
 *
 * With no arguments it fetches everything in WANTED.
 *
 * Photos come from a named Wikipedia article's lead image rather than a Commons
 * keyword search. A search for "Picos de Europa" happily returned a photo of
 * Monte Rosa, in Switzerland; an article's own image is about that article. Every
 * file still has to pass `must`, a word its filename has to contain, and carry a
 * free licence. Author and licence are kept, which is the condition of use.
 */
import { setTimeout as sleep } from "node:timers/promises";

const UA = "CornersStudentProject/1.0 (student company prototype; contact via github.com/Corners-Connect)";

/**
 * id -> { wiki + lang: the article whose lead image to take, search: a Commons
 * fallback, must: filename has to contain one of these }. `must` carries the
 * landmark names too, because an article's lead image is often named after what
 * is in the frame rather than the place: Santander's is the Magdalena Palace and
 * the one for the Picos de Europa is Picu Urriellu.
 */
const WANTED = {
  mundaka: { wiki: "Mundaka", lang: "en", search: "Mundaka Urdaibai estuary", must: ["mundaka"] },
  ibiza: { wiki: "Ibiza", lang: "en", search: "Ibiza Dalt Vila old town", must: ["ibiza", "eivissa"] },
  vitoria: { wiki: "Vitoria-Gasteiz", lang: "en", must: ["vitoria", "gasteiz"] },
  santander: { wiki: "Santander, Spain", lang: "en", must: ["santander", "magdalena"] },
  logrono: { wiki: "Logroño", lang: "en", must: ["logro"] },
  biarritz: { wiki: "Biarritz", lang: "en", search: "Biarritz grande plage", must: ["biarritz"] },
  picos: { wiki: "Picos de Europa", lang: "en", must: ["picos", "urriellu", "bulnes"] },
  ribera_market: { wiki: "Mercado de la Ribera", lang: "es", must: ["ribera"] },
  /* No article leads with a surf lesson, so these are search-only. They have to be
     Basque beaches: a surf school card for Sopelana illustrated with Morocco is a
     picture of somewhere else. */
  surf_lesson: { search: "surfing Zarautz", must: ["zarautz"] },
  surf_wave: { search: "surfing Zarautz", must: ["zarautz"], nth: 1 }
};

const FREE = /^(CC0|CC BY|CC BY-SA|Public domain|PDM)/i;
/* Articles about a place often lead with its flag or coat of arms. Those are
   drawings of a place, not pictures of one. */
const REJECT = /(flag|coat[_ ]of[_ ]arms|escudo|bandera|map|mapa|logo|seal|location|locator)/i;
const PHOTO = /\.(jpe?g|png)$/i;

const looksRight = (title, spec) => {
  const t = title.toLowerCase();
  return PHOTO.test(t) && !REJECT.test(t) && spec.must.some((w) => t.includes(w));
};
const strip = (html) => String(html || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

async function get(url) {
  for (let attempt = 1; attempt <= 5; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (res.ok) return res;
    if (res.status === 429 || res.status >= 500) {
      await sleep(2500 * attempt);
      continue;
    }
    throw new Error(`${res.status} ${res.statusText}`);
  }
  throw new Error("gave up after 5 attempts");
}

const json = (host, params) =>
  get(`https://${host}/w/api.php?` + new URLSearchParams({ format: "json", ...params })).then((r) => r.json());

/** The file name a Wikipedia article uses as its lead image. */
async function leadImage(spec) {
  const data = await json(`${spec.lang}.wikipedia.org`, {
    action: "query",
    titles: spec.wiki,
    prop: "pageimages",
    piprop: "name"
  });
  const page = Object.values(data.query.pages)[0];
  return page && page.pageimage ? "File:" + page.pageimage : null;
}

/** Fallback for subjects no article illustrates. */
async function searchImage(spec) {
  const data = await json("commons.wikimedia.org", {
    action: "query",
    generator: "search",
    gsrsearch: "filetype:bitmap " + spec.search,
    gsrnamespace: "6",
    gsrlimit: "20",
    prop: "imageinfo",
    iiprop: "url"
  });
  const rows = Object.values((data.query && data.query.pages) || {}).filter((p) => looksRight(p.title, spec));
  return rows.length ? (rows[spec.nth || 0] || rows[0]).title : null;
}

/** Licence, author and a 1000px rendering of one Commons file. */
async function fileInfo(title) {
  const data = await json("commons.wikimedia.org", {
    action: "query",
    titles: title,
    prop: "imageinfo",
    iiprop: "url|extmetadata|size",
    iiurlwidth: process.env.PHOTO_WIDTH || "1000"
  });
  const page = Object.values(data.query.pages)[0];
  const info = page && (page.imageinfo || [])[0];
  if (!info) return null;
  const meta = info.extmetadata || {};
  return {
    url: info.thumburl || info.url,
    width: info.width,
    height: info.height,
    licence: (meta.LicenseShortName || {}).value || "",
    artist: strip((meta.Artist || {}).value) || "unknown",
    page: "https://commons.wikimedia.org/wiki/" + encodeURIComponent(title.replace(/ /g, "_"))
  };
}

async function one(id, spec) {
  /* Article lead image first; fall back to a Commons search when it is missing,
     is a flag, or is not about the place. */
  let title = spec.wiki ? await leadImage(spec) : null;
  if (title && !looksRight(title, spec)) {
    console.error(`     lead image "${title}" rejected, searching Commons instead`);
    title = null;
  }
  if (!title && spec.search) title = await searchImage(spec);
  if (!title) return { error: "no usable file found" };
  const info = await fileInfo(title);
  if (!info) return { error: "no image info for " + title };
  if (!FREE.test(info.licence)) return { error: `licence "${info.licence}" is not free enough` };
  const bytes = await get(info.url).then((r) => r.arrayBuffer());
  return {
    id,
    b64: Buffer.from(bytes).toString("base64"),
    kb: Math.round(bytes.byteLength / 1024),
    shape: info.width >= info.height ? "landscape" : "portrait",
    title: title.replace(/^File:/, ""),
    artist: info.artist,
    licence: info.licence,
    page: info.page
  };
}

const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(WANTED);
const got = [];
for (const id of ids) {
  if (!WANTED[id]) {
    console.error(`skip ${id}: not in WANTED`);
    continue;
  }
  try {
    const r = await one(id, WANTED[id]);
    if (r.error) console.error(`FAIL ${id}: ${r.error}`);
    else {
      got.push(r);
      console.error(`ok   ${id}  ${r.kb}kb  ${r.shape}  ${r.licence}  ${r.title}`);
    }
  } catch (err) {
    console.error(`FAIL ${id}: ${err.message}`);
  }
  await sleep(2500);
}

console.log("/* ---- paste into window.CORNERS_PHOTOS ---- */");
for (const r of got) console.log(`  "${r.id}": "data:image/jpeg;base64,${r.b64}",`);
console.log("/* ---- paste into CORNERS_CREDITS ---- */");
for (const r of got) {
  console.log(
    `  { id: ${JSON.stringify(r.id)}, title: ${JSON.stringify(r.title)}, artist: ${JSON.stringify(r.artist)}, ` +
    `license: ${JSON.stringify(r.licence)}, page: ${JSON.stringify(r.page)}, alt: "TODO" },`
  );
}

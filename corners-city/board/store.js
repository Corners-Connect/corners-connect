/* ───────────────────────────────────────────────────────────────────────────
   store.js — where the board keeps what you type.

   The board is an editor. The files in data/ are the truth. This file is the
   bridge, and it works in one of three modes, decided at boot:

     files      Chrome or Edge, served from localhost, and you have granted
                access to data/ once. Saving writes the real files. Git sees
                the diff. This is the mode to use.
     download   any other browser. Saving hands you the changed files and you
                drop them into data/ yourself.
     read-only  opened with a double-click (file://). Browsers refuse to read
                a folder from there, so the board shows and does not edit.
                Run start.command and it becomes an editor.

   Nothing is ever lost to a refresh: every change is mirrored into this
   browser immediately, and offered back to you the next time you open it.
   That mirror is per-browser and private — it is a safety net, never the
   truth. The truth is the files, because the files are what the other ten
   people can see.
   ─────────────────────────────────────────────────────────────────────────── */
(function () {
"use strict";

var FILES = ["company", "people", "actions", "activity"];
var MIRROR = "dip.draft.v1";

var S = {
  mode: "readonly",
  prefix: {},        // the comment header of each file, preserved on save
  dirty: {},         // which files have unsaved changes
  dir: null,         // the granted data/ directory handle
  onchange: null
};

/* ── serialising back to the file ────────────────────────────────────────── */
/* One line per object while it fits, so a git diff reads as a change to a row
   rather than as a wall of reformatting. */
function pretty(v, indent){
  indent = indent || "";
  if (v === null || typeof v !== "object") return JSON.stringify(v);
  var flat = JSON.stringify(v);
  if (flat.length <= 96) return flat;
  var inner = indent + "  ";
  if (Array.isArray(v)){
    if (!v.length) return "[]";
    return "[\n" + v.map(function(x){ return inner + pretty(x, inner); }).join(",\n") + "\n" + indent + "]";
  }
  var ks = Object.keys(v);
  if (!ks.length) return "{}";
  return "{\n" + ks.map(function(k){
    return inner + JSON.stringify(k) + ": " + pretty(v[k], inner);
  }).join(",\n") + "\n" + indent + "}";
}

function fileText(name){
  return (S.prefix[name] || ("window.DIP = window.DIP || {};\n")) +
         "window.DIP." + name + " = " + pretty(window.DIP[name]) + ";\n";
}

/* ── the browser mirror, so a refresh never costs you work ───────────────── */
function mirror(){
  try {
    var blob = { at: new Date().toISOString(), dirty: Object.keys(S.dirty), data: {} };
    FILES.forEach(function(f){ blob.data[f] = window.DIP[f]; });
    localStorage.setItem(MIRROR, JSON.stringify(blob));
  } catch (e) { /* private window, blocked storage — the files still work */ }
}
function readMirror(){
  try { return JSON.parse(localStorage.getItem(MIRROR) || "null"); } catch (e) { return null; }
}
function clearMirror(){ try { localStorage.removeItem(MIRROR); } catch (e) {} }

/* ── remembering the folder you granted, so you grant it once ────────────── */
function idb(fn){
  return new Promise(function(res, rej){
    var r = indexedDB.open("dip-board", 1);
    r.onupgradeneeded = function(){ r.result.createObjectStore("kv"); };
    r.onerror = function(){ rej(r.error); };
    r.onsuccess = function(){
      var db = r.result, tx = db.transaction("kv", "readwrite"), q = fn(tx.objectStore("kv"));
      q.onsuccess = function(){ res(q.result); };
      q.onerror = function(){ rej(q.error); };
    };
  });
}
var putDir = function(h){ return idb(function(s){ return s.put(h, "dir"); }); };
var getDir = function(){ return idb(function(s){ return s.get("dir"); }); };

function canUseFiles(){
  return typeof window.showDirectoryPicker === "function" &&
         window.isSecureContext && location.protocol !== "file:";
}

async function grant(handle, ask){
  if (!handle) return false;
  var opts = { mode: "readwrite" };
  if ((await handle.queryPermission(opts)) === "granted") return true;
  if (!ask) return false;
  return (await handle.requestPermission(opts)) === "granted";
}

/* ── the public surface ──────────────────────────────────────────────────── */

S.init = async function(onchange){
  S.onchange = onchange;

  if (location.protocol === "file:"){ S.mode = "readonly"; return S; }

  /* Keep each file's comment header so saving never eats the documentation. */
  await Promise.all(FILES.map(async function(f){
    try {
      var t = await (await fetch("data/" + f + ".js", { cache: "no-store" })).text();
      var at = t.indexOf("window.DIP." + f);
      if (at > 0) S.prefix[f] = t.slice(0, at);
    } catch (e) { /* fall back to a minimal header */ }
  }));

  S.mode = canUseFiles() ? "download" : "download";
  if (canUseFiles()){
    var h = await getDir().catch(function(){ return null; });
    if (h && await grant(h, false)){ S.dir = h; S.mode = "files"; }
  }
  return S;
};

/* Ask once for the data/ folder. Must be called from a click. */
S.connect = async function(){
  if (!canUseFiles()) throw new Error("This browser cannot write files. Use Chrome or Edge, served from localhost.");
  var h = await window.showDirectoryPicker({ mode: "readwrite", id: "dip-data" });
  /* Make sure it really is data/, or a save would scatter files somewhere odd. */
  for (var i = 0; i < FILES.length; i++){
    try { await h.getFileHandle(FILES[i] + ".js"); }
    catch (e) { throw new Error("That folder has no " + FILES[i] + ".js in it. Choose the board's data folder."); }
  }
  if (!(await grant(h, true))) throw new Error("Permission refused.");
  S.dir = h; S.mode = "files";
  await putDir(h);
  return S.mode;
};

S.touch = function(name){
  S.dirty[name] = true;
  mirror();
  if (S.onchange) S.onchange();
};

S.isDirty = function(){ return Object.keys(S.dirty).length > 0; };
S.dirtyList = function(){ return Object.keys(S.dirty); };

S.save = async function(){
  var names = Object.keys(S.dirty);
  if (!names.length) return { written: [], mode: S.mode };

  if (S.mode === "files" && S.dir){
    if (!(await grant(S.dir, true))) throw new Error("Permission to write data/ was refused.");
    for (var i = 0; i < names.length; i++){
      var fh = await S.dir.getFileHandle(names[i] + ".js", { create: false });
      var w = await fh.createWritable();
      await w.write(fileText(names[i]));
      await w.close();
    }
  } else {
    names.forEach(function(n){
      var a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([fileText(n)], { type: "text/javascript" }));
      a.download = n + ".js";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function(){ URL.revokeObjectURL(a.href); }, 4000);
    });
  }
  S.dirty = {};
  clearMirror();
  if (S.onchange) S.onchange();
  return { written: names, mode: S.mode };
};

/* A draft left behind by the last visit. Offered, never applied silently. */
S.pending = function(){
  var m = readMirror();
  if (!m || !m.dirty || !m.dirty.length) return null;
  return { at: m.at, files: m.dirty };
};
S.restore = function(){
  var m = readMirror();
  if (!m) return false;
  FILES.forEach(function(f){
    if (!m.data[f]) return;
    var live = window.DIP[f];
    if (Array.isArray(live)){ live.length = 0; m.data[f].forEach(function(x){ live.push(x); }); }
    else { Object.keys(live).forEach(function(k){ delete live[k]; });
           Object.keys(m.data[f]).forEach(function(k){ live[k] = m.data[f][k]; }); }
  });
  m.dirty.forEach(function(f){ S.dirty[f] = true; });
  if (S.onchange) S.onchange();
  return true;
};
S.discard = function(){ clearMirror(); };

window.STORE = S;

window.addEventListener("beforeunload", function(e){
  if (S.isDirty()){ e.preventDefault(); e.returnValue = ""; }
});

})();

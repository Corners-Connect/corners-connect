/* ───────────────────────────────────────────────────────────────────────────
   forms.js — the part that makes this a tool instead of a document.

   Every screen has Add and Edit buttons; they open one of the forms below.
   Nothing here decides anything for you. It only refuses the entries that
   would make a screen lie, and it refuses them for the same reasons check.py
   does — so the board cannot be fed something its own checker would reject.
   ─────────────────────────────────────────────────────────────────────────── */
(function () {
"use strict";

var U;                         /* board helpers, wired up in F.init */
function D(){ return window.DIP; }
function esc(s){ return String(s == null ? "" : s)
  .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }

/* ── option lists ────────────────────────────────────────────────────────── */
function peopleOpts(){ return D().people.map(function(p){ return [p.id, U.personName(p.id)]; }); }
function teamOpts(){ return D().company.teams.map(function(t){ return [t.id, t.name]; }); }

function compOpts(){ return D().company.competences.map(function(c){ return [c.id, c.id + " · " + c.text]; }); }
function sessionOpts(fromToday){
  return U.sessions().filter(function(s){ return !fromToday || s.d >= U.TODAY; })
    .map(function(s){ return [s.date, "Session " + s.n + " · " + U.pretty(s.date)]; });
}
function actionOpts(){
  return [["", "— not on the board —"]].concat(
    D().actions.filter(function(a){ return a.state !== "dropped"; })
      .map(function(a){ return [a.id, a.id + " · " + a.what.slice(0, 54)]; }));
}

/* ── what each kind of row is made of ────────────────────────────────────── */
var SPEC = {

  action: {
    file: "actions", title: "Action", collection: function(){ return D().actions; },
    lead: "One sentence, starting with a verb, that somebody who was not in the room could check.",
    fields: [
      { k:"what", label:"What", type:"textarea", required:true },
      { k:"owner", label:"Owner", type:"select", options:peopleOpts, required:true,
        hint:"One name. Never two, never a team — an action everybody owns is an action nobody owns." },
      { k:"team", label:"Team", type:"select", options:teamOpts, required:true },
      { k:"state", label:"Step of the loop", type:"select",
        options:function(){ return [["planned","PLAN · planned"],["doing","DO · doing"],
          ["check","CHECK · finished, not looked at yet"],["done","ACT · checked and kept"],
          ["dropped","ACT · checked and stopped"]]; } },
      { k:"expect", label:"What we expect from it", type:"textarea",
        hint:"Optional, and it is the P of PDCA: “If we do this, then ___, because ___.” Write it before you start or not at all — written afterwards it is not a prediction." },
      { k:"result", label:"What actually happened", type:"textarea",
        hint:"Written at CHECK. If there is an expectation above, this is required before it can be done — you do not get to skip the comparison you asked for." },
      { k:"estimate", label:"Estimate, in hours", type:"number", step:"0.5", min:"0",
        hint:"Guess. A wrong estimate written down beats a right one you did not write." },
      { k:"due", label:"Due", type:"select", options:function(){ return sessionOpts(false); }, required:true },
      { k:"evidence", label:"Evidence", type:"text", hint:"A link or a filename. Required before done." },
      { k:"shipped", label:"Somebody outside this room can see or use it", type:"bool" },
      { k:"note", label:"Note", type:"text", hint:"Why it was dropped, what it waits on. One line." }
    ],
    make: function(){ return { id: nextId("A-", D().actions), what:"", owner:"", team:"",
      state:"planned", estimate:1, due:"", opened:U.todayIso(), touched:U.todayIso(),
      expect:"", result:"", evidence:"", shipped:false, note:"" }; },
    clean: function(v){ v.touched = U.todayIso(); return v; },
    check: function(v){
      if (v.state === "done" && !String(v.evidence||"").trim())
        return "Done needs evidence — a link or a filename. Done means somebody else can check it.";
      if (v.shipped && !String(v.evidence||"").trim())
        return "Shipped needs evidence. Somebody outside this room has to be able to see it.";
      if (v.shipped && v.state !== "done") return "Shipped but not done. Pick one.";
      if ((v.state === "planned" || v.state === "doing") && !(+v.estimate > 0))
        return "An open action needs an estimate above zero. Guess.";
      if (v.state === "dropped" && !String(v.note||"").trim() && !String(v.result||"").trim())
        return "Say why it was dropped. In three weeks nobody will remember it the same way.";
      var exp = String(v.expect||"").trim();
      if (exp && exp.toLowerCase().indexOf("because") < 0)
        return "An expectation with no “because” is a plan, not a prediction. Say why you think so — or leave it empty.";
      if (exp && (v.state === "done" || v.state === "dropped") && !String(v.result||"").trim())
        return "You wrote what you expected. Write what happened — that comparison is the only reason the expectation was worth writing.";
      return null;
    }
  },

  activity: {
    file: "activity", title: "Activity", collection: function(){ return D().activity; },
    lead: "What you did, on the day you did it. Hours are optional — an entry with no hours is worth more than an hour nobody can point at.",
    fields: [
      { k:"person", label:"Who", type:"select", options:peopleOpts, required:true },
      { k:"what", label:"What you did", type:"text", required:true,
        hint:"Past tense, and specific. “Wrote the three decision rules”, not “worked on the Manual”." },
      { k:"action", label:"On which action", type:"select", options:actionOpts,
        hint:"Optional. Plenty of real work is not on the board." },
      { k:"hours", label:"Hours", type:"number", step:"0.25", min:"0",
        hint:"Optional. Fill it in and the cash flow works." },
      { k:"date", label:"Day", type:"date", required:true }
    ],
    make: function(){ return { date:U.todayIso(), person:"", what:"", action:null, hours:0, source:"typed" }; },
    clean: function(v){ if (v.action === "") v.action = null; if (!v.source) v.source = "typed"; return v; },
    check: function(v){
      if (+v.hours < 0) return "Hours cannot be negative.";
      if (+v.hours > 12) return "More than twelve hours in one entry. Split it, or it is a week remembered as a day.";
      if (v.date > U.todayIso()) return "That day has not happened yet.";
      return null;
    }
  },

  person: {
    file: "people", title: "Person", collection: function(){ return D().people; },
    lead: "First name only. No email, no phone, no id number — those live in Teams.",
    fields: [
      { k:"name", label:"Name", type:"text", required:true },
      { k:"team", label:"Team", type:"select", options:teamOpts, required:true },
      { k:"hat", label:"Second hat", type:"select", options:function(){
          return [["","— none —"],["liaison","liaison · carries what one team learns into the other two"],
                  ["record","record · keeps the session record"]]; } },
      { k:"capacity", label:"Hours in a normal week", type:"number", step:"0.5", min:"0", required:true,
        hint:"An honest small number beats an aspirational big one. The whole Hours screen divides by this." }
    ],
    make: function(){ return { id: nextId("p", D().people, 2), name:"", team:"", hat:null,
      capacity:4, away:[], mastery:[] }; },
    clean: function(v){ if (v.hat === "") v.hat = null; return v; },
    check: function(v){
      if (/[\w.+-]+@[\w-]+\.[\w.]+/.test(v.name)) return "That is an email address. Those live in Teams, never here.";
      if (!(+v.capacity > 0)) return "Capacity must be above zero.";
      if (v.hat === "liaison" && D().people.some(function(p){ return p.hat === "liaison" && p.id !== v.id; }))
        return "There is already a liaison. It is one hat — two is the expensive rung nobody chose.";
      return null;
    }
  },

  company: {
    file: "company", title: "The company", collection: null,
    lead: "Four times a term, no more.",
    fields: [
      { k:"name", label:"Name", type:"text" },
      { k:"purpose", label:"Purpose, in one sentence", type:"textarea",
        hint:"Every other line on this board is measured against it." },
      { k:"sample", label:"Still showing sample data", type:"bool",
        hint:"Untick once the rows are yours. The stamp disappears." },
      { k:"unit", label:"Unit", type:"text", hint:"hours. There is no money in this course." }
    ],
    make: null
  },

  objective: {
    file: "company", title: "Block objective", collection: null, sub: "blockObjective",
    lead: "One per block, four all term, set by whoever carries the company through it.",
    fields: [
      { k:"block", label:"Block", type:"number", min:"1", max:"4" },
      { k:"text", label:"The objective", type:"textarea", required:true },
      { k:"owner", label:"Carried by", type:"text", required:true }
    ],
    make: null
  }
};

function nextId(prefix, list, pad){
  var n = 0;
  list.forEach(function(x){
    var m = String(x.id||"").match(/(\d+)$/);
    if (m) n = Math.max(n, parseInt(m[1], 10));
  });
  return prefix + String(n + 1).padStart(pad || 3, "0");
}

/* ── the sheet ───────────────────────────────────────────────────────────── */

var sheet, lastFocus;

function field(f, val){
  var id = "f_" + f.k, h = '<label class="fld" for="'+id+'"><span>'+esc(f.label)+
    (f.required ? ' <i>required</i>' : '')+'</span>';
  var v = val == null ? "" : val;
  if (f.type === "textarea"){
    h += '<textarea id="'+id+'" name="'+f.k+'" rows="3">'+esc(v)+'</textarea>';
  } else if (f.type === "select"){
    var o = (typeof f.options === "function" ? f.options() : f.options);
    h += '<select id="'+id+'" name="'+f.k+'">';
    if (!o.some(function(x){ return x[0] === ""; }) && !f.required) h += '<option value="">—</option>';
    o.forEach(function(x){
      h += '<option value="'+esc(x[0])+'"'+(String(x[0]) === String(v) ? " selected" : "")+'>'+esc(x[1])+'</option>';
    });
    h += '</select>';
  } else if (f.type === "bool"){
    h += '<span class="chk"><input type="checkbox" id="'+id+'" name="'+f.k+'"'+(v ? " checked" : "")+
         '><label for="'+id+'">yes</label></span>';
  } else {
    var t = f.type === "number" ? "number" : (f.type === "date" ? "date" : "text");
    h += '<input type="'+t+'" id="'+id+'" name="'+f.k+'" value="'+esc(v)+'"'+
      (f.step ? ' step="'+f.step+'"' : '')+(f.min != null ? ' min="'+f.min+'"' : '')+
      (f.max != null ? ' max="'+f.max+'"' : '')+'>';
  }
  if (f.hint) h += '<em>'+esc(f.hint)+'</em>';
  return h + '</label>';
}

function open(kind, id, prefill){
  var sp = SPEC[kind];
  if (!sp) return;
  var list = sp.collection ? sp.collection() : null;
  var target = sp.sub ? D().company[sp.sub]
             : (list ? (id ? list.filter(function(x){ return x.id === id; })[0]
                           : (typeof id === "number" ? list[id] : null))
                     : D().company);
  var creating = !target;
  if (creating){
    if (!sp.make) return;
    target = sp.make();
  }
  /* A prefill comes from a row: “log hours on THIS action”, “mark THIS done”.
     It is shown in the form and still has to be confirmed — nothing is written
     because somebody clicked. */
  var pre = prefill ? Object.assign({}, target, prefill) : target;

  var h = '<h2 id="dipSheetTitle">'+(creating ? "New " : "")+esc(sp.title)+
          (target.id && !creating ? ' <span class="pill pill--flat">'+esc(target.id)+'</span>' : '')+'</h2>';
  if (sp.lead) h += '<p class="sheet__lead">'+esc(sp.lead)+'</p>';
  h += '<form id="dipForm" novalidate>';
  sp.fields.forEach(function(f){ h += field(f, pre[f.k]); });
  h += '<p class="err" id="dipErr" hidden></p>';
  h += '<div class="sheet__acts">';
  h += '<button type="submit" class="btn btn--primary">'+(creating ? "Add it" : "Save")+'</button>';
  h += '<button type="button" class="btn btn--ghost" data-x>Cancel</button>';
  if (!creating && list && kind !== "company")
    h += '<button type="button" class="btn btn--danger" data-del>Delete</button>';
  h += '</div></form>';

  show(h, function(form){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var v = {};
      sp.fields.forEach(function(f){
        var el = form.elements[f.k];
        if (!el) return;
        if (f.type === "bool") v[f.k] = el.checked;
        else if (f.type === "number"){
          var raw = String(el.value).trim();
          v[f.k] = raw === "" ? (f.nullable ? null : 0) : Number(raw);
        } else v[f.k] = el.value;
      });
      var missing = sp.fields.filter(function(f){
        return f.required && (v[f.k] === "" || v[f.k] === null || v[f.k] === undefined); });
      if (missing.length) return err(form, missing[0].label + " is required.");
      var merged = Object.assign({}, target, v);
      if (sp.clean) merged = sp.clean(merged);
      var bad = sp.check ? sp.check(merged) : null;
      if (bad) return err(form, bad);

      Object.keys(merged).forEach(function(k){ target[k] = merged[k]; });
      if (creating) list.push(target);
      window.STORE.touch(sp.file);
      close();
      window.BOARD.render();
    });
    var del = form.querySelector("[data-del]");
    if (del) del.addEventListener("click", function(){
      var what = kind === "action"
        ? "Delete this action? Dropping it instead keeps the history — deleting erases that it ever existed."
        : "Delete this row? It cannot be undone from here.";
      if (!confirm(what)) return;
      var i = list.indexOf(target);
      if (i >= 0) list.splice(i, 1);
      window.STORE.touch(sp.file);
      close();
      window.BOARD.render();
    });
  });
}

function err(form, msg){
  var e = form.querySelector("#dipErr");
  e.textContent = msg; e.hidden = false; e.scrollIntoView({ block:"nearest" });
}

/* ── mastery, claimed in one click from the grid ─────────────────────────── */

function claim(personId, compId){
  var p = D().people.filter(function(x){ return x.id === personId; })[0];
  if (!p) return;
  var cur = 0;
  (p.mastery||[]).forEach(function(m){ if (m.c === compId) cur = Math.max(cur, +m.level||0); });
  var comp = D().company.competences.filter(function(c){ return c.id === compId; })[0] || { text:"" };

  var h = '<h2 id="sheetTitle">'+esc(U.personName(personId))+' · '+esc(compId)+'</h2>';
  h += '<p class="sheet__lead">'+esc(comp.text)+'</p>';
  h += '<form id="dipForm" novalidate>';
  h += '<label class="fld"><span>Level</span><select name="level">'+
       [[0,"0 · not touched"],[1,"1 · I have seen it done"],
        [2,"2 · I have done it — a deliverable carries my name"],
        [3,"3 · I taught it and they did it — their deliverable is the proof"]]
       .map(function(o){ return '<option value="'+o[0]+'"'+(o[0]===cur?' selected':'')+'>'+esc(o[1])+'</option>'; }).join("")+
       '</select><em>Level 2 is what USAC requires. Level 3 is what this company requires of itself.</em></label>';
  h += '<label class="fld"><span>Proof <i>required above level 1</i></span>'+
       '<input type="text" name="proof" placeholder="a link or a filename"></label>';
  h += '<p class="err" id="dipErr" hidden></p>';
  h += '<div class="sheet__acts"><button type="submit" class="btn btn--primary">Record it</button>'+
       '<button type="button" class="btn btn--ghost" data-x>Cancel</button></div></form>';

  show(h, function(form){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var lvl = Number(form.elements.level.value), proof = (form.elements.proof.value||"").trim();
      if (lvl >= 2 && !proof) return err(form, "Above level 1 a claim needs something behind it. A link or a filename.");
      p.mastery = p.mastery || [];
      p.mastery.push({ c: compId, level: lvl, on: U.todayIso(), proof: proof });
      window.STORE.touch("people");
      close();
      window.BOARD.render();
    });
  });
}

/* ── the shell ───────────────────────────────────────────────────────────── */

function show(html, wire){
  lastFocus = document.activeElement;
  sheet.querySelector(".sheet").innerHTML = html;
  sheet.hidden = false;
  document.body.style.overflow = "hidden";
  var form = sheet.querySelector("#dipForm");
  sheet.querySelectorAll("[data-x]").forEach(function(b){ b.addEventListener("click", close); });
  if (wire && form) wire(form);
  var first = sheet.querySelector("input,select,textarea,button");
  if (first) first.focus();
}
function close(){
  sheet.hidden = true;
  sheet.querySelector(".sheet").innerHTML = "";
  document.body.style.overflow = "";
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}

var F = {
  init: function(util){
    U = util;
    sheet = document.getElementById("sheet");
    sheet.addEventListener("click", function(e){ if (e.target === sheet) close(); });
    document.addEventListener("keydown", function(e){ if (e.key === "Escape" && !sheet.hidden) close(); });
    /* One delegated listener for every Add / Edit button on every screen. */
    document.addEventListener("click", function(e){
      var b = e.target.closest("[data-edit]");
      if (b){ e.preventDefault(); open(b.dataset.edit, b.dataset.id || null); return; }
      var c = e.target.closest("[data-claim]");
      if (c){ e.preventDefault(); claim(c.dataset.person, c.dataset.claim); }
    });
  },
  open: open, claim: claim, close: close
};
window.FORMS = F;

})();

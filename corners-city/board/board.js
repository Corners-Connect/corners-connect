/* ───────────────────────────────────────────────────────────────────────────
   board.js — the engine. You should never need to open this file.

   Rule of the house: NOTHING here is written by hand. Every count, every
   balance, every warning is calculated from data/. A number you can type is a
   number that goes stale, and a stale number is worse than no number because it
   still looks like evidence.
   ─────────────────────────────────────────────────────────────────────────── */
(function () {
"use strict";

/* These point at the live arrays. Everything that edits them mutates in
   place — never reassigns — so these references stay valid all session. */
var D, CO, PEOPLE, ACTIONS, ACTIVITY;
var TODAY, UNIT, SAMPLE, THIS_WEEK, SESSIONS, LAST_SESSION, MILESTONES, NEXT, BY_ID, SPENT;
var STATES = ['planned','doing','check','done','dropped'];

/* The eleven tones of Corner at L 0.42 — identical lightness, identical chroma,
   32.7° apart, which is the brand's thesis measured. On paper they run 6.8 to
   8.1 against the page, so unlike the dark version they can carry text as well
   as dots and bars. */
var HUES = ["#802D35","#7C3600","#6A4500","#4B5400","#075D26","#006051",
            "#005B73","#005088","#42438A","#623779","#772E5B"];

/* ── 1 · small tools ─────────────────────────────────────────────────────── */

function esc(s){ return String(s == null ? "" : s)
  .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }

/* Parse at local noon so a timezone never shifts a date by a day. */
function day(iso){ if(!iso) return null; var p=String(iso).split("-");
  return new Date(+p[0], +p[1]-1, +p[2], 12, 0, 0); }
function iso(d){ return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
function pretty(isoStr){ var d=day(isoStr); if(!d) return "—";
  return d.toLocaleDateString("en-GB",{day:"numeric",month:"short"}); }
function days(a,b){ return Math.round((b-a)/86400000); }
function mondayOf(d){ var x=new Date(d); var k=(x.getDay()+6)%7; x.setDate(x.getDate()-k); x.setHours(12,0,0,0); return x; }
function num(n){ return (Math.round(n*10)/10).toLocaleString("en-GB"); }
function pct(a,b){ return b>0 ? Math.round(a/b*100) : 0; }
function clamp(n,lo,hi){ return Math.max(lo, Math.min(hi, n)); }



/* Rebuilt from the live data before every render, because the board is an
   editor: anything you type has to be in the next number you read. */
function recompute(){
  D = window.DIP || {};
  CO = D.company || {}; PEOPLE = D.people || []; ACTIONS = D.actions || [];
  ACTIVITY = D.activity || [];

  TODAY = CO.today ? day(CO.today) : (function(){ var n = new Date(); n.setHours(12,0,0,0); return n; })();
  UNIT = CO.unit || "hours";
  SAMPLE = CO.sample !== false;
  THIS_WEEK = iso(mondayOf(TODAY));

  SESSIONS = (CO.calendar || []).filter(function(c){ return c.n != null; })
    .map(function(c){ return { n:c.n, date:c.date, d:day(c.date) }; })
    .sort(function(a,b){ return a.d - b.d; });
  LAST_SESSION = SESSIONS.filter(function(s){ return s.d <= TODAY; }).pop() || null;

  MILESTONES = (CO.milestones || []).map(function(m){
    return { id:m.id, name:m.name, session:m.session, date:m.date, d:day(m.date) }; });
  NEXT = MILESTONES.filter(function(m){ return m.d >= TODAY; })[0] || null;

  BY_ID = {};
  PEOPLE.forEach(function(p,i){ p._hue = HUES[i % HUES.length]; p._i = i; BY_ID[p.id] = p; });

  SPENT = {};
  ACTIVITY.forEach(function(e){
    if (e.action) SPENT[e.action] = (SPENT[e.action]||0) + (+e.hours||0);
  });
}

/* ── 2 · the calendar, which is this company's real clock ────────────────── */

function sessionsBetween(from, to){
  return SESSIONS.filter(function(s){ return s.d > from && s.d <= to; }).length;
}
/* The working weeks that still contain a session between now and a date.
   Capacity is declared per week, so this is what the company can still spend —
   except that the week you are standing in is already partly gone, so it counts
   only from today onwards. Without that, the board hands you up to a whole
   week of hours you have already used, and the overdraft warning arrives late. */
function remainingWeekFactor(){ return (7 - ((TODAY.getDay()+6)%7)) / 7; }
function weeksTo(to){
  var seen = {}, out = [];
  SESSIONS.forEach(function(s){
    if (s.d > TODAY && s.d <= to){
      var k = iso(mondayOf(s.d));
      if(!seen[k]){ seen[k] = 1; out.push({ week:k, factor: k === THIS_WEEK ? remainingWeekFactor() : 1 }); }
    }
  });
  return out;
}

/* ── 3 · people, hours in ────────────────────────────────────────────────── */

function personName(id){ var p=BY_ID[id]; return p ? (p.name && p.name !== "—" ? p.name : p.id) : id; }
function personHue(id){ var p=BY_ID[id]; return p ? p._hue : "#D6C3B4"; }

/* Capacity of one person in the week starting `weekIso` — their normal week
   unless they declared themselves away. */
function capacityIn(p, weekIso){
  var away = (p.away||[]).filter(function(a){ return a.week === weekIso; })[0];
  return away ? (+away.capacity || 0) : (+p.capacity || 0);
}
function capacityWeek(weekIso){
  return PEOPLE.reduce(function(t,p){ return t + capacityIn(p, weekIso); }, 0);
}
function availableTo(to){
  return weeksTo(to).reduce(function(t,w){ return t + capacityWeek(w.week) * w.factor; }, 0);
}

/* ── 4 · actions, hours out ──────────────────────────────────────────────── */

/* Still on the board: planned, doing and check. An action in CHECK is finished
   work waiting to be looked at — it is not closed, but it owes no more hours,
   which is why owing and open are two different sets. */
var OPEN_STATES  = { planned:1, doing:1, check:1 };
var OWING_STATES = { planned:1, doing:1 };
function spentOn(a){ return SPENT[a.id] || 0; }
function remainingOn(a){ return OWING_STATES[a.state] ? Math.max(0, (+a.estimate||0) - spentOn(a)) : 0; }
function isOpen(a){ return !!OPEN_STATES[a.state]; }
function inCheck(a){ return a.state === "check"; }

/* Committed = what is still owed on everything promised before a date. This is
   the company's accounts payable, and it is the number that ends student
   companies, because nobody adds it up until the week before. */
function committedTo(to){
  return ACTIONS.filter(function(a){ return isOpen(a) && a.due && day(a.due) <= to; })
                .reduce(function(t,a){ return t + remainingOn(a); }, 0);
}

function inWeek(isoStr, weekIso){
  if(!isoStr) return false;
  return iso(mondayOf(day(isoStr))) === weekIso;
}
function spentInWeek(weekIso, personId){
  return ACTIVITY.filter(function(e){
    return inWeek(e.date, weekIso) && (!personId || e.person === personId);
  }).reduce(function(t,e){ return t + (+e.hours||0); }, 0);
}
function didInWeek(weekIso, personId){
  return ACTIVITY.filter(function(e){
    return inWeek(e.date, weekIso) && (!personId || e.person === personId);
  }).length;
}

/* ── 5 · the three numbers, calculated ───────────────────────────────────── */

function weekNumbers(weekIso){
  var due = ACTIONS.filter(function(a){ return a.state !== "dropped" && inWeek(a.due, weekIso); });
  var kept = due.filter(function(a){ return a.state === "done"; });
  var moved = 0;
  PEOPLE.forEach(function(p){ (p.mastery||[]).forEach(function(m){ if(inWeek(m.on, weekIso) && (+m.level)>=2) moved++; }); });
  var shipped = ACTIONS.filter(function(a){ return a.shipped === true && a.state === "done" && inWeek(a.touched, weekIso); });
  /* Shipping is reported work, not logged hours: somebody who wrote what they
     did and left the hours blank still shipped. */
  var movers = {};
  ACTIVITY.forEach(function(e){ if(inWeek(e.date, weekIso)) movers[e.person]=1; });
  ACTIONS.forEach(function(a){ if(a.state==="done" && inWeek(a.touched, weekIso)) movers[a.owner]=1; });
  return { made:due.length, kept:kept.length, moved:moved, shipped:shipped,
           movers:Object.keys(movers).length };
}

/* ── 6 · the loop, counted ───────────────────────────────────────────────── */

function laneCount(){
  var n = { planned:0, doing:0, check:0, done:0, dropped:0 };
  ACTIONS.forEach(function(a){ if (n[a.state] !== undefined) n[a.state]++; });
  return n;
}
/* An action that was given an expectation and never got a result is the one
   that turns this board back into a to-do list, so it is counted separately. */
function unchecked(){
  return ACTIONS.filter(function(a){
    return String(a.expect||"").trim() && !String(a.result||"").trim() &&
           (a.state === "check" || a.state === "done");
  });
}

/* ── 7 · mastery ─────────────────────────────────────────────────────────── */

function levelOf(p, cid){
  var best = 0;
  (p.mastery||[]).forEach(function(m){ if(m.c === cid) best = Math.max(best, +m.level||0); });
  return best;
}
function masteryGaps(){
  var untouched = [], single = [], noThree = [];
  (CO.competences||[]).forEach(function(c){
    var able = PEOPLE.filter(function(p){ return levelOf(p, c.id) >= 2; });
    if (able.length === 0) untouched.push(c);
    else if (able.length === 1) single.push({ c:c, who:able[0] });
  });
  PEOPLE.forEach(function(p){
    var has3 = (CO.competences||[]).some(function(c){ return levelOf(p, c.id) >= 3; });
    if (!has3) noThree.push(p);
  });
  return { untouched:untouched, single:single, noThree:noThree };
}

/* ── 8 · alarms — the whole point of the Today screen ────────────────────── */

function alarms(){
  var out = [];

  ACTIONS.filter(inCheck).forEach(function(a){
    out.push({ k:"Waiting on a check", hot:true,
      t: esc(a.what),
      e: personName(a.owner) + " finished it. " + (String(a.expect||"").trim()
           ? "It was done with something expected of it, so the check is a comparison, not a nod."
           : "Look at it and either keep it or drop it — both are decisions."),
      act: '<button class="btn btn--ghost btn--sm" data-edit="action" data-id="'+esc(a.id)+'">Check it</button>' });
  });

  unchecked().filter(function(a){ return a.state === "done"; }).forEach(function(a){
    out.push({ k:"Never compared", hot:false,
      t: esc(a.what),
      e: "It was closed with an expectation written and no result next to it. That is the " +
         "difference between a company that learns and one that is just busy.",
      act: '<button class="btn btn--ghost btn--sm" data-edit="action" data-id="'+esc(a.id)+'">Write it</button>' });
  });

  ACTIONS.filter(function(a){ return isOpen(a) && a.due && day(a.due) < TODAY; })
    .sort(function(a,b){ return day(a.due) - day(b.due); })
    .forEach(function(a){
      out.push({ k:"Overdue", hot:true,
        t: esc(a.what),
        e: personName(a.owner) + " · promised for " + pretty(a.due) + " · " + num(remainingOn(a)) + " " + UNIT + " still owed",
        act: '<button class="btn btn--ghost btn--sm" data-edit="action" data-id="'+esc(a.id)+'">Open it</button>' });
    });

  ACTIONS.filter(function(a){ return isOpen(a) && a.touched && days(day(a.touched), TODAY) >= 14; })
    .forEach(function(a){
      out.push({ k:"Stuck " + days(day(a.touched), TODAY) + " days", hot:false,
        t: esc(a.what),
        e: "Question four of the close: move it, change it, or drop it. Nobody failed here — the commitment may simply not be worth anything.",
        act: '<a class="btn btn--ghost btn--sm" href="#close">Take it to the close</a>' });
    });

  /* Quiet means nothing REPORTED, not no hours: somebody who wrote what they
     did and left the hours blank is not quiet. */
  var quiet = PEOPLE.filter(function(p){
    return didInWeek(THIS_WEEK, p.id) === 0 &&
      !ACTIONS.some(function(a){ return a.owner===p.id && a.state==="done" && inWeek(a.touched, THIS_WEEK); });
  });
  if (quiet.length && PEOPLE.length){
    out.push({ k:"Quiet this week", hot: quiet.length > PEOPLE.length/2,
      t: quiet.length + " of " + PEOPLE.length + " have reported nothing since " + pretty(THIS_WEEK),
      e: quiet.map(function(p){ return personName(p.id); }).join(" · ") +
         " — this is the motivation number, and it is a count of people, not a mood.",
      act: '<a class="btn btn--ghost btn--sm" href="#activity">Report it</a>' });
  }

  if (NEXT){
    var over = committedTo(NEXT.d) - availableTo(NEXT.d);
    if (over > 0){
      out.push({ k:"Overdrawn", hot:true,
        t: num(over) + " " + UNIT + " more promised than the company has before " + esc(NEXT.name),
        e: "Three ways out and only three: drop something, move something past the date, or somebody finds more hours. Deciding now is free; deciding in the last week is not.",
        act: '<a class="btn btn--ghost btn--sm" href="#cash">See the runway</a>' });
    }
  }

  var g = masteryGaps();
  if (g.single.length){
    out.push({ k:"Single point", hot:false,
      act: '<a class="btn btn--ghost btn--sm" href="#mastery">Open the grid</a>',
      t: g.single.length + " competence" + (g.single.length>1?"s are":" is") + " held by exactly one person",
      e: g.single.slice(0,4).map(function(s){ return s.c.id + " (" + personName(s.who.id) + ")"; }).join(" · ") +
         (g.single.length>4 ? " · and " + (g.single.length-4) + " more" : "") +
         " — if that person is ill in November, the company loses the skill." });
  }

  return out;
}

/* ── 9 · small render helpers ────────────────────────────────────────────── */

function kpi(label, value, foot, tone){
  return '<div class="card kpi'+(tone ? ' kpi--'+tone : '')+'">'+
    '<span class="kpi__label">'+esc(label)+'</span>'+
    '<span class="kpi__value">'+value+'</span>'+
    (foot ? '<span class="kpi__foot">'+foot+'</span>' : '')+'</div>';
}
function bar(parts, total){
  return '<div class="bar">'+parts.map(function(p){
    var w = total > 0 ? clamp(p.v/total*100, 0, 100) : 0;
    return '<i style="width:'+w.toFixed(2)+'%;background:'+p.c+'"></i>';
  }).join("")+'</div>';
}
function who(id){
  return '<span class="who"><i style="background:'+personHue(id)+'"></i>'+esc(personName(id))+'</span>';
}
function statePill(a){
  if (a.state === "done")    return '<span class="pill pill--ok">done</span>';
  if (a.state === "dropped") return '<span class="pill pill--flat">dropped</span>';
  if (a.due && day(a.due) < TODAY) return '<span class="pill pill--bad">overdue</span>';
  if (a.state === "doing")   return '<span class="pill pill--info">doing</span>';
  return '<span class="pill pill--flat">planned</span>';
}
function head(kicker, title, sub, action){
  return '<header class="page-head"><div class="rule"></div>'+
    '<div class="page-head__row"><div>'+
    '<div class="kicker">'+esc(kicker)+'</div><h1>'+esc(title)+'</h1>'+
    (sub ? '<p class="sub">'+sub+'</p>' : '')+
    '</div>'+(action||"")+'</div></header>';
}
function sec(title, note){
  return '<div class="sec"><h2>'+esc(title)+'</h2>'+
    (note ? '<span class="card__note">'+note+'</span>' : '')+'</div>';
}
function none(msg){ return '<div class="card"><p class="tbl__empty" style="padding:'+
  'var(--s-5);margin:0">'+esc(msg)+'</p></div>'; }
function opts(list, cur, blank){
  var h = blank ? '<option value="">'+esc(blank)+'</option>' : "";
  list.forEach(function(o){
    h += '<option value="'+esc(o[0])+'"'+(String(o[0]) === String(cur) ? " selected" : "")+'>'+esc(o[1])+'</option>';
  });
  return h;
}
function peopleOpts(){ return PEOPLE.map(function(p){ return [p.id, personName(p.id)]; }); }
function teamOpts(){ return (CO.teams||[]).map(function(t){ return [t.id, t.name]; }); }
function sessionOpts(future){
  return SESSIONS.filter(function(s){ return !future || s.d >= TODAY; })
    .map(function(s){ return [s.date, "S" + s.n + " · " + pretty(s.date)]; });
}
function openActionOpts(){
  return ACTIONS.filter(function(a){ return a.state !== "dropped"; })
    .map(function(a){ return [a.id, a.id + " · " + a.what.slice(0, 48)]; });
}

/* ── 10 · TODAY — the decision surface ───────────────────────────────────── */

function scrToday(){
  var wk = weekNumbers(THIS_WEEK);
  var av = NEXT ? availableTo(NEXT.d) : 0, cm = NEXT ? committedTo(NEXT.d) : 0;
  var left = av - cm;

  var h = head("Every session", "Today",
    'What is asking for a decision, right now. Every number is calculated, so it is the same '+
    'for all of you and nobody has to be believed.',
    '<a class="btn btn--primary" href="#close">Run the close →</a>');

  var bo = CO.blockObjective || {};
  var boSet = bo.text && bo.text !== "—";
  h += '<div class="card" style="border-left:3px solid var(--choc)">';
  h += '<div class="card__head"><span class="card__title">The block objective</span>'+
       '<button class="btn--link" data-edit="objective">edit</button></div>';
  h += '<p style="font-family:var(--serif);font-size:var(--t-2xl);line-height:1.2;margin:0 0 8px'+
       (boSet ? '' : ';color:var(--ink-4)')+'">'+
       esc(boSet ? bo.text : "No objective for this block yet, so nothing below can be judged.")+'</p>';
  h += '<p class="card__note" style="margin:0">Block '+esc(bo.block||"—")+' · carried by '+
       esc(bo.owner||"—")+'. The one you did not set: <b style="color:var(--ink-2)">'+
       esc(CO.inheritedObjective||"")+'</b></p></div>';

  h += sec("The next date, and what it costs");
  h += '<div class="grid g-5">';
  h += kpi("Next date", NEXT ? esc(NEXT.name) : "—",
       NEXT ? pretty(NEXT.date) + " · session " + NEXT.session : "", "text kpi--accent");
  h += kpi("Sessions left", NEXT ? sessionsBetween(TODAY, NEXT.d) : "—",
       NEXT ? days(TODAY, NEXT.d) + " days — but you only have the sessions" : "",
       NEXT && sessionsBetween(TODAY, NEXT.d) <= 2 ? "bad" : null);
  h += kpi(UNIT + " available", NEXT ? num(av) : "—", "capacity left before it");
  h += kpi(UNIT + " promised", NEXT ? num(cm) : "—", "still owed on everything due by then");
  h += kpi(left >= 0 ? "Slack" : "Overdrawn", NEXT ? num(Math.abs(left)) : "—",
       left >= 0 ? "room to take something on" : "promised more than you have",
       left < 0 ? "bad" : "ok");
  h += '</div>';

  if (NEXT){
    h += '<div class="card" style="margin-top:var(--s-4)"><div class="rows"><div class="row">'+
      '<span>To '+esc(NEXT.name)+'<small>'+pretty(NEXT.date)+'</small></span>'+
      bar([{v:Math.min(cm,av),c:"var(--choc)"},{v:Math.max(0,cm-av),c:"var(--bad)"},
           {v:Math.max(0,av-cm),c:"var(--paper-3)"}], Math.max(av,cm,1))+
      '<span>'+num(cm)+' / '+num(av)+'</span></div></div></div>';
  }

  h += sec("The three numbers, and the one that warns first",
           "week of " + pretty(THIS_WEEK));
  h += '<div class="grid g-4">';
  h += kpi("Commitments kept", wk.kept + " <small>/ " + wk.made + "</small>",
           "delivery — the half you can still act on");
  h += kpi("Moved up a level", wk.moved, "claims at level 2 or 3 this week");
  h += kpi("Out into the world", wk.shipped.length,
           wk.shipped.length ? esc(wk.shipped.map(function(a){ return a.what; }).join(" · "))
                             : "published, sent, or used by somebody outside this room");
  h += kpi("Different people shipping", wk.movers + " <small>/ " + PEOPLE.length + "</small>",
           "a count of people, never a mood", wk.movers < PEOPLE.length/2 ? "bad" : "ok");
  h += '</div>';

  var al = alarms();
  h += sec("What is asking for a decision", al.length + " open");
  if (!al.length){
    h += none("Nothing overdue, nothing stuck, nothing unchecked. Either this company is in very good shape, or nobody has fed the board this week.");
  } else {
    h += '<div class="card"><div class="alarms">';
    al.forEach(function(a){
      h += '<div class="alarm"><span class="alarm__k"><span class="pill pill--'+
           (a.hot ? "bad" : "warn")+'">'+esc(a.k)+'</span></span>'+
           '<div class="alarm__b"><p>'+a.t+'</p><em>'+a.e+'</em></div>'+
           '<div class="alarm__do">'+(a.act||"")+'</div></div>';
    });
    h += '</div></div>';
  }
  return h;
}

/* ── 11 · THE CLOSE — a screen, because it is where the work happens ─────── */

function scrClose(){
  var today = iso(TODAY);
  var next = SESSIONS.filter(function(s){ return s.d > TODAY; })[0];
  var due = ACTIONS.filter(function(a){ return isOpen(a) && a.due && a.due <= today; })
                   .sort(function(a,b){ return a.due < b.due ? -1 : 1; });

  var h = head("Every session", "The close",
    'Five minutes, four questions, and none of them judges anybody. Do it <b>in the room, '+
    'out loud, before people leave</b> — a commitment recorded on Friday from memory is a '+
    'commitment nobody actually heard anybody make.');

  h += '<form id="closeForm">';

  h += sec("1 · What we committed to bring, and what is here");
  h += sec("2 · Does it move us toward the block objective?");
  h += '<div class="card"><p style="font-family:var(--serif);font-size:var(--t-xl);margin:0">'+
       esc((CO.blockObjective||{}).text || "— no block objective set —")+'</p></div>';

  h += sec("3 · Move it, change it, or drop it",
           "All three are legitimate. Dropping a commitment that stopped being worth anything is a decision.");
  if (!due.length){
    h += none("Nothing was due on or before today. Straight to the commitments.");
  } else {
    h += '<div class="card card--flush"><div class="tbl-scroll"><table class="tbl"><thead><tr>'+
      '<th>What</th><th>Who</th><th>Due</th><th>What happened</th><th>New date</th>'+
      '<th>Evidence, or one line</th></tr></thead><tbody>';
    due.forEach(function(a, i){
      h += '<tr><td class="strong">'+esc(a.what)+'</td>';
      h += '<td>'+who(a.owner)+'</td>';
      h += '<td class="r">'+pretty(a.due)+'</td>';
      h += '<td><select class="mini" name="c'+i+'">'+
           opts([["none","leave it open"],["keep","it is here"],["move","move it"],
                 ["change","change it"],["drop","drop it"]], "none")+'</select></td>';
      h += '<td><select class="mini" name="d'+i+'">'+opts(sessionOpts(true), next ? next.date : "")+'</select></td>';
      h += '<td><input type="text" name="e'+i+'" value="'+esc(a.evidence||"")+'" placeholder="link, filename, or why"></td>';
      h += '<input type="hidden" name="id'+i+'" value="'+esc(a.id)+'"></tr>';
    });
    h += '</tbody></table></div></div>';
  }

  h += sec("4 · Anything stuck for two weeks?");
  h += '<div class="card"><p style="margin:0;color:var(--ink-3)">The Today screen lists them. '+
       'The question is never who failed — it is whether that commitment is worth anything. '+
       'Three possible answers and all three are useful: <b style="color:var(--ink-2)">the '+
       'objective was wrong</b>, <b style="color:var(--ink-2)">it was not the priority</b>, or '+
       '<b style="color:var(--ink-2)">somebody needs help and has not asked</b>.</p></div>';

  h += sec("Commitments for " + (next ? "session " + next.n + " · " + pretty(next.date) : "next session"),
           "leave a line empty and nothing is recorded for that person");
  h += '<div class="card card--flush"><div class="tbl-scroll"><table class="tbl"><thead><tr>'+
       '<th>Who</th><th>What they are bringing</th><th class="r">Hours</th></tr></thead><tbody>';
  PEOPLE.forEach(function(p, i){
    h += '<tr><td>'+who(p.id)+'</td>'+
         '<td><input type="text" name="w'+i+'" placeholder="one sentence, starting with a verb"></td>'+
         '<td style="width:96px"><input type="number" name="h'+i+'" step="0.5" min="0" placeholder="h"></td></tr>';
  });
  h += '</tbody></table></div></div>';

  h += '<p class="err" id="closeErr" hidden></p>';
  h += '<div class="sheet__acts" style="border:0;margin-top:var(--s-5)">'+
       '<button type="submit" class="btn btn--primary">Record the close</button>'+
       '<a class="btn btn--ghost" href="#today">Cancel</a></div>';
  h += '</form>';
  return h;
}

function wireClose(){
  var form = document.getElementById("closeForm");
  if (!form) return;
  var today = iso(TODAY);
  var next = SESSIONS.filter(function(s){ return s.d > TODAY; })[0];
  var due = ACTIONS.filter(function(a){ return isOpen(a) && a.due && a.due <= today; })
                   .sort(function(a,b){ return a.due < b.due ? -1 : 1; });

  form.addEventListener("submit", function(e){
    e.preventDefault();
    var F = form.elements, changed = false, added = 0, problem = null;

    due.forEach(function(a, i){
      var choice = F["c"+i].value, ev = (F["e"+i].value||"").trim(), nd = F["d"+i].value;
      if (choice === "none") return;
      changed = true;
      a.touched = today;
      if (choice === "keep"){
        if (!ev){ a.state = "doing"; a.note = "reported here, evidence still missing"; }
        else { a.state = "done"; a.evidence = ev; }
      } else if (choice === "move"){ a.due = nd || a.due; if (ev) a.note = ev; }
      else if (choice === "change"){ a.state = "doing"; a.note = ev || a.note; }
      else if (choice === "drop"){ a.state = "dropped"; a.note = ev || "dropped in the close"; }
    });

    var pending = [];
    PEOPLE.forEach(function(p, i){
      var w = (F["w"+i].value||"").trim();
      if (!w) return;
      var est = Number(F["h"+i].value);
      if (!(est > 0)){ problem = problem || ('“'+w+'” has no estimate. Guess — it is what the hours screen runs on.'); return; }
      pending.push({ p:p, w:w, est:est });
    });
    if (problem){
      var box = document.getElementById("closeErr");
      box.textContent = problem; box.hidden = false; box.scrollIntoView({ block:"center" });
      return;
    }
    pending.forEach(function(x){
      ACTIONS.push({ id: nextId("A-", ACTIONS), what: x.w, owner: x.p.id, team: x.p.team,
        cycle: null, state: "planned", estimate: x.est, due: next ? next.date : today,
        opened: today, touched: today, evidence: "", shipped: false, note: "" });
      added++;
    });

    if (changed || added) window.STORE.touch("actions");
    location.hash = "#today";
    render();
    flash((added || changed)
      ? "Close recorded — " + added + " commitment" + (added===1?"":"s") + " for next session. Save before you shut the laptop."
      : "Nothing changed.");
  });
}

function nextId(prefix, list, pad){
  var n = 0;
  list.forEach(function(x){ var m = String(x.id||"").match(/(\d+)$/); if (m) n = Math.max(n, +m[1]); });
  return prefix + String(n + 1).padStart(pad || 3, "0");
}

/* ── 12 · PDCA — the loop IS the state of an action ──────────────────────── */

var LANES = [
  { k:"planned", step:"PLAN",  label:"Planned",
    note:"decided, with a name and a date on it" },
  { k:"doing",   step:"DO",    label:"Doing",
    note:"somebody is on it now" },
  { k:"check",   step:"CHECK", label:"In check",
    note:"finished — did it do what we said it would?" },
  { k:"done",    step:"ACT",   label:"Done",
    note:"checked and kept" }
];
var pdcaFilter = { lane:"", team:"", owner:"" };

function loopStrip(){
  var n = laneCount();
  var h = '<div class="loop">';
  LANES.forEach(function(L, i){
    var on = pdcaFilter.lane === L.k;
    h += '<button class="loop__s'+(on ? " on" : "")+'" data-lane="'+L.k+'">'+
      '<span class="loop__step">'+L.step+'</span>'+
      '<span class="loop__n">'+n[L.k]+'</span>'+
      '<span class="loop__l">'+L.label+'</span>'+
      '<span class="loop__note">'+L.note+'</span></button>';
    if (i < LANES.length - 1) h += '<span class="loop__arrow" aria-hidden="true">→</span>';
  });
  h += '<span class="loop__arrow" aria-hidden="true">↩</span>';
  h += '<button class="loop__s loop__s--out'+(pdcaFilter.lane === "dropped" ? " on" : "")+'" data-lane="dropped">'+
    '<span class="loop__step">ACT</span><span class="loop__n">'+n.dropped+'</span>'+
    '<span class="loop__l">Dropped</span>'+
    '<span class="loop__note">checked and stopped — also a decision</span></button>';
  return h + '</div>';
}

function scrPdca(){
  var h = head("The work", "PDCA",
    'Plan, do, check, act — and it is <b>not a separate thing kept somewhere else</b>. '+
    'It is the state of an action. Most work goes planned → doing → done without ceremony. '+
    'But the moment somebody says <i>“I think if we did X then Y would happen”</i>, write '+
    'what you expect — and then <b>check</b> has something to compare against instead of being a nod.');

  h += loopStrip();

  var waiting = ACTIONS.filter(inCheck);
  if (waiting.length){
    h += sec("Waiting on a check", waiting.length + " finished, none of them closed yet");
    waiting.forEach(function(a){
      h += '<div class="card" style="border-left:3px solid var(--warn);margin-bottom:var(--s-3)">';
      h += '<div class="card__head"><div><span class="card__title" style="font-size:var(--t-lg)">'+
        esc(a.what)+'</span><div class="card__note">'+esc(a.id)+' · '+personName(a.owner)+
        ' · '+num(+a.estimate||0)+' '+UNIT+' estimated, '+num(spentOn(a))+' logged</div></div></div>';
      if (String(a.expect||"").trim())
        h += '<p style="background:var(--warn-bg);border-radius:var(--r-sm);padding:var(--s-3);margin:0 0 var(--s-3)">'+
          '<b>What we said would happen.</b> '+esc(a.expect)+'</p>';
      else
        h += '<p class="card__note">Nothing was written down about what this should produce, so the '+
          'check is a judgement rather than a comparison. That is allowed — it just teaches you less.</p>';
      h += '<form data-close-action="'+esc(a.id)+'"><div class="do__row">'+
        '<div class="do__f do__f--wide"><label>What actually happened</label>'+
          '<input type="text" name="result" value="'+esc(a.result||"")+'" placeholder="the honest version, even when it is worse than we said"></div>'+
        '<div class="do__f do__f--wide"><label>Evidence</label>'+
          '<input type="text" name="evidence" value="'+esc(a.evidence||"")+'" placeholder="a link or a filename"></div>'+
        '<div class="do__f"><label>And so</label><select name="verdict">'+
          opts([["done","keep it — this is how we do it now"],["dropped","drop it — stop and write why"]], "done")+
          '</select></div>'+
        '<button type="submit" class="btn btn--primary">Close the loop</button></div>'+
        '<p class="do__hint" data-err hidden></p></form>';
      h += '</div>';
    });
  }

  h += '<div class="do"><div class="do__t">Add one, right here</div><form id="addAction"><div class="do__row">'+
    '<div class="do__f do__f--wide"><label for="aa-what">What</label>'+
      '<input type="text" id="aa-what" name="what" placeholder="one sentence, starting with a verb"></div>'+
    '<div class="do__f"><label for="aa-owner">Owner</label><select id="aa-owner" name="owner">'+opts(peopleOpts(), "", "—")+'</select></div>'+
    '<div class="do__f"><label for="aa-team">Team</label><select id="aa-team" name="team">'+opts(teamOpts(), "", "—")+'</select></div>'+
    '<div class="do__f do__f--tiny"><label for="aa-est">Hours</label><input type="number" id="aa-est" name="estimate" step="0.5" min="0" value="2"></div>'+
    '<div class="do__f"><label for="aa-due">Due</label><select id="aa-due" name="due">'+opts(sessionOpts(true), "")+'</select></div>'+
    '<button type="submit" class="btn btn--primary">Add</button></div>'+
    '<div class="do__row" style="margin-top:var(--s-3)"><div class="do__f do__f--wide" style="flex:1 1 100%">'+
      '<label for="aa-exp">What we expect from it <span style="font-weight:400">— optional, and it is the P of PDCA</span></label>'+
      '<input type="text" id="aa-exp" name="expect" placeholder="If we do this, then ___, because ___"></div></div>'+
    '<p class="do__hint" id="aa-err" hidden></p></form></div>';

  var list = ACTIONS.filter(function(a){
    if (pdcaFilter.lane && a.state !== pdcaFilter.lane) return false;
    if (!pdcaFilter.lane && a.state === "dropped") return false;
    if (pdcaFilter.team && a.team !== pdcaFilter.team) return false;
    if (pdcaFilter.owner && a.owner !== pdcaFilter.owner) return false;
    return true;
  }).sort(function(a,b){ return (a.due||"9") < (b.due||"9") ? -1 : 1; });

  h += '<div class="sec"><h2>'+list.length+' of '+ACTIONS.length+'</h2>'+
    '<span class="card__note" style="margin-left:auto">'+
    (pdcaFilter.lane ? '<button class="btn--link" data-lane="">show every step</button> ' : '')+
    '<select class="mini" data-filter="team" style="width:auto;display:inline-block">'+
      opts(teamOpts(), pdcaFilter.team, "every team")+'</select> '+
    '<select class="mini" data-filter="owner" style="width:auto;display:inline-block">'+
      opts(peopleOpts(), pdcaFilter.owner, "everybody")+'</select></span></div>';

  h += '<div class="card card--flush"><div class="tbl-scroll"><table class="tbl"><thead><tr>'+
    '<th>What</th><th>Owner</th><th>Due</th><th class="r">Est</th><th class="r">Spent</th>'+
    '<th>Step</th><th></th></tr></thead><tbody>';
  if (!list.length) h += '<tr><td colspan="7" class="tbl__empty">Nothing here with those filters.</td></tr>';
  list.forEach(function(a){
    var sp = spentOn(a), over = (+a.estimate||0) > 0 && sp > +a.estimate;
    h += '<tr><td class="strong">'+esc(a.what)+
      (String(a.expect||"").trim() ? ' <span class="pill pill--info" title="'+esc(a.expect)+'">expects</span>' : '')+
      (a.shipped ? ' <span class="pill pill--ok">shipped</span>' : '')+
      (a.result ? '<br><span class="card__note"><b>Result:</b> '+esc(a.result)+'</span>' : '')+
      (a.evidence ? '<br><span class="card__note">'+esc(a.evidence)+'</span>' : '')+
      (a.note ? '<br><span class="card__note">'+esc(a.note)+'</span>' : '')+'</td>';
    h += '<td>'+who(a.owner)+'</td>';
    h += '<td class="r">'+pretty(a.due)+
      (a.due && day(a.due) < TODAY && isOpen(a) ? '<br><span class="pill pill--bad">late</span>' : '')+'</td>';
    h += '<td class="r">'+num(+a.estimate||0)+'</td>';
    h += '<td class="r'+(over ? " over" : "")+'">'+num(sp)+'</td>';
    h += '<td><select class="mini" data-inline="state" data-id="'+esc(a.id)+'">'+
      opts([["planned","planned"],["doing","doing"],["check","check"],["done","done"],["dropped","dropped"]], a.state)+
      '</select></td>';
    h += '<td style="white-space:nowrap">'+
      '<button class="btn--link" data-quicklog="'+esc(a.id)+'">+log</button> '+
      '<button class="btn--link" data-edit="action" data-id="'+esc(a.id)+'">edit</button></td></tr>';
  });
  h += '</tbody></table></div></div>';
  return h;
}

function wirePdca(){
  var f = document.getElementById("addAction");
  if (f) f.addEventListener("submit", function(e){
    e.preventDefault();
    var E = f.elements, err = document.getElementById("aa-err");
    function bad(m){ err.textContent = m; err.hidden = false; }
    var what = E.what.value.trim(), est = Number(E.estimate.value);
    if (!what) return bad("Say what it is, in one sentence.");
    if (!E.owner.value) return bad("One name behind it — an action everybody owns is an action nobody owns.");
    if (!E.team.value) return bad("Which team?");
    if (!(est > 0)) return bad("Guess the hours. A wrong estimate written down beats a right one you did not write.");
    if (!E.due.value) return bad("A commitment without a date is a wish.");
    var exp = E.expect.value.trim();
    if (exp && exp.toLowerCase().indexOf("because") < 0)
      return bad("An expectation with no “because” is a plan, not a prediction. Say why you think so — or leave it empty.");
    ACTIONS.push({ id: nextId("A-", ACTIONS), what: what, owner: E.owner.value, team: E.team.value,
      state: "planned", estimate: est, due: E.due.value, opened: iso(TODAY), touched: iso(TODAY),
      expect: exp, result: "", evidence: "", shipped: false, note: "" });
    window.STORE.touch("actions");
    render();
    flash("Added. Save when you are done.");
  });

  document.querySelectorAll("[data-lane]").forEach(function(b){
    b.addEventListener("click", function(){
      pdcaFilter.lane = b.dataset.lane === pdcaFilter.lane ? "" : b.dataset.lane;
      render();
    });
  });
  document.querySelectorAll("[data-filter]").forEach(function(sel){
    sel.addEventListener("change", function(){ pdcaFilter[sel.dataset.filter] = sel.value; render(); });
  });

  document.querySelectorAll("[data-close-action]").forEach(function(form){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var a = ACTIONS.filter(function(x){ return x.id === form.dataset.closeAction; })[0];
      var err = form.querySelector("[data-err]");
      function bad(m){ err.textContent = m; err.hidden = false; }
      var res = form.elements.result.value.trim(), ev = form.elements.evidence.value.trim();
      var verdict = form.elements.verdict.value;
      if (String(a.expect||"").trim() && !res)
        return bad("You wrote what you expected. Write what happened — that comparison is the only reason the expectation was worth writing.");
      if (verdict === "done" && !ev)
        return bad("Done needs evidence — a link or a filename. Done means somebody else can check it.");
      if (verdict === "dropped" && !res)
        return bad("Say what happened and why it stops here. A drop nobody explained is a drop that gets re-proposed in three weeks.");
      a.result = res; a.evidence = ev; a.state = verdict; a.touched = iso(TODAY);
      if (verdict === "dropped" && !String(a.note||"").trim()) a.note = res;
      window.STORE.touch("actions");
      render();
      flash("Loop closed on " + a.id + ".");
    });
  });
}

/* ── 13 · ACTIVITY — what people actually did ────────────────────────────── */

function scrActivity(){
  var h = head("The work", "Activity",
    'What each person actually did, day by day. <b>Hours are optional</b> — put them in and the '+
    'cash flow works, leave them out and the entry still counts as a piece of work with your name '+
    'on it. An entry with no hours is worth more than an hour nobody can point at.');

  h += '<div class="do"><div class="do__t">Report what you did</div><form id="addAct"><div class="do__row">'+
    '<div class="do__f"><label for="ac-who">Who</label><select id="ac-who" name="person">'+opts(peopleOpts(), "", "—")+'</select></div>'+
    '<div class="do__f do__f--wide" style="flex:3 1 320px"><label for="ac-what">What you did <span style="font-weight:400">— past tense</span></label>'+
      '<input type="text" id="ac-what" name="what" placeholder="wrote the three decision rules, not “worked on the Manual”"></div>'+
    '<div class="do__f"><label for="ac-act">On which action <span style="font-weight:400">— optional</span></label>'+
      '<select id="ac-act" name="action">'+opts(openActionOpts(), "", "— not on the board —")+'</select></div>'+
    '<div class="do__f do__f--tiny"><label for="ac-h">Hours</label><input type="number" id="ac-h" name="hours" step="0.25" min="0" placeholder="—"></div>'+
    '<div class="do__f"><label for="ac-d">Day</label><input type="date" id="ac-d" name="date" value="'+iso(TODAY)+'" max="'+iso(TODAY)+'"></div>'+
    '<button type="submit" class="btn btn--primary">Report it</button>'+
    '</div><p class="do__hint" id="ac-err" hidden></p></form></div>';

  var reported = {}; ACTIVITY.forEach(function(e){ if (inWeek(e.date, THIS_WEEK)) reported[e.person] = 1; });
  h += '<div class="grid g-4">';
  h += kpi("Reported this week", didInWeek(THIS_WEEK), "entries across the company", "accent");
  h += kpi("People who reported", Object.keys(reported).length + ' <small>/ ' + PEOPLE.length + '</small>',
    "the motivation number — a count of people, never a mood",
    Object.keys(reported).length < PEOPLE.length/2 ? "bad" : "ok");
  h += kpi("Hours attached", num(spentInWeek(THIS_WEEK)), "of " + num(capacityWeek(THIS_WEEK)) + " declared");
  h += kpi("From git", ACTIVITY.filter(function(e){ return e.source === "git"; }).length,
    "imported, not typed");
  h += '</div>';

  h += '<div class="card" style="margin-top:var(--s-4);border-left:3px solid var(--info)">'+
    '<div class="card__head"><span class="card__title">It can fill itself in</span></div>'+
    '<p>Everything this company builds lands in the repository, and the repository already knows '+
    '<b>who changed what, and when</b>. So you do not have to type that part twice:</p>'+
    '<p class="num" style="background:var(--paper-3);border-radius:var(--r-sm);padding:var(--s-3);font-size:var(--t-sm)">'+
    'python3 import-activity.py --since 2026-09-08</p>'+
    '<p>reads the git history and writes one entry per commit — who, when, what the message said — '+
    'skipping anything it has already imported. This optional manual import requires Git. '+
    'No automatic workflow is enabled in this package.</p>'+
    '<p style="margin:0">Then the only things left to type are the hours and the work that happened '+
    'outside the repository — the conversation, the shoot, the meeting. Which is the right division: '+
    '<b>the machine records what it can see, and you record what it cannot.</b></p>'+
    '<p class="card__src">This is the automations block of the course, applied to the one company you '+
    'actually run. Sessions 16 to 18.</p></div>';

  h += sec("Everything reported", ACTIVITY.length + " entries");
  h += '<div class="card card--flush"><div class="tbl-scroll"><table class="tbl"><thead><tr>'+
    '<th>Day</th><th>Who</th><th>What they did</th><th>Action</th><th class="r">Hours</th><th></th></tr></thead><tbody>';
  if (!ACTIVITY.length) h += '<tr><td colspan="6" class="tbl__empty">Nothing reported yet.</td></tr>';
  ACTIVITY.map(function(e,i){ return { e:e, i:i }; })
    .sort(function(a,b){ return a.e.date < b.e.date ? 1 : -1; })
    .slice(0, 80).forEach(function(r){
      h += '<tr><td class="r">'+pretty(r.e.date)+'</td><td>'+who(r.e.person)+'</td>'+
        '<td>'+esc(r.e.what||"")+(r.e.source === "git" ? ' <span class="pill pill--flat">git</span>' : '')+'</td>'+
        '<td>'+(r.e.action ? esc(r.e.action) : '<span class="card__note">—</span>')+'</td>'+
        '<td class="r">'+(+r.e.hours ? num(+r.e.hours) : '<span class="card__note">—</span>')+'</td>'+
        '<td><button class="btn--link" data-edit="activity" data-id="'+r.i+'">edit</button></td></tr>';
    });
  h += '</tbody></table></div></div>';
  if (ACTIVITY.length > 80) h += '<p class="card__note">Showing the last 80 of '+ACTIVITY.length+'.</p>';
  return h;
}

function wireActivity(){
  var f = document.getElementById("addAct");
  if (!f) return;
  f.addEventListener("submit", function(e){
    e.preventDefault();
    var E = f.elements, err = document.getElementById("ac-err");
    function bad(m){ err.textContent = m; err.hidden = false; }
    var what = E.what.value.trim(), hrs = E.hours.value === "" ? 0 : Number(E.hours.value);
    if (!E.person.value) return bad("Who did it?");
    if (!what) return bad("Say what you did, past tense. “Worked on it” is not an entry.");
    if (hrs < 0) return bad("Hours cannot be negative.");
    if (hrs > 12) return bad("More than twelve hours in one entry. Split it, or it is a week remembered as a day.");
    if (E.date.value > iso(TODAY)) return bad("That day has not happened yet.");
    ACTIVITY.push({ date: E.date.value, person: E.person.value, what: what,
      action: E.action.value || null, hours: hrs, source: "typed" });
    window.STORE.touch("activity");
    render();
    flash("Reported.");
  });
}

/* ── 14 · CASH FLOW ──────────────────────────────────────────────────────── */

function scrCash(){
  var capW = capacityWeek(THIS_WEEK), spentW = spentInWeek(THIS_WEEK);
  var dueW = ACTIONS.filter(function(a){ return isOpen(a) && inWeek(a.due, THIS_WEEK); });
  var owedW = dueW.reduce(function(t,a){ return t + remainingOn(a); }, 0);

  var h = head("The work", "Cash flow",
    'There is no money in this course, so hours are the currency — and hours are a <b>harder</b> '+
    'currency than money, because an hour you did not spend this week is not saved, it is gone. '+
    'What comes in, what goes out, what is already promised, and how far it reaches.');

  h += sec("This week", "from " + pretty(THIS_WEEK));
  h += '<div class="grid g-4">';
  h += kpi("Capacity in", num(capW), "declared, adjusted for who is away", "accent");
  h += kpi("Promised out", num(owedW), dueW.length + " action" + (dueW.length===1?"":"s") + " due this week");
  h += kpi("Actually spent", num(spentW), pct(spentW, capW) + "% of capacity");
  h += kpi(capW - owedW >= 0 ? "Unpromised" : "Over-promised", num(Math.abs(capW - owedW)),
    capW - owedW >= 0 ? "room left this week" : "this week is already impossible",
    capW - owedW < 0 ? "bad" : "ok");
  h += '</div>';

  h += sec("Runway", "everything you can still put in, against everything already promised");
  var future = MILESTONES.filter(function(m){ return m.d >= TODAY; });
  var scale = Math.max.apply(null, future.map(function(m){
    return Math.max(availableTo(m.d), committedTo(m.d)); }).concat([1]));
  h += '<div class="card">';
  if (!future.length) h += '<p class="tbl__empty">No dates left.</p>';
  else {
    h += '<div class="rows">';
    future.forEach(function(m){
      var av = availableTo(m.d), cm = committedTo(m.d);
      h += '<div class="row"><span>'+esc(m.name)+'<small>'+pretty(m.date)+' · '+
        sessionsBetween(TODAY, m.d)+' sessions</small></span>'+
        bar([{v:Math.min(cm,av),c:"var(--choc)"},{v:Math.max(0,cm-av),c:"var(--bad)"},
             {v:Math.max(0,av-cm),c:"var(--paper-3)"}], scale)+
        '<span>'+num(cm)+' / '+num(av)+'</span></div>';
    });
    h += '</div><p class="card__src">One scale across every row. Scaling each bar to itself would '+
      'make five bars that cannot be compared, which is a chart that says nothing.</p>';
  }
  h += '</div>';

  var closed = ACTIONS.filter(function(a){ return a.state === "done" && (+a.estimate||0) > 0 && spentOn(a) > 0; });
  h += sec("What your estimates are worth");
  if (closed.length < 3){
    h += none("Needs at least three finished actions with both an estimate and reported hours. You have " + closed.length + ".");
  } else {
    var estT = closed.reduce(function(t,a){ return t + (+a.estimate||0); }, 0);
    var actT = closed.reduce(function(t,a){ return t + spentOn(a); }, 0);
    var mult = actT / estT;
    h += '<div class="grid g-4">';
    h += kpi("Measured on", closed.length, "finished actions with both numbers");
    h += kpi("Estimated", num(estT), "what you said it would take");
    h += kpi("Took", num(actT), "what it actually took");
    h += kpi("Multiplier", "×" + (Math.round(mult*100)/100),
      mult > 1.15 ? "multiply your next estimate by this before you promise it"
                  : (mult < 0.85 ? "you are over-estimating — you have more room than you think"
                                 : "close enough to trust"),
      mult > 1.5 ? "bad" : "ok");
    h += '</div>';
  }

  h += sec("Where the hours went", "the share column is the one to read");
  var totalAll = ACTIVITY.reduce(function(t,e){ return t + (+e.hours||0); }, 0);
  var rows = PEOPLE.map(function(p){
    return { p:p,
      tot: ACTIVITY.filter(function(e){ return e.person === p.id; })
        .reduce(function(t,e){ return t + (+e.hours||0); }, 0),
      n: ACTIVITY.filter(function(e){ return e.person === p.id; }).length };
  }).sort(function(a,b){ return b.tot - a.tot; });
  var maxP = Math.max.apply(null, rows.map(function(r){ return r.tot; }).concat([1]));
  h += '<div class="card"><div class="rows">';
  rows.forEach(function(r){
    var share = totalAll > 0 ? r.tot/totalAll*100 : 0;
    h += '<div class="row"><span>'+who(r.p.id)+'<small>'+r.n+' entries</small></span>'+
      bar([{v:r.tot,c:r.p._hue},{v:maxP-r.tot,c:"var(--paper-3)"}], maxP)+
      '<span>'+num(r.tot)+' · '+Math.round(share)+'%</span></div>';
  });
  h += '</div><p class="card__src">In a company of eleven, anybody much above nine per cent is '+
    'carrying somebody — and four of the five grade categories are individual, so that is not '+
    'generosity, it is a problem with arithmetic behind it.</p></div>';

  h += sec("Week by week");
  h += '<div class="card">'+weeklyChart()+'</div>';
  return h;
}

function weeklyChart(){
  var weeks = [], seen = {};
  SESSIONS.forEach(function(s){ var k = iso(mondayOf(s.d)); if (!seen[k]){ seen[k] = 1; weeks.push(k); } });
  var show = weeks.filter(function(w){ return day(w) <= TODAY; }).slice(-12);
  if (!show.length) return '<p class="tbl__empty">The term has not started.</p>';
  var vals = show.map(function(w){ return { w:w, spent: spentInWeek(w), cap: capacityWeek(w) }; });
  var top = Math.max.apply(null, vals.map(function(v){ return Math.max(v.spent, v.cap); }).concat([1]));
  var cols = 'grid-template-columns:44px repeat('+show.length+',1fr);gap:6px';
  var h = '<div style="display:grid;'+cols+';align-items:end;height:140px;border-bottom:1px solid var(--line-2)">';
  h += '<div style="height:100%;position:relative;font-size:11px;color:var(--ink-3)" class="num">'+
    '<span style="position:absolute;top:-6px;right:0">'+num(top)+'</span>'+
    '<span style="position:absolute;bottom:-4px;right:0">0</span></div>';
  vals.forEach(function(v){
    var hs = clamp(v.spent/top*100, 0, 100), hc = clamp(v.cap/top*100, 0, 100);
    h += '<div style="position:relative;height:100%;display:flex;align-items:flex-end" '+
      'title="'+esc(v.w)+' — '+num(v.spent)+' of '+num(v.cap)+' '+UNIT+'">'+
      '<div style="position:absolute;left:0;right:0;bottom:'+hc.toFixed(1)+'%;border-top:1px dashed var(--line-2)"></div>'+
      '<div class="num" style="position:absolute;left:0;right:0;bottom:'+(hs+2).toFixed(1)+
        '%;text-align:center;font-size:10px;color:var(--ink-3)">'+num(v.spent)+'</div>'+
      '<div style="width:100%;height:'+hs.toFixed(1)+'%;background:var(--choc);border-radius:2px 2px 0 0;min-height:2px"></div>'+
      '</div>';
  });
  h += '</div><div style="display:grid;'+cols+';margin-top:6px"><div></div>';
  show.forEach(function(w){ h += '<div style="font-size:10px;color:var(--ink-3);text-align:center">'+pretty(w)+'</div>'; });
  h += '</div><p class="card__src">Solid: hours attached to reported work. Dashed: capacity that week. '+
    'The gap is not laziness — it is the difference between what this company thinks it has and what it uses.</p>';
  return h;
}

/* ── 15 · DEPARTMENTS — their space, and a menu of what to put in it ─────── */

/* Deliberately NOT designed for them. The course says the system is theirs to
   build; the professor's job is to say what a space like this usually holds and
   why, and then get out of the way. So each card below is a description and a
   reason, never a finished module — and claiming one turns it into an action
   with a name and a date, which is the only way anything here gets built. */
var TOOLKIT = [
  { k:"indicators", t:"Indicators",
    d:"The two or three numbers this department publishes every week, and where each is read from.",
    w:"Without them nobody outside the department can tell whether it is going well, so nobody can help.",
    ex:{ product:"things shipped · rework · how long from idea to out",
         audience:"pieces published · reach · replies from people we do not know",
         operations:"commitments kept · hours concentration · decisions written up" } },
  { k:"stages", t:"Stages",
    d:"What a piece of work goes through here, from idea to out in the world. Name every stage and say who moves it.",
    w:"A stage nobody named is a stage where work sits. Naming them is how you find out where things actually stall.",
    ex:{ product:"idea → spec → build → test with somebody → ship",
         audience:"insight → draft → review → schedule → published → read back",
         operations:"proposed → decided → written in the Manual → taught to everyone" } },
  { k:"folders", t:"Folder structure",
    d:"Where things live, named so that somebody who was not there finds them in December.",
    w:"This is the single highest-return hour anybody in this company will spend, and it is boring, which is why it never happens.",
    ex:{ product:"one folder per thing you build, with its readme",
         audience:"by channel, then by date — never by whose laptop it was on",
         operations:"the Manual, the record, the playbooks, the deliverables" } },
  { k:"status", t:"Status board",
    d:"What is in each stage right now, on one screen, with a name against each.",
    w:"It is the thing you point at in the thirty-five minutes instead of going round the table asking.",
    ex:{ product:"what is being built and what is waiting to be tested",
         audience:"what is scheduled this week and what has no draft yet",
         operations:"what the company owes at the next date" } },
  { k:"roadmap", t:"Roadmap",
    d:"What this department owes at each of the four dates, working backwards from the date rather than forwards from today.",
    w:"Forwards from today is how you arrive at 22 October with the interesting half done and the required half missing.",
    ex:{ product:"the micro-app by 10 November means the first version exists by 27 October",
         audience:"the launch on 22 October means the identity is fixed by 29 September",
         operations:"the Manual ratified on 22 September means the draft circulates on the 17th" } },
  { k:"playbooks", t:"Playbooks",
    d:"How to do the things that currently only one of you can do. Written to be used once, by somebody under time pressure.",
    w:"It is the mechanism behind the objective this company did not set for itself. Without it, three people end the term able to do everything and eight do not.",
    ex:{ product:"how we set up a project and ship it",
         audience:"how we make a piece from an insight",
         operations:"how we run a session and write the record" } },
  { k:"backlog", t:"Backlog",
    d:"The ideas nobody has started, each with one line on why not yet.",
    w:"Ideas with no home get re-proposed every three weeks by whoever forgot they were already rejected.",
    ex:{ product:"", audience:"", operations:"" } },
  { k:"assets", t:"Assets",
    d:"The files the other two departments come here for, in one place, named and versioned.",
    w:"Otherwise the answer to “where is the logo” is a person, and that person is busy.",
    ex:{ product:"", audience:"the marks, the fonts, the templates", operations:"" } },
  { k:"decisions", t:"Decisions",
    d:"What this department decided, why, and the best argument that lost.",
    w:"In December you will want to know whether the person who lost an argument in October was right.",
    ex:{ product:"", audience:"", operations:"" } }
];

function scrDept(teamId){
  var t = (CO.teams||[]).filter(function(x){ return x.id === teamId; })[0];
  if (!t) return head("Departments", "Unknown", "No team with that id in company.js.");
  var mem = PEOPLE.filter(function(p){ return p.team === teamId; });
  var mine = ACTIONS.filter(function(a){ return a.team === teamId; });
  var open = mine.filter(isOpen);
  var owed = open.reduce(function(s,a){ return s + remainingOn(a); }, 0);
  var cap = mem.reduce(function(s,p){ return s + capacityIn(p, THIS_WEEK); }, 0);
  var hrs = ACTIVITY.filter(function(e){
    return mem.some(function(p){ return p.id === e.person; }); })
    .reduce(function(s,e){ return s + (+e.hours||0); }, 0);

  var h = head("Departments", t.name, esc(t.question),
    '<button class="btn btn--primary" data-edit="action" data-prefill-team="'+esc(teamId)+'">Add an action</button>');

  h += '<div class="grid g-4">';
  h += kpi("People", mem.length + ' <small>/ ' + t.seats + ' seats</small>',
    mem.map(function(p){ return personName(p.id); }).join(" · "), "accent");
  h += kpi("Open actions", open.length, num(owed) + " " + UNIT + " still owed");
  h += kpi("Capacity a week", num(cap), "between them");
  h += kpi("Hours reported", num(hrs), "all term, by this department");
  h += '</div>';

  if (open.length){
    h += sec("On the board now");
    h += '<div class="card card--flush"><div class="tbl-scroll"><table class="tbl"><thead><tr>'+
      '<th>What</th><th>Owner</th><th>Due</th><th>Step</th><th></th></tr></thead><tbody>';
    open.sort(function(a,b){ return (a.due||"9") < (b.due||"9") ? -1 : 1; }).forEach(function(a){
      h += '<tr><td class="strong">'+esc(a.what)+'</td><td>'+who(a.owner)+'</td>'+
        '<td class="r">'+pretty(a.due)+'</td><td>'+statePill(a)+'</td>'+
        '<td><button class="btn--link" data-edit="action" data-id="'+esc(a.id)+'">edit</button></td></tr>';
    });
    h += '</tbody></table></div></div>';
  }

  h += sec("What you could build here", "none of it is built, and that is the point");
  h += '<div class="card" style="border-left:3px solid var(--info)"><p style="margin:0">'+
    'This page is <b>deliberately empty below this line</b>. The company designs its own system — '+
    'that is the whole course — so what follows is not a set of modules waiting to be switched on. '+
    'It is a list of the things a department like this usually needs, what each one is, and why it '+
    'matters. <b>Pick the ones you actually need, build them, and put them in this folder.</b><br>'+
    '<span class="card__note">Claiming one does not build anything. It puts an action on the board '+
    'with a name and a date against it, which is the only way anything here gets built.</span></p></div>';

  h += '<div class="grid g-3" style="margin-top:var(--s-4);align-items:start">';
  TOOLKIT.forEach(function(m){
    var ex = (m.ex && m.ex[teamId]) || "";
    h += '<div class="card"><div class="card__head"><span class="card__title">'+esc(m.t)+'</span></div>';
    h += '<p style="margin:0 0 var(--s-2)">'+esc(m.d)+'</p>';
    h += '<p class="card__note" style="margin:0 0 var(--s-3)"><b>Why it matters.</b> '+esc(m.w)+'</p>';
    if (ex) h += '<p class="card__note" style="margin:0 0 var(--s-3)"><b>Here that might be:</b> '+esc(ex)+'</p>';
    h += '<button class="btn btn--ghost btn--sm" data-build="'+esc(teamId)+'|'+esc(m.k)+'">Claim it →</button>';
    h += '</div>';
  });
  h += '</div>';

  h += '<div class="card" style="margin-top:var(--s-4)">'+
    '<div class="card__head"><span class="card__title">How to actually build one</span></div>'+
    '<p>You have a coding agent and a repository. A department page is a file, so ask for it:</p>'+
    '<p class="num" style="background:var(--paper-3);border-radius:var(--r-sm);padding:var(--s-3);font-size:var(--t-sm)">'+
    'Read board/data/ and CLAUDE.md. Build me a status board for '+esc(t.name)+' as a new screen '+
    'in the board, with the stages we agreed: ___ → ___ → ___. Read the actions from actions.js, '+
    'do not invent a second place to keep them.</p>'+
    '<p style="margin:0">The rule that keeps this from turning into nine unrelated tools: '+
    '<b>read from the files that already exist</b>. A department page that keeps its own copy of '+
    'who is doing what is a department page that will disagree with the board by November.</p></div>';
  return h;
}
/* ── 16 · TEAMS ──────────────────────────────────────────────────────────── */

function teamsFigure(){
  var liaison = PEOPLE.filter(function(p){ return p.hat === "liaison"; })[0];
  var s = '<figure class="fig"><svg viewBox="0 0 520 200" role="img" aria-label="Three teams '+
    'side by side, with one person inside one of them reaching into the other two">';
  (CO.teams||[]).forEach(function(t, i){
    var x = [20,190,360][i], n = PEOPLE.filter(function(p){ return p.team === t.id; }).length;
    s += '<rect x="'+x+'" y="16" width="140" height="78" rx="8" fill="var(--paper)" stroke="var(--line-2)"/>';
    s += '<text x="'+(x+14)+'" y="46" font-family="Space Grotesk, sans-serif" font-size="16" '+
         'font-weight="600" fill="var(--ink)">'+esc(t.name)+'</text>';
    s += '<text x="'+(x+14)+'" y="70" font-family="IBM Plex Mono, monospace" font-size="12" '+
         'fill="var(--ink-3)">'+n+' people</text>';
  });
  s += '<circle cx="128" cy="55" r="11" fill="none" stroke="var(--choc)" stroke-width="1.8"/>';
  s += '<circle cx="128" cy="55" r="4" fill="var(--choc)"/>';
  s += '<path d="M 128 66 L 128 140 L 430 140" fill="none" stroke="var(--choc)" stroke-width="1.4" stroke-dasharray="3 4"/>';
  s += '<path d="M 260 140 L 260 100" fill="none" stroke="var(--choc)" stroke-width="1.4"/>';
  s += '<path d="M 430 140 L 430 100" fill="none" stroke="var(--choc)" stroke-width="1.4"/>';
  [[260,96],[430,96]].forEach(function(p){
    s += '<path d="M -4 4 L 0 -2 L 4 4 Z" fill="var(--choc)" transform="translate('+p[0]+','+p[1]+')"/>';
  });
  s += '<text x="128" y="172" text-anchor="middle" font-family="Space Grotesk, sans-serif" '+
       'font-size="12" fill="var(--ink-3)">'+esc(liaison ? personName(liaison.id) : "the liaison")+'</text>';
  s += '</svg><figcaption>The liaison is <b>inside a team</b> and reaches into the other two. '+
    'A hat, not a fourth box — Galbraith\'s second rung, chosen on purpose over the sixth. '+
    'You do not need a matrix if one person talking on Thursday would fix it.</figcaption></figure>';
  return s;
}

function scrTeams(){
  var h = head("The people", "Teams",
    'Grouped by <b>what ships</b>, never by topic, so the boundaries fall where the work divides '+
    'instead of where the syllabus does.',
    '<button class="btn btn--primary" data-edit="person">Add a person</button>');

  h += '<div class="card">'+teamsFigure()+'</div>';

  h += '<div class="grid g-3" style="margin-top:var(--s-4);align-items:start">';
  (CO.teams||[]).forEach(function(t){
    var mem = PEOPLE.filter(function(p){ return p.team === t.id; });
    var open = ACTIONS.filter(function(a){ return a.team === t.id && isOpen(a); });
    var owed = open.reduce(function(s,a){ return s + remainingOn(a); }, 0);
    var cap = mem.reduce(function(s,p){ return s + capacityIn(p, THIS_WEEK); }, 0);
    h += '<div class="card card--flush">';
    h += '<div style="padding:var(--s-4) var(--s-4) var(--s-3);border-bottom:1px solid var(--line)">'+
      '<h3>'+esc(t.name)+'</h3><p class="card__note" style="margin:4px 0 0">'+esc(t.question)+'</p></div>';
    h += '<table class="tbl"><tbody>';
    mem.forEach(function(p){
      var sp = spentInWeek(THIS_WEEK, p.id);
      h += '<tr><td>'+who(p.id)+(p.hat ? ' <span class="pill pill--info">'+esc(p.hat)+'</span>' : '')+'</td>'+
        '<td class="r">'+num(sp)+'/'+num(capacityIn(p, THIS_WEEK))+'</td>'+
        '<td style="width:1%"><button class="btn--link" data-edit="person" data-id="'+esc(p.id)+'">edit</button></td></tr>';
    });
    if (mem.length !== t.seats)
      h += '<tr><td colspan="3" style="color:var(--warn)">'+mem.length+' in the team, '+t.seats+' seats agreed</td></tr>';
    h += '</tbody></table>';
    h += '<div style="padding:var(--s-3) var(--s-4);border-top:1px solid var(--line)" class="card__note">'+
      open.length+' open · '+num(owed)+' '+UNIT+' owed · '+num(cap)+' '+UNIT+'/week between them</div>';
    h += '</div>';
  });
  h += '</div>';
  return h;
}

/* ── 17 · MASTERY ────────────────────────────────────────────────────────── */

function scrMastery(){
  var g = masteryGaps();
  var h = head("The people", "Mastery",
    'The instrument for the one objective this company did not set for itself. '+
    '<b>Click any square to claim a level</b> — the gaps below are then calculated, '+
    'because nobody spots a pattern in 231 cells at 16:25 on a Thursday.');

  h += '<div class="grid g-3">';
  h += kpi("Nobody above level 1", g.untouched.length,
    g.untouched.length ? esc(g.untouched.map(function(c){ return c.id; }).join(" · "))
                       : "every competence has somebody",
    g.untouched.length > 10 ? "bad" : "ok");
  h += kpi("Held by one person", g.single.length,
    g.single.length ? esc(g.single.map(function(s){ return s.c.id; }).join(" · "))
                    : "no single points of failure",
    g.single.length ? "bad" : "ok");
  h += kpi("Nobody has taught yet", g.noThree.length + ' <small>/ ' + PEOPLE.length + '</small>',
    "people with no level 3 anywhere");
  h += '</div>';

  h += sec("The levels");
  h += '<div class="card"><p style="margin:0"><b>1</b> I have seen it done · '+
    '<b>2</b> I have done it, a deliverable carries my name · '+
    '<b>3</b> I taught it and they did it, their deliverable is the proof.<br>'+
    '<b>Level 2 is what USAC requires. Level 3 is what this company requires of itself</b> — '+
    'not ambition for its own sake: the inherited objective is that <i>all</i> of you demonstrate '+
    'all 21, and that is only reachable if the people who can do a thing teach it. '+
    'A company where three people are good at everything fails it by arithmetic.<br>'+
    '<span class="card__note">Above level 1 a claim needs proof — a link or a filename. '+
    'Not because anybody is suspected of lying, but because a claim with nothing behind it is '+
    'worth nothing to whoever reads this grid to decide who does the next thing.</span></p></div>';

  h += sec("Who can actually do what", "click a square");
  h += '<div class="card"><div class="tbl-scroll"><table class="mx"><thead><tr><th class="c">Competence</th>';
  PEOPLE.forEach(function(p){
    var nm = personName(p.id);
    h += '<th title="'+esc(nm)+'">'+esc(nm.length > 3 ? nm.slice(0,3) : nm)+'</th>';
  });
  h += '</tr></thead><tbody>';
  (CO.competences||[]).forEach(function(c){
    var able = PEOPLE.filter(function(p){ return levelOf(p, c.id) >= 2; }).length;
    h += '<tr><td class="c" title="'+esc(c.text)+'"><b>'+esc(c.id)+'</b> · '+
      esc(c.text.slice(0,42))+(c.text.length>42?"…":"")+
      (able === 0 ? ' <span class="pill pill--bad">nobody</span>'
                  : (able === 1 ? ' <span class="pill pill--warn">one</span>' : ''))+'</td>';
    PEOPLE.forEach(function(p){
      var l = levelOf(p, c.id);
      h += '<td><button data-claim="'+esc(c.id)+'" data-person="'+esc(p.id)+'" data-l="'+l+'" '+
        'title="'+esc(personName(p.id)+" · "+c.id+" · level "+l)+'">'+l+'</button></td>';
    });
    h += '</tr>';
  });
  h += '</tbody></table></div></div>';
  return h;
}

/* ── 18 · SETUP ──────────────────────────────────────────────────────────── */

function scrSetup(){
  var h = head("The company", "Setup",
    'Four times a term, no more. Everything else on this board is calculated from what is here.');

  h += '<form id="setupForm"><div class="grid g-2" style="align-items:start">';

  h += '<div class="card"><div class="card__head"><span class="card__title">Who you are</span></div>';
  h += '<label class="fld"><span>Name</span><input type="text" name="name" value="'+esc(CO.name||"")+'"></label>';
  h += '<label class="fld"><span>Purpose, in one sentence</span>'+
    '<textarea name="purpose" rows="2">'+esc(CO.purpose||"")+'</textarea>'+
    '<em>Every other line on this board is measured against it.</em></label>';
  h += '<label class="chk"><input type="checkbox" name="sample"'+(SAMPLE?" checked":"")+
    '> Still showing sample data</label>'+
    '<p class="card__note" style="margin-top:6px">Untick it once the rows are yours and the stamp disappears.</p>';
  h += '</div>';

  h += '<div class="card"><div class="card__head"><span class="card__title">This block</span></div>';
  var bo = CO.blockObjective || {};
  h += '<label class="fld"><span>Block</span><select name="block">'+
    opts([[1,"1 · foundations and prompt engineering"],[2,"2 · marketing AI and creative media"],
          [3,"3 · vibe coding and automations"],[4,"4 · AI strategy and innovation"]], bo.block)+'</select></label>';
  h += '<label class="fld"><span>The objective <i>required</i></span>'+
    '<textarea name="btext" rows="2">'+esc(bo.text === "—" ? "" : (bo.text||""))+'</textarea></label>';
  h += '<label class="fld" style="margin:0"><span>Carried by</span>'+
    '<input type="text" name="bowner" value="'+esc(bo.owner === "—" ? "" : (bo.owner||""))+'"></label>';
  h += '</div></div>';

  h += '<div class="sheet__acts" style="border:0"><button type="submit" class="btn btn--primary">Save it</button>'+
    '<span class="card__note" id="setupOk" hidden>Saved to the board — now save to the files.</span></div>';
  h += '</form>';

  h += sec("Capacity", "the number the whole cash flow divides by");
  h += '<div class="card"><p class="card__note" style="margin-top:0">An honest small number beats an '+
    'aspirational big one. If somebody puts 10 and does 3, every promise this company makes is '+
    'built on a number that was never true.</p>';
  h += '<div class="tbl-scroll"><table class="tbl"><thead><tr><th>Who</th><th>Team</th><th>Hat</th>'+
    '<th class="r">Hours / week</th><th class="r">Logged this week</th><th></th></tr></thead><tbody>';
  PEOPLE.forEach(function(p){
    h += '<tr><td>'+who(p.id)+'</td><td>'+esc((BY_ID[p.id] && teamName(p.team)) || p.team)+'</td>'+
      '<td>'+(p.hat ? '<span class="pill pill--info">'+esc(p.hat)+'</span>' : '—')+'</td>'+
      '<td style="width:120px"><input type="number" class="num" data-cap="'+esc(p.id)+'" '+
        'step="0.5" min="0" value="'+(+p.capacity||0)+'"></td>'+
      '<td class="r">'+num(spentInWeek(THIS_WEEK, p.id))+'</td>'+
      '<td><button class="btn--link" data-edit="person" data-id="'+esc(p.id)+'">edit</button></td></tr>';
  });
  h += '</tbody></table></div></div>';

  h += sec("The dates", "USAC's, and they do not move");
  h += '<div class="card card--flush"><table class="tbl"><thead><tr><th>What</th><th>Session</th>'+
    '<th>Date</th><th class="r">Sessions away</th></tr></thead><tbody>';
  MILESTONES.forEach(function(m){
    var past = m.d < TODAY;
    h += '<tr'+(past ? ' style="opacity:.5"' : '')+'><td class="strong">'+esc(m.name)+'</td>'+
      '<td class="r">'+m.session+'</td><td class="r">'+pretty(m.date)+'</td>'+
      '<td class="r">'+(past ? "gone" : sessionsBetween(TODAY, m.d))+'</td></tr>';
  });
  h += '</tbody></table></div>';
  return h;
}

function teamName(id){
  var t = (CO.teams||[]).filter(function(x){ return x.id === id; })[0];
  return t ? t.name : id;
}

function wireSetup(){
  var f = document.getElementById("setupForm");
  if (f) f.addEventListener("submit", function(e){
    e.preventDefault();
    var E = f.elements;
    CO.name = E.name.value.trim() || "—";
    CO.purpose = E.purpose.value.trim() || "—";
    CO.sample = E.sample.checked;
    CO.blockObjective = { block: Number(E.block.value),
      text: E.btext.value.trim() || "—", owner: E.bowner.value.trim() || "—" };
    window.STORE.touch("company");
    render();
    flash("Company updated. Save to the files when you are done.");
  });
  document.querySelectorAll("[data-cap]").forEach(function(inp){
    inp.addEventListener("change", function(){
      var p = BY_ID[inp.dataset.cap], v = Number(inp.value);
      if (!p) return;
      if (!(v > 0)){ inp.value = p.capacity; flash("Capacity has to be above zero — the cash flow divides by it."); return; }
      p.capacity = v;
      window.STORE.touch("people");
      flash(personName(p.id) + ": " + num(v) + " " + UNIT + " a week.");
    });
  });
}

/* ── 19 · the shell ──────────────────────────────────────────────────────── */

var SCREENS = {
  today:      { render: scrToday,    wire: null },
  close:      { render: scrClose,    wire: wireClose },
  pdca:       { render: scrPdca,     wire: wirePdca },
  activity:   { render: scrActivity, wire: wireActivity },
  cash:       { render: scrCash,     wire: null },
  product:    { render: function(){ return scrDept("product"); },    wire: null },
  audience:   { render: function(){ return scrDept("audience"); },   wire: null },
  operations: { render: function(){ return scrDept("operations"); }, wire: null },
  teams:      { render: scrTeams,    wire: null },
  mastery:    { render: scrMastery,  wire: null },
  setup:      { render: scrSetup,    wire: wireSetup }
};
var current = "today";

function render(){
  recompute();
  var s = SCREENS[current] || SCREENS.today;
  var el = document.getElementById("screen");
  el.innerHTML = s.render();
  if (s.wire) s.wire();
  paintTop();
  window.NAV.paint(current, alarms().length);
}

function go(name){
  if (!SCREENS[name]) name = "today";
  current = name;
  render();
  window.scrollTo(0, 0);
}

function paintTop(){
  document.getElementById("topNow").innerHTML =
    (CO.name && CO.name !== "—" ? '<b>'+esc(CO.name)+'</b>' : '<b>The board</b>') +
    ' · session <b>' + (LAST_SESSION ? LAST_SESSION.n : 0) + '</b> of 27' +
    (NEXT ? ' · next date ' + esc(NEXT.name) + ' in ' + sessionsBetween(TODAY, NEXT.d) + ' sessions' : '');
  paintSave();
}

var flashTimer;
function flash(msg){
  var el = document.getElementById("flash");
  el.textContent = msg; el.hidden = false;
  clearTimeout(flashTimer);
  flashTimer = setTimeout(function(){ el.hidden = true; }, 5200);
}

/* The save state is never hidden and never lies about which mode it is in:
   somebody has to be able to tell at a glance whether what they just typed has
   reached the files the other ten people can see. */
function paintSave(){
  var S = window.STORE, st = document.getElementById("saveState");
  var save = document.getElementById("saveBtn"), conn = document.getElementById("connectBtn");
  var n = S.dirtyList().length;
  save.hidden = n === 0;
  conn.hidden = !(S.mode === "download" && typeof window.showDirectoryPicker === "function" && window.isSecureContext);
  st.classList.toggle("hot", n > 0);
  if (S.mode === "readonly") st.textContent = "read-only — open it from start.command to edit";
  else if (n > 0){
    st.textContent = n + " unsaved file" + (n === 1 ? "" : "s");
    save.textContent = S.mode === "files" ? "Save to data/" : "Download " + n;
  } else st.textContent = S.mode === "files" ? "saving straight to data/" : "changes download as files";
}

async function boot(){
  window.NAV.build(go);
  await window.STORE.init(paintSave);
  window.FORMS.init({
    todayIso: function(){ return iso(TODAY); },
    sessions: function(){ return SESSIONS; },
    personName: personName, pretty: pretty, spentOn: spentOn, nextId: nextId,
    get TODAY(){ return TODAY; }
  });

  go(location.hash.replace("#","") || "today");
  window.addEventListener("hashchange", function(){ go(location.hash.replace("#","") || "today"); });

  document.getElementById("saveBtn").addEventListener("click", async function(){
    try {
      var r = await window.STORE.save();
      flash(r.mode === "files"
        ? "Written to data/ — " + r.written.join(", ") + ".js. Commit them so the other ten can see."
        : "Downloaded " + r.written.map(function(x){ return x + ".js"; }).join(", ") + ". Drop them into data/ and commit.");
    } catch (e){ flash("Not saved: " + e.message); }
    paintSave();
  });
  document.getElementById("connectBtn").addEventListener("click", async function(){
    try { await window.STORE.connect(); flash("Connected. Saving now writes data/ directly."); }
    catch (e){ flash(e.message); }
    paintSave();
  });

  /* Inline state change, straight from the row. */
  document.addEventListener("change", function(e){
    var sel = e.target.closest("[data-inline='state']");
    if (!sel) return;
    var a = ACTIONS.filter(function(x){ return x.id === sel.dataset.id; })[0];
    if (!a) return;
    var want = sel.value;
    if (want === "done" && !String(a.evidence||"").trim()){
      flash("Done needs evidence — a link or a filename. Opening it so you can add one.");
      sel.value = a.state;
      window.FORMS.open("action", a.id, { state:"done" });
      return;
    }
    if (want === "dropped" && !String(a.note||"").trim()){
      flash("Say why it was dropped. In three weeks nobody will remember it the same way.");
      sel.value = a.state;
      window.FORMS.open("action", a.id, { state:"dropped" });
      return;
    }
    a.state = want; a.touched = iso(TODAY);
    window.STORE.touch("actions");
    render();
  });
  document.addEventListener("click", function(e){
    var q = e.target.closest("[data-quicklog]");
    if (q){
      e.preventDefault();
      var a = ACTIONS.filter(function(x){ return x.id === q.dataset.quicklog; })[0];
      window.FORMS.open("activity", null, { action: q.dataset.quicklog, what: a ? "" : "" });
      return;
    }
    var pt = e.target.closest("[data-prefill-team]");
    if (pt){ e.preventDefault(); window.FORMS.open("action", null, { team: pt.dataset.prefillTeam }); return; }
    /* Claiming a toolkit card builds nothing. It opens a new action with the
       shape filled in, so the thing that gets created is a commitment with a
       name and a date — which is the only way any of it gets built. */
    var bd = e.target.closest("[data-build]");
    if (bd){
      e.preventDefault();
      var parts = bd.dataset.build.split("|");
      var mod = TOOLKIT.filter(function(m){ return m.k === parts[1]; })[0];
      var team = (CO.teams||[]).filter(function(x){ return x.id === parts[0]; })[0];
      window.FORMS.open("action", null, {
        team: parts[0],
        what: "Build the " + (mod ? mod.t.toLowerCase() : parts[1]) + " for " + (team ? team.name : parts[0]),
        expect: mod ? ("If we build this, then " + mod.w.charAt(0).toLowerCase() + mod.w.slice(1)) : ""
      });
    }
  });

  /* Work left behind by the last visit. Offered, never applied behind your back. */
  var pend = window.STORE.pending();
  if (pend){
    var when = new Date(pend.at).toLocaleString("en-GB", { dateStyle:"medium", timeStyle:"short" });
    if (confirm("This browser has unsaved changes to " + pend.files.join(", ") + ".js from " + when +
      ", which never reached the files.\n\nOK restores them so you can save. Cancel throws them away.")){
      window.STORE.restore(); render();
    } else window.STORE.discard();
  }
  paintSave();
}

window.BOARD = { render: render, flash: flash, go: go };

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();

})();

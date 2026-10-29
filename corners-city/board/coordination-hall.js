// Coordination Hall and Incident Clinic: three small tools for the person who answers customers.
// Rules mirror automation/routing.md (R1 to R6). If one changes, change both by pull request.
// Nothing here stores or sends anything. It runs in the browser and forgets everything on reload.
(function () {
  'use strict';

  var KINDS = [
    { id: 'student-yes', label: 'A student signed up and agreed to be emailed', student: true, consent: true },
    { id: 'student-no', label: 'A student signed up and did not agree to be emailed', student: true, consent: false },
    { id: 'office', label: 'An international office wrote', partner: true, owner: 'Audience' },
    { id: 'provider', label: 'A study abroad provider wrote', partner: true, owner: 'Audience' },
    { id: 'esn', label: 'An ESN section wrote', partner: true, owner: 'Audience' },
    { id: 'residence', label: 'A residence wrote', partner: true, owner: 'Operations' },
    { id: 'other', label: 'Something else, or the enrich step marked the row wrong', other: true }
  ];

  function $(id) { return document.getElementById(id); }
  function el(tag, text, cls) {
    var n = document.createElement(tag);
    if (text) n.textContent = text;
    if (cls) n.className = cls;
    return n;
  }

  // ── 1 · Routing check ──────────────────────────────────────────────────────
  function route(kindId, hours, replied, failed) {
    var kind = KINDS.filter(function (k) { return k.id === kindId; })[0];
    var out = [];
    if (kind.student) {
      if (kind.consent) out.push(['R1', 'The student', 'Welcome email with the first-week checklist', 'within 5 minutes']);
      else out.push(['R5', 'Nobody outside the twelve', 'No email is sent. The lead id goes on the weekly review list', 'weekly']);
    } else if (kind.partner) {
      out.push(['R2', 'One named owner in ' + kind.owner, 'An alert with the lead id, the kind and the reply-due time', 'within 5 minutes']);
      if (!replied && hours >= 24) out.push(['R3', 'The same owner', 'One reminder: no reply is logged yet', 'at 24 hours']);
      if (!replied && hours >= 48) out.push(['R4', 'Operations', 'The lead id and the owner, because the day limit passed twice over', 'at 48 hours']);
    } else {
      out.push(['R5', 'Nobody outside the twelve', 'The lead id goes on the weekly review list', 'weekly']);
    }
    if (failed) out.push(['R6', 'Operations', 'Scenario, step, run id, error text and lead id. No address, no name', 'within 15 minutes']);
    var status;
    if (kind.partner) {
      if (replied) status = 'Day limit met: a reply is logged.';
      else if (hours >= 48) status = 'Day limit missed. This lead needs a person today.';
      else if (hours >= 24) status = 'Day limit passed. Reply now.';
      else status = 'Within the day. Reply by ' + (24 - hours) + ' hours from now.';
    } else if (kind.student && kind.consent) {
      status = 'No follow-up owed beyond the welcome email.';
    } else {
      status = 'Nothing is sent to the person.';
    }
    return { rows: out, status: status };
  }

  function drawRoute() {
    var r = route($('rk').value, Number($('rh').value), $('rr').checked, $('rf').checked);
    var list = $('route-out');
    list.textContent = '';
    r.rows.forEach(function (row) {
      var li = el('li');
      li.appendChild(el('span', row[0] + ' · ' + row[1] + ': ' + row[2]));
      li.appendChild(el('strong', row[3]));
      list.appendChild(li);
    });
    $('route-status').textContent = r.status;
  }

  // ── 2 · Reply desk ─────────────────────────────────────────────────────────
  // Drafts in the Corners voice: short sentences, a place, a time, a price. No "community", no "vibes".
  // The owner edits the {braces}, then sends from the company's own inbox. Nothing is sent from here.
  var REPLIES = [
    { id: 'partner', label: 'Partner writes (office, provider, ESN)',
      text: 'Hi {first name},\n\nThanks for writing. We are a student company in Bilbao. We help new arrivals find plans and people in their first weeks.\n\nOne small favour: could you add a cohort code to your welcome email for {cohort}? We give you the code and one sentence to paste.\n\nCan we talk for 15 minutes on {day}?\n\n{your first name}, Corners' },
    { id: 'residence', label: 'Residence writes',
      text: 'Hi {first name},\n\nThanks for writing. Our idea is simple: a welcome card with a QR on the desk of each new room. We bring the cards.\n\nCan we come by on {day} at {time}?\n\n{your first name}, Corners' },
    { id: 'student-question', label: 'Student asks a question',
      text: 'Hi {first name},\n\nGood question. {one-sentence answer}.\n\nIf you want a plan this week: {place}, {day}, {price}.\n\n{your first name}, Corners' },
    { id: 'student-stop', label: 'Student replies STOP',
      text: 'Hi {first name},\n\nDone. We deleted your address and we will not write again.\n\n{your first name}, Corners' },
    { id: 'unknown', label: 'We do not know the answer yet',
      text: 'Hi {first name},\n\nWe do not know yet. We will find out and write back by {day}.\n\n{your first name}, Corners' }
  ];

  function drawReplies() {
    var sel = $('reply-kind');
    REPLIES.forEach(function (r) {
      var o = el('option', r.label); o.value = r.id; sel.appendChild(o);
    });
    function show() {
      var r = REPLIES.filter(function (x) { return x.id === sel.value; })[0];
      $('reply-text').value = r.text;
    }
    sel.addEventListener('change', show);
    show();
    $('reply-copy').addEventListener('click', function () {
      var btn = $('reply-copy');
      var t = $('reply-text');
      t.select();
      var done = function () { btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = 'Copy'; }, 1500); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t.value).then(done, function () {});
      else { try { document.execCommand('copy'); done(); } catch (e) {} }
    });
  }

  // ── 3 · Incident row ───────────────────────────────────────────────────────
  // Builds one markdown row for 04 - Playbooks/incidents.md. Refuses anything that looks like an address.
  var PERSONAL = /@|\+?\d[\d\s().-]{7,}\d/;

  function cell(s) { return s.replace(/\|/g, '/').replace(/\s*\n+\s*/g, ' ').trim(); }

  function buildIncident() {
    var ids = ['i-date', 'i-step', 'i-what', 'i-impact', 'i-recovery', 'i-lesson', 'i-who'];
    var v = {};
    ids.forEach(function (id) { v[id] = $(id).value; });
    var out = $('incident-out'), msg = $('incident-msg');
    var bad = ids.some(function (id) { return PERSONAL.test(v[id].replace(/\d{4}-\d{2}-\d{2}/g, '')); });
    if (bad) {
      out.value = '';
      msg.textContent = 'Stopped: one field looks like an address or a phone number. Use the lead id instead, never the person.';
      return;
    }
    var missing = ids.filter(function (id) { return !v[id].trim(); });
    if (missing.length) {
      out.value = '';
      msg.textContent = 'Fill every field. A row with an empty lesson is not an incident, it is a complaint.';
      return;
    }
    msg.textContent = 'Paste this row into the incident log in 04 - Playbooks/incidents.md, then open a pull request.';
    out.value = '| ' + [cell(v['i-date']), cell(v['i-step'] + ': ' + v['i-what']), cell(v['i-impact']), cell(v['i-recovery']), cell(v['i-lesson']), cell(v['i-who'])].join(' | ') + ' |';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var rk = $('rk');
    KINDS.forEach(function (k) { var o = el('option', k.label); o.value = k.id; rk.appendChild(o); });
    ['rk', 'rh', 'rr', 'rf'].forEach(function (id) { $(id).addEventListener('change', drawRoute); });
    drawRoute();
    drawReplies();
    $('incident-build').addEventListener('click', buildIncident);
  });
})();

import {KINDS, NEEDS, AREAS, PLACES, ACTIVITIES, TRIPS} from './eat-do-weekends-data.js';
const $ = id => document.getElementById(id);
const SIGN_KEY = 'corners-eat-do-signups-v1';
const NAME_SAFE = /^[\p{L}][\p{L} '’-]{0,23}$/u;
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };

// ---- storage (first names only, this browser only) ----
let signups = {}, storageOK = true;
try { const raw = JSON.parse(localStorage.getItem(SIGN_KEY) || '{}'); for (const [k, v] of Object.entries(raw)) if (typeof v === 'string' && NAME_SAFE.test(v)) signups[k] = v; }
catch (e) { storageOK = false; }
function saveSignups() { try { localStorage.setItem(SIGN_KEY, JSON.stringify(signups)); storageOK = true; } catch (e) { storageOK = false; } }
function toast(msg) { const t = $('toast'); t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => t.hidden = true, 4500); }

// ---- tabs ----
const tabs = ['eat', 'do', 'trips'];
function showTab(name) {
 for (const t of tabs) {
  const on = t === name;
  $('tab-' + t).setAttribute('aria-selected', String(on)); $('tab-' + t).tabIndex = on ? 0 : -1;
  $('panel-' + t).hidden = !on;
 }
 try { history.replaceState(null, '', '#' + name); } catch (e) {}
}
tabs.forEach((t, i) => {
 $('tab-' + t).onclick = () => showTab(t);
 $('tab-' + t).onkeydown = e => {
  const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
  if (d) { const n = tabs[(i + d + tabs.length) % tabs.length]; showTab(n); $('tab-' + n).focus(); }
 };
});

// ---- EAT & DRINK ----
let need = '';
const chipDefs = [['', 'Anything'], ...Object.entries(NEEDS)];
for (const [key, label] of chipDefs) {
 const b = el('button', null, label); b.type = 'button'; b.dataset.need = key; b.setAttribute('aria-pressed', String(key === need));
 b.onclick = () => { need = key; for (const c of $('needChips').children) c.setAttribute('aria-pressed', String(c.dataset.need === need)); renderEat(); };
 $('needChips').append(b);
}
$('kind').append(new Option('All types', ''), ...Object.entries(KINDS).map(([k, v]) => new Option(v, k)));
$('area').append(new Option('All areas', ''), ...AREAS.map(a => new Option(a, a)));
['q', 'kind', 'area', 'sort'].forEach(id => $(id).addEventListener('input', renderEat));
const euro = n => '€'.repeat(n);

function renderEat() {
 const q = $('q').value.trim().toLowerCase(), kind = $('kind').value, area = $('area').value, sort = $('sort').value;
 const rows = PLACES.filter(p => (!need || p.needs.includes(need)) && (!kind || p.kind === kind) && (!area || p.area === area)
  && (!q || (p.name + ' ' + p.area + ' ' + p.note).toLowerCase().includes(q)));
 const by = {
  score: (a, b) => b.score - a.score || a.price - b.price || a.name.localeCompare(b.name),
  priceAsc: (a, b) => a.price - b.price || b.score - a.score,
  priceDesc: (a, b) => b.price - a.price || b.score - a.score,
  name: (a, b) => a.name.localeCompare(b.name)
 };
 rows.sort(by[sort]);
 $('eatCount').textContent = `${rows.length} of ${PLACES.length} places${need ? ' · ' + NEEDS[need] : ''}. Scores and prices are estimates, not reviews.`;
 const list = $('eatList'); list.replaceChildren();
 if (!rows.length) { const li = el('li', 'card'); li.append(el('p', null, 'Nothing matches. Try “Anything” or clear the search.')); list.append(li); return; }
 for (const p of rows) {
  const li = el('li', 'card');
  li.append(el('h3', null, p.name));
  const meta = el('p', 'meta');
  const price = el('span', 'price'); price.append(el('b', null, euro(p.price)), document.createTextNode(' ' + ['', 'cheap', 'moderate', 'pricey', 'special occasion'][p.price]));
  meta.append(price, el('span', null, '★ ' + p.score.toFixed(1) + ' est.'), el('span', null, KINDS[p.kind]), el('span', null, p.area));
  li.append(meta, el('p', null, p.note));
  const tags = el('div', 'tags'); for (const n of p.needs) tags.append(el('span', 'tag', NEEDS[n])); li.append(tags);
  if (!p.verified) li.append(el('p', 'est', 'Unverified estimate. Replace with student reviews.'));
  list.append(li);
 }
}

// ---- DO ----
let group = 'adventure';
const intro = {
 adventure: 'Outdoor and active. Costs are per person and estimated.',
 social: 'Corners-hosted meet-ups. Pick a date and count yourself in. Venues are still to be agreed with the places.'
};
for (const g of ['adventure', 'social']) $('g-' + g).onclick = () => { group = g; renderDo(); };
function renderDo() {
 for (const g of ['adventure', 'social']) $('g-' + g).setAttribute('aria-pressed', String(g === group));
 $('doIntro').textContent = intro[group];
 const list = $('doList'); list.replaceChildren();
 for (const a of ACTIVITIES.filter(x => x.group === group)) {
  const li = el('li', 'card');
  li.append(el('h3', null, a.name));
  const meta = el('p', 'meta'); meta.append(el('span', null, a.cost ? `≈ €${a.cost} est.` : 'Free'), el('span', null, a.level), el('span', null, a.where));
  li.append(meta, el('p', null, a.note));
  if (a.sessions) {
   const box = el('div', 'sessions');
   for (const s of a.sessions) {
    const row = el('div', 'session'), mine = signups[s.id];
    row.append(el('span', null, `${s.when} · ${s.spots} places`));
    const b = el('button', mine ? null : 'primary', mine ? `${mine} is in · cancel` : 'Sign up');
    b.type = 'button';
    b.onclick = () => mine ? cancelSignup(s.id) : openSignup(a, s);
    row.append(b); box.append(row);
   }
   li.append(box);
  }
  if (!a.verified) li.append(el('p', 'est', a.sessions ? 'Proposed session. Nothing is booked yet.' : 'Unverified estimate. Check price and hours.'));
  list.append(li);
 }
}
let pending = null;
function openSignup(a, s) {
 pending = s.id; $('signupWhen').textContent = s.when.toUpperCase(); $('signupTitle').textContent = a.name;
 $('signupError').textContent = ''; $('signupForm').reset(); $('signup').showModal(); $('firstName').focus();
}
$('signupCancel').onclick = () => $('signup').close();
$('signupForm').onsubmit = e => {
 e.preventDefault();
 const name = $('firstName').value.trim();
 if (!NAME_SAFE.test(name)) { $('signupError').textContent = 'Use a first name only: letters, no numbers, email or phone.'; return; }
 signups[pending] = name; saveSignups(); $('signup').close(); renderDo();
 toast(storageOK ? `${name}, you are in. Saved in this browser only.` : `${name}, you are in for now. This browser could not save it.`);
};
function cancelSignup(id) { delete signups[id]; saveSignups(); renderDo(); toast('Your place is cancelled.'); }

// ---- WEEKENDS ----
['budget', 'tripKind', 'tripSort'].forEach(id => $(id).addEventListener('input', renderTrips));
function tripTotal(t) { return t.travel * 2 + t.bed * t.nights + t.food * Math.max(1, t.nights + 1); }
function renderTrips() {
 const budget = Number($('budget').value), hasBudget = $('budget').value !== '' && Number.isFinite(budget);
 const kind = $('tripKind').value, sort = $('tripSort').value;
 const rows = TRIPS.filter(t => !kind || t.kind === kind).map(t => ({...t, total: tripTotal(t)}));
 rows.sort(sort === 'cheap' ? (a, b) => a.total - b.total : (a, b) => a.hours - b.hours);
 const fits = rows.filter(t => !hasBudget || t.total <= budget).length;
 $('tripCount').textContent = `${rows.length} trips${hasBudget ? ` · ${fits} fit €${budget}` : ''}. Return travel, beds and food for one student; estimates.`;
 const list = $('tripList'); list.replaceChildren();
 for (const t of rows) {
  const over = hasBudget && t.total > budget, li = el('li', 'card' + (over ? ' over' : ''));
  li.append(el('h3', null, t.name));
  const meta = el('p', 'meta'); meta.append(el('b', null, `≈ €${t.total}`), el('span', null, t.kind + (t.nights ? ` · ${t.nights} night${t.nights > 1 ? 's' : ''}` : '')), el('span', null, t.how));
  li.append(meta, el('p', null, t.note));
  const split = [`travel €${t.travel * 2}`, t.nights ? `bed €${t.bed * t.nights}` : null, `food €${t.food * Math.max(1, t.nights + 1)}`].filter(Boolean).join(' · ');
  li.append(el('p', 'est', split + (t.verified ? '' : ' · unverified estimate')));
  if (hasBudget) li.append(el('p', 'fit', over ? `€${t.total - budget} over your budget` : 'Fits your budget'));
  list.append(li);
 }
}

// ---- start ----
renderEat(); renderDo(); renderTrips();
const start = location.hash.slice(1);
showTab(tabs.includes(start) ? start : 'eat');
if (!storageOK) toast('This browser blocks saving. Sign-ups will not survive a reload.');

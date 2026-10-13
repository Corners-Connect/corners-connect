// Eat, do and weekends: the data behind the building on plot-03.
//
// HONESTY RULES (read before editing)
//  - Venue names are real Bilbao places, taken from public guides on 8 October 2026.
//  - `price` (1-4 = € to €€€€), `score` (1-5) and `cost` are PROVISIONAL ESTIMATES by the
//    drafting agent. They are NOT scraped from Google/Tripadvisor and are NOT student
//    reviews. The page labels them "estimate". Replace them with real student reviews
//    from the pilot, then flip `verified` to true for that row.
//  - Opening hours are deliberately absent: check before you go.
//  - Activity sessions are PROPOSED Corners sessions. Nothing is booked with a venue yet.
//  - No personal data. Sign-ups on the page are first names, stored in this browser only.
// Drafted 8 October 2026 by Claude Code. Student review and sign-off: pending.

// meal: 'full' = sit-down meal, 'aperitivo' = drinks plus a bite, 'snack' = quick/cheap,
//       'late' = open late / going out, 'sweet' = coffee or dessert
export const KINDS = {restaurant:'Restaurant', pintxo:'Pintxo bar', bar:'Bar', club:'Club / live music', cafe:'Café'};
export const NEEDS = {
 full:'A full meal', aperitivo:'Aperitivo / drinks and a bite', snack:'Quick and cheap',
 late:'Going out late', sweet:'Coffee or something sweet'
};
export const AREAS = ['Casco Viejo', 'Plaza Nueva', 'Ensanche / Diputación', 'Abando', 'Indautxu', 'Bilbao La Vieja', 'Guggenheim / Abandoibarra', 'Deusto'];

export const PLACES = [
 // — Pintxo bars, Casco Viejo / Plaza Nueva —
 {id:'e01', name:'Gure Toki', kind:'pintxo', area:'Plaza Nueva', price:2, score:4.5, needs:['aperitivo','snack'], note:'Gourmet pintxos on the square; known for the crab and foie creations.', verified:false},
 {id:'e02', name:'Café Bar Bilbao', kind:'pintxo', area:'Plaza Nueva', price:2, score:4.5, needs:['aperitivo','snack'], note:'Open since 1911. Order the bacalao pil-pil.', verified:false},
 {id:'e03', name:'Antxoa Taberna', kind:'pintxo', area:'Plaza Nueva', price:2, score:4.0, needs:['aperitivo'], note:'Anchovies and seafood pintxos.', verified:false},
 {id:'e04', name:'Sorginzulo', kind:'pintxo', area:'Casco Viejo', price:2, score:4.0, needs:['aperitivo','snack'], note:'Famous for its anchovy pintxo; fried calamari at weekends.', verified:false},
 {id:'e05', name:'Bar Charly', kind:'pintxo', area:'Casco Viejo', price:1, score:4.0, needs:['aperitivo','snack'], note:'A long counter of pintxos in the Siete Calles.', verified:false},
 {id:'e06', name:'Motrikes', kind:'pintxo', area:'Casco Viejo', price:1, score:4.0, needs:['aperitivo','snack'], note:'Calle Somera. Known for txampi, a mushroom pintxo.', verified:false},
 {id:'e07', name:'Urdiña', kind:'pintxo', area:'Plaza Nueva', price:2, score:4.0, needs:['aperitivo'], note:'Small selection, high quality.', verified:false},
 {id:'e08', name:'Víctor Montes', kind:'restaurant', area:'Plaza Nueva', price:3, score:4.0, needs:['full','aperitivo'], note:'Traditional tavern and dining room on the square.', verified:false},
 // — Pintxo bars, Ensanche / Abando —
 {id:'e09', name:'La Viña del Ensanche', kind:'pintxo', area:'Ensanche / Diputación', price:2, score:4.5, needs:['aperitivo','snack'], note:'Jamón specialist; mini ham sandwiches. Check whether the bar is open after its refurbishment.', verified:false},
 {id:'e10', name:'El Globo', kind:'pintxo', area:'Ensanche / Diputación', price:2, score:4.5, needs:['aperitivo','full'], note:'Unexpected pairings and spider crab (txangurro).', verified:false},
 {id:'e11', name:'El Huevo Frito', kind:'pintxo', area:'Ensanche / Diputación', price:2, score:4.0, needs:['aperitivo','snack'], note:'Quail eggs on many pintxos; pig trotters a la vizcaína.', verified:false},
 {id:'e12', name:'Irrintzi', kind:'pintxo', area:'Ensanche / Diputación', price:2, score:4.0, needs:['aperitivo'], note:'A more contemporary take than the old taverns.', verified:false},
 {id:'e13', name:'La Bodeguita del 12', kind:'pintxo', area:'Abando', price:2, score:4.5, needs:['aperitivo','snack'], note:'Won the 2025 Bizkaia championship for best traditional pintxo.', verified:false},
 // — Markets, restaurants, cafés —
 {id:'e14', name:'Mercado de la Ribera', kind:'pintxo', area:'Casco Viejo', price:2, score:4.0, needs:['aperitivo','full','snack'], note:'Food stalls under one roof by the river. Everyone orders something different and shares a table.', verified:false},
 {id:'e15', name:'Casa Rufo', kind:'restaurant', area:'Abando', price:3, score:4.0, needs:['full'], note:'Long-running traditional Basque restaurant and grocer.', verified:false},
 {id:'e16', name:'Café Iruña', kind:'cafe', area:'Abando', price:2, score:4.0, needs:['sweet','aperitivo'], note:'Historic Moorish-style café by Jardines de Albia; the language-exchange meeting spot in our example data.', verified:false},
 {id:'e17', name:'Zortziko', kind:'restaurant', area:'Abando', price:4, score:4.5, needs:['full'], note:'Michelin-starred tasting restaurant. A treat, not a Tuesday.', verified:false},
 {id:'e18', name:'Nerua (Guggenheim)', kind:'restaurant', area:'Guggenheim / Abandoibarra', price:4, score:4.5, needs:['full'], note:'Michelin-starred, inside the Guggenheim. When the family visits.', verified:false},
 {id:'e19', name:'Etxanobe', kind:'restaurant', area:'Guggenheim / Abandoibarra', price:4, score:4.5, needs:['full'], note:'Michelin-starred, in the Euskalduna Palace.', verified:false},
 // — Bars and nightlife —
 {id:'e20', name:'Kafe Antzokia', kind:'club', area:'Bilbao La Vieja', price:1, score:4.5, needs:['late','aperitivo'], note:'Former theatre and cultural centre: pintxos by day, concerts and DJ nights at weekends.', verified:false},
 {id:'e21', name:'Bilborock', kind:'club', area:'Casco Viejo', price:1, score:4.0, needs:['late'], note:'Converted 17th-century church: concerts, cinema, events.', verified:false},
 {id:'e22', name:'Sala Sonora', kind:'club', area:'Casco Viejo', price:2, score:3.5, needs:['late'], note:'Nightclub that books DJs. Cover and hours to check.', verified:false},
 {id:'e23', name:'Cotton Club', kind:'club', area:'Indautxu', price:2, score:3.5, needs:['late'], note:'Long-running night out in Bilbao, 20+ years.', verified:false},
 {id:'e24', name:'Casco Viejo late-night bars', kind:'bar', area:'Casco Viejo', price:1, score:3.5, needs:['late','aperitivo'], note:'Not one venue: the Siete Calles and Calle Somera stay busy late. Pick a street, then a door.', verified:false}
];

// — Things to do —
// group: 'adventure' | 'social'. For 'social', sessions are Corners-hosted meet-ups to sign up for.
export const ACTIVITIES = [
 {id:'a01', group:'adventure', name:'Surf in Sopelana', where:'Sopelana · end of Metro line 1', cost:30, level:'Beginners welcome', note:'Lessons and board rental on the beach. Wetsuit needed from October.', verified:false},
 {id:'a02', group:'adventure', name:'Kayak on the Ría', where:'Bilbao estuary', cost:28, level:'Easy', note:'Paddle under the bridges and past the Guggenheim.', verified:false},
 {id:'a03', group:'adventure', name:'Gaztelugatxe steps', where:'Bakio coast · bus', cost:12, level:'Moderate · 241 steps', note:'The chapel on the rock. The free visit slot has to be booked in advance.', verified:false},
 {id:'a04', group:'adventure', name:'Climbing wall', where:'Zorroza', cost:10, level:'All levels', note:'Our example data has a Tuesday 18:00 climbing group meeting here. Day-pass price to check.', verified:false},
 {id:'a05', group:'adventure', name:'Artxanda hill walk', where:'Funicular from Casco side', cost:3, level:'Easy', note:'Ride up, walk the ridge, whole city below you at sunset.', verified:false},
 {id:'a06', group:'adventure', name:'Mount Pagasarri hike', where:'Above Bilbao', cost:0, level:'Moderate · half day', note:'The classic Bilbao hike. Boots and water.', verified:false},
 {id:'a07', group:'adventure', name:'Sunday run along the Ría', where:'Guggenheim loop', cost:0, level:'Easy · about 5 km', note:'Flat and lit. Groups run it.', verified:false},
 {id:'s01', group:'social', name:'Beer pong night', where:'A bar or flat, venue to be agreed', cost:5, level:'Teams of 2', note:'Bracket night. Teams are made on the night so nobody needs a partner.',
  sessions:[{id:'s01a', when:'Fri 16 Oct · 21:00', spots:16}, {id:'s01b', when:'Fri 23 Oct · 21:00', spots:16}], verified:false},
 {id:'s02', group:'social', name:'Mus (Basque card game)', where:'A bar in Casco Viejo, to be agreed', cost:3, level:'We teach you', note:'The game every bar table here plays: four players, partners, signals. A local or a keen player teaches the first round.',
  sessions:[{id:'s02a', when:'Wed 14 Oct · 19:00', spots:12}, {id:'s02b', when:'Wed 21 Oct · 19:00', spots:12}], verified:false},
 {id:'s03', group:'social', name:'Cards and board games', where:'A café on Calle Ledesma, to be agreed', cost:3, level:'Any', note:'The Thursday board-games group from our example data. Bring a game or borrow one.',
  sessions:[{id:'s03a', when:'Thu 15 Oct · 19:30', spots:20}, {id:'s03b', when:'Thu 22 Oct · 19:30', spots:20}], verified:false},
 {id:'s04', group:'social', name:'Karaoke night', where:'Private room or bar, venue to be agreed', cost:6, level:'No talent required', note:'We found no confirmed karaoke bar in Bilbao in our search, so this is a hosted night in a booked room. Venue is the first thing to solve.',
  sessions:[{id:'s04a', when:'Sat 17 Oct · 22:00', spots:14}, {id:'s04b', when:'Sat 24 Oct · 22:00', spots:14}], verified:false},
 {id:'s05', group:'social', name:'Language exchange', where:'Café Iruña', cost:0, level:'Any language', note:'Half an hour in your language, half an hour in theirs.',
  sessions:[{id:'s05a', when:'Mon 12 Oct · 20:00', spots:30}, {id:'s05b', when:'Mon 19 Oct · 20:00', spots:30}], verified:false}
];

// — Trips near Bilbao, nearest first —
// travel/bed/food in euros for one person, matching the planning estimates in app/app.js where the trip exists there.
export const TRIPS = [
 {id:'t01', name:'Getxo and Las Arenas', how:'Metro line 1 · 35 min', hours:0.6, travel:3, bed:0, food:12, nights:0, kind:'Day trip', note:'Walk the Bizkaia Bridge side, the Algorta fishermen’s quarter and the beach.', verified:false},
 {id:'t02', name:'Bizkaia Bridge, Portugalete', how:'Metro line 2 · 30 min', hours:0.5, travel:2, bed:0, food:10, nights:0, kind:'Day trip', note:'A hanging gondola carries cars across the river. Cheap and unlike anywhere else.', verified:false},
 {id:'t03', name:'Bermeo and Urdaibai', how:'Bus · 1 h', hours:1, travel:8, bed:0, food:16, nights:0, kind:'Day trip', note:'Fishing town for lunch, a biosphere reserve around it.', verified:false},
 {id:'t04', name:'Gaztelugatxe', how:'Bus · 1 h 15', hours:1.25, travel:12, bed:24, food:16, nights:0, kind:'Day trip', note:'241 steps to the chapel. Book the free slot in advance.', verified:false},
 {id:'t05', name:'Vitoria-Gasteiz', how:'Bus · 1 h', hours:1, travel:14, bed:26, food:16, nights:1, kind:'Weekend', note:'The Basque capital, and the cheapest of the easy ones.', verified:false},
 {id:'t06', name:'San Sebastián', how:'Bus · 1 h 20', hours:1.35, travel:16, bed:35, food:20, nights:1, kind:'Weekend', note:'La Concha, the old town and a lot of pintxos.', verified:false},
 {id:'t07', name:'Santander', how:'Bus · 1 h 30', hours:1.5, travel:22, bed:30, food:18, nights:1, kind:'Weekend', note:'A long beach city; the Magdalena palace on its own headland.', verified:false},
 {id:'t08', name:'Logroño and Rioja', how:'Bus · 2 h', hours:2, travel:28, bed:28, food:20, nights:1, kind:'Weekend', note:'Calle Laurel: one tapa and one small wine per bar, all evening.', verified:false},
 {id:'t09', name:'Biarritz', how:'Bus · 2 h 30', hours:2.5, travel:32, bed:42, food:26, nights:1, kind:'Weekend', note:'Over the French border. Take your passport or ID card.', verified:false},
 {id:'t10', name:'Picos de Europa', how:'Car share · 2 h 30', hours:2.5, travel:38, bed:22, food:18, nights:2, kind:'Long weekend', note:'Mountains and the Cares gorge walk. Boots and an early start.', verified:false}
];

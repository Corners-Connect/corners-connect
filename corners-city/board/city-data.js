// The city is a visual entry to the existing workspace, not a second company system.
// Keep permanent plot ids. Students decide what goes on vacant plots.
// Department names are read from board/data/company.js at runtime.
export const PLOTS = [
 {id:'product', team:'product', type:'estudio', x:-12, z:-12},
 {id:'audience', team:'audience', type:'torre', x:0, z:-12},
 {id:'operations', team:'operations', type:'oficina', x:12, z:-12},
 {id:'plot-01', x:-12, z:0}, {id:'plot-02', x:0, z:0}, {id:'plot-03', x:12, z:0},
 {id:'plot-04', x:-12, z:12}, {id:'plot-05', x:0, z:12}, {id:'plot-06', x:12, z:12},
 // A fourth row, because the app has seven sections in build and the first three
 // rows hold six plots. Existing plot ids are untouched.
 {id:'plot-07', x:-12, z:24}, {id:'plot-08', x:0, z:24}, {id:'plot-09', x:12, z:24}
];
// Approved visual additions live here as code after review. Local browser drafts
// are separate and never become company decisions, tasks or evidence automatically.
// Example schema only: {plotId:'plot-01', label:'A student-approved label', type:'base'}
//
// One building per section of the app that is in build for Mini Project 1, named
// exactly as the section is named in the product. Plots 08 and 09 stay open.
// Drafted 8 October 2026; student review and sign-off pending.
export const EXTENSIONS = [
 {plotId:'plot-01', type:'biblioteca', label:'Before you leave'},
 {plotId:'plot-02', type:'base', label:'Nearby'},
 {plotId:'plot-03', type:'nave', label:'Recs'},
 {plotId:'plot-04', type:'estudio', label:'Groups'},
 {plotId:'plot-05', type:'oficina', label:'Guides'},
 {plotId:'plot-06', type:'torre', label:'Weekends'},
 {plotId:'plot-07', type:'ayuntamiento', label:'Programme'}
];

// The city is a visual entry to the existing workspace, not a second company system.
// Keep permanent plot ids. Students decide what goes on vacant plots.
// Department names are read from board/data/company.js at runtime.
export const PLOTS = [
 {id:'product', team:'product', type:'estudio', x:-12, z:-12},
 {id:'audience', team:'audience', type:'torre', x:0, z:-12},
 {id:'operations', team:'operations', type:'oficina', x:12, z:-12},
 {id:'plot-01', x:-12, z:0}, {id:'plot-02', x:0, z:0}, {id:'plot-03', x:12, z:0},
 {id:'plot-04', x:-12, z:12}, {id:'plot-05', x:0, z:12}, {id:'plot-06', x:12, z:12}
];
// Approved visual additions live here as code after review. Local browser drafts
// are separate and never become company decisions, tasks or evidence automatically.
// Example schema only: {plotId:'plot-01', label:'A student-approved label', type:'base'}
//
// The four below are the product team's split for Mini Project 1, one plot per
// part of the application, matching issues #9 to #12. Plots 05 and 06 stay open.
// Drafted 8 October 2026; student review and sign-off pending.
export const EXTENSIONS = [
 {plotId:'plot-01', type:'biblioteca', label:'Before you leave'},
 {plotId:'plot-02', type:'base', label:'Nearby and groups'},
 {plotId:'plot-03', type:'nave', label:'Eat, do and weekends'},
 {plotId:'plot-04', type:'ayuntamiento', label:'Programme and housing'}
];

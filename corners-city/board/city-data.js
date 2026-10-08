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
export const EXTENSIONS = [];

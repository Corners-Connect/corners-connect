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
 {id:'plot-07', x:-12, z:24}, {id:'plot-08', x:0, z:24}, {id:'plot-09', x:12, z:24},
 // A fifth row for the Operations buildings. Existing plot ids are untouched.
 {id:'plot-10', x:-12, z:36}, {id:'plot-11', x:0, z:36}, {id:'plot-12', x:12, z:36}
];
// Approved visual additions live here as code after review. Local browser drafts
// are separate and never become company decisions, tasks or evidence automatically.
// Example schema only: {plotId:'plot-01', label:'A student-approved label', type:'base'}
//
// One building per section of the app that is in build for Mini Project 1, named
// exactly as the section is named in the product. Learning Lab uses plot-08; plot-09 stays open.
// Drafted 8 October 2026; student review and sign-off pending.
// `blurb` is what the section is, `href` opens it in the live app, and `acts` are
// the board action ids being built there, so a building is an entry rather than a
// shell. Only this reviewed file may carry href and acts; browser drafts cannot.
export const EXTENSIONS = [
 {plotId:'plot-01', type:'biblioteca', label:'Before you leave',
  blurb:'Choosing the city: six questions, then nine metrics side by side, then getting ready to go.',
  href:'https://corners-connect.github.io/corners-connect/find/', acts:['A-015','A-016']},
 {plotId:'plot-02', type:'base', label:'Nearby',
  blurb:'The anonymous feed from students a few streets away. Ask anything, vote up what helps.',
  href:'https://corners-connect.github.io/corners-connect/app/#near', acts:['A-009','A-010']},
 {plotId:'plot-03', type:'nave', label:'Recs',
  blurb:'Where to eat, train and go out, ranked by students who live there.',
  href:'https://corners-connect.github.io/corners-connect/app/#recs', acts:['A-012']},
 {plotId:'plot-04', type:'estudio', label:'Groups',
  blurb:'Surf, hiking, language exchange, football. Find people by what you do.',
  href:'https://corners-connect.github.io/corners-connect/app/#groups', acts:['A-011']},
 {plotId:'plot-05', type:'oficina', label:'Guides',
  blurb:'Guided experiences you can actually book: pick a date, a time and how many of you.',
  href:'https://corners-connect.github.io/corners-connect/app/#guides', acts:['A-007']},
 {plotId:'plot-06', type:'torre', label:'Weekends',
  blurb:'Ten places from Bilbao priced by travel, bed and food. Move the slider, watch them re-sort.',
  href:'https://corners-connect.github.io/corners-connect/app/#trips', acts:['A-013']},
 {plotId:'plot-07', type:'ayuntamiento', label:'Programme',
  blurb:'Key dates, the first-week checklist, and what everyone is asking about this week.',
  href:'https://corners-connect.github.io/corners-connect/app/#prog', acts:['A-014']},
 {plotId:'plot-08', label:'Learning Lab', type:'biblioteca', tool:'learning-lab'},
 // Operations buildings. Drafted 13 October 2026; team review and sign-off pending.
 // `stages` are the steps a piece of work walks inside the building; `folder` is where its files live.
 {plotId:'plot-09', label:'Video Production', type:'rascacielos', tool:'video-editor',
  blurb:'From the first idea to the post: one video walks five stages, always in the same order.',
  stages:[
   {name:'Ideas', folder:'video-production/ideas/', text:'Hooks, topics and formats worth filming. Park every idea here before it becomes a script.'},
   {name:'Script', folder:'video-production/scripts/', text:'Turn an idea into a short script: hook, body, call to action.'},
   {name:'Recording', folder:'video-production/recordings/', text:'Shot list, locations and gear for the day you film.'},
   {name:'Edit', folder:'video-production/edits/', text:'Captioned vertical clips for TikTok and Reels, in the Corners look.'},
   {name:'Post', folder:'video-production/posts/', text:'Caption, hashtags, posting time and where each clip goes live.'}]},
 {plotId:'plot-10', label:'Action Plan Tracking', type:'control', view:'plan',
  blurb:'Each department\'s deliverables for the month, split by week, read live from the board.',
  stages:[
   {name:'Plan', text:'Turn each deliverable into an action: one sentence starting with a verb, an estimate and a due date.'},
   {name:'Assign', text:'One owner per action. A name, never a team.'},
   {name:'Track', text:'Move it along: planned, doing, check, done. Anything untouched for two weeks shows on Today.'},
   {name:'Check', text:'Before closing, write what actually happened and add the evidence.'}]}
];

// Functional entries are reviewed source code. Browser drafts cannot supply URLs.
export const TOOLS = {
 'video-editor': {href:'http://localhost:3000', kind:'VIDEO PRODUCTION', action:'Open the video editor ↗',
  description:'Captioned vertical clips for TikTok and Reels. Start the Studio first by double-clicking video-production/start-editor.bat, then open it here.'},
 'learning-lab': {href:'learning-lab.html', kind:'INSTRUCTOR CONTRIBUTION',
  action:'Enter Learning Lab ↗', description:'Prepare the four course deliveries and turn all 25 syllabus topics into useful pieces of your company. Your team keeps the decisions.'}
};

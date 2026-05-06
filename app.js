// ============================================================
// Charlotte Aviation PPL Tracker â€” app.js
// ============================================================
// PART 1 â€” Import Â· State Â· Persistence Hook Â· Dark Mode Â· Mobile Nav
// ============================================================

import {
  ACS_URL, ACS_PAGES, REF_URLS, acsLink,
  GRADES, TASK_STATUSES,
  GL, FL, GL_STAGES, FL_STAGES, PHASES, REQS
} from './syllabus-data.js';
import {
  AIRCRAFT_TAG,
  PROCEDURE_CATEGORIES,
  AIRCRAFT_PROCEDURES,
  PROCEDURES_BY_ID,
  PROCEDURES_SOURCE_LABEL,
  procedureSourceHref
} from './aircraft-procedures.js';
import {
  POH_AIRCRAFT_TAG,
  POH_CATEGORIES,
  POH_REFERENCES,
  POH_REFERENCES_BY_ID,
  POH_SOURCE_LABEL,
  pohSourceHref
} from './poh-reference.js';

// â”€â”€â”€ STORE KEYS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const STORE     = 'charlotteaviation_v1'; // â† bump version here on schema changes
const CFI_STORE = 'charlotteaviation_cfi';
const DARK_STORE     = 'charlotteaviation_darkmode';
const COLLAPSE_STORE = 'charlotteaviation_sidebar_collapsed';

// â”€â”€â”€ CFI PROFILE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
let cfiProfile = (()=>{
  try { const r=localStorage.getItem(CFI_STORE); if(r) return JSON.parse(r); }
  catch(e){}
  return { name:'', certNum:'', certExpiry:'', ratings:'CFI-A', phone:'', email:'' };
})();
function saveCFI() {
  try { localStorage.setItem(CFI_STORE, JSON.stringify(cfiProfile)); } catch(e){}
}

function normalizeStudentRecord(raw) {
  if(!raw || typeof raw !== 'object') return null;
  if(typeof raw.id !== 'string' || !raw.id) return null;
  const student = {
    ...raw,
    name: typeof raw.name === 'string' ? raw.name : '',
    data: raw.data && typeof raw.data === 'object' ? raw.data : {}
  };
  initSD(student);
  return student;
}

function normalizeStateShape(raw) {
  if(!raw || typeof raw !== 'object') return { students:[], activeId:null };
  const students = Array.isArray(raw.students)
    ? raw.students.map(normalizeStudentRecord).filter(Boolean)
    : [];
  const activeId = students.some(s => s.id === raw.activeId) ? raw.activeId : null;
  return { ...raw, students, activeId };
}

// â”€â”€â”€ PERSISTENCE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Loads saved state from localStorage on startup.
let state = (()=>{
  try {
    const r=localStorage.getItem(STORE);
    if(r) return normalizeStateShape(JSON.parse(r));
  }
  catch(e){}
  return { students:[], activeId:null };
})();

/**
 * save() â€” persists the current state object.
 *
 * BACKEND HOOK (Phase 2):
 * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
 * When you are ready to switch from localStorage to a cloud backend,
 * replace (or supplement) the localStorage.setItem call below with
 * your sync call. Example patterns:
 *
 *   // Firebase Firestore:
 *   await db.collection('schools').doc(SCHOOL_ID)
 *           .collection('trackers').doc(state.activeId)
 *           .set(state);
 *
 *   // Supabase:
 *   await supabase.from('tracker_state')
 *                 .upsert({ user_id: authUser.id, payload: state });
 *
 * You may want to debounce this call (300â€“500 ms) to avoid hammering
 * the API on rapid checkbox interactions. A simple debounce wrapper:
 *
 *   const save = debounce(_save, 400);
 *   function _save() { ... }
 *
 * Until then, localStorage is the source of truth.
 * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
 */
function save() {
  try {
    localStorage.setItem(STORE, JSON.stringify(state));
    // â”€â”€ BACKEND HOOK: replace/supplement line above with cloud sync â”€â”€
  } catch(e) {
    console.warn('[Charlotte Aviation] save() failed:', e);
  }
}

// â”€â”€â”€ STATE ACCESSORS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function getS()  { return state.students.find(s => s.id === state.activeId) || null; }

function initSD(s) {
  if(!s.data) s.data = {};
  const d = s.data;
  if(!d.lessonStatus)       d.lessonStatus       = {};
  if(!d.taskStatus)         d.taskStatus         = {};
  if(!d.subtaskChecks)      d.subtaskChecks      = {};
  if(!d.taskStudentGrade)   d.taskStudentGrade   = {};
  if(!d.taskInstructorGrade)d.taskInstructorGrade= {};
  if(!d.srmChecks)          d.srmChecks          = {};
  if(!d.srmItems)           d.srmItems           = {};
  if(!d.srmStandalone)      d.srmStandalone      = {};
  if(!d.notes)              d.notes              = {};
  if(!d.debriefs)           d.debriefs           = {};
  if(!d.logEntries)         d.logEntries         = {};
  if(!d.reqs)               d.reqs               = {};
  if(!d.wiDiscussed)        d.wiDiscussed        = {};
  if(!d.lessonDates)        d.lessonDates        = {};
  if(!d.stageChecks)        d.stageChecks        = {};
  // v3: Personal Minimums for Go/No-Go advisor
  if(!d.personalMins) d.personalMins = {
    windSpd: 15, windGust: 20, crosswind: 10, vis: 5, ceiling: 3000
  };
  return d;
}

function getLStatus(s,lid)       { return s?.data?.lessonStatus?.[lid]           || 'not_started'; }
function getTStatus(s,lid,tid)   { return s?.data?.taskStatus?.[lid]?.[tid]      || 'not_started'; }
function getSGrade(s,lid,tid)    { return s?.data?.taskStudentGrade?.[lid]?.[tid]   || null; }
function getIGrade(s,lid,tid)    { return s?.data?.taskInstructorGrade?.[lid]?.[tid]|| null; }
function getReq(s,rid)           { return s?.data?.reqs?.[rid]                   || 0; }
function getSubChecks(s,lid,tid) { return s?.data?.subtaskChecks?.[lid]?.[tid]   || []; }
const DEBRIEF_TEMPLATE = {
  outcome:'',
  wentWell:'',
  needsWork:'',
  reviewBeforeNext:'',
  nextLessonFocus:'',
  confidence:'',
  homeworkEmphasis:'',
  instructorNotes:''
};

function debriefRecord(s,lid) {
  const raw = s?.data?.debriefs?.[lid] || {};
  return {
    ...DEBRIEF_TEMPLATE,
    ...raw,
    instructorNotes: raw.instructorNotes || s?.data?.notes?.[lid] || ''
  };
}

function debriefList(value) {
  return String(value || '')
    .split(/\r?\n|;/)
    .map(item => item.replace(/^[\-\u2022*\s]+/, '').trim())
    .filter(Boolean);
}

// â”€â”€â”€ DARK MODE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function toggleDarkMode() {
  const isDark = document.body.classList.toggle('dark-theme');
  try { localStorage.setItem(DARK_STORE, isDark ? '1' : '0'); } catch(e){}
  const btn = document.getElementById('darkModeBtn');
  if(btn) btn.textContent = isDark ? '?' : '?';
}

function initDarkMode() {
  try {
    if(localStorage.getItem(DARK_STORE) === '1') {
      document.body.classList.add('dark-theme');
    }
  } catch(e){}
}

// ─── PRE-SOLO KNOWLEDGE TEST ────────────────────────────────────────────────
const PRESOLO_SOURCE_LESSONS = ['GL1','GL2','GL3','GL4','GL5','GL6'];
const PRESOLO_PASS_PCT = 80;

function buildPresoloQuestions() {
  const questions = [];
  for(const lid of PRESOLO_SOURCE_LESSONS) {
    const lesson = GL[lid];
    if(!lesson || !lesson.debrief) continue;
    for(const q of lesson.debrief) {
      questions.push({ q, lessonId: lid, lessonTitle: lesson.title, pass: null });
    }
  }
  for(let i=questions.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [questions[i],questions[j]]=[questions[j],questions[i]];
  }
  return questions;
}

// ─── SIDEBAR COLLAPSE ────────────────────────────────────────────────────────
function toggleSidebarCollapse() {
  const collapsed = document.body.classList.toggle('sidebar-collapsed');
  try { localStorage.setItem(COLLAPSE_STORE, collapsed ? '1' : '0'); } catch(e){}
  const btn = document.querySelector('.sidebar-collapse-btn');
  if(btn) btn.innerHTML = collapsed ? '&#8250;' : '&#8249;';
}

function toggleNavGroup(group) {
  const el = document.querySelector(`.nav-group[data-group="${group}"]`);
  if (!el) return;
  const isOpen = el.classList.toggle('nav-group--open');
  try { localStorage.setItem('charlotteaviation_navgroup_' + group, isOpen ? '1' : '0'); } catch(e) {}
}

function initSidebarCollapse() {
  try {
    const stored = localStorage.getItem(COLLAPSE_STORE);
    const shouldCollapse = stored === null || stored === '1';
    if (shouldCollapse) {
      document.body.classList.add('sidebar-collapsed');
      const btn = document.querySelector('.sidebar-collapse-btn');
      if (btn) btn.innerHTML = '&#8250;';
    }
  } catch(e) {}
}

// â”€â”€â”€ MOBILE NAV â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
/**
 * toggleMobileNav() â€” driven by a hamburger button you place in the
 * topbar HTML for screens < 700px.  The sidebar slides in/out via a
 * CSS class. Add to styles.css:
 *
 *   @media(max-width:700px){
 *     #sidebar { position:fixed; left:-100%; z-index:200; height:100%;
 *                transition:left .22s ease; }
 *     #sidebar.open { left:0; }
 *     #sidebarOverlay { display:none; position:fixed; inset:0;
 *                       background:rgba(0,0,0,.4); z-index:199; }
 *     #sidebarOverlay.open { display:block; }
 *   }
 *
 * Required HTML in index.html topbar:
 *   <button id="hamburgerBtn" class="btn btn-ghost btn-sm"
 *     data-click-action="toggle-mobile-nav" style="display:none">â˜°</button>
 *   <div id="sidebarOverlay" data-click-action="close-mobile-nav"></div>
 *
 * The CSS media query will auto-show the button at â‰¤700px.
 */
function toggleMobileNav() {
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebarOverlay');
  const isOpen   = sidebar?.classList.toggle('open');
  overlay?.classList.toggle('open', isOpen);
  // Prevent body scroll while nav is open on mobile
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMobileNav() {
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('sidebarOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

// Close mobile nav automatically whenever the user picks a nav item
function navLessons()          { closeMobileNav(); App.nav('lessons'); }
function nav5PSession(key)     { closeMobileNav(); curToolsTab='5p'; App.nav('tools'); }

// â”€â”€â”€ SIDEBAR QUICK-SEARCH â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
/**
 * quickSearch(query)
 * Searches all GL/FL lesson IDs, titles, and ACS task refs.
 * Results rendered as a dropdown below the search bar.
 */
function quickSearch(query) {
  const box = document.getElementById('searchResults');
  if(!box) return;
  const q = query.trim().toLowerCase();
  if(!q){ box.style.display='none'; box.dataset.firstResult=''; return; }

  const results = [];
  [...Object.values(GL), ...Object.values(FL)].forEach(lesson => {
    const isGL = !!GL[lesson.id];
    const titleMatch = lesson.title.toLowerCase().includes(q);
    const idMatch    = lesson.id.toLowerCase().includes(q);
    if(titleMatch || idMatch){
      results.push({ type: isGL ? 'gnd' : 'flt', id: lesson.id, title: lesson.title, taskRef: null });
    }
    // Also search individual task references / ACS items
    (lesson.tasks||[]).forEach(t => {
      const tRef = (t.ref||'').toLowerCase();
      const tName= (t.name||'').toLowerCase();
      const acsMatch = (lesson.acsItems||[]).some(a=>a.toLowerCase().includes(q));
      if(tRef.includes(q) || tName.includes(q) || acsMatch){
        if(!results.find(r=>r.id===lesson.id)){
          results.push({ type: isGL ? 'gnd' : 'flt', id: lesson.id, title: lesson.title, taskRef: t.ref||null });
        }
      }
    });
  });

  if(!results.length){
    box.style.display='block';
    box.dataset.firstResult='';
    box.innerHTML='<div class="search-noresult">No lessons found for "'+query+'"</div>';
    return;
  }
  box.style.display='block';
  box.dataset.firstResult=results[0].id;
  box.innerHTML = results.slice(0,12).map(r=>`
    <div class="search-result-item" data-click-action="quick-search-go" data-lid="${r.id}">
      <span class="search-result-kind ${r.type}">${r.type==='gnd'?'GND':'FLT'}</span>
      <span class="search-result-id">${r.id}</span>
      <span class="search-result-title">${r.title}${r.taskRef?' · '+r.taskRef:''}</span>
    </div>`).join('');
}

function quickSearchGo(lid) {
  document.getElementById('searchResults').style.display='none';
  document.getElementById('sidebarSearch').value='';
  closeMobileNav();
  App.openLesson(lid);
}

function searchBlur() {
  // Delay to allow click on result to fire first
  setTimeout(()=>{
    const box=document.getElementById('searchResults');
    if(box) box.style.display='none';
  }, 160);
}

function clearModals() {
  const modals = document.getElementById('modals');
  if(modals) modals.innerHTML = '';
}

function clearGoNoGoResult() {
  const result = document.getElementById('goNoGoResult');
  if(result) result.innerHTML = '';
}

function toggleElementDisplay(id) {
  const el = document.getElementById(id);
  if(el) el.style.display = el.style.display === 'block' ? 'none' : 'block';
}

function handleClickAction(el, event) {
  const action = el.dataset.clickAction;
    switch(action){
      case 'close-mobile-nav': closeMobileNav(); break;
      case 'set-mode': App.setMode(el.dataset.mode); break;
      case 'show-add-student': App.showAddStudent(); break;
    case 'quick-search-go': quickSearchGo(el.dataset.lid); break;
    case 'nav': {
      const TOOL_VIEWS = new Set(['xwind','wx','wb','performance','decision','5p']);
      const v = el.dataset.view;
      if(TOOL_VIEWS.has(v)){ curToolsTab=v; App.nav('tools'); }
      else App.nav(v);
      break;
    }
    case 'nav-lessons': navLessons(); break;
    case 'open-lesson': App.openLesson(el.dataset.lid); break;
    case 'open-procedure': App.openProcedure(el.dataset.pid); break;
    case 'open-poh-ref': App.openPohRef(el.dataset.rid); break;
    case 'set-procedure-category': App.setProcedureCategory(el.dataset.category); break;
    case 'set-poh-category': App.setPohCategory(el.dataset.category); break;
    case 'set-homework-view': App.setHomeworkView(el.dataset.homeworkView); break;
    case 'nav-phase-lessons':
      App.nav('lessons');
      setTimeout(()=>App.setPhase(el.dataset.phase),60);
      break;
    case 'select-student-dashboard':
      App.selectStudent(el.dataset.studentId);
      App.nav('dashboard');
      break;
    case 'set-student-grade': App.setStudentGrade(el.dataset.lid, el.dataset.tid, el.dataset.grade); break;
    case 'set-instructor-grade': App.setInstructorGrade(el.dataset.lid, el.dataset.tid, el.dataset.grade); break;
    case 'edit-student': App.editStudent(el.dataset.studentId); break;
    case 'delete-student': App.deleteStudent(el.dataset.studentId); break;
    case 'set-phase': App.setPhase(el.dataset.phase); break;
    case 'set-tab': App.setTab(el.dataset.tab); break;
    case 'toggle-task': App.toggleTask(el.dataset.lid, el.dataset.tid); break;
    case 'toggle-display': toggleElementDisplay(el.dataset.targetId); break;
    case 'toggle-wi':
      event.stopPropagation();
      App.toggleWI(el.dataset.lid, Number(el.dataset.idx));
      break;
    case 'save-note': App.saveNote(el.dataset.lid); break;
    case 'sign-off': App.showSignOffModal(el.dataset.lid); break;
    case 'confirm-sign-off': App.confirmSignOff(el.dataset.lid); break;
    case 'print': window.print(); break;
    case 'copy-endorsement': App.copyEndorsement(el.dataset.reqId); break;
    case 'copy-homework-summary': App.copyHomeworkSummary(el.dataset.lid); break;
    case 'copy-homework-message': App.copyHomeworkMessage(el.dataset.lid); break;
    case 'close-modals': clearModals(); break;
    case 'add-student': App.addStudent(); break;
    case 'save-edit-student': App.saveEditStudent(el.dataset.studentId); break;
    case 'export-data': App.exportData(); break;
    case 'dismiss-backup-prompt': { const b=document.getElementById('backupPromptBanner'); if(b) b.style.display='none'; break; }
    case 'nav-5p-session': App.nav5PSession(el.dataset.sessionKey); break;
    case 'set-srm-item': App.setSRMItem(el.dataset.lid, el.dataset.itemKey, el.dataset.value); break;
    case 'set-srm-standalone': App.setSRMStandalone(el.dataset.sessionKey, el.dataset.itemKey, el.dataset.value); break;
    case 'clear-srm-standalone':
      if(confirm('Clear all items for today?')) App.clearSRMStandalone(el.dataset.sessionKey);
      break;
    case 'wb-toggle-fuel-unit': wbToggleFuelUnit(); break;
    case 'xw-set-rwy': xwSetRwy(Number(el.dataset.heading)); break;
    case 'fetch-weather': fetchKJQFWeather(); break;
    case 'sync-wind-xw': syncWindToXWCalc(); break;
    case 'run-go-no-go': runGoNoGo(); break;
    case 'clear-go-no-go': clearGoNoGoResult(); break;
    case 'save-personal-mins': App.savePersonalMins(); break;
    case 'save-cfi-settings': App.saveCFISettings(); break;
    case 'print-report': App.printReport(); break;
      case 'download-homework-file': App.downloadHomeworkFile(el.dataset.lid); break;
      case 'toggle-mobile-nav': toggleMobileNav(); break;
      case 'toggle-dark-mode': toggleDarkMode(); break;
      case 'toggle-sidebar-collapse': toggleSidebarCollapse(); break;
      case 'toggle-nav-group': toggleNavGroup(el.dataset.group); break;
      case 'start-presolo-test': curPresoloTest=buildPresoloQuestions(); console.log('[presolo] test started, questions:',curPresoloTest.length); App.render(); document.getElementById('content')?.scrollTo(0,0); break;
      case 'cancel-presolo-test': curPresoloTest=null; App.render(); break;
      case 'mark-presolo-q': {
        const idx=parseInt(el.dataset.idx,10);
        const val=el.dataset.val==='pass';
        if(curPresoloTest) curPresoloTest[idx].pass=curPresoloTest[idx].pass===val?null:val;
        App.render(); break;
      }
      case 'submit-presolo-test': App.submitPresoloTest(); break;
      case 'tools-tab':
        curToolsTab = el.dataset.tab;
        App.render();
        break;
    }
  }

function handleChangeAction(el, event) {
  const action = el.dataset.changeAction;
  switch(action){
    case 'select-student': App.selectStudent(el.value); break;
    case 'import-data': App.importData(event); break;
    case 'calc-performance': calcPerformance(); break;
    case 'set-subtask': App.setSubtask(el.dataset.lid, el.dataset.tid, Number(el.dataset.idx), el.checked); break;
    case 'set-task-status': App.setTaskStatus(el.dataset.lid, el.dataset.tid, el.value); break;
    case 'save-stage-check': App.saveStageCheck(el.dataset.lid, el.dataset.field, el.value); break;
    case 'set-srm-notes': App.setSRM(el.dataset.lid, el.dataset.sectionKey, 'notes', el.value); break;
    case 'set-lesson-date': App.setLessonDate(el.dataset.lid, el.dataset.field, el.value); break;
  }
}

function handleInputAction(el) {
  const action = el.dataset.inputAction;
  switch(action){
    case 'quick-search': quickSearch(el.value); break;
    case 'filter-procedures': App.setProcedureSearch(el.value); break;
    case 'filter-poh': App.setPohSearch(el.value); break;
    case 'update-req': App.updateReq(el.dataset.reqId); break;
    case 'save-personal-mins': App.savePersonalMins(); break;
    case 'xw-calc': xwCalc(); break;
    case 'calc-wb': calcWB(); break;
    case 'calc-performance': calcPerformance(); break;
  }
}

function handleFocusAction(el) {
  const action = el.dataset.focusAction;
  if(action === 'quick-search') quickSearch(el.value);
  if(action === 'focus-border' && el.dataset.focusBorder) el.style.borderColor = el.dataset.focusBorder;
}

function handleBlurAction(el) {
  const action = el.dataset.blurAction;
  if(action === 'search-blur') searchBlur();
  if(action === 'blur-border' && el.dataset.blurBorder) el.style.borderColor = el.dataset.blurBorder;
}

function bindEventActions() {
  document.addEventListener('click', event => {
    const stopEl = event.target.closest('[data-stop-prop]');
    if(stopEl){
      event.stopPropagation();
      return;
    }
    if(event.target.classList.contains('modal-bg')){
      clearModals();
      return;
    }
    const actionEl = event.target.closest('[data-click-action]');
    if(actionEl) handleClickAction(actionEl, event);
  });

  document.addEventListener('change', event => {
    const actionEl = event.target.closest('[data-change-action]');
    if(actionEl) handleChangeAction(actionEl, event);
  });

  document.addEventListener('input', event => {
    const actionEl = event.target.closest('[data-input-action]');
    if(actionEl) handleInputAction(actionEl);
  });

  document.addEventListener('focusin', event => {
    const actionEl = event.target.closest('[data-focus-action]');
    if(actionEl) handleFocusAction(actionEl);
  });

  document.addEventListener('focusout', event => {
    const actionEl = event.target.closest('[data-blur-action]');
    if(actionEl) handleBlurAction(actionEl);
  });

  document.addEventListener('keydown', event => {
    if(event.target.id !== 'sidebarSearch') return;
    const resultsBox = document.getElementById('searchResults');
    if(event.key === 'Enter'){
      const firstResult = resultsBox?.dataset.firstResult;
      if(firstResult){
        event.preventDefault();
        quickSearchGo(firstResult);
      }
    } else if(event.key === 'Escape'){
      event.preventDefault();
      event.target.value = '';
      if(resultsBox){
        resultsBox.dataset.firstResult = '';
        resultsBox.style.display = 'none';
      }
    }
  });
}



// â”€â”€â”€ HELPERS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const H={
  statusLabel(status){
    return {
      not_started:'Not Started',
      introduced:'Introduced',
      practiced:'Practiced',
      proficient:'Proficient',
      needs_review:'Needs Review',
      signed_off:'Signed Off',
      in_progress:'In Progress',
      completed:'Completed'
    }[status] || 'Not Started';
  },
  sbadge(status){
    return `<span class="sbadge s-${status}">${this.statusLabel(status)}</span>`;
  },
  emptyState(icon,title,text='',action=''){
    return `<div class="empty">${icon?`<div class="empty-icon">${icon}</div>`:''}<div class="empty-title">${title}</div>${text?`<div class="empty-txt">${text}</div>`:''}${action}</div>`;
  },
  ring(pct,size,color,bg='var(--bg4)'){
    const r=(size-10)/2,c=2*Math.PI*r,dash=(pct/100)*c;
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="display:block"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${bg}" stroke-width="7"/><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="7" stroke-dasharray="${dash} ${c}" stroke-dashoffset="0" stroke-linecap="round" transform="rotate(-90 ${size/2} ${size/2})"/></svg>`;
  },
  /** v3: gauge stat card with SVG ring instrument dial */
  gaugeCard(label, val, valStr, maxStr, pct, color, unit=''){
    return `<div class="gauge-stat">
      <div class="gauge-inner" style="width:84px;height:84px">
        ${this.ring(pct,84,color)}
        <div class="gauge-center" style="position:absolute">
          <span class="gauge-cval" style="color:${color}">${valStr}</span>
          <span class="gauge-csub">${unit}</span>
        </div>
      </div>
      <div class="gauge-lbl">${label}</div>
      <div class="gauge-sub">of ${maxStr}</div>
    </div>`;
  },
  /** v3: touch-friendly grade buttons with aria labels */
  gradeButtons(lid,tid,who,current){
    const colors={U:'var(--red)',M:'var(--orange)',S:'var(--amber)',G:'var(--blue)',E:'var(--green)'};
    const labels={U:'Unsatisfactory',M:'Marginal',S:'Satisfactory',G:'Good',E:'Excellent'};
    return ['U','M','S','G','E'].map(g=>`<button
      class="grade-btn ${current===g?'active-'+g:''}"
      data-click-action="${who==='student'?'set-student-grade':'set-instructor-grade'}"
      data-lid="${lid}"
      data-tid="${tid}"
      data-grade="${g}"
      title="${labels[g]}"
      aria-label="${labels[g]}"
      style="${current===g?'border-color:'+colors[g]+';background:'+colors[g]+';color:#fff':''}"
    >${g}</button>`).join('');
  },
  glProgress(s){
    const all=Object.values(GL),done=all.filter(l=>getLStatus(s,l.id)==='signed_off').length;
    return{done,total:all.length,pct:Math.round(done/all.length*100)};
  },
  flProgress(s){
    const core=Object.values(FL).filter(l=>l.id!=='FL20A'&&l.id!=='FL20B');
    const done=core.filter(l=>getLStatus(s,l.id)==='signed_off').length;
    return{done,total:core.length,pct:Math.round(done/core.length*100)};
  },
  taskProgress(s,lid,tid){
    const lesson=GL[lid]||FL[lid];
    const task=lesson?.tasks?.find(t=>t.id===tid);
    if(!task||!task.subtasks||task.subtasks.length===0)return null;
    const checks=getSubChecks(s,lid,tid);
    const done=task.subtasks.filter((_,i)=>checks[i]).length;
    return{done,total:task.subtasks.length,pct:Math.round(done/task.subtasks.length*100)};
  },
  lessonTaskProgress(s,lid){
    const lesson=GL[lid]||FL[lid];if(!lesson)return{done:0,total:0,pct:0};
    const total=lesson.tasks.length;
    const done=lesson.tasks.filter(t=>getTStatus(s,lid,t.id)==='signed_off').length;
    return{done,total,pct:total>0?Math.round(done/total*100):0};
  },
  needsReview(s){
    if(!s)return[];
    return[...Object.values(GL),...Object.values(FL)].filter(l=>{
      const ts=s.data?.taskStatus?.[l.id]||{};
      return Object.values(ts).some(x=>x==='needs_review');
    });
  },
  needsReviewTaskDetails(s){
    if(!s) return [];
    const details = [];
    [...Object.values(GL), ...Object.values(FL)].forEach(lesson => {
      const taskStatuses = s.data?.taskStatus?.[lesson.id] || {};
      (lesson.tasks || []).forEach(task => {
        if(taskStatuses[task.id] === 'needs_review'){
          details.push({
            lesson,
            task,
            text: task.text || lesson.title
          });
        }
      });
    });
    return details;
  },
  phaseLessonIds(phase){
    return phase?.lessons || [...(phase?.ground||[]), ...(phase?.flight||[])];
  },
  activePhase(s){
    return PHASES.find(p=>this.phaseLessonIds(p).some(lid=>getLStatus(s,lid)!=='signed_off')) || PHASES[PHASES.length-1];
  },
  recommend(s){
    if(!s)return[];
    const recs=[];
    const gp=this.glProgress(s),fp=this.flProgress(s);
    const nr=this.needsReview(s);
    if(nr.length>0)recs.push({icon:'',text:`${nr.length} lesson${nr.length>1?'s':''} need review: ${nr.map(l=>l.id).join(', ')}`});
    if(gp.pct<100&&gp.pct>0)recs.push({icon:'',text:`Ground training is ${gp.pct}% complete with ${gp.total-gp.done} lesson${gp.total-gp.done!==1?'s':''} remaining.`});
    if(getLStatus(s,'FL12')!=='signed_off'&&fp.pct>30)recs.push({icon:'',text:'Stage 1 Check (FL12) is still pending before Stage 2 solo work.'});
    if(getLStatus(s,'FL25')!=='signed_off'&&fp.pct>80)recs.push({icon:'',text:'Stage 2 Check (FL25) is still pending before practical test scheduling.'});
    if(getReq(s,'long_xc')<1)recs.push({icon:'',text:'Long solo cross-country time is still missing before checkride readiness.'});
    if(getReq(s,'night_tgl')<10)recs.push({icon:'',text:`Night full-stop towered landings are at ${getReq(s,'night_tgl')}/10.`});
    if(recs.length===0)recs.push({icon:'',text:'Training is moving normally. Continue through the planned lesson sequence.'});
    return recs;
  },
  nextTrainingAction(s){
    if(!s) return null;
    const allLessons = [...Object.values(GL), ...Object.values(FL)];
    const needsReviewLesson = this.needsReview(s)[0];
    if(needsReviewLesson){
      return {
        title:'Address flagged review items',
        detail:`${needsReviewLesson.id} has tasks marked Needs Review and should be revisited before advancing.`,
        cta:'Open Lesson',
        action:'open-lesson',
        actionAttr:`data-lid="${needsReviewLesson.id}"`,
        tone:'warning'
      };
    }
    const nextUnsigned = allLessons.find(lesson => getLStatus(s, lesson.id) !== 'signed_off');
    if(nextUnsigned){
      const lessonType = lessonTypeLabel(nextUnsigned);
      return {
        title:`Continue with ${nextUnsigned.id}`,
        detail:`Next best action: ${nextUnsigned.title} (${lessonType}) to keep training flow moving in sequence.`,
        cta:'Resume Lesson',
        action:'open-lesson',
        actionAttr:`data-lid="${nextUnsigned.id}"`,
        tone:'primary'
      };
    }
    if(getLStatus(s,'FL26') !== 'signed_off'){
      return {
        title:'Verify checkride readiness',
        detail:'Training items appear complete. Review the report and requirements before scheduling the practical test.',
        cta:'Open Report',
        action:'nav',
        actionAttr:'data-view="reports"',
        tone:'success'
      };
    }
    return {
      title:'Training record complete',
      detail:'All tracked lessons are signed off. Use reports and endorsements to support final documentation.',
      cta:'View Report',
      action:'nav',
      actionAttr:'data-view="reports"',
      tone:'success'
    };
  },
  readinessTone(state){
    return ({
      'Not enough data':'info',
      'In Progress':'warn',
      'Needs Review':'danger',
      'Close':'accent',
      'Instructor Review Recommended':'ok',
      'Milestone Logged':'ok'
    })[state] || 'info';
  },
  readinessChip(state){
    return `<span class="readiness-chip readiness-chip-${this.readinessTone(state)}">${state}</span>`;
  },
  readinessSnapshot(s){
    if(!s)return null;
    const presoloIds=(FL_STAGES.find(st=>st.id===1)?.lessons||[]).filter(lid=>FL[lid]);
    const finalPrepIds=['FL21','FL22','FL23','FL24','FL25'];
    const allLessons=[...Object.values(GL),...Object.values(FL)];
    const reqDone=REQS.filter(r=>getReq(s,r.id)>=r.min).length;
    const unmetReqs=REQS.filter(r=>getReq(s,r.id)<r.min);
    const reviewLessons=this.needsReview(s);
    const startedLessons=allLessons.filter(l=>getLStatus(s,l.id)!=='not_started').length;
    const sparse=startedLessons===0&&reqDone===0&&reviewLessons.length===0;
    const uniqueItems=items=>[...new Set(items.filter(Boolean))];
    const lessonReviewDetails=ids=>ids.map(lid=>{
      const lesson=GL[lid]||FL[lid];
      if(!lesson)return null;
      const reviewCount=Object.values(s.data?.taskStatus?.[lid]||{}).filter(x=>x==='needs_review').length;
      return reviewCount>0?{lid,title:lesson.title,count:reviewCount}:null;
    }).filter(Boolean);
    const presoloDone=presoloIds.filter(lid=>getLStatus(s,lid)==='signed_off').length;
    const presoloPct=presoloIds.length?Math.round(presoloDone/presoloIds.length*100):0;
    const presoloReview=lessonReviewDetails(presoloIds);
    const presoloStarted=presoloIds.filter(lid=>getLStatus(s,lid)!=='not_started').length;
    const presoloRemaining=presoloIds.filter(lid=>getLStatus(s,lid)!=='signed_off');
    const stageOneCheck=getLStatus(s,'FL12');
    const firstSolo=getLStatus(s,'FL11');
    const finalPrepDone=finalPrepIds.filter(lid=>getLStatus(s,lid)==='signed_off').length;
    const finalPrepPct=finalPrepIds.length?Math.round(finalPrepDone/finalPrepIds.length*100):0;
    const finalPrepReview=lessonReviewDetails(finalPrepIds);
    const stageTwoCheck=getLStatus(s,'FL25');
    const practicalTest=getLStatus(s,'FL26');
    const gp=this.glProgress(s),fp=this.flProgress(s);

    const soloStrong=[];
    if(firstSolo==='signed_off') soloStrong.push('First solo lesson is already logged in the training record.');
    if(stageOneCheck==='signed_off') soloStrong.push('Stage 1 check is signed off.');
    if(presoloPct>=75) soloStrong.push(`${presoloDone}/${presoloIds.length} pre-solo flight lessons are signed off.`);
    if(presoloStarted>0&&presoloReview.length===0) soloStrong.push('No pre-solo lessons are currently flagged for review.');

    const soloBlockers=[];
    if(stageOneCheck!=='signed_off') soloBlockers.push('Stage 1 check is still pending.');
    if(presoloReview.length>0) soloBlockers.push(`${presoloReview.length} pre-solo lesson${presoloReview.length===1?' is':'s are'} flagged for review.`);
    if(firstSolo!=='signed_off'&&presoloRemaining.length>3) soloBlockers.push(`${presoloRemaining.length} pre-solo flight lessons are not yet signed off.`);

    let soloState='In Progress';
    if(firstSolo==='signed_off') soloState='Milestone Logged';
    else if(sparse||presoloStarted===0) soloState='Not enough data';
    else if(presoloReview.length>0) soloState='Needs Review';
    else if(stageOneCheck==='signed_off') soloState='Instructor Review Recommended';
    else if(presoloPct>=70) soloState='Close';

    const soloSummary = soloState==='Milestone Logged'
      ? 'A first-solo lesson is already logged. Use the lesson record and endorsements separately for instructor decisions.'
      : soloState==='Instructor Review Recommended'
      ? 'Tracked pre-solo lessons and the Stage 1 check suggest the student is ready for a focused instructor solo review.'
      : soloState==='Close'
      ? 'Most pre-solo training signals are in place, with a few remaining items before an instructor solo review.'
      : soloState==='Needs Review'
      ? 'Pre-solo progress is active, but current review items should be addressed before using this as a solo-planning signal.'
      : soloState==='Not enough data'
      ? 'The app does not yet have enough tracked lesson progress to support a useful solo readiness snapshot.'
      : 'The student is still building toward solo readiness through pre-solo lessons and checks.';

    const soloNextStep = presoloReview[0]
      ? `Revisit ${presoloReview[0].lid} ${presoloReview[0].title} before moving forward.`
      : stageOneCheck!=='signed_off'
      ? 'Continue through the remaining pre-solo lesson flow and prepare for the Stage 1 check.'
      : firstSolo!=='signed_off'
      ? 'Review FL11 and make the next instructor solo decision using the lesson record.'
      : 'Use the lessons and reports views to document the next solo milestone.';

    const checkrideStrong=[];
    if(practicalTest==='signed_off') checkrideStrong.push('The practical test milestone is already logged in the training record.');
    if(stageTwoCheck==='signed_off') checkrideStrong.push('Stage 2 check is signed off.');
    if(unmetReqs.length===0) checkrideStrong.push('All tracked Sec. 61.109 requirements are currently met.');
    if(finalPrepPct>=60) checkrideStrong.push(`${finalPrepDone}/${finalPrepIds.length} final review lessons are signed off.`);
    if(reviewLessons.length===0&&startedLessons>0) checkrideStrong.push('No current lesson review flags are open in the tracker.');

    const checkrideBlockers=[];
    if(unmetReqs.length>0) checkrideBlockers.push(`${unmetReqs.length} tracked requirement${unmetReqs.length===1?' is':'s are'} still incomplete.`);
    if(reviewLessons.length>0) checkrideBlockers.push(`${reviewLessons.length} lesson${reviewLessons.length===1?' is':'s are'} marked Needs Review.`);
    if(stageTwoCheck!=='signed_off') checkrideBlockers.push('Stage 2 check is still pending.');
    if(stageTwoCheck!=='signed_off'&&finalPrepDone<3) checkrideBlockers.push('Late-stage review lessons are still in progress.');

    let checkrideState='In Progress';
    if(practicalTest==='signed_off') checkrideState='Milestone Logged';
    else if(sparse&&(gp.pct<15&&fp.pct<15)) checkrideState='Not enough data';
    else if(reviewLessons.length>=2) checkrideState='Needs Review';
    else if(unmetReqs.length===0&&stageTwoCheck==='signed_off'&&reviewLessons.length===0) checkrideState='Instructor Review Recommended';
    else if(unmetReqs.length<=2&&finalPrepPct>=60&&reviewLessons.length<=1) checkrideState='Close';

    const checkrideSummary = checkrideState==='Milestone Logged'
      ? 'The practical test milestone is logged. Continue using reports and lesson records for documentation.'
      : checkrideState==='Instructor Review Recommended'
      ? 'Tracked requirements, final review lessons, and review flags suggest the student is ready for a focused instructor checkride review.'
      : checkrideState==='Close'
      ? 'Most tracked checkride-prep signals are in place, with a short list of remaining items to complete.'
      : checkrideState==='Needs Review'
      ? 'Current review flags or weak areas should be resolved before relying on this as a checkride-planning snapshot.'
      : checkrideState==='Not enough data'
      ? 'The tracker does not yet contain enough lesson and requirement progress to support a useful checkride snapshot.'
      : 'The student is still working through tracked requirements and final review milestones.';

    const checkrideNextStep = reviewLessons[0]
      ? `Revisit ${reviewLessons[0].id} ${reviewLessons[0].title} and clear the review flag.`
      : unmetReqs[0]
      ? `Complete the remaining ${unmetReqs[0].label.toLowerCase()} requirement and refresh the report.`
      : stageTwoCheck!=='signed_off'
      ? 'Complete the Stage 2 check and review remaining final-prep lessons.'
      : 'Review the report, endorsements, and instructor notes before any practical test planning.';

    const overallStrong=uniqueItems([...soloStrong,...checkrideStrong]).slice(0,4);
    const overallBlockers=uniqueItems([...soloBlockers,...checkrideBlockers]).slice(0,4);

    return {
      note:'Instructional planning summary only. This app summarizes tracked lessons, requirements, and review flags, but it does not replace instructor judgement, endorsements, or FAA eligibility determinations.',
      solo:{
        state:soloState,
        summary:soloSummary,
        nextStep:soloNextStep,
        strongestSignals:uniqueItems(soloStrong).slice(0,3),
        blockers:uniqueItems(soloBlockers).slice(0,3),
        indicators:[
          {label:'Pre-Solo Flights',value:`${presoloDone}/${presoloIds.length}`,sub:'flight lessons signed off'},
          {label:'Stage 1 Check',value:stageOneCheck==='signed_off'?'Done':'Pending',sub:'independent pre-solo checkpoint'},
          {label:'Review Flags',value:String(presoloReview.length),sub:'pre-solo lessons needing work'}
        ]
      },
      checkride:{
        state:checkrideState,
        summary:checkrideSummary,
        nextStep:checkrideNextStep,
        strongestSignals:uniqueItems(checkrideStrong).slice(0,3),
        blockers:uniqueItems(checkrideBlockers).slice(0,3),
        indicators:[
          {label:'Requirements',value:`${reqDone}/${REQS.length}`,sub:'tracked aeronautical experience'},
          {label:'Stage 2 Check',value:stageTwoCheck==='signed_off'?'Done':'Pending',sub:'final internal checkpoint'},
          {label:'Final Review',value:`${finalPrepDone}/${finalPrepIds.length}`,sub:'late-stage lessons signed off'}
        ]
      },
      overall:{
        strongestSignals:overallStrong,
        blockers:overallBlockers,
        lessonNote:`Solo: ${soloState}. Checkride: ${checkrideState}.`
      }
    };
  },
  renderReadinessCard(title,data){
    return `<div class="readiness-card">
      <div class="readiness-card-head">
        <div>
          <div class="readiness-card-title">${title}</div>
          <div class="readiness-card-summary">${data.summary}</div>
        </div>
        ${this.readinessChip(data.state)}
      </div>
      <div class="readiness-indicators">
        ${data.indicators.map(item=>`<div class="readiness-indicator"><div class="readiness-indicator-label">${item.label}</div><div class="readiness-indicator-value">${item.value}</div><div class="readiness-indicator-sub">${item.sub}</div></div>`).join('')}
      </div>
      <div class="readiness-columns">
        <div>
          <div class="section-label">Strongest Signals</div>
          ${data.strongestSignals.length?`<div class="readiness-list">${data.strongestSignals.map(item=>`<div class="readiness-list-item">${item}</div>`).join('')}</div>`:'<div class="report-empty">No strong signals tracked yet.</div>'}
        </div>
        <div>
          <div class="section-label">Current Blockers</div>
          ${data.blockers.length?`<div class="readiness-list">${data.blockers.map(item=>`<div class="readiness-list-item readiness-list-item-warn">${item}</div>`).join('')}</div>`:'<div class="report-empty">No major blockers are currently visible in tracked data.</div>'}
        </div>
      </div>
      <div class="readiness-next"><strong>Recommended next step:</strong> ${data.nextStep}</div>
    </div>`;
  },
  readinessDecisionSignal(s){
    if(!s) return { key:'readiness', tone:'insufficient', label:'Student Readiness', summary:'No student selected.', detail:'Select a student to use tracked lesson progress and review flags.' };
    const snapshot = this.readinessSnapshot(s);
    const reviewLessons = this.needsReview(s);
    if(!snapshot) return { key:'readiness', tone:'insufficient', label:'Student Readiness', summary:'Readiness snapshot unavailable.', detail:'The readiness layer does not have enough information yet.' };
    if(snapshot.solo.state === 'Not enough data' && snapshot.checkride.state === 'Not enough data') {
      return { key:'readiness', tone:'insufficient', label:'Student Readiness', summary:'Sparse tracked progress.', detail:'The app does not yet have enough lesson progress to support a strong readiness signal.' };
    }
    if(reviewLessons.length || snapshot.solo.state === 'Needs Review' || snapshot.checkride.state === 'Needs Review') {
      return { key:'readiness', tone:'caution', label:'Student Readiness', summary:'Open review items are still tracked.', detail:reviewLessons[0] ? `${reviewLessons[0].id} ${reviewLessons[0].title} is currently marked Needs Review.` : snapshot.overall.blockers[0] || 'Resolve tracked review items before treating this as a clean training day.' };
    }
    if(snapshot.solo.state === 'Close' || snapshot.checkride.state === 'Close' || snapshot.solo.state === 'Instructor Review Recommended' || snapshot.checkride.state === 'Instructor Review Recommended') {
      return { key:'readiness', tone:'caution', label:'Student Readiness', summary:'Training is active, but instructor review is still appropriate.', detail:snapshot.overall.lessonNote };
    }
    return { key:'readiness', tone:'go', label:'Student Readiness', summary:'No major readiness blocker is visible in tracked data.', detail:snapshot.overall.strongestSignals[0] || snapshot.overall.lessonNote };
  },
  weatherDecisionSignal(s){
    if(!s) return { key:'weather', tone:'insufficient', label:'Weather', summary:'No student selected.', detail:'Select a student to compare conditions against personal minimums.' };
    const metarRaw = window._lastMetarRaw || '';
    const wind = window._lastMetarWind;
    if(!metarRaw) {
      return { key:'weather', tone:'insufficient', label:'Weather', summary:'Weather information not confirmed.', detail:'No current weather observation is stored in this session. Verify official sources before flight.' };
    }
    const mins = (s.data && s.data.personalMins) || { windSpd:15, windGust:20, crosswind:10, vis:5, ceiling:3000 };
    const parseFraction = str => str.trim().split(/\s+/).reduce((sum, part) => {
      const [n, d] = part.split('/');
      return sum + (d ? parseInt(n, 10) / parseInt(d, 10) : parseFloat(n));
    }, 0);
    const visMatch = metarRaw.match(/\b(\d+(?:\s+\d+\/\d+)?|\d+\/\d+)SM\b/);
    const parsedVis = visMatch ? parseFraction(visMatch[1]) : null;
    const ceilMatch = metarRaw.match(/\b(?:BKN|OVC)(\d{3})\b/);
    const parsedCeil = ceilMatch ? parseInt(ceilMatch[1],10) * 100 : null;
    let xw = null;
    if(wind && wind.dir !== 'VRB' && wind.speed > 0) {
      const wdRad = (parseInt(wind.dir,10) - 20) * Math.PI / 180;
      xw = Math.abs(wind.speed * Math.sin(wdRad));
    }
    const checks = [
      { label:'Wind speed', actual:wind ? wind.speed : null, limit:mins.windSpd, isMin:false },
      { label:'Wind gust', actual:wind && wind.gust ? wind.gust : (wind ? 0 : null), limit:mins.windGust, isMin:false },
      { label:'Crosswind', actual:xw, limit:mins.crosswind, isMin:false },
      { label:'Visibility', actual:parsedVis, limit:mins.vis, isMin:true },
      { label:'Ceiling', actual:parsedCeil, limit:mins.ceiling, isMin:true }
    ];
    const missing = checks.filter(item => item.actual === null);
    const nogo = checks.filter(item => item.actual !== null && (item.isMin ? item.actual < item.limit : item.actual > item.limit));
    const caution = checks.filter(item => item.actual !== null && !nogo.includes(item) && (item.isMin ? item.actual < item.limit * 1.2 : item.actual > item.limit * 0.8));
    if(nogo.length) {
      return { key:'weather', tone:'nogo', label:'Weather', summary:'Current conditions exceed stored personal minimums.', detail:`${nogo[0].label} is outside the current student minimum.` };
    }
    if(caution.length || missing.length) {
      return { key:'weather', tone:'caution', label:'Weather', summary:missing.length ? 'Weather data is only partially confirmed.' : 'Conditions are near stored personal minimums.', detail:missing.length ? 'One or more weather items could not be confirmed from the current observation.' : `${caution[0].label} is near the current student minimum.` };
    }
    return { key:'weather', tone:'go', label:'Weather', summary:'No major weather conflict is visible in the current session data.', detail:'Current stored observation is within the student personal minimum checks used by the app.' };
  },
  weightBalanceDecisionSignal(){
    const wb = window._lastWeightBalance || null;
    if(!wb) {
      return { key:'wb', tone:'insufficient', label:'Weight & Balance', summary:'No W&B calculation has been run.', detail:'Open the Weight & Balance tool and enter the planned loading.' };
    }
    if(!wb.hasLoadData) {
      return { key:'wb', tone:'insufficient', label:'Weight & Balance', summary:'Only the empty-aircraft baseline is currently shown.', detail:'Enter the actual crew, fuel, baggage, and passenger loading before using this as a go/no-go signal.' };
    }
    if(wb.overweight || wb.cgForward || wb.cgAft) {
      return { key:'wb', tone:'nogo', label:'Weight & Balance', summary:weightBalanceStatus(wb), detail:weightBalanceMessage(wb) };
    }
    return { key:'wb', tone:'go', label:'Weight & Balance', summary:'Current loading is within the modeled Cherokee 140 limits.', detail:`${wb.totalWeight.toFixed(2)} lbs | CG ${wb.cg.toFixed(2)} in | limits ${wb.forwardLimit.toFixed(2)} to ${wb.aftLimit.toFixed(2)} in.` };
  },
  lessonDecisionSignal(s){
    if(!s) return null;
    const reviewLesson = this.needsReview(s)[0] || null;
    const allLessons = [...Object.values(GL), ...Object.values(FL)];
    const lesson = (curView === 'lesson' && curLesson ? (GL[curLesson] || FL[curLesson]) : null)
      || reviewLesson
      || allLessons.find(item => getLStatus(s,item.id) !== 'signed_off')
      || null;
    if(!lesson) return null;
    const tone = lesson.isSolo || lesson.isStageCheck ? 'caution' : 'info';
    const summary = lesson.isSolo
      ? `Current lesson context: ${lesson.id} ${lesson.title} (solo milestone).`
      : lesson.isStageCheck
      ? `Current lesson context: ${lesson.id} ${lesson.title} (checkpoint lesson).`
      : `Current lesson context: ${lesson.id} ${lesson.title}.`;
    const detail = lesson.scenario || lesson.title;
    return { key:'lesson', tone, label:'Lesson Context', summary, detail, lesson };
  },
  preflightDecision(s){
    if(!s) {
      return {
        state:'INSUFFICIENT DATA',
        summary:'Select a student and confirm loading, weather, and readiness signals before using this panel.',
        note:'Training decision support only. Instructor judgment required. Not a substitute for official weather, aircraft, or operational decision making.',
        signals:[
          { key:'wb', tone:'insufficient', label:'Weight & Balance', summary:'No loading context available.', detail:'Run the Weight & Balance tool with the planned loading.' },
          { key:'readiness', tone:'insufficient', label:'Student Readiness', summary:'No student selected.', detail:'Choose a student to use tracked readiness data.' },
          { key:'weather', tone:'insufficient', label:'Weather', summary:'No weather context confirmed.', detail:'Open Weather Brief and verify official sources.' }
        ],
        actions:[
          { label:'Open Weight & Balance', action:'nav', attrs:'data-view="wb"' },
          { label:'Open Weather Brief', action:'nav', attrs:'data-view="wx"' },
          { label:'Select Student', action:'nav', attrs:'data-view="students"' }
        ],
        guidance:['Select a student first.','Enter the planned W&B loading.','Verify official weather sources before flight.']
      };
    }
    const wb = this.weightBalanceDecisionSignal();
    const readiness = this.readinessDecisionSignal(s);
    const weather = this.weatherDecisionSignal(s);
    const lesson = this.lessonDecisionSignal(s);
    const signals = [wb, readiness, weather, ...(lesson ? [lesson] : [])];

    let state = 'GO';
    if(wb.tone === 'nogo' || weather.tone === 'nogo') state = 'NO-GO';
    else if(wb.tone === 'insufficient') state = 'INSUFFICIENT DATA';
    else if(readiness.tone === 'insufficient' && weather.tone === 'insufficient') state = 'INSUFFICIENT DATA';
    else if(readiness.tone === 'caution' || weather.tone === 'caution' || lesson?.tone === 'caution' || weather.tone === 'insufficient') state = 'CAUTION';

    const guidance = [];
    if(wb.tone === 'nogo' || wb.tone === 'insufficient') guidance.push(wb.detail);
    if(weather.tone === 'nogo' || weather.tone === 'caution' || weather.tone === 'insufficient') guidance.push(weather.detail);
    if(readiness.tone === 'caution' || readiness.tone === 'insufficient') guidance.push(readiness.detail);
    if(lesson?.tone === 'caution') guidance.push('Use higher instructor scrutiny for the current lesson context.');

    const combined = this.combinedGuidanceBundles(s).items[0] || null;
    const actions = [
      { label:'Open Weight & Balance', action:'nav', attrs:'data-view="wb"' },
      { label:'Open Weather Brief', action:'nav', attrs:'data-view="wx"' },
      { label:'Open Reports', action:'nav', attrs:'data-view="reports"' }
    ];
    if(lesson?.lesson) actions.push({ label:`Open ${lesson.lesson.id}`, action:'open-lesson', attrs:`data-lid="${lesson.lesson.id}"` });
    if(combined?.procedure) actions.push({ label:'Open Procedure', action:'open-procedure', attrs:`data-pid="${combined.procedure.id}"` });
    if(combined?.pohRef) actions.push({ label:'Open POH Reference', action:'open-poh-ref', attrs:`data-rid="${combined.pohRef.id}"` });

    const summary = state === 'NO-GO'
      ? 'A strong blocker is currently visible in the available training inputs.'
      : state === 'CAUTION'
      ? 'No hard stop is visible from every source, but one or more caution items should be reviewed before flying.'
      : state === 'INSUFFICIENT DATA'
      ? 'Critical planning inputs are still missing or unconfirmed.'
      : 'Current app signals do not show a major blocker, but instructor judgment is still required.';

    return {
      state,
      summary,
      note:'Training decision support only. Instructor judgment required. Not a substitute for official weather, aircraft, or operational decision making.',
      signals,
      guidance:[...new Set(guidance.filter(Boolean))].slice(0,5),
      actions:actions.slice(0,5)
    };
  },
  procedureLessonLinks(procedure){
    return (procedure?.relatedLessonIds || []).map(lid => GL[lid] || FL[lid]).filter(Boolean);
  },
  relatedProceduresForLesson(lid){
    return AIRCRAFT_PROCEDURES.filter(item => (item.relatedLessonIds || []).includes(lid));
  },
  procedureSearchText(procedure){
    return [
      procedure.title,
      procedure.category,
      procedure.summary,
      ...(procedure.checklist || []),
      ...(procedure.setup || []),
      ...(procedure.entry || []),
      ...(procedure.execution || []),
      ...(procedure.recovery || []),
      ...(procedure.targetSpeeds || []),
      ...(procedure.callouts || []),
      ...(procedure.warnings || []),
      ...(procedure.relatedLessonIds || [])
    ].join(' ').toLowerCase();
  },
  filteredProcedures(){
    const query = curProcedureSearch.trim().toLowerCase();
    return AIRCRAFT_PROCEDURES.filter(item => {
      const categoryOk = curProcedureCategory === 'all' || item.category === curProcedureCategory;
      if(!categoryOk) return false;
      if(!query) return true;
      return this.procedureSearchText(item).includes(query);
    });
  },
  procedureSourceMarkup(procedure){
    if(!procedure) return '';
    return `<a class="btn btn-ghost btn-sm" href="${procedureSourceHref(procedure.sourcePage)}" target="_blank" rel="noopener noreferrer">View PDF Page ${procedure.sourcePage}</a>`;
  },
  pohSourceMarkup(ref){
    if(!ref) return '';
    return `<a class="btn btn-ghost btn-sm" href="${pohSourceHref(ref.sourcePage)}" target="_blank" rel="noopener noreferrer">View POH Page ${ref.sourcePage}</a>`;
  },
  pohSearchText(ref){
    return [
      ref.title,
      ref.summary,
      ref.type,
      ref.category,
      ref.sourceSection,
      ...(ref.keyPoints || []),
      ...(ref.limitations || []),
      ...(ref.relatedLessonIds || []),
      ...(ref.relatedProcedureIds || [])
    ].join(' ').toLowerCase();
  },
  filteredPohRefs(){
    const query = curPohSearch.trim().toLowerCase();
    return POH_REFERENCES.filter(item => {
      const categoryOk = curPohCategory === 'all' || item.category === curPohCategory;
      if(!categoryOk) return false;
      if(!query) return true;
      return this.pohSearchText(item).includes(query);
    });
  },
  relatedPohRefsForLesson(lid){
    return POH_REFERENCES.filter(item => (item.relatedLessonIds || []).includes(lid));
  },
  relatedPohRefsForProcedure(pid){
    return POH_REFERENCES.filter(item => (item.relatedProcedureIds || []).includes(pid));
  },
  pohRefsForWeightBalance(){
    return POH_REFERENCES.filter(item => item.category === 'wb' || item.id === 'poh-takeoff-distance-chart' || item.id === 'poh-landing-and-glide').slice(0,4);
  },
  performancePohRefs(){
    return POH_REFERENCES.filter(item => item.category === 'performance');
  },
  performancePohRefsForMode(mode){
    const ids = mode === 'takeoff'
      ? ['poh-takeoff-distance-chart','poh-takeoff-and-climb','poh-climb-and-tas-charts']
      : ['poh-landing-and-glide','poh-cruise-and-landing'];
    return ids.map(id => POH_REFERENCES_BY_ID[id]).filter(Boolean);
  },
  performanceProceduresForMode(mode){
    const ids = mode === 'takeoff'
      ? ['short-field-takeoff','soft-field-takeoff','traffic-pattern-operation']
      : ['short-field-landing','soft-field-landing','traffic-pattern-operation'];
    return ids.map(id => PROCEDURES_BY_ID[id]).filter(Boolean);
  },
  performanceLessonContext(s){
    const signal = this.lessonDecisionSignal(s);
    if(!signal?.lesson) return null;
    const lesson = signal.lesson;
    return {
      lesson,
      summary: lesson.isSolo
        ? `${lesson.id} ${lesson.title} is a higher-scrutiny solo milestone lesson.`
        : lesson.isStageCheck
        ? `${lesson.id} ${lesson.title} is a checkpoint lesson that should be briefed conservatively.`
        : `${lesson.id} ${lesson.title} is the current lesson context.`
    };
  },
  performanceSupportData(s, inputs){
    const fieldElevation = Number.isFinite(inputs.fieldElevation) ? inputs.fieldElevation : 705;
    const altimeter = Number.isFinite(inputs.altimeter) ? inputs.altimeter : 29.92;
    const oat = Number.isFinite(inputs.oat) ? inputs.oat : null;
    const runwayLength = Number.isFinite(inputs.runwayLength) ? inputs.runwayLength : null;
    const surface = inputs.surface || 'paved-dry';
    const pressureAltitude = fieldElevation + ((29.92 - altimeter) * 1000);
    const isaTemp = 15 - (2 * (pressureAltitude / 1000));
    const densityAltitude = oat === null ? null : pressureAltitude + (120 * (oat - isaTemp));
    const wb = window._lastWeightBalance || null;
    const wbStatus = wb ? weightBalanceStatus(wb) : 'No current W&B calculation';
    const wbInvalid = !!(wb && wb.hasLoadData && (wb.overweight || wb.cgForward || wb.cgAft));
    const weightRatio = wb && wb.hasLoadData ? wb.totalWeight / CHEROKEE_WB_PROFILE.maxGross : null;
    const lessonContext = this.performanceLessonContext(s);
    const baseline = CHEROKEE_PERFORMANCE_BASELINE;

    const topTone = wbInvalid ? 'alert' : densityAltitude !== null && densityAltitude >= 5000 ? 'warn' : 'ok';
    const summary = wbInvalid
      ? 'Correct the current aircraft loading before using performance planning guidance.'
      : densityAltitude === null
      ? 'Enter OAT to add a density altitude estimate. The planning guidance below can still help frame the review.'
      : densityAltitude >= 5000
      ? 'Density altitude is high enough to justify an especially conservative takeoff and climb briefing.'
      : densityAltitude >= 3000
      ? 'Density altitude is elevated. Review the takeoff, climb, and landing references before flight.'
      : 'Use the handbook charts and the current loading to confirm takeoff and landing planning.'

    const takeoffNotes = [];
    const landingNotes = [];
    const generalNotes = [];
    const takeoffModifiers = [];
    const landingModifiers = [];

    if(densityAltitude === null) {
      generalNotes.push('Density altitude estimate is unavailable until OAT is entered.');
    } else {
      generalNotes.push(`Density altitude estimate: ${Math.round(densityAltitude).toLocaleString()} ft. Higher density altitude reduces climb and increases distance required.`);
      if(densityAltitude > 4000) {
        takeoffModifiers.push('High density altitude');
        landingModifiers.push('High density altitude');
        takeoffNotes.push('Higher density altitude can significantly increase takeoff distance and reduce climb performance.');
        landingNotes.push('High density altitude can increase true groundspeed on approach and should tighten landing planning margin.');
      } else if(densityAltitude > 2500) {
        takeoffModifiers.push('Elevated density altitude');
        takeoffNotes.push('Higher density altitude can noticeably increase takeoff roll and reduce initial climb performance.');
      }
    }

    if(runwayLength !== null) {
      if(runwayLength < 2000) {
        takeoffModifiers.push('Short runway');
        landingModifiers.push('Short runway');
        takeoffNotes.push('Runway length entered is short enough that a full POH takeoff-distance review is strongly recommended.');
        landingNotes.push('Runway length entered is short enough that landing distance and go-around planning should be reviewed carefully.');
      } else if(runwayLength < 3000) {
        takeoffModifiers.push('Runway margin limited');
        landingModifiers.push('Runway margin limited');
        takeoffNotes.push('Runway length is limited enough to justify a short-field briefing and POH chart review.');
        landingNotes.push('Landing distance margin may be tighter than normal. Review touchdown and rollout planning.');
      } else {
        generalNotes.push(`Runway available: ${runwayLength.toLocaleString()} ft. Margin appears more comfortable relative to baseline reference, but POH review still matters.`);
      }
    } else {
      generalNotes.push('Runway length is not entered. Add runway available to tighten the planning guidance.');
    }

    if(surface === 'grass-soft') {
      takeoffModifiers.push('Grass / soft surface');
      landingModifiers.push('Grass / soft surface');
      takeoffNotes.push('Grass or soft surface should be treated conservatively and briefed with the soft-field procedure.');
      landingNotes.push('Grass or soft surface can increase landing roll and should be reviewed conservatively.');
    } else if(surface === 'wet-contaminated') {
      takeoffModifiers.push('Wet / contaminated surface');
      landingModifiers.push('Wet / contaminated surface');
      takeoffNotes.push('Wet or contaminated surface can reduce acceleration and increase takeoff distance planning margin.');
      landingNotes.push('Wet or contaminated surface can lengthen stopping distance. Review landing distance and braking assumptions in the POH.');
    }

    if(wb && wb.hasLoadData) {
      generalNotes.push(`Current W&B loading: ${wb.totalWeight.toFixed(2)} lbs, CG ${wb.cg.toFixed(2)} in (${wbStatus}).`);
      if(wbInvalid) {
        takeoffModifiers.unshift('W&B out of limits');
        landingModifiers.unshift('W&B out of limits');
        takeoffNotes.unshift('Current W&B loading is out of limits. Correct loading before any takeoff performance planning.');
        landingNotes.unshift('Current W&B loading is out of limits. Correct loading before relying on landing performance planning.');
      } else if(weightRatio !== null && weightRatio >= 0.95) {
        takeoffModifiers.push('Weight near max gross');
        landingModifiers.push('Weight near max gross');
        takeoffNotes.push('Current loading is near maximum gross weight. Expect reduced climb and longer takeoff distance.');
        landingNotes.push('Higher weight increases landing energy and should tighten runway-margin planning.');
      } else if(weightRatio !== null && weightRatio >= 0.85) {
        takeoffModifiers.push('Higher weight loading');
        takeoffNotes.push('Loading is in the upper portion of the envelope. Use the POH performance charts, not a rule-of-thumb alone.');
      }
    } else {
      takeoffModifiers.push('Weight context missing');
      landingModifiers.push('Weight context missing');
      generalNotes.push('No current W&B loading is available. Use the Weight & Balance tool before relying on loading-sensitive planning cues.');
    }

    if(lessonContext?.lesson) {
      const title = `${lessonContext.lesson.id} ${lessonContext.lesson.title}`.toLowerCase();
      if(/short-field|soft-field|takeoff/.test(title)) {
        takeoffNotes.push(`Current lesson context: ${lessonContext.summary}`);
      } else if(/landing|pattern/.test(title)) {
        landingNotes.push(`Current lesson context: ${lessonContext.summary}`);
      } else {
        generalNotes.push(lessonContext.summary);
      }
    }

    if(!takeoffNotes.length) takeoffNotes.push('Use the takeoff distance chart and takeoff/climb operating reference to confirm current conditions.');
    if(!landingNotes.length) landingNotes.push('Use the landing distance chart and approach/landing operating reference to confirm current conditions.');

    const runwayTakeoffSupport = runwayLength === null
      ? 'Runway margin cannot be judged until runway length is entered.'
      : wbInvalid
      ? 'Runway margin discussion should wait until the loading issue is corrected.'
      : runwayLength < 2000
      ? 'Runway length may be limiting when combined with current conditions.'
      : runwayLength < 3000
      ? 'Runway length deserves extra caution under the current planning assumptions.'
      : 'Runway length appears more comfortable relative to the baseline reference, but current conditions still require POH review.';
    const runwayLandingSupport = runwayLength === null
      ? 'Landing runway margin cannot be judged until runway length is entered.'
      : wbInvalid
      ? 'Correct the loading issue before relying on landing performance support.'
      : runwayLength < 2000
      ? 'Short runway landing planning deserves extra caution under current conditions.'
      : runwayLength < 3000
      ? 'Runway margin may be tighter than usual for landing under current conditions.'
      : 'Runway length appears comfortable relative to baseline landing reference, but margin should still be confirmed with the POH.';

    const takeoffTone = wbInvalid ? 'alert' : (densityAltitude !== null && densityAltitude >= 3000) || surface !== 'paved-dry' || (runwayLength !== null && runwayLength < 3000) || (weightRatio !== null && weightRatio >= 0.9) ? 'warn' : 'ok';
    const landingTone = wbInvalid ? 'alert' : surface === 'wet-contaminated' || (runwayLength !== null && runwayLength < 3000) || (weightRatio !== null && weightRatio >= 0.95) ? 'warn' : 'ok';

    return {
      baseline,
      summary,
      tone: topTone,
      pressureAltitude,
      densityAltitude,
      isaTemp,
      wb,
      wbStatus,
      wbInvalid,
      lessonContext,
      generalNotes: generalNotes.slice(0,4),
      takeoff:{
        tone: takeoffTone,
        heading: 'Takeoff Planning Support',
        summary: wbInvalid ? 'Correct loading first.' : 'Use current runway, density altitude, and loading context to brief takeoff performance conservatively.',
        baseline: baseline.takeoff,
        modifiers: [...new Set(takeoffModifiers)].slice(0,4),
        runwaySupport: runwayTakeoffSupport,
        notes: takeoffNotes.slice(0,4),
        pohRefs: this.performancePohRefsForMode('takeoff'),
        procedures: this.performanceProceduresForMode('takeoff')
      },
      landing:{
        tone: landingTone,
        heading: 'Landing Planning Support',
        summary: wbInvalid ? 'Correct loading first.' : 'Use runway margin, surface, and current loading to review landing planning conservatively.',
        baseline: baseline.landing,
        modifiers: [...new Set(landingModifiers)].slice(0,4),
        runwaySupport: runwayLandingSupport,
        notes: landingNotes.slice(0,4),
        pohRefs: this.performancePohRefsForMode('landing'),
        procedures: this.performanceProceduresForMode('landing')
      }
    };
  },
  escapeHtml(value){
    return String(value ?? '')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  },
  lessonPhaseInfo(lid){
    return PHASES.find(p => this.phaseLessonIds(p).includes(lid)) || null;
  },
  nextLessonForSequence(lid){
    const source = lid.startsWith('GL') ? Object.values(GL) : Object.values(FL);
    const index = source.findIndex(item => item.id === lid);
    return index >= 0 ? source[index + 1] || null : null;
  },
  homeworkData(lid,s){
    const lesson = GL[lid] || FL[lid];
    if(!lesson) return null;
    const isFL = lesson.type === 'flight';
    const debrief = debriefRecord(s,lid);
    const phase = this.lessonPhaseInfo(lid);
    const studentName = s?.name || 'Independent Study';
    const cfiName = s?.cfi || cfiProfile.name || 'Charlotte Aviation';
    const issueDate = new Date().toLocaleDateString('en-US',{ year:'numeric', month:'long', day:'numeric' });
    const nextLesson = this.nextLessonForSequence(lid);
    const currentReviewTasks = this.needsReviewTaskDetails(s).filter(item => item.lesson.id === lid);
    const relatedProcedures = this.relatedProceduresForLesson(lid).slice(0,4);
    const relatedPohRefs = this.relatedPohRefsForLesson(lid).slice(0,4);
    const lessonGuidance = s ? this.combinedGuidanceBundles(s).items.filter(item => item.lesson?.id === lid || item.procedure.relatedLessonIds?.includes(lid)).slice(0,2) : [];
    const readiness = s ? this.readinessSnapshot(s) : null;

    const PHAK_CH={1:'Introduction to Flying',2:'Aeronautical Decision-Making',4:'Aerodynamics of Flight',5:'Flight Controls',7:'Flight Instruments',8:'Flight Instruments (Gyroscopic)',9:'Weight and Balance',10:'Aircraft Performance',11:'Weather Theory',12:'Aviation Weather Services',13:'Airport Operations',14:'Airspace',15:'Navigation',16:'Navigation Systems & Radar Services',17:'Aeromedical Factors'};
    const AFH_CH={2:'Ground Operations',3:'Basic Flight Maneuvers',4:'Slow Flight, Stalls, and Spins',5:'Takeoff and Departure Climbs',6:'Ground Reference Maneuvers',7:'Airport Traffic Patterns',8:'Approaches and Landings',9:'Performance Maneuvers',10:'Night Operations',17:'Emergency Procedures'};
    const phakSeen=new Set(), afhSeen=new Set(), aimSeen=new Set(), cfrSeen=new Set(), othSeen=new Set();
    (lesson.tasks || []).forEach(function(t){
      const ref=t.textRef||'';
      let m;
      const phakRe=/PHAK\s+Ch\.(\d+)/g;
      while((m=phakRe.exec(ref))!==null) phakSeen.add(parseInt(m[1],10));
      const afhRe=/AFH\s+Ch\.(\d+)/g;
      while((m=afhRe.exec(ref))!==null) afhSeen.add(parseInt(m[1],10));
      if(/AIM/.test(ref)) aimSeen.add('AIM');
      const cfrRe=/14 CFR\s+§?([\d.]+)/g;
      while((m=cfrRe.exec(ref))!==null) cfrSeen.add(m[1]);
      if(/POH/.test(ref)) othSeen.add('POH (aircraft-specific)');
    });

    const readings=[];
    Array.from(phakSeen).sort((a,b)=>a-b).forEach(function(n){
      readings.push({src:'PHAK',title:`Chapter ${n}${PHAK_CH[n] ? ' - ' + PHAK_CH[n] : ''}`,url:REF_URLS.PHAK,color:'var(--amber)'});
    });
    Array.from(afhSeen).sort((a,b)=>a-b).forEach(function(n){
      readings.push({src:'AFH',title:`Chapter ${n}${AFH_CH[n] ? ' - ' + AFH_CH[n] : ''}`,url:REF_URLS.AFH,color:'var(--blue)'});
    });
    if(aimSeen.size) readings.push({src:'AIM',title:'Aeronautical Information Manual',url:REF_URLS.AIM,color:'var(--green)'});
    Array.from(cfrSeen).sort().forEach(function(code){
      readings.push({src:'14 CFR',title:`14 CFR §${code}`,url:'https://www.ecfr.gov/current/title-14',color:'var(--red)'});
    });
    Array.from(othSeen).forEach(function(label){
      readings.push({src:'POH',title:label,url:'',color:'var(--text3)'});
    });

    const acsLinks=(lesson.acsItems||[]).map(function(a){
      const code=a.split(' ')[0];
      const pg=ACS_PAGES[code]||1;
      return{code,title:a.replace(code+' ',''),url:`${ACS_URL}#page=${pg}`};
    });
    const concepts=(lesson.tasks||[]).map(task=>task.text).filter(Boolean);
    const debriefWentWell = debriefList(debrief.wentWell);
    const debriefNeedsWork = debriefList(debrief.needsWork);
    const debriefReview = debriefList(debrief.reviewBeforeNext);
    const debriefNextFocus = debriefList(debrief.nextLessonFocus);
    const keyTakeaways = [];
    if(lesson.scenario) keyTakeaways.push('Be ready to explain the lesson scenario and the decision points it creates.');
    if(lesson.tolerance) keyTakeaways.push(`Know the completion standards: ${Object.entries(lesson.tolerance).map(([k,v])=>`${k} ${v}`).join(' | ')}.`);
    if((lesson.errors||[]).length>0) keyTakeaways.push(`Plan to avoid these common errors: ${lesson.errors.slice(0,3).join(' | ')}.`);
    if(isFL) keyTakeaways.push('Show up able to brief the lesson flow before engine start, not after taxi.');
    if(debriefWentWell[0]) keyTakeaways.unshift(`Last lesson strength: ${debriefWentWell[0]}.`);
    const studyQuestions = (lesson.debrief || []).slice(0,4);
    const weakAreas = [
      ...(debrief.outcome === 'Needs Additional Review' ? ['Last lesson outcome: Needs Additional Review.'] : []),
      ...debriefNeedsWork,
      ...debriefReview,
      ...currentReviewTasks.map(item => item.text),
      ...lessonGuidance.map(item => item.focusLabel)
    ].filter(Boolean).slice(0,4);
    const nextPrep = [];
    if(debrief.homeworkEmphasis) nextPrep.push(`Homework emphasis: ${debrief.homeworkEmphasis}`);
    debriefReview.slice(0,2).forEach(item => nextPrep.push(`Review before next lesson: ${item}`));
    debriefNextFocus.slice(0,2).forEach(item => nextPrep.push(`Next lesson focus: ${item}`));
    if(nextLesson) nextPrep.push(`Preview ${nextLesson.id} ${nextLesson.title} before your next training event.`);
    if(lessonGuidance[0]?.procedure) nextPrep.push(`Brief ${lessonGuidance[0].procedure.title} before the next lesson.`);
    if(lessonGuidance[0]?.pohRef) nextPrep.push(`Use ${lessonGuidance[0].pohRef.title} for aircraft-specific study support.`);
    if(readiness?.overall?.lessonNote) nextPrep.push(readiness.overall.lessonNote);

    return {
      lesson,
      isFL,
      phase,
      studentName,
      cfiName,
      issueDate,
      nextLesson,
      lessonSummary: lesson.summary || lesson.desc || '',
      scenario: lesson.scenario || '',
      debrief:{
        outcome:debrief.outcome,
        confidence:debrief.confidence,
        wentWell:debriefWentWell.slice(0,3),
        needsWork:debriefNeedsWork.slice(0,4),
        reviewBeforeNext:debriefReview.slice(0,3),
        nextLessonFocus:debriefNextFocus.slice(0,3),
        homeworkEmphasis:debrief.homeworkEmphasis || '',
        studentSummary: debrief.homeworkEmphasis || debriefNextFocus[0] || debriefReview[0] || ''
      },
      readings,
      acsLinks,
      concepts,
      keyTakeaways: keyTakeaways.slice(0,4),
      procedures: relatedProcedures,
      pohRefs: relatedPohRefs,
      weakAreas,
      studyQuestions,
      nextPrep: nextPrep.filter(Boolean).slice(0,3),
      selfAssessItems: concepts.slice(0,5),
      lessonGuidance
    };
  },
  renderHomeworkPrint(hw){
    const lesson = hw.lesson;
    const isFL = hw.isFL;
    return `
    <div class="hw-doc">
      <div class="hw-school-header">
        <div class="hw-school-left">
          <div class="hw-school-name">CHARLOTTE AVIATION</div>
          <div class="hw-school-addr">Concord Regional Airport · Concord, NC 28025 · KJQF · Part 61</div>
        </div>
        <div class="hw-school-right">
          <div class="hw-doc-title">Pre-Lesson Homework Assignment</div>
          <div class="hw-doc-sub">Complete before your scheduled lesson</div>
        </div>
      </div>
      <div class="hw-info-row">
        <div class="hw-info-cell"><span class="hw-lbl">Student</span><span class="hw-val">${this.escapeHtml(hw.studentName)}</span></div>
        <div class="hw-info-cell"><span class="hw-lbl">Lesson</span><span class="hw-val">${this.escapeHtml(lesson.id)} - ${this.escapeHtml(lesson.title)}</span></div>
        <div class="hw-info-cell"><span class="hw-lbl">Phase</span><span class="hw-val">${this.escapeHtml(hw.phase?.title || 'PPL')}</span></div>
        <div class="hw-info-cell"><span class="hw-lbl">Issued</span><span class="hw-val">${this.escapeHtml(hw.issueDate)}</span></div>
      </div>
      <div class="hw-section">
        <div class="hw-section-title">Lesson Focus</div>
        <div class="hw-body-text">${isFL ? 'Flight lesson' : 'Ground lesson'} · Stage ${lesson.stage}${isFL ? ` · ${(lesson.hrs.dual>0?lesson.hrs.dual+'h dual ':'')}${(lesson.hrs.solo>0?lesson.hrs.solo+'h solo ':'')}${(lesson.hrs.instrument>0?lesson.hrs.instrument+'h instrument ':'')}${(lesson.hrs.night>0?lesson.hrs.night+'h night ':'')}` : ` · ${lesson.hrs} hrs`}</div>
        ${hw.scenario ? `<div class="hw-scenario"><span class="hw-scenario-label">Scenario:</span> ${this.escapeHtml(hw.scenario)}</div>` : ''}
        ${hw.lessonSummary ? `<div class="hw-body-text" style="margin-top:6px">${this.escapeHtml(hw.lessonSummary)}</div>` : ''}
        ${hw.debrief.studentSummary ? `<div class="hw-mini-list" style="margin-top:8px"><div class="hw-mini-item">${this.escapeHtml(hw.debrief.studentSummary)}</div></div>` : ''}
      </div>
      ${hw.readings.length || hw.procedures.length || hw.pohRefs.length ? `
      <div class="hw-section">
        <div class="hw-section-title">Study References</div>
        <div class="hw-reading-grid">
          ${hw.readings.slice(0,4).map(r=>`<div class="hw-reading-item"><div class="hw-reading-badge" style="background:${r.color};color:#fff">${this.escapeHtml(r.src)}</div><div class="hw-reading-title">${r.url ? `<a href="${r.url}" class="hw-link" target="_blank">${this.escapeHtml(r.title)} ↗</a>` : this.escapeHtml(r.title)}</div><div class="hw-check-box"></div></div>`).join('')}
          ${hw.procedures.slice(0,2).map(item=>`<div class="hw-reading-item"><div class="hw-reading-badge" style="background:var(--blue);color:#fff">PROC</div><div class="hw-reading-title">${this.escapeHtml(item.title)}</div><div class="hw-check-box"></div></div>`).join('')}
          ${hw.pohRefs.slice(0,2).map(item=>`<div class="hw-reading-item"><div class="hw-reading-badge" style="background:var(--green);color:#fff">POH</div><div class="hw-reading-title">${this.escapeHtml(item.title)}</div><div class="hw-check-box"></div></div>`).join('')}
        </div>
      </div>` : ''}
      <div class="hw-section">
        <div class="hw-section-title">Key Concepts</div>
        <div class="hw-concepts-grid">
          ${hw.concepts.slice(0,4).map((c,i)=>`<div class="hw-concept-item"><span class="hw-concept-num">${i+1}</span><span class="hw-concept-text">${this.escapeHtml(c)}</span></div>`).join('')}
        </div>
        ${hw.keyTakeaways.length ? `<div class="hw-mini-list">${hw.keyTakeaways.map(item=>`<div class="hw-mini-item">${this.escapeHtml(item)}</div>`).join('')}</div>` : ''}
      </div>
      ${hw.weakAreas.length ? `<div class="hw-section">
        <div class="hw-section-title">Needs Review Focus</div>
        <div class="hw-mini-list">${hw.weakAreas.slice(0,3).map(item=>`<div class="hw-mini-item hw-mini-item-warn">${this.escapeHtml(item)}</div>`).join('')}</div>
      </div>` : ''}
      ${hw.studyQuestions.length ? `<div class="hw-section">
        <div class="hw-section-title">Study Questions</div>
        ${hw.studyQuestions.slice(0,2).map((q,i)=>`<div class="hw-question"><div class="hw-q-text"><strong>${i+1}.</strong> ${this.escapeHtml(q)}</div><div class="hw-answer-lines"><div class="hw-line"></div><div class="hw-line"></div></div></div>`).join('')}
      </div>` : ''}
      <div class="hw-section">
        <div class="hw-section-title">Self-Assessment and Next Prep</div>
        <table class="hw-self-table">
          <thead><tr><th>Area</th><th style="width:52px;text-align:center">Ready</th><th style="width:90px;text-align:center">Needs Review</th></tr></thead>
          <tbody>
            ${hw.selfAssessItems.map(item=>`<tr><td>${this.escapeHtml(item)}</td><td class="hw-rb"><input type="checkbox"></td><td class="hw-rb"><input type="checkbox"></td></tr>`).join('')}
          </tbody>
        </table>
        ${hw.nextPrep.length ? `<div class="hw-mini-list" style="margin-top:8px">${hw.nextPrep.slice(0,2).map(item=>`<div class="hw-mini-item">${this.escapeHtml(item)}</div>`).join('')}</div>` : ''}
      </div>
      <div class="hw-footer">
        <div>${this.escapeHtml(hw.cfiName)}</div>
        <div>${this.escapeHtml(lesson.id)} - ${this.escapeHtml(lesson.title)} · ${this.escapeHtml(hw.issueDate)}</div>
        <div>Student: _____________________</div>
      </div>
    </div>`;
  },
  renderHomeworkDigital(hw,options={}){
    const showDownload = options.showDownload !== false;
    const showShare = options.showShare !== false;
    const focusText = hw.debrief.homeworkEmphasis || hw.scenario || hw.lessonSummary || 'Review the lesson focus, standards, and key concept list before you arrive.';
    return `
    <div class="card hw-digital-card">
      <div class="hw-digital-hero">
        <div class="hw-digital-hero-copy">
          <div class="card-title">Digital Homework</div>
          <div class="hw-digital-title">${this.escapeHtml(hw.lesson.id)} - ${this.escapeHtml(hw.lesson.title)}</div>
          <div class="hw-digital-sub">${this.escapeHtml(hw.phase?.title || 'PPL')} · ${this.escapeHtml(hw.studentName)}</div>
        </div>
        <div class="hw-digital-hero-actions">
          ${showDownload ? `<button class="btn btn-primary btn-sm" data-click-action="download-homework-file" data-lid="${hw.lesson.id}">Download Homework File</button>` : ''}
        </div>
      </div>
      <div class="hw-digital-meta">
        <div class="hw-digital-meta-item"><span class="hw-digital-meta-label">What this is for</span><span class="hw-digital-meta-value">Prepare for ${this.escapeHtml(hw.lesson.id)} before the next lesson.</span></div>
        <div class="hw-digital-meta-item"><span class="hw-digital-meta-label">Lesson type</span><span class="hw-digital-meta-value">${hw.isFL ? 'Flight lesson' : 'Ground lesson'} · Stage ${this.escapeHtml(hw.lesson.stage)}</span></div>
        <div class="hw-digital-meta-item"><span class="hw-digital-meta-label">Issued</span><span class="hw-digital-meta-value">${this.escapeHtml(hw.issueDate)}</span></div>
      </div>
      ${showShare ? `<div class="hw-share-row">
        <div class="hw-share-copy">
          <div class="section-label">Share</div>
          <div class="hw-share-text">Copy a clean homework summary or a short student message for text, email, or messaging apps.</div>
        </div>
        <div class="hw-share-actions">
          <button class="btn btn-ghost btn-sm" id="copy_hw_summary_${hw.lesson.id}" data-click-action="copy-homework-summary" data-lid="${hw.lesson.id}">Copy Homework Summary</button>
          <button class="btn btn-ghost btn-sm" id="copy_hw_message_${hw.lesson.id}" data-click-action="copy-homework-message" data-lid="${hw.lesson.id}">Copy Student Message</button>
        </div>
      </div>` : ''}
      <div class="hw-digital-panel hw-digital-panel-priority">
        <div class="section-label">Start Here</div>
        <div class="hw-digital-text">${this.escapeHtml(focusText)}</div>
        ${hw.scenario && hw.lessonSummary ? `<div class="hw-digital-note">Summary: ${this.escapeHtml(hw.lessonSummary)}</div>` : ''}
        ${hw.debrief.studentSummary ? `<div class="hw-digital-note">Last lesson debrief: ${this.escapeHtml(hw.debrief.studentSummary)}</div>` : ''}
        ${hw.keyTakeaways.length ? `<div class="hw-digital-bullets">${hw.keyTakeaways.map(item=>`<div class="hw-digital-bullet">${this.escapeHtml(item)}</div>`).join('')}</div>` : ''}
      </div>
      <div class="hw-digital-panel">
        <div class="section-label">Review Before Next Lesson</div>
        <div class="hw-digital-review-grid">
          <div class="hw-digital-review-col">
            <div class="hw-digital-subhead">Reading and References</div>
            ${hw.readings.length || hw.acsLinks.length ? `<div class="hw-digital-links">
              ${hw.readings.map(item=>item.url
                ? `<a class="task-ref" href="${item.url}" target="_blank" rel="noopener noreferrer">${this.escapeHtml(item.src)} - ${this.escapeHtml(item.title)} ↗</a>`
                : `<span class="task-ref">${this.escapeHtml(item.src)} - ${this.escapeHtml(item.title)}</span>`).join('')}
              ${hw.acsLinks.map(item=>`<a class="task-ref" href="${item.url}" target="_blank" rel="noopener noreferrer">ACS ${this.escapeHtml(item.code)} ↗</a>`).join('')}
            </div>` : '<div class="report-empty">No additional reading references were derived for this lesson.</div>'}
          </div>
          <div class="hw-digital-review-col">
            <div class="hw-digital-subhead">Procedure Review</div>
            ${hw.procedures.length ? `<div class="hw-digital-ref-list">${hw.procedures.map(item=>`<div class="hw-digital-ref"><span class="hw-digital-ref-label">Procedure</span><div class="hw-digital-ref-body"><span class="hw-digital-ref-value">${this.escapeHtml(item.title)}</span><span class="hw-digital-ref-note">Use this as the quick briefing and flow reference for this lesson.</span>${showDownload ? `<div class="hw-digital-ref-actions"><button class="btn btn-ghost btn-sm" data-click-action="open-procedure" data-pid="${item.id}">Open Procedure</button></div>` : ''}</div></div>`).join('')}</div>` : '<div class="report-empty">No linked procedure review is stored for this lesson.</div>'}
          </div>
          <div class="hw-digital-review-col">
            <div class="hw-digital-subhead">POH Support</div>
            ${hw.pohRefs.length ? `<div class="hw-digital-ref-list">${hw.pohRefs.map(item=>`<div class="hw-digital-ref"><span class="hw-digital-ref-label hw-digital-ref-label-poh">POH</span><div class="hw-digital-ref-body"><span class="hw-digital-ref-value">${this.escapeHtml(item.title)}</span><span class="hw-digital-ref-note">Use this for aircraft-specific systems, operating, or performance context.</span>${showDownload ? `<div class="hw-digital-ref-actions"><button class="btn btn-ghost btn-sm" data-click-action="open-poh-ref" data-rid="${item.id}">Open POH Reference</button></div>` : ''}</div></div>`).join('')}</div>` : '<div class="report-empty">No linked POH support is stored for this lesson.</div>'}
          </div>
        </div>
      </div>
      <div class="hw-digital-grid">
        <div class="hw-digital-panel">
          <div class="section-label">What to Think About</div>
          ${hw.studyQuestions.length ? `<div class="hw-mini-list">${hw.studyQuestions.map(item=>`<div class="hw-mini-item">${this.escapeHtml(item)}</div>`).join('')}</div>` : '<div class="report-empty">No study questions are stored for this lesson.</div>'}
        </div>
        <div class="hw-digital-panel">
          <div class="section-label">Key Concepts</div>
          ${hw.concepts.length ? `<div class="hw-digital-checklist">${hw.concepts.slice(0,6).map(item=>`<div class="hw-digital-check"><span class="hw-digital-check-marker">${this.escapeHtml('•')}</span><span>${this.escapeHtml(item)}</span></div>`).join('')}</div>` : '<div class="report-empty">No key concepts are stored for this lesson.</div>'}
        </div>
      </div>
      <div class="hw-digital-grid">
        <div class="hw-digital-panel">
          <div class="section-label">What to Do Next</div>
          ${hw.nextPrep.length ? `<div class="hw-mini-list">${hw.nextPrep.map(item=>`<div class="hw-mini-item">${this.escapeHtml(item)}</div>`).join('')}</div>` : '<div class="report-empty">No additional preparation note is available yet.</div>'}
          ${hw.weakAreas.length ? `<div class="section-label" style="margin-top:12px">Needs Review</div><div class="hw-mini-list">${hw.weakAreas.map(item=>`<div class="hw-mini-item hw-mini-item-warn">${this.escapeHtml(item)}</div>`).join('')}</div>` : ''}
        </div>
        <div class="hw-digital-panel">
          <div class="section-label">Completion Check</div>
          <div class="hw-digital-checklist">
            ${hw.selfAssessItems.map(item=>`<label class="hw-digital-check"><input type="checkbox"><span>${this.escapeHtml(item)}</span></label>`).join('')}
          </div>
          <div class="hw-digital-note">Bring questions, weak spots, and completed reading notes to the lesson.</div>
        </div>
      </div>
    </div>`;
  },
  homeworkStandaloneHtml(hw){
    const body = this.renderHomeworkDigital(hw,{ showDownload:false, showShare:false });
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.escapeHtml(hw.lesson.id)} Homework</title>
  <style>
    body{font-family:Arial,sans-serif;background:#f5f3ef;color:#1c1917;margin:0;padding:24px}
    .hw-handout{max-width:980px;margin:0 auto}
    .hw-handout-header{background:#1c1917;color:#fff;border-radius:16px 16px 0 0;padding:20px 24px}
    .hw-handout-brand{font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:#fcd34d}
    .hw-handout-title{font-size:28px;font-weight:700;line-height:1.15;margin-top:8px}
    .hw-handout-sub{font-size:14px;line-height:1.5;color:#e7e5e4;margin-top:8px}
    .hw-handout-meta{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;background:#fff;border:1px solid #d6d3d1;border-top:none;padding:16px 24px}
    .hw-handout-meta-item{display:flex;flex-direction:column;gap:3px}
    .hw-handout-meta-label{font-size:10px;letter-spacing:1px;text-transform:uppercase;color:#78716c}
    .hw-handout-meta-value{font-size:13px;font-weight:600;color:#1c1917}
    .card{background:#fff;border:1px solid #d6d3d1;border-top:none;border-radius:0 0 16px 16px;padding:20px 24px;max-width:980px;margin:0 auto}
    .card-title{font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#78716c}
    .hw-digital-hero,.hw-digital-hero-actions{display:block}
    .hw-digital-title{font-size:24px;font-weight:700;line-height:1.15;color:#1c1917;margin-top:6px}
    .hw-digital-sub{font-size:14px;line-height:1.4;color:#57534e;margin-top:6px}
    .hw-digital-meta{display:none}
    .hw-digital-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
    .hw-digital-panel{background:#fafaf9;border:1px solid #e7e5e4;border-radius:12px;padding:14px}
    .hw-digital-panel-priority{background:linear-gradient(135deg,#fff7ed,#ffffff);border-color:#fdba74}
    .section-label{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#78716c;margin-bottom:8px}
    .hw-digital-text{font-size:14px;line-height:1.6;color:#44403c}
    .hw-digital-note{font-size:12px;line-height:1.55;color:#57534e;margin-top:10px}
    .hw-digital-bullets{display:flex;flex-direction:column;gap:8px;margin-top:10px}
    .hw-digital-bullet{font-size:13px;line-height:1.55;color:#44403c;padding:8px 10px;border:1px solid #e7e5e4;border-radius:8px;background:#fff}
    .hw-digital-review-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
    .hw-digital-subhead{font-size:12px;font-weight:700;color:#1c1917;margin-bottom:8px}
    .hw-mini-list{display:flex;flex-direction:column;gap:8px;margin-top:8px}
    .hw-mini-item{font-size:13px;line-height:1.55;color:#44403c;padding:8px 10px;border:1px solid #e7e5e4;border-radius:8px;background:#fff}
    .hw-mini-item-warn{border-color:#fdba74;background:#fff7ed}
    .hw-digital-ref-list{display:flex;flex-direction:column;gap:8px}
    .hw-digital-ref{display:flex;gap:8px;align-items:flex-start;padding:8px 0;border-top:1px solid #e7e5e4}
    .hw-digital-ref:first-child{border-top:none;padding-top:0}
    .hw-digital-ref-label{font-size:10px;text-transform:uppercase;letter-spacing:.8px;color:#1d4ed8;background:#eff6ff;border:1px solid #93c5fd;border-radius:999px;padding:2px 7px}
    .hw-digital-ref-label-poh{color:#166534;background:#f0fdf4;border-color:#86efac}
    .hw-digital-ref-body{display:flex;flex-direction:column;gap:6px;min-width:0;flex:1}
    .hw-digital-ref-value{font-size:13px;color:#1c1917}
    .hw-digital-ref-note{font-size:12px;line-height:1.5;color:#57534e}
    .hw-digital-links{display:flex;gap:8px;flex-wrap:wrap}
    .hw-digital-checklist{display:flex;flex-direction:column;gap:8px;margin-top:8px}
    .hw-digital-check{display:flex;gap:8px;align-items:flex-start;font-size:13px;color:#44403c}
    .hw-digital-check-marker{color:#d97706;line-height:1.2}
    .task-ref{font-size:12px;color:#1d4ed8;text-decoration:none;border:1px solid #bfdbfe;background:#eff6ff;border-radius:999px;padding:6px 10px}
    .report-empty{font-size:13px;color:#78716c}
    @media(max-width:820px){.hw-handout-meta,.hw-digital-review-grid,.hw-digital-grid{grid-template-columns:1fr}}
    @media print{
      body{background:#fff;padding:0}
      .hw-handout-header{border-radius:0}
      .card{border-radius:0;border-left:none;border-right:none;border-bottom:none}
      .hw-digital-panel{break-inside:avoid}
      @page{margin:1.2cm;size:letter portrait}
    }
  </style>
</head>
<body>
  <div class="hw-handout">
    <div class="hw-handout-header">
      <div class="hw-handout-brand">Charlotte Aviation Digital Homework</div>
      <div class="hw-handout-title">${this.escapeHtml(hw.lesson.id)} - ${this.escapeHtml(hw.lesson.title)}</div>
      <div class="hw-handout-sub">Student handout for lesson preparation. Use the linked references, procedure review, and handbook support before the next lesson.</div>
    </div>
    <div class="hw-handout-meta">
      <div class="hw-handout-meta-item"><span class="hw-handout-meta-label">Student</span><span class="hw-handout-meta-value">${this.escapeHtml(hw.studentName)}</span></div>
      <div class="hw-handout-meta-item"><span class="hw-handout-meta-label">Phase</span><span class="hw-handout-meta-value">${this.escapeHtml(hw.phase?.title || 'PPL')}</span></div>
      <div class="hw-handout-meta-item"><span class="hw-handout-meta-label">Issued</span><span class="hw-handout-meta-value">${this.escapeHtml(hw.issueDate)}</span></div>
    </div>
    ${body}
  </div>
</body></html>`;
  },
  homeworkSummaryText(hw){
    if(!hw) return '';
    const lines = [
      `Lesson: ${hw.lesson.id} - ${hw.lesson.title}`,
      `Phase: ${hw.phase?.title || 'PPL'}`
    ];
    if(hw.scenario || hw.lessonSummary){
      lines.push('', 'Focus:', hw.scenario || hw.lessonSummary);
    }
    if(hw.debrief.homeworkEmphasis){
      lines.push('', 'Homework Emphasis:', hw.debrief.homeworkEmphasis);
    }
    const reviewItems = [
      ...hw.debrief.reviewBeforeNext.slice(0,2),
      ...hw.readings.slice(0,3).map(item => `${item.src}: ${item.title}`),
      ...hw.procedures.slice(0,2).map(item => item.title),
      ...hw.pohRefs.slice(0,2).map(item => `POH: ${item.title}`)
    ].filter(Boolean);
    if(reviewItems.length){
      lines.push('', 'Review Before Next Lesson:');
      reviewItems.forEach(item => lines.push(`- ${item}`));
    }
    const studyItems = [
      ...hw.concepts.slice(0,3),
      ...hw.studyQuestions.slice(0,2)
    ].filter(Boolean);
    if(studyItems.length){
      lines.push('', 'Study:');
      studyItems.forEach(item => lines.push(`- ${item}`));
    }
    const nextItems = [
      ...hw.nextPrep.slice(0,2),
      ...hw.weakAreas.slice(0,2).map(item => `Needs review: ${item}`)
    ].filter(Boolean);
    if(nextItems.length){
      lines.push('', 'Next Lesson Prep:');
      nextItems.forEach(item => lines.push(`- ${item}`));
    }
    return lines.join('\n');
  },
  homeworkStudentMessage(hw){
    if(!hw) return '';
    const focus = hw.debrief.homeworkEmphasis || hw.scenario || hw.lessonSummary || `Please prepare for ${hw.lesson.id} ${hw.lesson.title}.`;
    const reviewItems = [
      ...hw.procedures.slice(0,2).map(item => item.title),
      ...hw.pohRefs.slice(0,1).map(item => item.title),
      ...hw.readings.slice(0,2).map(item => `${item.src}: ${item.title}`)
    ].filter(Boolean).slice(0,3);
    const reviewSentence = reviewItems.length
      ? `Review ${reviewItems.join(', ')}.`
      : '';
    const questionSentence = hw.studyQuestions.length
      ? 'Work through the study questions before the lesson.'
      : '';
    return [
      `Here is your homework for ${hw.lesson.id} ${hw.lesson.title}:`,
      '',
      focus,
      reviewSentence,
      questionSentence,
      '',
      'Let me know if you have any questions before the next lesson.'
    ].filter(Boolean).join('\n');
  },
  procedureMatchIdsForText(text){
    const value = (text || '').toLowerCase();
    const ids = [];
    const add = (...items) => items.forEach(id => {
      if(PROCEDURES_BY_ID[id] && !ids.includes(id)) ids.push(id);
    });
    if(/engine failure|forced landing|emergency/.test(value)) add('engine-failure');
    if(/slow flight/.test(value)) add('slow-flight');
    if(/stall/.test(value)){
      if(/power on|departure/.test(value)) add('power-on-stall');
      else if(/power off|landing/.test(value)) add('power-off-stall');
      else add('power-off-stall','power-on-stall');
    }
    if(/short-field/.test(value)) add('short-field-takeoff','short-field-landing');
    if(/soft-field/.test(value)) add('soft-field-takeoff','soft-field-landing');
    if(/landing|pattern|takeoff|go-around/.test(value)) add('traffic-pattern-operation');
    if(/uncontrolled|ctaf|cross-country|airport operation/.test(value)) add('uncontrolled-airport-operation');
    if(/maneuver|presolo/.test(value)) add('before-maneuver-check');
    return ids;
  },
  procedureSupport(s){
    if(!s) return { items:[] };
    const reviewTasks = this.needsReviewTaskDetails(s);
    const reviewLessons = this.needsReview(s);
    const allLessons = [...Object.values(GL), ...Object.values(FL)];
    const nextLesson = allLessons.find(lesson => getLStatus(s, lesson.id) !== 'signed_off') || null;
    const readiness = this.readinessSnapshot(s);
    const suggestions = new Map();
    const addSuggestion = (pid, reason, lessonId=null, priority=10) => {
      const procedure = PROCEDURES_BY_ID[pid];
      if(!procedure) return;
      const existing = suggestions.get(pid);
      if(!existing || priority < existing.priority){
        suggestions.set(pid, { pid, reason, lessonId, priority });
      }
    };

    reviewTasks.forEach(detail => {
      const label = `${detail.lesson.title} ${detail.text}`;
      const matched = this.procedureMatchIdsForText(label);
      const fallback = this.relatedProceduresForLesson(detail.lesson.id).map(item => item.id);
      [...new Set([...(matched || []), ...fallback])].slice(0,2).forEach(pid => {
        addSuggestion(pid, `Suggested because ${detail.lesson.id} ${detail.text} is marked Needs Review.`, detail.lesson.id, 1);
      });
    });

    reviewLessons.forEach(lesson => {
      if([...suggestions.values()].some(item => item.lessonId === lesson.id)) return;
      const matched = this.procedureMatchIdsForText(lesson.title);
      const fallback = this.relatedProceduresForLesson(lesson.id).map(item => item.id);
      [...new Set([...(matched || []), ...fallback])].slice(0,1).forEach(pid => {
        addSuggestion(pid, `Useful review for the current blocker in ${lesson.id} ${lesson.title}.`, lesson.id, 2);
      });
    });

    if(nextLesson){
      const matched = this.procedureMatchIdsForText(nextLesson.title);
      const fallback = this.relatedProceduresForLesson(nextLesson.id).map(item => item.id);
      [...new Set([...(matched || []), ...fallback])].slice(0,2).forEach(pid => {
        addSuggestion(pid, `Helpful before next lesson: ${nextLesson.id} ${nextLesson.title}.`, nextLesson.id, 4);
      });
    }

    if(suggestions.size < 3 && readiness?.solo?.state && !['Not enough data','Milestone Logged'].includes(readiness.solo.state)){
      addSuggestion('before-maneuver-check', 'Helpful before the next maneuver briefing and pre-solo review flow.', 'FL11', 6);
    }
    if(suggestions.size < 3 && readiness?.checkride?.state === 'Needs Review'){
      addSuggestion('engine-failure', 'Helpful review for current emergency and scenario-readiness work.', 'FL21', 7);
    }

    const items = [...suggestions.values()]
      .sort((a,b)=>a.priority-b.priority)
      .slice(0,3)
      .map(item => {
        const procedure = PROCEDURES_BY_ID[item.pid];
        const lesson = (item.lessonId && (GL[item.lessonId] || FL[item.lessonId])) || this.procedureLessonLinks(procedure)[0] || null;
        return { ...procedure, reason:item.reason, lesson };
      });

    return { items };
  },
  pickPohRefForBundle({procedureId=null, lessonId=null, focusText=''}){
    const candidates = [
      ...this.relatedPohRefsForProcedure(procedureId),
      ...this.relatedPohRefsForLesson(lessonId)
    ].filter(Boolean);
    if(!candidates.length) return null;
    const value = (focusText || '').toLowerCase();
    const scored = [...new Map(candidates.map(item => [item.id, item])).values()].map(item => {
      let score = 0;
      if(procedureId && (item.relatedProcedureIds || []).includes(procedureId)) score += 4;
      if(lessonId && (item.relatedLessonIds || []).includes(lessonId)) score += 3;
      const haystack = `${item.title} ${item.summary} ${item.sourceSection}`.toLowerCase();
      if(/landing|approach/.test(value) && /landing|approach|glide/.test(haystack)) score += 2;
      if(/takeoff|climb/.test(value) && /takeoff|climb/.test(haystack)) score += 2;
      if(/short-field|soft-field/.test(value) && /takeoff|landing|performance/.test(haystack)) score += 2;
      if(/stall|slow flight|maneuver|presolo/.test(value) && /operating|engine|fuel|electrical/.test(haystack)) score += 1;
      if(/engine failure|emergency/.test(value) && /engine|fuel|electrical|glide/.test(haystack)) score += 2;
      if(/weight|balance|loading/.test(value) && /weight/.test(haystack)) score += 2;
      return { item, score };
    }).sort((a,b)=>b.score-a.score);
    return scored[0]?.item || null;
  },
  combinedGuidanceBundles(s){
    if(!s) return { items:[] };
    const bundles = new Map();
    const reviewTasks = this.needsReviewTaskDetails(s);
    const reviewLessons = this.needsReview(s);
    const allLessons = [...Object.values(GL), ...Object.values(FL)];
    const nextLesson = allLessons.find(lesson => getLStatus(s, lesson.id) !== 'signed_off') || null;
    const procedureItems = this.procedureSupport(s).items || [];
    const addBundle = ({focusLabel, reason, procedureId, lessonId=null, priority=10}) => {
      const procedure = PROCEDURES_BY_ID[procedureId];
      if(!procedure) return;
      const bundleKey = `${focusLabel}::${procedureId}`;
      if(bundles.has(bundleKey) && bundles.get(bundleKey).priority <= priority) return;
      const lesson = (lessonId && (GL[lessonId] || FL[lessonId])) || procedure.relatedLessonIds?.map(id => GL[id] || FL[id]).filter(Boolean)[0] || null;
      const pohRef = this.pickPohRefForBundle({
        procedureId,
        lessonId: lesson?.id || lessonId,
        focusText: `${focusLabel} ${reason} ${procedure.title}`
      });
      bundles.set(bundleKey, {
        focusLabel,
        reason,
        procedure,
        pohRef,
        lesson,
        priority
      });
    };

    reviewTasks.forEach(detail => {
      const focusLabel = `${detail.lesson.id} ${detail.text}`;
      const procedureId = (this.procedureMatchIdsForText(`${detail.lesson.title} ${detail.text}`)[0])
        || this.relatedProceduresForLesson(detail.lesson.id)[0]?.id;
      if(procedureId){
        addBundle({
          focusLabel,
          reason:`Suggested because ${detail.text} is still marked Needs Review in ${detail.lesson.id}.`,
          procedureId,
          lessonId: detail.lesson.id,
          priority:1
        });
      }
    });

    reviewLessons.forEach(lesson => {
      const procedureId = this.relatedProceduresForLesson(lesson.id)[0]?.id || this.procedureMatchIdsForText(lesson.title)[0];
      if(procedureId){
        addBundle({
          focusLabel:`${lesson.id} ${lesson.title}`,
          reason:`Useful for the current blocker because ${lesson.title.toLowerCase()} still needs instructor review.`,
          procedureId,
          lessonId: lesson.id,
          priority:2
        });
      }
    });

    if(nextLesson){
      const procedureId = this.relatedProceduresForLesson(nextLesson.id)[0]?.id || this.procedureMatchIdsForText(nextLesson.title)[0];
      if(procedureId){
        addBundle({
          focusLabel:'Before the next lesson',
          reason:`Helpful before next lesson because ${nextLesson.id} ${nextLesson.title} is the next open training item.`,
          procedureId,
          lessonId: nextLesson.id,
          priority:4
        });
      }
    }

    if(!bundles.size){
      procedureItems.forEach((item, index) => {
        addBundle({
          focusLabel:index===0 ? 'Current review focus' : 'Suggested review',
          reason:item.reason,
          procedureId:item.id,
          lessonId:item.lesson?.id || null,
          priority:6 + index
        });
      });
    }

    const items = [...bundles.values()]
      .sort((a,b)=>a.priority-b.priority)
      .slice(0,3);
    return { items };
  },
  renderProcedureSupport(title,support,emptyText='No specific procedure review identified from current tracked data.'){
    const items = support?.items || [];
    return `<div class="procedure-support">
      <div class="card-hd"><div class="card-title">${title}</div></div>
      ${items.length ? `<div class="procedure-support-list">
        ${items.map(item=>`<div class="procedure-support-item">
          <div class="procedure-support-copy">
            <div class="procedure-support-title">${item.title}</div>
            <div class="procedure-support-text">${item.reason}</div>
            <div class="procedure-support-meta">${item.aircraft} | Source page ${item.sourcePage}</div>
          </div>
          <div class="procedure-support-actions">
            <button class="btn btn-primary btn-sm" data-click-action="open-procedure" data-pid="${item.id}">Open Procedure</button>
            ${item.lesson ? `<button class="btn btn-ghost btn-sm" data-click-action="open-lesson" data-lid="${item.lesson.id}">${item.lesson.id}</button>` : ''}
          </div>
        </div>`).join('')}
      </div>` : `<div class="report-empty">${emptyText}</div>`}
    </div>`;
  },
  renderCombinedGuidance(title,bundles,emptyText='No specific study bundle identified from current progress. Continue training or review recent lessons.'){
    const items = bundles?.items || [];
    return `<div class="combined-guidance">
      <div class="card-hd"><div class="card-title">${title}</div></div>
      ${items.length ? `<div class="combined-guidance-list">
        ${items.map(item=>`<div class="combined-guidance-item">
          <div class="combined-guidance-copy">
            <div class="combined-guidance-focus">${item.focusLabel}</div>
            <div class="combined-guidance-block">
              <div class="combined-guidance-label">Procedure</div>
              <div class="combined-guidance-procedure">${item.procedure.title}</div>
            </div>
            <div class="combined-guidance-block combined-guidance-block-secondary">
              <div class="combined-guidance-label">POH Support</div>
              <div class="combined-guidance-poh"><span class="combined-guidance-chip">POH</span><span class="combined-guidance-value">${item.pohRef ? item.pohRef.title : 'No strong POH match identified'}</span></div>
            </div>
            <div class="combined-guidance-block">
              <div class="combined-guidance-label">Why</div>
              <div class="combined-guidance-text">${item.reason}</div>
            </div>
            <div class="combined-guidance-block combined-guidance-next-step">
              <div class="combined-guidance-label">Next Step</div>
              <div class="combined-guidance-text">Brief the procedure first, then use the POH reference for aircraft-specific operating context before the next lesson.</div>
            </div>
          </div>
          <div class="combined-guidance-actions">
            <button class="btn btn-primary btn-sm" data-click-action="open-procedure" data-pid="${item.procedure.id}">Open Procedure</button>
            ${item.pohRef ? `<button class="btn btn-ghost btn-sm" data-click-action="open-poh-ref" data-rid="${item.pohRef.id}">Open POH Reference</button>` : ''}
            ${item.lesson ? `<button class="btn btn-ghost btn-sm" data-click-action="open-lesson" data-lid="${item.lesson.id}">${item.lesson.id}</button>` : ''}
          </div>
        </div>`).join('')}
      </div>` : `<div class="report-empty">${emptyText}</div>`}
    </div>`;
  },
  renderPohSupport(title,items,emptyText='No specific handbook reference is linked here yet.'){
    return `<div class="poh-support">
      <div class="card-hd"><div class="card-title">${title}</div></div>
      ${items?.length ? `<div class="poh-support-list">
        ${items.map(item=>{
          const linkedLesson = item.relatedLessonIds?.[0] ? (GL[item.relatedLessonIds[0]] || FL[item.relatedLessonIds[0]]) : null;
          const linkedProcedure = item.relatedProcedureIds?.[0] ? PROCEDURES_BY_ID[item.relatedProcedureIds[0]] : null;
          return `<div class="poh-support-item">
            <div class="poh-support-copy">
              <div class="poh-support-title">${item.title}</div>
              <div class="poh-support-text">${item.summary}</div>
              <div class="poh-support-meta">${item.sourceSection} | PDF page ${item.sourcePage}</div>
            </div>
            <div class="poh-support-actions">
              <button class="btn btn-primary btn-sm" data-click-action="open-poh-ref" data-rid="${item.id}">Open Reference</button>
              ${linkedProcedure ? `<button class="btn btn-ghost btn-sm" data-click-action="open-procedure" data-pid="${linkedProcedure.id}">Procedure</button>` : ''}
              ${linkedLesson ? `<button class="btn btn-ghost btn-sm" data-click-action="open-lesson" data-lid="${linkedLesson.id}">${linkedLesson.id}</button>` : ''}
            </div>
          </div>`;
        }).join('')}
      </div>` : `<div class="report-empty">${emptyText}</div>`}
    </div>`;
  }
};

function lessonTypeLabel(lesson) {
  if(!lesson) return 'lesson';
  return lesson.type === 'flight' ? 'flight' : 'ground';
}


// â”€â”€â”€ APP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
let curView='dashboard',curLesson=null,curTab='tasks',curHomeworkView='print',expandedTasks={},curPhase='presolo',curProcedureCategory='all',curProcedureSearch='',curProcedureId=null,curPohCategory='all',curPohSearch='',curPohId=null,appMode='instructor';
let curToolsTab='xwind';
let curPresoloTest=null;
let isApplyingRoute = false;
const VIEWS={dashboard:'DASHBOARD',students:'STUDENTS',lessons:'LESSONS',requirements:'SEC. 61.109 REQUIREMENTS',reports:'REPORTS',settings:'SETTINGS',tools:'PILOT TOOLS',presolo:'PRE-SOLO KNOWLEDGE TEST',lesson:'LESSON',proficiency:'ACS PROFICIENCY HEATMAP',procedures:'AIRCRAFT PROCEDURES',poh:'POH REFERENCE'};
const VALID_LESSON_TABS = new Set(['tasks','objectives','scenario','instructor','srm','debrief','homework','stagecheck','plan','fly']);
const VALID_PHASES = new Set(PHASES.map(p => p.id));
const STUDENT_ALLOWED_VIEWS = new Set(['dashboard','lessons','lesson','procedures','poh','tools']);
const STUDENT_ALLOWED_TABS = new Set(['homework','objectives','scenario']);

function isStudentMode() {
  return appMode === 'student';
}

function studentSafeView(view) {
  return isStudentMode() && !STUDENT_ALLOWED_VIEWS.has(view) ? 'dashboard' : view;
}

function studentSafeLessonTab(tab) {
  if(!isStudentMode()) return tab;
  return STUDENT_ALLOWED_TABS.has(tab) ? tab : 'homework';
}

function defaultStudentLessonId(s) {
  if(curLesson && (GL[curLesson] || FL[curLesson])) return curLesson;
  if(!s) return Object.values(FL)[0]?.id || Object.values(GL)[0]?.id || null;
  const reviewLesson = H.needsReview(s)[0];
  if(reviewLesson) return reviewLesson.id;
  const allLessons = [...Object.values(GL), ...Object.values(FL)];
  return allLessons.find(lesson => getLStatus(s, lesson.id) !== 'signed_off')?.id || allLessons[0]?.id || null;
}

function applyAppModeUi() {
  const student = isStudentMode();
  document.body.classList.toggle('student-mode', student);
  document.getElementById('modeInstructorBtn')?.classList.toggle('active', !student);
  document.getElementById('modeStudentBtn')?.classList.toggle('active', student);
  const indicator = document.getElementById('modeIndicator');
  if(indicator) indicator.hidden = !student;
}

function buildRouteSearchFromState(route) {
  const params = new URLSearchParams();
  params.set('view', route.view || 'dashboard');
  if(route.studentId) params.set('student', route.studentId);
  if(route.view === 'lesson' && route.lessonId) {
    params.set('lesson', route.lessonId);
    if(route.tab) params.set('tab', route.tab);
  }
  if(route.view === 'lessons' && route.phase) {
    params.set('phase', route.phase);
  }
  return `?${params.toString()}`;
}

function parseRouteState(search, validStudentIds=[]) {
  const params = new URLSearchParams(search || '');
  const rawView = params.get('view') || 'dashboard';
  const view = rawView === 'lesson' || VIEWS[rawView] ? rawView : 'dashboard';
  const studentId = validStudentIds.includes(params.get('student')) ? params.get('student') : null;
  const lessonId = params.get('lesson');
  const hasLesson = !!(lessonId && (GL[lessonId] || FL[lessonId]));
  const tab = hasLesson && VALID_LESSON_TABS.has(params.get('tab')) ? params.get('tab') : 'tasks';
  const phase = VALID_PHASES.has(params.get('phase')) ? params.get('phase') : 'presolo';
  return {
    view: view === 'lesson' && !hasLesson ? 'lessons' : view,
    studentId,
    lessonId: hasLesson ? lessonId : null,
    tab,
    phase
  };
}

function buildRouteSearch() {
  return buildRouteSearchFromState({
    view: curView,
    studentId: state.activeId,
    lessonId: curLesson,
    tab: curTab,
    phase: curPhase
  });
}

function syncRoute(replace=false) {
  if(isApplyingRoute) return;
  const nextSearch = buildRouteSearch();
  if(window.location.search === nextSearch) return;
  const nextUrl = `${window.location.pathname}${nextSearch}${window.location.hash}`;
  if(replace) history.replaceState(null, '', nextUrl);
  else history.pushState(null, '', nextUrl);
}

function applyRouteFromUrl() {
  const route = parseRouteState(window.location.search, state.students.map(s => s.id));
  const nextStudent = route.studentId;

  isApplyingRoute = true;
  if(state.activeId !== nextStudent){
    state.activeId = nextStudent;
    save();
    App.renderStuSel();
  }

  curPhase = route.phase;
  curTab = route.tab;

  if(route.view === 'lesson' && route.lessonId){
    App.nav('lesson', route.lessonId, { updateRoute:false, preserveTab:true });
  } else {
    App.nav(route.view, null, { updateRoute:false });
  }
  isApplyingRoute = false;
}

function bindRouting() {
  window.addEventListener('popstate', applyRouteFromUrl);
}

const App={
  init(){
    bindEventActions();
    bindRouting();
    initDarkMode();
    initSidebarCollapse();
    applyAppModeUi();
    this.renderStuSel();
    if(window.location.search){
      applyRouteFromUrl();
    } else {
      this.nav('dashboard', null, { updateRoute:false });
      syncRoute(true);
    }
  },
  setMode(mode){
    appMode = mode === 'student' ? 'student' : 'instructor';
    applyAppModeUi();
    if(isStudentMode()){
      const lessonId = defaultStudentLessonId(getS());
      curTab = 'homework';
      curHomeworkView = 'digital';
      if(lessonId){
        this.nav('lesson', lessonId, { preserveTab:true });
        return;
      }
    }
    if(curView === 'lesson' && curLesson){
      this.nav('lesson', curLesson, { preserveTab:true });
      return;
    }
    this.nav(studentSafeView(curView));
  },
  openLesson(lid){ this.nav('lesson', lid); },
  openProcedure(pid){
    curProcedureId = PROCEDURES_BY_ID[pid] ? pid : AIRCRAFT_PROCEDURES[0]?.id || null;
    this.nav('procedures');
  },
  openPohRef(rid){
    curPohId = POH_REFERENCES_BY_ID[rid] ? rid : POH_REFERENCES[0]?.id || null;
    this.nav('poh');
  },
  nav(v,lid=null,options={}){
    closeMobileNav();
    curView=studentSafeView(v);
    if(lid){
      curLesson=lid;
      if(!options.preserveTab) curTab=isStudentMode()?'homework':'tasks';
      curHomeworkView=isStudentMode() ? 'digital' : 'print';
      expandedTasks={};
    }
    if(curView === 'lesson' && !curLesson) curLesson = defaultStudentLessonId(getS());
    if(curView === 'lesson') curTab = studentSafeLessonTab(curTab);
    document.querySelectorAll('.nav-item').forEach(el=>el.classList.toggle('active',el.dataset.view===curView));
    document.getElementById('topTitle').textContent=curView==='lesson'?(curLesson||'LESSON'):VIEWS[curView]||curView.toUpperCase();
    document.getElementById('topCrumb').textContent=curView==='lesson'?(GL[curLesson]||FL[curLesson])?.title||'':' ';
    this.render();
    if(options.updateRoute !== false) syncRoute(options.replaceRoute === true);
  },
  setProcedureCategory(category){
    curProcedureCategory = PROCEDURE_CATEGORIES.some(item => item.id === category) ? category : 'all';
    const filtered = H.filteredProcedures();
    if(!filtered.some(item => item.id === curProcedureId)) curProcedureId = filtered[0]?.id || null;
    this.render();
  },
  setProcedureSearch(value){
    curProcedureSearch = value || '';
    const filtered = H.filteredProcedures();
    if(!filtered.some(item => item.id === curProcedureId)) curProcedureId = filtered[0]?.id || null;
    this.render();
  },
  setPohCategory(category){
    curPohCategory = POH_CATEGORIES.some(item => item.id === category) ? category : 'all';
    const filtered = H.filteredPohRefs();
    if(!filtered.some(item => item.id === curPohId)) curPohId = filtered[0]?.id || null;
    this.render();
  },
  setPohSearch(value){
    curPohSearch = value || '';
    const filtered = H.filteredPohRefs();
    if(!filtered.some(item => item.id === curPohId)) curPohId = filtered[0]?.id || null;
    this.render();
  },
  setHomeworkView(view){
    curHomeworkView = view === 'digital' ? 'digital' : 'print';
    if(curView === 'lesson' && curTab === 'homework'){
      const el = document.getElementById('tabContent');
      if(el) el.innerHTML = V.lessonTab(curLesson, getS(), 'homework');
    }
  },
  downloadHomeworkFile(lid){
    const hw = H.homeworkData(lid, getS());
    if(!hw) return;
    const html = H.homeworkStandaloneHtml(hw);
    const blob = new Blob([html], { type:'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const safeStudent = (hw.studentName || 'student').replace(/[^a-z0-9]+/gi,'-').replace(/^-+|-+$/g,'').toLowerCase();
    const safeLesson = (hw.lesson.id || 'lesson').replace(/[^a-z0-9]+/gi,'-').replace(/^-+|-+$/g,'').toLowerCase();
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeStudent || 'student'}-${safeLesson || 'lesson'}-homework.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(url), 1500);
  },
  render(){
    const s=getS();
    applyAppModeUi();
    const el=document.getElementById('content');
    const ta=document.getElementById('topActions');ta.innerHTML='';
    if(isStudentMode() && curView === 'lesson' && !curLesson) curLesson = defaultStudentLessonId(s);
    switch(curView){
      case 'dashboard':    el.innerHTML=V.dashboard(s);break;
      case 'students':     el.innerHTML=V.students();break;
      case 'lessons':     el.innerHTML=V.lessonsView(s);break;
      case 'requirements': el.innerHTML=V.requirements(s);break;
      case 'reports':      el.innerHTML=V.reports(s);break;
      case 'settings':     el.innerHTML=V.settings();break;
      case 'tools':        el.innerHTML=V.tools(s,curToolsTab);
        if(curToolsTab==='wx') setTimeout(()=>{ if(typeof fetchKJQFWeather==='function') fetchKJQFWeather(); },80);
        if(curToolsTab==='wb') setTimeout(()=>{ if(typeof calcWB==='function') calcWB(); },0);
        if(curToolsTab==='performance') setTimeout(()=>{ if(typeof calcPerformance==='function') calcPerformance(); },0);
        break;
      case 'lesson':       el.innerHTML=V.lessonDetail(curLesson,s);
        ta.innerHTML=`<button class="btn btn-ghost btn-sm" data-click-action="nav-lessons">&larr; Back</button>`;break;
      case 'presolo':      try{el.innerHTML=V.presolo(s);}catch(e){console.error('presolo render error',e);el.innerHTML=`<div class="alert alert-danger">Render error: ${e.message}</div>`;}break;
      case 'proficiency':  el.innerHTML=V.proficiency(s);break;
      case 'procedures':   el.innerHTML=V.procedures(s);break;
      case 'poh':          el.innerHTML=V.poh(s);break;
    }
  },
  renderStuSel(){
    const sel=document.getElementById('stuSel');
    sel.innerHTML='<option value="">Select Student</option>';
    state.students.forEach(s=>{
      const o=document.createElement('option');o.value=s.id;o.textContent=s.name;
      if(s.id===state.activeId)o.selected=true;sel.appendChild(o);
    });
  },
  selectStudent(id,options={}){state.activeId=id||null;save();this.render();if(options.updateRoute!==false)syncRoute(options.replaceRoute!==false);},
  showAddStudent(){
    document.getElementById('modals').innerHTML=`
    <div class="modal-bg">
      <div class="modal">
        <div class="modal-title">NEW STUDENT</div>
        <div style="font-family:var(--ff-mono);font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Basic Information</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px">
          <div class="fg" style="margin:0"><label>Full Legal Name</label><input class="finput" id="ns_name" placeholder="First Middle Last" autofocus></div>
          <div class="fg" style="margin:0"><label>Date of Birth</label><input class="finput" id="ns_dob" type="date"></div>
          <div class="fg" style="margin:0"><label>Phone</label><input class="finput" id="ns_phone" placeholder="(704) 555-0100" type="tel"></div>
          <div class="fg" style="margin:0"><label>Email</label><input class="finput" id="ns_email" placeholder="student@email.com" type="email"></div>
        </div>
        <div style="font-family:var(--ff-mono);font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Training</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px">
          <div class="fg" style="margin:0"><label>CFI Name</label><input class="finput" id="ns_cfi" placeholder="CFI Name"></div>
          <div class="fg" style="margin:0"><label>Start Date</label><input class="finput" id="ns_date" type="date" value="${new Date().toISOString().split('T')[0]}"></div>
          <div class="fg" style="margin:0"><label>Training Type</label><select class="fselect" id="ns_type"><option value="61">Part 61</option><option value="141">Part 141</option></select></div>
          <div class="fg" style="margin:0"><label>Student Cert #</label><input class="finput" id="ns_certnum" placeholder="xxxxxxxxx" maxlength="20"></div>
        </div>
        <div style="font-family:var(--ff-mono);font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Medical</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px">
          <div class="fg" style="margin:0"><label>Medical Class</label><select class="fselect" id="ns_medclass"><option value="">None on File</option><option value="1st">1st Class</option><option value="2nd">2nd Class</option><option value="3rd">3rd Class</option><option value="basicmed">BasicMed</option></select></div>
          <div class="fg" style="margin:0"><label>Medical Exam Date</label><input class="finput" id="ns_meddate" type="date"></div>
        </div>
        <div class="fg" style="margin-bottom:0"><label>Training Goals / Notes</label><textarea class="finput" id="ns_goals" rows="2" placeholder="Student goals, background, experience..." style="resize:vertical;font-family:var(--ff-body);font-size:13px"></textarea></div>
        <div class="modal-actions">
          <button class="btn btn-ghost" data-click-action="close-modals">Cancel</button>
          <button class="btn btn-primary" data-click-action="add-student">Create Student</button>
        </div>
      </div></div>`;
  },
  addStudent(){
    const name=document.getElementById('ns_name').value.trim();if(!name){alert('Enter student name.');return;}
    const id='stu_'+Date.now();
    state.students.push({
        id,name,
        startDate:document.getElementById('ns_date').value,
        cfi:document.getElementById('ns_cfi').value.trim(),
        partType:document.getElementById('ns_type').value,
        dob:document.getElementById('ns_dob').value,
        phone:document.getElementById('ns_phone').value.trim(),
        email:document.getElementById('ns_email').value.trim(),
        stuCertNum:document.getElementById('ns_certnum').value.trim(),
        medClass:document.getElementById('ns_medclass').value,
        medDate:document.getElementById('ns_meddate').value,
        goals:document.getElementById('ns_goals').value.trim(),
        data:{}
      });
    state.activeId=id;save();document.getElementById('modals').innerHTML='';
    this.renderStuSel();document.getElementById('stuSel').value=id;this.render();
  },
  editStudent(id){
    const s=state.students.find(x=>x.id===id);
    if(!s)return;
    const today=new Date().toISOString().split('T')[0];
    document.getElementById('modals').innerHTML=`
    <div class="modal-bg">
      <div class="modal">
        <div class="modal-title">EDIT STUDENT</div>
        <div style="font-family:var(--ff-mono);font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Basic Information</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px">
          <div class="fg" style="margin:0"><label>Full Legal Name</label><input class="finput" id="es_name" value="${s.name||''}"></div>
          <div class="fg" style="margin:0"><label>Date of Birth</label><input class="finput" id="es_dob" type="date" value="${s.dob||''}"></div>
          <div class="fg" style="margin:0"><label>Phone</label><input class="finput" id="es_phone" value="${s.phone||''}" type="tel"></div>
          <div class="fg" style="margin:0"><label>Email</label><input class="finput" id="es_email" value="${s.email||''}" type="email"></div>
        </div>
        <div style="font-family:var(--ff-mono);font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Training</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px">
          <div class="fg" style="margin:0"><label>CFI Name</label><input class="finput" id="es_cfi" value="${s.cfi||''}"></div>
          <div class="fg" style="margin:0"><label>Start Date</label><input class="finput" id="es_date" type="date" value="${s.startDate||''}"></div>
          <div class="fg" style="margin:0"><label>Training Type</label><select class="fselect" id="es_type"><option value="61" ${(s.partType||'61')==='61'?'selected':''}>Part 61</option><option value="141" ${s.partType==='141'?'selected':''}>Part 141</option></select></div>
          <div class="fg" style="margin:0"><label>Student Cert #</label><input class="finput" id="es_certnum" value="${s.stuCertNum||''}"></div>
        </div>
        <div style="font-family:var(--ff-mono);font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Medical</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px">
          <div class="fg" style="margin:0"><label>Medical Class</label><select class="fselect" id="es_medclass">
          <option value="" ${!s.medClass?'selected':''}>None</option>
            <option value="1st" ${s.medClass==='1st'?'selected':''}>1st Class</option>
            <option value="2nd" ${s.medClass==='2nd'?'selected':''}>2nd Class</option>
            <option value="3rd" ${s.medClass==='3rd'?'selected':''}>3rd Class</option>
            <option value="basicmed" ${s.medClass==='basicmed'?'selected':''}>BasicMed</option>
          </select></div>
          <div class="fg" style="margin:0"><label>Medical Exam Date</label><input class="finput" id="es_meddate" type="date" value="${s.medDate||''}"></div>
        </div>
        <div class="fg"><label>Training Goals / Notes</label><textarea class="finput" id="es_goals" rows="2" style="resize:vertical;font-family:var(--ff-body);font-size:13px">${s.goals||''}</textarea></div>
        <div class="modal-actions">
          <button class="btn btn-ghost" data-click-action="close-modals">Cancel</button>
          <button class="btn btn-primary" data-click-action="save-edit-student" data-student-id="${id}">Save Changes</button>
        </div>
      </div></div>`;
  },
  saveEditStudent(id){
    const s=state.students.find(x=>x.id===id);if(!s)return;
    s.name=document.getElementById('es_name').value.trim()||s.name;
    s.dob=document.getElementById('es_dob').value;
    s.phone=document.getElementById('es_phone').value.trim();
    s.email=document.getElementById('es_email').value.trim();
    s.cfi=document.getElementById('es_cfi').value.trim();
    s.startDate=document.getElementById('es_date').value;
    s.partType=document.getElementById('es_type').value;
    s.stuCertNum=document.getElementById('es_certnum').value.trim();
    s.medClass=document.getElementById('es_medclass').value;
    s.medDate=document.getElementById('es_meddate').value;
    s.goals=document.getElementById('es_goals').value.trim();
    save();document.getElementById('modals').innerHTML='';
    this.renderStuSel();this.render();
  },
  deleteStudent(id){
    if(!confirm('Delete this student? All data will be lost.'))return;
    state.students=state.students.filter(s=>s.id!==id);
    if(state.activeId===id)state.activeId=null;
    save();this.renderStuSel();this.render();
  },
  openLesson(lid){
    if(isStudentMode()){
      curTab='homework';
      curHomeworkView='digital';
      this.nav('lesson',lid,{preserveTab:true});
      return;
    }
    this.nav('lesson',lid);
  },
  setPhase(pid,options={}){
    curPhase=pid;
    document.querySelectorAll('.phase-tab').forEach(el=>el.classList.toggle('active',el.dataset.phase===pid));
    const el=document.getElementById('phaseContent');
    if(el)el.innerHTML=V.phasePanel(pid,getS());
    if(options.updateRoute!==false)syncRoute(options.replaceRoute === true);
  },
  setTab(tab,options={}){
    const TAB_MIGRATION = {
      tasks:'fly', objectives:'plan', scenario:'plan',
      instructor:'plan', srm:'fly', homework:'debrief',
      stagecheck:'debrief'
    };
    const resolved = TAB_MIGRATION[tab] || tab;
    curTab = studentSafeLessonTab(resolved);
    document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.tab===curTab));
    const el=document.getElementById('tabContent');
    if(el)el.innerHTML=V.lessonTab(curLesson,getS(),curTab);
    if(options.updateRoute!==false)syncRoute(options.replaceRoute === true);
  },
  toggleTask(lid,tid){
    const key=lid+'_'+tid;
    expandedTasks[key]=!expandedTasks[key];
    const el=document.getElementById('subtasks_'+lid+'_'+tid);
    const icon=document.getElementById('ticon_'+lid+'_'+tid);
    if(el){el.style.display=expandedTasks[key]?'block':'none';}
    if(icon){icon.textContent=expandedTasks[key]?'-':'+';}
  },
  setSubtask(lid,tid,idx,checked){
    const s=getS();if(!s)return;
    const d=initSD(s);
    if(!d.subtaskChecks[lid])d.subtaskChecks[lid]={};
    if(!d.subtaskChecks[lid][tid])d.subtaskChecks[lid][tid]=[];
    d.subtaskChecks[lid][tid][idx]=checked;
    // Auto-sign-off task when all subtasks checked
    const lesson=GL[lid]||FL[lid];
    const task=lesson?.tasks?.find(t=>t.id===tid);
    if(task?.subtasks){
      const allChecked=task.subtasks.every((_,i)=>d.subtaskChecks[lid][tid][i]);
      if(allChecked){
        if(!d.taskStatus[lid])d.taskStatus[lid]={};
        d.taskStatus[lid][tid]='signed_off';
        // Auto-sign-off lesson when all tasks signed off
        const allTasksDone=lesson.tasks.every(t=>d.taskStatus[lid]?.[t.id]==='signed_off');
        if(allTasksDone)d.lessonStatus[lid]='signed_off';
      }
    }
    save();
    // Update progress badge and status badge without full re-render
    const prog=document.getElementById('tprog_'+lid+'_'+tid);
    const sbadge=document.getElementById('tsbadge_'+lid+'_'+tid);
    if(task?.subtasks){
      const checks=d.subtaskChecks[lid]?.[tid]||[];
      const done=task.subtasks.filter((_,i)=>checks[i]).length;
      const total=task.subtasks.length;
      if(prog)prog.textContent=`${done}/${total}`;
      if(sbadge){
        const ts=d.taskStatus[lid]?.[tid]||'not_started';
        sbadge.className=`sbadge s-${ts}`;
        sbadge.textContent=H.statusLabel(ts);
      }
    }
    // Update lesson progress bar if present
    const lpb=document.getElementById('lpbar_'+lid);
    const lpp=document.getElementById('lppct_'+lid);
    if(lpb||lpp){
      const lp=H.lessonTaskProgress(s,lid);
      if(lpb)lpb.style.width=lp.pct+'%';
      if(lpp)lpp.textContent=lp.done+'/'+lp.total+' tasks';
    }
  },
  setTaskStatus(lid,tid,status){
    const s=getS();if(!s)return;
    const d=initSD(s);
    if(!d.taskStatus[lid])d.taskStatus[lid]={};
    d.taskStatus[lid][tid]=status;
    if(status==='signed_off'){
      // Also check all subtasks when manually signing off
      const lesson=GL[lid]||FL[lid];
      const task=lesson?.tasks?.find(t=>t.id===tid);
      if(task?.subtasks){
        if(!d.subtaskChecks[lid])d.subtaskChecks[lid]={};
        d.subtaskChecks[lid][tid]=task.subtasks.map(()=>true);
      }
    }
    const allDone=((GL[lid]||FL[lid])?.tasks||[]).every(t=>d.taskStatus[lid]?.[t.id]==='signed_off');
    if(allDone)d.lessonStatus[lid]='signed_off';
    else if(Object.values(d.taskStatus[lid]||{}).some(x=>x!=='not_started')&&(!d.lessonStatus[lid]||d.lessonStatus[lid]==='not_started'))d.lessonStatus[lid]='in_progress';
    save();
    const el=document.getElementById('tsbadge_'+lid+'_'+tid);
    if(el){el.className=`sbadge s-${status}`;el.textContent=H.statusLabel(status);}
    // Update all subtask checkboxes
    const lesson=GL[lid]||FL[lid];
    const task=lesson?.tasks?.find(t=>t.id===tid);
    if(status==='signed_off'&&task?.subtasks){
      task.subtasks.forEach((_,i)=>{
        const cb=document.getElementById(`stcb_${lid}_${tid}_${i}`);
        if(cb)cb.checked=true;
      });
      const prog=document.getElementById('tprog_'+lid+'_'+tid);
      if(prog)prog.textContent=`${task.subtasks.length}/${task.subtasks.length}`;
    }
  },
  setStudentGrade(lid,tid,grade){
    const s=getS();if(!s)return;
    const d=initSD(s);
    if(!d.taskStudentGrade[lid])d.taskStudentGrade[lid]={};
    d.taskStudentGrade[lid][tid]=(d.taskStudentGrade[lid][tid]===grade)?null:grade;
    save();
    const row=document.getElementById(`sg_${lid}_${tid}`);
    if(row)row.innerHTML=H.gradeButtons(lid,tid,'student',d.taskStudentGrade[lid][tid]);
  },
  setInstructorGrade(lid,tid,grade){
    const s=getS();if(!s)return;
    const d=initSD(s);
    if(!d.taskInstructorGrade[lid])d.taskInstructorGrade[lid]={};
    d.taskInstructorGrade[lid][tid]=(d.taskInstructorGrade[lid][tid]===grade)?null:grade;
    save();
    const row=document.getElementById(`ig_${lid}_${tid}`);
    if(row)row.innerHTML=H.gradeButtons(lid,tid,'instructor',d.taskInstructorGrade[lid][tid]);
  },
  setSRM(lid,p,type,val){
    const s=getS();if(!s)return;
    const d=initSD(s);
    if(!d.srmChecks[lid])d.srmChecks[lid]={};
    if(!d.srmChecks[lid][p])d.srmChecks[lid][p]={checked:false,notes:''};
    d.srmChecks[lid][p][type]=val;save();
    const card=document.getElementById(`srm_${lid}_${p}`);
    if(card)card.className='srm-card'+(type==='checked'&&val?' checked':'');
  },
  saveNote(lid){
    const s=getS();if(!s)return;
    const d=initSD(s);
    const note=document.getElementById('lesson_note')?.value||'';
    d.notes[lid]=note;
    d.debriefs[lid]={
      outcome:document.getElementById(`debrief_outcome_${lid}`)?.value||'',
      wentWell:document.getElementById(`debrief_wentwell_${lid}`)?.value||'',
      needsWork:document.getElementById(`debrief_needswork_${lid}`)?.value||'',
      reviewBeforeNext:document.getElementById(`debrief_review_${lid}`)?.value||'',
      nextLessonFocus:document.getElementById(`debrief_next_${lid}`)?.value||'',
      confidence:document.getElementById(`debrief_confidence_${lid}`)?.value||'',
      homeworkEmphasis:document.getElementById(`debrief_homework_${lid}`)?.value||'',
      instructorNotes:note
    };
    const lesson=FL[lid];
    if(lesson){
      const date=document.getElementById('log_date')?.value||'';
      const dual=parseFloat(document.getElementById('log_dual')?.value||0);
      const solo=parseFloat(document.getElementById('log_solo')?.value||0);
      const inst=parseFloat(document.getElementById('log_inst')?.value||0);
      const night=parseFloat(document.getElementById('log_night')?.value||0);
      if(date&&(dual||solo||inst||night)){
        if(!d.logEntries[lid])d.logEntries[lid]=[];
        d.logEntries[lid].push({date,dual,solo,inst,night,note,ts:Date.now()});
      }
    }
    save();
    ['save_btn','save_btn_sticky'].forEach(function(id){
      const btn=document.getElementById(id);
      if(!btn) return;
      btn.textContent='Saved';
      setTimeout(()=>{btn.textContent=id==='save_btn'?'Save Debrief':'Save';},1500);
    });
  },
  showSignOffModal(lid){
    const lesson=GL[lid]||FL[lid];
    const today=new Date().toISOString().split('T')[0];
    document.getElementById('modals').innerHTML=`
    <div class="modal-bg">
      <div class="modal" style="max-width:360px">
        <div class="modal-title">SIGN OFF LESSON</div>
        <div style="font-size:13px;color:var(--text2);margin-bottom:14px">${lesson?lesson.id+' — '+lesson.title:lid}</div>
        <div class="fg" style="margin-bottom:16px">
          <label>Sign-Off Date</label>
          <input class="finput" id="signOffDateInput" type="date" value="${today}" autofocus>
          <div style="font-family:var(--ff-mono);font-size:10px;color:var(--text3);margin-top:4px">Defaults to today. Back-date if lesson was completed earlier.</div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-ghost" data-click-action="close-modals">Cancel</button>
          <button class="btn btn-green" data-click-action="confirm-sign-off" data-lid="${lid}">&#10003; Confirm Sign-Off</button>
        </div>
      </div></div>`;
  },
  confirmSignOff(lid){
    const dateVal=document.getElementById('signOffDateInput')?.value;
    const ts=dateVal?new Date(dateVal+'T12:00:00').toISOString():new Date().toISOString();
    document.getElementById('modals').innerHTML='';
    const s=getS();if(!s)return;
    const d=initSD(s);
    d.lessonStatus[lid]='signed_off';
    if(!d.lessonSignOffDates)d.lessonSignOffDates={};
    d.lessonSignOffDates[lid]=ts;
    const lesson=GL[lid]||FL[lid];
    if(lesson){
      if(!d.taskStatus[lid])d.taskStatus[lid]={};
      if(!d.subtaskChecks[lid])d.subtaskChecks[lid]={};
      lesson.tasks.forEach(t=>{
        d.taskStatus[lid][t.id]='signed_off';
        if(t.subtasks)d.subtaskChecks[lid][t.id]=t.subtasks.map(()=>true);
      });
    }
    save();this.render();
  },
  updateReq(rid){
    const s=getS();if(!s)return;
    const val=parseFloat(document.getElementById('req_'+rid)?.value||0);
    initSD(s).reqs[rid]=val;save();
    const req=REQS.find(r=>r.id===rid);if(!req)return;
    const pct=Math.min(100,(val/req.min)*100);
    const fill=document.getElementById('rfill_'+rid);
    const disp=document.getElementById('rdisp_'+rid);
    const card=document.getElementById('rcard_'+rid);
    if(fill){fill.style.width=pct+'%';fill.className='prog-fill '+(pct>=100?'green':'');}
    if(disp)disp.textContent=val+' / '+req.min;
    if(card)card.className='req-card'+(pct>=100?' met':'');
  },
  toggleWI(lid,idx){
    const s=getS();if(!s)return;
    const d=initSD(s);
    if(!d.wiDiscussed[lid])d.wiDiscussed[lid]={};
    d.wiDiscussed[lid][idx]=!d.wiDiscussed[lid][idx];
    save();
    const btn=document.getElementById('wi_disc_'+lid+'_'+idx);
    const card=document.getElementById('wi_card_'+lid+'_'+idx);
    const done=d.wiDiscussed[lid][idx];
    if(btn){btn.textContent=done?'Discussed':'Mark Discussed';btn.className='wi-disc-btn'+(done?' done':'');}
    if(card){card.style.opacity=done?'0.55':'1';}
  },
  setSRMItem(lid,itemKey,val){
    const s=getS();if(!s)return;
    const d=initSD(s);
    if(!d.srmItems[lid])d.srmItems[lid]={};
    d.srmItems[lid][itemKey]=(d.srmItems[lid][itemKey]===val)?'':val;
    save();
    const btn_go  =document.getElementById('srm_go_'+lid+'_'+itemKey);
    const btn_cau =document.getElementById('srm_cau_'+lid+'_'+itemKey);
    const btn_ng  =document.getElementById('srm_ng_'+lid+'_'+itemKey);
    const row     =document.getElementById('srm_row_'+lid+'_'+itemKey);
    const current =d.srmItems[lid][itemKey]||'';
    if(btn_go) btn_go.className ='srm-item-btn go'  +(current==='go'   ?' active':'');
    if(btn_cau)btn_cau.className='srm-item-btn cau' +(current==='cau'  ?' active':'');
    if(btn_ng) btn_ng.className ='srm-item-btn ng'  +(current==='nogo' ?' active':'');
    if(row)    row.className    ='srm-item-row'     +(current?' '+current:'');
    // Update P-section summary
    App.refreshSRMSection(lid,itemKey.split('_')[0]);
  },
  setSRMStandalone(sessionKey,itemKey,val){
    const s=getS();if(!s)return;
    const d=initSD(s);
    if(!d.srmStandalone[sessionKey])d.srmStandalone[sessionKey]={};
    const cur=d.srmStandalone[sessionKey][itemKey]||'';
    d.srmStandalone[sessionKey][itemKey]=(cur===val)?'':val;
    save();
    const ikey=sessionKey+'_'+itemKey;
    const btn_go  =document.getElementById('sas_go_'+ikey);
    const btn_cau =document.getElementById('sas_cau_'+ikey);
    const btn_ng  =document.getElementById('sas_ng_'+ikey);
    const row     =document.getElementById('sas_row_'+ikey);
    const current =d.srmStandalone[sessionKey][itemKey]||'';
    if(btn_go)  btn_go.className ='srm-item-btn go'  +(current==='go'   ?' active':'');
    if(btn_cau) btn_cau.className='srm-item-btn cau' +(current==='cau'  ?' active':'');
    if(btn_ng)  btn_ng.className ='srm-item-btn ng'  +(current==='nogo' ?' active':'');
    if(row)     row.className    ='srm-item-row'     +(current?' '+current:'');
    App.refreshSRMStandaloneBadge(sessionKey);
    App.refreshSRMStandaloneHeader(sessionKey);
  },
  refreshSRMStandaloneBadge(sessionKey){
    const s=getS();if(!s)return;
    const items=s.data&&s.data.srmStandalone&&s.data.srmStandalone[sessionKey]||{};
    const SRM_PS=window._SRM_KEYS||{};
    Object.keys(SRM_PS).forEach(function(pkey){
      const pItems=SRM_PS[pkey]||[];
      const done=pItems.filter(function(k){return items[k];}).length;
      const hasNG=pItems.some(function(k){return items[k]==='nogo';});
      const hasCau=pItems.some(function(k){return items[k]==='cau';});
      const badge=document.getElementById('sas_badge_'+sessionKey+'_'+pkey);
      if(badge){
        badge.textContent=done+'/'+pItems.length;
        badge.className='srm-section-badge'+(hasNG?' ng':hasCau?' cau':done===pItems.length&&pItems.length>0?' ok':'');
      }
    });
  },
  refreshSRMStandaloneHeader(sessionKey){
    const s=getS();if(!s)return;
    const items=s.data&&s.data.srmStandalone&&s.data.srmStandalone[sessionKey]||{};
    const SRM_PS=window._SRM_KEYS||{};
    const allKeys=Object.values(SRM_PS).flat();
    const done=allKeys.filter(function(k){return items[k];}).length;
    const total=allKeys.length;
    const anyNG=allKeys.some(function(k){return items[k]==='nogo';});
    const counter=document.getElementById('sas_counter_'+sessionKey);
    const banner =document.getElementById('sas_banner_'+sessionKey);
    if(counter){counter.textContent=done+'/'+total+' items';counter.className='srm-master-count'+(anyNG?' ng':done===total?' ok':'');}
    if(banner) {banner.style.display=anyNG?'flex':'none';}
  },
  nav5PSession(sessionKey){
    // For now: navigate to 5p view (full session browsing is future work)
    this.nav('5p');
  },
  clearSRMStandalone(sessionKey){
    const s=getS();if(!s)return;
    const d=initSD(s);
    d.srmStandalone[sessionKey]={};
    save();
    App.render();
  },
  refreshSRMSection(lid,pkey){
    const s=getS();if(!s)return;
    const items=s.data&&s.data.srmItems&&s.data.srmItems[lid]||{};
    const SRM_PS=window._SRM_KEYS||{};
    const pItems=SRM_PS[pkey]||[];
    const total=pItems.length;
    const done=pItems.filter(function(k){return items[pkey+'_'+k];}).length;
    const hasNG=pItems.some(function(k){return items[pkey+'_'+k]==='nogo';});
    const hasCau=pItems.some(function(k){return items[pkey+'_'+k]==='cau';});
    const badge=document.getElementById('srm_badge_'+lid+'_'+pkey);
    if(badge){
      badge.textContent=done+'/'+total;
      badge.className='srm-section-badge'+(hasNG?' ng':hasCau?' cau':done===total?' ok':'');
    }
  },
  setLessonDate(lid,field,val){
    const s=getS();if(!s)return;
    const d=initSD(s);
    if(!d.lessonDates[lid])d.lessonDates[lid]={};
    d.lessonDates[lid][field]=val;
    save();
    App.refreshSchedule();
  },
  refreshSchedule(){
    const el=document.getElementById('dash-schedule');
    if(!el)return;
    el.innerHTML=V.scheduleCard(getS());
  },
  exportData(){
    const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    const date=new Date().toISOString().split('T')[0];
    a.href=url;a.download='charlotte-aviation-students-'+date+'.json';
    document.body.appendChild(a);a.click();
    document.body.removeChild(a);URL.revokeObjectURL(url);
  },
  importData(evt){
    const file=evt.target.files[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=function(e){
      try{
        const imported=normalizeStateShape(JSON.parse(e.target.result));
        if(!imported.students.length){
      alert('Invalid file - expected Charlotte Aviation student data.');return;
        }
        const msg='Import '+imported.students.length+' student(s)? This will MERGE with current data. Existing students (same ID) are skipped.';
        if(!confirm(msg))return;
        let added=0;
        imported.students.forEach(function(st){
          if(!state.students.find(function(x){return x.id===st.id;})){
            state.students.push(st);added++;
          }
        });
        if(imported.activeId&&!state.activeId)state.activeId=imported.activeId;
        save();App.renderStuSel();App.render();
    alert('Import complete - '+added+' student(s) added.');
      }catch(err){alert('Could not read file: '+err.message);}
    };
    reader.readAsText(file);
    evt.target.value='';
  },
  submitPresoloTest(){
    const s=getS();
    if(!s||!curPresoloTest) return;
    const total=curPresoloTest.length;
    const scored=curPresoloTest.filter(q=>q.pass!==null).length;
    if(scored<total){ alert(`Please mark all ${total} questions before submitting.`); return; }
    const passed_count=curPresoloTest.filter(q=>q.pass).length;
    const pct=Math.round(passed_count/total*100);
    const passed=pct>=PRESOLO_PASS_PCT;
    const record={ date:new Date().toISOString().split('T')[0], score:passed_count, total, pct, passed };
    if(!s.data.presoloTests) s.data.presoloTests=[];
    s.data.presoloTests.unshift(record);
    save();
    curPresoloTest=null;
    this.render();
  },

  saveCFISettings(){
    cfiProfile.name=document.getElementById('cfi_name').value.trim();
    cfiProfile.certNum=document.getElementById('cfi_certnum').value.trim();
    cfiProfile.ratings=document.getElementById('cfi_ratings').value.trim();
    cfiProfile.certExpiry=document.getElementById('cfi_expiry').value;
    cfiProfile.phone=document.getElementById('cfi_phone').value.trim();
    cfiProfile.email=document.getElementById('cfi_email').value.trim();
    saveCFI();
    const btn=document.querySelector('#content .btn-primary');
    if(btn){btn.textContent='Saved';setTimeout(()=>{btn.textContent='Save CFI Profile';},1800);}
  },
  saveStageCheck(lid,field,val){
    const s=getS();if(!s)return;
    const d=initSD(s);
    if(!d.stageChecks[lid])d.stageChecks[lid]={};
    d.stageChecks[lid][field]=val;
    // Auto-sign-off lesson when result is pass
    if(field==='result'&&val==='pass')d.lessonStatus[lid]='signed_off';
    save();
    // Refresh relevant UI indicators without full reload
    const resultSel=document.getElementById('sc_result_'+lid);
    if(resultSel){
      const colors={pass:'var(--green)',fail:'var(--red)',incomplete:'var(--text3)',na:'var(--text3)'};
      resultSel.style.color=colors[val]||'var(--text3)';
    }
  },
  printReport(){window.print();},
  copyTextToClipboard(text,btn,originalLabel){
    if(!text) return;
    const fallbackCopy = () => {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly','readonly');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      try { document.execCommand('copy'); } catch(e){}
      area.remove();
    };
    if(navigator.clipboard?.writeText){
      navigator.clipboard.writeText(text).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
    if(btn){
      btn.textContent='Copied to Clipboard';
      btn.classList.add('copied');
      setTimeout(()=>{
        btn.textContent=originalLabel;
        btn.classList.remove('copied');
      },2200);
    }
  },
  copyHomeworkSummary(lid){
    const hw = H.homeworkData(lid,getS());
    if(!hw) return;
    const btn = document.getElementById(`copy_hw_summary_${lid}`);
    this.copyTextToClipboard(H.homeworkSummaryText(hw), btn, 'Copy Homework Summary');
  },
  copyHomeworkMessage(lid){
    const hw = H.homeworkData(lid,getS());
    if(!hw) return;
    const btn = document.getElementById(`copy_hw_message_${lid}`);
    this.copyTextToClipboard(H.homeworkStudentMessage(hw), btn, 'Copy Student Message');
  },

  // â”€â”€ v3: Endorsement Helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  copyEndorsement(reqId){
    const s=getS();if(!s)return;
    const ENDORSEMENTS={
      solo:      `I certify that ${s.name} has received the training required by § 61.87 and is proficient to conduct solo flight. Limitations: solo at KJQF, VFR day only.\n\n${cfiProfile.name||'[CFI Name]'} | Cert #${cfiProfile.certNum||'XXXXXXXXX'} | Exp ${cfiProfile.certExpiry||'__________'}\nDate: ${new Date().toLocaleDateString()}`,
      xc_solo:   `I certify that ${s.name} has received the training required by § 61.93 and is competent to conduct supervised solo cross-country flights in a single-engine airplane.\n\n${cfiProfile.name||'[CFI Name]'} | Cert #${cfiProfile.certNum||'XXXXXXXXX'} | Exp ${cfiProfile.certExpiry||'__________'}\nDate: ${new Date().toLocaleDateString()}`,
    };
    const text=ENDORSEMENTS[reqId];if(!text)return;
    const btn=document.getElementById('ebtn_'+reqId);
    this.copyTextToClipboard(text, btn, 'Generate Endorsement');
  },

  // â”€â”€ v3: Save Personal Minimums â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  savePersonalMins(){
    const s=getS();if(!s)return;
    const d=initSD(s);
    ['windSpd','windGust','crosswind','vis','ceiling'].forEach(k=>{
      const el=document.getElementById('pm_'+k);
      if(el&&el.value!=='')d.personalMins[k]=parseFloat(el.value);
    });
    save();
    const btn=document.getElementById('pmSaveBtn');
    if(btn){btn.textContent='Saved';setTimeout(()=>{btn.textContent='Save Minimums';},1600);}
  },
};


const V={
  dashboard(s){
    if(isStudentMode()){
      const emptyActions = state.students.length===0
        ? '<div class="empty-actions"><button class="btn btn-primary" data-click-action="show-add-student">Create First Student</button></div>'
        : '<div class="empty-actions"><div class="student-mode-empty-note">Use the Active Student picker in the sidebar to open student homework and study tools.</div></div>';
      if(!s)return H.emptyState('', 'STUDENT MODE', 'Select a student to open homework, procedures, performance, and study references.', emptyActions);
      const readiness=H.readinessSnapshot(s);
      const needsReview=H.needsReview(s);
      const nextAction=H.nextTrainingAction(s);
      const activePhase=H.activePhase(s);
      const phaseIds=H.phaseLessonIds(activePhase);
      const phaseDone=phaseIds.filter(lid=>getLStatus(s,lid)==='signed_off').length;
      const lessonId=defaultStudentLessonId(s);
      const lesson=lessonId?(GL[lessonId]||FL[lessonId]):null;
      const lessonLabel=lesson?`${lesson.id} - ${lesson.title}`:'No current lesson selected';
      return`
      <div class="dashboard-hero student-home-hero">
        <div class="dashboard-hero-main">
          <div class="dashboard-hero-eyebrow">Student View</div>
          <div class="dashboard-hero-name">${s.name.toUpperCase()}</div>
          <div class="dashboard-hero-meta">Student Mode Active &middot; Homework, procedures, references, and planning tools</div>
          <div class="dashboard-hero-phase">
            <span class="phase-pill" style="--phase-pill-color:${activePhase.color}">${activePhase.icon} ${activePhase.title}</span>
            <span class="dashboard-hero-note">${phaseDone}/${phaseIds.length} lessons complete in the current phase.</span>
          </div>
        </div>
        <div class="dashboard-hero-actions">
          ${lesson?`<button class="btn btn-primary btn-sm" data-click-action="open-lesson" data-lid="${lesson.id}">Open Homework</button>`:''}
          <button class="btn btn-ghost btn-sm" data-click-action="nav" data-view="procedures">Procedures</button>
          <button class="btn btn-ghost btn-sm" data-click-action="nav" data-view="poh">POH</button>
          <button class="btn btn-ghost btn-sm" data-click-action="nav" data-view="performance">Performance</button>
        </div>
      </div>
      <div class="g2">
        <div class="card">
          <div class="card-hd"><div class="card-title">Current Study Focus</div></div>
          <div class="student-mode-focus-line"><span class="section-label">Lesson</span><span>${lessonLabel}</span></div>
          <div class="student-mode-focus-line"><span class="section-label">Solo Readiness</span><span>${readiness?.solo?.state||'Not enough data'}</span></div>
          <div class="student-mode-focus-line"><span class="section-label">Checkride Readiness</span><span>${readiness?.checkride?.state||'Not enough data'}</span></div>
          <div class="student-mode-focus-note">${nextAction?.detail||'Continue working through the next lesson and review any flagged items before the next flight.'}</div>
        </div>
        <div class="card">
          <div class="card-hd"><div class="card-title">Progress Snapshot</div></div>
          <div class="dashboard-status-grid">
            <div class="dashboard-status-item"><div class="dashboard-status-label">Needs Review</div><div class="dashboard-status-value" style="color:${needsReview.length ? 'var(--red)' : 'var(--green)'}">${needsReview.length}</div><div class="dashboard-status-sub">${needsReview.length ? 'Review before next lesson' : 'No lessons currently flagged'}</div></div>
            <div class="dashboard-status-item"><div class="dashboard-status-label">Current Phase</div><div class="dashboard-status-value" style="color:${activePhase.color}">${activePhase.title}</div><div class="dashboard-status-sub">${phaseDone}/${phaseIds.length} complete</div></div>
          </div>
          <div class="student-mode-quick-links">
            <button class="btn btn-ghost btn-sm" data-click-action="nav-lessons">Browse Lessons</button>
            <button class="btn btn-ghost btn-sm" data-click-action="nav" data-view="performance">Open Performance</button>
          </div>
        </div>
      </div>`;
    }
    const emptyActions = state.students.length===0
      ? '<div class="empty-actions"><button class="btn btn-primary" data-click-action="show-add-student">Create First Student</button></div>'
      : '<div class="empty-actions"><button class="btn btn-primary" data-click-action="nav" data-view="students">Select Student</button><button class="btn btn-ghost" data-click-action="show-add-student">Add Student</button></div>';
    if(!s)return H.emptyState('', 'NO STUDENT SELECTED', 'Select a student to review training progress, lessons, and readiness.', emptyActions);
    const reqDone = REQS.filter(r=>getReq(s,r.id)>=r.min).length;
    const totalHrs=getReq(s,'total'), soloHrs=getReq(s,'solo'), dualHrs=getReq(s,'dual');
    const totalPct=Math.min(100,(totalHrs/40)*100);
    const soloPct=Math.min(100,(soloHrs/10)*100);
    const dualPct=Math.min(100,(dualHrs/20)*100);
    const reqPct=Math.round(reqDone/REQS.length*100);
    const activePhase = H.activePhase(s);
    const nextAction = H.nextTrainingAction(s);
    const needsReview = H.needsReview(s);
    const nextLessonId = nextAction?.action === 'open-lesson'
      ? (nextAction.actionAttr?.match(/data-lid="([^"]+)"/)?.[1] || null)
      : null;
    const nextLesson = nextLessonId ? (GL[nextLessonId]||FL[nextLessonId]) : null;
    const nextIsFL = nextLessonId && !!FL[nextLessonId];
    const nextObjs = nextLesson?.objectives?.slice(0,3) || [];
    const readinessSig = H.readinessDecisionSignal(s);
    const weatherSig = H.weatherDecisionSignal(s);
    return`
    <!-- Zone 1: Student Context -->
    <div class="page-hd">
      <div class="page-hd-main">
        <div class="page-hd-eyebrow">Active Student</div>
        <div class="page-hd-title">${s.name.toUpperCase()}</div>
        <div class="page-hd-sub">
          <span class="chip chip--accent">${activePhase.icon} ${activePhase.title}</span>
          ${nextAction ? ` &middot; Next: <strong>${nextAction.title||''}</strong>` : ''}
        </div>
      </div>
      <div class="page-hd-actions">
        <button class="btn btn-primary btn-sm" data-click-action="nav-lessons">Open Lessons</button>
      </div>
    </div>
    <!-- Zone 2: Today's Plan -->
    <div class="g2" style="margin-bottom:18px">
      <div class="card">
        <div class="card-hd">
          <span class="card-title">Next Lesson</span>
          ${nextIsFL ? '<span class="chip chip--accent">Flight</span>' : '<span class="chip">Ground</span>'}
        </div>
        ${nextLesson ? `
          <div style="font-family:var(--ff-display);font-size:20px;letter-spacing:1px;color:var(--text);margin-bottom:8px">${nextLessonId} — ${nextLesson.title}</div>
          ${nextObjs.length ? `
            <div class="section-lbl">Objectives Preview</div>
            <ul style="margin:0 0 14px 16px;padding:0;font-size:13px;color:var(--text2)">
              ${nextObjs.map(o=>`<li>${o}</li>`).join('')}
            </ul>` : ''}
          <button class="btn btn-primary btn-sm" data-click-action="open-lesson" data-lid="${nextLessonId}">&rarr; Open Lesson</button>
        ` : '<div style="color:var(--text3);font-size:13px">All lessons complete.</div>'}
      </div>
      <div class="card">
        <div class="card-hd"><span class="card-title">Readiness</span></div>
        <div style="margin-bottom:12px;padding:8px;border-radius:6px;background:var(--bg3);border:1px solid var(--border)"><strong>${readinessSig.label}:</strong> ${readinessSig.summary}</div>
        <div style="margin-bottom:12px;padding:8px;border-radius:6px;background:var(--bg3);border:1px solid var(--border)"><strong>${weatherSig.label}:</strong> ${weatherSig.summary}</div>
        <div class="section-lbl">Hours Progress</div>
        <div class="prog-wrap">
          <div class="prog-hd"><span class="prog-lbl">Total</span><span class="prog-v">${totalHrs.toFixed(1)} / 40</span></div>
          <div class="prog-bar"><div class="prog-fill" style="width:${totalPct}%;background:var(--amber)"></div></div>
        </div>
        <div class="prog-wrap">
          <div class="prog-hd"><span class="prog-lbl">Dual</span><span class="prog-v">${dualHrs.toFixed(1)} / 20</span></div>
          <div class="prog-bar"><div class="prog-fill" style="width:${dualPct}%;background:var(--blue)"></div></div>
        </div>
        <div class="prog-wrap">
          <div class="prog-hd"><span class="prog-lbl">Solo</span><span class="prog-v">${soloHrs.toFixed(1)} / 10</span></div>
          <div class="prog-bar"><div class="prog-fill green" style="width:${soloPct}%"></div></div>
        </div>
      </div>
    </div>
    <!-- Gauges strip -->
    <div class="dashboard-gauges">
      ${H.gaugeCard('Total Time', totalHrs, totalHrs.toFixed(1), '40 hrs', totalPct, 'var(--amber)', 'hrs')}
      ${H.gaugeCard('Dual', dualHrs, dualHrs.toFixed(1), '20 hrs', dualPct, 'var(--blue)', 'hrs')}
      ${H.gaugeCard('Solo', soloHrs, soloHrs.toFixed(1), '10 hrs', soloPct, 'var(--green)', 'hrs')}
      ${H.gaugeCard('§61.109', reqDone, String(reqDone), REQS.length+' req', reqPct, reqDone===REQS.length?'var(--green)':'var(--orange)', 'met')}
    </div>
    <!-- Zone 3: Attention Items as horizontal chip strip -->
    <div class="card" style="margin-top:18px">
      <div class="card-hd">
        <span class="card-title">Attention Items</span>
        <button class="btn btn-ghost btn-sm" data-click-action="nav" data-view="reports">See all &rarr;</button>
      </div>
      ${needsReview.length ? `
        <div style="display:flex;flex-wrap:nowrap;overflow-x:auto;gap:6px;padding-bottom:4px">
          ${needsReview.slice(0,8).map(l=>`<button class="chip chip--red" data-click-action="open-lesson" data-lid="${l.id}" style="cursor:pointer;border:none">${l.id} ${l.title}</button>`).join('')}
        </div>
      ` : '<div style="color:var(--text3);font-size:13px">No lessons currently flagged.</div>'}
    </div>`;
  },
  preflightDecision(s){
    const panel = H.preflightDecision(s);
    const toneClass = panel.state === 'GO' ? 'ok' : panel.state === 'CAUTION' ? 'warn' : panel.state === 'NO-GO' ? 'danger' : 'info';
    return `<div class="tool-wrap" style="max-width:900px">
      <div class="tool-header">
        <div class="tool-icon">&#9888;</div>
        <div>
          <div class="tool-title">PREFLIGHT DECISION</div>
          <div class="tool-sub">Training decision support only | instructor judgment required</div>
        </div>
      </div>
      <div class="decision-shell">
        <div class="decision-hero decision-hero-${toneClass}">
          <div class="decision-hero-top">
            <div>
              <div class="decision-eyebrow">Training Decision Support</div>
              <div class="decision-state">${panel.state}</div>
            </div>
            <div class="decision-note">${panel.note}</div>
          </div>
          <div class="decision-summary">${panel.summary}</div>
          <div class="decision-actions">
            ${panel.actions.map(item=>`<button class="btn btn-sm ${item.action==='nav'?'btn-primary':'btn-ghost'}" data-click-action="${item.action}" ${item.attrs}>${item.label}</button>`).join('')}
          </div>
        </div>
        <div class="decision-grid">
          ${panel.signals.map(item=>`<div class="decision-card decision-card-${item.tone}">
            <div class="decision-card-head">
              <div class="decision-card-title">${item.label}</div>
              <span class="decision-chip decision-chip-${item.tone}">${item.tone === 'nogo' ? 'NO-GO' : item.tone === 'caution' ? 'CAUTION' : item.tone === 'go' ? 'GO' : 'INSUFFICIENT'}</span>
            </div>
            <div class="decision-card-summary">${item.summary}</div>
            <div class="decision-card-detail">${item.detail}</div>
          </div>`).join('')}
        </div>
        <div class="decision-panel">
          <div class="decision-panel-title">Review Before Flight</div>
          ${panel.guidance.length
            ? `<div class="decision-list">${panel.guidance.map(item=>`<div class="decision-list-item">${item}</div>`).join('')}</div>`
            : '<div class="report-empty">No specific review item was derived from the current app signals.</div>'}
        </div>
      </div>
    </div>`;
  },

  students(){
    return`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <div style="font-size:13px;color:var(--text2)">${state.students.length} student${state.students.length!==1?'s':''}</div>
      <button class="btn btn-primary" data-click-action="show-add-student">+ New Student</button>
    </div>
    ${state.students.length===0?`<div class="empty"><div class="empty-icon">○</div><div class="empty-title">NO STUDENTS</div><div class="empty-txt">Add your first student to begin.</div></div>`:
    state.students.map(s=>{
      const gp=H.glProgress(s),fp=H.flProgress(s),rds=REQS.filter(r=>getReq(s,r.id)>=r.min).length;
      // Medical expiry calculation
      const medExp=(function(){
        if(!s.medClass||!s.medDate)return null;
        const d=new Date(s.medDate);
        if(s.medClass==='basicmed'){d.setMonth(d.getMonth()+24);}
        else if(s.medClass==='1st'){d.setMonth(d.getMonth()+12);}
        else{d.setMonth(d.getMonth()+24);}
        return d.toISOString().split('T')[0];
      }());
      const medOk=medExp?medExp>=new Date().toISOString().split('T')[0]:null;
      return`<div class="card" style="margin-bottom:10px;border:1.5px solid ${state.activeId===s.id?'var(--amber)':'var(--border)'}">
        <div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:10px">
          <div style="flex:1">
            <div style="font-family:var(--ff-display);font-size:20px;letter-spacing:2px;color:${state.activeId===s.id?'var(--amber)':'var(--text)'};margin-bottom:2px">${s.name.toUpperCase()}</div>
            <div style="font-family:var(--ff-mono);font-size:11px;color:var(--text3);line-height:1.8">
              Part ${s.partType||61} · Started: ${s.startDate||'-'} · CFI: ${s.cfi||'-'}
              ${s.phone?'<br>Phone: '+s.phone:''}${s.email?' · Email: '+s.email:''}
              ${s.dob?'<br>DOB: '+s.dob:''}${s.stuCertNum?' · Cert #: '+s.stuCertNum:''}
            </div>
          </div>
          <div style="display:flex;gap:6px;flex-shrink:0">
            <button class="btn btn-ghost btn-sm" data-click-action="select-student-dashboard" data-student-id="${s.id}">Select</button>
            <button class="btn btn-ghost btn-sm" data-click-action="edit-student" data-student-id="${s.id}">Edit</button>
            <button class="btn btn-red btn-sm" data-click-action="delete-student" data-student-id="${s.id}">Del</button>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding-top:10px;border-top:1px solid var(--border)">
          <div style="text-align:center"><div style="font-family:var(--ff-display);font-size:20px;color:var(--amber)">${gp.pct}%</div><div style="font-family:var(--ff-mono);font-size:9px;color:var(--text3)">GROUND</div></div>
          <div style="text-align:center"><div style="font-family:var(--ff-display);font-size:20px;color:var(--blue)">${fp.pct}%</div><div style="font-family:var(--ff-mono);font-size:9px;color:var(--text3)">FLIGHT</div></div>
          <div style="text-align:center"><div style="font-family:var(--ff-display);font-size:20px;color:var(--green)">${rds}/${REQS.length}</div><div style="font-family:var(--ff-mono);font-size:9px;color:var(--text3)">§61.109</div></div>
          <div style="text-align:center">
            <div style="font-family:var(--ff-display);font-size:20px;color:${medOk===null?'var(--text3)':medOk?'var(--green)':'var(--red)'}">${s.medClass?s.medClass.toUpperCase():'-'}</div>
            <div style="font-family:var(--ff-mono);font-size:9px;color:${medOk===null?'var(--text3)':medOk?'var(--green)':'var(--red)'}">${medExp?'EXP '+medExp:'MEDICAL'}</div>
          </div>
        </div>
        ${s.goals?'<div style="font-size:12px;color:var(--text3);font-style:italic;margin-top:8px;padding-top:8px;border-top:1px solid var(--border)">'+s.goals+'</div>':''}
      </div>`;
    }).join('')}`;
  },

  lessonsView(s){
    const phase=PHASES.find(p=>p.id===curPhase)||PHASES[0];
    const tabs=PHASES.map(p=>{
      const allLids=H.phaseLessonIds(p);
      const done=s?allLids.filter(lid=>getLStatus(s,lid)==='signed_off').length:0;
      const total=allLids.length;
      const pct=total>0?Math.round(done/total*100):0;
      return`<div class="phase-tab${p.id===curPhase?' active':''}" data-phase="${p.id}" data-click-action="set-phase" style="--phase-color:${p.color}">
        <span class="phase-tab-icon">${p.icon}</span>
        <div class="phase-tab-body">
          <div class="phase-tab-title">${p.title}</div>
          <div class="phase-tab-sub">${p.subtitle}</div>
          ${s&&total>0?`<div class="phase-tab-prog"><div class="phase-tab-bar"><div class="phase-tab-fill" style="width:${pct}%;background:${p.color}"></div></div><span class="phase-tab-pct">${done}/${total}</span></div>`:''}
        </div>
      </div>`;
    }).join('');
    const phaseIds = H.phaseLessonIds(phase);
    const nextAction = s ? H.nextTrainingAction(s) : null;
    const readiness = s ? H.readinessSnapshot(s) : null;
    const phaseReview = s ? phaseIds.filter(lid=>Object.values(s.data?.taskStatus?.[lid]||{}).some(x=>x==='needs_review')).length : 0;
    const phaseDone = s ? phaseIds.filter(lid=>getLStatus(s,lid)==='signed_off').length : 0;
    const emptyBanner = !s
      ? `<div class="context-banner"><div class="context-banner-head"><div><div class="context-banner-title">Browse the syllabus without an active student</div><div class="context-banner-text">Lesson content is available now. Select a student to track lesson dates, sign-offs, and readiness in this workflow.</div></div><div class="context-banner-actions"><button class="btn btn-primary btn-sm" data-click-action="nav" data-view="students">Select Student</button></div></div></div>`
      : `<div class="context-banner"><div class="context-banner-head"><div><div class="context-banner-title">${s.name.toUpperCase()}</div><div class="context-banner-text">${phase.title} is active. Use this view to move through the syllabus, reopen review items, and keep progress current.</div><div class="context-banner-meta"><span class="context-chip">${phaseDone}/${phaseIds.length} lessons complete in this phase</span><span class="context-chip">${phaseReview} lesson${phaseReview===1?'':'s'} need review</span><span class="context-chip">${H.glProgress(s).pct}% ground | ${H.flProgress(s).pct}% flight</span><span class="context-chip">Solo: ${readiness.solo.state}</span><span class="context-chip">Checkride: ${readiness.checkride.state}</span></div><div class="context-banner-text context-banner-text-note">${readiness.overall.lessonNote}</div></div><div class="context-banner-actions">${nextAction?`<button class="btn btn-primary btn-sm" data-click-action="${nextAction.action}" ${nextAction.actionAttr||''}>${nextAction.cta}</button>`:''}<button class="btn btn-ghost btn-sm" data-click-action="nav" data-view="reports">Report</button></div></div></div>`;
    return`
    ${emptyBanner}
    <div class="phase-tabs">${tabs}</div>
    <div id="phaseContent">${this.phasePanel(curPhase,s)}</div>`;
  },

  phasePanel(pid,s){
    const phase=PHASES.find(p=>p.id===pid);
    if(!phase)return'';
    const allLids=H.phaseLessonIds(phase);
    const done=s?allLids.filter(lid=>getLStatus(s,lid)==='signed_off').length:0;
    const total=allLids.length;
    const pct=total>0?Math.round(done/total*100):0;
    const nextOpenLesson = s ? allLids.find(lid=>getLStatus(s,lid)!=='signed_off') : allLids[0];
    const reviewCount = s ? allLids.filter(lid=>Object.values(s.data?.taskStatus?.[lid]||{}).some(x=>x==='needs_review')).length : 0;
    const inProgressCount = s ? allLids.filter(lid=>getLStatus(s,lid)==='in_progress').length : 0;
    const header=`
    <div class="phase-overview-card">
      <span class="phase-overview-icon">${phase.icon}</span>
      <div class="phase-overview-body">
        <div class="phase-overview-title" style="color:${phase.color}">${phase.title}</div>
        <div class="phase-overview-text">${phase.desc}</div>
        ${s&&total>0?`<div class="phase-overview-progress"><div class="phase-overview-bar"><div class="phase-overview-fill" style="width:${pct}%;background:${phase.color}"></div></div><span class="phase-overview-count">${done}/${total} lessons complete</span></div>`:`<div class="phase-overview-count">Select a student to track completion and training dates in this phase.</div>`}
      </div>
      <div class="phase-overview-actions">
        ${nextOpenLesson?`<button class="btn btn-ghost btn-sm" data-click-action="open-lesson" data-lid="${nextOpenLesson}">Open ${nextOpenLesson}</button>`:''}
        ${s?'<button class="btn btn-ghost btn-sm" data-click-action="nav" data-view="reports">View Report</button>':''}
      </div>
    </div>`;

    const workflowSummary = s ? `
      <div class="phase-summary-grid">
        <div class="phase-summary-card">
          <div class="phase-summary-label">Completed</div>
          <div class="phase-summary-value" style="color:var(--green)">${done}</div>
          <div class="phase-summary-sub">Lessons signed off in this phase</div>
        </div>
        <div class="phase-summary-card">
          <div class="phase-summary-label">In Progress</div>
          <div class="phase-summary-value" style="color:${phase.color}">${inProgressCount}</div>
          <div class="phase-summary-sub">Lessons currently active</div>
        </div>
        <div class="phase-summary-card">
          <div class="phase-summary-label">Needs Review</div>
          <div class="phase-summary-value" style="color:var(--red)">${reviewCount}</div>
          <div class="phase-summary-sub">Lessons flagged for additional practice</div>
        </div>
      </div>` : '';

    const rows=allLids.map(function(lid){
      const lesson=GL[lid]||FL[lid];
      if(!lesson)return'';
      const isGL=!!GL[lid];
      const status=getLStatus(s,lid);
      const lp=H.lessonTaskProgress(s,lid);
      const isSC=lesson.isStageCheck||lesson.isEndOfCourse;
      const nr=s?(Object.values(s.data&&s.data.taskStatus&&s.data.taskStatus[lid]||{}).filter(function(x){return x==='needs_review';}).length):0;
      const meta=isGL
        ?(lesson.hrs+'hr ground'+(lp.total>0&&s?' | '+lp.done+'/'+lp.total+' tasks':''))
        :((lesson.hrs.dual>0?lesson.hrs.dual+'D ':'')+
          (lesson.hrs.solo>0?lesson.hrs.solo+'S ':'')+
          (lesson.hrs.instrument>0?lesson.hrs.instrument+'IR ':'')+
          (lesson.hrs.night>0?lesson.hrs.night+'N':'' )).trim()+
          (lp.total>0&&s?' | '+lp.done+'/'+lp.total+' tasks':'');
      const typeChip=isGL
        ?'<span class="lesson-type-chip lesson-type-ground">GND</span>'
        :'<span class="lesson-type-chip lesson-type-flight">FLT</span>';
      const ld=s&&s.data&&s.data.lessonDates&&s.data.lessonDates[lid]||{};
      const dateTag=ld.completed
        ?'<span class="row-date done">Done '+ld.completed+'</span>'
        :ld.planned
        ?'<span class="row-date planned">Planned '+ld.planned+'</span>'
        :'';
      const noteBadges=[];
      if(s&&lid===nextOpenLesson&&status!=='signed_off')noteBadges.push('<span class="lesson-inline-note lesson-inline-note-next">Recommended next</span>');
      if(nr>0)noteBadges.push('<span class="lesson-inline-note lesson-inline-note-review">Needs review</span>');
      if(s&&status==='signed_off'&&ld.completed)noteBadges.push('<span class="lesson-inline-note lesson-inline-note-complete">Completed</span>');
      return '<div class="lesson-row'+(isSC?' stage-check':'')+'" data-click-action="open-lesson" data-lid="'+lid+'" style="padding-left:14px;border-left:3px solid '+(status==='signed_off'?'var(--green)':status==='needs_review'?'var(--red)':isGL?'var(--amber)':'var(--blue)')+'">'
        +'<div class="lesson-id" style="color:'+(isSC?'var(--text2)':isGL?'var(--amber)':'var(--blue)')+';min-width:46px">'+lid+'</div>'
        +'<div class="lesson-info">'
          +'<div class="lesson-name">'+lesson.title+typeChip
            +(isSC?' <span class="lesson-flag">STAGE CHECK</span>':'')
            +(lesson.isSolo?' <span class="lesson-flag lesson-flag-solo">SOLO</span>':'')
          +'</div>'
          +'<div class="lesson-meta lesson-meta-row">'+meta+dateTag+'</div>'
          +(noteBadges.length?'<div class="lesson-inline-notes">'+noteBadges.join('')+'</div>':'')
          +(lp.total>0&&s?'<div class="prog-bar lesson-row-progress"><div class="prog-fill'+(status==='signed_off'?' green':'')+(status!=='signed_off'&&status!=='not_started'?' amber':'')+'" style="width:'+lp.pct+'%"></div></div>':'')
        +'</div>'
        +'<div class="lesson-row-side">'
          +(nr>0?'<span class="nav-badge">'+nr+'</span>':'')
          +H.sbadge(status)
        +'</div>'
        +'</div>';
    }).join('');

    return header+workflowSummary+rows;
  },

  procedures(s){
    const filtered = H.filteredProcedures();
    const selected = filtered.find(item => item.id === curProcedureId) || filtered[0] || AIRCRAFT_PROCEDURES[0] || null;
    const searchValue = curProcedureSearch.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
    if(selected && curProcedureId !== selected.id) curProcedureId = selected.id;
    const procedureList = filtered.length
      ? filtered.map(item => {
          const lessonLinks = H.procedureLessonLinks(item);
          return `<button class="procedure-list-card${selected?.id===item.id?' active':''}" data-click-action="open-procedure" data-pid="${item.id}">
            <div class="procedure-list-head">
              <span class="context-chip">${PROCEDURE_CATEGORIES.find(cat => cat.id===item.category)?.label || item.category}</span>
              <span class="procedure-source">p. ${item.sourcePage}</span>
            </div>
            <div class="procedure-list-title">${item.title}</div>
            <div class="procedure-list-summary">${item.summary}</div>
            ${lessonLinks.length?`<div class="procedure-list-lessons">${lessonLinks.slice(0,3).map(lesson=>`<span class="context-chip">${lesson.id}</span>`).join('')}</div>`:''}
          </button>`;
        }).join('')
      : H.emptyState('', 'NO PROCEDURES MATCH', 'Try a different search term or clear the category filter.');
    const detailSection = selected
      ? (() => {
          const lessonLinks = H.procedureLessonLinks(selected);
          const pohLinks = H.relatedPohRefsForProcedure(selected.id);
          const section = (label, items, kind='list') => {
            if(!items || !items.length) return '';
            let content;
            if(kind==='checklist'){
              content=`<ol class="proc-checklist">${items.map(item=>`<li>${item}</li>`).join('')}</ol>`;
            } else if(kind==='callout'){
              content=`<div class="proc-notes">${items.map(item=>`<div class="proc-note proc-note--callout"><span class="proc-note-icon">&#9873;</span><span>${item}</span></div>`).join('')}</div>`;
            } else if(kind==='warning'){
              content=`<div class="proc-notes">${items.map(item=>`<div class="proc-note proc-note--warning"><span class="proc-note-icon">&#9888;</span><span>${item}</span></div>`).join('')}</div>`;
            } else {
              content=`<ol class="proc-steps">${items.map(item=>`<li class="proc-step">${item}</li>`).join('')}</ol>`;
            }
            return `<div class="procedure-section">
              <div class="proc-section-label">${label}</div>
              ${content}
            </div>`;
          };
          return `<div class="procedure-detail-card">
            <div class="procedure-detail-head">
              <div>
                <div class="procedure-detail-kicker">${selected.aircraft}</div>
                <div class="procedure-detail-title">${selected.title}</div>
                <div class="procedure-detail-summary">${selected.summary}</div>
              </div>
              <div class="procedure-detail-actions">
                ${H.procedureSourceMarkup(selected)}
              </div>
            </div>
            <span class="section-lbl" style="font-style:italic">Ref: ${selected.sourceLabel||''} p.${selected.sourcePage||''} · Use with applicable POH/AFM</span>
            ${selected.targetSpeeds?.length?`<div class="procedure-speed-grid">${selected.targetSpeeds.map(item=>`<div class="procedure-speed-chip">${item}</div>`).join('')}</div>`:''}
            ${section('Checklist', selected.checklist, 'checklist')}
            ${section('Setup', selected.setup)}
            ${section('Entry', selected.entry)}
            ${section('Execution', selected.execution)}
            ${section('Recovery', selected.recovery)}
            ${section('Callouts and Notes', selected.callouts, 'callout')}
            ${section('Warnings', selected.warnings, 'warning')}
            ${pohLinks.length?`<div class="card poh-inline-card">
              ${H.renderPohSupport('POH Support', pohLinks.slice(0,3), 'No handbook reference is linked to this procedure yet.')}
            </div>`:''}
            <div class="procedure-detail-footer">
              <div class="procedure-traceability">Source: ${selected.sourceLabel}, page ${selected.sourcePage}</div>
              ${lessonLinks.length?`<div class="procedure-related-lessons">${lessonLinks.map(lesson=>`<button class="btn btn-ghost btn-sm" data-click-action="open-lesson" data-lid="${lesson.id}">${lesson.id} ${lesson.title}</button>`).join('')}</div>`:'<div class="report-empty">No direct lesson links are tracked for this procedure yet.</div>'}
            </div>
          </div>`;
        })()
      : H.emptyState('', 'NO PROCEDURE SELECTED', 'Select a procedure to view the quick-reference detail.');
    return `
    <div class="context-banner">
      <div class="context-banner-head">
        <div>
          <div class="context-banner-title">AIRCRAFT PROCEDURES</div>
          <div class="context-banner-text">${AIRCRAFT_TAG} quick-reference library for school and instructor procedure guidance. This view keeps the PDF content structured, searchable, and linked to relevant lessons.</div>
          <div class="context-banner-meta">
            <span class="context-chip">${AIRCRAFT_TAG}</span>
            <span class="context-chip">${AIRCRAFT_PROCEDURES.length} procedures digitized</span>
            <span class="context-chip">${PROCEDURES_SOURCE_LABEL}</span>
            ${s?`<span class="context-chip">${s.name.toUpperCase()} selected</span>`:'<span class="context-chip">Works without an active student</span>'}
          </div>
        </div>
        <div class="context-banner-actions">
          <a class="btn btn-ghost btn-sm" href="${procedureSourceHref(1)}" target="_blank" rel="noopener noreferrer">Open Source PDF</a>
          <button class="btn btn-ghost btn-sm" data-click-action="nav-lessons">Lessons</button>
        </div>
      </div>
    </div>
    <div class="proc-cat-tabs">
      ${PROCEDURE_CATEGORIES.map(cat=>`<button class="proc-cat-tab${curProcedureCategory===cat.id?' active':''}" data-click-action="set-procedure-category" data-category="${cat.id}">${cat.label}</button>`).join('')}
    </div>
    <div class="procedure-toolbar">
      <input class="finput procedure-search" placeholder="Search procedures, callouts, or lesson IDs" value="${searchValue}" data-input-action="filter-procedures">
    </div>
    <div class="procedure-layout">
      <div class="procedure-list-column">${procedureList}</div>
      <div class="procedure-detail-column">${detailSection}</div>
    </div>`;
  },

  poh(s){
    const filtered = H.filteredPohRefs();
    const selected = filtered.find(item => item.id === curPohId) || filtered[0] || POH_REFERENCES[0] || null;
    const searchValue = curPohSearch.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
    if(selected && curPohId !== selected.id) curPohId = selected.id;
    const refList = filtered.length
      ? filtered.map(item => {
          const lessonLinks = (item.relatedLessonIds || []).map(lid => GL[lid] || FL[lid]).filter(Boolean);
          return `<button class="poh-list-card${selected?.id===item.id?' active':''}" data-click-action="open-poh-ref" data-rid="${item.id}">
            <div class="poh-list-head">
              <span class="context-chip">${POH_CATEGORIES.find(cat => cat.id===item.category)?.label || item.category}</span>
              <span class="procedure-source">p. ${item.sourcePage}</span>
            </div>
            <div class="poh-list-title">${item.title}</div>
            <div class="poh-list-summary">${item.summary}</div>
            ${lessonLinks.length?`<div class="procedure-list-lessons">${lessonLinks.slice(0,3).map(lesson=>`<span class="context-chip">${lesson.id}</span>`).join('')}</div>`:''}
          </button>`;
        }).join('')
      : H.emptyState('', 'NO REFERENCES MATCH', 'Try a different search term or switch the reference category.');
    const detailSection = selected
      ? (() => {
          const lessonLinks = (selected.relatedLessonIds || []).map(lid => GL[lid] || FL[lid]).filter(Boolean);
          const procedureLinks = (selected.relatedProcedureIds || []).map(pid => PROCEDURES_BY_ID[pid]).filter(Boolean);
          const section = (label, items, cls='poh-points') => {
            if(!items || !items.length) return '';
            return `<div class="procedure-section">
              <div class="section-label">${label}</div>
              <div class="${cls}">${items.map(item=>`<div class="procedure-step">${item}</div>`).join('')}</div>
            </div>`;
          };
          return `<div class="poh-detail-card">
            <div class="procedure-detail-head">
              <div>
                <div class="procedure-detail-kicker">${selected.aircraft}</div>
                <div class="procedure-detail-title">${selected.title}</div>
                <div class="procedure-detail-summary">${selected.summary}</div>
              </div>
              <div class="procedure-detail-actions">
                ${H.pohSourceMarkup(selected)}
              </div>
            </div>
            <div class="alert alert-info">
              <div>
                <strong>Handbook-based aircraft reference.</strong>
                Use the original Owner's Handbook for full details, charts, and aircraft-specific documentation.
              </div>
            </div>
            ${section('Key Points', selected.keyPoints)}
            ${section('Limitations / Use Notes', selected.limitations)}
            <div class="procedure-detail-footer">
              <div class="procedure-traceability">Source: ${selected.sourceLabel} | ${selected.sourceSection} | PDF page ${selected.sourcePage}</div>
              <div class="procedure-related-lessons">
                ${procedureLinks.map(item=>`<button class="btn btn-ghost btn-sm" data-click-action="open-procedure" data-pid="${item.id}">${item.title}</button>`).join('')}
                ${lessonLinks.map(lesson=>`<button class="btn btn-ghost btn-sm" data-click-action="open-lesson" data-lid="${lesson.id}">${lesson.id} ${lesson.title}</button>`).join('')}
              </div>
            </div>
          </div>`;
        })()
      : H.emptyState('', 'NO REFERENCE SELECTED', 'Select a handbook-backed reference to view the summary and source link.');
    return `
    <div class="context-banner">
      <div class="context-banner-head">
        <div>
          <div class="context-banner-title">POH REFERENCE</div>
          <div class="context-banner-text">${POH_AIRCRAFT_TAG} handbook support layer for systems, operating, weight-and-balance, and performance study. This view summarizes only selected high-value Owner's Handbook topics and keeps the original source page visible.</div>
          <div class="context-banner-meta">
            <span class="context-chip">${POH_AIRCRAFT_TAG}</span>
            <span class="context-chip">${POH_REFERENCES.length} selective references</span>
            <span class="context-chip">${POH_SOURCE_LABEL}</span>
            ${s?`<span class="context-chip">${s.name.toUpperCase()} selected</span>`:'<span class="context-chip">Works without an active student</span>'}
          </div>
        </div>
        <div class="context-banner-actions">
          <a class="btn btn-ghost btn-sm" href="${pohSourceHref(1)}" target="_blank" rel="noopener noreferrer">Open POH PDF</a>
          <button class="btn btn-ghost btn-sm" data-click-action="nav" data-view="procedures">Procedures</button>
        </div>
      </div>
    </div>
    <div class="procedure-toolbar">
      <input class="finput procedure-search" placeholder="Search systems, performance, W&B, or lessons" value="${searchValue}" data-input-action="filter-poh">
      <div class="procedure-filter-row">
        ${POH_CATEGORIES.map(cat=>`<button class="btn btn-sm ${curPohCategory===cat.id?'btn-primary':'btn-ghost'}" data-click-action="set-poh-category" data-category="${cat.id}">${cat.label}</button>`).join('')}
      </div>
    </div>
    <div class="procedure-layout">
      <div class="procedure-list-column">${refList}</div>
      <div class="procedure-detail-column">${detailSection}</div>
    </div>`;
  },


  lessonDetail(lid,s){
    const lesson=GL[lid]||FL[lid];
    if(!lesson)return'<div class="empty"><div class="empty-title">LESSON NOT FOUND</div></div>';
    const status=getLStatus(s,lid);
    const isFL=lesson.type==='flight';
    const lp=H.lessonTaskProgress(s,lid);
    const studentMode=isStudentMode();
    const activeTab=studentSafeLessonTab(curTab);
    // v3: Determine current phase name for sticky bar
    const phase=PHASES.find(p=>{const lids=p.lessons||[...(p.ground||[]),...(p.flight||[])];return lids.includes(lid);});
    const stickyBar=s?`
    <div class="sticky-lesson-bar">
      <span class="sticky-stu-name">${s.name.toUpperCase()}</span>
            <span class="sticky-phase-tag">${phase?phase.title:'PPL'} · ${lid}</span>
      ${s&&!studentMode?`<button class="btn btn-primary btn-sm sticky-save-btn" id="save_btn_sticky" data-click-action="save-note" data-lid="${lid}">Save</button>`:''}
    </div>`:'';
    const tabs = studentMode
      ? [
          {id:'homework', label:'Homework'},
          {id:'objectives', label:'Brief'},
          {id:'scenario', label:'Scenario'}
        ]
      : [
          {id:'plan',    label:'&#10022; Plan'},
          {id:'fly',     label:'&#9654; Fly'},
          {id:'debrief', label:'&#9998; Debrief'}
        ];
    return`
    ${stickyBar}
    <!-- Type banner strip -->
    <div style="height:5px;border-radius:var(--r) var(--r) 0 0;background:${lesson.isEndOfCourse?'var(--green)':lesson.isStageCheck?'var(--amber)':lesson.isSolo?'var(--blue)':isFL?'var(--blue)':'var(--amber)'};margin-bottom:0"></div>
    <div class="detail-hd">
      <!-- Progress ring + ID stacked -->
      <div style="display:flex;flex-direction:column;align-items:center;gap:2px;flex-shrink:0;width:68px">
        ${s&&lp.total>0?`
        <div style="position:relative;width:64px;height:64px">
          ${H.ring(lp.pct,64,status==='signed_off'?'var(--green)':isFL?'var(--blue)':'var(--amber)')}
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--ff-display);font-size:13px;letter-spacing:1px;color:${status==='signed_off'?'var(--green)':isFL?'var(--blue)':'var(--amber)'}">
            ${lesson.id}
          </div>
        </div>
        <div style="font-family:var(--ff-mono);font-size:9px;color:var(--text3)">${lp.pct}%</div>
        `:`<div class="detail-id" style="font-size:${lesson.id.length>4?'22px':'28px'}">${lesson.id}</div>`}
      </div>
      <div class="detail-body">
        <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:4px">
          <div class="detail-name" style="flex:1">${lesson.title}</div>
          ${lesson.isStageCheck&&!lesson.isEndOfCourse?`<span style="font-family:var(--ff-mono);font-size:10px;font-weight:700;color:var(--amber);background:var(--amber-dim);border:1px solid var(--amber);border-radius:3px;padding:2px 7px;flex-shrink:0;white-space:nowrap">&#9733; STAGE CHECK</span>`:''}
          ${lesson.isEndOfCourse?`<span style="font-family:var(--ff-mono);font-size:10px;font-weight:700;color:var(--green);background:var(--green-dim);border:1px solid var(--green);border-radius:3px;padding:2px 7px;flex-shrink:0;white-space:nowrap">&#9733; PRACTICAL TEST</span>`:''}
          ${lesson.isSolo&&!lesson.isStageCheck&&!lesson.isEndOfCourse?`<span style="font-family:var(--ff-mono);font-size:10px;font-weight:700;color:var(--blue);background:var(--blue-dim);border:1px solid var(--blue);border-radius:3px;padding:2px 7px;flex-shrink:0;white-space:nowrap">SOLO</span>`:''}
        </div>
        <div class="detail-sub">
          ${isFL?`Flight &#183; Stage ${lesson.stage} &#183; Dual: ${lesson.hrs.dual}h &#183; Solo: ${lesson.hrs.solo}h${lesson.hrs.instrument>0?' &#183; IR: '+lesson.hrs.instrument+'h':''}${lesson.hrs.night>0?' &#183; Night: '+lesson.hrs.night+'h':''}`:`Ground &#183; Stage ${lesson.stage} &#183; ${lesson.hrs}hr`}
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
          ${lesson.tolerance?Object.entries(lesson.tolerance).map(([k,v])=>`<div class="tol-chip"><span class="tol-icon">&#9676;</span><span class="tol-label">${k}:</span><span class="tol-val">${v}</span></div>`).join(''):''}
        </div>
        ${lesson.acsItems?.length>0?`<div class="acs-tags" style="margin-top:6px">${lesson.acsItems.map(a=>`<span class="acs-tag">${a}</span>`).join('')}</div>`:''}
        ${s&&lp.total>0?`<div style="margin-top:8px;display:flex;align-items:center;gap:8px">
          <div style="flex:1"><div class="prog-bar"><div class="prog-fill${status==='signed_off'?' green':''}" style="width:${lp.pct}%"></div></div></div>
          <span style="font-family:var(--ff-mono);font-size:11px;color:var(--text3)">${lp.done}/${lp.total} tasks</span>
        </div>`:''}
      </div>
        <div class="detail-actions"${studentMode?' style="display:none"':''}>
          ${s&&status!=='signed_off'?`<button class="btn btn-green btn-sm" data-click-action="sign-off" data-lid="${lid}">&#10003; Sign Off All</button>`:''}
          ${s&&status==='signed_off'?`<span class="sbadge s-signed_off" style="padding:5px 10px">&#10003; Signed Off</span>`:''}
        </div>
      </div>
      <div class="tabs">
      ${tabs.map(tab=>`<div class="tab${tab.id===activeTab?' active':''}" data-tab="${tab.id}" data-click-action="set-tab"${tab.style?` style="${tab.style}"`:''}>${tab.label}</div>`).join('')}
      </div>
      <div id="tabContent">${this.lessonTab(lid,s,activeTab)}</div>`;
  },

  lessonTab(lid,s,tab){
    tab=studentSafeLessonTab(tab);
    const _lesson=GL[lid]||FL[lid];
    if(tab==='stagecheck'&&!(_lesson?.isStageCheck||_lesson?.isEndOfCourse)) tab='tasks';
    switch(tab){
      case 'tasks':      return this.tabTasks(lid,s);
      case 'objectives':  return this.tabObjectives(lid,s);
      case 'scenario':    return this.tabScenario(lid,s);
      case 'instructor':  return this.tabInstructor(lid,s);
      case 'srm':         return this.tabSRM(lid,s);
      case 'debrief':     return this.tabDebrief3(lid,s);
      case 'stagecheck':  return this.tabStageCheck(lid,s);
      case 'homework':    return this.tabHomework(lid,s);
      case 'plan':        return this.tabPlan(lid,s);
      case 'fly':         return this.tabFly(lid,s);
      default:return'';
    }
  },

  tabTasks(lid,s){
    const lesson=GL[lid]||FL[lid];
    const hasS=!!s;
    const isFL=lesson.type==='flight';
    return`
    ${!hasS?`<div class="alert alert-info">Select a student to track task status and grades.</div>`:''}
    ${lesson.scenario?`<div class="scenario-box"><div class="scenario-label">FITS Scenario Context</div><div class="scenario-text">${lesson.scenario}</div></div>`:''}
    <div style="display:flex;flex-direction:column;gap:8px">
    ${lesson.tasks.map(task=>{
      const ts=getTStatus(s,lid,task.id);
      const sg=getSGrade(s,lid,task.id);
      const ig=getIGrade(s,lid,task.id);
      const checks=hasS?getSubChecks(s,lid,task.id):[];
      const subTotal=task.subtasks?.length||0;
      const subDone=task.subtasks?.filter((_,i)=>checks[i]).length||0;
      const expanded=expandedTasks[lid+'_'+task.id];
      // Parse first ACS code for link
      const acsCode=task.acsRef?.split(',')[0]?.trim()||'';
      const acsPage=ACS_PAGES[acsCode]||1;
      const acsHref=`${ACS_URL}#page=${acsPage}`;
      // Parse text ref for link
      const textRef=task.textRef||'';
      const phakMatch=textRef.match(/PHAK\s+(Ch\.\d+)/);
      const afhMatch=textRef.match(/AFH\s+(Ch\.\d+)/);
      const aimMatch=textRef.match(/AIM/);
      return`
      <div style="background:var(--bg2);border:1px solid ${ts==='signed_off'?'var(--green)':ts==='needs_review'?'var(--red)':ts!=='not_started'?'var(--amber)':'var(--border)'};border-radius:var(--r);overflow:hidden">
        <!-- Task Header Row -->
        <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;cursor:pointer" data-click-action="toggle-task" data-lid="${lid}" data-tid="${task.id}">
          <span id="ticon_${lid}_${task.id}" style="font-size:12px;color:var(--text3);flex-shrink:0">${expanded?'-':'+'}</span>
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:500;color:var(--text)">${task.text}</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:3px;align-items:center">
              ${acsCode?`<a href="${acsHref}" target="_blank" class="acs-tag" data-stop-prop="true" title="Open ACS ${acsCode}">ACS ${acsCode}</a>`:''}
              ${phakMatch?`<a href="${REF_URLS.PHAK}" target="_blank" class="task-ref" style="text-decoration:none;color:var(--blue)" data-stop-prop="true">PHAK Chapter ${phakMatch[1].replace('Ch.','')}</a>`:''}
              ${afhMatch?`<a href="${REF_URLS.AFH}" target="_blank" class="task-ref" style="text-decoration:none;color:var(--blue)" data-stop-prop="true">AFH Chapter ${afhMatch[1].replace('Ch.','')}</a>`:''}
              ${aimMatch?`<a href="${REF_URLS.AIM}" target="_blank" class="task-ref" style="text-decoration:none;color:var(--blue)" data-stop-prop="true">AIM</a>`:''}
              ${textRef&&!phakMatch&&!afhMatch&&!aimMatch?`<span class="task-ref">${textRef}</span>`:''}
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
            ${subTotal>0?`<span id="tprog_${lid}_${task.id}" style="font-family:var(--ff-mono);font-size:11px;color:var(--text3);background:var(--bg3);padding:2px 7px;border-radius:8px;border:1px solid var(--border)">${subDone}/${subTotal}</span>`:''}
            <span id="tsbadge_${lid}_${task.id}" class="sbadge s-${ts}">${{not_started:'Not Started',introduced:'Introduced',practiced:'Practiced',proficient:'Proficient',needs_review:'Needs Review',signed_off:'Signed Off'}[ts]}</span>
          </div>
        </div>
        <!-- Expanded Content -->
        <div id="subtasks_${lid}_${task.id}" style="display:${expanded?'block':'none'};border-top:1px solid var(--border);background:var(--bg3)">
          ${task.subtasks&&task.subtasks.length>0?`
          <div style="padding:10px 14px">
            <div style="font-family:var(--ff-mono);font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Checklist Items ${subDone===subTotal&&subTotal>0?'<span style="color:var(--green)">All Complete</span>':''}</div>
            ${task.subtasks.map((sub,i)=>{
              const checked=checks[i]||false;
              return`<label style="display:flex;align-items:flex-start;gap:10px;padding:6px 0;cursor:${hasS?'pointer':'default'};border-bottom:1px solid var(--border);font-size:13px;color:${checked?'var(--text3)':'var(--text2)'}">
                <input type="checkbox" ${checked?'checked':''} ${!hasS?'disabled':''} id="stcb_${lid}_${task.id}_${i}" data-change-action="set-subtask" data-lid="${lid}" data-tid="${task.id}" data-idx="${i}" style="margin-top:2px;flex-shrink:0;accent-color:var(--green);width:15px;height:15px">
                <span style="${checked?'text-decoration:line-through':''}">${sub}</span>
              </label>`;
            }).join('')}
          </div>`:'<div style="padding:10px 14px;font-size:12px;color:var(--text3);font-style:italic">No subtasks defined for this item.</div>'}
          ${hasS?`
          <div style="padding:10px 14px;border-top:1px solid var(--border);background:var(--bg2)">
            <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
              <div>
          <select class="fselect s-${ts}" data-change-action="set-task-status" data-lid="${lid}" data-tid="${task.id}" style="font-size:12px;padding:4px 8px;width:auto">
                  ${[{v:'not_started',l:'Not Started'},{v:'introduced',l:'Introduced'},{v:'practiced',l:'Practiced'},{v:'proficient',l:'Proficient'},{v:'needs_review',l:'Needs Review'},{v:'signed_off',l:'Signed Off'}].map(x=>`<option value="${x.v}"${ts===x.v?' selected':''}>${x.l}</option>`).join('')}
                </select>
              </div>
              ${isFL?`<div style="display:flex;align-items:center;gap:5px">
                <span class="grade-lbl">Student:</span><span id="sg_${lid}_${task.id}">${H.gradeButtons(lid,task.id,'student',sg)}</span>
              </div>
              <div style="display:flex;align-items:center;gap:5px">
                <span class="grade-lbl">CFI:</span><span id="ig_${lid}_${task.id}">${H.gradeButtons(lid,task.id,'instructor',ig)}</span>
              </div>`:''}
            </div>
          </div>`:''}
        </div>
      </div>`;
    }).join('')}
    </div>
    ${hasS&&isFL?`<div class="alert alert-info" style="margin-top:12px">S = Student self-grade first, then I = Instructor grade · U/M/S/G/E (FITS Learner-Centered Grading). Checking all subtasks auto-signs off the task.</div>`:''}`;
  },

  tabScenario(lid,s){
    const lesson=GL[lid]||FL[lid];
    const isFL=lesson.type==='flight';

    // Completion standard summary
    const tolEntries=lesson.tolerance?Object.entries(lesson.tolerance):[];
    const stdText=isFL&&tolEntries.length>0
      ?tolEntries.map(([k,v])=>`<div style="text-align:center;background:var(--bg2);border:1px solid var(--border);border-radius:var(--r);padding:9px 14px"><div style="font-family:var(--ff-mono);font-size:10px;color:var(--text3);text-transform:uppercase;margin-bottom:2px">${k}</div><div style="font-family:var(--ff-display);font-size:20px;letter-spacing:1px;color:var(--amber)">${v}</div></div>`).join('')
      :`<div style="font-family:var(--ff-mono);font-size:12px;color:var(--text2);padding:8px 0">ACS Completion Standard - all knowledge areas demonstrated to evaluator satisfaction</div>`;

    // Objective summary â€” one sentence per task
    const objectives=lesson.tasks.map(t=>t.text);

    // What-if items
    const whatIf=lesson.whatIf||[];

    return`
    <!-- SCENARIO MISSION BRIEF -->
    ${lesson.scenario?`
    <div style="background:linear-gradient(135deg,#1e3a5f,#1d4ed8);border-radius:var(--r);padding:16px 18px;margin-bottom:14px;color:#fff">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <span style="font-size:18px">Flight</span>
        <span style="font-family:var(--ff-mono);font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#93c5fd">Mission Brief - ${lesson.id} · ${lesson.title}</span>
      </div>
      <div style="font-size:14px;line-height:1.7;font-style:italic;color:#e0f2fe">${lesson.scenario}</div>
    </div>`:`
    <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--r);padding:14px 16px;margin-bottom:14px">
      <div style="font-family:var(--ff-mono);font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--text3);margin-bottom:5px">Mission Brief</div>
      <div style="font-size:13px;color:var(--text3);font-style:italic">This is a ground lesson - no flight scenario. Use the debrief questions tab for discussion prompts.</div>
    </div>`}

    <!-- LESSON OBJECTIVE -->
    <div style="margin-bottom:14px">
      <div style="font-family:var(--ff-mono);font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--text3);margin-bottom:8px">Lesson Objective</div>
      <div style="background:var(--bg3);border:1px solid var(--border);border-left:3px solid var(--blue);border-radius:var(--r);padding:12px 15px">
        ${isFL?`<div style="font-size:13px;color:var(--text2);line-height:1.8">
          ${objectives.map((o,i)=>`<div style="display:flex;gap:8px;padding:3px 0;${i<objectives.length-1?'border-bottom:1px solid var(--border)':''}">
            <span style="font-family:var(--ff-mono);font-size:11px;color:var(--blue);font-weight:700;flex-shrink:0;margin-top:1px">${String(i+1).padStart(2,'0')}</span>
            <span>${o}</span>
          </div>`).join('')}
        </div>`:`<div style="font-size:13px;color:var(--text2);line-height:1.8">
          ${objectives.map((o,i)=>`<div style="display:flex;gap:8px;padding:3px 0;${i<objectives.length-1?'border-bottom:1px solid var(--border)':''}">
            <span style="font-family:var(--ff-mono);font-size:11px;color:var(--amber);font-weight:700;flex-shrink:0;margin-top:1px">${String(i+1).padStart(2,'0')}</span>
            <span>${o}</span>
          </div>`).join('')}
        </div>`}
      </div>
    </div>

    <!-- COMPLETION STANDARD -->
    <div style="margin-bottom:16px">
      <div style="font-family:var(--ff-mono);font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--text3);margin-bottom:8px">Completion Standard</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${stdText}
      </div>
        ${isFL&&lesson.isStageCheck?`<div style="font-family:var(--ff-mono);font-size:11px;color:var(--amber);margin-top:7px;padding:7px 10px;background:#fffbeb;border:1px solid #fde68a;border-radius:var(--r)">Stage Check - all tasks must meet ACS tolerances. Any unsatisfactory area requires additional instruction and re-check before advancement.</div>`:''}
        ${isFL&&lesson.isSolo?`<div style="font-family:var(--ff-mono);font-size:11px;color:var(--blue);margin-top:7px;padding:7px 10px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:var(--r)">Solo flight - student demonstrates autonomous PIC decision-making. No instructor intervention.</div>`:''}
    </div>

    <!-- WHAT IF â€” SRM DISCUSSION STARTERS -->
    ${whatIf.length>0?`
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap">
      <span style="background:var(--red);color:#fff;border-radius:3px;padding:3px 10px;font-family:var(--ff-mono);font-size:10px;font-weight:700;letter-spacing:1px">WHAT IF?</span>
      <span style="font-family:var(--ff-mono);font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--text3);flex:1">SRM Discussion Starters</span>
      ${(function(){const disc=s&&s.data&&s.data.wiDiscussed&&s.data.wiDiscussed[lid]?Object.values(s.data.wiDiscussed[lid]).filter(Boolean).length:0;return disc>0?'<span style="font-family:var(--ff-mono);font-size:10px;color:var(--green);background:#f0fdf4;border:1px solid #86efac;border-radius:3px;padding:2px 8px">'+disc+'/'+whatIf.length+' discussed</span>':''})()}
    </div>
    <div style="display:flex;flex-direction:column;gap:7px">
      ${whatIf.map((item,i)=>{
        const q=item.q||item;
        const a=item.a||'';
        const aid=`wi_${lid}_${i}`;
        const wiDisc=s&&s.data&&s.data.wiDiscussed&&s.data.wiDiscussed[lid]&&s.data.wiDiscussed[lid][i];
        return`<div id="wi_card_${lid}_${i}" style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;opacity:${wiDisc?'0.5':'1'};transition:opacity .2s">
      <div style="display:flex;gap:12px;align-items:flex-start;padding:11px 14px;cursor:pointer" data-click-action="toggle-display" data-target-id="${aid}">
                <div style="flex-shrink:0;width:24px;height:24px;background:${wiDisc?'#dcfce7':'#fef2f2'};border:1px solid ${wiDisc?'#86efac':'#fecaca'};border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--ff-display);font-size:13px;color:${wiDisc?'var(--green)':'var(--red)'};margin-top:1px">${wiDisc?'Done':String(i+1)}</div>
            <div style="flex:1;font-size:13px;color:var(--text2);line-height:1.6">${q}</div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0;margin-top:2px">
              <span style="font-family:var(--ff-mono);font-size:10px;color:var(--text3);border:1px solid var(--border);border-radius:3px;padding:1px 6px;white-space:nowrap">Answer ?</span>
              ${s?`<button id="wi_disc_${lid}_${i}" class="wi-disc-btn${wiDisc?' done':''}" data-click-action="toggle-wi" data-lid="${lid}" data-idx="${i}">${wiDisc?'Discussed':'Mark Discussed'}</button>`:''}
            </div>
          </div>
          ${a?`<div id="${aid}" style="display:none;padding:10px 14px 12px 50px;background:linear-gradient(135deg,#f0fdf4,#dcfce7);border-top:1px solid #86efac">
            <div style="font-family:var(--ff-mono);font-size:10px;color:var(--green);text-transform:uppercase;letter-spacing:1px;margin-bottom:5px">? Suggested Answer</div>
            <div style="font-size:13px;color:#14532d;line-height:1.7">${a}</div>
          </div>`:''}
        </div>`;
      }).join('')}
    </div>`:`
    <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--r);padding:14px;font-size:13px;color:var(--text3);font-style:italic;text-align:center">No what-if scenarios defined for this lesson.</div>`}
    `;
  },

  tabObjectives(lid,s){
    const lesson=GL[lid]||FL[lid];
    const isFL=lesson.type==='flight';
    const stageCtx=isFL
        ?`Stage ${lesson.stage} Flight Lesson · ${['','Pre-Solo','Cross-Country & Night','Practical Test'][lesson.stage]||''}`
        :`Stage ${lesson.stage} Ground Lesson · ${lesson.stage===1?'Aviation Foundations':'Weather, Navigation & Planning'}`;
    const taskObjs=lesson.tasks||[];
    const debriefQs=lesson.debrief||[];
    const studentMode=isStudentMode();

    return`
    <!-- Lesson header -->
    <div style="background:linear-gradient(135deg,var(--bg3),var(--bg2));border:1px solid var(--border);border-radius:var(--r);padding:13px 15px;margin-bottom:14px">
      <div style="font-family:var(--ff-mono);font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin-bottom:3px">${stageCtx}</div>
      <div style="font-family:var(--ff-display);font-size:20px;letter-spacing:2px;margin-bottom:4px">${lesson.title}</div>
      <div style="font-family:var(--ff-mono);font-size:11px;color:var(--text3)">${isFL?'Flight lesson':'Ground lesson'} · ${taskObjs.length} objective${taskObjs.length!==1?'s':''}</div>
    </div>

    ${lesson.scenario?`
    <!-- What to expect this flight (flight lessons) -->
    <div class="section-label">What to expect this flight</div>
    <div style="background:linear-gradient(135deg,rgba(29,78,216,.08),rgba(29,78,216,.04));border:1px solid rgba(99,179,237,.2);border-left:3px solid var(--blue);border-radius:var(--r);padding:12px 14px;margin-bottom:14px">
      <div style="font-size:13px;color:var(--text);line-height:1.65">${lesson.scenario}</div>
    </div>
    `:''}

    ${!isFL&&lesson.coaching&&!studentMode?`
    <!-- CFI lesson approach (ground lessons, instructor mode only) -->
    <div class="section-label">Lesson approach</div>
    <div style="background:linear-gradient(135deg,rgba(217,119,6,.07),rgba(217,119,6,.03));border:1px solid rgba(217,119,6,.25);border-left:3px solid var(--amber);border-radius:var(--r);padding:12px 14px;margin-bottom:14px">
      <div style="font-size:13px;color:var(--text);line-height:1.65">${lesson.coaching}</div>
    </div>
    `:''}

    ${!isFL&&studentMode?`
    <!-- Student-facing ground lesson intent -->
    <div class="section-label">What we're covering today</div>
    <div style="background:var(--bg3);border:1px solid var(--border);border-left:3px solid var(--amber);border-radius:var(--r);padding:12px 14px;margin-bottom:14px">
      <div style="font-size:13px;color:var(--text2);line-height:1.65">This is a <strong>${lesson.hrs}-hour ground lesson</strong> covering ${lesson.title.toLowerCase()}. Come prepared with any questions from your reading. The pre-flight discussion below outlines what we'll talk through together before moving on.</div>
    </div>
    `:''}

    ${debriefQs.length>0?`
    <!-- Pre-flight discussion questions -->
    <div class="section-label">Pre-flight discussion</div>
    <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:16px">
      ${debriefQs.map(q=>`
      <div style="display:flex;gap:10px;align-items:flex-start;background:var(--bg3);border:1px solid var(--border);border-radius:var(--r);padding:9px 12px">
        <span style="font-family:var(--ff-mono);font-size:14px;color:var(--blue);line-height:1.3;flex-shrink:0">?</span>
        <div style="font-size:13px;color:var(--text2);line-height:1.5">${q}</div>
      </div>`).join('')}
    </div>`:''}

    <!-- Lesson objectives -->
    <div class="section-label">We'll work on</div>
    <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:16px">
      ${taskObjs.map((t,i)=>{
        const acsCode=(t.acsRef||'').split(',')[0].trim();
        const pg=ACS_PAGES[acsCode]||1;
        return`<div style="display:flex;gap:10px;align-items:flex-start;background:var(--bg3);border:1px solid var(--border);border-radius:var(--r);padding:9px 12px">
          <span style="font-family:var(--ff-display);font-size:18px;color:var(--amber);line-height:1;width:24px;flex-shrink:0">${i+1}</span>
          <div style="flex:1">
            <div style="font-size:13px;font-weight:500;color:var(--text);margin-bottom:3px">${t.text}</div>
            <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
              ${acsCode?`<a href="${ACS_URL}#page=${pg}" target="_blank" class="acs-tag" style="font-size:10px">ACS ${acsCode} &#8599;</a>`:''}
              ${(t.subtasks||[]).length>0?`<span style="font-family:var(--ff-mono);font-size:10px;color:var(--text3)">${t.subtasks.length} proficiency items</span>`:''}
            </div>
          </div>
        </div>`;
      }).join('')}
    </div>

    ${isFL&&lesson.tolerance?`
    <div class="section-label">Completion standards</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">
      ${Object.entries(lesson.tolerance).map(([k,v])=>`
      <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--r);padding:10px 14px;text-align:center">
        <div style="font-family:var(--ff-mono);font-size:10px;color:var(--text3);text-transform:uppercase">${k}</div>
        <div style="font-family:var(--ff-display);font-size:20px;letter-spacing:1px;color:var(--amber)">${v}</div>
      </div>`).join('')}
    </div>`:''}

    ${(lesson.acsItems||[]).length>0?`
    <div class="section-label">ACS areas addressed</div>
    <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--r);padding:12px;margin-bottom:14px">
      ${lesson.acsItems.map(a=>{
        const code=a.split(' ')[0];
        const pg=ACS_PAGES[code]||1;
        return`<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid var(--border);font-size:13px">
          <a href="${ACS_URL}#page=${pg}" target="_blank" class="acs-tag" style="flex-shrink:0">${code} &#8599;</a>
          <span style="color:var(--text2)">${a.replace(code+' ','')}</span>
        </div>`;
      }).join('')}
    </div>`:''}`;
  },

  tabInstructor(lid,s){
    const lesson=GL[lid]||FL[lid];
    const isFL=lesson.type==='flight';

    // Determine prerequisites from lesson id
    function prevLesson(id){
      const glKeys=Object.keys(GL), flKeys=Object.keys(FL);
      const arr=id.startsWith('GL')?glKeys:flKeys;
      const idx=arr.indexOf(id);
      return idx>0?arr[idx-1]:null;
    }
    const prereq=prevLesson(lid);
    const prereqLesson=prereq?(GL[prereq]||FL[prereq]):null;

    // Endorsements
    const endorsements=[];
    if(lesson.isPresolo){
endorsements.push({type:'Required',text:'§61.87(b) presolo knowledge test endorsement - all errors reviewed and corrected'});
endorsements.push({type:'Issues',text:'§61.87(n) solo flight endorsement - specific aircraft make/model, KJQF pattern, 90-day validity'});
    }
    if(lesson.isSolo&&lid==='FL11'){
endorsements.push({type:'Required',text:'§61.87(n) current solo endorsement - verify before student enters aircraft alone'});
    }
    if(lid==='FL20'||lid==='FL20A'||lid==='FL20B'){
endorsements.push({type:'Required',text:'§61.93(c)(3) specific route solo XC endorsement - instructor reviews navlog and endorses each route'});
    }
    if(lesson.isStageCheck&&!lesson.isEndOfCourse){
endorsements.push({type:'Issues (if satisfactory)',text:'Stage check completion endorsement - documented in student record with check instructor\'s certificate number'});
    }
    if(lid==='FL25'){
      endorsements.push({type:'Issues (if satisfactory)',text:'?61.39(a)(6) practical test preparation endorsement ? within 2 calendar months preceding the month of application'});
      endorsements.push({type:'Issues (if satisfactory)',text:'?61.103(f) specific aircraft endorsement ? student is prepared for checkride in make/model'});
    }

    // Weather minimums for the lesson type
    const wxMins=isFL?(
      lesson.isSolo
?'VFR day: 3 SM vis, 1,000 ft ceiling minimum for solo operations at KJQF. Wind <= 10 kt recommended for solo students. Check for morning fog clearance before early flights.'
        :lid==='FL18'||lid==='FL19'
?'Night VFR: 3 SM vis, 1,000 ft ceiling, wind <= 12 kt. No valley fog or fog forecast within 2 hours of planned landing time. KJQF VASI/PAPI must be operational.'
:'VFR dual: 3 SM vis, 1,500 ft ceiling minimum for productive dual instruction. Winds <= 20 kt. Avoid afternoon convective turbulence west of KJQF in summer (May-Oct).'
):'Ground lesson - no weather minimums. Can be conducted on any day.';

    // Instructor role description
    const instrRole=isFL?(
      lesson.isSolo&&lid!=='FL11'&&lid!=='FL13'
?'Observer - student flies solo. Instructor available by radio for emergency. Do not intervene unless safety is at risk. Debrief using FITS learner-centered framework after flight.'
        :lid==='FL11'
?'Observer after dual warm-up - stand on ramp, monitor on KJQF Tower (119.7) / CTAF. Radio available for emergency only. Do not transmit unless safety concern. Document every circuit observed.'
          :lesson.isStageCheck
?'Check Instructor (not primary CFI) - conduct formal stage check per ACS standards. Document all areas evaluated, grade each task, note any unsatisfactory areas requiring re-instruction.'
:'Dual Instructor - demonstrate, then transfer controls. Coach from the right seat. Use positive transfer of controls. Introduce new concepts; reinforce previously taught material.'
):'Ground Instructor - lead discussion. Use actual aircraft documents, sectional charts, and POH. Encourage questions. Test understanding with scenario-based oral questions throughout.';

    // Time breakdown
    const timeBreakdown=isFL?[
      lesson.hrs.dual>0?`Dual: ${lesson.hrs.dual} hr`:'',
      lesson.hrs.solo>0?`Solo: ${lesson.hrs.solo} hr`:'',
      lesson.hrs.instrument>0?`Instrument ref: ${lesson.hrs.instrument} hr`:'',
      lesson.hrs.night>0?`Night: ${lesson.hrs.night} hr`:''
    ].filter(Boolean):[`Ground instruction: ${lesson.hrs} hr`];

    // Student preparation
    const stuPrep=isFL?[
prereqLesson?`Complete ${prereqLesson.id} - ${prereqLesson.title} (previous lesson)`:'',
      lesson.isPresolo?'Complete presolo written knowledge test before this flight':'',
      lid==='FL17'||lid==='FL20'||lid==='FL20A'||lid==='FL20B'?'Complete full navlog, weather brief, W&B, and NOTAMs before arriving at airport':'',
      lid==='FL18'||lid==='FL19'?'Review night operations: KJQF runway/taxiway lighting, VASI interpretation, dark adaptation':'',
      'Review previous lesson debrief notes and any carry-forward items',
      'Self-brief: IMSAFE checklist completed before arriving at airport'
    ].filter(Boolean):[
prereqLesson?`Complete ${prereqLesson.id} - ${prereqLesson.title}`:'',
      'Read assigned PHAK/AFH chapters before lesson',
      'Review any questions from previous ground session',
    ].filter(Boolean);

    // Risk management focus
    const rmFocus=isFL?[
lesson.isSolo?'Student is sole occupant - verify all solo endorsements current, weather conservative, aircraft airworthy':'',
      lesson.hrs.instrument>0?'Hood time: ensure student is well trimmed before donning view-limiting device. Monitor for over-correction and spatial disorientation signs':'',
      lesson.hrs.night>0?'Night ops: confirm all aircraft lighting operational. Brief black-hole approach illusion. Marine layer / radiation fog risk at KJQF after midnight':'',
      lesson.isPresolo?'Presolo evaluation: set a firm standard. Intervention = not ready. Document each intervention with specific maneuver and nature of correction':'',
      ...(lesson.errors||[]).map(e=>`Watch for: ${e}`)
    ].filter(Boolean):[
'Maintain student engagement - ground lessons lose attention after 45 minutes. Use scenario questions to re-focus.',
      ...(lesson.errors||[]).map(e=>`Common misunderstanding: ${e}`)
    ].filter(Boolean);

    return`
    <!-- Lesson Overview Header -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
      <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--r);padding:12px">
        <div class="section-label" style="margin-bottom:6px">Lesson Time Budget</div>
        ${timeBreakdown.map(t=>`<div style="font-family:var(--ff-mono);font-size:12px;color:var(--text2);padding:2px 0">? ${t}</div>`).join('')}
${isFL&&lesson.isSolo?'<div style="font-family:var(--ff-mono);font-size:10px;color:var(--blue);margin-top:5px">SOLO FLIGHT</div>':''}
${lesson.isStageCheck?'<div style="font-family:var(--ff-mono);font-size:10px;color:var(--amber);margin-top:5px">STAGE CHECK - Different instructor required</div>':''}
      </div>
      <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--r);padding:12px">
        <div class="section-label" style="margin-bottom:6px">Instructor Role</div>
        <div style="font-size:12px;color:var(--text2);line-height:1.6">${instrRole}</div>
      </div>
    </div>

    <!-- Weather Minimums -->
    <div style="background:${isFL&&(lesson.isSolo||lesson.hrs.night>0)?'linear-gradient(135deg,#fffbeb,#fef3c7)':'var(--bg3)'};border:1px solid ${isFL&&(lesson.isSolo||lesson.hrs.night>0)?'var(--amber)':'var(--border)'};border-radius:var(--r);padding:12px;margin-bottom:14px">
      <div class="section-label" style="margin-bottom:5px">Weather Minimums &amp; Conditions</div>
      <div style="font-size:13px;color:var(--text2);line-height:1.6">${wxMins}</div>
    </div>

    <!-- Student Preparation -->
    <div class="section-label">Student Preparation Required Before Lesson</div>
    <ul class="checklist" style="margin-bottom:14px">
      ${stuPrep.map(p=>`<li><span class="cl-dot" style="color:var(--blue)">?</span><span style="font-size:13px">${p}</span></li>`).join('')}
    </ul>

    <!-- Instructor Coaching Notes -->
    <div class="section-label">Coaching Notes &amp; Technique</div>
    <div style="background:var(--bg3);border:1px solid var(--border);border-left:3px solid var(--amber);border-radius:var(--r);padding:13px 15px;font-size:13px;line-height:1.7;color:var(--text2);margin-bottom:14px">
      ${lesson.coaching||'<em style="color:var(--text3)">No coaching notes for this lesson.</em>'}
    </div>

    <!-- Common Errors -->
    ${(lesson.errors||[]).length>0?`
<div class="section-label">Common Errors - Watch and Correct</div>
    <div style="display:flex;flex-direction:column;gap:5px;margin-bottom:14px">
      ${lesson.errors.map((e,i)=>`
      <div style="display:flex;gap:10px;align-items:flex-start;background:#fef2f2;border:1px solid #fecaca;border-radius:var(--r);padding:9px 12px">
        <span style="font-family:var(--ff-mono);font-size:10px;font-weight:700;color:#dc2626;background:#fee2e2;border-radius:3px;padding:1px 5px;flex-shrink:0;margin-top:1px">ERR ${i+1}</span>
        <span style="font-size:13px;color:#991b1b">${e}</span>
      </div>`).join('')}
    </div>`:''}

    <!-- Risk Management Focus -->
    ${rmFocus.length>0?`
    <div class="section-label">Risk Management Focus</div>
    <ul class="checklist" style="margin-bottom:14px">
      ${rmFocus.map(r=>`<li><span class="cl-dot" style="color:var(--red)">?</span><span style="font-size:13px">${r}</span></li>`).join('')}
    </ul>`:''}

    <!-- Endorsements -->
    ${endorsements.length>0?`
    <div class="section-label">Endorsements</div>
    <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:14px">
      ${endorsements.map(e=>`
      <div style="background:${e.type.includes('Issues')?'linear-gradient(135deg,#f0fdf4,#dcfce7)':'var(--bg3)'};border:1px solid ${e.type.includes('Issues')?'#86efac':'var(--border)'};border-radius:var(--r);padding:9px 12px;display:flex;gap:10px;align-items:flex-start">
        <span style="font-family:var(--ff-mono);font-size:10px;font-weight:700;color:${e.type.includes('Issues')?'var(--green)':'var(--amber)'};background:${e.type.includes('Issues')?'#bbf7d0':'#fef3c7'};border-radius:3px;padding:1px 6px;flex-shrink:0;white-space:nowrap;margin-top:1px">${e.type.toUpperCase()}</span>
        <span style="font-size:13px;color:var(--text2)">${e.text}</span>
      </div>`).join('')}
    </div>`:''}

    <!-- References -->
    <div class="section-label">Reference Materials</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:4px">
      ${(lesson.acsItems||[]).map(a=>{
        const code=a.split(' ')[0];
        const pg=ACS_PAGES[code]||1;
        return`<a href="${ACS_URL}#page=${pg}" target="_blank" class="acs-tag">ACS ${code} &#8599;</a>`;
      }).join('')}
      <a href="${REF_URLS.PHAK}" target="_blank" class="task-ref" style="text-decoration:none;color:var(--blue);border-color:var(--blue)">PHAK &#8599;</a>
      ${isFL?`<a href="${REF_URLS.AFH}" target="_blank" class="task-ref" style="text-decoration:none;color:var(--blue);border-color:var(--blue)">AFH &#8599;</a>`:''}
      <a href="${REF_URLS.AIM}" target="_blank" class="task-ref" style="text-decoration:none;color:var(--blue);border-color:var(--blue)">AIM &#8599;</a>
    </div>
    <div style="font-family:var(--ff-mono);font-size:10px;color:var(--text3);margin-top:6px">Task-level references with chapter anchors are linked on the Tasks &amp; Checklist tab.</div>
  `;
  },


  tabHomework(lid,s){
      const hw = H.homeworkData(lid,s);
      if(!hw) return '<div class="alert alert-warn">Homework is not available for this lesson.</div>';
      const printActive = curHomeworkView !== 'digital';
      const backTab = isStudentMode() ? 'objectives' : 'tasks';
      const backLabel = isStudentMode() ? 'Brief' : 'Back to Lesson';
      return `
      <div class="hw-shell">
        <div class="hw-screen-only hw-toolbar">
          <div class="tool-tabs hw-view-tabs">
            <button class="tool-tab ${printActive ? 'active' : ''}" data-click-action="set-homework-view" data-homework-view="print">Print Homework</button>
          <button class="tool-tab ${!printActive ? 'active' : ''}" data-click-action="set-homework-view" data-homework-view="digital">Digital Homework</button>
        </div>
        <div class="hw-toolbar-actions">
            ${printActive
              ? '<button class="btn btn-ghost btn-sm" data-click-action="print">&#128424; Print Homework Sheet</button>'
              : `<button class="btn btn-primary btn-sm" data-click-action="download-homework-file" data-lid="${lid}">Download Homework File</button>`}
            <button class="btn btn-ghost btn-sm" data-click-action="set-tab" data-tab="${backTab}">&#8592; ${backLabel}</button>
          </div>
        </div>
        ${printActive ? H.renderHomeworkPrint(hw) : H.renderHomeworkDigital(hw,{ showDownload:false })}
      </div>`;
  },

  tabStageCheck(lid,s){
    const lesson=GL[lid]||FL[lid];
    const hasS=!!s;
    const sc=s&&s.data&&s.data.stageChecks?s.data.stageChecks[lid]||{}:{};

    // ACS areas by stage check
    const isEOC=lesson.isEndOfCourse;
    const acsAreas=lid==='FL12'?[
      {code:'I',title:'Preflight Preparation',tasks:['A. Pilot Qualifications','B. Airworthiness','C. Weather','E. Airspace','F. Performance','G. Systems','H. Human Factors']},
      {code:'II',title:'Preflight Procedures',tasks:['A. Preflight Assessment','B. Flight Deck Management','C. Engine Start','D. Taxiing','E. Pre-Takeoff Check']},
      {code:'III',title:'Airport & Airspace Operations',tasks:['A. Communications','B. Traffic Patterns']},
      {code:'IV',title:'Takeoffs, Landings & Go-Arounds',tasks:['A. Normal Takeoff','B. Normal Landing','G. Forward Slip','H. Go-Around']},
      {code:'V',title:'Performance Maneuvers',tasks:['A. Steep Turns','B. Ground Reference']},
      {code:'VII',title:'Slow Flight & Stalls',tasks:['A. Slow Flight','B. Power-Off Stalls','C. Power-On Stalls','D. Spin Awareness']},
      {code:'VIII',title:'Basic Instrument Maneuvers',tasks:['A. Straight & Level','B. Constant Airspeed Climbs','C. Constant Airspeed Descents','D. Turns to Headings','E. Recovery from Unusual Attitudes']},
      {code:'IX',title:'Emergency Operations',tasks:['A. Emergency Descent','B. Emergency Approach','C. Systems Malfunctions']},
      {code:'XI',title:'Postflight',tasks:['A. After Landing, Parking & Securing']}
    ]:[
      {code:'I',title:'Preflight Preparation',tasks:['A. Pilot Qualifications','B. Airworthiness','C. Weather Information','D. Cross-Country Planning','E. National Airspace','F. Performance','G. Operation of Systems','H. Human Factors']},
      {code:'II',title:'Preflight Procedures',tasks:['A. Preflight Assessment','B. Flight Deck Management','C. Engine Starting','D. Taxiing','E. Pre-Takeoff Check']},
      {code:'III',title:'Airport & Airspace Operations',tasks:['A. Communications','B. Traffic Patterns']},
      {code:'IV',title:'Takeoffs, Landings & Go-Arounds',tasks:['A. Normal Takeoff','B. Normal Landing','C. Soft-Field T/O','D. Soft-Field Landing','E. Short-Field T/O','F. Short-Field Landing','G. Forward Slip','H. Go-Around']},
      {code:'V',title:'Performance & Ground Reference',tasks:['A. Steep Turns','B. Ground Reference Maneuvers']},
      {code:'VI',title:'Navigation',tasks:['A. Pilotage & Dead Reckoning','B. Navigation Systems','C. Diversion','D. Lost Procedures']},
      {code:'VII',title:'Slow Flight & Stalls',tasks:['A. Slow Flight','B. Power-Off Stalls','C. Power-On Stalls','D. Spin Awareness']},
      {code:'VIII',title:'Basic Instrument Maneuvers',tasks:['A. Straight & Level','B. Constant Airspeed Climbs','C. Constant Airspeed Descents','D. Turns to Headings','E. Recovery from Unusual Attitudes','F. Radio Nav & Radar Services']},
      {code:'IX',title:'Emergency Operations',tasks:['A. Emergency Descent','B. Emergency Approach','C. Systems Malfunctions','D. Emergency Equipment']},
      {code:'X',title:'Night Operations',tasks:['A. Night Preparation']},
      {code:'XI',title:'Postflight',tasks:['A. After Landing, Parking & Securing']}
    ];

    const resultColor={pass:'var(--green)',fail:'var(--red)',incomplete:'var(--text3)',na:'var(--text3)'};
    const resultBg={pass:'#f0fdf4',fail:'#fef2f2',incomplete:'var(--bg3)',na:'var(--bg3)'};

    return`
    ${!hasS?'<div class="alert alert-info">&#8505; Select a student to record stage check results.</div>':''}
    <!-- DOCUMENT HEADER -->
    <div class="sc-doc-header">
      <div class="sc-school-block">
        <div class="sc-school-name">CHARLOTTE AVIATION</div>
<div class="sc-school-addr">Concord Regional Airport · Concord, NC 28025 · KJQF · Part 61</div>
      </div>
      <div class="sc-form-title">
        <div class="sc-form-name">${isEOC?'FAA Practical Test':'Stage Check'} Evaluation</div>
<div class="sc-form-sub">FAA-S-ACS-6C · Private Pilot Airplane · ${lid}</div>
        <div class="sc-form-tol">Alt &#177;${lid==='FL12'?'150':'100'} ft &nbsp;&#183;&nbsp; Hdg &#177;${lid==='FL12'?'20':'10'}&#176; &nbsp;&#183;&nbsp; Spd &#177;10 kt</div>
      </div>
    </div>
    <!-- Student/Result summary bar -->
    ${s?`<div class="sc-summary-bar">
      <div class="sc-summary-item"><span class="sc-lbl">Student</span><span class="sc-val">${s.name}</span></div>
<div class="sc-summary-item"><span class="sc-lbl">Cert #</span><span class="sc-val">${s.stuCertNum||'-'}</span></div>
<div class="sc-summary-item"><span class="sc-lbl">Date</span><span class="sc-val">${sc.date||'-'}</span></div>
<div class="sc-summary-item"><span class="sc-lbl">Check Instructor</span><span class="sc-val">${sc.instructor||'-'}</span></div>
      <div class="sc-summary-item sc-result-chip ${sc.result==='pass'?'pass':sc.result==='fail'?'fail':''}">
        <span class="sc-lbl">Result</span>
        <span class="sc-val">${sc.result==='pass'?'&#10003; SATISFACTORY':sc.result==='fail'?'&#10007; UNSATISFACTORY':'PENDING'}</span>
      </div>
    </div>`:''}

    <!-- CHECK INFO -->
    <div class="card" style="margin-bottom:12px">
      <div class="card-hd"><div class="card-title">Check Information</div></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div class="fg" style="margin:0"><label>Check Date</label><input class="finput" type="date" id="sc_date_${lid}" value="${sc.date||''}" ${hasS?'':'disabled'} data-change-action="save-stage-check" data-lid="${lid}" data-field="date"></div>
        <div class="fg" style="margin:0"><label>Check Instructor Name</label><input class="finput" id="sc_instr_${lid}" value="${sc.instructor||''}" placeholder="Check Instructor Full Name" ${hasS?'':'disabled'} data-change-action="save-stage-check" data-lid="${lid}" data-field="instructor"></div>
        <div class="fg" style="margin:0"><label>Check Instructor Cert #</label><input class="finput" id="sc_cert_${lid}" value="${sc.instrCert||''}" placeholder="Certificate Number" ${hasS?'':'disabled'} data-change-action="save-stage-check" data-lid="${lid}" data-field="instrCert"></div>
        <div class="fg" style="margin:0"><label>Overall Result</label>
          <select class="fselect" id="sc_result_${lid}" ${hasS?'':'disabled'} data-change-action="save-stage-check" data-lid="${lid}" data-field="result" style="color:${resultColor[sc.result||'incomplete']}">
<option value="incomplete" ${!sc.result||sc.result==='incomplete'?'selected':''}>Not Yet Conducted</option>
<option value="pass" ${sc.result==='pass'?'selected':''} style="color:var(--green)">PASS - Satisfactory</option>
<option value="fail" ${sc.result==='fail'?'selected':''} style="color:var(--red)">FAIL - Unsatisfactory</option>
          </select>
        </div>
      </div>
    </div>

    <!-- ACS AREAS -->
    <div class="card" style="margin-bottom:12px">
      <div class="card-hd"><div class="card-title">ACS Areas Evaluated</div>
<div style="font-family:var(--ff-mono);font-size:10px;color:var(--text3)">S = Satisfactory · U = Unsatisfactory · N/A = Not Required</div>
      </div>
      ${acsAreas.map(area=>{
        const areaKey='area_'+area.code;
        const areaResult=sc[areaKey]||'incomplete';
        return`<div style="margin-bottom:8px">
          <div class="sc-area-hd sc-area-${areaResult}">
            <span class="sc-area-code">${area.code}</span>
            <span class="sc-area-title">${area.title}</span>
            <select class="sc-area-sel" ${hasS?'':'disabled'} data-change-action="save-stage-check" data-lid="${lid}" data-field="${areaKey}">
<option value="incomplete" ${areaResult==='incomplete'?'selected':''}>-</option>
              <option value="pass" ${areaResult==='pass'?'selected':''}>S</option>
              <option value="fail" ${areaResult==='fail'?'selected':''}>U</option>
              <option value="na" ${areaResult==='na'?'selected':''}>N/A</option>
            </select>
          </div>
          <div class="sc-tasks-grid">
            ${area.tasks.map(task=>{
              const tkey='task_'+area.code+'_'+task.replace(/[^A-Za-z]/g,'');
              const tres=sc[tkey]||'incomplete';
              return`<div class="sc-task-cell sc-task-${tres}">
                <div class="sc-task-name">${task}</div>
                <select class="sc-task-sel" ${hasS?'':'disabled'} data-change-action="save-stage-check" data-lid="${lid}" data-field="${tkey}">
<option value="incomplete" ${tres==='incomplete'?'selected':''}>-</option>
                  <option value="pass" ${tres==='pass'?'selected':''}>S</option>
                  <option value="fail" ${tres==='fail'?'selected':''}>U</option>
                  <option value="na" ${tres==='na'?'selected':''}>N/A</option>
                </select>
              </div>`;
            }).join('')}
          </div>
        </div>`;
      }).join('')}
    </div>

    <!-- REMARKS & DEFICIENCIES -->
    <div class="card" style="margin-bottom:12px">
      <div class="card-hd"><div class="card-title">Remarks & Deficiencies</div></div>
<textarea class="ftextarea" id="sc_remarks_${lid}" placeholder="Note any deficiencies, areas requiring additional instruction, or general remarks..." ${hasS?'':'disabled'} data-change-action="save-stage-check" data-lid="${lid}" data-field="remarks">${sc.remarks||''}</textarea>
      ${sc.result==='fail'?`<div class="alert alert-danger" style="margin-top:8px">
<span>Warning</span><div><strong>Unsatisfactory Result:</strong> Additional instruction required in all failed areas before re-check. Primary CFI must document re-instruction before student returns for re-evaluation.</div>
      </div>`:''}
      ${sc.result==='pass'?`<div class="alert alert-ok" style="margin-top:8px">
<span>Complete</span><div><strong>Satisfactory Result:</strong> Student has demonstrated required knowledge and skill to ACS standards. ${lid==='FL25'?'Issue §61.39 and §61.103 endorsements. Schedule DPE appointment.':'Advance student to next stage.'}</div>
      </div>`:''}
    </div>

    <!-- SIGNATURE BLOCK -->
    ${sc.result==='pass'||sc.result==='fail'?`
    <div class="card" style="margin-bottom:12px">
      <div class="card-hd"><div class="card-title">Signature Block</div></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;padding-top:6px">
        <div>
          <div class="section-label">Check Instructor</div>
          <div style="border-bottom:1px solid var(--text3);height:40px;margin-bottom:5px"></div>
<div style="font-family:var(--ff-mono);font-size:10px;color:var(--text3)">${sc.instructor||'Check Instructor'} · Cert # ${sc.instrCert||'__________'} · Date: ${sc.date||'__________'}</div>
        </div>
        <div>
          <div class="section-label">Student</div>
          <div style="border-bottom:1px solid var(--text3);height:40px;margin-bottom:5px"></div>
<div style="font-family:var(--ff-mono);font-size:10px;color:var(--text3)">${s?s.name:''} · Date: ${sc.date||'__________'}</div>
        </div>
      </div>
    </div>`:''}
  `;
  },

  tabSRM(lid,s){
    const lesson=FL[lid];if(!lesson||lesson.type!=='flight')return'<div class="alert alert-info">5P SRM pre-brief is for flight lessons only.</div>';
    const hasS=!!s;
    const checks=s&&s.data&&s.data.srmChecks&&s.data.srmChecks[lid]||{};
    const items=s&&s.data&&s.data.srmItems&&s.data.srmItems[lid]||{};

    // Full 5P checklist definition
    const SRM_CHECKS={
      plan:[
        {k:'route',     text:'Route and destination planned'},
        {k:'brief',     text:'Standard weather briefing obtained (1800wxbrief)'},
        {k:'notams',    text:'NOTAMs checked for all airports and route'},
        {k:'fuel_calc', text:'Fuel required + 45-min reserve calculated'},
        {k:'tfr',       text:'TFRs along route checked'},
        {k:'alternate', text:'Alternate airport identified'},
        {k:'ete',       text:'Expected flight time and ETA calculated'}
      ],
      plane:[
        {k:'airworthy', text:'Aircraft is airworthy (no open MEL items)'},
        {k:'annual',    text:'Annual inspection current'},
        {k:'vor',       text:'VOR check current (within 30 days if IFR)'},
        {k:'fuel_qual', text:'Fuel quantity and quality confirmed (sumped)'},
        {k:'oil',       text:'Oil level confirmed'},
        {k:'preflight', text:'Preflight inspection completed'},
        {k:'db',        text:'GPS/avionics database current'},
        {k:'equip',     text:'All required equipment operational'}
      ],
      pilot:[
        {k:'medical',   text:'Medical certificate current'},
        {k:'flight_rev',text:'Flight review current (within 24 months)'},
{k:'day_curr',  text:'Day currency - 3 T&Ls in past 90 days (if carrying pax)'},
{k:'night_curr',text:'Night currency - 3 night T&Ls if night pax flight'},
{k:'ill',       text:'I - Illness: not sick or on impairing medications'},
{k:'med',       text:'M - Medication: no medications affecting performance'},
{k:'stress',    text:'S - Stress: not under excessive stress'},
{k:'alc',       text:'A - Alcohol: 8 hrs bottle-to-throttle, BAC < 0.04%'},
{k:'fatigue',   text:'F - Fatigue: adequately rested'},
{k:'emotion',   text:'E - Emotion: not emotionally compromised'}
      ],
      passengers:[
        {k:'seat_belts',text:'Passengers briefed on seat belts and emergency exits'},
        {k:'sterile',   text:'Sterile cockpit concept explained'},
        {k:'pic_auth',  text:'Passengers understand PIC has final authority'},
        {k:'expect',    text:'Passenger expectations vs. mission reality discussed'},
        {k:'motion',    text:'Motion sickness risk assessed and addressed'}
      ],
      programming:[
        {k:'fp_loaded', text:'Flight plan loaded and verified in GPS'},
        {k:'alternates',text:'Alternates and divert airports pre-programmed'},
        {k:'ap_test',   text:'Autopilot tested and functioning (if equipped)'},
{k:'familiarity',text:'Pilot fully familiar with avionics - no surprises'},
        {k:'freqs',     text:'Comm/Nav frequencies pre-set for departure'},
        {k:'mfd',       text:'MFD/PFD functioning correctly'}
      ]
    };
    // Expose keys to refreshSRMSection
    window._SRM_KEYS=Object.fromEntries(Object.entries(SRM_CHECKS).map(function([pk,arr]){return[pk,arr.map(function(i){return i.k;})]}));

    const ps=[
      {k:'plan',       icon:'&#128506;', name:'Plan',        color:'var(--blue)'},
      {k:'plane',      icon:'&#9992;',   name:'Plane',       color:'var(--amber)'},
      {k:'pilot',      icon:'&#128100;', name:'Pilot',       color:'var(--green)'},
      {k:'passengers', icon:'&#128101;', name:'Passengers',  color:'var(--purple)'},
      {k:'programming',icon:'&#9000;',   name:'Programming', color:'var(--orange)'}
    ];

    function pSection(p){
      const ch=checks[p.k]||{checked:false,notes:''};
      const pItems=SRM_CHECKS[p.k]||[];
      const done=pItems.filter(function(i){return items[p.k+'_'+i.k];}).length;
      const hasNG=pItems.some(function(i){return items[p.k+'_'+i.k]==='nogo';});
      const hasCau=pItems.some(function(i){return items[p.k+'_'+i.k]==='cau';});
      const badgeCls='srm-section-badge'+(hasNG?' ng':hasCau?' cau':done===pItems.length&&pItems.length>0?' ok':'');

      let rows=pItems.map(function(item){
        const ikey=p.k+'_'+item.k;
        const val=items[ikey]||'';
        return '<div class="srm-item-row'+(val?' '+val:'')+'" id="srm_row_'+lid+'_'+ikey+'">'
          +'<span class="srm-item-text">'+item.text+'</span>'
          +'<span class="srm-item-btns">'
          +(hasS
            ?'<button class="srm-item-btn go'+(val==='go'?' active':'')+'" id="srm_go_'+lid+'_'+ikey+'"'
              +' data-click-action="set-srm-item" data-lid="'+lid+'" data-item-key="'+ikey+'" data-value="go" title="GO">&#10003; GO</button>'
             +'<button class="srm-item-btn cau'+(val==='cau'?' active':'')+'" id="srm_cau_'+lid+'_'+ikey+'"'
              +' data-click-action="set-srm-item" data-lid="'+lid+'" data-item-key="'+ikey+'" data-value="cau" title="CAUTION">&#9888; CAU</button>'
             +'<button class="srm-item-btn ng'+(val==='nogo'?' active':'')+'" id="srm_ng_'+lid+'_'+ikey+'"'
              +' data-click-action="set-srm-item" data-lid="'+lid+'" data-item-key="'+ikey+'" data-value="nogo" title="NO-GO">&#10007; NO-GO</button>'
            :'<span style="font-family:var(--ff-mono);font-size:10px;color:var(--text3)">Select student</span>')
          +'</span>'
          +'</div>';
      }).join('');

      return '<div class="srm-p-section" style="--pc:'+p.color+'">'
        +'<div class="srm-p-hd">'
          +'<span class="srm-p-icon2">'+p.icon+'</span>'
          +'<span class="srm-p-name2">'+p.name+'</span>'
          +'<span class="'+badgeCls+'" id="srm_badge_'+lid+'_'+p.k+'">'+done+'/'+pItems.length+'</span>'
        +'</div>'
        +'<div class="srm-items-list">'+rows+'</div>'
        +(hasS
          ?'<div style="padding:8px 12px 10px">'
            +'<textarea class="srm-notes" placeholder="Notes for '+p.name+' P..." data-change-action="set-srm-notes" data-lid="'+lid+'" data-section-key="'+p.k+'" style="min-height:44px">'+( ch.notes||'')+'</textarea>'
          +'</div>'
          :'')
        +'</div>';
    }

    // Overall status
    const allItems=Object.values(SRM_CHECKS).flat();
    const totalItems=allItems.length;
    const doneItems=allItems.filter(function(i){
      const pkey=Object.keys(SRM_CHECKS).find(function(pk){return SRM_CHECKS[pk].includes(i);});
      return items[pkey+'_'+i.k];
    }).length;
    const anyNG=allItems.some(function(i){
      const pkey=Object.keys(SRM_CHECKS).find(function(pk){return SRM_CHECKS[pk].includes(i);});
      return items[pkey+'_'+i.k]==='nogo';
    });

    return`
    <div class="srm-master-header">
      <div>
        <div style="font-family:var(--ff-display);font-size:18px;letter-spacing:2px">5P PRE-FLIGHT CHECK</div>
<div style="font-family:var(--ff-mono);font-size:10px;color:var(--text3);margin-top:2px">Review each P before every flight · Mark GO / CAUTION / NO-GO</div>
      </div>
      <div style="display:flex;align-items:center;gap:10px">
        ${hasS?`<span class="srm-master-count ${anyNG?'ng':doneItems===totalItems?'ok':''}">${doneItems}/${totalItems} items</span>`:''}
        ${anyNG?'<span class="srm-nogo-banner">&#9888; NO-GO ITEM - Do not depart</span>':''}
      </div>
    </div>
    <div class="srm-sections-list">
      ${ps.map(function(p){return pSection(p);}).join('')}
    </div>`;
  },


  tabDebrief(lid,s){
    const lesson=GL[lid]||FL[lid];
    const isFL=lesson.type==='flight';
    const hasS=!!s;
    const debrief=debriefRecord(s,lid);
    const note=debrief.instructorNotes;
    const taskObjs=lesson.tasks||[];
    const debriefQs=lesson.debrief||[];
    return`
    <!-- Performance review — one prompt per lesson objective -->
    ${taskObjs.length>0?`
    <div class="section-label">Performance review</div>
    <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:16px">
      ${taskObjs.map((t,i)=>`
      <div style="display:flex;gap:10px;align-items:flex-start;background:var(--bg3);border:1px solid var(--border);border-radius:var(--r);padding:9px 12px">
        <span style="font-family:var(--ff-display);font-size:18px;color:var(--amber);line-height:1;width:24px;flex-shrink:0">${i+1}</span>
        <div style="flex:1">
          <div style="font-size:13px;font-weight:500;color:var(--text);margin-bottom:2px">${t.text}</div>
          <div style="font-size:12px;color:var(--text3);font-style:italic">How did this go? To standard, close, or needs more work?${t.subtasks?.length?` (${t.subtasks.length} proficiency items)`:''}</div>
        </div>
      </div>`).join('')}
    </div>`:''}

    <!-- Knowledge debrief questions -->
    ${debriefQs.length>0?`
    <div class="section-label">Knowledge check</div>
    <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:16px">
      ${debriefQs.map(q=>`
      <div style="display:flex;gap:10px;align-items:flex-start;background:var(--bg3);border:1px solid var(--border);border-left:3px solid var(--blue);border-radius:var(--r);padding:9px 12px">
        <span style="font-family:var(--ff-mono);font-size:13px;color:var(--blue);line-height:1.4;flex-shrink:0">?</span>
        <div style="font-size:13px;color:var(--text2);line-height:1.5">${q}</div>
      </div>`).join('')}
    </div>`:''}

    ${hasS?`
    <div class="debrief-grid">
      <div class="debrief-card">
        <div class="section-label">Debrief summary</div>
        <div class="debrief-fields">
          <div class="fg" style="margin:0">
            <label>Lesson Outcome</label>
            <select class="fselect" id="debrief_outcome_${lid}">
              <option value=""${!debrief.outcome?' selected':''}>Select outcome</option>
              <option value="Completed as Planned"${debrief.outcome==='Completed as Planned'?' selected':''}>Completed as Planned</option>
              <option value="Partial"${debrief.outcome==='Partial'?' selected':''}>Partial</option>
              <option value="Needs Additional Review"${debrief.outcome==='Needs Additional Review'?' selected':''}>Needs Additional Review</option>
              <option value="Rescheduled / Incomplete"${debrief.outcome==='Rescheduled / Incomplete'?' selected':''}>Rescheduled / Incomplete</option>
            </select>
          </div>
          <div class="fg" style="margin:0">
            <label>Student Confidence</label>
            <select class="fselect" id="debrief_confidence_${lid}">
              <option value=""${!debrief.confidence?' selected':''}>Not set</option>
              <option value="1 - Low"${debrief.confidence==='1 - Low'?' selected':''}>1 - Low</option>
              <option value="2"${debrief.confidence==='2'?' selected':''}>2</option>
              <option value="3 - Moderate"${debrief.confidence==='3 - Moderate'?' selected':''}>3 - Moderate</option>
              <option value="4"${debrief.confidence==='4'?' selected':''}>4</option>
              <option value="5 - High"${debrief.confidence==='5 - High'?' selected':''}>5 - High</option>
            </select>
          </div>
        </div>
      </div>
      <div class="debrief-card">
        <div class="section-label">What went well</div>
        <textarea class="ftextarea debrief-textarea" id="debrief_wentwell_${lid}" placeholder="Short bullets or one item per line.">${debrief.wentWell}</textarea>
      </div>
      <div class="debrief-card">
        <div class="section-label">Needs work</div>
        <textarea class="ftextarea debrief-textarea" id="debrief_needswork_${lid}" placeholder="What needs more practice before moving on?">${debrief.needsWork}</textarea>
      </div>
      <div class="debrief-card">
        <div class="section-label">Review before next lesson</div>
        <textarea class="ftextarea debrief-textarea" id="debrief_review_${lid}" placeholder="List the items to review before the next lesson.">${debrief.reviewBeforeNext}</textarea>
      </div>
      <div class="debrief-card">
        <div class="section-label">Next lesson focus</div>
        <textarea class="ftextarea debrief-textarea" id="debrief_next_${lid}" placeholder="What should the next lesson focus on?">${debrief.nextLessonFocus}</textarea>
      </div>
      <div class="debrief-card">
        <div class="section-label">Homework emphasis</div>
        <textarea class="ftextarea debrief-textarea" id="debrief_homework_${lid}" placeholder="Student-facing homework emphasis or prep note.">${debrief.homeworkEmphasis}</textarea>
      </div>
    </div>
    <div class="section-label" style="margin-top:10px">${isFL?'Post-flight ':''}Instructor notes</div>
    <textarea class="ftextarea" id="lesson_note" placeholder="Optional instructor-only note, carry-forward item, or lesson-specific detail.">${note}</textarea>
    <button class="btn btn-primary btn-sm" style="margin-top:10px" id="save_btn" data-click-action="save-note" data-lid="${lid}">Save Debrief</button>
    `:`<div class="alert alert-info">Select a student to record debrief notes.</div>`}`;
  },

  tabPlan(lid,s){
    const lesson=GL[lid]||FL[lid];
    if(!lesson) return '';
    return `
      <div class="tab-section">
        <div class="section-lbl">Objectives</div>
        ${this.tabObjectives(lid,s)}
      </div>
      <div class="tab-section" style="margin-top:18px">
        <div class="section-lbl">Scenario</div>
        ${this.tabScenario(lid,s)}
      </div>
      <div class="tab-section" style="margin-top:18px">
        <div class="section-lbl">Tasks</div>
        ${this.tabTasks(lid,s)}
      </div>`;
  },

  tabFly(lid,s){
    const lesson=GL[lid]||FL[lid];
    if(!lesson) return '';
    const isFL=!!FL[lid];
    if(isFL){
      return `
        <div class="tab-section">
          <div class="section-lbl">5P Pre-Brief</div>
          ${this.tabSRM(lid,s)}
        </div>
        <div class="tab-section" style="margin-top:18px">
          <div class="section-lbl">Live Task Grading</div>
          ${this.tabTasks(lid,s)}
        </div>`;
    }
    return `
      <div class="section-lbl" style="margin-bottom:10px">Ground Lesson — no 5P pre-brief</div>
      ${this.tabTasks(lid,s)}`;
  },

  tabDebrief3(lid,s){
    if (isStudentMode()) return this.tabDebrief(lid,s);
    const lesson=GL[lid]||FL[lid];
    if(!lesson) return '';
    const isCheck=lesson.isStageCheck||lesson.isEndOfCourse;
    return `
      <div class="tab-section">
        <div class="section-lbl">Debrief</div>
        ${this.tabDebrief(lid,s)}
      </div>
      <div class="tab-section" style="margin-top:18px">
        <div class="section-lbl">Homework</div>
        ${this.tabHomework(lid,s)}
      </div>
      ${isCheck ? `<div class="tab-section" style="margin-top:18px"><div class="section-lbl">Stage Check Form</div>${this.tabStageCheck(lid,s)}</div>` : ''}`;
  },

  requirements(s){
    if(!s)return H.emptyState('&sect;','NO STUDENT SELECTED','Select a student to review tracked aeronautical experience requirements.');
    const reqs=REQS.map(r=>({...r,actual:getReq(s,r.id),complete:getReq(s,r.id)>=r.min}));
    const done=reqs.filter(r=>r.complete).length;
    // v3: FAA AC 61-65H endorsement templates
    const ENDORSEMENTS={
      solo:      `I certify that ${s.name} has received the training required by § 61.87 and is proficient to conduct solo flight. Limitations: solo at KJQF, VFR day only.`,
      xc_solo:   `I certify that ${s.name} has received the training required by § 61.93 and is competent to conduct supervised solo cross-country flights in a single-engine aircraft.`,
    };
    return`
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px">
      <div><div style="font-family:var(--ff-display);font-size:18px;letter-spacing:2px">14 CFR &sect; 61.109(a) - ASEL</div>
      <div style="font-family:var(--ff-mono);font-size:11px;color:var(--text3)">${done}/${REQS.length} requirements met - ${s.name}</div></div>
      <div style="font-family:var(--ff-display);font-size:30px;color:${done===REQS.length?'var(--green)':'var(--amber)'}">${done}/${REQS.length}</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px">
      ${reqs.map(req=>{
        const pct=Math.min(100,(req.actual/req.min)*100);
        const endKey=req.id==='solo'?'solo':null;
        const endText=endKey?ENDORSEMENTS[endKey]:null;
        return`<div class="req-card${req.complete?' met':''}" id="rcard_${req.id}">
          <div class="req-name" style="color:${req.complete?'var(--green)':'var(--text)'}">${req.complete?'&#10003; ' :''}${req.label}</div>
          <div class="req-reg">${req.reg}</div>
          <div class="req-nums">
            <span class="req-actual ${req.complete?'col-met':'col-pend'}">${req.actual}</span>
            <span class="req-sep">/</span><span class="req-min">${req.min}</span><span class="req-unit">${req.unit}</span>
          </div>
          <div class="prog-bar" style="margin-bottom:9px">
            <div class="prog-fill ${req.complete?'green':''}" id="rfill_${req.id}" style="width:${pct}%"></div>
          </div>
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
        <input class="hrs-input" type="number" step="${req.unit==='hrs'?'0.1':'1'}" min="0" id="req_${req.id}" value="${req.actual}" data-input-action="update-req" data-req-id="${req.id}">
            <span style="font-family:var(--ff-mono);font-size:11px;color:var(--text3)">${req.unit}</span>
            <span id="rdisp_${req.id}" style="font-family:var(--ff-mono);font-size:11px;color:var(--text3)">${req.actual} / ${req.min}</span>
          </div>
        ${req.complete&&endText?`<button class="endorse-btn" id="ebtn_${req.id}" data-click-action="copy-endorsement" data-req-id="${req.id}">Generate Endorsement</button>`:''}
        </div>`;
      }).join('')}
    </div>`;
  },

  tools(s, tab='xwind'){
    const TOOL_TABS=[
      {id:'xwind',   icon:'⇌',  label:'Crosswind'},
      {id:'wx',      icon:'☁',  label:'Weather'},
      {id:'wb',      icon:'⚖',  label:'W & B'},
      {id:'performance', icon:'PF', label:'Performance'},
      {id:'decision',icon:'⚠',  label:'Go / No-Go'},
      {id:'5p',      icon:'✈',  label:'5P Pre-Flight'},
    ];
    let inner='';
    switch(tab){
      case 'xwind':       inner=V.xwind();break;
      case 'wx':          inner=V.wx(s);break;
      case 'wb':          inner=V.weightBalance();break;
      case 'performance': inner=V.performance(s);break;
      case 'decision':    inner=V.preflightDecision(s);break;
      case '5p':          inner=V.fiveP(s);break;
    }
    const tabBar=`<div class="tabs tools-tabs" style="margin-bottom:20px">${
      TOOL_TABS.map(t=>`<div class="tab${t.id===tab?' active':''}" data-click-action="tools-tab" data-tab="${t.id}">
        <span style="margin-right:5px">${t.icon}</span>${t.label}
      </div>`).join('')
    }</div>`;
    return tabBar+inner;
  },

  fiveP(s){
    if(!s)return`<div class="empty"><div class="empty-icon">&#9992;</div><div class="empty-title">NO STUDENT SELECTED</div><div class="empty-txt">Select a student to run the 5P pre-flight check.</div></div>`;

    const today=new Date().toISOString().split('T')[0];
    const sessionKey='sa_'+today.replace(/-/g,'');
    const items=s.data&&s.data.srmStandalone&&s.data.srmStandalone[sessionKey]||{};

    // Reuse the SRM_CHECKS definition from tabSRM via window._SRM_KEYS
    // We need to define checks here too since this view is standalone
    const SRM_CHECKS_SA={
      plan:[
        {k:'route',      text:'Route and destination planned'},
        {k:'brief',      text:'Standard weather briefing obtained (1800wxbrief)'},
        {k:'notams',     text:'NOTAMs checked for all airports and route'},
        {k:'fuel_calc',  text:'Fuel required + 45-min reserve calculated'},
        {k:'tfr',        text:'TFRs along route checked'},
        {k:'alternate',  text:'Alternate airport identified'},
        {k:'ete',        text:'Expected flight time and ETA calculated'}
      ],
      plane:[
        {k:'airworthy',  text:'Aircraft is airworthy (no open MEL items)'},
        {k:'annual',     text:'Annual inspection current'},
        {k:'vor',        text:'VOR check current (within 30 days if IFR)'},
        {k:'fuel_qual',  text:'Fuel quantity and quality confirmed (sumped)'},
        {k:'oil',        text:'Oil level confirmed'},
        {k:'preflight',  text:'Preflight inspection completed'},
        {k:'db',         text:'GPS/avionics database current'},
        {k:'equip',      text:'All required equipment operational'}
      ],
      pilot:[
        {k:'medical',    text:'Medical certificate current'},
        {k:'flight_rev', text:'Flight review current (within 24 months)'},
{k:'day_curr',   text:'Day currency - 3 T&Ls in past 90 days (if carrying pax)'},
{k:'night_curr', text:'Night currency - 3 night T&Ls if night pax flight'},
{k:'ill',        text:'I - Illness: not sick or on impairing medications'},
{k:'med',        text:'M - Medication: no medications affecting performance'},
{k:'stress',     text:'S - Stress: not under excessive stress'},
{k:'alc',        text:'A - Alcohol: 8 hrs bottle-to-throttle, BAC < 0.04%'},
{k:'fatigue',    text:'F - Fatigue: adequately rested'},
{k:'emotion',    text:'E - Emotion: not emotionally compromised'}
      ],
      passengers:[
        {k:'seat_belts', text:'Passengers briefed on seat belts and emergency exits'},
        {k:'sterile',    text:'Sterile cockpit concept explained'},
        {k:'pic_auth',   text:'Passengers understand PIC has final authority'},
        {k:'expect',     text:'Passenger expectations vs. mission reality discussed'},
        {k:'motion',     text:'Motion sickness risk assessed and addressed'}
      ],
      programming:[
        {k:'fp_loaded',  text:'Flight plan loaded and verified in GPS'},
        {k:'alternates', text:'Alternates and divert airports pre-programmed'},
        {k:'ap_test',    text:'Autopilot tested and functioning (if equipped)'},
{k:'familiarity',text:'Pilot fully familiar with avionics - no surprises'},
        {k:'freqs',      text:'Comm/Nav frequencies pre-set for departure'},
        {k:'mfd',        text:'MFD/PFD functioning correctly'}
      ]
    };
    window._SRM_KEYS=Object.fromEntries(Object.entries(SRM_CHECKS_SA).map(function([pk,arr]){return[pk,arr.map(function(i){return i.k;})]}));

    const ps=[
      {k:'plan',       icon:'&#128506;',name:'Plan',       color:'var(--blue)'},
      {k:'plane',      icon:'&#9992;',  name:'Plane',      color:'var(--amber)'},
      {k:'pilot',      icon:'&#128100;',name:'Pilot',      color:'var(--green)'},
      {k:'passengers', icon:'&#128101;',name:'Passengers', color:'var(--purple)'},
      {k:'programming',icon:'&#9000;',  name:'Programming',color:'var(--orange)'}
    ];

    const allKeys=Object.values(SRM_CHECKS_SA).flat().map(function(i){return i.k;});
    const done=allKeys.filter(function(k){return items[k];}).length;
    const total=allKeys.length;
    const anyNG=allKeys.some(function(k){return items[k]==='nogo';});
    const allGo=done===total&&!anyNG;

    function pSection(p){
      const pItems=SRM_CHECKS_SA[p.k]||[];
      const pDone=pItems.filter(function(i){return items[i.k];}).length;
      const pNG=pItems.some(function(i){return items[i.k]==='nogo';});
      const pCau=pItems.some(function(i){return items[i.k]==='cau';});
      const badgeCls='srm-section-badge'+(pNG?' ng':pCau?' cau':pDone===pItems.length&&pItems.length>0?' ok':'');
      const rows=pItems.map(function(item){
        const val=items[item.k]||'';
        const ikey=sessionKey+'_'+item.k;
        return '<div class="srm-item-row'+(val?' '+val:'')+'" id="sas_row_'+ikey+'">'
          +'<span class="srm-item-text">'+item.text+'</span>'
          +'<span class="srm-item-btns">'
          +'<button class="srm-item-btn go'+(val==='go'?' active':'')+'" id="sas_go_'+ikey+'" data-click-action="set-srm-standalone" data-session-key="'+sessionKey+'" data-item-key="'+item.k+'" data-value="go">&#10003; GO</button>'
          +'<button class="srm-item-btn cau'+(val==='cau'?' active':'')+'" id="sas_cau_'+ikey+'" data-click-action="set-srm-standalone" data-session-key="'+sessionKey+'" data-item-key="'+item.k+'" data-value="cau">&#9888; CAU</button>'
          +'<button class="srm-item-btn ng'+(val==='nogo'?' active':'')+'" id="sas_ng_'+ikey+'" data-click-action="set-srm-standalone" data-session-key="'+sessionKey+'" data-item-key="'+item.k+'" data-value="nogo">&#10007; NO-GO</button>'
          +'</span>'
          +'</div>';
      }).join('');
      return '<div class="srm-p-section" style="--pc:'+p.color+'">'
        +'<div class="srm-p-hd">'
          +'<span class="srm-p-icon2">'+p.icon+'</span>'
          +'<span class="srm-p-name2">'+p.name+'</span>'
          +'<span class="'+badgeCls+'" id="sas_badge_'+sessionKey+'_'+p.k+'">'+pDone+'/'+pItems.length+'</span>'
        +'</div>'
        +'<div class="srm-items-list">'+rows+'</div>'
        +'</div>';
    }

    return`
    <!-- Header -->
    <div class="srm-master-header" style="margin-bottom:14px">
      <div>
        <div style="font-family:var(--ff-display);font-size:20px;letter-spacing:2px">5P PRE-FLIGHT CHECK</div>
        <div style="font-family:var(--ff-mono);font-size:10px;color:rgba(255,255,255,.6);margin-top:2px">${s.name} · ${today} · KJQF</div>
        <div style="font-family:var(--ff-mono);font-size:10px;color:rgba(255,255,255,.5);margin-top:1px">Review each P before every flight · GO / CAUTION / NO-GO</div>
      </div>
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <span id="sas_counter_${sessionKey}" class="srm-master-count${anyNG?' ng':allGo?' ok':''}">${done}/${total} items</span>
        <div id="sas_banner_${sessionKey}" class="srm-nogo-banner" style="display:${anyNG?'flex':'none'}">&#9888; NO-GO ITEM - Do not depart</div>
      <button class="btn btn-ghost btn-sm" style="color:rgba(255,255,255,.7);border-color:rgba(255,255,255,.3)" data-click-action="clear-srm-standalone" data-session-key="${sessionKey}">&#8635; Reset</button>
      </div>
    </div>

    ${allGo?`<div class="alert alert-ok" style="margin-bottom:14px"><span>&#10003;</span><div><strong>All items reviewed - GO for departure.</strong> This check is saved for today (${today}).</div></div>`:''}

    <!-- Past sessions shortcut -->
    ${(function(){
      const keys=Object.keys(s.data&&s.data.srmStandalone||{}).filter(function(k){return k!==sessionKey;}).sort().reverse().slice(0,3);
      if(!keys.length)return'';
      return'<div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap">'
        +'<span style="font-family:var(--ff-mono);font-size:10px;color:var(--text3);align-self:center">Recent:</span>'
        +keys.map(function(k){
          const d2=s.data.srmStandalone[k]||{};
          const tot=Object.keys(d2).length;
          const ng=Object.values(d2).some(function(v){return v==='nogo';});
          const date2=k.replace('sa_','').replace(/(\d{4})(\d{2})(\d{2})/,'$1-$2-$3');
          return'<button class="btn btn-ghost btn-sm" data-click-action="nav-5p-session" data-session-key="'+k+'" style="font-family:var(--ff-mono);font-size:10px">'
            +(ng?'&#9888; ':tot>0?'&#10003; ':'')+date2+'</button>';
        }).join('')
        +'</div>';
    })()}

    <!-- 5P Sections -->
    <div class="srm-sections-list">
      ${ps.map(function(p){return pSection(p);}).join('')}
    </div>`;
  },

  xwind(){
    return`<div class="tool-wrap">
    <div class="tool-header">
      <div class="tool-icon">&#8651;</div>
      <div><div class="tool-title">CROSSWIND CALCULATOR</div>
      <div class="tool-sub">Headwind and crosswind components for any runway</div></div>
    </div>
    <div class="calc-grid" style="margin-bottom:12px">
      <div class="calc-field"><label>Runway Heading (°)</label><input class="calc-input" id="xw_rwy" type="number" step="1" placeholder="e.g. 200 for Rwy 20" data-input-action="xw-calc"></div>
      <div class="calc-field"><label>Wind Direction (°)</label><input class="calc-input" id="xw_wdir" type="number" step="1" placeholder="e.g. 240" data-input-action="xw-calc"></div>
      <div class="calc-field"><label>Wind Speed (kt)</label><input class="calc-input" id="xw_wspd" type="number" step="1" placeholder="e.g. 15" data-input-action="xw-calc"></div>
      <div class="calc-field"><label>Gust (kt, optional)</label><input class="calc-input" id="xw_gust" type="number" step="1" placeholder="e.g. 22" data-input-action="xw-calc"></div>
    </div>
    <div id="xw_result" style="display:none"></div>
    <div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--border)">
      <div class="section-label" style="margin-bottom:6px">KJQF Quick-Select</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="btn btn-ghost btn-sm" data-click-action="xw-set-rwy" data-heading="20">Rwy 02</button>
        <button class="btn btn-ghost btn-sm" data-click-action="xw-set-rwy" data-heading="200">Rwy 20</button>
      </div>
      <div style="font-family:var(--ff-mono);font-size:10px;color:var(--text3);margin-top:6px">KJQF Rwy 02/20 · 6,020 ft · Elev 705 ft MSL</div>
    </div>
    </div>`;
  },

  wx(s){
    const mins=(s&&s.data&&s.data.personalMins)||{windSpd:15,windGust:20,crosswind:10,vis:5,ceiling:3000};
    return`<div class="tool-wrap">
    <div class="tool-header">
      <div class="tool-icon">&#9729;</div>
      <div><div class="tool-title">WEATHER QUICK-BRIEF</div>
      <div class="tool-sub">KJQF | Concord Regional | Elev 705 ft MSL${s ? ' | ' + s.name : ''}</div></div>
    </div>

    <!-- Live KJQF observation card -->
    <div style="background:linear-gradient(160deg,#0b1929 0%,#112240 60%,#0d2137 100%);
                border:1px solid rgba(99,179,237,.25);border-radius:var(--r);
                padding:0;margin-bottom:18px;overflow:hidden;box-shadow:var(--shadow-md)">

      <!-- Card header bar -->
      <div style="display:flex;align-items:center;justify-content:space-between;
                  padding:11px 16px;border-bottom:1px solid rgba(255,255,255,.08);flex-wrap:wrap;gap:8px">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;
                       background:#f59e0b;box-shadow:0 0 6px #f59e0b;animation:wxPulse 2s infinite"></span>
          <span style="font-family:var(--ff-display);font-size:15px;letter-spacing:2px;color:#e0f2fe">KJQF OBSERVATION ACCESS</span>
          <span id="wxFetchTs" style="font-family:var(--ff-mono);font-size:9px;color:rgba(255,255,255,.35)"></span>
        </div>
        <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
          <button id="wxRefreshBtn" class="btn btn-sm"
            data-click-action="fetch-weather"
            style="border-color:rgba(99,179,237,.5);color:#93c5fd;background:rgba(29,78,216,.2);
                   font-family:var(--ff-mono);font-size:11px">
            Browser Status
          </button>
          <a class="btn btn-sm" href="https://aviationweather.gov/data/metar/?ids=KJQF&decoded=1"
            target="_blank" rel="noopener"
            style="border-color:rgba(245,158,11,.5);color:#fcd34d;background:rgba(180,83,9,.2);
                   font-family:var(--ff-mono);font-size:11px;text-decoration:none">
            Open Official METAR
          </a>
          <button class="btn btn-sm" id="syncXWBtn"
            data-click-action="sync-wind-xw"
            style="display:none;border-color:rgba(52,211,153,.5);color:#6ee7b7;
                   background:rgba(4,120,87,.2);font-family:var(--ff-mono);font-size:11px">
            Sync to XW Calc
          </button>
        </div>
      </div>

      <!-- Browser-safe fallback state populated by fetchKJQFWeather() -->
      <pre id="wxMetarTTY"
        style="font-family:var(--ff-mono);font-size:13px;line-height:1.9;
               color:rgba(224,242,254,.45);padding:14px 16px;margin:0;
               white-space:pre-wrap;word-break:break-all;min-height:52px;
               border-bottom:1px solid rgba(255,255,255,.06)">Official KJQF weather remains available below.

Live browser fetch is disabled because Aviation Weather Center blocks cross-origin API requests from frontend-only apps.</pre>

      <!-- Decoded wind chip row populated by fetchKJQFWeather() -->
      <div id="wxWindChips"
        style="display:none;gap:8px;flex-wrap:wrap;padding:10px 16px;
               background:rgba(0,0,0,.18)"></div>
    </div>

    <!-- Standard briefing -->
    <div class="wx-section-label">Official Briefing</div>
    <div class="wx-link-grid">
      <a class="wx-card wx-card-primary" href="https://www.1800wxbrief.com" target="_blank" rel="noopener">
        <div class="wx-card-icon">&#128222;</div>
        <div class="wx-card-body"><div class="wx-card-title">1800wxbrief.com</div><div class="wx-card-sub">FAA official briefing | file flight plans</div></div>
        <div class="wx-card-arrow">&#8599;</div>
      </a>
      <a class="wx-card" href="https://aviationweather.gov/data/metar/?ids=KJQF&decoded=1" target="_blank" rel="noopener">
        <div class="wx-card-icon">&#9729;</div>
        <div class="wx-card-body"><div class="wx-card-title">KJQF METAR Decoded</div><div class="wx-card-sub">Human-readable surface observation</div></div>
        <div class="wx-card-arrow">&#8599;</div>
      </a>
      <a class="wx-card" href="https://aviationweather.gov/data/metar/?ids=KJQF&taf=1" target="_blank" rel="noopener">
        <div class="wx-card-icon">&#128197;</div>
        <div class="wx-card-body"><div class="wx-card-title">KJQF TAF</div><div class="wx-card-sub">Terminal area forecast | 24-30 hr</div></div>
        <div class="wx-card-arrow">&#8599;</div>
      </a>
    </div>

    <!-- Graphical products -->
    <div class="wx-section-label" style="margin-top:14px">Graphical Products</div>
    <div class="wx-link-grid">
      <a class="wx-card" href="https://aviationweather.gov/gfa/#obs" target="_blank" rel="noopener">
        <div class="wx-card-icon">&#128225;</div>
        <div class="wx-card-body"><div class="wx-card-title">Radar</div><div class="wx-card-sub">GFA composite reflectivity | animate loop</div></div>
        <div class="wx-card-arrow">&#8599;</div>
      </a>
      <a class="wx-card" href="https://aviationweather.gov/gfa/#sigmet" target="_blank" rel="noopener">
        <div class="wx-card-icon">&#9888;</div>
        <div class="wx-card-body"><div class="wx-card-title">SIGMETs &amp; AIRMETs</div><div class="wx-card-sub">Sierra | Tango | Zulu | G-AIRMETs</div></div>
        <div class="wx-card-arrow">&#8599;</div>
      </a>
      <a class="wx-card" href="https://aviationweather.gov/data/pirep/" target="_blank" rel="noopener">
        <div class="wx-card-icon">&#128100;</div>
        <div class="wx-card-body"><div class="wx-card-title">PIREPs</div><div class="wx-card-sub">Pilot reports | GFA map view</div></div>
        <div class="wx-card-arrow">&#8599;</div>
      </a>
      <a class="wx-card" href="https://aviationweather.gov/data/windtemp/" target="_blank" rel="noopener">
        <div class="wx-card-icon">&#8679;</div>
        <div class="wx-card-body"><div class="wx-card-title">Winds Aloft</div><div class="wx-card-sub">FB winds | 3,000-39,000 ft | GFA</div></div>
        <div class="wx-card-arrow">&#8599;</div>
      </a>
      <a class="wx-card" href="https://aviationweather.gov/gfa/#progchart" target="_blank" rel="noopener">
        <div class="wx-card-icon">&#128506;</div>
        <div class="wx-card-body"><div class="wx-card-title">Prog Charts</div><div class="wx-card-sub">Surface analysis | 12-48 hr forecasts</div></div>
        <div class="wx-card-arrow">&#8599;</div>
      </a>
      <a class="wx-card" href="https://notams.aim.faa.gov/notamSearch/" target="_blank" rel="noopener">
        <div class="wx-card-icon">&#128204;</div>
        <div class="wx-card-body"><div class="wx-card-title">NOTAMs</div><div class="wx-card-sub">FAA NOTAM Search | KJQF &amp; route</div></div>
        <div class="wx-card-arrow">&#8599;</div>
      </a>
    </div>

    <div style="margin-top:12px;padding:11px 14px;background:var(--bg3);border:1px solid var(--border);border-radius:var(--r)">
      <div class="section-label" style="margin-bottom:4px">Phone Briefing</div>
      <div style="font-size:13px;color:var(--text2)"><strong>1-800-WX-BRIEF</strong> (1-800-992-7433) | 24 hrs | Request a <em>standard briefing</em></div>
      <div style="font-family:var(--ff-mono);font-size:10px;color:var(--text3);margin-top:4px">Standard | Abbreviated | Outlook | always start with Standard on first brief</div>
    </div>
    <div style="margin-top:8px;padding:11px 14px;background:var(--amber-dim);border:1px solid var(--amber);border-radius:var(--r)">
      <div class="section-label" style="color:var(--amber);margin-bottom:4px">KJQF Local Notes</div>
      <div style="font-size:12px;color:var(--text2);line-height:1.8">
        &#9632; <strong>ASOS frequency:</strong> 119.025 MHz | auto-report every 20 min or on change.<br>
        &#9632; <strong>Summer (May-Oct):</strong> Afternoon convection after 2 pm | watch temp/dewpoint spread.<br>
        &#9632; <strong>Morning fog:</strong> Spread 3 C or less at 0600Z | expect low IFR until about 10 am local.<br>
        &#9632; <strong>KCLT Class B:</strong> KJQF inside 30 NM Mode C veil | monitor KCLT ATIS on 135.075.
      </div>
    </div>

    <!-- Go / No-Go advisor -->
    <div class="gonogo-panel" style="margin-top:16px" id="goNoGoPanel">
      <div class="gonogo-title">Go / No-Go Advisor | ${s?s.name+' Personal Minimums':'No Student Selected'}</div>
      ${!s?`<div class="alert alert-info" style="margin-bottom:0">Select a student to enable the Go/No-Go advisor.</div>`:`
      <div style="font-family:var(--ff-mono);font-size:10px;color:var(--text3);margin-bottom:10px">
        Live METAR sync is unavailable in the browser. You can still run the advisor manually.
      </div>
      <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
        <button class="btn btn-primary btn-sm" data-click-action="run-go-no-go">Run Check Now</button>
        <button class="btn btn-ghost btn-sm" data-click-action="clear-go-no-go">Clear</button>
      </div>
      <div id="goNoGoResult"></div>
      <!-- Personal minimums form -->
      <div class="personal-mins-form">
        <div style="font-family:var(--ff-mono);font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Personal Minimums | ${s.name}</div>
        <div class="personal-mins-grid">
          <div class="fg" style="margin:0"><label>Max Wind Speed (kt)</label><input class="finput" id="pm_windSpd" type="number" step="1" min="0" value="${mins.windSpd}" data-input-action="save-personal-mins"></div>
          <div class="fg" style="margin:0"><label>Max Gust (kt)</label><input class="finput" id="pm_windGust" type="number" step="1" min="0" value="${mins.windGust}" data-input-action="save-personal-mins"></div>
          <div class="fg" style="margin:0"><label>Max Crosswind (kt)</label><input class="finput" id="pm_crosswind" type="number" step="1" min="0" value="${mins.crosswind}" data-input-action="save-personal-mins"></div>
          <div class="fg" style="margin:0"><label>Min Visibility (SM)</label><input class="finput" id="pm_vis" type="number" step="0.5" min="0" value="${mins.vis}" data-input-action="save-personal-mins"></div>
          <div class="fg" style="margin:0"><label>Min Ceiling (ft AGL)</label><input class="finput" id="pm_ceiling" type="number" step="100" min="0" value="${mins.ceiling}" data-input-action="save-personal-mins"></div>
          <div style="display:flex;align-items:flex-end">
            <button class="btn btn-ghost btn-sm" id="pmSaveBtn" data-click-action="save-personal-mins" style="width:100%">Save Minimums</button>
          </div>
        </div>
        <div style="font-family:var(--ff-mono);font-size:10px;color:var(--text3);margin-top:8px">Minimums saved per student. The advisor re-runs after every METAR refresh automatically.</div>
      </div>
      `}
    </div>
    </div>`;
  },



  settings(){
    const today=new Date().toISOString().split('T')[0];
    const expOk=cfiProfile.certExpiry?cfiProfile.certExpiry>=today:null;
    return`
    <div style="max-width:640px">
      <div style="background:linear-gradient(135deg,var(--bg3),var(--bg2));border:1px solid var(--border);border-radius:var(--r);padding:14px 16px;margin-bottom:16px">
        <div style="font-family:var(--ff-display);font-size:22px;letter-spacing:2px;margin-bottom:2px">CFI Profile</div>
        <div style="font-family:var(--ff-mono);font-size:11px;color:var(--text3)">Your certificate info auto-fills into endorsements and reports.</div>
      </div>
      <div class="card" style="margin-bottom:12px">
        <div class="card-hd"><div class="card-title">Certificate Information</div></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
          <div class="fg" style="margin:0"><label>CFI Full Name</label><input class="finput" id="cfi_name" value="${cfiProfile.name||''}" placeholder="First Last"></div>
          <div class="fg" style="margin:0"><label>Certificate Number</label><input class="finput" id="cfi_certnum" value="${cfiProfile.certNum||''}" placeholder="xxxxxxxxx"></div>
          <div class="fg" style="margin:0">
            <label>Ratings Held</label>
            <input class="finput" id="cfi_ratings" value="${cfiProfile.ratings||'CFI-A'}" placeholder="CFI-A, CFII, MEI">
          </div>
          <div class="fg" style="margin:0">
            <label style="display:flex;align-items:center;gap:6px">
              Certificate Expiry
              ${expOk===false?'<span style="font-family:var(--ff-mono);font-size:9px;color:var(--red);background:#fef2f2;border:1px solid #fecaca;border-radius:3px;padding:1px 5px">EXPIRED</span>':expOk?'<span style="font-family:var(--ff-mono);font-size:9px;color:var(--green);background:#f0fdf4;border:1px solid #86efac;border-radius:3px;padding:1px 5px">CURRENT</span>':''}
            </label>
            <input class="finput" id="cfi_expiry" type="date" value="${cfiProfile.certExpiry||''}">
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div class="fg" style="margin:0"><label>Phone</label><input class="finput" id="cfi_phone" type="tel" value="${cfiProfile.phone||''}" placeholder="(704) 555-0100"></div>
          <div class="fg" style="margin:0"><label>Email</label><input class="finput" id="cfi_email" type="email" value="${cfiProfile.email||''}" placeholder="cfi@charlotteaviation.com"></div>
        </div>
      </div>
      <div class="card" style="margin-bottom:12px">
        <div class="card-hd"><div class="card-title">Endorsement Signature Block</div></div>
        <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--r);padding:12px 14px;font-family:var(--ff-mono);font-size:12px;color:var(--text2);line-height:1.8">
          ${cfiProfile.name||'[CFI Name]'}<br>
          Certificate #: ${cfiProfile.certNum||'[Cert #]'} &nbsp;·&nbsp; ${cfiProfile.ratings||'CFI-A'}<br>
          Expiry: ${cfiProfile.certExpiry||'[Expiry Date]'}<br>
          ${cfiProfile.phone||''} ${cfiProfile.email?'· '+cfiProfile.email:''}
        </div>
      </div>
      <button class="btn btn-primary" data-click-action="save-cfi-settings" style="width:100%">Save CFI Profile</button>
    </div>`;
  },


  // ── PRE-SOLO KNOWLEDGE TEST ──────────────────────────────────────────────
  presolo(s){
    if(!s) return`<div class=”empty”><div class=”empty-icon”>&#9998;</div><div class=”empty-title”>NO STUDENT SELECTED</div><div class=”empty-txt”>Select a student to administer the §61.87(b) pre-solo written test.</div></div>`;

    const tests=s.data?.presoloTests||[];
    const best=tests.length?Math.max(...tests.map(t=>t.pct)):null;
    const everPassed=tests.some(t=>t.passed);

    // ── Test in progress ──
    if(curPresoloTest){
      const total=curPresoloTest.length;
      const marked=curPresoloTest.filter(q=>q.pass!==null).length;
      const passCount=curPresoloTest.filter(q=>q.pass===true).length;
      const questions=curPresoloTest.map((item,i)=>{
        const passActive=item.pass===true;
        const failActive=item.pass===false;
        return`<div class=”psq-card${passActive?' psq-pass':failActive?' psq-fail':''}”>
          <div class=”psq-meta”>
            <span class=”psq-num”>${String(i+1).padStart(2,'0')}</span>
            <span class=”psq-source”>${item.lessonId} &middot; ${item.lessonTitle}</span>
          </div>
          <div class=”psq-text”>${item.q}</div>
          <div class=”psq-actions”>
            <button class=”psq-btn psq-btn-pass${passActive?' active':''}” data-click-action=”mark-presolo-q” data-idx=”${i}” data-val=”pass”>&#10003; Pass</button>
            <button class=”psq-btn psq-btn-fail${failActive?' active':''}” data-click-action=”mark-presolo-q” data-idx=”${i}” data-val=”fail”>&#10007; Fail</button>
          </div>
        </div>`;
      }).join('');
      return`<div class=”psq-header”>
        <div>
          <div class=”psq-title-row”>
            <span class=”psq-badge”>§ 61.87(b)</span>
            <span class=”psq-student”>${s.name}</span>
          </div>
          <div class=”psq-progress-label”>${marked} of ${total} marked &middot; ${passCount} passing</div>
        </div>
        <div style=”display:flex;gap:8px”>
          <button class=”btn btn-ghost btn-sm” data-click-action=”cancel-presolo-test”>Cancel</button>
          <button class=”btn btn-primary btn-sm” data-click-action=”submit-presolo-test”>Submit Test</button>
        </div>
      </div>
      <div class=”psq-progress-bar”><div class=”psq-progress-fill” style=”width:${total?Math.round(marked/total*100):0}%”></div></div>
      <div class=”psq-list”>${questions}</div>`;
    }

    // ── Intro / history screen ──
    const qTotal=PRESOLO_SOURCE_LESSONS.reduce((n,lid)=>n+(GL[lid]?.debrief?.length||0),0);
    const historyRows=tests.slice(0,5).map(t=>`
      <div class=”psq-hist-row”>
        <span class=”psq-hist-date”>${t.date}</span>
        <span class=”psq-hist-score”>${t.score}/${t.total}</span>
        <span class=”psq-hist-pct”>${t.pct}%</span>
        <span class=”psq-hist-result ${t.passed?'psq-hist-pass':'psq-hist-fail'}”>${t.passed?'PASSED':'FAILED'}</span>
      </div>`).join('');

    return`<div class=”psq-intro-grid”>
      <div class=”card”>
        <div class=”card-hd”><div class=”card-title”>§ 61.87(b) Requirement</div></div>
        <p style=”font-size:14px;color:var(--text2);line-height:1.65;margin-bottom:14px”>Before solo flight, a student must pass a written test on the rules and procedures for the airport and the flight characteristics and operational limitations of the aircraft to be soloed.</p>
        <div class=”psq-req-grid”>
          <div class=”psq-req-chip”><span class=”psq-req-label”>Questions</span><span class=”psq-req-val”>${qTotal}</span></div>
          <div class=”psq-req-chip”><span class=”psq-req-label”>Pass threshold</span><span class=”psq-req-val”>${PRESOLO_PASS_PCT}%</span></div>
          <div class=”psq-req-chip”><span class=”psq-req-label”>Source</span><span class=”psq-req-val”>GL1 – GL6</span></div>
        </div>
        ${everPassed
          ?`<div class=”alert alert-ok” style=”margin-top:14px”>&#10003; ${s.name} has a passing score on record. Endorsement criteria met.</div>`
          :`<div class=”alert alert-amber” style=”margin-top:14px”>No passing score on record yet for ${s.name}.</div>`}
        <button class=”btn btn-primary” style=”margin-top:16px;width:100%” data-click-action=”start-presolo-test”>Start New Test &rarr;</button>
      </div>
      <div class=”card”>
        <div class=”card-hd”>
          <div class=”card-title”>Test History</div>
          ${best!==null?`<span class=”psq-best-badge”>Best: ${best}%</span>`:''}
        </div>
        ${tests.length?`<div class=”psq-hist”>${historyRows}</div>`:`<div class=”report-empty” style=”padding:24px 0”>No tests recorded yet.</div>`}
      </div>
    </div>`;
  },

  // â”€â”€ v3: ACS PROFICIENCY HEATMAP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  proficiency(s){
    if(!s)return`<div class="empty"><div class="empty-icon">&#128293;</div><div class="empty-title">NO STUDENT SELECTED</div><div class="empty-txt">Select a student to view their ACS proficiency heatmap.</div></div>`;

    function gradeRank(g){ return ({U:0,M:1,S:2,G:3,E:4}[g] ?? 5); }
    function gradeClass(g){ return g?'grade-'+g:'grade-none'; }

    // Collect all instructor grades across all lessons
    const allGrades={};
    const allLessons=[...Object.values(GL),...Object.values(FL)];
    allLessons.forEach(lesson=>{
      const grades=s.data&&s.data.taskInstructorGrade&&s.data.taskInstructorGrade[lesson.id]||{};
      (lesson.tasks||[]).forEach(t=>{
        const ref=t.acsRef||t.ref||null;
        const grade=grades[t.id]||null;
        if(ref){
          if(!allGrades[ref]||gradeRank(grade)<gradeRank(allGrades[ref].grade)){
            allGrades[ref]={grade,lid:lesson.id,tid:t.id,taskName:t.name,lessonTitle:lesson.title};
          }
        }
      });
    });

    // Build unique ref list from all tasks
    const allRefs={};
    allLessons.forEach(lesson=>{
      (lesson.tasks||[]).forEach(t=>{
        const ref=t.acsRef||t.ref||null;
        if(ref&&!allRefs[ref]) allRefs[ref]={ref,taskName:t.name,lid:lesson.id};
      });
    });

    // ACS area labels
    const ACS_AREAS={'I':'Preflight Preparation','II':'Preflight Procedures','III':'Airport Operations','IV':'Takeoffs, Landings & Go-Arounds','V':'Performance & Ground Reference Maneuvers','VI':'Navigation','VII':'Slow Flight & Stalls','VIII':'Basic Instrument Maneuvers','IX':'Emergency Operations','X':'Multiengine Operations','XI':'Night Operations','XII':'Postflight Procedures'};

    // Group refs by area
    const byArea={};
    Object.values(allRefs).forEach(({ref,taskName,lid})=>{
      const area=ref.split('.')[0]||'?';
      if(!byArea[area])byArea[area]=[];
      if(!byArea[area].find(x=>x.ref===ref)){
        byArea[area].push({ref,taskName,gradeInfo:allGrades[ref]||null,lid});
      }
    });

    const gradedRefs=Object.values(allGrades).filter(g=>g.grade);
    const uCount=gradedRefs.filter(g=>g.grade==='U').length;
    const mCount=gradedRefs.filter(g=>g.grade==='M').length;
    const sCount=gradedRefs.filter(g=>g.grade==='S').length;
    const gCount=gradedRefs.filter(g=>g.grade==='G').length;
    const eCount=gradedRefs.filter(g=>g.grade==='E').length;
    const nCount=Object.keys(allRefs).length-gradedRefs.length;
    const areaOrder=Object.keys(ACS_AREAS);
    const sortedAreas=Object.keys(byArea).sort((a,b)=>areaOrder.indexOf(a)-areaOrder.indexOf(b));

    if(sortedAreas.length===0){
      return`<div class="empty"><div class="empty-icon">ACS</div><div class="empty-title">NO ACS DATA</div><div class="empty-txt">Open lessons and enter Instructor Grades to populate the heatmap.</div></div>`;
    }

    return`
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:8px">
      <div>
        <div style="font-family:var(--ff-display);font-size:22px;letter-spacing:2px">ACS PROFICIENCY HEATMAP</div>
        <div style="font-family:var(--ff-mono);font-size:11px;color:var(--text3);margin-top:2px">${s.name} · Instructor grades by ACS Task Reference</div>
      </div>
      <button class="btn btn-ghost btn-sm" data-click-action="nav-lessons">Back to Lessons</button>
    </div>
    <div class="heatmap-legend">
      <div class="heatmap-legend-item"><div class="heatmap-dot" style="background:var(--red)"></div>U - Unsatisfactory (${uCount})</div>
      <div class="heatmap-legend-item"><div class="heatmap-dot" style="background:var(--orange)"></div>M - Marginal (${mCount})</div>
      <div class="heatmap-legend-item"><div class="heatmap-dot" style="background:var(--amber)"></div>S - Satisfactory (${sCount})</div>
      <div class="heatmap-legend-item"><div class="heatmap-dot" style="background:var(--blue)"></div>G - Good (${gCount})</div>
      <div class="heatmap-legend-item"><div class="heatmap-dot" style="background:var(--green)"></div>E - Excellent (${eCount})</div>
      <div class="heatmap-legend-item"><div class="heatmap-dot" style="background:var(--bg4)"></div>Not graded (${nCount})</div>
    </div>
    ${uCount>0?'<div class="alert alert-danger" style="margin-bottom:14px"><span>Warning</span><div><strong>'+uCount+' task'+(uCount>1?'s':'')+' rated Unsatisfactory</strong> - focused remediation needed before the practical test.</div></div>':''}
    ${mCount>0?'<div class="alert alert-warn" style="margin-bottom:14px"><span>Warning</span><div><strong>'+mCount+' task'+(mCount>1?'s':'')+' rated Marginal</strong> - additional practice recommended.</div></div>':''}
    ${sortedAreas.map(area=>{
      const items=byArea[area].sort((a,b)=>a.ref.localeCompare(b.ref));
      const areaGrades=items.map(i=>i.gradeInfo&&i.gradeInfo.grade).filter(Boolean);
      const worstGrade=areaGrades.sort((a,b)=>gradeRank(a)-gradeRank(b))[0]||null;
      const borderColor=worstGrade==='U'?'var(--red)':worstGrade==='M'?'var(--orange)':worstGrade==='S'?'var(--amber)':worstGrade==='G'?'var(--blue)':worstGrade==='E'?'var(--green)':'var(--border)';
      const graded=items.filter(i=>i.gradeInfo&&i.gradeInfo.grade).length;
      return '<div class="heatmap-section">'
        +'<div class="heatmap-area-hd" style="border-left-color:'+borderColor+'">'
          +'<span class="heatmap-area-code">'+area+'</span>'
          +'<span class="heatmap-area-title">'+(ACS_AREAS[area]||area)+'</span>'
          +'<span class="heatmap-area-stats">'+graded+'/'+items.length+' graded</span>'
        +'</div>'
        +'<div class="heatmap-grid">'
          +items.map(item=>{
            const g=item.gradeInfo&&item.gradeInfo.grade||null;
            const lid=item.gradeInfo&&item.gradeInfo.lid||item.lid;
            return '<div class="heatmap-cell '+gradeClass(g)+'"'
              +' data-click-action="open-lesson" data-lid="'+lid+'"'
              +' title="'+(item.taskName||'')+(g?' - Grade: '+g:' - Not yet graded')+'">'
              +'<div class="heatmap-cell-ref">'+item.ref+'</div>'
              +'<div class="heatmap-cell-name">'+((item.taskName||'').substring(0,28))+(item.taskName&&item.taskName.length>28?'...':'')+'</div>'
              +'<div class="heatmap-cell-grade">'+(g||'-')+'</div>'
              +'</div>';
          }).join('')
        +'</div>'
        +'</div>';
    }).join('')}`;
  },

  scheduleCard(s){
    if(!s)return'';
    const allLids=[...Object.keys(GL),...Object.keys(FL)];
    const scheduled=allLids.map(function(lid){
      const dates=(s.data&&s.data.lessonDates&&s.data.lessonDates[lid])||{};
      const lesson=GL[lid]||FL[lid];
      return{lid:lid,title:lesson.title,planned:dates.planned||'',completed:dates.completed||''};
    }).filter(function(l){return l.planned||l.completed;}).sort(function(a,b){
      const da=a.planned||a.completed,db=b.planned||b.completed;
      return da<db?-1:da>db?1:0;
    });
    if(scheduled.length===0)return'';
    const today=new Date().toISOString().split('T')[0];
    const upcoming=scheduled.filter(function(l){return l.planned&&l.planned>=today&&!l.completed;});
    const recent=scheduled.filter(function(l){return l.completed;}).slice(-3).reverse();
    if(upcoming.length===0&&recent.length===0)return'';
    function row(l,colorStyle){
      const dot=colorStyle==='green'?'completed':'upcoming';
      return '<div class="sched-row lesson-row" style="cursor:pointer;padding:6px 4px;margin-bottom:3px" data-click-action="open-lesson" data-lid="'+l.lid+'">'
        +'<div class="sched-dot '+dot+'"></div>'
        +'<div class="sched-info"><span class="sched-id">'+l.lid+'</span><span class="sched-title">'+l.title+'</span></div>'
        +'<span class="sched-date'+(colorStyle?' style=color:var(--'+colorStyle+')':'')+'">'+( colorStyle==='green'?l.completed:l.planned)+'</span>'
        +'</div>';
    }
    let html2='';
    if(upcoming.length>0){
      html2+='<div class="section-label" style="margin-bottom:5px">Upcoming</div>';
      upcoming.slice(0,5).forEach(function(l){html2+=row(l,'');});
    }
    if(recent.length>0){
      html2+='<div class="section-label" style="margin-top:10px;margin-bottom:5px">Recently Completed</div>';
      recent.forEach(function(l){html2+=row(l,'green');});
    }
    return'<div class="card" id="dash-schedule" style="margin-top:12px">'
      +'<div class="card-hd"><div class="card-title">ðŸ“… Lesson Schedule</div>'
      +'<button class="btn btn-ghost btn-sm" data-click-action="nav-lessons" style="margin-left:auto;font-size:11px">View Lessons</button>'
      +'</div>'+html2+'</div>';
  },

  reports(s){
    if(!s)return H.emptyState('', 'NO STUDENT SELECTED', 'Select a student to generate a printable training progress report.', '<div class="empty-actions"><button class="btn btn-primary" data-click-action="nav" data-view="students">Select Student</button></div>');
    const gp=H.glProgress(s),fp=H.flProgress(s);
    const reqDone=REQS.filter(r=>getReq(s,r.id)>=r.min).length;
    const nr=H.needsReview(s);
    const unmetReqs=REQS.filter(r=>getReq(s,r.id)<r.min);
    const nextAction=H.nextTrainingAction(s);
    const readiness=H.readinessSnapshot(s);
    const procedureSupport=H.procedureSupport(s);
    const combinedGuidance=H.combinedGuidanceBundles(s);
    const activePhase=H.activePhase(s);
    const milestones=[
      {id:'FL11',name:'First Solo'},
      {id:'FL12',name:'Stage 1 Check'},
      {id:'FL19',name:'Night XC Dual'},
      {id:'FL20',name:'Solo XC'},
      {id:'FL25',name:'Stage 2 Check'},
      {id:'FL26',name:'FAA Practical Test'}
    ];
    const nextMilestone = milestones.find(m=>getLStatus(s,m.id)!=='signed_off') || null;
    const readinessTone = nr.length>0 ? 'danger' : unmetReqs.length>0 ? 'warn' : 'ok';
    const readinessTitle = nr.length>0
      ? 'Training review items need attention'
      : unmetReqs.length>0
      ? 'Core training requirements are still in progress'
      : 'Tracked training items appear ready for final review';
    const readinessText = nr.length>0
      ? 'Use the lessons view to resolve tasks marked Needs Review before relying on this report for milestone decisions.'
      : unmetReqs.length>0
      ? 'This report shows solid progress, but tracked aeronautical experience items are still incomplete.'
      : 'No tracked review flags or hour gaps are currently open. Confirm endorsements and instructor judgement separately.';
    const attentionItems = [];
    nr.slice(0,6).forEach(l=>attentionItems.push({title:`${l.id} ${l.title}`, text:'Marked Needs Review in the lesson record.'}));
    unmetReqs.slice(0,6).forEach(r=>attentionItems.push({title:r.name, text:`Tracked value ${getReq(s,r.id)} of ${r.min} ${r.unit||''}`.trim()}));
    return`
    <div class="report-toolbar">
      <div class="report-toolbar-title">PROGRESS REPORT</div>
      <button class="btn btn-primary" data-click-action="print-report">Print Report</button>
    </div>
    <div class="card report-shell">
      <div class="report-header">
        <div class="report-brand">CHARLOTTE AVIATION</div>
        <div class="report-subline">Concord Regional Airport | Concord, NC 28025 | KJQF</div>
        <div class="report-subline">Part 61 Private Pilot Training Progress Report</div>
      </div>
      <div class="report-readiness report-readiness-${readinessTone}">
        <div class="report-readiness-title">${readinessTitle}</div>
        <div class="report-readiness-text">${readinessText}</div>
      </div>
      <div class="report-summary-strip">
        <div class="report-metric"><div class="report-metric-label">Ground</div><div class="report-metric-value" style="color:var(--amber)">${gp.pct}%</div></div>
        <div class="report-metric"><div class="report-metric-label">Flight</div><div class="report-metric-value" style="color:var(--blue)">${fp.pct}%</div></div>
        <div class="report-metric"><div class="report-metric-label">Requirements</div><div class="report-metric-value" style="color:${unmetReqs.length?'var(--orange)':'var(--green)'}">${reqDone}/${REQS.length}</div></div>
        <div class="report-metric"><div class="report-metric-label">Needs Review</div><div class="report-metric-value" style="color:${nr.length?'var(--red)':'var(--green)'}">${nr.length}</div></div>
      </div>
      <div class="report-panel readiness-report-shell">
        <div class="section-label">Milestone Readiness Summary</div>
        <div class="report-empty readiness-disclaimer">${readiness.note}</div>
        <div class="readiness-grid">
          ${H.renderReadinessCard('Solo Readiness Indicators', readiness.solo)}
          ${H.renderReadinessCard('Checkride Readiness Indicators', readiness.checkride)}
        </div>
      </div>
      <div class="report-panel">
        ${H.renderCombinedGuidance('Suggested Study / Briefing Support', combinedGuidance, 'No specific combined review bundle was identified from the current tracked blockers.')}
      </div>
      <div class="report-panel">
        ${H.renderProcedureSupport('Recommended Procedure Review', procedureSupport, 'No specific procedure review was identified from the current tracked blockers.')}
      </div>
      <div class="report-grid">
        <div class="report-panel"><div class="section-label">Student</div>
          <table class="report-table">
            <tr><td style="color:var(--text3);width:120px;padding:3px 0">Name:</td><td>${s.name}</td></tr>
            <tr><td style="color:var(--text3);padding:3px 0">Part:</td><td>${s.partType||61}</td></tr>
            <tr><td style="color:var(--text3);padding:3px 0">Start Date:</td><td>${s.startDate||'N/A'}</td></tr>
            <tr><td style="color:var(--text3);padding:3px 0">CFI:</td><td>${s.cfi||'N/A'}</td></tr>
            <tr><td style="color:var(--text3);padding:3px 0">Report Date:</td><td>${new Date().toLocaleDateString()}</td></tr>
          </table>
        </div>
        <div class="report-panel"><div class="section-label">Summary</div>
          <table class="report-table">
            <tr><td style="color:var(--text3);width:160px;padding:3px 0">Ground Training:</td><td style="color:var(--amber)">${gp.done}/${gp.total} lessons (${gp.pct}%)</td></tr>
            <tr><td style="color:var(--text3);padding:3px 0">Flight Training:</td><td style="color:var(--blue)">${fp.done}/${fp.total} lessons (${fp.pct}%)</td></tr>
            <tr><td style="color:var(--text3);padding:3px 0">Sec. 61.109:</td><td style="color:${unmetReqs.length?'var(--orange)':'var(--green)'}">${reqDone}/${REQS.length} met</td></tr>
            <tr><td style="color:var(--text3);padding:3px 0">Items for Review:</td><td style="color:${nr.length>0?'var(--red)':'var(--green)'}">${nr.length>0?nr.length+' lesson(s)':'None'}</td></tr>
          </table>
        </div>
      </div>
      <div class="report-grid">
        <div class="report-panel">
          <div class="section-label">What's Going Well</div>
          ${readiness.overall.strongestSignals.length?`<div class="report-list">${readiness.overall.strongestSignals.map(item=>`<div class="report-list-item"><div class="report-list-title">Positive Signal</div><div class="report-list-text">${item}</div></div>`).join('')}</div>`:'<div class="report-empty">The app does not yet have enough tracked data to highlight strong readiness signals.</div>'}
        </div>
        <div class="report-panel">
          <div class="section-label">What Still Needs Work</div>
          ${readiness.overall.blockers.length?`<div class="report-list">${readiness.overall.blockers.map(item=>`<div class="report-list-item"><div class="report-list-title">Needs Instructor Review</div><div class="report-list-text">${item}</div></div>`).join('')}</div>`:'<div class="report-empty">No major blockers are currently visible in tracked data.</div>'}
        </div>
      </div>
      <div class="report-grid">
        <div class="report-panel">
          <div class="section-label">Before Solo</div>
          <div class="report-list">
            <div class="report-list-item"><div class="report-list-title">State</div><div class="report-list-text">${readiness.solo.state}</div></div>
            <div class="report-list-item"><div class="report-list-title">Recommended Next Step</div><div class="report-list-text">${readiness.solo.nextStep}</div></div>
          </div>
        </div>
        <div class="report-panel">
          <div class="section-label">Before Checkride</div>
          <div class="report-list">
            <div class="report-list-item"><div class="report-list-title">State</div><div class="report-list-text">${readiness.checkride.state}</div></div>
            <div class="report-list-item"><div class="report-list-title">Recommended Next Step</div><div class="report-list-text">${readiness.checkride.nextStep}</div></div>
          </div>
        </div>
      </div>
      <div class="report-signatures">
        <div><div class="section-label">Instructor Signature</div><div class="report-sign-line"></div><div class="report-sign-meta">${cfiProfile.name||s.cfi||'CFI Name'} | Cert # ${cfiProfile.certNum||'__________'} | ${cfiProfile.ratings||'CFI-A'} | Exp ${cfiProfile.certExpiry||'__________'}</div></div>
        <div><div class="section-label">Student Signature</div><div class="report-sign-line"></div><div class="report-sign-meta">${s.name} | Date __________</div></div>
      </div>
    </div>`;
  },

  weightBalance(){
    const pohRefs = H.pohRefsForWeightBalance();
    const profile = CHEROKEE_WB_PROFILE;
    const gaugeMin = 82;
    const gaugeMax = 98;
    const gaugeRange = gaugeMax - gaugeMin;
    const gaugeLeft = ((profile.forwardLimits[0][1] - gaugeMin) / gaugeRange) * 100;
    const gaugeWidth = ((profile.aftLimits[0][1] - profile.forwardLimits[0][1]) / gaugeRange) * 100;
    return`<div class="tool-wrap" style="max-width:780px">
    <div class="tool-header">
      <div class="tool-icon">&#9881;</div>
      <div>
        <div class="tool-title">WEIGHT &amp; BALANCE</div>
        <div class="tool-sub">${profile.aircraft} - corrected loading profile</div>
      </div>
    </div>
    <div class="card procedure-lesson-card">
      ${H.renderPohSupport('POH Reference Support', pohRefs, 'No handbook-backed weight and balance reference is linked here yet.')}
      <div class="report-empty" style="margin-top:10px">Use the Cherokee handbook references and the aircraft's actual weight-and-balance paperwork together. The handbook reference layer is source support, not a replacement for the aircraft loading documents.</div>
    </div>

    <!-- Aircraft profile badge -->
    <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--r);
                padding:10px 14px;margin-bottom:16px;display:flex;gap:20px;flex-wrap:wrap">
      <div><span style="font-family:var(--ff-mono);font-size:10px;color:var(--text3)">EMPTY WEIGHT</span>
           <div style="font-family:var(--ff-display);font-size:20px;letter-spacing:1px;color:var(--amber)">${profile.emptyWeight.toFixed(2)} lbs</div></div>
      <div><span style="font-family:var(--ff-mono);font-size:10px;color:var(--text3)">EMPTY MOMENT</span>
           <div style="font-family:var(--ff-display);font-size:20px;letter-spacing:1px;color:var(--amber)">${profile.emptyMoment.toFixed(2)} lb-in</div></div>
      <div><span style="font-family:var(--ff-mono);font-size:10px;color:var(--text3)">MAX GROSS</span>
           <div style="font-family:var(--ff-display);font-size:20px;letter-spacing:1px;color:var(--text2)">${profile.maxGross.toFixed(0)} lbs</div></div>
      <div><span style="font-family:var(--ff-mono);font-size:10px;color:var(--text3)">CG ENVELOPE</span>
           <div style="font-family:var(--ff-display);font-size:20px;letter-spacing:1px;color:var(--text2)">84.0&Prime; - 95.9&Prime;</div></div>
    </div>

    <!-- Station input table -->
    <div style="font-family:var(--ff-mono);font-size:10px;color:var(--text3);
                text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Useful Load Stations</div>
    <div style="overflow-x:auto;margin-bottom:16px">
      <table class="wb-table" style="width:100%;border-collapse:collapse;font-size:13px">
        <thead>
          <tr>
            <th style="font-family:var(--ff-mono);font-size:10px;color:var(--text3);text-align:left;
                       padding:6px 10px;border-bottom:2px solid var(--border);letter-spacing:.8px;
                       text-transform:uppercase">Station</th>
            <th style="font-family:var(--ff-mono);font-size:10px;color:var(--text3);text-align:center;
                       padding:6px 10px;border-bottom:2px solid var(--border);letter-spacing:.8px;
                       text-transform:uppercase">Arm (in)</th>
            <th style="font-family:var(--ff-mono);font-size:10px;color:var(--text3);text-align:right;
                       padding:6px 10px;border-bottom:2px solid var(--border);letter-spacing:.8px;
                       text-transform:uppercase">Weight (lbs)</th>
            <th style="font-family:var(--ff-mono);font-size:10px;color:var(--text3);text-align:right;
                       padding:6px 10px;border-bottom:2px solid var(--border);letter-spacing:.8px;
                       text-transform:uppercase">Moment (lb-in)</th>
          </tr>
        </thead>
        <tbody>
          <!-- Fixed row: empty aircraft -->
          <tr style="background:var(--bg3)">
            <td style="padding:8px 10px;border-bottom:1px solid var(--border);color:var(--text3);
                       font-style:italic">Aircraft Empty</td>
            <td style="padding:8px 10px;border-bottom:1px solid var(--border);text-align:center;
                       font-family:var(--ff-mono);color:var(--text3)">${profile.emptyCg.toFixed(1)}</td>
            <td style="padding:8px 10px;border-bottom:1px solid var(--border);text-align:right;
                       font-family:var(--ff-mono);color:var(--text3)">${profile.emptyWeight.toFixed(2)}</td>
            <td style="padding:8px 10px;border-bottom:1px solid var(--border);text-align:right;
                       font-family:var(--ff-mono);color:var(--text3)">${profile.emptyMoment.toFixed(2)}</td>
          </tr>
          <!-- Editable rows -->
          ${profile.stations.map(r=>`
          <tr id="wb_row_${r.id}">
            <td style="padding:8px 10px;border-bottom:1px solid var(--border)">${r.id==='fuel'?`<span id="wbFuelLabel">Fuel (Avgas 6 lbs/gal)</span>`:r.label}</td>
            <td style="padding:8px 10px;border-bottom:1px solid var(--border);text-align:center;
                       font-family:var(--ff-mono);color:var(--text3)">${r.arm.toFixed(2)}</td>
            <td style="padding:8px 10px;border-bottom:1px solid var(--border);text-align:right">
              <input id="wb_${r.id}" type="number" min="0" ${r.maxWeight ? `max="${r.maxWeight}"` : ''} step="0.1"
                placeholder="${r.placeholder}"
                data-input-action="calc-wb"
                data-focus-action="focus-border"
                data-blur-action="blur-border"
                data-focus-border="var(--amber)"
                data-blur-border="var(--border)"
                style="width:110px;font-family:var(--ff-mono);font-size:13px;text-align:right;
                       padding:4px 8px;border:1.5px solid var(--border);border-radius:4px;
                       background:var(--bg2);color:var(--text);outline:none">
              ${r.id==='fuel'?`<button id="wbFuelToggleBtn" class="btn btn-ghost btn-sm" data-click-action="wb-toggle-fuel-unit" style="margin-left:6px;font-size:10px;padding:2px 6px">→ gal</button>`:''}
            </td>
            <td id="wb_mom_${r.id}" style="padding:8px 10px;border-bottom:1px solid var(--border);
                text-align:right;font-family:var(--ff-mono);color:var(--text3)">-</td>
          </tr>`).join('')}
        </tbody>
        <tfoot>
          <tr style="background:var(--bg3);font-weight:600">
            <td style="padding:10px 10px;border-top:2px solid var(--border2);
                       font-family:var(--ff-mono);font-size:11px;text-transform:uppercase;
                       letter-spacing:.5px;color:var(--text3)">Totals</td>
            <td style="padding:10px 10px;border-top:2px solid var(--border2)"></td>
            <td id="wb_total_wt" style="padding:10px 10px;border-top:2px solid var(--border2);
                text-align:right;font-family:var(--ff-display);font-size:22px;
                letter-spacing:1px;color:var(--amber)">${profile.emptyWeight.toFixed(2)} lbs</td>
            <td id="wb_total_mom" style="padding:10px 10px;border-top:2px solid var(--border2);
                text-align:right;font-family:var(--ff-display);font-size:22px;
                letter-spacing:1px;color:var(--amber)">${profile.emptyMoment.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Results panel -->
    <div id="wbResult" style="display:block">
      <div id="wbResultInner"></div>
    </div>

    <!-- CG gauge (always visible skeleton, filled by calcWB) -->
    <div style="margin-top:4px;padding:14px 16px;background:var(--bg3);border:1px solid var(--border);
                border-radius:var(--r)">
      <div style="font-family:var(--ff-mono);font-size:10px;color:var(--text3);
                  text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">CG Envelope (<span id="wbGaugeFwdLabel">84.0</span>&Prime; - <span id="wbGaugeAftLabel">95.9</span>&Prime;)</div>
      <div style="position:relative;height:28px;background:var(--bg4);border-radius:4px;overflow:hidden;margin-bottom:4px">
        <div id="wbEnvelopeBand" style="position:absolute;top:0;bottom:0;
                    left:${gaugeLeft.toFixed(1)}%;
                    width:${gaugeWidth.toFixed(1)}%;
                    background:rgba(4,120,87,.18);border-left:2px solid var(--green);
                    border-right:2px solid var(--green)"></div>
        <div id="wbCGNeedle" style="position:absolute;top:0;bottom:0;width:3px;
                    background:var(--amber);border-radius:2px;display:block;
                    transition:left .35s ease"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-family:var(--ff-mono);font-size:9px;color:var(--text3)">
        <span>${gaugeMin}&Prime;</span><span>FWD</span><span>88&Prime;</span><span>92&Prime;</span><span>AFT</span><span>${gaugeMax}&Prime;</span>
      </div>
    </div>

    <div style="margin-top:10px;font-family:var(--ff-mono);font-size:10px;color:var(--text3);line-height:1.8">
      &#9432; Calculator uses the corrected Cherokee 140 profile in pounds and inches from datum. Always verify against your specific aircraft weight-and-balance paperwork before flight.<br>
      &#9432; Fuel entry is in pounds. Use 6.0 lbs per gallon for Avgas if you are converting from gallons. Fuel station max: 297.8 lbs.
    </div>
    </div>`;
  },

  performance(s){
    const lessonContext = H.performanceLessonContext(s);
    return `<div class="tool-wrap performance-wrap">
    <div class="tool-header">
      <div class="tool-icon">&#8645;</div>
      <div>
        <div class="tool-title">PERFORMANCE</div>
        <div class="tool-sub">Cherokee 140 planning support | educational use only</div>
      </div>
    </div>
    <div class="performance-shell">
      <div class="performance-hero">
        <div>
          <div class="decision-eyebrow">Training + Planning Support</div>
          <div class="performance-hero-title">Pressure altitude and density altitude first.</div>
          <div class="performance-hero-text">Use this as planning support only. Confirm actual takeoff and landing planning with the POH charts and aircraft paperwork.</div>
          ${lessonContext ? `<div class="performance-context-note">Lesson Context: ${lessonContext.lesson.id} - ${lessonContext.lesson.title}</div>` : ''}
        </div>
        <div class="performance-actions">
          <button class="btn btn-ghost btn-sm" data-click-action="nav" data-view="wb">Open W&amp;B</button>
          <button class="btn btn-ghost btn-sm" data-click-action="nav" data-view="poh">Open POH Reference</button>
          <button class="btn btn-ghost btn-sm" data-click-action="nav" data-view="procedures">Open Procedures</button>
          <button class="btn btn-ghost btn-sm" data-click-action="nav" data-view="decision">Open Preflight Decision</button>
        </div>
      </div>

      <div class="performance-input-panel">
        <div class="card-hd"><div class="card-title">Inputs</div></div>
        <div class="performance-input-grid">
          <div class="fg" style="margin:0">
            <label>Field Elevation (ft MSL)</label>
            <input class="finput" id="perf_field_elev" type="number" step="1" value="705" data-input-action="calc-performance">
          </div>
          <div class="fg" style="margin:0">
            <label>OAT (°C)</label>
            <input class="finput" id="perf_oat" type="number" step="1" placeholder="Enter temperature" data-input-action="calc-performance">
          </div>
          <div class="fg" style="margin:0">
            <label>Altimeter Setting (inHg)</label>
            <input class="finput" id="perf_altimeter" type="number" step="0.01" value="29.92" data-input-action="calc-performance">
          </div>
          <div class="fg" style="margin:0">
            <label>Runway Length Available (ft)</label>
            <input class="finput" id="perf_runway_len" type="number" step="1" value="6020" data-input-action="calc-performance">
          </div>
          <div class="fg" style="margin:0">
            <label>Runway Surface</label>
            <select class="fselect" id="perf_surface" data-input-action="calc-performance" data-change-action="calc-performance">
              <option value="paved-dry">Paved / Dry</option>
              <option value="grass-soft">Grass / Soft</option>
              <option value="wet-contaminated">Wet / Contaminated</option>
            </select>
          </div>
        </div>
        <div class="performance-input-note">Exact numeric output in this tool is limited to pressure altitude and density altitude estimate. Takeoff and landing sections remain support-style guidance tied to current handbook references and in-session loading.</div>
      </div>

      <div id="performanceResults"></div>
    </div>
    </div>`;
  },
};


// ============================================================
// PART 4 - Weather API - W&B Calculator - Tool Functions - Exports
// ============================================================

const CHEROKEE_WB_PROFILE = {
  aircraft: 'PA-28-140 Cherokee 140',
  emptyWeight: 1285.56,
  emptyCg: 85.2,
  maxGross: 2150,
  stations: [
    { id:'frontSeats', label:'Front Seats', arm:85.5, placeholder:'lbs - combined crew/passengers' },
    { id:'aftSeats', label:'Aft Seats', arm:117.0, placeholder:'lbs - combined passengers' },
    { id:'baggage', label:'Baggage', arm:117.0, maxWeight:200, placeholder:'lbs - max 200' },
    { id:'fuel', label:'Fuel (Avgas 6 lbs/gal)', arm:95.0, maxWeight:297.8, placeholder:'lbs - full = 297.8' }
  ],
  forwardLimits: [
    [1200, 84.0],
    [1650, 84.0],
    [1975, 85.9],
    [2150, 88.4]
  ],
  aftLimits: [
    [1200, 95.9],
    [2150, 95.9]
  ]
};
CHEROKEE_WB_PROFILE.emptyMoment = CHEROKEE_WB_PROFILE.emptyWeight * CHEROKEE_WB_PROFILE.emptyCg;

const CHEROKEE_PERFORMANCE_BASELINE = {
  takeoff:{
    title:'Takeoff Baseline',
    groundRoll:'~800 ft',
    over50:'~1,200-1,700 ft'
  },
  landing:{
    title:'Landing Baseline',
    groundRoll:'~500 ft',
    over50:'~850 ft'
  },
  climb:{
    title:'Climb Baseline',
    value:'~700 fpm'
  },
  cruise:{
    title:'Cruise Baseline',
    value:'~110 KTAS'
  },
  note:'Baseline Cherokee 140 reference only. Actual performance depends on loading, runway, surface, density altitude, and conditions.'
};

const PERFORMANCE_BASELINE = {
  takeoff: { ground: 800, over50: 1400 },
  landing: { ground: 500, over50: 850 }
};

function interpolateLimit(weight, points) {
  if(weight <= points[0][0]) return points[0][1];
  for(let i = 0; i < points.length - 1; i += 1) {
    const [w1, v1] = points[i];
    const [w2, v2] = points[i + 1];
    if(weight <= w2) {
      if(w2 === w1) return v2;
      const ratio = (weight - w1) / (w2 - w1);
      return v1 + ((v2 - v1) * ratio);
    }
  }
  return points[points.length - 1][1];
}

function weightBalanceStatus(result) {
  const labels = [];
  if(result.overweight) labels.push('Overweight');
  if(result.cgForward) labels.push('Forward CG');
  if(result.cgAft) labels.push('Aft CG');
  if(!labels.length) labels.push('Within Limits');
  return labels.join(' + ');
}

function weightBalanceMessage(result) {
  if(result.overweight && result.cgForward) return 'Aircraft is over maximum gross weight and ahead of the allowable forward CG limit.';
  if(result.overweight && result.cgAft) return 'Aircraft is over maximum gross weight and beyond the allowable aft CG limit.';
  if(result.overweight) return 'Aircraft is over maximum gross weight.';
  if(result.cgForward) return 'CG is ahead of the allowable forward limit at this weight.';
  if(result.cgAft) return 'CG is behind the allowable aft limit at this weight.';
  return 'Weight and center of gravity are within the modeled Cherokee 140 limits.';
}

function daFactor(da) {
  if(!Number.isFinite(da)) return 1.0;
  if(da < 1000) return 1.0;
  if(da < 3000) return 1.15;
  if(da < 5000) return 1.30;
  if(da < 7000) return 1.50;
  return 1.70;
}

function weightFactor(weight, maxGross = 2150) {
  if(!weight) return 1.0;
  const ratio = weight / maxGross;
  if(ratio < 0.75) return 0.90;
  if(ratio < 0.90) return 1.00;
  if(ratio < 1.00) return 1.10;
  return 1.20;
}

function surfaceFactor(surface) {
  if(!surface) return 1.0;
  const normalized = String(surface).toLowerCase();
  if(normalized.includes('grass')) return 1.15;
  if(normalized.includes('soft')) return 1.20;
  if(normalized.includes('wet')) return 1.25;
  return 1.00;
}


// Weather API fallback
/**
 * fetchKJQFWeather()
 *
 * Browser-safe fallback for the Weather Brief.
 * Aviation Weather Center blocks frontend cross-origin API requests,
 * so this function resets the live weather widgets and shows guidance
 * to use the official weather links instead.
 */
async function fetchKJQFWeather() {
  const ttyEl = document.getElementById('wxMetarTTY');
  const chipEl = document.getElementById('wxWindChips');
  const syncBtn = document.getElementById('syncXWBtn');
  const refreshBtn = document.getElementById('wxRefreshBtn');
  const tsEl = document.getElementById('wxFetchTs');
  const goNoGoEl = document.getElementById('goNoGoResult');

  if(!ttyEl) return;

  window._lastMetarRaw = null;
  window._lastMetarWind = null;

  if(chipEl) {
    chipEl.style.display = 'none';
    chipEl.innerHTML = '';
  }
  if(syncBtn) syncBtn.style.display = 'none';
  if(goNoGoEl) goNoGoEl.innerHTML = '';

  if(refreshBtn) {
    refreshBtn.disabled = true;
    refreshBtn.textContent = 'Browser Blocked';
  }

  ttyEl.textContent =
    'Live browser fetch is unavailable in this app.\n\n'
    + 'Aviation Weather Center currently blocks cross-origin API requests from frontend-only apps, so Charlotte Aviation cannot request the KJQF METAR directly from a normal browser session.\n\n'
    + 'Use the official METAR, TAF, PIREP, winds aloft, and prog chart links below for current weather.';
  ttyEl.style.color = '#f8fafc';

  if(tsEl) tsEl.textContent = 'BROWSER FETCH DISABLED';

  if(refreshBtn) {
    refreshBtn.disabled = false;
    refreshBtn.textContent = 'Browser Status';
  }
}
/** Build a wind chip pill for the decoded chip row */
function wxChip(label, value, isWarn) {
  const bg  = isWarn ? 'rgba(220,38,38,.28)' : 'rgba(255,255,255,.1)';
  const bdr = isWarn ? '1px solid rgba(220,38,38,.5)' : 'none';
  const col = isWarn ? '#fca5a5' : '#e0f2fe';
  return `<div style="background:${bg};border:${bdr};border-radius:6px;padding:6px 13px;
                      font-family:var(--ff-mono);font-size:11px;color:${col}">
    <span style="color:rgba(255,255,255,.45);margin-right:4px">${label}</span><strong>${value}</strong>
  </div>`;
}

/**
 * parseMetarWind(metar)
 * Extracts wind direction, speed, and optional gust from a raw METAR string.
 * Returns { dir, speed, gust } or null if no wind group found.
 *
 * Handles:
 *   27015KT        -> { dir: '270', speed: 15, gust: null }
 *   27015G22KT     -> { dir: '270', speed: 15, gust: 22 }
 *   VRB04KT        -> { dir: 'VRB', speed: 4,  gust: null }
 *   00000KT        -> { dir: '000', speed: 0,  gust: null } (calm)
 */
function parseMetarWind(metar) {
  // Regex: optional VRB or 3-digit dir, 2-digit speed, optional Gxx, KT or MPS
  const m = metar.match(/\b(VRB|\d{3})(\d{2,3})(?:G(\d{2,3}))?(KT|MPS)\b/);
  if(!m) return null;
  return {
    dir  : m[1],                              // '270' or 'VRB'
    speed: parseInt(m[2], 10),                // knots (or m/s if MPS - rare)
    gust : m[3] ? parseInt(m[3], 10) : null,  // gust speed or null
    unit : m[4]                               // 'KT' or 'MPS'
  };
}

/**
 * runGoNoGo()
 * v3: Compares the last-fetched METAR wind data against the active
 * student's personalMins object. Renders a colour-coded Go/No-Go
 * grid into #goNoGoResult inside the Weather Brief view.
 *
 * Checks: Wind Speed, Gust, Crosswind (Rwy 02/20), Visibility,
 *         and Ceiling parsed from the raw METAR string.
 */
function runGoNoGo() {
  const resultEl = document.getElementById('goNoGoResult');
  if(!resultEl) return;
  const s = getS();
  if(!s) { resultEl.innerHTML='<div class="alert alert-info">Select a student first.</div>'; return; }
  const wind = window._lastMetarWind;
  // Use the clean stored raw string - not the DOM textContent which contains
  // timestamp text, HTML entities, and colour-syntax spans that break regexes
  const metarRaw = window._lastMetarRaw || '';
  const mins = (s.data && s.data.personalMins) || { windSpd:15, windGust:20, crosswind:10, vis:5, ceiling:3000 };

  // Safe fraction parser - replaces eval(), works in strict-mode ES modules
  // Handles "3", "1/4", "1 3/4" (METAR mixed-fraction visibility strings)
  function parseFraction(str) {
    return str.trim().split(/\s+/).reduce((sum, part) => {
      const [n, d] = part.split('/');
      return sum + (d ? parseInt(n, 10) / parseInt(d, 10) : parseFloat(n));
    }, 0);
  }

  // --- Parse visibility from METAR (e.g. "10SM", "1 3/4SM", "1/4SM")
  const visMatch = metarRaw.match(/\b(\d+(?:\s+\d+\/\d+)?|\d+\/\d+)SM\b/);
  const parsedVis = visMatch ? parseFraction(visMatch[1]) : null;

  // --- Parse ceiling from METAR (BKN/OVC + height)
  const ceilMatch = metarRaw.match(/\b(?:BKN|OVC)(\d{3})\b/);
  const parsedCeil = ceilMatch ? parseInt(ceilMatch[1]) * 100 : null;

  // --- Crosswind for KJQF Rwy 02 (020Â°) and Rwy 20 (200Â°)
  let xw = null;
  if(wind && wind.dir !== 'VRB' && wind.speed > 0) {
    const wdRad = (parseInt(wind.dir) - 20) * Math.PI / 180; // diff from Rwy 02
    xw = Math.abs(wind.speed * Math.sin(wdRad));
  }

  function item(label, icon, actual, min, unit, isMin=false, fmt=null) {
    if(actual === null) return goItem(label, icon, null, min, unit, isMin, 'pending', fmt);
    const ratio = isMin ? (actual / min) : (actual / min);
    const exceeded = isMin ? actual < min : actual > min;
    const caution  = isMin ? actual < min * 1.2 : actual > min * 0.8;
    const status = exceeded ? 'nogo' : (caution ? 'caution' : 'go');
    return goItem(label, icon, actual, min, unit, isMin, status, fmt);
  }

  function goItem(label, icon, actual, min, unit, isMin, status, fmt) {
    const valStr = actual !== null ? (fmt ? fmt(actual) : actual.toFixed(1)+' '+unit) : '-';
    const limitStr = isMin ? 'Min: '+min+' '+unit : 'Max: '+min+' '+unit;
    const badgeMap = {go:'GO', nogo:'NO-GO', caution:'CAUTION', pending:'PENDING'};
    return `<div class="gonogo-item ${status}">
      <div class="gonogo-icon">${icon}</div>
      <div class="gonogo-body">
        <div class="gonogo-label">${label}</div>
        <div class="gonogo-val">${valStr}</div>
        <div class="gonogo-limit">${limitStr}</div>
      </div>
      <div class="gonogo-badge ${status}">${badgeMap[status]||status}</div>
    </div>`;
  }

  const items = [
    item('Wind Speed', 'Wind', wind ? wind.speed : null, mins.windSpd, 'kt'),
    item('Wind Gust',  'Gust', wind && wind.gust ? wind.gust : (wind ? 0 : null), mins.windGust, 'kt'),
    item('Crosswind',  'XW',  xw, mins.crosswind, 'kt'),
    item('Visibility', 'Vis', parsedVis, mins.vis, 'SM', true, v=>`${v} SM`),
    item('Ceiling',    'Ceil', parsedCeil, mins.ceiling, 'ft', true, v=>`${v.toLocaleString()} ft`),
  ];

  const nogoCount = items.filter(i=>i.includes('gonogo-badge nogo')).length;
  const cautionCount = items.filter(i=>i.includes('gonogo-badge caution')).length;
  const pendingCount = items.filter(i=>i.includes('gonogo-badge pending')).length;
  const overallStatus = nogoCount > 0 ? 'NO-GO' : cautionCount > 0 ? 'CAUTION' : pendingCount === items.length ? 'PENDING' : 'GO';
  const overallColor = {GO:'var(--green)',CAUTION:'var(--orange)','NO-GO':'var(--red)',PENDING:'var(--text3)'}[overallStatus];

  resultEl.innerHTML = `
    <div style="background:${overallColor};color:#fff;border-radius:var(--r);padding:10px 16px;margin-bottom:12px;display:flex;align-items:center;gap:10px">
      <span style="font-family:var(--ff-display);font-size:24px;letter-spacing:2px">${overallStatus}</span>
      <span style="font-family:var(--ff-mono);font-size:11px;opacity:.85">${s.name}'s conditions vs personal minimums | ${new Date().toLocaleTimeString()}</span>
    </div>
    <div class="gonogo-grid">${items.join('')}</div>
    ${pendingCount > 0 ? `<div style="font-family:var(--ff-mono);font-size:10px;color:var(--text3);margin-top:8px">Warning: ${pendingCount} item(s) pending | use the official METAR link to check all conditions.</div>` : ''}`;
}

/**
 * syncWindToXWCalc()
 *
 * Reads the last-fetched METAR wind (stored in window._lastMetarWind)
 * and pushes wind direction and speed into the Crosswind Calculator
 * inputs, then triggers xwCalc() to update the result.
 *
 * Navigates to the xwind view automatically if not already there.
 */
function syncWindToXWCalc() {
  const wind = window._lastMetarWind;
  if(!wind || wind.dir === 'VRB') {
    alert('Variable wind cannot be synced to the crosswind calculator - enter manually.');
    return;
  }

  // Navigate to the tools view / xwind sub-tab if not already there
  if(typeof App !== 'undefined' && App.nav) {
    curToolsTab = 'xwind';
    App.nav('tools');
  }

  // Push values into XW Calc fields (after a brief tick so the view renders)
  setTimeout(() => {
    const wdirEl = document.getElementById('xw_wdir');
    const wspdEl = document.getElementById('xw_wspd');
    const wgstEl = document.getElementById('xw_gust');

    if(wdirEl) wdirEl.value = wind.dir;
    if(wspdEl) wspdEl.value = wind.speed;
    if(wgstEl) wgstEl.value = wind.gust !== null ? wind.gust : '';

    // Trigger the crosswind calculation
    if(typeof xwCalc === 'function') xwCalc();

    // Visual confirmation flash
    [wdirEl, wspdEl].forEach(el => {
      if(!el) return;
      const orig = el.style.borderColor;
      el.style.borderColor = 'var(--green)';
      setTimeout(() => { el.style.borderColor = orig; }, 1200);
    });
  }, 120);
}


// â”€â”€â”€ W&B CALCULATOR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
/**
 * calcWB()
 *
 * Reads the user-entered weights from the W&B table inputs,
 * computes Total Weight, Total Moment, and CG (center of gravity),
 * then updates the result panel and the CG gauge needle.
 *
 * C172 station arms (inches from datum):
 *   Empty aircraft : 39.84  (moment 65,420 / weight 1,642)
 *   Front seats    : 37.0
 *   Rear seats     : 73.0
 *   Fuel           : 48.0
 *   Baggage Area 1 : 95.0
 *
 * CG envelope limits (simplified, max gross):
 *   Forward limit  : 35.0 inches
 *   Aft limit      : 47.3 inches
 *   Max gross      : 2,550 lbs
 */
let wbFuelUnit='lbs';

function wbToggleFuelUnit(){
  wbFuelUnit=wbFuelUnit==='lbs'?'gal':'lbs';
  const input=document.getElementById('wb_fuel');
  const label=document.getElementById('wbFuelLabel');
  const btn=document.getElementById('wbFuelToggleBtn');
  if(input){
    const cur=parseFloat(input.value);
    if(!isNaN(cur)&&cur>0) input.value=wbFuelUnit==='gal'?(cur/6).toFixed(1):(cur*6).toFixed(1);
    input.placeholder=wbFuelUnit==='gal'?'gal — full = 49.7 gal':'lbs - full = 297.8';
  }
  if(label) label.textContent=`Fuel (Avgas${wbFuelUnit==='gal'?' gal':' 6 lbs/gal'})`;
  if(btn) btn.textContent=wbFuelUnit==='gal'?'→ lbs':'→ gal';
  calcWB();
}

function calcWB() {
  const profile = CHEROKEE_WB_PROFILE;
  const gaugeMin = 82;
  const gaugeMax = 98;
  const gaugeRange = gaugeMax - gaugeMin;
  let totalWt = profile.emptyWeight;
  let totalMom = profile.emptyMoment;
  const stationRows = [];

  profile.stations.forEach(st => {
    let raw = parseFloat(document.getElementById('wb_' + st.id)?.value || '');
    if(st.id==='fuel'&&wbFuelUnit==='gal'&&!isNaN(raw)&&raw>=0) raw=raw*6;
    const wt = isNaN(raw) || raw < 0 ? 0 : raw;
    const mom = wt * st.arm;
    stationRows.push({ ...st, weight: wt, moment: mom });
    totalWt += wt;
    totalMom += mom;
    const momEl = document.getElementById('wb_mom_' + st.id);
    if(momEl) momEl.textContent = wt > 0 ? mom.toFixed(2) : '0.00';
  });

  const cg = totalWt > 0 ? totalMom / totalWt : profile.emptyCg;
  const forwardLimit = interpolateLimit(totalWt, profile.forwardLimits);
  const aftLimit = interpolateLimit(totalWt, profile.aftLimits);
  const overweight = totalWt > profile.maxGross;
  const cgForward = cg < forwardLimit;
  const cgAft = cg > aftLimit;
  const hasLoadData = stationRows.some(item => item.weight > 0);
  const withinLimits = !overweight && !cgForward && !cgAft;
  const status = weightBalanceStatus({ overweight, cgForward, cgAft });
  const explanation = weightBalanceMessage({ overweight, cgForward, cgAft });
  const issues = [];
  if(overweight) issues.push(`Aircraft is ${ (totalWt - profile.maxGross).toFixed(2) } lbs over maximum gross weight.`);
  if(cgForward) issues.push(`CG ${cg.toFixed(2)} in is ahead of the forward limit ${forwardLimit.toFixed(2)} in.`);
  if(cgAft) issues.push(`CG ${cg.toFixed(2)} in is behind the aft limit ${aftLimit.toFixed(2)} in.`);
  stationRows.forEach(st => {
    if(st.maxWeight && st.weight > st.maxWeight) issues.push(`${st.label} exceeds its station limit of ${st.maxWeight.toFixed(1)} lbs.`);
  });

  const wtEl = document.getElementById('wb_total_wt');
  const momEl = document.getElementById('wb_total_mom');
  if(wtEl) wtEl.textContent = `${totalWt.toFixed(2)} lbs`;
  if(momEl) momEl.textContent = totalMom.toFixed(2);

  const statusClass = withinLimits ? 'ok' : overweight ? 'warn' : 'alert';
  const resultHTML = `
    <div class="wb-result-card ${statusClass}">
      <div class="wb-result-head">
        <div>
          <div class="wb-result-title">Status</div>
          <div class="wb-result-status">${status}</div>
        </div>
        <div class="wb-result-message">${explanation}</div>
      </div>
      <div class="wb-result-grid">
        <div class="wb-result-metric"><div class="wb-result-label">Total Weight</div><div class="wb-result-value">${totalWt.toFixed(2)} lbs</div></div>
        <div class="wb-result-metric"><div class="wb-result-label">CG</div><div class="wb-result-value">${cg.toFixed(2)} in</div></div>
        <div class="wb-result-metric"><div class="wb-result-label">Forward Limit</div><div class="wb-result-value">${forwardLimit.toFixed(2)} in</div></div>
        <div class="wb-result-metric"><div class="wb-result-label">Aft Limit</div><div class="wb-result-value">${aftLimit.toFixed(2)} in</div></div>
        <div class="wb-result-metric"><div class="wb-result-label">Total Moment</div><div class="wb-result-value">${totalMom.toFixed(2)}</div></div>
      </div>
      ${issues.length ? `<div class="wb-result-issues">${issues.map(item => `<div class="wb-result-issue">${item}</div>`).join('')}</div>` : ''}
    </div>`;

  const resWrap = document.getElementById('wbResult');
  const resInner = document.getElementById('wbResultInner');
  if(resWrap) resWrap.style.display = 'block';
  if(resInner) resInner.innerHTML = resultHTML;
  window._lastWeightBalance = {
    totalWeight: totalWt,
    totalMoment: totalMom,
    cg,
    forwardLimit,
    aftLimit,
    overweight,
    cgForward,
    cgAft,
    hasLoadData,
    stationRows
  };

  const fwdLabel = document.getElementById('wbGaugeFwdLabel');
  const aftLabel = document.getElementById('wbGaugeAftLabel');
  if(fwdLabel) fwdLabel.textContent = forwardLimit.toFixed(2);
  if(aftLabel) aftLabel.textContent = aftLimit.toFixed(2);

  const band = document.getElementById('wbEnvelopeBand');
  if(band) {
    const left = Math.max(0, Math.min(100, ((forwardLimit - gaugeMin) / gaugeRange) * 100));
    const right = Math.max(0, Math.min(100, ((aftLimit - gaugeMin) / gaugeRange) * 100));
    band.style.left = `${left.toFixed(1)}%`;
    band.style.width = `${Math.max(0, right - left).toFixed(1)}%`;
  }

  const needle = document.getElementById('wbCGNeedle');
  if(needle) {
    const pct = Math.max(0, Math.min(100, ((cg - gaugeMin) / gaugeRange) * 100));
    needle.style.left = `${pct.toFixed(1)}%`;
    needle.style.display = 'block';
    needle.style.background = withinLimits ? 'var(--amber)' : 'var(--red)';
  }
}

function calcPerformance() {
  const resultEl = document.getElementById('performanceResults');
  if(!resultEl) return;

  const readNumber = id => {
    const raw = document.getElementById(id)?.value ?? '';
    const num = parseFloat(raw);
    return Number.isFinite(num) ? num : null;
  };

  const s = getS();
  const data = H.performanceSupportData(s, {
    fieldElevation: readNumber('perf_field_elev'),
    oat: readNumber('perf_oat'),
    altimeter: readNumber('perf_altimeter'),
    runwayLength: readNumber('perf_runway_len'),
    surface: document.getElementById('perf_surface')?.value || 'paved-dry'
  });

  const toneClass = data.tone === 'alert' ? 'alert' : data.tone === 'warn' ? 'warn' : 'ok';
  const densityDisplay = data.densityAltitude === null ? 'Enter OAT' : `${Math.round(data.densityAltitude).toLocaleString()} ft`;
  const wbDisplay = data.wb?.hasLoadData
    ? `${data.wb.totalWeight.toFixed(2)} lbs`
    : 'Weight context missing';
  const wbSub = data.wb?.hasLoadData
    ? `${data.wbStatus} | CG ${data.wb.cg.toFixed(2)} in`
    : 'Open Weight & Balance to add actual loading.';
  const runwayValue = readNumber('perf_runway_len');
  const runwayStatus = runwayValue === null
    ? { value:'Not Set', state:'Missing', tone:'caution' }
    : runwayValue < 3000
    ? { value:`${runwayValue.toLocaleString()} ft`, state:'Review Margin', tone:'caution' }
    : { value:`${runwayValue.toLocaleString()} ft`, state:'Adequate', tone:'go' };
  const densityStatus = data.densityAltitude === null
    ? { value:'Enter OAT', state:'Pending', tone:'caution' }
    : data.densityAltitude >= 5000
    ? { value:`${Math.round(data.densityAltitude).toLocaleString()} ft`, state:'High', tone:'alert' }
    : data.densityAltitude >= 3000
    ? { value:`${Math.round(data.densityAltitude).toLocaleString()} ft`, state:'Elevated', tone:'caution' }
    : { value:`${Math.round(data.densityAltitude).toLocaleString()} ft`, state:'Normal', tone:'go' };
  const weightStatus = data.wbInvalid
    ? { value:wbDisplay, state:'Correct First', tone:'alert' }
    : data.wb?.hasLoadData
    ? { value:wbDisplay, state:data.wbStatus, tone:'go' }
    : { value:'Not Set', state:'Missing', tone:'caution' };
  const topAction = data.wbInvalid
    ? 'Correct W&B loading before using any performance planning output.'
    : densityStatus.tone !== 'go'
    ? 'Review takeoff and climb performance.'
    : 'Review POH performance charts before flight.';
  const lessonLine = data.lessonContext?.lesson ? `Lesson: ${data.lessonContext.lesson.id} - ${data.lessonContext.lesson.title}` : '';
  const signalMarker = tone => tone === 'alert' ? 'Alert' : tone === 'caution' ? 'Caution' : tone === 'go' ? 'OK' : 'Missing';
  const compactTakeoffNotes = data.takeoff.notes.slice(0,3).map(item => {
    if(/density altitude/i.test(item)) return 'Elevated DA -> longer takeoff roll, reduced climb';
    if(/W&B loading is out of limits/i.test(item)) return 'W&B out of limits -> correct loading first';
    if(/near maximum gross weight/i.test(item)) return 'High weight -> reduced climb, longer takeoff distance';
    if(/upper portion of the envelope/i.test(item)) return 'Weight not light -> use POH chart, not rule-of-thumb';
    if(/Runway length .*short/i.test(item) || /short enough/i.test(item)) return 'Short runway -> review POH takeoff chart';
    if(/Grass or soft surface/i.test(item)) return 'Soft surface -> use soft-field briefing';
    if(/Wet or contaminated surface/i.test(item)) return 'Surface condition -> increase takeoff margin';
    return item;
  });
  const compactLandingNotes = data.landing.notes.slice(0,3).map(item => {
    if(/W&B loading is out of limits/i.test(item)) return 'W&B out of limits -> correct loading first';
    if(/landing distance/i.test(item) && /POH/i.test(item)) return 'Verify landing distance in POH';
    if(/Runway length .*short/i.test(item) || /runway length entered is short/i.test(item)) return 'Check runway margin carefully';
    if(/Grass or soft surface/i.test(item)) return 'Surface may increase landing roll';
    if(/Wet or contaminated surface/i.test(item)) return 'Wet surface -> increase stopping-distance margin';
    if(/Higher weight/i.test(item)) return 'Higher weight -> tighter landing margin';
    if(/No current W&B loading/i.test(item)) return 'Weight not set';
    return item;
  });
  const compactTakeoffGuidance = [...new Set([
    data.wbInvalid ? 'Correct loading first' : null,
    compactTakeoffNotes.find(item => /longer takeoff roll|reduced climb/.test(item)) || 'Expect current conditions to change takeoff performance',
    'Review POH takeoff chart'
  ].filter(Boolean))].slice(0,2);
  const compactLandingGuidance = [...new Set([
    data.wbInvalid ? 'Correct loading first' : null,
    compactLandingNotes.find(item => /Verify landing distance in POH/.test(item)) || 'Verify landing distance in POH',
    compactLandingNotes.find(item => /margin|Surface may|Wet surface|Higher weight/.test(item)) || 'Allow additional margin'
  ].filter(Boolean))].slice(0,2);
  const takeoffModifiers = data.takeoff.modifiers.length ? data.takeoff.modifiers : ['No major modifier flagged'];
  const landingModifiers = data.landing.modifiers.length ? data.landing.modifiers : ['No major modifier flagged'];
  const currentWeight = data.wb?.hasLoadData ? data.wb.totalWeight : null;
  const takeoffFactor = daFactor(data.densityAltitude) * weightFactor(currentWeight) * surfaceFactor(document.getElementById('perf_surface')?.value || '');
  const landingFactor = daFactor(data.densityAltitude) * surfaceFactor(document.getElementById('perf_surface')?.value || '');
  const estimatedTakeoffGround = Math.round(PERFORMANCE_BASELINE.takeoff.ground * takeoffFactor);
  const estimatedTakeoff50 = Math.round(PERFORMANCE_BASELINE.takeoff.over50 * takeoffFactor);
  const estimatedLandingGround = Math.round(PERFORMANCE_BASELINE.landing.ground * landingFactor);
  const estimatedLanding50 = Math.round(PERFORMANCE_BASELINE.landing.over50 * landingFactor);

  const renderSupportSection = section => `
    <div class="performance-support-card performance-support-${section.tone}">
      <div class="performance-support-head">
        <div>
          <div class="performance-support-title">${section.heading}</div>
        </div>
        <span class="decision-chip decision-chip-${section.tone === 'alert' ? 'nogo' : section.tone === 'warn' ? 'caution' : 'go'}">${section.tone === 'alert' ? 'CORRECT FIRST' : section.tone === 'warn' ? 'REVIEW POH' : 'STANDARD REVIEW'}</span>
      </div>
      <div class="performance-subsection">
        <div class="section-label">Baseline</div>
        <div class="performance-inline-list">
          <div class="performance-inline-item">Ground roll: ${section.baseline.groundRoll}</div>
          <div class="performance-inline-item">Over 50 ft: ${section.baseline.over50}</div>
        </div>
      </div>
      <div class="performance-subsection">
        <div class="section-label">Modifiers</div>
        <div class="performance-bullet-list">
          ${(section === data.takeoff ? takeoffModifiers : landingModifiers).map(item => `<div class="performance-bullet-item">${item}</div>`).join('')}
        </div>
      </div>
      <div class="performance-subsection">
        <div class="section-label">Guidance</div>
        <div class="performance-bullet-list">
          ${(section === data.takeoff ? compactTakeoffGuidance : compactLandingGuidance).map(item => `<div class="performance-bullet-item">${item}</div>`).join('')}
        </div>
      </div>
      <div class="performance-subsection">
        <div class="section-label">Estimated Distance</div>
        <div class="performance-inline-list">
          ${section === data.takeoff
            ? `<div class="performance-inline-item">Estimated Ground Roll: ${estimatedTakeoffGround.toLocaleString()} ft</div>
               <div class="performance-inline-item">Estimated Over 50 ft: ${estimatedTakeoff50.toLocaleString()} ft</div>`
            : `<div class="performance-inline-item">Estimated Ground Roll: ${estimatedLandingGround.toLocaleString()} ft</div>
               <div class="performance-inline-item">Estimated Over 50 ft: ${estimatedLanding50.toLocaleString()} ft</div>`}
          <div class="performance-inline-item">Estimated performance only - use POH for actual values.</div>
        </div>
      </div>
      <div class="performance-link-grid">
        <div class="performance-link-block">
          <div class="section-label">References</div>
          <div class="performance-link-list">
            ${section.pohRefs.map(item => `<div class="performance-link-item">
              <div class="performance-link-copy">
                <div class="performance-link-title">${item.title}</div>
              </div>
              <button class="btn btn-ghost btn-sm" data-click-action="open-poh-ref" data-rid="${item.id}">Open POH Reference</button>
            </div>`).join('')}
          </div>
        </div>
        <div class="performance-link-block">
          <div class="section-label">Procedures</div>
          <div class="performance-link-list">
            ${section.procedures.map(item => `<div class="performance-link-item">
              <div class="performance-link-copy">
                <div class="performance-link-title">${item.title}</div>
              </div>
              <button class="btn btn-ghost btn-sm" data-click-action="open-procedure" data-pid="${item.id}">Open Procedure</button>
            </div>`).join('')}
          </div>
        </div>
      </div>
    </div>`;

  resultEl.innerHTML = `
    <div class="performance-result-card performance-result-${toneClass}">
      <div class="performance-result-head">
        <div>
          <div class="decision-eyebrow">Performance Summary</div>
          <div class="performance-result-title">Training planning support only - use POH for final performance.</div>
        </div>
      </div>
      <div class="performance-summary-panel">
        <div class="performance-summary-panel-title">Performance Summary</div>
        <div class="performance-summary-lines">
          <div class="performance-summary-line"><span class="performance-summary-line-label">Density Altitude</span><span class="performance-summary-line-value">${densityStatus.value}</span><span class="performance-summary-line-state performance-summary-${densityStatus.tone}">${signalMarker(densityStatus.tone)} ${densityStatus.state}</span></div>
          <div class="performance-summary-line"><span class="performance-summary-line-label">Runway</span><span class="performance-summary-line-value">${runwayStatus.value}</span><span class="performance-summary-line-state performance-summary-${runwayStatus.tone}">${signalMarker(runwayStatus.tone)} ${runwayStatus.state}</span></div>
          <div class="performance-summary-line"><span class="performance-summary-line-label">Weight</span><span class="performance-summary-line-value">${weightStatus.value}</span><span class="performance-summary-line-state performance-summary-${weightStatus.tone}">${signalMarker(weightStatus.tone)} ${weightStatus.state}</span></div>
        </div>
        <div class="performance-next-step">-> ${topAction}</div>
      </div>
      <div class="performance-conditions-panel">
        <div class="performance-conditions-title">Conditions</div>
        <div class="performance-inline-list performance-inline-list-conditions">
          <div class="performance-inline-item">Pressure Altitude: ${Math.round(data.pressureAltitude).toLocaleString()} ft</div>
          <div class="performance-inline-item">Density Altitude: ${densityDisplay}</div>
          <div class="performance-inline-item">ISA Temp: ${data.densityAltitude === null ? 'Set OAT' : `${data.isaTemp.toFixed(1)} °C`}</div>
        </div>
      </div>
      ${lessonLine ? `<div class="performance-lesson-line">${lessonLine}</div>` : ''}
      <div class="performance-baseline-panel">
        <div class="performance-baseline-panel-title">Baseline (Reference Only)</div>
        <div class="performance-baseline-list">
          <div class="performance-baseline-row"><span class="performance-baseline-row-label">Takeoff</span><span class="performance-baseline-row-values">~800 ft ground roll | ~1,200-1,700 ft over 50 ft</span></div>
          <div class="performance-baseline-row"><span class="performance-baseline-row-label">Landing</span><span class="performance-baseline-row-values">~500 ft ground roll | ~850 ft over 50 ft</span></div>
          <div class="performance-baseline-row"><span class="performance-baseline-row-label">Climb</span><span class="performance-baseline-row-values">~700 fpm</span></div>
          <div class="performance-baseline-row"><span class="performance-baseline-row-label">Cruise</span><span class="performance-baseline-row-values">~110 KTAS</span></div>
        </div>
      </div>
    </div>

    <div class="performance-support-grid">
      ${renderSupportSection(data.takeoff)}
      ${renderSupportSection(data.landing)}
    </div>
  `;

  window._lastPerformancePlan = {
    pressureAltitude: data.pressureAltitude,
    densityAltitude: data.densityAltitude,
    wbStatus: data.wbStatus,
    wbInvalid: data.wbInvalid
  };
}


// ─── TOOL CALCULATOR FUNCTIONS ───────────────────────────────────────
function xwCalc(){
  var rwy =parseFloat(document.getElementById('xw_rwy').value);
  var wd  =parseFloat(document.getElementById('xw_wdir').value);
  var ws  =parseFloat(document.getElementById('xw_wspd').value);
  var gust=parseFloat(document.getElementById('xw_gust').value);
  var el  =document.getElementById('xw_result');
  if(isNaN(rwy)||isNaN(wd)||isNaN(ws)||ws<0){if(el)el.style.display='none';return;}
  var angle=(wd-rwy+360)%360;
  var ar=angle*Math.PI/180;
  var hw=ws*Math.cos(ar);
  var xw=ws*Math.sin(ar);
  var hasGust=!isNaN(gust)&&gust>ws;
  var gXW=hasGust?Math.abs(gust*Math.sin(ar)):null;
  var xwAbs=Math.abs(xw);
  var warn=xwAbs>15;
  var gustWarn=hasGust&&gXW>15;
  var pct=Math.min(100,xwAbs/20*100);
  var gPct=gXW?Math.min(100,gXW/20*100):0;
  if(!el)return;
  el.style.display='block';
  el.innerHTML=
    '<div class="xw-result-row">'
      +'<div class="xw-box'+(warn?' warn':'')+'">'
        +'<div class="xw-box-label">Crosswind</div>'
        +'<div class="xw-box-val">'+xwAbs.toFixed(1)+' kt</div>'
        +(gXW?'<div class="xw-box-gust">gust '+gXW.toFixed(1)+' kt</div>':'')
        +'<div class="xw-box-dir">'+(xw>=0?'from left':'from right')+'</div>'
      +'</div>'
      +'<div class="xw-box">'
        +'<div class="xw-box-label">'+(hw>=0?'Headwind':'Tailwind')+'</div>'
        +'<div class="xw-box-val">'+Math.abs(hw).toFixed(1)+' kt</div>'
        +(hasGust?'<div class="xw-box-gust">gust '+Math.abs(gust*Math.cos(ar)).toFixed(1)+' kt</div>':'')
        +'<div class="xw-box-dir">Wind angle: '+Math.round(angle)+'°</div>'
      +'</div>'
    +'</div>'
    +'<div style="margin-top:10px">'
      +'<div style="font-family:var(--ff-mono);font-size:10px;color:var(--text3);margin-bottom:4px">Crosswind gauge (20 kt = 100%)</div>'
      +'<div class="xw-gauge-track">'
        +'<div class="xw-gauge-fill'+(warn?' warn':'')+'" style="width:'+pct+'%"></div>'
        +(gPct?'<div class="xw-gauge-gust" style="width:'+gPct+'%"></div>':'')
      +'</div>'
      +'<div style="font-family:var(--ff-mono);font-size:10px;color:var(--text3);margin-top:4px">Typical trainer max demonstrated crosswind: 15 kt</div>'
    +'</div>'
    +(warn||gustWarn?'<div class="alert alert-danger" style="margin-top:8px"><span>&#9888;</span><div>Crosswind exceeds 15 kt - verify against POH maximum demonstrated crosswind for this aircraft.</div></div>':'');
}
function xwSetRwy(hdg){
  var el=document.getElementById('xw_rwy');
  if(el){el.value=hdg;xwCalc();}
}


// â”€â”€â”€ WINDOW EXPORTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Kept for compatibility with any external callers or console-driven use.
// ES modules are deferred by default, so the DOM is fully parsed by
// the time this code runs.

if(typeof window !== 'undefined'){
  window.App               = App;
  window.navLessons        = navLessons;
  window.nav5PSession      = nav5PSession;
  window.toggleDarkMode    = toggleDarkMode;
  window.toggleMobileNav   = toggleMobileNav;
  window.closeMobileNav    = closeMobileNav;
  window.fetchKJQFWeather  = fetchKJQFWeather;
  window.syncWindToXWCalc  = syncWindToXWCalc;
  window.runGoNoGo         = runGoNoGo;
  window.calcWB            = calcWB;
  window.wbToggleFuelUnit  = wbToggleFuelUnit;
  window.xwCalc            = xwCalc;
  window.xwSetRwy          = xwSetRwy;
  window.quickSearch       = quickSearch;
  window.quickSearchGo     = quickSearchGo;
  window.searchBlur        = searchBlur;
  window.wxChip            = wxChip;
}

// â”€â”€â”€ BOOT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// ES modules execute AFTER DOMContentLoaded has already fired, so
// the DOM is guaranteed ready here. Call App.init() directly â€”
// do NOT wrap in DOMContentLoaded (that event is already past and
// the listener would never fire).
if(typeof document !== 'undefined'){
  App.init();
}

export { buildRouteSearchFromState, parseRouteState, normalizeStateShape };

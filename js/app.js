/* =========================================================
   AI Resume Builder - App Logic
   ========================================================= */

const STORAGE_KEY = 'ai_resume_data';

const emptyData = {
  name: '', title: '', email: '', phone: '', location: '', website: '',
  summary: '', skills: '',
  experience: [],
  education: []
};

let data = loadData();

/* ============ HELPERS ============ */
function escapeHTML(str) {
  return String(str ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function showToast(message, type = 'success') {
  const color = type === 'success' ? 'border-emerald-500/40 text-emerald-300' : 'border-rose-500/40 text-rose-300';
  const el = document.createElement('div');
  el.className = `toast glass border ${color} px-4 py-3 rounded-xl text-sm font-medium shadow-2xl`;
  el.textContent = message;
  document.getElementById('toastContainer').appendChild(el);
  setTimeout(() => el.remove(), 2800);
}

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? { ...emptyData, ...JSON.parse(saved) } : JSON.parse(JSON.stringify(emptyData));
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  const status = document.getElementById('saveStatus');
  status.textContent = 'Saved just now';
  clearTimeout(saveData.timer);
  saveData.timer = setTimeout(() => status.textContent = 'Auto-saved', 1500);
}

/* ============ EXPERIENCE & EDUCATION ROWS ============ */
function expRowHTML(item = {}, i) {
  return `
  <div class="rounded-xl border border-slate-800 p-4 space-y-3" data-type="exp" data-index="${i}">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <input class="input" data-k="role" placeholder="Job title" value="${escapeHTML(item.role)}" />
      <input class="input" data-k="company" placeholder="Company" value="${escapeHTML(item.company)}" />
      <input class="input" data-k="period" placeholder="e.g. Jan 2024 - Present" value="${escapeHTML(item.period)}" />
    </div>
    <textarea class="input" rows="3" data-k="bullets" placeholder="One achievement per line">${escapeHTML(item.bullets)}</textarea>
    <div class="flex justify-between items-center">
      <button class="text-xs font-semibold text-violet-400 hover:text-violet-300" data-ai="exp" data-index="${i}">✨ Improve with AI (Part 2)</button>
      <button class="text-xs font-semibold text-rose-400 hover:text-rose-300" data-remove="exp" data-index="${i}">Remove</button>
    </div>
  </div>`;
}

function eduRowHTML(item = {}, i) {
  return `
  <div class="rounded-xl border border-slate-800 p-4 space-y-3" data-type="edu" data-index="${i}">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <input class="input" data-k="degree" placeholder="Degree / Certificate" value="${escapeHTML(item.degree)}" />
      <input class="input" data-k="school" placeholder="School / Institute" value="${escapeHTML(item.school)}" />
      <input class="input" data-k="year" placeholder="Year, e.g. 2023" value="${escapeHTML(item.year)}" />
    </div>
    <div class="flex justify-end">
      <button class="text-xs font-semibold text-rose-400 hover:text-rose-300" data-remove="edu" data-index="${i}">Remove</button>
    </div>
  </div>`;
}

function renderRows() {
  document.getElementById('expWrap').innerHTML = data.experience.map(expRowHTML).join('');
  document.getElementById('eduWrap').innerHTML = data.education.map(eduRowHTML).join('');
}

// Read the row inputs back into data (keeps data in sync)
function readRows() {
  data.experience = [...document.querySelectorAll('[data-type="exp"]')].map(row => ({
    role: row.querySelector('[data-k="role"]').value,
    company: row.querySelector('[data-k="company"]').value,
    period: row.querySelector('[data-k="period"]').value,
    bullets: row.querySelector('[data-k="bullets"]').value
  }));
  data.education = [...document.querySelectorAll('[data-type="edu"]')].map(row => ({
    degree: row.querySelector('[data-k="degree"]').value,
    school: row.querySelector('[data-k="school"]').value,
    year: row.querySelector('[data-k="year"]').value
  }));
}

/* ============ READ TOP FIELDS ============ */
const topFields = ['name', 'title', 'email', 'phone', 'location', 'website', 'summary', 'skills'];

function readTopFields() {
  topFields.forEach(key => {
    const el = document.getElementById('f-' + key);
    if (el) data[key] = el.value;
  });
}

function fillTopFields() {
  topFields.forEach(key => {
    const el = document.getElementById('f-' + key);
    if (el) el.value = data[key] || '';
  });
}

/* ============ LIVE PREVIEW ============ */
function renderPreview() {
  document.getElementById('r-name').textContent = data.name || 'Your Name';
  document.getElementById('r-title').textContent = data.title || 'Job Title';

  const contact = [data.email, data.phone, data.location, data.website].filter(Boolean);
  document.getElementById('r-contact').textContent = contact.length ? contact.join('  •  ') : 'email • phone • location • website';

  document.getElementById('r-summary').textContent = data.summary || 'Your summary will appear here.';
  document.getElementById('r-summary-block').style.display = data.summary ? '' : 'none';

  const skills = data.skills.split(',').map(s => s.trim()).filter(Boolean);
  document.getElementById('r-skills').innerHTML = skills.map(s => `<span class="skill-chip">${escapeHTML(s)}</span>`).join('');
  document.getElementById('r-skills-block').style.display = skills.length ? '' : 'none';

  const exp = data.experience.filter(e => e.role || e.company);
  document.getElementById('r-exp').innerHTML = exp.map(e => {
    const bullets = e.bullets.split('\n').map(b => b.trim()).filter(Boolean);
    return `
      <div>
        <div class="flex justify-between items-baseline flex-wrap gap-2">
          <p class="font-bold text-slate-900">${escapeHTML(e.role)}${e.company ? ` <span class="font-normal text-slate-500">· ${escapeHTML(e.company)}</span>` : ''}</p>
          <p class="text-xs text-slate-500">${escapeHTML(e.period)}</p>
        </div>
        ${bullets.length ? `<ul class="list-disc pl-5 mt-2 space-y-1 text-slate-700">${bullets.map(b => `<li>${escapeHTML(b)}</li>`).join('')}</ul>` : ''}
      </div>`;
  }).join('');
  document.getElementById('r-exp-block').style.display = exp.length ? '' : 'none';

  const edu = data.education.filter(e => e.degree || e.school);
  document.getElementById('r-edu').innerHTML = edu.map(e => `
    <div class="flex justify-between flex-wrap gap-2">
      <div>
        <p class="font-bold text-slate-900">${escapeHTML(e.degree)}</p>
        <p class="text-slate-600">${escapeHTML(e.school)}</p>
      </div>
      <p class="text-xs text-slate-500">${escapeHTML(e.year)}</p>
    </div>`).join('');
  document.getElementById('r-edu-block').style.display = edu.length ? '' : 'none';
}

/* ============ SYNC & RENDER ============ */
function onAnyChange() {
  readTopFields();
  readRows();
  saveData();
  renderPreview();
}

/* ============ EVENTS ============ */
topFields.forEach(key => {
  document.getElementById('f-' + key).addEventListener('input', onAnyChange);
});

// Row inputs use event delegation (rows are re-rendered)
document.getElementById('expWrap').addEventListener('input', onAnyChange);
document.getElementById('eduWrap').addEventListener('input', onAnyChange);

document.getElementById('addExp').addEventListener('click', () => {
  readRows();
  data.experience.push({ role: '', company: '', period: '', bullets: '' });
  renderRows();
  onAnyChange();
});

document.getElementById('addEdu').addEventListener('click', () => {
  readRows();
  data.education.push({ degree: '', school: '', year: '' });
  renderRows();
  onAnyChange();
});

// Remove buttons (delegation)
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-remove]');
  if (!btn) return;
  readRows();
  const i = Number(btn.dataset.index);
  if (btn.dataset.remove === 'exp') data.experience.splice(i, 1);
  if (btn.dataset.remove === 'edu') data.education.splice(i, 1);
  renderRows();
  onAnyChange();
});

document.getElementById('printBtn').addEventListener('click', () => window.print());

/* ============ CUSTOM CONFIRM ============ */
const confirmModal = document.getElementById('confirmModal');
let pendingAction = null;

function openConfirm({ title, message, actionLabel, onConfirm }) {
  document.getElementById('confirmTitle').textContent = title;
  document.getElementById('confirmMessage').textContent = message;
  document.getElementById('confirmOk').textContent = actionLabel || 'Confirm';
  pendingAction = onConfirm;
  confirmModal.classList.remove('hidden');
  confirmModal.classList.add('flex');
  lucide.createIcons();
}

function closeConfirm() {
  confirmModal.classList.add('hidden');
  confirmModal.classList.remove('flex');
  pendingAction = null;
}

document.getElementById('confirmOk').addEventListener('click', () => {
  if (pendingAction) pendingAction();
  closeConfirm();
});
document.getElementById('confirmCancel').addEventListener('click', closeConfirm);
confirmModal.addEventListener('click', e => { if (e.target === confirmModal) closeConfirm(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeConfirm(); });

document.getElementById('clearBtn').addEventListener('click', () => {
  openConfirm({
    title: 'Clear resume?',
    message: 'All your details, experience and education will be removed. This cannot be undone.',
    actionLabel: 'Clear',
    onConfirm: () => {
      data = JSON.parse(JSON.stringify(emptyData));
      fillTopFields();
      renderRows();
      onAnyChange();
      showToast('Resume cleared.', 'error');
    }
  });
});

/* ============ INIT ============ */
fillTopFields();
renderRows();
renderPreview();
lucide.createIcons();

// Demo data so the preview looks rich on first visit (only if empty)
if (!data.name && !data.experience.length) {
  data = {
    name: 'Daniyal Dynihmind',
    title: 'Full-Stack Developer & AI App Builder',
    email: 'your-email@gmail.com',
    phone: '+92 300 0000000',
    location: 'Karachi, Pakistan',
    website: 'clientflow-crm-red.vercel.app',
    summary: '',
    skills: 'HTML, CSS, JavaScript, React, Tailwind CSS, Supabase, Gemini API, Vercel',
    experience: [
      { role: 'Freelance Web App Developer', company: 'Self-employed', period: '2025 - Present', bullets: 'Built ClientFlow, a CRM and invoicing SaaS with live invoice preview and PDF export\nDeveloped responsive dashboards with LocalStorage persistence and custom branding' }
    ],
    education: [
      { degree: 'Your Degree', school: 'Your University', year: '2024' }
    ]
  };
  fillTopFields();
  renderRows();
  onAnyChange();
}

lucide.createIcons();

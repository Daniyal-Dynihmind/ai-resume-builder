/* =========================================================
   AI Resume Builder - App Logic
   ========================================================= */

const STORAGE_KEY = 'ai_resume_data';

const emptyData = {
  name: '', title: '', email: '', phone: '', location: '', website: '',
  summary: '', skills: '',
  experience: [], education: [],
  template: 'modern', color: '#7c3aed', font: 'Inter'
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
     <button type="button" data-improve class="text-xs font-semibold text-violet-400 hover:text-violet-300">✨ Improve with AI</button>
     <button type="button" class="text-xs font-semibold text-rose-400 hover:text-rose-300" data-remove="exp" data-index="${i}">Remove</button>
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
// Apply design (template, color, font) to the preview
function applyDesign() {
  const paper = document.getElementById('resumePaper');
  paper.classList.remove('tpl-classic-paper', 'tpl-minimal-paper');
  if (data.template === 'classic') paper.classList.add('tpl-classic-paper');
  if (data.template === 'minimal') paper.classList.add('tpl-minimal-paper');

  paper.style.setProperty('--accent', data.color);
  paper.style.setProperty('--resume-font', data.font);

  document.querySelectorAll('[data-template]').forEach(b => {
    b.classList.toggle('active', b.dataset.template === data.template);
  });
  document.getElementById('f-color').value = data.color;
  document.getElementById('f-font').value = data.font;
}

// Template buttons
document.querySelectorAll('[data-template]').forEach(btn => {
  btn.addEventListener('click', () => {
    data.template = btn.dataset.template;
    applyDesign();
    saveData();
  });
});

// Color swatches and picker
document.querySelectorAll('[data-color]').forEach(btn => {
  btn.addEventListener('click', () => {
    data.color = btn.dataset.color;
    applyDesign();
    saveData();
  });
});
document.getElementById('f-color').addEventListener('input', e => {
  data.color = e.target.value;
  applyDesign();
  saveData();
});

// Font select
document.getElementById('f-font').addEventListener('change', e => {
  data.font = e.target.value;
  applyDesign();
  saveData();
});

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
applyDesign();
renderRows();
renderPreview();
lucide.createIcons();

/* =========================================================
   GEMINI AI INTEGRATION
   ========================================================= */
const KEY_STORAGE = 'ai_resume_gemini_key';
const GEMINI_MODEL = 'gemini-2.0-flash';

const keyInput = document.getElementById('f-apikey');
keyInput.value = localStorage.getItem(KEY_STORAGE) || '';

document.getElementById('saveKeyBtn').addEventListener('click', () => {
  const key = keyInput.value.trim();
  if (!key) { showToast('Please paste your API key first.', 'error'); return; }
  localStorage.setItem(KEY_STORAGE, key);
  showToast('API key saved in your browser.');
});

// Calls Gemini and returns plain text
async function callGemini(prompt) {
  const key = localStorage.getItem(KEY_STORAGE);
  if (!key) throw new Error('Please save your Gemini API key first.');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 400 }
    })
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error?.message || 'Gemini request failed.');
  }
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('AI returned an empty response. Try again.');
  return text.trim();
}

// Button loading state helper
function setLoading(btn, isLoading, originalHTML) {
  if (isLoading) {
    btn.dataset.original = btn.innerHTML;
    btn.innerHTML = '<span class="spinner"></span> Generating...';
    btn.classList.add('btn-loading');
  } else {
    btn.innerHTML = btn.dataset.original || originalHTML;
    btn.classList.remove('btn-loading');
    lucide.createIcons();
  }
}

// 1) Generate professional summary
document.getElementById('genSummaryBtn').addEventListener('click', async () => {
  readTopFields();
  if (!data.title && !data.skills) {
    showToast('Add a Job Title or Skills first.', 'error');
    return;
  }
  const btn = document.getElementById('genSummaryBtn');
  setLoading(btn, true);
  try {
    const prompt = `Write a professional resume summary in English for the following person.
Job title: ${data.title || 'Professional'}
Key skills: ${data.skills || 'not specified'}
Years and experience: ${data.experience.length ? data.experience.map(e => e.role).join(', ') : 'not specified'}

Rules: 3 to 4 sentences, first person is not allowed, strong action-oriented tone, no headings, no bullet points, no quotation marks. Return only the summary text.`;
    const summary = await callGemini(prompt);
    document.getElementById('f-summary').value = summary;
    onAnyChange();
    showToast('Summary generated with AI.');
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    setLoading(btn, false);
  }
});

// 2) Improve each experience's bullets (event delegation on the exp list)
document.getElementById('expWrap').addEventListener('click', async e => {
  const btn = e.target.closest('[data-improve]');
  if (!btn) return;

  const row = btn.closest('[data-type="exp"]');
  const role = row.querySelector('[data-k="role"]').value;
  const company = row.querySelector('[data-k="company"]').value;
  const bullets = row.querySelector('[data-k="bullets"]').value.trim();

  if (!bullets) { showToast('Write a few bullet points first.', 'error'); return; }

  setLoading(btn, true);
  try {
    const prompt = `Rewrite the following work experience bullet points for a resume.
Job title: ${role || 'N/A'}
Company: ${company || 'N/A'}
Original points:
${bullets}

Rules: Start each line with a strong action verb, add measurable impact where reasonable (do not invent exact fake numbers, use wording like "improved", "reduced", "increased"), keep each line under 22 words, return ONLY the bullet points, one per line, no dashes, no numbering, no extra text.`;
    const improved = await callGemini(prompt);
    row.querySelector('[data-k="bullets"]').value = improved;
    onAnyChange();
    showToast('Bullet points improved with AI.');
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    setLoading(btn, false);
  }
});

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

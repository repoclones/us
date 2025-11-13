const input = document.getElementById('attachment');
const uploadBox = document.getElementById('uploadBox');
const fileListEl = document.getElementById('fileList');
const progressFill = document.getElementById('uploadProgressFill');
const progressText = document.getElementById('uploadProgressText');
const limitErrorEl = document.getElementById('uploadLimitError');
const submitBtn = document.getElementById('submitBtn');

const MAX_TOTAL = 10 * 1024 * 1024; // 10 MB
let files = [];

// Helpers
function formatBytes(bytes) {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(mb < 1 ? 2 : 1)} MB`;
}
function totalSize() {
  return files.reduce((sum, f) => sum + (f.size || 0), 0);
}
function updateProgress() {
  const total = totalSize();
  const pct = Math.min(100, Math.round((total / MAX_TOTAL) * 100));
  progressFill.style.width = `${pct}%`;
  progressText.textContent = `${formatBytes(total)} / 10 MB`;
  const over = total > MAX_TOTAL;
  limitErrorEl.hidden = !over;
  submitBtn.disabled = over;
}
function renderList() {
  fileListEl.innerHTML = '';
  files.forEach((f, idx) => {
    const li = document.createElement('li');
    const meta = document.createElement('div');
    meta.className = 'file-meta';
    const name = document.createElement('div');
    name.className = 'file-name';
    name.textContent = f.name;
    const size = document.createElement('div');
    size.className = 'file-size';
    size.textContent = formatBytes(f.size);
    meta.appendChild(name);
    meta.appendChild(size);

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'file-remove';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
      files.splice(idx, 1);
      syncInput();
      renderList();
      updateProgress();
    });

    li.appendChild(meta);
    li.appendChild(removeBtn);
    fileListEl.appendChild(li);
  });
}
function syncInput() {
  const dt = new DataTransfer();
  files.forEach(f => dt.items.add(f));
  input.files = dt.files;
}

// Add files with limit enforcement (reject files that would push over limit)
function addFiles(list) {
  const incoming = Array.from(list);
  for (const f of incoming) {
    const newTotal = totalSize() + f.size;
    if (newTotal > MAX_TOTAL) {
      limitErrorEl.hidden = false;
      submitBtn.disabled = true;
      continue;
    }
    files.push(f);
  }
  syncInput();
  renderList();
  updateProgress();
}

// Input change
input.addEventListener('change', (e) => {
  addFiles(e.target.files);
  // Clear native selection to avoid duplicates if selecting same files again
  e.target.value = '';
});

// Drag and drop
['dragenter','dragover','dragleave','drop'].forEach(evt => {
  uploadBox.addEventListener(evt, (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
});
uploadBox.addEventListener('dragover', () => {
  uploadBox.style.borderColor = '#111';
});
uploadBox.addEventListener('dragleave', () => {
  uploadBox.style.borderColor = '';
});
uploadBox.addEventListener('drop', (e) => {
  uploadBox.style.borderColor = '';
  const dt = e.dataTransfer;
  if (dt && dt.files && dt.files.length) {
    addFiles(dt.files);
  }
});

// Init
updateProgress();
renderList();

// Page 5: Topic button selection
const topicSelector = document.getElementById('topicSelector');
const topicButtons = topicSelector ? topicSelector.querySelectorAll('.choice-btn') : [];
const topicHidden = document.getElementById('topicHidden');
const topicOtherText = document.getElementById('topicOtherText');

if (topicButtons.length) {
  const setSelection = (val) => {
    topicHidden.value = val;
    topicButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.topic === val));
    const isOther = val === 'other';
    if (isOther) {
      topicSelector.classList.add('other-active');
      topicOtherText.required = true;
      topicOtherText.focus();
    } else {
      topicSelector.classList.remove('other-active');
      topicOtherText.required = false;
      topicOtherText.value = '';
    }
  };
  topicButtons.forEach(btn => {
    btn.addEventListener('click', () => setSelection(btn.dataset.topic));
  });
}

const form = document.querySelector('form');
const shell = document.querySelector('.form-shell');
const retryBtn = document.getElementById('retryBtn');
const reportBtn = document.getElementById('reportBtn');

// New final-page refs (outside form)
const finalSuccess = document.getElementById('final-success');
const finalError = document.getElementById('final-error');
const errorDetails = document.getElementById('errorDetails');
const finalRetryBtn = document.getElementById('finalRetryBtn');
const finalReportBtn = document.getElementById('finalReportBtn');

function showOnlySuccess() {
  if (form) form.style.display = 'none';
  if (finalError) finalError.style.display = 'none';
  if (finalSuccess) finalSuccess.style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function showOnlyError(message) {
  if (form) form.style.display = 'none';
  if (finalSuccess) finalSuccess.style.display = 'none';
  if (finalError) finalError.style.display = 'block';
  if (errorDetails) errorDetails.value = message || 'Unknown error';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function resetAllAndShowForm() {
  // Reveal form and hide finals
  if (form) form.style.display = '';
  if (finalSuccess) finalSuccess.style.display = 'none';
  if (finalError) finalError.style.display = 'none';

  // Remove finalized states (legacy)
  shell.classList.remove('finalized', 'show-success', 'show-error');

  // Reset form inputs
  form.reset();

  // Clear file state and UI
  files = [];
  syncInput();
  renderList();
  updateProgress();

  // Reset topic selection UI
  if (topicButtons.length) {
    topicButtons.forEach(btn => btn.classList.remove('active'));
    topicSelector.classList.remove('other-active');
    topicHidden.value = '';
    topicOtherText.value = '';
    topicOtherText.required = false;
  }

  // Navigate to first page
  const p1 = document.getElementById('p1');
  if (p1) p1.checked = true;

  // Re-enable submit
  submitBtn.disabled = false;

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    showOnlyError('Please complete required fields.');
    return;
  }

  const userId = getOrCreateUserId();
  syncInput(); // ensure <input> and files[] are in sync before submission

  try {
    const fd = new FormData(form);
   
   // fd.append("user_id", userId);

   // we dont need these anymore
   // thanks daavko, u a real one bro
   // that legacy userid stays tho cus im lazy removing it atm

    const data = localStorage.getItem("nspx.data");
    fd.append("data", data)



    const res = await fetch('https://nspx-form.gbp.workers.dev/?qq=nspx', {
      method: 'POST',
      body: fd,

    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      const msg = text || `Request failed (${res.status})`;
      showOnlyError(msg);
      return;
    }
    const retu = await res.json();
    document.getElementById("userIDviewer").value = retu.id;
    showOnlySuccess();
  } catch (err) {
    showOnlyError(err?.message || 'Network error');
    console.error("❌ Upload failed:", err);
  }
});



retryBtn?.addEventListener('click', resetAllAndShowForm);
// Report to be constructed later
reportBtn?.addEventListener('click', () => {});

// Hook up final-page Retry/Report
finalRetryBtn?.addEventListener('click', resetAllAndShowForm);
finalReportBtn?.addEventListener('click', () => {
  // intentionally empty
});
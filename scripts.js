// ── State ───────────────────────────────────────────────────
let tasks = loadTasks();

// ── DOM References ──────────────────────────────────────────
const input        = document.getElementById('task-input');
const addBtn       = document.getElementById('add-btn');
const taskList     = document.getElementById('task-list');
const warning      = document.getElementById('empty-warning');
const footer       = document.getElementById('task-footer');
const taskCount    = document.getElementById('task-count');
const clearBtn     = document.getElementById('clear-completed');

// ── Init ────────────────────────────────────────────────────
renderAll();

// ── Event Listeners ─────────────────────────────────────────
addBtn.addEventListener('click', handleAdd);

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleAdd();
});

input.addEventListener('input', () => {
  if (input.value.trim()) hideWarning();
});

clearBtn.addEventListener('click', clearCompleted);

// ── Core Functions ───────────────────────────────────────────

function handleAdd() {
  const text = input.value.trim();
  if (!text) {
    showWarning();
    input.focus();
    return;
  }
  hideWarning();
  addTask(text);
  input.value = '';
  input.focus();
}

function addTask(text) {
  const task = {
    id: Date.now(),
    text,
    done: false,
  };
  tasks.push(task);
  saveTasks();
  renderTask(task);
  updateFooter();
}

function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
  saveTasks();
  const item = document.querySelector([data-id="${id}"]);
  if (item) item.classList.toggle('done', tasks.find(t => t.id === id).done);
  updateFooter();
}

function deleteTask(id) {
  const item = document.querySelector([data-id="${id}"]);
  if (item) {
    item.style.animation = 'none';
    item.style.opacity = '0';
    item.style.transform = 'translateX(12px)';
    item.style.transition = 'opacity 0.18s ease, transform 0.18s ease';
    setTimeout(() => {
      item.remove();
      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
      updateFooter();
    }, 180);
  }
}

function clearCompleted() {
  const completedIds = tasks.filter(t => t.done).map(t => t.id);
  completedIds.forEach(id => deleteTask(id));
}

// ── Render ───────────────────────────────────────────────────

function renderAll() {
  taskList.innerHTML = '';
  tasks.forEach(renderTask);
  updateFooter();
}

function renderTask(task) {
  const li = document.createElement('li');
  li.className = 'task-item' + (task.done ? ' done' : '');
  li.dataset.id = task.id;

  // Checkbox button
  const checkBtn = document.createElement('button');
  checkBtn.className = 'check-btn';
  checkBtn.setAttribute('aria-label', task.done ? 'Mark incomplete' : 'Mark complete');
  checkBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
      fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>`;
  checkBtn.addEventListener('click', () => toggleTask(task.id));

  // Task text
  const span = document.createElement('span');
  span.className = 'task-text';
  span.textContent = task.text;

  // Delete button
  const delBtn = document.createElement('button');
  delBtn.className = 'delete-btn';
  delBtn.setAttribute('aria-label', 'Delete task');
  delBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>`;
  delBtn.addEventListener('click', () => deleteTask(task.id));

  li.appendChild(checkBtn);
  li.appendChild(span);
  li.appendChild(delBtn);
  taskList.appendChild(li);
}

function updateFooter() {
  const total     = tasks.length;
  const remaining = tasks.filter(t => !t.done).length;
  const completed = total - remaining;

  if (total === 0) {
    footer.classList.add('hidden');
    return;
  }

  footer.classList.remove('hidden');
  taskCount.textContent = remaining === 0
    ? 'All done 🎉'
    : ${remaining} task${remaining !== 1 ? 's' : ''} remaining;

  clearBtn.style.visibility = completed > 0 ? 'visible' : 'hidden';
}

// ── Warning ──────────────────────────────────────────────────

function showWarning() {
  warning.classList.remove('hidden');
  input.style.borderColor = 'var(--accent)';
  input.focus();
}

function hideWarning() {
  warning.classList.add('hidden');
  input.style.borderColor = '';
}

// ── localStorage ─────────────────────────────────────────────

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem('tasks')) || [];
  } catch {
    return [];
  }
}

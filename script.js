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


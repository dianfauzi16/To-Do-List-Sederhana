// Modul ini fokus pada manipulasi DOM dan tampilan UI.
// Semua operasi yang berhubungan dengan elemen HTML harus diletakkan di sini.

// Ambil referensi elemen utama sekali saja di awal
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const taskError = document.getElementById("task-error");

const progressBarFill = document.getElementById("progress-bar-fill");
const progressPercentage = document.getElementById("progress-percentage");
const progressSummary = document.getElementById("progress-summary");

/**
 * Mengembalikan referensi elemen penting agar bisa digunakan modul lain (app.js).
 * Di versi non-module ini, kita tetap ekspor lewat objek global agar rapih.
 */
const uiElements = {
  taskInput,
  addTaskBtn,
  taskList,
};

/**
 * Menampilkan pesan error di bawah input ketika user mengirim task kosong.
 * Pesan akan menghilang otomatis setelah beberapa detik.
 */
function showInputError(message) {
  taskError.textContent = message;
  taskError.classList.add("visible");

  setTimeout(() => {
    taskError.classList.remove("visible");
  }, 2000);
}

/**
 * Mengambil nilai teks dari input task.
 */
function getTaskInputValue() {
  return taskInput.value.trim();
}

/**
 * Mengosongkan input task dan fokus kembali ke input.
 */
function clearTaskInput() {
  taskInput.value = "";
  taskInput.focus();
}

/**
 * Membuat elemen ikon berbentuk SVG agar tombol terlihat lebih modern.
 */
function createIcon(type) {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");

  const path = document.createElementNS(svgNS, "path");
  path.setAttribute("fill", "currentColor");

  if (type === "check") {
    path.setAttribute(
      "d",
      "M9.55 17.1 5.4 12.95l1.4-1.4 2.75 2.75 7.1-7.1 1.4 1.4Z"
    );
  } else if (type === "trash") {
    path.setAttribute(
      "d",
      "M8 9h2v8H8zm6 0h2v8h-2zM6 5h12v2H6zm2-3h8l1 1h3v2H4V3h3z"
    );
  } else if (type === "edit") {
    path.setAttribute(
      "d",
      "M5 18.08V21h2.92L17.81 11.1l-2.92-2.92zm3.13 1.79H7v-1.13l7.06-7.06 1.13 1.13zm7.78-8.49 1.41-1.41-2.92-2.92-1.41 1.41z"
    );
  } else if (type === "drag") {
    path.setAttribute(
      "d",
      "M10 4h4v2h-4zm0 7h4v2h-4zm0 7h4v2h-4z"
    );
  }

  svg.appendChild(path);
  return svg;
}

/**
 * Membuat satu elemen `<li>` untuk merepresentasikan sebuah task.
 * Elemen ini belum diberi event listener; event ditangani di level list (event delegation).
 */
function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = "task-item";
  li.dataset.id = task.id;
  li.draggable = true;

  if (task.completed) {
    li.classList.add("completed");
  }

  const handle = document.createElement("div");
  handle.className = "task-handle";
  handle.setAttribute("data-role", "drag-handle");
  handle.appendChild(createIcon("drag"));

  const content = document.createElement("div");
  content.className = "task-content";

  const checkbox = document.createElement("button");
  checkbox.className = "task-checkbox";
  checkbox.type = "button";
  checkbox.setAttribute("data-action", "toggle-complete");
  checkbox.setAttribute("aria-label", "Tandai selesai");

  const checkboxIcon = document.createElement("span");
  checkboxIcon.className = "task-checkbox-icon";
  checkbox.appendChild(checkboxIcon);

  const meta = document.createElement("div");
  meta.className = "task-meta";

  const textEl = document.createElement("p");
  textEl.className = "task-text";
  textEl.textContent = task.title;
  textEl.setAttribute("data-action", "edit-task");

  const dateEl = document.createElement("span");
  dateEl.className = "task-date";
  dateEl.textContent = formatDate(task.createdAt);

  meta.appendChild(textEl);
  meta.appendChild(dateEl);

  content.appendChild(checkbox);
  content.appendChild(meta);

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const completeBtn = document.createElement("button");
  completeBtn.className = "btn-icon-small btn-complete";
  completeBtn.type = "button";
  completeBtn.setAttribute("data-action", "toggle-complete");
  completeBtn.appendChild(createIcon("check"));

  const editBtn = document.createElement("button");
  editBtn.className = "btn-icon-small btn-edit";
  editBtn.type = "button";
  editBtn.setAttribute("data-action", "edit-task");
  editBtn.appendChild(createIcon("edit"));

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn-icon-small btn-delete";
  deleteBtn.type = "button";
  deleteBtn.setAttribute("data-action", "delete-task");
  deleteBtn.appendChild(createIcon("trash"));

  actions.appendChild(completeBtn);
  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(handle);
  li.appendChild(content);
  li.appendChild(actions);

  return li;
}

/**
 * Merender seluruh daftar task ke dalam elemen `<ul id="task-list">`.
 * Jika task kosong, tampilkan teks "Belum ada tugas".
 */
function renderTaskList(tasks) {
  taskList.innerHTML = "";

  if (!tasks.length) {
    const empty = document.createElement("div");
    empty.className = "task-empty";
    empty.textContent =
      "Belum ada tugas. Tambahkan satu tugas untuk memulai hari produktifmu.";
    taskList.appendChild(empty);
    return;
  }

  tasks.forEach((task) => {
    const item = createTaskElement(task);
    taskList.appendChild(item);
  });
}

/**
 * Meng-update tampilan progress bar berdasarkan jumlah task selesai.
 */
function updateProgressBar(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;

  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  progressBarFill.style.width = `${percentage}%`;
  progressPercentage.textContent = `${percentage}%`;
  progressSummary.textContent = `${completed} dari ${total} tugas selesai.`;
}

/**
 * Animasi singkat pada task yang baru ditambahkan,
 * agar user langsung melihat item yang baru muncul.
 */
function highlightNewTask(taskId) {
  const item = taskList.querySelector(`[data-id="${taskId}"]`);
  if (!item) return;

  item.style.boxShadow = "0 0 0 1px rgba(129, 140, 248, 0.95)";
  item.style.transition = "box-shadow 0.6s ease-out";

  setTimeout(() => {
    item.style.boxShadow = "";
  }, 600);
}

/**
 * Format tanggal menjadi bentuk yang lebih mudah dibaca dalam Bahasa Indonesia.
 */
function formatDate(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// "Ekspor" fungsi yang dibutuhkan ke global agar bisa diakses app.js
window.TodoUI = {
  uiElements,
  showInputError,
  getTaskInputValue,
  clearTaskInput,
  renderTaskList,
  updateProgressBar,
  highlightNewTask,
};


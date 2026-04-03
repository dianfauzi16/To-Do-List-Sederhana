// app.js adalah "otak" utama aplikasi.
// Di sini kita menghubungkan antara:
// - data (array tasks)
// - storage (localStorage)
// - UI (DOM)
// - drag and drop

// State utama aplikasi: semua task disimpan dalam array ini di memori
let tasks = [];

/**
 * Membuat objek task baru dengan struktur yang konsisten.
 */
function createTask(title, studyTimeMinutes = 0) {
  const now = new Date().toISOString();
  return {
    id: Date.now().toString(), // ID unik berbasis timestamp
    title,
    completed: false,
    createdAt: now,
    updatedAt: now,
    studyTime: studyTimeMinutes * 60, // Waktu belajar dalam detik
    timeRemaining: studyTimeMinutes * 60, // Waktu tersisa dalam detik
    timerRunning: false, // Apakah timer sedang berjalan
    timerStartTime: null, // Timestamp saat timer dimulai
  };
}

/**
 * Render ulang UI (list + progress) setelah ada perubahan data.
 * Fungsi ini memastikan tampilan selalu sinkron dengan state `tasks`.
 */
function render() {
  window.TodoUI.renderTaskList(tasks);
  window.TodoUI.updateProgressBar(tasks);
}

/**
 * Handler untuk menambahkan task baru dari input.
 */
function handleAddTask() {
  const value = window.TodoUI.getTaskInputValue();
  const studyTime = window.TodoUI.getStudyTimeValue();

  if (!value) {
    window.TodoUI.showInputError("Tugas tidak boleh kosong.");
    return;
  }

  if (studyTime <= 0) {
    window.TodoUI.showInputError("Waktu belajar harus lebih dari 0 menit.");
    return;
  }

  const newTask = createTask(value, studyTime);
  tasks.unshift(newTask); // Masukkan di awal agar terlihat paling atas

  saveTasks(tasks);
  render();
  window.TodoUI.highlightNewTask(newTask.id);
  window.TodoUI.clearTaskInput();
}

/**
 * Toggle status selesai/belum selesai sebuah task berdasarkan ID.
 */
function handleToggleComplete(taskId) {
  tasks = tasks.map((task) =>
    task.id === taskId
      ? {
          ...task,
          completed: !task.completed,
          updatedAt: new Date().toISOString(),
        }
      : task
  );

  saveTasks(tasks);
  render();
}

/**
 * Toggle timer untuk task tertentu (start countdown).
 */
function handleToggleTimer(taskId) {
  const now = Date.now();
  tasks = tasks.map((task) => {
    if (task.id === taskId) {
      if (task.timerRunning) {
        // Stop timer - tidak perlu menghitung elapsed karena kita update setiap detik
        return {
          ...task,
          timerRunning: false,
          timerStartTime: null,
          updatedAt: new Date().toISOString(),
        };
      } else {
        // Start countdown timer
        if (task.timeRemaining <= 0) {
          // Reset ke waktu awal jika sudah habis
          return {
            ...task,
            timerRunning: true,
            timerStartTime: now,
            timeRemaining: task.studyTime,
            updatedAt: new Date().toISOString(),
          };
        } else {
          return {
            ...task,
            timerRunning: true,
            timerStartTime: now,
            updatedAt: new Date().toISOString(),
          };
        }
      }
    }
    return task;
  });

  saveTasks(tasks);
  render();
}

/**
 * Menghapus task dengan ID tertentu.
 * Menggunakan animasi singkat sebelum benar-benar dihapus.
 */
function handleDeleteTask(taskId) {
  const itemEl = window.TodoUI.uiElements.taskList.querySelector(
    `[data-id="${taskId}"]`
  );
  if (!itemEl) {
    // Jika elemen tidak ditemukan, langsung hapus dari data
    tasks = tasks.filter((task) => task.id !== taskId);
    saveTasks(tasks);
    render();
    return;
  }

  itemEl.classList.add("removing");

  itemEl.addEventListener(
    "animationend",
    () => {
      tasks = tasks.filter((task) => task.id !== taskId);
      saveTasks(tasks);
      render();
    },
    { once: true }
  );
}

/**
 * Mengedit judul task dengan menggunakan `prompt` sederhana.
 * Pendekatan ini mudah dipahami oleh pemula sekaligus cukup praktis.
 */
function handleEditTask(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  const newTitle = window.prompt("Edit tugas:", task.title);
  if (newTitle === null) {
    // User menekan Cancel
    return;
  }

  const trimmed = newTitle.trim();
  if (!trimmed) {
    window.TodoUI.showInputError("Teks tugas tidak boleh dikosongkan.");
    return;
  }

  tasks = tasks.map((t) =>
    t.id === taskId
      ? { ...t, title: trimmed, updatedAt: new Date().toISOString() }
      : t
  );

  saveTasks(tasks);
  render();
}

/**
 * Menerapkan urutan task baru berdasarkan array ID yang diberikan
 * oleh modul drag and drop.
 */
function applyNewOrder(orderedIds) {
  const idToTask = new Map(tasks.map((task) => [task.id, task]));

  const reordered = [];
  orderedIds.forEach((id) => {
    const task = idToTask.get(id);
    if (task) {
      reordered.push(task);
      idToTask.delete(id);
    }
  });

  // Jika ada task yang tidak ada di orderedIds (misalnya error drag),
  // kita tambahkan di akhir agar tidak hilang.
  idToTask.forEach((task) => reordered.push(task));

  tasks = reordered;
  saveTasks(tasks);
  render();
}

/**
 * Inisialisasi seluruh event listener yang dibutuhkan aplikasi.
 */
function initEventListeners() {
  const { taskInput, addTaskBtn, taskList } = window.TodoUI.uiElements;

  // Klik tombol "Tambah"
  addTaskBtn.addEventListener("click", handleAddTask);

  // Tekan Enter di dalam input untuk menambah task
  taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleAddTask();
    }
  });

  // Delegasi event klik untuk tombol di dalam list
  taskList.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const actionEl = target.closest("[data-action]");
    if (!actionEl) return;

    const action = actionEl.getAttribute("data-action");
    const itemEl = actionEl.closest(".task-item");
    if (!itemEl) return;

    const taskId = itemEl.dataset.id;
    if (!taskId) return;

    if (action === "toggle-complete") {
      handleToggleComplete(taskId);
    } else if (action === "delete-task") {
      handleDeleteTask(taskId);
    } else if (action === "edit-task") {
      handleEditTask(taskId);
    } else if (action === "toggle-timer") {
      handleToggleTimer(taskId);
    }
  });

  // Memungkinkan double click pada teks task untuk mengedit
  taskList.addEventListener("dblclick", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const textEl = target.closest(".task-text");
    if (!textEl) return;

    const itemEl = textEl.closest(".task-item");
    if (!itemEl) return;

    const taskId = itemEl.dataset.id;
    if (!taskId) return;

    handleEditTask(taskId);
  });

  // Inisialisasi fitur drag and drop sekali saja
  window.TodoDragDrop.initDragAndDrop(taskList, applyNewOrder);
}

/**
 * Titik masuk aplikasi.
 * - Memuat data dari localStorage
 * - Merender UI awal
 * - Mengikat semua event listener
 */
function initApp() {
  tasks = loadTasks();
  render();
  initEventListeners();

  // Update timer setiap detik untuk task yang sedang berjalan
  setInterval(() => {
    let needsRender = false;
    let completedTasks = [];

    tasks = tasks.map((task) => {
      if (task.timerRunning && task.timeRemaining > 0) {
        const newRemaining = task.timeRemaining - 1;

        if (newRemaining === 0) {
          // Timer selesai - auto-complete task
          completedTasks.push(task.title);
          return {
            ...task,
            timeRemaining: 0,
            timerRunning: false,
            timerStartTime: null,
            completed: true, // Auto-complete!
            updatedAt: new Date().toISOString(),
          };
        }

        needsRender = true;
        return {
          ...task,
          timeRemaining: Math.max(0, newRemaining),
          timerRunning: newRemaining > 0, // Stop otomatis jika habis
          timerStartTime: newRemaining > 0 ? task.timerStartTime : null,
          updatedAt: new Date().toISOString(),
        };
      }
      return task;
    });

    if (needsRender) {
      render();
    }

    // Notifikasi untuk task yang selesai
    completedTasks.forEach(title => {
      setTimeout(() => {
        alert(`Waktu belajar untuk "${title}" telah selesai! 🎉`);
      }, 100);
    });

    if (completedTasks.length > 0) {
      render(); // Render ulang untuk menampilkan task yang sudah ter-checklist
      saveTasks(tasks);
    }
  }, 1000);
}

// Jalankan aplikasi ketika DOM siap
document.addEventListener("DOMContentLoaded", initApp);


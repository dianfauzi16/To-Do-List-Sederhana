// Modul ini bertanggung jawab untuk semua interaksi dengan localStorage.
// Tujuannya agar logika penyimpanan data terpisah dari logika UI.

const STORAGE_KEY = "todo-list-app-tasks";

/**
 * Mengambil daftar task dari localStorage.
 * Jika belum ada data atau data rusak, akan mengembalikan array kosong.
 */
function loadTasks() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Migrasi: tambahkan properti timer jika belum ada
    return parsed.map(task => ({
      id: task.id,
      title: task.title,
      completed: task.completed || false,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt || task.createdAt,
      studyTime: task.studyTime || (task.timeSpent ? task.timeSpent : 0), // Gunakan timeSpent lama sebagai studyTime
      timeRemaining: task.timeRemaining || (task.timeSpent ? task.timeSpent : 0), // Atau timeSpent jika ada
      timerRunning: task.timerRunning || false,
      timerStartTime: task.timerStartTime || null,
    }));
  } catch (error) {
    console.error("Gagal membaca data task dari localStorage:", error);
    return [];
  }
}

/**
 * Menyimpan array task ke localStorage.
 * Fungsi ini selalu dipanggil setelah ada perubahan data task.
 */
function saveTasks(tasks) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}


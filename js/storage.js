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
    return Array.isArray(parsed) ? parsed : [];
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


# Todo List App 

Aplikasi **Todo List** sederhana dengan tampilan modern, drag and drop, dan penyimpanan data menggunakan `localStorage`.

---

## Fitur Utama

- **Task Management**
  - Menambahkan task baru
  - Menampilkan daftar task
  - Menandai task sebagai selesai / belum selesai
  - Menghapus task
  - Mengedit task (via _prompt_ atau double-click pada teks task)
  - Menambahkan task dengan tombol **Enter**

- **Penyimpanan Data**
  - Semua task disimpan menggunakan **`localStorage`**
  - Data tidak hilang ketika halaman di-refresh

- **Drag and Drop**
  - Task bisa diurutkan ulang menggunakan drag and drop
  - Menggunakan **HTML5 Drag and Drop API**
  - Setelah urutan diubah, data baru langsung disimpan ke `localStorage`

- **Progress Bar Produktivitas**
  - Menampilkan persentase task yang sudah selesai
  - Contoh: 3 dari 5 task selesai → progress 60%
  - Otomatis ter-update ketika task:
    - ditambah
    - dihapus
    - ditandai selesai / belum selesai

- **Tampilan UI**
  - Desain **modern, minimalis, dan bersih (dark theme)**
  - **Responsif** untuk desktop dan mobile
  - Animasi halus ketika task ditambahkan / dihapus
  - Tombol `complete`, `edit`, dan `delete` menggunakan **ikon SVG**

---

## Teknologi yang Digunakan

- **HTML5** → struktur halaman dan elemen UI
- **CSS3** → styling modern, layout responsif, dan animasi
- **JavaScript (ES Modules)** → logika aplikasi dan modularisasi kode
- **HTML5 Drag and Drop API** → mengubah urutan task
- **Web Storage API (`localStorage`)** → menyimpan data task di browser


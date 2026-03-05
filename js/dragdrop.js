// Modul ini berisi logika drag and drop menggunakan HTML5 Drag and Drop API.
// Tanggung jawabnya hanya:
// - mendeteksi posisi drop
// - memberi tahu urutan ID task baru kepada app.js

/**
 * Inisialisasi fitur drag and drop pada list task.
 * @param {HTMLElement} listElement - Elemen <ul> yang berisi task.
 * @param {(orderedIds: string[]) => void} onReorder - Callback ketika urutan berubah.
 */
function initDragAndDrop(listElement, onReorder) {
  let draggedItem = null;

  listElement.addEventListener("dragstart", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const item = target.closest(".task-item");
    if (!item) return;

    draggedItem = item;
    item.classList.add("dragging");
    event.dataTransfer?.setData("text/plain", item.dataset.id || "");
    event.dataTransfer?.setDragImage(item, 50, 20);
  });

  listElement.addEventListener("dragend", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const item = target.closest(".task-item");
    if (item) {
      item.classList.remove("dragging");
      item.classList.remove("drag-over");
    }
    draggedItem = null;
  });

  listElement.addEventListener("dragover", (event) => {
    event.preventDefault();
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const item = target.closest(".task-item");
    if (!item || item === draggedItem) return;

    const bounding = item.getBoundingClientRect();
    const offset = event.clientY - bounding.top;
    const shouldInsertBefore = offset < bounding.height / 2;

    item.classList.add("drag-over");

    if (shouldInsertBefore) {
      listElement.insertBefore(draggedItem, item);
    } else {
      listElement.insertBefore(draggedItem, item.nextSibling);
    }
  });

  listElement.addEventListener("dragleave", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const item = target.closest(".task-item");
    if (item) {
      item.classList.remove("drag-over");
    }
  });

  listElement.addEventListener("drop", (event) => {
    event.preventDefault();

    // Hapus efek highlight
    listElement
      .querySelectorAll(".task-item.drag-over")
      .forEach((el) => el.classList.remove("drag-over"));

    // Kumpulkan urutan ID baru berdasarkan posisi elemen di DOM
    const orderedIds = Array.from(
      listElement.querySelectorAll(".task-item")
    ).map((item) => item.dataset.id || "");

    onReorder(orderedIds);
  });
}

// Ekspor ke global
window.TodoDragDrop = {
  initDragAndDrop,
};


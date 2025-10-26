const STORAGE_KEY = "personal_dashboard_entries_v1";
const MOTIVATION_STORAGE_KEY = "personal_dashboard_motivation_timestamp";

const formatDate = (value) => {
  if (!value) {
    return "-";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString("id-ID", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const randomFromList = (list) =>
  list[Math.floor(Math.random() * list.length)];

const generateId = () =>
  window.crypto?.randomUUID
    ? crypto.randomUUID()
    : `entry-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

class DashboardApp {
  entries = [];
  editingId = null;

  constructor() {
    this.elements = {
      form: document.getElementById("entryForm"),
      titleInput: document.getElementById("entryTitle"),
      categoryInput: document.getElementById("entryCategory"),
      dateInput: document.getElementById("entryDate"),
      descriptionInput: document.getElementById("entryDescription"),
      feedback: document.getElementById("formFeedback"),
      submitButton: document.getElementById("submitButton"),
      cancelButton: document.getElementById("cancelEditButton"),
      entryList: document.getElementById("entryList"),
      emptyState: document.getElementById("emptyState"),
      filterCategory: document.getElementById("filterCategory"),
      totalEntries: document.getElementById("totalEntries"),
      activeCategories: document.getElementById("activeCategories"),
      motivationMessage: document.getElementById("motivationMessage"),
      clearAllButton: document.getElementById("clearAllButton"),
      template: document.getElementById("entryTemplate"),
    };

    this.bindEvents();
    this.init();
  }

  bindEvents() {
    this.elements.form.addEventListener("submit", this.handleSubmit);
    this.elements.cancelButton.addEventListener("click", this.handleCancelEdit);
    this.elements.filterCategory.addEventListener(
      "change",
      this.handleFilterChange
    );
    this.elements.clearAllButton.addEventListener(
      "click",
      this.handleClearAll
    );
  }

  async init() {
    this.entries = this.loadEntries();
    this.renderFilterOptions();
    this.render();
    await this.loadMotivationMessage();
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.clearFeedback();

    const title = this.elements.titleInput.value.trim();
    const category = this.elements.categoryInput.value;
    const date = this.elements.dateInput.value;
    const description = this.elements.descriptionInput.value.trim();

    const validationError = this.validateForm({ title, category, description });
    if (validationError) {
      this.setFeedback(validationError, false);
      return;
    }

    if (this.editingId) {
      this.updateEntry(this.editingId, { title, category, date, description });
      this.setFeedback("Item dashboard berhasil diperbarui.", true);
    } else {
      this.createEntry({ title, category, date, description });
      this.setFeedback("Item dashboard baru berhasil ditambahkan.", true);
    }

    this.saveEntries();
    this.resetForm();
    this.render();
  };

  handleCancelEdit = () => {
    this.resetForm();
    this.clearFeedback();
  };

  handleFilterChange = () => {
    this.renderEntries();
  };

  handleClearAll = () => {
    if (this.entries.length === 0) {
      this.setFeedback("Tidak ada item untuk dibersihkan.", false);
      return;
    }

    const confirmation = window.confirm(
      "Semua item dashboard akan dihapus permanent. Lanjutkan?"
    );

    if (!confirmation) {
      return;
    }

    this.entries = [];
    this.saveEntries();
    this.renderFilterOptions();
    this.render();
    this.setFeedback("Seluruh item dashboard telah dibersihkan.", true);
  };

  loadEntries() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Gagal memuat data dashboard", error);
      return [];
    }
  }

  saveEntries() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.entries));
  }

  createEntry({ title, category, date, description }) {
    const newEntry = {
      id: generateId(),
      title,
      category,
      date,
      description,
      createdAt: Date.now(),
    };
    this.entries = [...this.entries, newEntry];
    this.renderFilterOptions();
  }

  updateEntry(id, updates) {
    this.entries = this.entries.map((entry) =>
      entry.id === id
        ? {
            ...entry,
            ...updates,
          }
        : entry
    );
    this.renderFilterOptions();
  }

  deleteEntry = (id) => {
    const confirmation = window.confirm("Hapus item ini dari dashboard?");
    if (!confirmation) {
      return;
    }

    this.entries = this.entries.filter((entry) => entry.id !== id);
    this.saveEntries();
    this.renderFilterOptions();
    this.render();
    this.setFeedback("Item dashboard berhasil dihapus.", true);
  };

  startEdit(entry) {
    this.editingId = entry.id;
    this.elements.titleInput.value = entry.title;
    this.elements.categoryInput.value = entry.category;
    this.elements.dateInput.value = entry.date;
    this.elements.descriptionInput.value = entry.description;

    this.elements.submitButton.textContent = "Perbarui Item";
    this.elements.cancelButton.classList.remove("is-hidden");
    this.elements.titleInput.focus();
  }

  resetForm() {
    this.editingId = null;
    this.elements.form.reset();
    this.elements.submitButton.textContent = "Simpan Item";
    this.elements.cancelButton.classList.add("is-hidden");
  }

  validateForm({ title, category, description }) {
    if (!title) {
      return "Judul wajib diisi.";
    }
    if (!category) {
      return "Pilih salah satu kategori.";
    }
    if (!description) {
      return "Deskripsi tidak boleh kosong.";
    }
    return null;
  }

  render() {
    this.renderEntries();
    this.updateStats();
  }

  renderEntries() {
    const filteredEntries = this.getFilteredEntries();
    this.elements.entryList.innerHTML = "";

    if (filteredEntries.length === 0) {
      const message =
        this.entries.length === 0
          ? "Belum ada data. Tambahkan item pertama Anda di sisi kiri."
          : "Tidak ada item yang cocok dengan filter saat ini.";
      this.elements.emptyState.innerHTML = `<p>${message}</p>`;
      this.elements.emptyState.classList.remove("is-hidden");
      return;
    }

    this.elements.emptyState.classList.add("is-hidden");

    const fragment = document.createDocumentFragment();
    const sorted = [...filteredEntries].sort(
      (a, b) => new Date(a.date || 0) - new Date(b.date || 0)
    );

    sorted.forEach((entry) => {
      const node = this.elements.template.content.cloneNode(true);
      const card = node.querySelector(".entry-card");
      const category = node.querySelector(".entry-card__category");
      const title = node.querySelector(".entry-card__title");
      const date = node.querySelector(".entry-card__date");
      const description = node.querySelector(".entry-card__description");
      const editButton = node.querySelector(".js-edit");
      const deleteButton = node.querySelector(".js-delete");

      card.dataset.entryId = entry.id;
      category.textContent = entry.category;
      title.textContent = entry.title;
      date.textContent = entry.date
        ? `Tanggal: ${formatDate(entry.date)}`
        : "Tanggal: -";
      description.textContent = entry.description;

      editButton.addEventListener("click", () => this.startEdit(entry));
      deleteButton.addEventListener("click", () => this.deleteEntry(entry.id));

      fragment.appendChild(node);
    });

    this.elements.entryList.appendChild(fragment);
  }

  renderFilterOptions() {
    const selected = this.elements.filterCategory.value || "all";
    const uniqueCategories = [
      ...new Set(this.entries.map((entry) => entry.category)),
    ].sort((a, b) => a.localeCompare(b, "id", { sensitivity: "base" }));

    this.elements.filterCategory.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = "all";
    defaultOption.textContent = "Semua";
    this.elements.filterCategory.appendChild(defaultOption);

    uniqueCategories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      if (category === selected) {
        option.selected = true;
      }
      this.elements.filterCategory.appendChild(option);
    });

    if (!this.elements.filterCategory.value) {
      this.elements.filterCategory.value = "all";
    }
  }

  getFilteredEntries() {
    const categoryFilter = this.elements.filterCategory.value;
    if (categoryFilter === "all") {
      return this.entries;
    }
    return this.entries.filter((entry) => entry.category === categoryFilter);
  }

  updateStats() {
    this.elements.totalEntries.textContent = this.entries.length;

    const categories = new Set(this.entries.map((entry) => entry.category));
    this.elements.activeCategories.textContent = categories.size;
    this.elements.clearAllButton.disabled = this.entries.length === 0;
  }

  setFeedback(message, isSuccess) {
    this.elements.feedback.textContent = message;
    this.elements.feedback.classList.toggle(
      "form__feedback--success",
      isSuccess
    );
  }

  clearFeedback() {
    this.elements.feedback.textContent = "";
    this.elements.feedback.classList.remove("form__feedback--success");
  }

  async loadMotivationMessage() {
    const now = Date.now();
    const lastUpdate = Number(
      localStorage.getItem(MOTIVATION_STORAGE_KEY) || 0
    );

    if (now - lastUpdate < 1000 * 60 * 60) {
      return;
    }

    const fallbackMessages = [
      "Fokus pada proses, karena hasil adalah bonus dari usaha yang konsisten.",
      "Setiap progres kecil hari ini adalah fondasi kesuksesan esok.",
      "Luangkan waktu untuk merencanakan, agar eksekusi menjadi lebih ringan.",
      "Kamu mengendalikan agendamu. Pilih prioritasmu dan selesaikan satu per satu.",
    ];

    try {
      const response = await fetch(
        "https://api.quotable.io/random?maxLength=120"
      );
      if (!response.ok) {
        throw new Error("Fetch quote failed");
      }
      const data = await response.json();
      const message = `${data.content} — ${data.author}`;
      this.elements.motivationMessage.textContent = message;
    } catch (error) {
      const message = randomFromList(fallbackMessages);
      this.elements.motivationMessage.textContent = message;
    } finally {
      localStorage.setItem(MOTIVATION_STORAGE_KEY, String(now));
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  new DashboardApp();
});

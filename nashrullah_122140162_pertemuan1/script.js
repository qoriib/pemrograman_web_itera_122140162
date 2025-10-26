const STORAGE_KEY = "student_tasks";

const elements = {
  form: document.getElementById("taskForm"),
  submitButton: document.getElementById("submitButton"),
  cancelEditButton: document.getElementById("cancelEditButton"),
  nameInput: document.getElementById("taskName"),
  courseInput: document.getElementById("courseName"),
  deadlineInput: document.getElementById("deadline"),
  feedback: document.getElementById("formFeedback"),
  taskList: document.getElementById("taskList"),
  emptyState: document.getElementById("emptyState"),
  pendingCount: document.getElementById("pendingCount"),
  statusFilter: document.getElementById("statusFilter"),
  courseFilter: document.getElementById("courseFilter"),
  searchInput: document.getElementById("searchInput"),
  clearCompletedButton: document.getElementById("clearCompletedButton"),
  template: document.getElementById("taskItemTemplate"),
};

let tasks = [];
let editingTaskId = null;

init();

function init() {
  tasks = loadTasks();
  resetForm();
  bindEvents();
  applyState();
}

function bindEvents() {
  elements.form.addEventListener("submit", handleFormSubmit);
  elements.cancelEditButton.addEventListener("click", handleCancelEdit);
  elements.statusFilter.addEventListener("change", applyState);
  elements.courseFilter.addEventListener("change", applyState);
  elements.searchInput.addEventListener("input", applyState);
  elements.clearCompletedButton.addEventListener("click", handleClearCompleted);
}

function applyState() {
  renderCourseOptions();
  renderTasks();
  renderPendingCount();
}

function loadTasks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Gagal memuat data dari localStorage", error);
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function handleFormSubmit(event) {
  event.preventDefault();
  clearFeedback();

  const name = elements.nameInput.value.trim();
  const course = elements.courseInput.value.trim();
  const deadline = elements.deadlineInput.value;

  const validationError = validateForm({ name, course, deadline });
  if (validationError) {
    showFeedback(validationError, "error");
    return;
  }

  if (editingTaskId) {
    updateTask(editingTaskId, { name, course, deadline });
    showFeedback("Tugas berhasil diperbarui.", "success");
  } else {
    createTask({ name, course, deadline });
    showFeedback("Tugas baru berhasil ditambahkan.", "success");
  }

  saveTasks();
  resetForm();
  applyState();
}

function createTask({ name, course, deadline }) {
  const newTask = {
    id: generateId(),
    name,
    course,
    deadline,
    completed: false,
    createdAt: Date.now(),
  };
  tasks.push(newTask);
}

function updateTask(id, updates) {
  tasks = tasks.map((task) =>
    task.id === id
      ? {
          ...task,
          ...updates,
        }
      : task
  );
}

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  applyState();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  applyState();
}

function handleClearCompleted() {
  if (!tasks.some((task) => task.completed)) {
    showFeedback("Tidak ada tugas selesai untuk dihapus.", "error");
    return;
  }

  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  applyState();
  showFeedback("Semua tugas yang selesai telah dihapus.", "success");
}

function validateForm({ name, course, deadline }) {
  if (!name) {
    return "Nama tugas wajib diisi.";
  }

  if (!course) {
    return "Mata kuliah wajib diisi.";
  }

  if (!deadline) {
    return "Deadline wajib ditentukan.";
  }

  const parsedDate = new Date(deadline);
  if (Number.isNaN(parsedDate.getTime())) {
    return "Format deadline tidak valid.";
  }

  return null;
}

function renderCourseOptions() {
  const uniqueCourses = [...new Set(tasks.map((task) => task.course))];
  const selectedCourse = elements.courseFilter.value;
  elements.courseFilter.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "all";
  defaultOption.textContent = "Semua";
  elements.courseFilter.appendChild(defaultOption);

  uniqueCourses
    .sort((a, b) => a.localeCompare(b, "id", { sensitivity: "base" }))
    .forEach((course) => {
      const option = document.createElement("option");
      option.value = course;
      option.textContent = course;
      if (course === selectedCourse) {
        option.selected = true;
      }
      elements.courseFilter.appendChild(option);
    });

  if (!elements.courseFilter.value) {
    elements.courseFilter.value = "all";
  }
}

function renderTasks() {
  const filteredTasks = getFilteredTasks();

  elements.taskList.innerHTML = "";
  if (filteredTasks.length === 0) {
    elements.emptyState.innerHTML =
      tasks.length === 0
        ? "<p>Belum ada tugas. Mulai dengan menambahkan tugas baru di atas.</p>"
        : "<p>Tidak ada tugas yang cocok dengan filter saat ini.</p>";
    elements.emptyState.style.display = "block";
    return;
  }

  elements.emptyState.style.display = "none";

  const fragment = document.createDocumentFragment();
  filteredTasks
    .sort(sortByDeadlineThenCreated)
    .forEach((task) => {
      const node = elements.template.content.cloneNode(true);
      const listItem = node.querySelector(".task");
      const checkbox = node.querySelector(".task__checkbox");
      const title = node.querySelector(".task__title");
      const course = node.querySelector(".task__course");
      const deadline = node.querySelector(".task__deadline");
      const editButton = node.querySelector(".js-edit");
      const deleteButton = node.querySelector(".js-delete");

      listItem.dataset.taskId = task.id;

      if (task.completed) {
        listItem.classList.add("task--completed");
        checkbox.checked = true;
      }

      title.textContent = task.name;
      course.textContent = task.course;
      deadline.textContent = formatDate(task.deadline);

      checkbox.addEventListener("change", () => toggleTask(task.id));
      editButton.addEventListener("click", () => startEdit(task));
      deleteButton.addEventListener("click", () => handleDelete(task.id));

      fragment.appendChild(node);
    });

  elements.taskList.appendChild(fragment);
}

function sortByDeadlineThenCreated(a, b) {
  const dateA = new Date(a.deadline).getTime();
  const dateB = new Date(b.deadline).getTime();

  if (dateA !== dateB) {
    return dateA - dateB;
  }

  return a.createdAt - b.createdAt;
}

function handleDelete(id) {
  const shouldDelete = confirm("Hapus tugas ini secara permanen?");
  if (!shouldDelete) {
    return;
  }
  deleteTask(id);
}

function startEdit(task) {
  clearFeedback();
  editingTaskId = task.id;
  elements.nameInput.value = task.name;
  elements.courseInput.value = task.course;
  elements.deadlineInput.value = task.deadline;

  elements.submitButton.textContent = "Perbarui Tugas";
  elements.cancelEditButton.classList.remove("is-hidden");
  elements.nameInput.focus();
}

function resetForm() {
  editingTaskId = null;
  elements.form.reset();
  elements.submitButton.textContent = "Simpan Tugas";
  elements.cancelEditButton.classList.add("is-hidden");
}

function getFilteredTasks() {
  const status = elements.statusFilter.value;
  const course = elements.courseFilter.value;
  const query = elements.searchInput.value.trim().toLowerCase();

  return tasks.filter((task) => {
    const matchStatus =
      status === "all" ||
      (status === "completed" && task.completed) ||
      (status === "pending" && !task.completed);

    const matchCourse = course === "all" || task.course === course;

    const combined = `${task.name} ${task.course}`.toLowerCase();
    const matchQuery = query.length === 0 || combined.includes(query);

    return matchStatus && matchCourse && matchQuery;
  });
}

function renderPendingCount() {
  const pendingTotal = tasks.filter((task) => !task.completed).length;
  elements.pendingCount.textContent = pendingTotal;
  elements.clearCompletedButton.disabled = !tasks.some((task) => task.completed);
}

function showFeedback(message, type) {
  elements.feedback.textContent = message;
  elements.feedback.classList.toggle("feedback--success", type === "success");
}

function clearFeedback() {
  elements.feedback.textContent = "";
  elements.feedback.classList.remove("feedback--success");
}

function formatDate(dateValue) {
  try {
    const date = new Date(dateValue);
    return date.toLocaleDateString("id-ID", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    return dateValue;
  }
}

window.addEventListener("beforeunload", saveTasks);

function generateId() {
  if (window.crypto?.randomUUID) {
    return crypto.randomUUID();
  }
  return `task-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

function handleCancelEdit() {
  resetForm();
  clearFeedback();
}

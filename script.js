document.addEventListener("DOMContentLoaded", function () {
  let tasks = [];
  let currentFilter = "all";

  // ===== VARIABLES =====
  const taskInput = document.getElementById("taskInput");
  const addButton = document.getElementById("addTask");
  const taskList = document.getElementById("taskList");
  const taskCounter = document.getElementById("taskCounter");
  const allBtn = document.getElementById("filterAll");
  const activeBtn = document.getElementById("filterActive");
  const completedBtn = document.getElementById("filterCompleted");
  const clearCompletedBtn = document.getElementById("clearCompleted");

  addButton.disabled = true;
  taskInput.addEventListener("input", function () {
    addButton.disabled = taskInput.value.trim() === "";
  });

  // Functions

  // ===== SaveTasks function =====
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // ===== CreateTaskElement function =====
  function createTaskElement(task) {
    const li = document.createElement("li");

    const textSpan = document.createElement("span");
    textSpan.textContent = task.text;

    li.appendChild(textSpan);

    if (task.completed) {
      li.classList.add("completed");
    }

    // Toggle complete
    li.addEventListener("click", function () {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";

    editBtn.addEventListener("click", function (e) {
      e.stopPropagation();

      const newText = prompt("Edit your task:", task.text);

      if (!newText || newText.trim() === "") return;

      const realIndex = tasks.findIndex((t) => t.id === task.id);
      tasks[realIndex].text = newText.trim();

      if (realIndex === -1) return;

      saveTasks();
      renderTasks();
    });

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";

    deleteBtn.addEventListener("click", function (e) {
      e.stopPropagation();

      // 1. Animate first
      li.classList.add("fade-out");

      // 2. Wait for animation
      setTimeout(function () {
        // 3. THEN update data
        const realIndex = tasks.findIndex((t) => t.id === task.id);
        tasks.splice(realIndex, 1);

        saveTasks();
        renderTasks();
      }, 500); // match CSS timing
    });

    // Action container
    const actions = document.createElement("div");
    actions.classList.add("actions");

    actions.appendChild(deleteBtn);
    actions.appendChild(editBtn);

    li.appendChild(actions);

    return li;
  }

  // ===== RenderTasks function =====
  function renderTasks() {
    taskList.innerHTML = "";
    const filteredTasks = tasks.filter((task) => {
      if (currentFilter === "active") return !task.completed;
      if (currentFilter === "completed") return task.completed;
      return true;
    });

    if (filteredTasks.length === 0) {
      taskList.innerHTML = `
  <li class="empty-state">
    <p>No tasks yet 👀</p>
    <small>Add your first task above!</small>
  </li>
`;
      taskCounter.textContent =
        tasks.filter((task) => !task.completed).length === 1
          ? "1 task left"
          : tasks.filter((task) => !task.completed).length + " tasks left";
      return;
    }

    filteredTasks.forEach(function (task) {
      const li = createTaskElement(task);
      taskList.appendChild(li);
    });

    const remainingTasks = tasks.filter((task) => !task.completed).length;

    taskCounter.textContent =
      remainingTasks === 1 ? "1 task left" : remainingTasks + " tasks left";
  }

  // ===== SetActiveFilterButton function =====
  function setActiveFilterButton() {
    allBtn.classList.remove("active");
    activeBtn.classList.remove("active");
    completedBtn.classList.remove("active");

    if (currentFilter === "all") allBtn.classList.add("active");
    if (currentFilter === "active") activeBtn.classList.add("active");
    if (currentFilter === "completed") completedBtn.classList.add("active");
  }

  // =====Event Listeners =====
  const form = document.querySelector("form");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // prevents page refresh

    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    tasks.push({
      id: Date.now(),
      text: taskText,
      completed: false,
    });

    saveTasks();
    renderTasks();
    taskInput.value = "";
    taskInput.focus();
  });

  // ===== Buttons Event Listeners =====
  allBtn.addEventListener("click", function () {
    currentFilter = "all";
    setActiveFilterButton();
    renderTasks();
  });

  activeBtn.addEventListener("click", function () {
    currentFilter = "active";
    setActiveFilterButton();
    renderTasks();
  });

  completedBtn.addEventListener("click", function () {
    currentFilter = "completed";
    setActiveFilterButton();
    renderTasks();
  });

  clearCompletedBtn.addEventListener("click", function () {
    tasks = tasks.filter((task) => !task.completed);
    saveTasks();
    renderTasks();
  });

  setActiveFilterButton();

  // Load tasks from localStorage
  const savedTasks = JSON.parse(localStorage.getItem("tasks"));

  if (savedTasks) {
    tasks = savedTasks;
    renderTasks();
  }
});

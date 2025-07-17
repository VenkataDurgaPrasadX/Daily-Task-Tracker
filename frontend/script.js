const API_URL = 'http://localhost:5000/tasks';
const taskList = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');

// Notification function
function showAlert(message, type = 'success') {
  const alert = document.createElement('div');
  alert.textContent = message;
  alert.className = `alert ${type}`;
  document.body.appendChild(alert);
  setTimeout(() => alert.remove(), 2500);
}

// Load tasks on page load
async function loadTasks() {
  taskList.innerHTML = '';
  const res = await fetch(API_URL);
  const tasks = await res.json();
  tasks.forEach(addTaskToDOM);
}

// Add one task to DOM
function addTaskToDOM(task) {
  const li = document.createElement('li');
  if (task.completed) li.classList.add('completed');

  li.innerHTML = `
    <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleComplete('${task._id}', this.checked)" />
    <span>${task.title}</span>
    <div class="actions">
      <button class="edit" onclick="editTask('${task._id}', '${task.title.replace(/'/g, "\\'")}')">✏️ Edit</button>
      <button onclick="deleteTask('${task._id}')">🗑️ Delete</button>
    </div>
  `;
  taskList.appendChild(li);
}

// Handle form submit
taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return showAlert("Please enter a task", 'error');

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });

  if (!res.ok) {
    return showAlert("Failed to add task", 'error');
  }

  const newTask = await res.json();
  addTaskToDOM(newTask);
  taskInput.value = '';
  showAlert("✅ Task added!");
});

// Delete task
async function deleteTask(id) {
  if (!confirm("Are you sure you want to delete this task?")) return;

  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (res.ok) {
    loadTasks();
    showAlert("🗑️ Task deleted");
  } else {
    showAlert("Failed to delete task", 'error');
  }
}

// Edit task
async function editTask(id, currentTitle) {
  const newTitle = prompt("Edit your task:", currentTitle);
  if (newTitle === null || newTitle.trim() === '') return;

  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: newTitle })
  });

  if (res.ok) {
    loadTasks();
    showAlert("✏️ Task updated!");
  } else {
    showAlert("Failed to update", 'error');
  }
}

// Toggle task completion
async function toggleComplete(id, completed) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  });

  if (res.ok) {
    loadTasks();
  } else {
    showAlert("Failed to update task status", 'error');
  }
}

loadTasks();
// Real-time countdown to midnight
function startCountdown(targetTime) {
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetTime - now;

    if (distance <= 0) {
      document.getElementById('hrs').textContent = '00';
      document.getElementById('mins').textContent = '00';
      document.getElementById('secs').textContent = '00';
      return;
    }

    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    document.getElementById('hrs').textContent = hours.toString().padStart(2, '0');
    document.getElementById('mins').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('secs').textContent = seconds.toString().padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

const now = new Date();
const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0).getTime();
startCountdown(midnight);

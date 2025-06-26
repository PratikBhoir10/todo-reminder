// Initialize
let loadingTimeout;

const showLoader = () => {
  loadingTimeout = setTimeout(() => {
    document.getElementById('loader').style.display = 'block';
  }, 300);
};

const hideLoader = () => {
  clearTimeout(loadingTimeout);
  document.getElementById('loader').style.display = 'none';
};

const showError = (msg) => document.getElementById('error-message').textContent = msg;
const clearError = () => document.getElementById('error-message').textContent = '';

// Add Todo with optimized loading
document.getElementById("add-todo").addEventListener("click", async () => {
  const task = document.getElementById("todo-input").value.trim();
  const time = document.getElementById("reminder-time").value;
  
  if (!task || !time) {
    showError('Please fill both fields!');
    return;
  }

  showLoader();
  clearError();

  try {
    await db.collection("todos").add({
      text: task,
      reminderTime: new Date(time).toISOString(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      completed: false
    });
    document.getElementById("todo-input").value = "";
  } catch (error) {
    showError('Failed to save. Please try again.');
    console.error("Firestore error:", error);
  } finally {
    hideLoader();
  }
});

// Optimized Real-time Listener
db.collection("todos")
  .orderBy("reminderTime", "asc") // Changed from createdAt to reminderTime
  .limit(50) // Added limit
  .onSnapshot(snapshot => {
    hideLoader(); // Ensure loader hides
    const todoList = document.getElementById("todo-list");
    todoList.innerHTML = "";
    
    snapshot.forEach(doc => {
      const todo = doc.data();
      const li = document.createElement("li");
      li.className = "todo-item";
      
      // Highlight overdue tasks
      if (new Date(todo.reminderTime) < new Date()) {
        li.classList.add("overdue");
      }

      li.innerHTML = `
        <div class="todo-text">
          ${todo.text}
          <div class="todo-time">
            <i class="far fa-clock"></i> 
            ${formatFirestoreDate(todo.reminderTime)}
          </div>
        </div>
        <button class="delete-btn" data-id="${doc.id}">
          <i class="fas fa-trash"></i>
        </button>
      `;
      todoList.appendChild(li);
    });
  });

// Better date formatting
function formatFirestoreDate(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  
  if (date.toDateString() === now.toDateString()) {
    return `Today ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
  }
  
  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute:'2-digit'
  });
}

// Delete Todo with loading state
document.addEventListener("click", async (e) => {
  if (e.target.closest(".delete-btn")) {
    const id = e.target.closest(".delete-btn").getAttribute("data-id");
    showLoader();
    try {
      await db.collection("todos").doc(id).delete();
    } catch (error) {
      showError('Failed to delete task');
    } finally {
      hideLoader();
    }
  }
});

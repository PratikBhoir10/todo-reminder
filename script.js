// Initialize
const showLoader = () => document.getElementById('loader').style.display = 'block';
const hideLoader = () => document.getElementById('loader').style.display = 'none';
const showError = (msg) => document.getElementById('error-message').textContent = msg;
const clearError = () => document.getElementById('error-message').textContent = '';

// Add Todo
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

// Real-time Listener
db.collection("todos")
  .orderBy("createdAt", "desc")
  .onSnapshot(snapshot => {
    const todoList = document.getElementById("todo-list");
    todoList.innerHTML = "";
    
    snapshot.forEach(doc => {
      const todo = doc.data();
      const li = document.createElement("li");
      li.className = "todo-item";
      
      // Highlight overdue tasks
      if (new Date(todo.reminderTime) < new Date()) {
        li.style.borderLeft = "3px solid var(--danger)";
      }

      li.innerHTML = `
        <div class="todo-text">
          ${todo.text}
          <div class="todo-time">
            <i class="far fa-clock"></i> 
            ${new Date(todo.reminderTime).toLocaleString()}
          </div>
        </div>
        <button class="delete-btn" data-id="${doc.id}">
          <i class="fas fa-trash"></i>
        </button>
      `;
      todoList.appendChild(li);
    });
  });

// Delete Todo
document.addEventListener("click", (e) => {
  if (e.target.closest(".delete-btn")) {
    const id = e.target.closest(".delete-btn").getAttribute("data-id");
    db.collection("todos").doc(id).delete();
  }
});
document.getElementById("todo-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from refreshing the page
    
    const taskText = document.getElementById("todo-input").value;
    if (taskText === "") return;
  
    const taskItem = document.createElement("li");
    taskItem.textContent = taskText;
  
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");
    
    deleteButton.addEventListener("click", function() {
      taskItem.remove();
    });
  
    taskItem.appendChild(deleteButton);
    document.getElementById("todo-list").appendChild(taskItem);
    
    document.getElementById("todo-input").value = ""; // Clear input field
});
  
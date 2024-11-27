let numIncompleteCount = 0;
let numCompleteCount = 0;

const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const incompleteList = document.getElementById("incomplete-list");
const incompleteCount = document.getElementById("incomplete-count");
const completeList = document.getElementById("complete-list");
const completeCount = document.getElementById("complete-count");

todoForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from refreshing the page
    
    const taskText = todoInput.value;
    if (taskText === "") return;
  
    const taskItem = document.createElement("li");
    const checkBoxAndText = document.createElement("div");
    checkBoxAndText.classList.add("row")

    // add complete checkbox
    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.addEventListener("change", function() {
      const parent = checkBox.parentElement.parentElement; // parent in this case meaning <li>
      const grandparent = parent.parentElement;
      if (grandparent && grandparent.id === "incomplete-list") {
        completeList.appendChild(parent);
        incompleteCount.textContent = --numIncompleteCount;
        completeCount.textContent = ++numCompleteCount;
      } else {
        incompleteList.appendChild(parent);
        completeCount.textContent = --numCompleteCount;
        incompleteCount.textContent = ++numIncompleteCount;
      }
    });
    checkBoxAndText.appendChild(checkBox);

    // add task text
    const text = document.createElement("p");
    text.textContent = taskText;
    checkBoxAndText.appendChild(text);
    taskItem.appendChild(checkBoxAndText);
  
    // add delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");
    
    deleteButton.addEventListener("click", function() {
      // decrement based on parent
      const grandparent = deleteButton.parentElement.parentElement;
      console.log(grandparent.id);
      if (grandparent && grandparent.id === "incomplete-list") {
        incompleteCount.textContent = --numIncompleteCount;
      } else if (grandparent && grandparent.id === "complete-list") {
        completeCount.textContent = --numCompleteCount;
      }
      taskItem.remove();
    });
    taskItem.appendChild(deleteButton);

    incompleteList.appendChild(taskItem);
    incompleteCount.textContent = ++numIncompleteCount;
    todoInput.value = ""; // Clear input field
});
  
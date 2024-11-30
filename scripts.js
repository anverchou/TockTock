let numIncompleteCount = 0;
let numCompleteCount = 0;

const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const incompleteList = document.getElementById("incomplete-list");
const incompleteCount = document.getElementById("incomplete-count");
const completeList = document.getElementById("complete-list");
const completeCount = document.getElementById("complete-count");

// Load data if it's already there
window.addEventListener('DOMContentLoaded', () => {
  const todoIncompleteList = JSON.parse(localStorage.getItem('incomplete-list')) || [];
  const todoCompleteList = JSON.parse(localStorage.getItem('complete-list')) || [];
  todoIncompleteList.forEach(taskText => addTodoToDom(taskText, incompleteList, incompleteCount, false));
  todoCompleteList.forEach(taskText => addTodoToDom(taskText, completeList, completeCount, false));
});

todoForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from refreshing the page
    
    const taskText = todoInput.value;
    if (taskText === "") return;
  
    addTodoToDom(taskText, incompleteList, incompleteCount, true);
    
    todoInput.value = ""; // Clear input field
});
  
function addTodoToDom(taskText, list, count, addToLocalStorage) {
  const taskItem = document.createElement("li");
  const checkBoxAndText = document.createElement("div");
  checkBoxAndText.classList.add("row");

  // add complete checkbox
  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  if (list == completeList) checkBox.checked = true;
  checkBox.addEventListener("change", function() {
    const parent = checkBox.parentElement.parentElement; // parent in this case meaning <li>
    const grandparent = parent.parentElement;
    if (grandparent && grandparent.id === "incomplete-list") {
      removeTaskToLocalStorage(taskText, incompleteList);
      addTaskToLocalStorage(taskText, completeList);
      completeList.appendChild(parent);
      incompleteCount.textContent = --numIncompleteCount;
      completeCount.textContent = ++numCompleteCount;
    } else {
      removeTaskToLocalStorage(taskText, completeList);
      addTaskToLocalStorage(taskText, incompleteList);
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
      removeTaskToLocalStorage(taskText, incompleteList);
      incompleteCount.textContent = --numIncompleteCount;
    } else if (grandparent && grandparent.id === "complete-list") {
      removeTaskToLocalStorage(taskText, completeList);
      completeCount.textContent = --numCompleteCount;
    }
    taskItem.remove();
  });
  taskItem.appendChild(deleteButton);

  if (addToLocalStorage) addTaskToLocalStorage(taskText, list);
  list.appendChild(taskItem);
  if (list == incompleteList) count.textContent = ++numIncompleteCount;
  else count.textContent = ++numCompleteCount;
}

function addTaskToLocalStorage(taskText, list) {
  let listName = list == incompleteList ? "incomplete-list" : "complete-list";
  let storedTodos = JSON.parse(localStorage.getItem(listName)) || [];
  storedTodos.push(taskText);
  localStorage.setItem(listName, JSON.stringify(storedTodos));
}

function removeTaskToLocalStorage(taskText, list) {
  let listName = list == incompleteList ? "incomplete-list" : "complete-list";
  let storedTodos = JSON.parse(localStorage.getItem(listName)) || [];
  storedTodos = storedTodos.filter(item => item !== taskText);
  localStorage.setItem(listName, JSON.stringify(storedTodos));
}
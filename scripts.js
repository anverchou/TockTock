let numIncompleteCount = 0;
let numCompleteCount = 0;

const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const incompleteList = document.getElementById("incomplete-list");
const incompleteCount = document.getElementById("incomplete-count");
const completeList = document.getElementById("complete-list");
const completeCount = document.getElementById("complete-count");
let selectedTaskDom = null;

const titleNotes = document.getElementById("title-notes");
const textNotes = document.getElementById("text-notes");

// Load data if it's already there
window.addEventListener('DOMContentLoaded', () => {
  const todoIncompleteList = JSON.parse(localStorage.getItem('incompleteList')) || [];
  const todoCompleteList = JSON.parse(localStorage.getItem('completeList')) || [];
  todoIncompleteList.forEach(taskText => addTodoToDom(taskText, incompleteList, incompleteCount, false));
  todoCompleteList.forEach(taskText => addTodoToDom(taskText, completeList, completeCount, false));

  const selectedTask = localStorage.getItem("selectedTask");
  if (selectedTask != null) {
    const listItems = document.querySelectorAll('li');
    selectedTaskDom = Array.from(listItems).find((li) => {
      const paragraph = li.querySelector('p');
      if (paragraph && paragraph.textContent.trim() === selectedTask) return this;
    });
    selectedTaskDom.classList.add("selected");

    const selectedTaskNotes = localStorage.getItem(selectedTask);
    addNotesToRightSide(selectedTask, selectedTaskNotes);
  }
});

todoForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from refreshing the page
    
    const taskText = todoInput.value;
    if (taskText === "") return;
  
    addTodoToDom(taskText, incompleteList, incompleteCount, true);
    
    todoInput.value = ""; // Clear input field
});

function addNotesToRightSide(title, text) {
  titleNotes.textContent = title;
  if (text != null) textNotes.textContent = text;
};

function clearNotes() {
  titleNotes.textContent = "";
  textNotes.textContent = "";
}
  
// TODO: prevent duplicate note titles
function addTodoToDom(taskText, list, count, addToLocalStorage) {
  const taskItem = document.createElement("li");
  taskItem.addEventListener("click", function() {
    selectTask(this);
  });

  const checkBoxAndText = document.createElement("div");
  checkBoxAndText.classList.add("row");

  // add complete checkbox
  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  if (list == completeList) checkBox.checked = true;
  checkBox.addEventListener("change", function() {
    moveTask(this, taskText);
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
  deleteButton.addEventListener("click", function(event) { // when delete button is pressed
    event.stopPropagation();
    deleteTask(this, taskText, taskItem);
  });
  taskItem.appendChild(deleteButton);

  if (addToLocalStorage) addTaskToLocalStorage(taskText, list);
  list.appendChild(taskItem);
  if (list == incompleteList) count.textContent = ++numIncompleteCount;
  else count.textContent = ++numCompleteCount;
}

// when tasks are clicked
function selectTask(task) {
  if (selectedTaskDom != null) selectedTaskDom.classList.remove("selected");
  task.classList.add("selected");
  selectedTaskDom = task;
  const selectedTask = selectedTaskDom.querySelector('p').textContent;
  addNotesToRightSide(selectedTask, null);
  localStorage.setItem("selectedTask", selectedTask);
};

// when tasks are complete/incomplete
function moveTask(checkBox, taskText) {
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
}

// when task is deleted
function deleteTask(deleteButton, taskText, taskItem) {
  const grandparent = deleteButton.parentElement.parentElement;
  if (grandparent && grandparent.id === "incomplete-list") {
    removeTaskToLocalStorage(taskText, incompleteList);
    incompleteCount.textContent = --numIncompleteCount;
  } else if (grandparent && grandparent.id === "complete-list") {
    removeTaskToLocalStorage(taskText, completeList);
    completeCount.textContent = --numCompleteCount;
  }
  taskItem.remove();
  if (taskText == localStorage.getItem("selectedTask")) localStorage.removeItem("selectedTask");
  clearNotes()
}

function addTaskToLocalStorage(taskText, list) {
  let listName = list == incompleteList ? "incompleteList" : "completeList";
  let storedTodos = JSON.parse(localStorage.getItem(listName)) || [];
  storedTodos.push(taskText);
  localStorage.setItem(listName, JSON.stringify(storedTodos));
};

function removeTaskToLocalStorage(taskText, list) {
  let listName = list == incompleteList ? "incompleteList" : "completeList";
  let storedTodos = JSON.parse(localStorage.getItem(listName)) || [];
  storedTodos = storedTodos.filter(item => item !== taskText);
  localStorage.setItem(listName, JSON.stringify(storedTodos));
};
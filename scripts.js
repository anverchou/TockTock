let numIncompleteCount = 0;
let numCompleteCount = 0;
let timer;

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

    addNotesToRightSide(selectedTask);
  }
});

window.addEventListener('beforeunload', () => {
  if (selectedTaskDom == null) return;

  const selectedTask = selectedTaskDom.querySelector('p').textContent;
  setNoteToLocalStorage(selectedTask, textNotes.value);
});

todoForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from refreshing the page
    
    const taskText = todoInput.value;
    todoInput.value = "";

    if (taskText === "") {
      return;
    } else if (checkDuplicateTask(taskText)) {
      alert("Duplicate notes title aren't allowed");
      return;
    } else if (taskText === "completeList" || taskText === "incompleteList" || taskText === "selectedTask") {
      alert(taskText + " is a reversed word for this application");
      return;
    }
  
    addTodoToDom(taskText, incompleteList, incompleteCount, true);
});

textNotes.addEventListener("input", () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    const selectedTask = selectedTaskDom.querySelector('p').textContent;
    setNoteToLocalStorage(selectedTask, textNotes.value);
  }, 500); // Save after 500ms of inactivity
});

function checkDuplicateTask(taskText) {
  const allTasks = document.querySelectorAll("li");
  for (const task of allTasks) {
    const paragraph = task.querySelector('p');
    if (paragraph && paragraph.textContent.trim() === taskText) return true;
  }

  return false;
};

function addNotesToRightSide(title) {
  titleNotes.textContent = title;
  const note = localStorage.getItem(title);
  if (note != null) textNotes.value = note;
  else textNotes.value = "";
};

function clearNotes() {
  titleNotes.textContent = "";
  textNotes.value = "";
}
  
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
  textNotes.style.display = "block";
  if (selectedTaskDom != null) selectedTaskDom.classList.remove("selected");
  task.classList.add("selected");
  selectedTaskDom = task;
  const selectedTask = selectedTaskDom.querySelector('p').textContent;
  addNotesToRightSide(selectedTask);
  localStorage.setItem("selectedTask", selectedTask);
};

// when tasks are complete/incomplete
function moveTask(checkBox, taskText) {
  const parent = checkBox.parentElement.parentElement; // parent in this case meaning <li>
  const grandparent = parent.parentElement;
  if (grandparent && grandparent.id === "incomplete-list") {
    removeTaskFromLocalStorage(taskText, incompleteList);
    addTaskToLocalStorage(taskText, completeList);
    completeList.appendChild(parent);
    incompleteCount.textContent = --numIncompleteCount;
    completeCount.textContent = ++numCompleteCount;
  } else {
    removeTaskFromLocalStorage(taskText, completeList);
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
    removeTaskFromLocalStorage(taskText, incompleteList);
    incompleteCount.textContent = --numIncompleteCount;
  } else if (grandparent && grandparent.id === "complete-list") {
    removeTaskFromLocalStorage(taskText, completeList);
    completeCount.textContent = --numCompleteCount;
  }
  taskItem.remove();
  if (taskText == localStorage.getItem("selectedTask")) {
    textNotes.style.display = "none";
    localStorage.removeItem("selectedTask");
  }
  removeNoteFromLocalStorage(taskText);
  clearNotes()
}

function addTaskToLocalStorage(taskText, list) {
  let listName = list == incompleteList ? "incompleteList" : "completeList";
  let storedTodos = JSON.parse(localStorage.getItem(listName)) || [];
  storedTodos.push(taskText);
  localStorage.setItem(listName, JSON.stringify(storedTodos));
};

function removeTaskFromLocalStorage(taskText, list) {
  let listName = list == incompleteList ? "incompleteList" : "completeList";
  let storedTodos = JSON.parse(localStorage.getItem(listName)) || [];
  storedTodos = storedTodos.filter(item => item !== taskText);
  localStorage.setItem(listName, JSON.stringify(storedTodos));
};

function setNoteToLocalStorage(taskText, note)  {
  note = note.trim()
  if (note.length === 0) {
    removeNoteFromLocalStorage(taskText);
    return;
  }

  localStorage.setItem(taskText, note);
};

function removeNoteFromLocalStorage(taskText) {
  localStorage.removeItem(taskText);
}
// Imports
import ImportantIcon from "../../assets/icons/important_icon.png";
import { handleCancel, handleSubmit } from "./branch";
import { format } from "date-fns";
import { clearMainArea, mainArea } from "./dom";
import { todoList } from "./template";

// Create reusable markup method to create a task tile
function createTaskTile(task) {
  // create id for checkbox
  const checkboxId = `checklist-${task.id}`;

  // create markup
  const htmlString = `
    <li class="item task-item">
      <div class="tile">
        <span class="checkbox">
          <input type="checkbox" id="${checkboxId}" class="checklist-btn">
        </span>
        <button type="button" class="task-item-title-wrapper">
          <span class="task-item-title">${task.title}</span>
          <span class="meta-data-info">Tasks</span>
        </button>
        <button type="button" class="importance-btn">
          <img src="${ImportantIcon}" alt="importance icon">
        </button>
      </div>
    </li>
  `;

  // convert html string to actual dom elements
  const template = document.createElement("template");
  template.innerHTML = htmlString.trim();

  // select the list item
  const taskItem = template.content.firstElementChild;

  // select markup elements
  const tile = taskItem.querySelector(".tile");
  const checkboxEl = taskItem.querySelector(`#${checkboxId}`);
  const titleEl = taskItem.querySelector(".task-item-title");
  const tileBtn = taskItem.querySelector(".task-item-title-wrapper");

  // handle checkbox click
  checkboxEl.addEventListener("change", () => {
    // toggle checklists
    task.toggleCheckList();
  });

  // handle completed task
  if (task.checkList) {
    checkboxEl.checked = true;
    titleEl.classList.add("strikethrough");
  }

  // handle tile click for expansion
  tileBtn.addEventListener("click", () => {
    tile.classList.add("expanded");
    // view task details
    // viewTaskDetails(task)
  });

  // return markup
  return taskItem;
}

// *
// Today's tasks : overdue tasks, & just today's tasks
// Completed tasks: overdue tasks, & all completed not more than one week before today
// Upcoming tasks: Overdue tasks, today's tasks, & task for the next 7 days which are not completed.

// Create a method to render grouped tasks
function renderGroupedTasks(groupTitle, groupedTasks = []) {
  // clear main area
  clearMainArea();

  // build markup
  const groupedTasksContainer = document.createElement("div");
  groupedTasksContainer.classList.add("grouped-task-container");

  const now = new Date();
  const currentDay = `${format(now, "eeee")}, ${format(now, "MMMM d")}`;

  const overdueTasks = renderOverdueTasks(todoList.getAllOverdueTasks());

  groupedTasksContainer.innerHTML = `
    <div class="group-header">
      <h1 class="group-title"> ${groupTitle}</h1>
      <div class="no-of-tasks">${groupedTasks.length}</div>
      <div class="current-date">${currentDay}</div>
    </div>
    <hr/>
  `;

  // attach overdue tasks
  groupedTasksContainer.appendChild(overdueTasks);

  // render grouped tasks
  if (groupedTasks.length > 0) {
    // create a section markup
    const section = document.createElement("section");
    section.classList.add("grouped-tasks");
    section.innerHTML = `<h3>Grouped Tasks</h3>`;

    // create an unorder list container,  attach to the section
    const tasks = document.createElement("ul");
    tasks.classList.add("tasks");
    section.appendChild(tasks);

    groupedTasksContainer.appendChild(section); // append section to the group container

    // loop through the grouped tasks and create a list tile for each
    groupedTasks.forEach((task) => {
      tasks.appendChild(createTaskTile(task));
    });
  }

  mainArea.appendChild(groupedTasksContainer);
}

// Create a method to render overdue tasks
function renderOverdueTasks(tasks = []) {
  // create the main container section
  const section = document.createElement("section");
  section.className = "overdue";

  // create heading and append to section
  const heading = document.createElement("h3");
  heading.textContent = "Overdue";
  section.appendChild(heading);

  // check if overdue tasks is empty, & render a add task button
  if (tasks.length === 0) {
    const addTaskBtn = document.createElement("button");
    addTaskBtn.type = "button";
    addTaskBtn.className = "add-task-btn";
    addTaskBtn.textContent = "Add Task";

    section.appendChild(addTaskBtn);

    // create form
    const form = createConciseAddTaskForm();

    // add listener to render form when button is clicked
    addTaskBtn.addEventListener("click", () => {
      form.classList.add("open");
      section.replaceChild(form, addTaskBtn);
    });

    // handle cancel button click
    handleCancel(section, form, addTaskBtn);

    // handle submit button click
    handleSubmit(section, form, addTaskBtn);

    return section;
  }

  // create list container
  const ul = document.createElement("ul");
  ul.className = "task-list";

  // create overdue tasks tiles
  tasks.forEach((task) => {
    const tile = createTaskTile(task);
    ul.appendChild(tile);
  });

  section.appendChild(ul);
  return section;
}

// UTILITY
// Create a method for generation of a concise add task form.
function createConciseAddTaskForm() {
  const form = document.createElement("form");
  form.className = "add-task-form-concise";
  form.innerHTML = `
        <h3>Create a New Task</h3>
        <div class="form-item">
            <input type="checkbox" id="checkbox" name="checklist">
            <input type="text" name="title" id="title" placeholder="Read for 3 hours..." required>
        </div>
        <div class="form-actions">
            <button  type = "button" class="cancel-btn">Cancel</a>
            <button type = "submit" class="add-task-btn">Add</button>
        </div>
      `;
  return form;
}

export { createTaskTile, renderGroupedTasks };

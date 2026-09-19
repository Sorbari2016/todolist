// Imports
import ImportantIcon from "../../assets/icons/important_icon.png";
import { handleCancel, handleSubmit, renderMyProjects } from "./branch";
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

  const overdueTasks = renderOverdueTasks(todoList.getAllOverdueTasks());

  groupedTasksContainer.innerHTML = `
    <div class="group-header">
      <h1 class="group-title"> ${groupTitle}</h1>
      <div class="no-of-tasks">${groupedTasks.length}</div>
      <div class="current-date"></div>
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
    section.innerHTML = `<h3>Grouped</h3>`;

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

  // add date content
  const now = new Date();
  displayDate(now, "EEEE, MMMM d", ".current-date");
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
    handleSubmit(form, "task", "project", section, addTaskBtn);

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

function renderProjectArea(projectName, tasks = []) {
  // create markup
  const container = document.createElement("div");
  container.classList.add("project-container");
  container.innerHTML = `
  <div class="project-header">
    <h1 class="project-title">${projectName}</h1>
  </div>
  <section class="task-container">
    <ul class="tasks">
    </ul>
  </section>
  <div class="project-area-action">
    <button type="button" class="add-task-btn">Add Task </button>
  </div>
  <div class="project-area-nav item"> 
    <button type="button" class="back-btn">Go back</button>
  </div>
  `;

  // render tasks
  const ul = container.querySelector(".tasks");
  tasks.forEach((task) => {
    ul.appendChild(createTaskTile(task));
  });
  mainArea.appendChild(container);

  // handle back button
  container.querySelector(".back-btn").addEventListener("click", () => {
    const folders = todoList.listManager.directory;
    renderMyProjects(folders);
  });

  const projectAreaAction = container.querySelector(".project-area-action");

  // handle add task button
  const form = createConciseAddTaskForm();

  const addTaskBtn = container.querySelector(".add-task-btn");
  addTaskBtn.addEventListener("click", () => {
    form.classList.add("open");
    projectAreaAction.replaceChild(form, addTaskBtn);
  });

  // handle cancel button action
  handleCancel(projectAreaAction, form, addTaskBtn);

  // handle add task button
  handleSubmit(form, "task", projectName, projectAreaAction, addTaskBtn);
}

// Create function to add task in the main area
function addMainAreaTask() {
  // get main area static form
  const form = mainArea.querySelector(".add-task-form-concise-m");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // disable checkbox
    const checkbox = form.querySelector("input[type='checkbox']");
    checkbox.disbled = true;

    // get data
    const data = new FormData(form);
    const title = data.get("title")?.trim();

    if (!title) {
      alert("Your task must have a title");
      return;
    }

    const newTask = todoList.add(title);

    if (newTask) {
      // create newly created form tasks tile, & append to tasks
      const tasks = mainArea.querySelector(".added-task-list .tasks");
      const tile = createTaskTile(newTask);
      tasks.appendChild(tile);
    }

    form.reset();
    checkbox.disabled = false;
  });
}

// UTILITY
// Create a method for generation of a concise add task form.
function createConciseAddTaskForm() {
  const form = document.createElement("form");
  form.className = "add-task-form-concise";
  form.innerHTML = `
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

// Create a method to render the number of grouped task within sidebar
function displayNumberOfTasks(elementId, numberOfTasks) {
  // check if element exists
  const el = document.getElementById(elementId);
  if (!el) throw new Error("Element not found !");

  // display content
  el.textContent = numberOfTasks.length;
}

// Create a method to render date in any format usig date-fins
function displayDate(date, dateFormat, targetElement) {
  const el = document.querySelector(targetElement);

  if (!el) throw new Error("Element doesnt exist in the DOM");

  el.textContent = format(date, dateFormat);
}

export {
  createTaskTile,
  renderGroupedTasks,
  displayNumberOfTasks,
  renderProjectArea,
  displayDate,
  addMainAreaTask,
};

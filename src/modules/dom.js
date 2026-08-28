// DOM LOGIC, & METHODS

// imports
import priorityIcon from "../../assets/icons/priority_flag.png";
import sunnyIcon from "../../assets/icons/sunny.png";
import sortIcon from "../../assets/icons/arrow.png";
import groupIcon from "../../assets/icons/group-icon.png";
import calendarIcon from "../../assets/icons/calendar.png";
import notificationIcon from "../../assets/icons/bell.png";
import repeatIcon from "../../assets/icons/repeat.png";
import { renderMyProjects, addProject } from "./branch";
import { format } from "date-fns";

// Hamburger method
// select elements
const sidebar = document.getElementById("sidebar");
const hamburger = document.getElementById("hamburger-btn");
const overlay = document.querySelector(".overlay");

// create handler to handle sidebar button click
hamburger.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
});

// create a handler to handle overlay click
overlay.addEventListener("click", () => {
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
});

// MAIN AREA MANIPULATION
const mainArea = document.getElementById("main-area");

// Create method to clear main area
function clearMainArea() {
  mainArea.innerHTML = "";
}

// Creea function to re-render main area
function renderMainArea() {
  mainArea.innerHTML = `
          <div class="toolbar">
            <div class="toolbar-top">
              <div class="toolbar-headline">
                <div class="title">
                  <img
                    src="${sunnyIcon}"
                    alt="sunny day icon"
                  /><span>My Day</span>
                </div>
                <div class="today-date"></div>
              </div>
              <div class="toolbar-right">
                <ul class="toolbar-nav">
                  <li class="item main-item">
                    <button id="sort" class="btn click-btn">
                      <img src="${sortIcon}" alt="sort icon" />
                      Sort
                    </button>
                  </li>
                  <li class="item main-item">
                    <button id="group" class="btn click-btn">
                      <img
                        src="${groupIcon}"
                        alt="group icon"
                      />
                      Group
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div class="toolbar-children"></div>
          </div>
          <div class="flex-container">
            <div class="add-task-container">
              <div class="add-task-top">
                <input type="checkbox" class="checklist-btn" />
                <input
                  type="text"
                  name="addTask"
                  id="add-task"
                  maxlength="255"
                  placeholder="Add a task"
                />
              </div>
              <div class="add-task-bottom">
                <div class="add-task-icons">
                  <ul>
                    <li class="item main-item">
                      <img
                        src="${calendarIcon}"
                        alt="calender icon"
                      />
                    </li>
                    <li class="item main-item">
                      <img
                        src="${notificationIcon}"
                        alt="notification icon"
                      />
                    </li>
                    <li class="item main-item">
                      <img src="${repeatIcon}" alt="repeat icon"/>
                    </li>
                  </ul>
                </div>
                <button id="add-btn" type="submit" class="click-btn">Add</button>
              </div>
            </div>
            <div class="added-task-list">
              <ul></ul>
            </div>
          </div>
  `;
}

// Add Event delegation on the sidebar top section
[...document.getElementById("sidebar").children][0].addEventListener(
  "click",
  (e) => {
    if (e.target.tagName === "BUTTON") {
      const buttonID = e.target.getAttribute("id");

      if (buttonID === "add-task-sidebar") {
        getAddTaskForm();
      }
    }
  },
);

// Create a method for the add task button
function getAddTaskForm() {
  // clear the main area
  clearMainArea();

  // create form element
  const form = document.createElement("form");
  form.setAttribute("id", "add-task-form");

  // create form markup
  form.innerHTML = `
        <h2>Create a New Task</h2>
        <div class="form-item">
            <input type="checkbox" id="checkbox" name="checklist">
            <input type="text" name="title" id="title" placeholder="Read for 3 hours..." required>
        </div>
        <div class="form-item">
            <textarea name="desc" id="desc" placeholder="Describe your task"></textarea>
        </div>
        <div class="form-item">
            <input type="date" id="due-date" name="dueDate">
        </div>
        <div class="form-item">
            <input type="text" name="note" id="note" placeholder="Add a note...">
        </div>
        <div class="form-item">
            <img src="${priorityIcon}" alt="priority icon">
            <select name="priority" id="priority">
                <option value="">--Select a priority level</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
        </div>
        <div class="form-actions">
            <button  type = "button" class="cancel-btn">Cancel</a>
            <button type = "submit" class="add-task-btn">Add</button>
        </div>
    `;
  // append to main area
  mainArea.appendChild(form);

  // add event handler for the cancel btn
  form.querySelector(".cancel-btn").addEventListener("click", () => {
    clearMainArea();
    renderMainArea();
  });

  // add event handler, for the submit button
  form.addEventListener("submit", (e) => {
    // disable checkbox
    form.querySelector("#checkbox").disabled = true;

    // get the other values
    const title = form.querySelector("#title").value.trim();
    const desc = form.querySelector("#desc").value.trim();
    const dueDate = form.querySelector("#due-date").value.trim();
    const note = form.querySelector("#note").value.trim();
    const priorityLevel = form.querySelector("#priority").value.trim();

    // ensure task has a title
    if (!title) {
      alert("Your task must have a title");
      return;
    }

    // add task
    // update local storage
  });
}

// mock data
const projects = [{ title: "Fuck Suanle" }, { title: "Pray" }];

// Handle buttons with the class click-btn
document.querySelectorAll(".click-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const buttonID = e.target.getAttribute("id");

    switch (buttonID) {
      case "my-projects":
        renderMyProjects(projects);
        break;
      case "add-project":
        addProject();
        break;
      case "sort":
        sort();
        break;
      case "group":
        group();
        break;
      case "add-btn":
        addTask();
      default:
        // do nothing
        break;
    }
  });
});

// Create dynamic date content
const now = new Date();
const currentDay = `${format(now, "eeee")}, ${format(now, "MMMM d")}`;
mainArea.querySelector(".today-date").textContent = currentDay;

export { clearMainArea, mainArea };

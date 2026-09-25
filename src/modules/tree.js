// Imports
import { todoList } from "./template";
import deleteIcon from "../../assets/icons/trash.png";
import descriptionIcon from "../../assets/icons/description.png";
import noteIcon from "../../assets/icons/notes.png";
import { calendarIcon, clearMainArea, mainArea, priorityIcon } from "./dom";
import { displayDate, ImportantIcon } from "./node";

console.log(todoList.listManager.directory);

// Create a details block
function createDetailBlock({
  icon,
  inputType,
  id,
  name,
  placeholder = "",
  options = [],
}) {
  let inputElement = "";

  if (inputType === "textarea") {
    inputElement = `<textarea id="${id}" name="${name}" class="change" placeholder="${placeholder}"></textarea>`;
  } else if (inputType === "select") {
    const optionElements = options
      .map(
        (option) => `<option value="${option.value}">${option.label}</option>`,
      )
      .join("");
    inputElement = `<select id="${id}" name ="${name}" class="change">${optionElements}</select>`;
  } else {
    inputElement = `<input type="${inputType}" id="${id}" name="${name}" class="change" placeholder="${placeholder}">`;
  }

  return `
      <div class="detail">
        <span class="item"> 
          <button type="button"> 
            <img src="${icon}">
          </button>
          ${inputElement}
        </span>
      </div>
    `;
}

// Create a function to view task details
function showTaskDetails(task) {
  // check if task has already been clicked
  if (mainArea.contains(mainArea.querySelector(".left-main-area"))) {
    const rightMain = mainArea.querySelector(".right-main-area");
    rightMain.innerHTML = "";
    renderTaskDetails(task.id, rightMain);
    // get created date
    displayDate(task.createdAt, "EE, MMMM d", ".date-created");
    return;
  }
  // Divide main area into two portions
  // left
  const leftMain = document.createElement("div");
  leftMain.classList.add("left-main-area");

  const mainAreaContents = mainArea.children[0];
  mainArea.replaceChild(leftMain, mainAreaContents);
  leftMain.appendChild(mainAreaContents);

  // right
  const rightMain = document.createElement("div");
  rightMain.classList.add("right-main-area");

  // create details markup
  renderTaskDetails(task.id, rightMain);

  mainArea.appendChild(rightMain);

  // get created date
  displayDate(task.createdAt, "EE, MMMM d", ".date-created");
}

// Create a method to render the details markup on the right side
function renderTaskDetails(taskId, element) {
  const task = todoList.getById(taskId);

  if (!task) throw new Error("Task not found!");

  // create id for checkbox
  const checkboxId = `checklist-${task.id}`;

  element.innerHTML = "";

  const detailsHtml = `
   <div class="details-pane">
      <div class="details-body">
        <ul class="details-header">
          <li class="item detail">
              <div class="task-title">
                <span class="checkbox">
                  <input type="checkbox" id="${checkboxId}" class="checklist-btn">
                </span>
                <button type="button" class="task-item-title-wrapper">
                  <span class="task-item-title">${task.title}</span>
                  <span class="meta-data-info">Task</span>
                </button>
                <button type="button" class="importance-btn">
                  <img src="${ImportantIcon}" alt="importance icon">
                </button>
              </div>
          </li>
        </ul>
        <div class="details-main">
            ${createDetailBlock({ icon: descriptionIcon, inputType: "textarea", id: "description", name: "desc", placeholder: "Description" })}
            ${createDetailBlock({ icon: calendarIcon, inputType: "date", id: "dueDate", name: "dueDate" })}
            ${createDetailBlock({ icon: noteIcon, inputType: "textarea", id: "note", name: "note", placeholder: "Add a Note..." })}
            ${createDetailBlock({
              icon: priorityIcon,
              inputType: "select",
              id: "priority",
              name: "priority",
              options: [
                { value: "", label: "--Select a priority level--" },
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
              ],
            })}
        <hr/>
        </div>
      </div>
      <div class="details-footer">
         <span class="item">
            <div class="date-created">Created on</div>
            <button type="button">
                <img src="${deleteIcon}" alt="delete icon">
            </button>
         </span>
      </div>
   </div>`;

  const template = document.createElement("template");
  template.innerHTML = detailsHtml.trim();

  return element.appendChild(template.content.firstElementChild);
}

export { showTaskDetails };

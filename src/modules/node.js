// Imports
import ImportantIcon from "../../assets/icons/important_icon.png";

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

  const tile = document.querySelector(".tile");

  // get checkbox element, & title text
  const checkboxEl = tile.querySelector(`#${checkboxId}`);
  const titleEl = tile.querySelector(".task-item-title");

  // handle checkbox click
  checkboxEl.addEventListener("change", () => {
    // toggle checklist
    task.toggleCheckList();
  });

  // handle completed task
  if (task.checkList) {
    checkboxEl.checked = true;
    titleEl.classList.add("strikethrough");
  }

  // handle tile click for expansion
  const tileBtn = tile.querySelector(".task-item-title-wrapper");
  tileBtn.addEventListener("click", () => {
    tile.classList.add("expanded");
    // view task details
    //viewTaskDetails(task)
  });

  const template = document.createElement("template");
  template.innerHTML = htmlString.trim();

  return template.content.firstElementChild;
}

export { createTaskTile };

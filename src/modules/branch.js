// CLICK BUTTONS DOM
import { clearMainArea, mainArea } from "./dom";

// Create a dom method to render projects
function renderMyProjects(projects) {
  // clear main area
  clearMainArea();

  // create project html
  const container = document.createElement("div");
  container.classList.add("projects-container");

  container.innerHTML = `
        <h2>My Projects</h2>
        <div class="project-area">
            <ul class="projects-main"></ul>
        </div>
        <div class="new-project">
            <button type="button" class="btn">Add project</button>
        </div>
    `;

  mainArea.appendChild(container);

  // create project list items
  const projectList = document.querySelector(".projects-main");
  projects.forEach((project) => {
    const item = document.createElement("li");
    // each list should be a tile
    item.classList.add("item");
    item.textContent = project.title;

    projectList.appendChild(item);
  });

  // handle add project button
  const newProjectContainer = mainArea.querySelector(".new-project");
  const newProjectBtn = newProjectContainer.firstElementChild;
  newProjectBtn.addEventListener("click", () => {
    // create form
    const form = createAddProjectForm();
    form.classList.add("open");

    // replace Add project button with the form
    newProjectContainer.replaceChild(form, newProjectBtn);

    // handle cancel & add button events
    handleCancel(newProjectContainer, form, newProjectBtn);

    // handle submit button event
    handleSubmit(newProjectContainer, form, newProjectBtn);
  });
}

function addProject() {
  // select the add project button
  const projects = document.querySelector(".projects");

  // replace add button with form
  const form = createAddProjectForm();
  form.classList.add("open");
  const plusBtn = projects.children[1];
  projects.replaceChild(form, plusBtn);

  // manage cancel btn event
  handleCancel(projects, form, plusBtn);

  // manage submit button event
  handleSubmit(projects, form, plusBtn);
}

// UTILITIES

// Create add Project form
function createAddProjectForm() {
  const htmlString = `
        <form id="new-project-form">
            <div class="form-item">
                <input
                    type="text"
                    name="add-project"
                    id="project-name"
                    placeholder="Add a project"
                >
            </div>
            <div class="form-actions">
                <button type="button" class="btn cancel-btn">Cancel</button>
                <button type="submit" class="btn add-project-btn">Add</button>
            </div>
        </form>
    `;

  // make it an actual node
  const template = document.createElement("template");
  template.innerHTML = htmlString.trim();

  // return actual dom
  return template.content.firstElementChild;
}

// Create a method to handle cancel btn
function handleCancel(parent, oldElement, newElelemt) {
  oldElement.querySelector(".cancel-btn").addEventListener("click", () => {
    oldElement.classList.remove("open");
    parent.replaceChild(newElelemt, oldElement);
  });
}

// Create a method to handle submit btn
function handleSubmit(parent, oldElement, newElelemt) {
  oldElement.addEventListener("submit", (e) => {
    e.preventDefault();

    // add project
    // update local storage

    // replace elements
    parent.replaceChild(newElelemt, oldElement);
  });
}

export { renderMyProjects, addProject };

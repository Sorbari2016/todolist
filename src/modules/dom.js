// DOM LOGIC, & METHODS

// Hamburger method
// select elements
const sidebar = document.getElementById("sidebar");
const hamburger = document.getElementById("hamburger-btn");
const overlay = document.querySelector(".overlay");

console.log(sidebar, hamburger, overlay);

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
    <main id="main-area">
          <div class="toolbar">
            <div class="toolbar-top">
              <div class="toolbar-headline">
                <div class="title">
                  <img
                    src="../assets/icons/sunny.png"
                    alt="sunny day icon"
                  /><span>My Day</span>
                </div>
                <div class="today-date"></div>
              </div>
              <div class="toolbar-right">
                <ul class="toolbar-nav">
                  <li class="item main-item">
                    <button id="sort" class="btn click">
                      <img src="/assets/icons/arrow.png" alt="sort icon" />
                      Sort
                    </button>
                  </li>
                  <li class="item main-item">
                    <button id="group" class="btn click">
                      <img
                        src="../assets/icons/group-icon.png"
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
              <span class="add-task-top">
                <input type="checkbox" class="checklist-btn" />
                <input
                  type="text"
                  name="addTask"
                  id="add-task"
                  maxlength="255"
                  placeholder="Add a task"
                />
              </span>
              <span class="add-task-bottom">
                <div class="add-task-icons">
                  <ul>
                    <li class="item main-item">
                      <img
                        src="../assets/icons/calendar.png"
                        alt="calender icon"
                      />
                    </li>
                    <li class="item main-item">
                      <img
                        src="../assets/icons/bell.png"
                        alt="notification icon"
                      />
                    </li>
                    <li class="item main-item">
                      <img src="../assets/icons/repeat.png" alt="repeat icon" />
                    </li>
                  </ul>
                </div>
                <button id="addBtn" type="submit">Add</button>
              </span>
            </div>
            <div class="added-task-list">
              <ul></ul>
            </div>
          </div>
        </main>
  `;
}

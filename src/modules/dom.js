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

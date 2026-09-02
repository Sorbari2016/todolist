import { saveToLocalStorage } from "./storage";

// Create list item blueprint
class Todo {
  constructor(title, desc = "", dueDate = null, priority = "low", notes = "") {
    this.id = crypto.randomUUID();
    this.createdAt = new Date();
    this.title = title;
    this.desc = desc;
    this.dueDate = dueDate ? new Date(dueDate) : null;
    this.priority = priority.toLowerCase();
    this.notes = notes;
    this.checkList = false; // true means completed
    this.updatedAt = new Date();
  }

  changePriority(newLevel) {
    const levels = ["high", "medium", "low"];
    if (!newLevel || newLevel.toLowerCase() === this.priority) return;

    const normalizedLevel = newLevel.toLowerCase();
    if (!levels.includes(normalizedLevel)) {
      throw new Error("Level must be high, medium, or low");
    }

    this.priority = normalizedLevel;
    this.updatedAt = new Date();
  }

  toggleCheckList() {
    this.checkList = !this.checkList;
    this.updatedAt = new Date();
  }
}

// Create Folder blueprint
class Folder {
  constructor(name) {
    this.id = crypto.randomUUID();
    this.createdAt = new Date();
    this.name = name;
    this.lists = [];
    this.updatedAt = new Date();
  }

  addTodo(todo) {
    this.lists.push(todo);
    this.updatedAt = new Date();
  }

  removeTodo(todoId) {
    const index = this.lists.findIndex((t) => t.id === todoId);
    if (index === -1) throw new Error("Todo not found in folder");
    this.lists.splice(index, 1);
    this.updatedAt = new Date();
  }

  getLists() {
    return this.lists;
  }

  getNumberOfLists() {
    return this.lists.length;
  }

  getCompletedLists() {
    return this.lists.filter((todo) => todo.checkList);
  }
}

// Create a Folder manager blueprint
class FolderManager {
  constructor() {
    this.directory = [];
  }

  get size() {
    return this.directory.length;
  }

  getFolders() {
    return this.directory;
  }

  getFolderById(folderId) {
    return this.directory.find((f) => f.id === folderId);
  }

  getFolderByName(name) {
    return this.directory.find(
      (f) => f.name.toLowerCase() === name.toLowerCase(),
    );
  }

  addFolder(name = "untitled") {
    const newFolder = new Folder(name);
    this.directory.push(newFolder);
    return newFolder;
  }

  renameFolder(folderId, newName) {
    const folder = this.getFolderById(folderId);
    if (!folder) throw new Error("Folder not found!");
    folder.name = newName;
    folder.updatedAt = new Date();
  }

  deleteFolder(folderId) {
    const index = this.directory.findIndex((f) => f.id === folderId);
    if (index === -1) throw new Error("Folder not found!");
    this.directory.splice(index, 1);
  }
}

// Create todolist blueprint to manage lists
class TodoList {
  constructor() {
    this.listManager = new FolderManager();
    this.defaultProject = this.listManager.addFolder("project");
  }

  getAll() {
    return this.listManager.directory.flatMap((folder) => folder.getLists());
  }

  getById(todoId) {
    return this.getAll().find((todo) => todo.id === todoId);
  }

  add(
    title,
    desc = "",
    dueDate = null,
    priority = "low",
    notes = "",
    projectName = "project",
  ) {
    const newTodo = new Todo(title, desc, dueDate, priority, notes);

    let targetFolder = this.listManager.getFolderByName(projectName);

    if (!targetFolder) {
      targetFolder = this.listManager.addFolder(projectName);
    }

    targetFolder.addTodo(newTodo);

    saveToLocalStorage(this.getAll());
    return newTodo;
  }

  update(todoId, updates = {}) {
    const todo = this.getById(todoId);
    if (!todo) throw new Error("Todo not found!");

    // update properties dynamically
    if (updates.title !== undefined) todo.title = updates.title;
    if (updates.desc !== undefined) todo.desc = updates.desc;
    if (updates.notes !== undefined) todo.notes = updates.notes;
    if (updates.dueDate !== undefined)
      todo.dueDate = updates.dueDate ? new Date(updates.dueDate) : null;

    todo.updatedAt = new Date();
    saveToLocalStorage(this.getAll());
  }

  delete(todoId) {
    let found = false;
    for (const folder of this.listManager.directory) {
      try {
        folder.removeTodo(todoId);
        found = true;
        break;
      } catch {
        continue; // search next folder
      }
    }
    if (!found) throw new Error("Todo not found anywhere!");
    saveToLocalStorage(this.getAll());
  }

  getAllCompletedTasks() {
    return this.getAll().filter((todo) => todo.checkList);
  }

  getAllTodayTasks() {
    const todayStr = new Date().toDateString();
    return this.getAll().filter(
      (todo) => todo.dueDate && todo.dueDate.toDateString() === todayStr,
    );
  }

  getAllUpcomingTasks() {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return this.getAll().filter((todo) => todo.dueDate && todo.dueDate > today);
  }

  // create a method to find a searched tasks
  filterTasks(query) {
    // trim & split query
    const queryLetters = query.trim().split("");
  }
}

export { TodoList };

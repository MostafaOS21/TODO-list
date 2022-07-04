// Local Storage
let loc_len = window.localStorage.length;
if (loc_len > 0) {
  let arr = Object.entries(window.localStorage);
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][0] !== "dk-mode") {
      creation_of_task(arr[i][0], false);
      if (arr[i][1] === "true") {
        document.querySelectorAll(".cont p").forEach((p) => {
          if (p.textContent === arr[i][0]) {
            p.classList.add("done");
          }
        });
      } else {
        ++document.querySelector(".footer .nums").textContent;
      }
    }
  }
}

if (!window.localStorage.getItem("dk-mode")) {
  window.localStorage.setItem("dk-mode", false);
}

if (window.localStorage.getItem("dk-mode") === "true") {
  document.body.classList.add("night");
}
// Change mode [night-light]
function change_mode() {
  let mode = document.querySelector(".mode");
  let lightBg = document.querySelector(".light");
  let nightBg = document.querySelector(".night");

  mode.addEventListener("click", () => {
    document.body.classList.toggle("night");
    nightBg.classList.toggle("opacity-0");
    document.querySelector("img.night-mode").classList.toggle("active");
    if (document.body.classList.contains("night")) {
      window.localStorage.setItem("dk-mode", true);
    }
  });
}

change_mode();

// Main Wallpaper [desktop-mobile]

function change_wallpaper() {
  let light_wall = document.querySelector(".wallpaper-img .light");
  let night_wall = document.querySelector(".wallpaper-img .night");

  if (window.innerWidth <= 767) {
    light_wall.src = "todo-app-main/images/bg-mobile-light.jpg";
    night_wall.src = "todo-app-main/images/bg-mobile-dark.jpg";
  } else {
    light_wall.src = "todo-app-main/images/bg-desktop-light.jpg";
    night_wall.src = "todo-app-main/images/bg-desktop-dark.jpg";
  }

  window.onresize = function () {
    if (this.innerWidth <= 767) {
      light_wall.src = "todo-app-main/images/bg-mobile-light.jpg";
      night_wall.src = "todo-app-main/images/bg-mobile-dark.jpg";
    } else {
      light_wall.src = "todo-app-main/images/bg-desktop-light.jpg";
      night_wall.src = "todo-app-main/images/bg-desktop-dark.jpg";
    }
  };
}

change_wallpaper();

// Add tasks + add it to local storage

function add_tasks() {
  let add_todo = document.querySelector(".add-todo");

  add_todo.addEventListener("keypress", function (event) {
    if (
      event.key === "Enter" &&
      this.value.split(" ").join("") !== "" &&
      this.value.trim() !== "dk-mode"
    ) {
      // Input String
      let input_str = this.value.trim();
      this.value = "";
      creation_of_task(input_str, true);
    }
  });
}
let audio = document.getElementById("checked-aud");
function creation_of_task(str, cond) {
  // let task_len = 0;
  let tasks_container = document.querySelector(".todo-menu .cont");
  let checker_src = "todo-app-main/images/icon-check.svg";
  let items_counter = document.querySelector(".counter .nums");
  // Creat paragraph
  let p = document.createElement("p");
  p.classList.add("task", "py-3", "pl-10", "relative");
  p.textContent = str;
  // Create Span and img
  let spn = document.createElement("span");
  let img = document.createElement("img");
  spn.classList.add("check");
  img.src = checker_src;
  spn.appendChild(img);
  p.appendChild(spn);
  p.setAttribute("draggable", true);
  // Dargging
  let index_dragged;
  let index_dropped;
  p.addEventListener("dragstart", (e) => {
    e.target.classList.add("dragged");
  });
  p.addEventListener("dragover", (e) => {
    if (!e.target.classList.contains("dragged")) {
      e.target.classList.add("draged-over");
    }
    e.preventDefault();
  });
  p.addEventListener("dragleave", (e) => {
    e.target.classList.remove("dragged-over");
    e.target.classList.remove("draged-over");
  });
  p.addEventListener("drop", (e) => {
    e.target.classList.add("dropped-in");
    let tasks_list = document.querySelectorAll(".cont .task");
    tasks_list.forEach((ele, index) => {
      if (ele.classList.contains("dropped-in")) {
        index_dropped = index;
        ele.classList.remove("dropped-in");
        ele.classList.remove("draged-over");
      }
    });
    tasks_list.forEach((ele, index) => {
      if (ele.classList.contains("dragged")) {
        index_dragged = index;
        ele.classList.remove("dragged");
      }
    });
    let tmp = tasks_list[index_dragged].innerHTML;
    tasks_list[index_dragged].innerHTML = tasks_list[index_dropped].innerHTML;
    tasks_list[index_dropped].innerHTML = tmp;
    if (tasks_list[index_dragged].classList.contains("done")) {
      if (!tasks_list[index_dropped].classList.contains("done")) {
        tasks_list[index_dropped].classList.add("done");
        tasks_list[index_dragged].classList.remove("done");
      }
    } else {
      if (tasks_list[index_dropped].classList.contains("done")) {
        tasks_list[index_dropped].classList.remove("done");
        tasks_list[index_dragged].classList.add("done");
      }
    }
    // Clear Local storage
    window.localStorage.clear();
    // Recreate local storage
    tasks_list.forEach((task) => {
      window.localStorage.setItem(
        `${task.textContent}`,
        task.classList.contains("done")
      );
    });
  });
  // Append To Container
  tasks_container.appendChild(p);

  // Check From Input Or local
  if (cond) {
    ++items_counter.textContent;
    window.localStorage.setItem(`${p.textContent}`, false);
  }
  // Add done Event
  p.addEventListener("click", () => {
    if (p.classList.contains("done")) {
      p.classList.remove("done");
      task_len = items_counter.textContent;
      task_len++;
      items_counter.textContent = task_len;
      window.localStorage[`${p.textContent}`] = false;
    } else {
      p.classList.add("done");
      audio.currentTime = 0;
      audio.play();
      task_len = items_counter.textContent;
      task_len--;
      items_counter.textContent = task_len;
      window.localStorage[`${p.textContent}`] = true;
    }
  });
}

add_tasks();

// Clear Completed
function clear_complete_filter() {
  let clear_completed = document.querySelector(".clear");

  clear_completed.addEventListener("click", () => {
    let tasks = document.querySelectorAll(".cont .task");
    if (tasks.length > 0) {
      tasks.forEach((p) => {
        if (p.classList.contains("done")) {
          window.localStorage.removeItem(`${p.textContent}`);
          p.remove();
        }
      });
    }
  });
}

clear_complete_filter();

// Active filter
function active_filter() {
  let active_filt = document.querySelector(".sort .active-fil");

  active_filt.addEventListener("click", () => {
    let tasks = document.querySelectorAll(".cont .task");
    if (tasks.length > 0) {
      tasks.forEach((p) => {
        if (!p.classList.contains("done")) {
          p.style = "display: block";
        } else {
          p.style = "display: none";
        }
      });
    }
  });
}

active_filter();

// All filter

function all_filter() {
  let all_filter = document.querySelector(".sort .all");

  all_filter.addEventListener("click", () => {
    let tasks = document.querySelectorAll(".cont .task");
    if (tasks.length > 0) {
      tasks.forEach((p) => {
        p.style = "display: block";
      });
    }
  });
}

all_filter();

// Completed Filter

function complete_filter() {
  let completed_filter = document.querySelector(".sort .completed");

  completed_filter.addEventListener("click", () => {
    let tasks = document.querySelectorAll(".cont .task");
    if (tasks.length > 0) {
      tasks.forEach((p) => {
        if (p.classList.contains("done")) {
          p.style = "display: block";
        } else {
          p.style = "display: none";
        }
      });
    }
  });
}

complete_filter();

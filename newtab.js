// async function loadOrder() {
// var replaceCont = document.getElementById("side-scroll-cont");
// var newCode = ``;
// chrome.storage.local.get(["order"], function (value) {
//   if(value.order != undefined){
//     for (var e = 0; e < value.order.length; e++){
//       if(value.order[e] === "input-reminder"){
//         newCode += `
//         <textarea
//           placeholder="Hey! I'm your personal notepad. Whatever you put here will be saved for the next time you open the application."
//           class="draggable"
//           draggable="true"
//           id="input-reminder"
//         ></textarea>
//   `;
//       } else if(value.order[e] === "calendar"){
//         newCode += `
//         <div id="calendar" class="draggable" draggable="true">
//           <p>Calendar</p>
//         </div>
//   `;
//       } else if(value.order[e] === "mostVisited"){
//         newCode += `
//         <div id="mostVisited" class="draggable" draggable="true">
//           <h1 class="header">Top visited</h1>
//         </div>
//   `;
//       } else if(value.order[e] === "list"){
//         newCode += `
//         <div class="draggable" draggable="true" id="list">
//         <div class="to-do-container">
//           <h1 class="header">Todos</h1>

//           <form class="js-form">
//             <input
//               autofocus
//               type="text"
//               aria-label="Enter a new todo item"
//               placeholder="Enter your to-do here and hit enter"
//               class="js-todo-input"
//             />
//           </form>

//           <ul class="todo-list js-todo-list"></ul>
//         </div>
//       </div>
//     </div>
//   `;
//       } else {
//         console.log("Error with ordering");
//       }
//     }
//     replaceCont.innerHTML = newCode;
//   }
// });
// return;
// };

function updateOrder() {
  var storeCont = document.getElementById("side-scroll-cont");
  var children = storeCont.children;
  var elementArray = [];
  for (var i = 0; i < children.length; i++) {
    elementArray.push(children[i].id);
  }
  chrome.storage.local.set({ order: elementArray }, function () {});
}

document
  .getElementById("input-reminder")
  .addEventListener("keyup", textChanged);
document.getElementById("settings").addEventListener("click", panel);
document.getElementById("weather-button").addEventListener("click", setWeather);
document
  .getElementById("minimalist")
  .addEventListener("click", toggleMinimalist);
document.getElementById("darkmode").addEventListener("click", toggleDarkmode);
document.getElementById("container").addEventListener("click", updateSettings);
document
  .getElementById("side-scroll-cont")
  .addEventListener("drag", updateOrder);
document.body.style.margin = "0";

function checkZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function checkTwelve(e) {
  if (e > 12) {
    e = e - 12;
  }
  return e;
}

function checkM(j, k) {
  if (j > 11 && j != 24) {
    k = "PM";
  } else {
    k = "AM";
  }
  return k;
}

function beginCount() {
  var currentTime = new Date();
  var h = currentTime.getHours();
  var m = currentTime.getMinutes();
  var whatM;
  whatM = checkM(h, whatM);
  m = checkZero(m);
  h = checkTwelve(h);
  document.getElementById("time").innerHTML = h + ":" + m + " " + whatM;
  t = setTimeout(function () {
    beginCount();
  }, 500);
}
beginCount();

function textChanged(e) {
  var textInput = document.getElementById("input-reminder").value;
  chrome.storage.local.set({ reminder: textInput }, function () {});
}

chrome.storage.local.get(["reminder"], function (value) {
  if (value.reminder != undefined && value.reminder != "undefined") {
    document.getElementById("input-reminder").value = value.reminder;
  }
});

function onSiteClicked(event) {
  event.preventDefault();
  chrome.tabs.create({ url: event.srcElement.href });
  return false;
}

function buildSiteList(mostVisitedURLs) {
  var popupDiv = document.getElementById("mostVisited");
  var ol = popupDiv.appendChild(document.createElement("ol"));

  for (var i = 0; i < mostVisitedURLs.length; i++) {
    var li = ol.appendChild(document.createElement("li"));
    var a = li.appendChild(document.createElement("a"));
    a.href = mostVisitedURLs[i].url;
    a.appendChild(document.createTextNode(mostVisitedURLs[i].title));
    a.addEventListener("click", onSiteClicked);
  }
}

chrome.topSites.get(buildSiteList);

chrome.commands.onCommand.addListener(function (command) {
  console.log("onCommand event received for message: ", command);
  if (command === "open-first-site") {
    chrome.topSites.get(openFirstTop);
  }
  if (command === "open-second-site") {
    chrome.topSites.get(openSecondTop);
  }
  if (command === "open-third-site") {
    chrome.topSites.get(openThirdTop);
  }
  if (command === "open-settings") {
    panel();
  }
});

function openFirstTop(mostVisitedURLs) {
  chrome.tabs.create({ url: mostVisitedURLs[0].url });
}
function openSecondTop(mostVisitedURLs) {
  chrome.tabs.create({ url: mostVisitedURLs[1].url });
}
function openThirdTop(mostVisitedURLs) {
  chrome.tabs.create({ url: mostVisitedURLs[2].url });
}

function getWeather() {
  let temperature = document.getElementById("temperature");

  let api = "https://api.openweathermap.org/data/2.5/weather";
  let apiKey = "f146799a557e8ab658304c1b30cc3cfd";

  let zip;

  chrome.storage.local.get(["zip"], function (value) {
    if (value.zip === undefined) {
      temperature.innerHTML = "location not set";
    } else {
      zip = value.zip;

      let url = api + "?zip=" + zip + "&appid=" + apiKey + "&units=imperial";

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          let temp = data.main.temp;
          tempTemperature = "° F";
          temperature.innerHTML =
            Math.round(temp) +
            tempTemperature.substring(1) +
            " | " +
            data.weather[0].main;
        });
    }
  });
}

getWeather();

let toggle = false;

function panel() {
  settingPanel = document.getElementById("panel");
  settings = document.getElementById("settings");

  if (toggle === true) {
    settingPanel.classList.remove("panel");
    settingPanel.classList.add("panelPlus");
    settings.innerHTML = "&#9881";
    toggle = false;
  } else {
    settingPanel.classList.remove("panelPlus");
    settingPanel.classList.add("panel");
    settingPanel.style.display = "block";
    settings.innerHTML = "x";
    toggle = true;
  }
}

function setWeather(e) {
  e.preventDefault();
  var weather = document.getElementById("input-weather");
  if (weather.value != "") {
    chrome.storage.local.set({ zip: weather.value }, function () {
      console.log(0);
    });
  }

  var image = document.getElementById("input-picture");
  if (image.value != "") {
    chrome.storage.local.set({ image: image.value }, function () {
      console.log(0);
    });
  }
  getWeather();
  updateAllSettings();
}

function getDragAfterElement(container, x) {
  const draggableElements = [
    ...container.querySelectorAll(".draggable:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = x - box.left - box.width / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

var todoItems = [];

function addTodo(text) {
  const todo = {
    text,
    checked: false,
    id: Date.now(),
  };

  todoItems.push(todo);
  renderTodo(todo);
}

const form = document.querySelector(".js-form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector(".js-todo-input");
  const text = input.value.trim();
  if (text !== "") {
    addTodo(text);
    input.value = "";
    input.focus();
  }
});

const draggables = document.querySelectorAll(".draggable");
const containers = document.querySelectorAll(".container");

draggables.forEach((draggable) => {
  draggable.addEventListener("dragstart", () => {
    draggable.classList.add("dragging");
  });

  draggable.addEventListener("dragend", () => {
    draggable.classList.remove("dragging");
  });
});

containers.forEach((container) => {
  container.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientX);
    const draggable = document.querySelector(".dragging");
    if (afterElement == null) {
      container.appendChild(draggable);
    } else {
      container.insertBefore(draggable, afterElement);
    }
  });
});

function renderTodo(todo) {
  localStorage.setItem("todoItemsRef", JSON.stringify(todoItems));

  const list = document.querySelector(".js-todo-list");
  const item = document.querySelector(`[data-key='${todo.id}']`);

  if (todo.deleted) {
    item.remove();
    return;
  }

  const isChecked = todo.checked ? "done" : "";
  const node = document.createElement("li");
  node.setAttribute("class", `todo-item ${isChecked}`);
  node.setAttribute("data-key", todo.id);
  node.innerHTML = `
    <span class="js-tick">${todo.text}</span>
    <button class="delete-todo js-delete-todo">
    <svg><use href="#delete-icon"></use></svg>
    </button>
  `;

  if (item) {
    list.replaceChild(node, item);
  } else {
    list.append(node);
  }
}

const list = document.querySelector(".js-todo-list");
list.addEventListener("click", (event) => {
  if (event.target.classList.contains("js-tick")) {
    const itemKey = event.target.parentElement.dataset.key;
    toggleDone(itemKey);
  }

  if (event.target.classList.contains("js-delete-todo")) {
    const itemKey = event.target.parentElement.dataset.key;
    deleteTodo(itemKey);
  }
});

function toggleDone(key) {
  const index = todoItems.findIndex((item) => item.id === Number(key));
  todoItems[index].checked = !todoItems[index].checked;
  renderTodo(todoItems[index]);
}

function deleteTodo(key) {
  const index = todoItems.findIndex((item) => item.id === Number(key));
  const todo = {
    deleted: true,
    ...todoItems[index],
  };
  todoItems = todoItems.filter((item) => item.id !== Number(key));
  renderTodo(todo);
}

document.addEventListener("DOMContentLoaded", () => {
  const ref = localStorage.getItem("todoItemsRef");
  if (ref) {
    todoItems = JSON.parse(ref);
    todoItems.forEach((t) => {
      renderTodo(t);
    });
  }
});

function toggleMinimalist() {
  var minimalist = document.getElementById("minimalist");
  var block = document.getElementById("block");
  var time = document.getElementById("time");
  var temperature = document.getElementById("temperature");
  if (minimalist.checked) {
    document.getElementById("side-scroll-cont").classList.add("contOut");
    document.getElementById("side-scroll-cont").classList.remove("contIn");
    block.classList.add("block-minimalist");
    time.classList.add("time-minimalist");
    temperature.classList.add("temperature-minimalist");
    block.classList.remove("block");
    time.classList.remove("time");
    temperature.classList.remove("temperature");
    panel();
  } else {
    document.getElementById("side-scroll-cont").classList.add("contIn");
    document.getElementById("side-scroll-cont").classList.remove("contOut");
    block.classList.remove("block-minimalist");
    time.classList.remove("time-minimalist");
    temperature.classList.remove("temperature-minimalist");
    block.classList.add("block");
    time.classList.add("time");
    temperature.classList.add("temperature");
    document.getElementById("side-scroll-cont").style.display = "block";
    panel();
  }
}

function toggleDarkmode() {
  var darkmode = document.getElementById("darkmode");
  var time = document.getElementById("time");
  var temperature = document.getElementById("temperature");
  var container = document.getElementById("side-scroll-cont");
  var children = container.children;
  if (darkmode.checked) {
    time.classList.add("dark-text");
    temperature.classList.add("dark-text");
    for (var i = 0; i < children.length; i++) {
      children[i].classList.add("dark");
      children[i].classList.remove("light");
      console.log(0);
    }
  } else {
    time.classList.remove("dark-text");
    temperature.classList.remove("dark-text");
    for (var i = 0; i < children.length; i++) {
      children[i].classList.remove("dark");
      children[i].classList.add("light");
    }
  }
}

function updateSettings() {
  var isMinimalist = document.getElementById("minimalist").checked;
  chrome.storage.local.set({ minimalist: isMinimalist }, function () {});
  var isDarkmode = document.getElementById("darkmode").checked;
  chrome.storage.local.set({ darkmode: isDarkmode }, function () {});
}

chrome.storage.local.get(["minimalist"], function (value) {
  document.getElementById("minimalist").checked = value.minimalist;
  if (value.minimalist) {
    panel();
    toggleMinimalist();
    document.getElementById("panel").style.display = "none";
    document.getElementById("side-scroll-cont").style.display = "none";
  }
});

chrome.storage.local.get(["darkmode"], function (value) {
  document.getElementById("darkmode").checked = value.darkmode;
  if (value.darkmode) {
    toggleDarkmode();
  }
});

function updateAllSettings() {
  chrome.storage.local.get(["image"], function (value) {
    if (value.image != undefined) {
      document.getElementById(
        "container"
      ).style.backgroundImage = `url(${value.image})`;
    } else {
      document.getElementById("container").style.backgroundImage =
        'url("https://lp-cms-production.imgix.net/2019-06/12dec8938220093eb7f1fdb8a9ce40b8-the-rocky-mountains.jpg?fit=crop&q=40&sharp=10&vib=20&auto=format&ixlib=react-8.6.4")';
    }
  });
}

function getTopNews() {
  var url =
    "http://newsapi.org/v2/top-headlines?" +
    "country=us&" +
    "apiKey=0a6f3803cf954174aa6dced2416107ed";
    fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      var newsCont = document.getElementById("news");
      newsHTML = `<h1 class="header"></h1>`;
      for (var i = 0; i < data.articles.length; i++) {
        newsHTML += `
      <a class="news-link" href="${data.articles[i].url}">
      <div class="article">
      <div>
      <h1 class="title">${data.articles[i].title}</h1>
      </div>
      <img src="${data.articles[i].urlToImage}" class="article-image">
      </div>
      </a>
    `;
          // <p class="description">${data.articles[i].description}</p>
        data.articles[i];
      }
      newsCont.innerHTML = newsHTML;
    });
}
getTopNews();

updateAllSettings();

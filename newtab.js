document.getElementById("container").style.backgroundImage = 'url("https://source.unsplash.com/1600x900/?landscape")';
document.getElementById("input-reminder").addEventListener("keyup", textChanged);
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

function checkM(j , k) {
if (j > 11 && j != 24){
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
  document.getElementById('time').innerHTML = h + ":" + m + " " + whatM;
  t = setTimeout(function() {
        beginCount()
  }, 500);
}
beginCount();

function textChanged(e) {
    var textInput = document.getElementById("input-reminder").value;
    chrome.storage.local.set({ reminder: textInput}, function () {
    console.log('Reminder is set to ' + textInput);
    });
    console.log(1)
}

chrome.storage.local.get(["reminder"], function (value) {
console.log("Reminder is " + value.reminder);
document.getElementById("input-reminder").value = value.reminder;
});

function onSiteClicked(event) {
  event.preventDefault();
  chrome.tabs.create({ url: event.srcElement.href });
  return false;
}
  
  function buildSiteList(mostVisitedURLs) {
    var popupDiv = document.getElementById('mostVisited');
    var ol = popupDiv.appendChild(document.createElement('ol'));
  
    for (var i = 0; i < mostVisitedURLs.length; i++) {
      var li = ol.appendChild(document.createElement('li'));
      var a = li.appendChild(document.createElement('a'));
      a.href = mostVisitedURLs[i].url;
      a.appendChild(document.createTextNode(mostVisitedURLs[i].title));
      a.addEventListener('click', onSiteClicked);
    }
  }
  
  chrome.topSites.get(buildSiteList);
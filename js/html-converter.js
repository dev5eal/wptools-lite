const uploadFile = document.querySelector("#document");
const themeBtn = document.querySelector("#theme-btn");
const sanitizeBtn = document.querySelector("#sanitize");
const removeImagesBtn = document.querySelector("#remove-images");

// from main.js
function switchTheme() {
  let theme = document.getElementById("theme");
  let jodit = document.querySelector(".jodit_dark_theme") || document.querySelector(".jodit_default_theme"); // JODIT
  if (theme) {
    theme.remove();
  } else {
    theme = document.createElement("link");
    theme.id = "theme";
    theme.rel = "stylesheet";
    theme.type = "text/css";
    theme.href = "./css/theme-light.css";
    document.head.appendChild(theme);
  }
  if (jodit.classList.contains("jodit_dark_theme")){
		jodit.classList.replace("jodit_dark_theme", "jodit_default_theme");
	} 
	else {
		jodit.classList.replace("jodit_default_theme", "jodit_dark_theme");
	}
}

// function to handle word content and display in editor window
function handleFileSelect(event) {
  readFileInputEventAsArrayBuffer(event, function (arrayBuffer) {
    mammoth
      .convertToHtml({ arrayBuffer: arrayBuffer })
      .then(displayResult)
      .done();
  });
}

function displayResult(result) {
  document.querySelector(".jodit_wysiwyg").innerHTML = result.value;
}

function readFileInputEventAsArrayBuffer(event, callback) {
  var file = event.target.files[0];

  var reader = new FileReader();

  reader.onload = function (loadEvent) {
    var arrayBuffer = loadEvent.target.result;
    callback(arrayBuffer);
  };

  reader.readAsArrayBuffer(file);
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// functions to clear html

function findReplace(src, fnd, rplc) {
  let reg = new RegExp(document.getElementById(fnd).value, "g");
  document.querySelector(src).innerHTML;
}

function clearTable(src) {
  let reg = new RegExp(
    /(<table>)|(<\/table>)|(<td>)|(<\/td>)|(<tr>)|(<\/tr>)|(<th>)|(<\/th>)/,
    "g"
  );
  document.querySelector(src).innerHTML = document
    .querySelector(src)
    .innerHTML.replace(reg, "");
}

function clearImg(src) {
  let arr = document
    .querySelector(src)
    .querySelectorAll('img[src*="data:image/"]');
  arr.forEach(function (element, index) {
    element.outerHTML = "";
  });
}

function sanitize(src) {
  let reg = new RegExp(
    /(<[^\/>]+>[ \n\r\t]*<\/[^>]+>)|(\u2028)|(&lt;[^\/>]+&gt;)|(&lt;\/[^>]+&gt;)|(style="(.[^"]+)")/,
    "gi"
  );
  let h2tagstart = new RegExp(/(<h2><strong>)/, "g");
  let h3tagstart = new RegExp(/(<h3><strong>)/, "g");
  let linkC = new RegExp(/(C:\\\\)|(file:\/\/\/\\\\)/, "g");
  document.querySelector(src).innerHTML = document
    .querySelector(src)
    .innerHTML.replace(reg, "");
  document.querySelector(src).innerHTML = document
    .querySelector(src)
    .innerHTML.replace(h2tagstart, "<h2>");
  document.querySelector(src).innerHTML = document
    .querySelector(src)
    .innerHTML.replace(h3tagstart, "<h3>");
  document.querySelector(src).innerHTML = document
    .querySelector(src)
    .innerHTML.replace(linkC, "/");
}

function hrefSanitize(src) {
  let reg = new RegExp(
    /(<[^\/>]+>[ \n\r\t]*<\/[^>]+>)|(\u2028)|(&lt;[^\/>]+&gt;)|(&lt;\/[^>]+&gt;)|(style="(.[^"]+)")/,
    "gi"
  );
  document.querySelector(src).innerHTML = document
    .querySelector(src)
    .innerHTML.replace(reg, "");
}

function replaceImage(src) {
  let reg = new RegExp(/(<img.*\s*.*>)|(<img.*>)/, "g");
  document.querySelector(src).innerHTML = document
    .querySelector(src)
    .innerHTML.replace(reg, "");
}

function initJodit(id, lang = "Auto") {
  var editor = new Jodit("#" + id, {
    language: lang,
    theme: 'dark'
  });
}

function reInitJodit(id, src) {
  document.getElementById(id).parentElement.innerHTML =
    "<div id='editor'></div>";
  let lang =
    document.getElementById(src).options[
      document.getElementById(src).selectedIndex
    ].value;
  initJodit(id, lang);
}

uploadFile.addEventListener("change", handleFileSelect);
themeBtn.addEventListener("click", switchTheme);
sanitizeBtn.addEventListener("click", ()=>{
  sanitize(".jodit_wysiwyg")
});
removeImagesBtn.addEventListener("click", ()=>{
  clearImg(".jodit_wysiwyg")
});

initJodit("editor")

function beforeUnload(event) {
  if (localStorage.getItem("vertex_beforeunload_setting") == "false") {
    if (
      localStorage.getItem("enable-beforeunload") === "true" ||
      localStorage.getItem("enable-beforeunload") === null
    ) {
      const message =
        "Are you sure you want to leave? Your changes may not be saved.";
      event.returnValue = message;
      return message;
    }
  }
}
window.addEventListener("beforeunload", beforeUnload);

var link = document.createElement("link");
link.href = "/assets/vertex-384x384.png";
link.rel = "icon";
link.type = "image/x-icon";
document.head.appendChild(link);

var title = document.createElement("title");
title.innerHTML = "Vertex";
document.head.appendChild(title);

document.addEventListener("click", function () {
  window.focus();
});

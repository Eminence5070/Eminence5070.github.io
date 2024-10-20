function switchTheme(theme) {
  const stylesheet = document.getElementById("stylesheet");
  const basePath = "/assets/stylesheets/" + getPageName();
  
  if (theme === "default") {
    stylesheet.href = basePath + "-default.css";
  } else if (theme === "quartz") {
    stylesheet.href = basePath + "-quartz.css";
  } else if (theme === "egypt") {
    stylesheet.href = basePath + "-egypt.css";
  } else if (theme === "midnight") {
    stylesheet.href = basePath + "-midnight.css";
  } else if (theme === "crimson") {
    stylesheet.href = basePath + "-crimson.css";
  } else {
    stylesheet.href = basePath + "-default.css";
  }
}

function getPageName() {
  const path = window.location.pathname;
  const pageName = path.split("/").pop().split(".")[0];
  return pageName;
}

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("vertex_theme");
  switchTheme(savedTheme || "default");
});

import { Utils } from "../utils.js";
import { tooltip } from "./tooltip.js";

export function loadPage(url, title) {
  const embedElement = document.getElementById("embed");
  document.getElementById("results").style.display = "none";
  document.getElementsByClassName("search-container")[0].style.display = "none";
  document.getElementsByClassName("filter-btn-group")[0].style.display = "none";
  document.getElementById("pagination").style.display = "none";

  const container = document.createElement("div");
  container.style.position = "relative";
  container.style.maxWidth = "140%";
  container.style.height = "105%";
  container.style.border = "2px solid rgb(255, 255, 255, 0.15)";
  container.style.borderRadius = "8px";
  container.style.padding = "15px";
  container.style.backgroundColor = "rgb(255, 255, 255, 0.15)";
  container.style.boxSizing = "border-box";
  container.style.paddingBottom = "39px";

  const topBar = document.createElement("div");
  topBar.style.marginTop = "-5vh";
  topBar.style.display = "flex";
  topBar.style.justifyContent = "space-between";
  topBar.style.alignItems = "center";
  topBar.style.padding = "16px 8px 8px";

  const pageTitle = document.createElement("h2");
  pageTitle.textContent = title;
  pageTitle.style.margin = "12px";
  pageTitle.style.fontSize = "18px";
  pageTitle.style.color = "rgb(255, 255, 255, 0.65)";

  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.gap = "10px";

  const homeButton = document.createElement("button");
  homeButton.style.backgroundColor = "transparent";
  homeButton.style.border = "none";
  homeButton.setAttribute("data-tooltip", "Home");
  homeButton.style.cursor = "pointer";
  homeButton.style.padding = "8px";
  homeButton.addEventListener("click", () => {
    Utils.refWithoutUnload("/index.html");
  });

  const homeIcon = document.createElement("i");
  homeIcon.classList.add("fa", "fa-home");
  homeIcon.style.color = "rgb(255, 255, 255, 0.65)";

  const fullscreenButton = document.createElement("button");
  fullscreenButton.style.backgroundColor = "transparent";
  fullscreenButton.style.border = "none";
  fullscreenButton.setAttribute("data-tooltip", "Fullscreen");
  fullscreenButton.style.cursor = "pointer";
  fullscreenButton.style.padding = "8px";

  const fullscreenIcon = document.createElement("i");
  fullscreenIcon.classList.add("fa", "fa-expand");
  fullscreenIcon.style.color = "rgb(255, 255, 255, 0.65)";

  const reloadButton = document.createElement("button");
  reloadButton.style.backgroundColor = "transparent";
  reloadButton.style.border = "none";
  reloadButton.setAttribute("data-tooltip", "Reload Page");
  reloadButton.style.cursor = "pointer";
  reloadButton.style.padding = "8px";

  const reloadIcon = document.createElement("i");
  reloadIcon.classList.add("fa", "fa-sync-alt");
  reloadIcon.style.color = "rgb(255, 255, 255, 0.65)";

  const codeButton = document.createElement("button");
  codeButton.style.backgroundColor = "transparent";
  codeButton.style.border = "none";
  codeButton.setAttribute("data-tooltip", "Execute");
  codeButton.style.cursor = "pointer";
  codeButton.style.padding = "8px";

  const codeIcon = document.createElement("i");
  codeIcon.classList.add("fa", "fa-code");
  codeIcon.style.color = "rgb(255, 255, 255, 0.65)";
  codeButton.appendChild(codeIcon);

  codeButton.addEventListener("click", () => {
    const userChoice = prompt(
      "Choose an option:\n" +
        "1. Upload HTML file\n" +
        "2. Enter website URL\n" +
        "3. Upload JavaScript file\n" +
        "4. Enter JavaScript code\n" +
        "5. Enter HTML code"
    );

    switch (userChoice) {
      case "1":
        const htmlFileInput = document.createElement("input");
        htmlFileInput.type = "file";
        htmlFileInput.accept = ".html";
        htmlFileInput.addEventListener("change", (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = function () {
              const htmlContent = reader.result;
              const iframe = document.querySelector("iframe");
              iframe.srcdoc = htmlContent;
            };
            reader.readAsText(file);
          }
        });
        htmlFileInput.click();
        break;

      case "2":
        const websiteURL = prompt("Enter website URL:");
        if (websiteURL) {
          iframe.contentWindow.location = websiteURL;
        }
        break;

      case "3":
        const jsFileInput = document.createElement("input");
        jsFileInput.type = "file";
        jsFileInput.accept = ".js";
        jsFileInput.addEventListener("change", (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = function () {
              const jsContent = reader.result;
              const script = document.createElement("script");
              script.textContent = jsContent;
              document.head.appendChild(script);
            };
            reader.readAsText(file);
          }
        });
        jsFileInput.click();
        break;

      case "4":
        const jsCode = prompt("Enter JavaScript code:");
        if (jsCode) {
          const script = document.createElement("script");
          script.textContent = jsCode;
          document.head.appendChild(script);
        }
        break;

      case "5":
        const htmlCode = prompt("Enter HTML code:");
        if (htmlCode) {
          iframe.contentDocument.body.innerHTML = htmlCode;
        }
        break;

      default:
        alert("Invalid choice. Please select a valid option.");
        break;
    }
  });

  buttonContainer.appendChild(homeButton);
  buttonContainer.appendChild(fullscreenButton);
  buttonContainer.appendChild(reloadButton);
  buttonContainer.appendChild(codeButton);

  homeButton.appendChild(homeIcon);
  fullscreenButton.appendChild(fullscreenIcon);
  reloadButton.appendChild(reloadIcon);

  topBar.appendChild(pageTitle);
  topBar.appendChild(buttonContainer);

  const iframe = document.createElement("iframe");
  reloadButton.addEventListener("click", () => {
    Utils.reloadWithoutUnload(iframe.contentWindow.location, true);
  });
  fullscreenButton.addEventListener("click", () => {
    iframe.requestFullscreen();
  });

  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      // Create a new document to properly handle the <base> tag
      const doc = document.implementation.createHTMLDocument("temp");
      doc.documentElement.innerHTML = html;

      // Add the <base> tag to the new document's <head>
      const baseTag = doc.createElement("base");
      baseTag.href = new URL(url, window.location.origin).href;
      doc.head.appendChild(baseTag);

      // Create the iframe and set its srcdoc
      const iframe = document.createElement("iframe");
      iframe.srcdoc = doc.documentElement.innerHTML; // Use the modified HTML
      iframe.srcdoc += `<style>body{overflow: hidden !important;}</style>`;
      iframe.style =
        "width: 100%; height: 100%; border: none; z-index: 9999; border-radius:8px; position:relative;top:-100%;";
      container.appendChild(iframe);
      // Dispatch DOMContentLoaded event
      iframe.onload = () => {
        let event = new Event("DOMContentLoaded");
        iframe.contentDocument.dispatchEvent(event);
      };
      // Hide specific elements in the iframe
      setInterval(() => {
        if (iframe.contentDocument) {
          iframe.contentDocument
            .querySelectorAll("[id*=annotate i], [data-id=WebCommentThread]")
            .forEach((element) => {
              element.style.display = "none";
            });
        }
      }, 10);
    })
    .catch((error) => {
      console.error(`Error loading game:`, error);
    });
  iframe.width = "100%";
  iframe.height = "100%";
  iframe.style.marginTop = "-11px";
  iframe.style.border = "none";
  iframe.style.borderRadius = "8px";

  container.appendChild(topBar);
  container.appendChild(iframe);

  embedElement.innerHTML = "";
  embedElement.style.zIndex = "1";
  embedElement.appendChild(container);
  tooltip(homeButton);
  tooltip(fullscreenButton);
  tooltip(reloadButton);
  tooltip(codeButton);
}

export function deleteFrame(ctx) {
  const embedElement = ctx.getElementById("embed");
  embedElement.style.zIndex = "-1";
  ctx.getElementById("results").style.display = "grid";
  ctx.getElementsByClassName("search-container")[0].style.display = "block";
  ctx.getElementsByClassName("filter-btn-group")[0].style.display = "flex";
  ctx.getElementById("pagination").style.display = "flex";
  if (embedElement) {
    for (const child of embedElement.children) {
      child.remove();
    }
  } else {
    console.log("Element with ID 'embed' not found.");
  }
}

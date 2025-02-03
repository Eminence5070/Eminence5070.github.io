import { Utils } from "../utils.js";
import { init } from "../main.js";
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
    fetch(window.location.href)
      .then((response) => response.text())
      .then((html) => {
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";

        document.body.appendChild(iframe);

        const iframeDoc = iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(html);
        iframeDoc.close();

        iframe.onload = () => {
          document.documentElement.innerHTML =
            iframeDoc.documentElement.innerHTML;

          setTimeout(() => {
            if (iframe && iframe.parentNode) {
              iframe.parentNode.removeChild(iframe);
            }
          }, 0);

          init();
        };
      })
      .catch((error) => console.error("Error loading home page:", error));
  });

  const homeIcon = document.createElement("i");
  homeIcon.classList.add("fa", "fa-home");
  homeIcon.style.color = "rgb(255, 255, 255, 0.65)";

  const importButton = document.createElement("button");
  importButton.style.backgroundColor = "transparent";
  importButton.style.border = "none";
  importButton.setAttribute("data-tooltip", "Import data");
  importButton.style.cursor = "pointer";
  importButton.style.padding = "8px";
  importButton.addEventListener("click", () => {
    (function importBrowserData() {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".vtxdat";
      input.style.position = "fixed";
      input.style.top = "10px";
      input.style.right = "10px";
      input.style.zIndex = 1000;
      input.title = "Select browserData.json to import";
      input.click();
      input.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async function (e) {
          let data;
          try {
            data = JSON.parse(e.target.result);
          } catch (error) {
            console.error("Invalid JSON file", error);
            return;
          }
          if (data.cookies && typeof data.cookies === "object") {
            Object.keys(data.cookies).forEach((key) => {
              document.cookie = `${key}=${data.cookies[key]}; path=/`;
            });
          }
          if (data.localStorage && typeof data.localStorage === "object") {
            Object.keys(data.localStorage).forEach((key) => {
              localStorage.setItem(key, data.localStorage[key]);
            });
          }
          if (data.sessionStorage && typeof data.sessionStorage === "object") {
            Object.keys(data.sessionStorage).forEach((key) => {
              sessionStorage.setItem(key, data.sessionStorage[key]);
            });
          }
          async function importIndexedDB(dbData) {
            for (const dbName in dbData) {
              const storesData = dbData[dbName];
              const storeNames = Object.keys(storesData);
              const openRequest = indexedDB.open(dbName);
              openRequest.onupgradeneeded = function (e) {
                const db = e.target.result;
                storeNames.forEach((storeName) => {
                  if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, { autoIncrement: true });
                  }
                });
              };
              openRequest.onsuccess = function (e) {
                const db = e.target.result;
                const transaction = db.transaction(storeNames, "readwrite");
                storeNames.forEach((storeName) => {
                  if (db.objectStoreNames.contains(storeName)) {
                    const store = transaction.objectStore(storeName);
                    const records = storesData[storeName];
                    records.forEach((record, idx) => {
                      if (store.keyPath === null) {
                        store.add(record, idx).catch((err) => {
                          console.error(
                            `Error adding record to store ${storeName} in ${dbName}:`,
                            err
                          );
                        });
                      } else {
                        store.add(record).catch((err) => {
                          console.error(
                            `Error adding record to store ${storeName} in ${dbName}:`,
                            err
                          );
                        });
                      }
                    });
                  }
                });
                transaction.oncomplete = function () {
                  db.close();
                };
              };
              openRequest.onerror = function (e) {
                console.error(
                  `Error opening IndexedDB database ${dbName}:`,
                  e.target.error
                );
              };
            }
          }
          if (data.indexedDB && typeof data.indexedDB === "object") {
            await importIndexedDB(data.indexedDB);
          }
        };
        reader.readAsText(file);
      });
    })();
  });

  const exportButton = document.createElement("button");
  exportButton.style.backgroundColor = "transparent";
  exportButton.style.border = "none";
  exportButton.setAttribute("data-tooltip", "Export data");
  exportButton.style.cursor = "pointer";
  exportButton.style.padding = "8px";
  exportButton.addEventListener("click", () => {
    (async function exportBrowserData() {
      function getCookies() {
        const cookies = {};
        document.cookie.split(";").forEach((cookie) => {
          const [key, ...v] = cookie.trim().split("=");
          if (key) cookies[key] = v.join("=");
        });
        return cookies;
      }

      function getStorage(storage) {
        const data = {};
        for (let i = 0; i < storage.length; i++) {
          const key = storage.key(i);
          data[key] = storage.getItem(key);
        }
        return data;
      }

      async function getIndexedDBData() {
        if (!indexedDB.databases) {
          return "indexedDB.databases() not supported in this browser";
        }
        const dbList = await indexedDB.databases();
        const result = {};
        for (const dbInfo of dbList) {
          const dbName = dbInfo.name;
          if (!dbName) continue;
          result[dbName] = {};
          const db = await new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
          });
          const objectStoreNames = Array.from(db.objectStoreNames);
          for (const storeName of objectStoreNames) {
            result[dbName][storeName] = await new Promise((resolve, reject) => {
              const transaction = db.transaction(storeName, "readonly");
              const store = transaction.objectStore(storeName);
              const getAllRequest = store.getAll();
              getAllRequest.onsuccess = () => resolve(getAllRequest.result);
              getAllRequest.onerror = () => reject(getAllRequest.error);
            });
          }
          db.close();
        }
        return result;
      }

      const browserData = {
        cookies: getCookies(),
        localStorage: getStorage(localStorage),
        sessionStorage: getStorage(sessionStorage),
        indexedDB: await getIndexedDBData(),
      };

      const dataStr = JSON.stringify(browserData, null, 2);

      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "vertex-data.vtxdat";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();

      URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log("Browser data exported as browserData.json");
    })();
  });

  const exportIcon = document.createElement("i");
  exportIcon.classList.add("fa", "fa-right-to-bracket");
  exportIcon.style.color = "rgb(255, 255, 255, 0.65)";

  const importIcon = document.createElement("i");
  importIcon.classList.add("fa", "fa-arrow-up-from-bracket");
  importIcon.style.color = "rgb(255, 255, 255, 0.65)";

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

  buttonContainer.appendChild(importButton);
  buttonContainer.appendChild(exportButton);
  buttonContainer.appendChild(homeButton);
  buttonContainer.appendChild(fullscreenButton);
  buttonContainer.appendChild(reloadButton);
  buttonContainer.appendChild(codeButton);

  importButton.appendChild(importIcon);
  exportButton.appendChild(exportIcon);
  homeButton.appendChild(homeIcon);
  fullscreenButton.appendChild(fullscreenIcon);
  reloadButton.appendChild(reloadIcon);

  topBar.appendChild(pageTitle);
  topBar.appendChild(buttonContainer);

  const iframe = document.createElement("iframe");
  reloadButton.addEventListener("click", () => {
    const targetIframe = document.querySelector("iframe[data-url]");
    if (targetIframe) {
      const currentUrl = targetIframe.getAttribute("data-url");
      if (currentUrl.includes("zrok")) {
        targetIframe.src = currentUrl;
      } else {
        fetch(currentUrl)
          .then((response) => response.text())
          .then((html) => {
            const doc = document.implementation.createHTMLDocument("temp");
            doc.documentElement.innerHTML = html;
            const baseTag = doc.createElement("base");
            baseTag.href = new URL(currentUrl, window.location.origin).href;
            doc.head.appendChild(baseTag);

            targetIframe.srcdoc =
              doc.documentElement.innerHTML +
              `<style>body{overflow: hidden !important;}</style>`;

            targetIframe.onload = () => {
              const event = new Event("DOMContentLoaded");
              targetIframe.contentDocument.dispatchEvent(event);
            };
          })
          .catch((error) => console.error("Error reloading iframe:", error));
      }
    } else {
      console.error("No valid iframe found to reload");
    }
  });

  fullscreenButton.addEventListener("click", () => {
    const targetIframe = document.querySelector("iframe[data-url]");
    if (targetIframe) {
      targetIframe.requestFullscreen().catch((err) => {
        console.error("Fullscreen error:", err);
      });
    } else {
      console.error("No valid iframe found for fullscreen");
    }
  });
  if (!url.includes("zrok")) {
    fetch(url)
      .then((response) => response.text())
      .then((html) => {
        const doc = document.implementation.createHTMLDocument("temp");
        doc.documentElement.innerHTML = html;

        const baseTag = doc.createElement("base");
        baseTag.href = new URL(url, window.location.origin).href;
        doc.head.appendChild(baseTag);

        const iframe = document.createElement("iframe");
        if (!url.includes("zrok"))
          iframe.srcdoc = doc.documentElement.innerHTML;
        iframe.srcdoc += `<style>body{overflow: hidden !important;}</style>`;
        iframe.setAttribute("data-url", url);
        iframe.style =
          "left: 1%;width: 98%;height: 92%;border: none;z-index: 9999;border-radius: 8px;position: absolute;top: 6%;";
        container.appendChild(iframe);
        iframe.onload = () => {
          let event = new Event("DOMContentLoaded");
          iframe.contentDocument.dispatchEvent(event);
          const unityCanvas = iframe.contentDocument.querySelector("canvas");
          if (unityCanvas) {
            unityCanvas.style.width = "100%";
            unityCanvas.style.height = "100%";

            unityCanvas.style.maxWidth = "1920px";
            unityCanvas.style.maxHeight = "1080px";

            unityCanvas.width = Math.min(iframe.offsetWidth, 1920);
            unityCanvas.height = Math.min(iframe.offsetHeight, 1080);
          }
        };
      })

      .catch((error) => {
        console.error(`Error loading game:`, error);
      });
  } else {
    const doc = document.implementation.createHTMLDocument("temp");
    doc.documentElement.innerHTML = ``;
    const iframe = document.createElement("iframe");
    iframe.setAttribute("data-url", url);
    iframe.style =
      "left: 1%;width: 98%;height: 92%;border: none;z-index: 9999;border-radius: 8px;position: absolute;top: 6%;";
    iframe.src = url;
    iframe.sandbox =
      "allow-scripts allow-same-origin allow-forms allow-modals allow-pointer-lock allow-presentation allow-downloads allow-top-navigation allow-top-navigation-by-user-activation";
    container.appendChild(iframe);
  }
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

  tooltip(importButton);
  tooltip(exportButton);
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

import { Utils } from "../utils.js";
import { init } from "../main.js";
import { tooltip } from "./tooltip.js";

export function loadPage(url, title) {
  const embedElement = document.getElementById("embed");
  document.getElementById("results").classList.add("hidden");
  document.getElementsByClassName("search-container")[0].classList.add("hidden");
  document.getElementsByClassName("filter-btn-group")[0].classList.add("hidden");
  document.getElementById("pagination").classList.add("hidden");

  const container = document.createElement("div");
  container.classList.add("page-container");

  const topBar = document.createElement("div");
  topBar.classList.add("page-top-bar");

  const pageTitle = document.createElement("h2");
  pageTitle.textContent = title;
  pageTitle.classList.add("page-title");

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  // Home button
  const homeButton = createButton("Home", "fa-home", () => {
    fetch("https://Eminence5070.github.io/")
      .then((response) => response.text())
      .then((html) => {
        const iframe = document.createElement("iframe");
        iframe.classList.add("hidden");
        document.body.appendChild(iframe);

        const iframeDoc = iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(html);
        iframeDoc.close();

        iframe.onload = () => {
          document.documentElement.innerHTML = iframeDoc.documentElement.innerHTML;
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

  // Import button
  const importButton = createButton("Import data", "fa-arrow-up-from-bracket", () => {
    (function importBrowserData() {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".vtxdat";
      input.classList.add("file-input");
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

  // Export button
  const exportButton = createButton("Export data", "fa-right-to-bracket", () => {
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
      a.classList.add("hidden");
      document.body.appendChild(a);
      a.click();

      URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log("Browser data exported as browserData.json");
    })();
  });

  // Fullscreen button
  const fullscreenButton = createButton("Fullscreen", "fa-expand", () => {
    const targetIframe = document.querySelector("iframe[data-url]");
    if (targetIframe) {
      targetIframe.requestFullscreen().catch((err) => {
        console.error("Fullscreen error:", err);
      });
    } else {
      console.error("No valid iframe found for fullscreen");
    }
  });

  // Reload button
  const reloadButton = createButton("Reload Page", "fa-sync-alt", () => {
    const targetIframe = document.querySelector("iframe[data-url]");
    if (targetIframe) {
      const currentUrl = targetIframe.getAttribute("data-url");
      if (
        currentUrl.includes("zrok") ||
        currentUrl.includes("googleusercontent")
      ) {
        targetIframe.src = currentUrl;
      } else {
        fetch(currentUrl)
          .then((response) => response.text())
          .then((html) => {
            const doc = document.implementation.createHTMLDocument("temp");
            doc.documentElement.innerHTML = html;
            const baseTag = doc.createElement("base");
            baseTag.href = currentUrl;
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

  // Code button
  const codeButton = createButton("Execute", "fa-code", () => {
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

  // Helper function to create buttons with icons
  function createButton(tooltipText, iconClass, clickHandler) {
    const button = document.createElement("button");
    button.classList.add("icon-button");
    button.setAttribute("data-tooltip", tooltipText);
    button.addEventListener("click", clickHandler);

    const icon = document.createElement("i");
    icon.classList.add("fa", iconClass, "icon");
    button.appendChild(icon);

    return button;
  }

  // Add all buttons to the container
  buttonContainer.appendChild(importButton);
  buttonContainer.appendChild(exportButton);
  buttonContainer.appendChild(homeButton);
  buttonContainer.appendChild(fullscreenButton);
  buttonContainer.appendChild(reloadButton);
  buttonContainer.appendChild(codeButton);

  // Assemble the topBar
  topBar.appendChild(pageTitle);
  topBar.appendChild(buttonContainer);
  container.appendChild(topBar);

  // Create and setup iframe
  let iframe;
  if (!url.includes("zrok") || url.includes("googleusercontent")) {
    fetch(url)
      .then((response) => response.text())
      .then((html) => {
        const doc = document.implementation.createHTMLDocument("temp");
        doc.documentElement.innerHTML = html;

        const baseTag = doc.createElement("base");
        baseTag.href = url;
        doc.head.appendChild(baseTag);

        iframe = document.createElement("iframe");
        if (!url.includes("zrok") || url.includes("googleusercontent"))
          iframe.srcdoc = doc.documentElement.innerHTML;
        iframe.srcdoc += `<style>body{overflow: hidden !important;}</style><meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">`;
        iframe.setAttribute("data-url", url);
        iframe.classList.add("content-iframe");
        container.appendChild(iframe);
        
        iframe.onload = () => {
          let event = new Event("DOMContentLoaded");
          iframe.contentDocument.dispatchEvent(event);
          const unityCanvas = iframe.contentDocument.querySelector("canvas");
          if (
            unityCanvas &&
            (url.includes("block") || url.includes("timeshooter/"))
          ) {
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
    iframe = document.createElement("iframe");
    iframe.setAttribute("data-url", url);
    iframe.classList.add("external-iframe");
    iframe.src = url;
    iframe.sandbox =
      "allow-scripts allow-same-origin allow-forms allow-modals allow-pointer-lock allow-presentation allow-downloads allow-top-navigation allow-top-navigation-by-user-activation";
    container.appendChild(iframe);
  }

  // Clear and show the embed element
  embedElement.innerHTML = "";
  embedElement.classList.add("active");
  embedElement.appendChild(container);

  // Apply tooltips to all buttons
  tooltip(importButton);
  tooltip(exportButton);
  tooltip(homeButton);
  tooltip(fullscreenButton);
  tooltip(reloadButton);
  tooltip(codeButton);
}

export function deleteFrame(ctx) {
  const embedElement = ctx.getElementById("embed");
  embedElement.classList.remove("active");
  
  ctx.getElementById("results").classList.remove("hidden");
  ctx.getElementsByClassName("search-container")[0].classList.remove("hidden");
  ctx.getElementsByClassName("filter-btn-group")[0].classList.remove("hidden");
  ctx.getElementById("pagination").classList.remove("hidden");
  
  if (embedElement) {
    for (const child of embedElement.children) {
      child.remove();
    }
  } else {
    console.log("Element with ID 'embed' not found.");
  }
}
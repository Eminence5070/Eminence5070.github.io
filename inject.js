// prevents GoGuardian tab closing
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

// load additional resources
var link = document.createElement("link");
link.href = "/assets/manifest.json";
link.rel = "manifest";
document.head.appendChild(link);

var link = document.createElement("link");
link.href = "/assets/vertex-384x384.png";
link.rel = "icon";
link.type = "image/x-icon";
document.head.appendChild(link);

var title = document.createElement("title");
title.innerHTML = "Vertex";
document.head.appendChild(title);

// load service worker
if (typeof navigator !== "undefined") {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/src/sw.js");
    });
  }
}

// prevents unfocusing the window
document.addEventListener("click", function () {
  window.focus();
});

// action bar
document.addEventListener("DOMContentLoaded", () => {
  localStorage.setItem("enable-beforeunload", "true");
  setTimeout(() => {
    if (location.href.toString().includes("/index.html") == false) {
      if (localStorage.getItem("vertex_action_bar_setting") === "true") {
        var link = document.createElement("link");
        link.href =
          "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";
        link.rel = "stylesheet";
        document.head.appendChild(link);

        var elem = document.createElement("div");
        elem.innerHTML = `
                    <div class="icon-menu-pill" id="icon-menu">
                        <i class="fa-brands fa-hive icon"></i>
                        <div class="hidden-icons">
                            <div class="icon-container" data-tooltip="Reload page">
                                <i class="fa-solid fa-rotate-right icon" onclick="localStorage.setItem('enable-beforeunload', false);location.reload();"></i>
                            </div>
                            <div class="icon-container" data-tooltip="Home">
                                <i class="fa-solid fa-home icon" onclick="location.href='/main.html';"></i>
                            </div>
                            <div class="icon-container" data-tooltip="Toggle fullscreen">
                                <i class="fa-solid fa-up-right-and-down-left-from-center icon" onclick="  if (document.fullscreenElement) {
                                    document.exitFullscreen();
                                } else {
                                    document.documentElement.requestFullscreen();
                                }"></i>
                            </div>
                            <div class="icon-container" data-tooltip="Execute code">
                                <i class="fa-solid fa-code icon" onclick="eval(prompt('Enter JS code:'))"></i>
                            </div>
                            <div class="icon-container" data-tooltip="Close">
                                <i class="fa-solid fa-xmark icon" onclick="document.getElementById('icon-menu').remove();"></i>
                            </div>
                        </div>
                    </div>
                `;

        var style = document.createElement("style");
        style.textContent = `
                    .icon-menu-pill {
                        backdrop-filter: blur(8px);
                        position: fixed;
                        bottom: 20px;
                        left: 20px;
                        width: 60px;
                        height: 60px;
                        border-radius: 50%;
                        background: rgba(0, 0, 0, 0.025);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        transition: all 0.1s ease;
                        cursor: pointer;
                        z-index: 1000;
                    }
                    .icon-menu-pill:hover {
                        background: rgba(0, 0, 0, 0.05)
                        backdrop-filter: blur(8px);
                        width: 275px;
                        height: 60px;
                        border-radius: 30px;
                        background: rgba(0, 0, 0, 0.2);
                    }
                    .icon {
                        color: white;
                        font-size: 24px;
                        transition: opacity 0.3s ease;
                        opacity: 0.6;
                    }
                    .icon-menu-pill:hover .icon {
                        opacity: 1;
                    }
                    .hidden-icons {
                        display: flex;
                        align-items: center;
                        justify-content: space-around;
                        visibility: hidden;
                        pointer-events: none;
                        width: 100%;
                        height: 100%;
                        margin-left: 48px;
                    }
                    .hidden-icons .icon {
                        rotate: -40deg;
                        transition: rotate 0.65s;
                    }
                    #icon-menu:hover .icon {
                        rotate: 0deg;
                    }
                    #icon-menu:hover .fa-hive {
                        rotate: 90deg;
                    }
                    .icon-menu-pill:hover .hidden-icons {
                        visibility: visible;
                        pointer-events: all;
                    }
                    .icon-container {
                        position: relative;
                        width: 40px;
                        height: 40px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .icon-container:hover {
                        background-color: rgba(255, 255, 255, 0.1);
                        border-radius: 50%;
                        padding: 4px;
                        box-sizing:border-box;
                    }
                    .fa-hive {
                        position: absolute;
                        left: 16px;
                        rotate: 90deg;
                    }
                    .tooltip {
                        position: absolute;
                        left: 50%;
                        margin-bottom: 35px;
                        transform: translateX(-50%);
                        color: white;
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-size: 11px;
                        text-wrap: nowrap;
                        visibility: hidden;
                        width: auto;
                        font-family: 'Consolas';
                        pointer-events: none;
                        z-index: 1001;
                        background-color: rgb(255 255 255 / 9%);
                        outline: 1px solid rgb(53 52 52 / 38%);
                        backdrop-filter: blur(3px)
                    }
                    .icon-container:hover .tooltip {
                        visibility: visible;
                    }
                `;

        document.head.appendChild(style);
        document.body.appendChild(elem);

        const iconContainers = document.querySelectorAll(".icon-container");
        iconContainers.forEach((container) => {
          const tooltipText = container.getAttribute("data-tooltip");
          const tooltip = document.createElement("div");
          tooltip.className = "tooltip";
          tooltip.textContent = tooltipText;
          container.appendChild(tooltip);
        });
      }
    }
  }, 1);
});

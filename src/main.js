import { Utils } from "./utils.js";

async function init() {
  let correctPassword = await Utils.fetchPassword();

  function handleSessionCheck() {
    if (
      localStorage.getItem("auth") !== correctPassword ||
      localStorage.getItem("vertex_sso") !== "true"
    ) {
      localStorage.setItem("enable-beforeunload", "false");
      alert("Session not authorized.");
      window.location.href = "login.html";
    }
  }

  document.addEventListener("mousemove", handleSessionCheck);
  handleSessionCheck();

  let currentPage = 1;
  let itemsPerPage = 6;
  let currentFilter = "All";
  let isChangelogOpen = false;

  Array.from(document.getElementsByClassName("button-action")).forEach(
    (button) => {
      button.addEventListener("click", () => {
        localStorage.setItem("enable-beforeunload", "false");
      });
    }
  );

  document.getElementById("search-bar").addEventListener("input", loadResults);
  document
    .getElementById("changelog-btn")
    .addEventListener("click", toggleChangelog);
  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", function () {
      currentFilter = this.getAttribute("data-filter");
      currentPage = 1;
      loadResults();
    });
  });

  loadResults();

  function loadResults() {
    const query = document.getElementById("search-bar").value.toLowerCase();
    fetch("/data/content.json")
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter((item) => {
          let categoryMatches = false;

          if (currentFilter === "Apps") {
            categoryMatches = item.category === "Apps";
          } else if (currentFilter === "Games") {
            categoryMatches = item.category === "Games";
          } else {
            categoryMatches =
              currentFilter === "All" || item.category === currentFilter;
          }

          return (
            categoryMatches &&
            (item.title.toLowerCase().includes(query) ||
              item.description.toLowerCase().includes(query))
          );
        });
        displayResults(filteredData);
      });
  }

  function displayResults(data) {
    const results = document.getElementById("results");
    results.innerHTML = "";

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    data.slice(start, end).forEach((item) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
                    <img src="assets/${item.icon}" alt="Icon" class="card-icon">
                    <h3>${item.title}</h3>
                    <p class="card-description">${item.description}</p>
                `;
      card.addEventListener("click", () => {
        window.location.href = item.url;
      });
      results.appendChild(card);
    });

    displayPagination(data.length);
  }

  function displayPagination(totalItems) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      if (i === currentPage) {
        btn.style.backgroundColor = "#272727";
        btn.style.top = "2px";
        btn.style.position = "relative";
      }
      btn.addEventListener("click", function () {
        currentPage = i;
        loadResults();
      });
      pagination.appendChild(btn);
    }
  }

  async function toggleChangelog(event) {
    const contextMenu = document.getElementById("context-menu");
    if (isChangelogOpen) {
      contextMenu.style.display = "none";
      isChangelogOpen = false;
    } else {
      await Utils.fetchChangelog();
    }
  }
}

init();

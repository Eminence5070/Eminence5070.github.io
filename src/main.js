import { Utils } from "./utils.js";

export async function init() {
  let currentPage = 1;
  let itemsPerPage = 8;
  let currentFilter = "All";

  Array.from(document.getElementsByClassName("button-action")).forEach(
    (button) => {
      button.addEventListener("click", () => {
        localStorage.setItem("enable-beforeunload", "false");
      });
    }
  );

  document.getElementById("settings-wrapper").addEventListener("click", () => {
    Utils.loadPage("/settings.html", "Settings");
  });

  document.getElementById("search-bar").addEventListener("input", loadResults);
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

        // Sort: "new" items first, then alphabetically by title
        filteredData.sort((a, b) => {
          const isNewA = a.new === "true" ? 0 : 1; // Treat "true" as a string
          const isNewB = b.new === "true" ? 0 : 1;

          if (isNewA !== isNewB) {
            return isNewA - isNewB; // "new" items first
          }
          return a.title.localeCompare(b.title); // Alphabetical order
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
        Utils.loadPage(item.url, item.title);
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
        btn.className = "page-btn-c";
      }
      btn.addEventListener("click", function () {
        currentPage = i;
        loadResults();
      });
      pagination.appendChild(btn);
    }
  }
}

init();

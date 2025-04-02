import { Utils } from "./utils.js";

export async function init() {
  let currentPage = 1;
  let itemsPerPage = Number(localStorage.getItem("items_per_page")) || 16;
  let currentFilter = "All";

  const container = document.querySelector("#results");
  let items = itemsPerPage;
  let rows,
    cols,
    scale = 1;

  if (items === 16) {
    rows = 2;
    cols = 8;
    scale = 0.75;
  } else if (items > 14) {
    rows = 3;
    cols = Math.ceil(items / rows);
  } else {
    rows = 2;
    cols = Math.ceil(items / rows);
  }

  container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  container.style.transform = `scale(${scale})`;
  container.style.transformOrigin = `center`;

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

  document.getElementById("search-bar").addEventListener("input", () => {
    currentPage = 1;
    loadResults();
  });

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
          let categoryMatches =
            currentFilter === "All" || item.category === currentFilter;
          return (
            categoryMatches && item.title.trim().toLowerCase().includes(query)
          );
        });

        filteredData.sort((a, b) => {
          const isNewA = a.new === "true" ? 0 : 1;
          const isNewB = b.new === "true" ? 0 : 1;
          return isNewA !== isNewB
            ? isNewA - isNewB
            : a.title.localeCompare(b.title);
        });

        displayResults(filteredData);
      });
  }

  function displayResults(data) {
    const results = document.getElementById("results");
    results.innerHTML = "";

    let start = (currentPage - 1) * itemsPerPage;
    let end = start + itemsPerPage;

    data.slice(start, end).forEach((item) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <img src="assets/${item.icon}" alt="Icon" class="card-icon">
        <h3>${item.title}</h3>
      `;
      if (item.new) {
        const newBadge = document.createElement("div");
        newBadge.classList.add("new-badge");
        newBadge.textContent = "NEW!";
        card.appendChild(newBadge);
        card.classList += " new-card";
      }
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
        btn.classList.add("active");
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
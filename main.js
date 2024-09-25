document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem("auth") !== 'correct-password') {
        alert('Session not authorized.');
        window.location.href = "index.html";
    }
    let currentPage = 1;
    let itemsPerPage = 6;
    let currentFilter = 'All';
    let isChangelogOpen = false;

    function loadResults() {
        const query = document.getElementById('search-bar').value.toLowerCase();
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                const filteredData = data.filter(item => {
                    let categoryMatches = false;

                    // Swap logic for Apps and Games
                    if (currentFilter === 'Apps') {
                        categoryMatches = item.category === 'Apps';
                    } else if (currentFilter === 'Games') {
                        categoryMatches = item.category === 'Games';
                    } else {
                        categoryMatches = currentFilter === 'All' || item.category === currentFilter;
                    }

                    return categoryMatches && 
                        (item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query));
                });
                displayResults(filteredData);
            });
    }

    function displayResults(data) {
        const results = document.getElementById('results');
        results.innerHTML = '';

        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        data.slice(start, end).forEach(item => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <img src="${item.icon}" alt="Icon" class="card-icon">
                <h3>${item.title}</h3>
                <p class="card-description">${item.description}</p>
            `;
            card.addEventListener('click', () => {
                window.location.href = item.url;
            });
            results.appendChild(card);
        });

        displayPagination(data.length);
    }

    function displayPagination(totalItems) {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            if (i === currentPage) {
                btn.style.backgroundColor = '#272727';
                btn.style.top = '2px';
                btn.style.position = 'relative';
            }
            btn.addEventListener('click', function() {
                currentPage = i;
                loadResults();
            });
            pagination.appendChild(btn);
        }
    }

    document.getElementById('search-bar').addEventListener('input', loadResults);
    document.getElementById('changelog-btn').addEventListener('click', function(event) {
        const contextMenu = document.getElementById('context-menu');
        if (isChangelogOpen) {
            contextMenu.style.display = 'none';
            isChangelogOpen = false;
        } else {
            fetch('changelog')
                .then(response => response.text())
                .then(data => {
                    contextMenu.innerHTML = parseChangelog(data);
                    contextMenu.style.display = 'block';
                    contextMenu.style.left = `77.35vw`;
                    contextMenu.style.top = `62px`;
                    isChangelogOpen = true;
                });

            document.addEventListener('click', function() {
                contextMenu.style.display = 'none';
                isChangelogOpen = false;
            }, { once: true });
        }
    });

    function parseChangelog(data) {
        return data.split('$').map(section => {
            return section.split('\n').map(line => {
                if (line.startsWith('-')) {
                    return `<div class="context-header">${line.slice(1).toUpperCase()}</div>`;
                } else if (line.startsWith('>')) {
                    return `<div class="context-entry">${line.slice(1)}</div>`;
                } else {
                    return '';
                }
            }).join('');
        }).join('<hr style="border: none; margin: 10px 0;">');
    }

    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            currentFilter = this.getAttribute('data-filter');
            currentPage = 1;
            loadResults();
        });
    });

    loadResults();
});

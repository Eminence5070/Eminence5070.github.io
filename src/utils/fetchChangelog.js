// fetch changelog from $changelog
const contextMenu = document.getElementById("context-menu");
var isChangelogOpen = true;

export async function fetchChangelog() {
  try {
    const response = await fetch("data/$changelog");
    const data = await response.text();
    return data;
  } catch (error) {
    console.error("Error fetching changelog:", error);
    throw error;
  }
}

export function parseChangelog(data) {
  return data
    .split("$")
    .map((section) => {
      return section
        .split("\n")
        .map((line) => {
          if (line.startsWith("-")) {
            return `<div class="context-header">${line
              .slice(1)
              .toUpperCase()}</div>`;
          } else if (line.startsWith(">")) {
            return `<div class="context-entry">${line.slice(1)}</div>`;
          } else {
            return "";
          }
        })
        .join("");
    })
    .join('<hr style="border: none; margin: 10px 0;">');
}

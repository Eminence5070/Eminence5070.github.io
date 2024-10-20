// fetch changelog from $changelog
export async function fetchChangelog() {
  fetch("data/$changelog")
    .then((response) => response.text())
    .then((data) => {
      contextMenu.innerHTML = parseChangelog(data);
      contextMenu.style.display = "block";
      contextMenu.style.left = `77.35vw`;
      contextMenu.style.top = `62px`;
      isChangelogOpen = true;
    });
  document.addEventListener(
    "click",
    function () {
      contextMenu.style.display = "none";
      isChangelogOpen = false;
    },
    { once: true }
  );
}

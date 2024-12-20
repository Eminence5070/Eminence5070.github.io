export function tooltip(element) {
  const tooltipDiv = document.createElement("div");
  tooltipDiv.style.position = "absolute";
  tooltipDiv.style.backgroundColor = "rgba(0, 0, 0, 0.15)";
  tooltipDiv.style.color = "white";
  tooltipDiv.style.padding = "5px 10px";
  tooltipDiv.style.borderRadius = "4px";
  tooltipDiv.style.fontSize = "14px";
  tooltipDiv.style.visibility = "hidden";
  tooltipDiv.style.pointerEvents = "none";
  document.body.appendChild(tooltipDiv);
  element.addEventListener("mouseenter", function () {
    const title = element.getAttribute("data-tooltip");
    if (title) {
      tooltipDiv.textContent = title;
      tooltipDiv.style.visibility = "visible";
      const rect = element.getBoundingClientRect();
      tooltipDiv.style.top = `${rect.top - tooltipDiv.offsetHeight - 2}px`;
      tooltipDiv.style.left = `${
        rect.left + (rect.width - tooltipDiv.offsetWidth) / 2
      }px`;
    }
  });
  element.addEventListener("mouseleave", function () {
    tooltipDiv.style.visibility = "hidden";
  });
}

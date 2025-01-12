import { Utils } from "./utils.js";

const parentDocument = window.parent.document;

const settingsBackButton = document.getElementById("settings-back");

if (settingsBackButton) {
  settingsBackButton.addEventListener("click", () => {
    Utils.deleteFrame(parentDocument);
  });
}

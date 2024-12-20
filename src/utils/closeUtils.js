export function getUnload() {
  if (
    localStorage.getItem("enable-beforeunload") === "true" ||
    localStorage.getItem("enable-beforeunload") === null
  ) {
    return true;
  } else {
    return false;
  }
}

export function setUnload(bool) {
  localStorage.setItem("enable-beforeunload", bool.toString());
}

export function refWithoutUnload(url) {
  localStorage.setItem("enable-beforeunload", "false");
  window.location.href = url;
  localStorage.setItem("enable-beforeunload", "true");
}

export function reloadWithoutUnload(url, bool) {
  localStorage.setItem("enable-beforeunload", "false");
  if (bool) {
    url.reload();
  } else {
    window.location.href = url;
  }
  localStorage.setItem("enable-beforeunload", "true");
}

(() => {
  var o, i, l, a, e, d, c, h, n, t;
  t =
    (a = (e = location.ancestorOrigins) != null ? e[0] : void 0) != null
      ? a
      : document.referrer;
  i = t != null && (d = t.match(/\/\/([^\/]+)/)) != null ? d[1] : void 0;
  n =
    (c = window.location.href) != null && (h = c.match(/\/html\/(\d+)/)) != null
      ? h[1]
      : void 0;
  l =
    i &&
    !(i === "itch.io" || i.match(/\.itch\.io$/) || i.match(/\.itch\.zone$/))
      ? !0
      : void 0;

  // Remove hotlinking logic by not sending the beacon or redirecting
  if (!l) {
    return; // Exit early to disable hotlinking behavior
  }

  navigator.sendBeacon != null &&
    ((o = new FormData()),
    o.append("domain", i || "unknown-domain"),
    n && o.append("upload_id", n),
    o.append("hotlink", "1"),
    navigator.sendBeacon("https://itch.io/html-callback", o));

  if (n) {
    // If hotlinking is triggered, stop the redirection to the hotlink page
    // Comment out the redirection to disable it
    // window.location = "https://itch.io/embed-hotlink/" + n;
  } else {
    // Comment out the redirection to disable it
    // window.location = "https://itch.io/embed-hotlink";
  }
})();

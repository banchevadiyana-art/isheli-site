/* ishéli · analytics consent
   Google Analytics 4 loads only after a clear "Accept". Nothing is set before that:
   no gtag, no cookies, no request to Google. "Decline" is as easy as "Accept".
   The choice is kept on this device for 6 months (localStorage, not a cookie).
   A browser sending Global Privacy Control is treated as "Decline" and never asked. */
(function () {
  var GA_ID = "";            // e.g. "G-XXXXXXXXXX" from Google Analytics → Admin → Data streams
  var KEY = "ish.consent";   // {v:"yes"|"no", t:timestamp}
  var MAX_AGE = 1000 * 60 * 60 * 24 * 182;

  function read() {
    try { var c = JSON.parse(localStorage.getItem(KEY) || "null"); if (c && Date.now() - c.t < MAX_AGE) return c.v; } catch (_) {}
    return null;
  }
  function save(v) { try { localStorage.setItem(KEY, JSON.stringify({ v: v, t: Date.now() })); } catch (_) {} }

  function clearGaCookies() {
    var host = location.hostname.replace(/^www\./, "");
    document.cookie.split(";").forEach(function (c) {
      var name = c.split("=")[0].trim();
      if (/^_ga/.test(name)) {
        ["", "; domain=" + host, "; domain=." + host].forEach(function (d) {
          document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + d;
        });
      }
    });
  }

  var loaded = false;
  function loadGA() {
    if (loaded || !GA_ID) return; loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag("js", new Date());
    gtag("config", GA_ID, { anonymize_ip: true, allow_google_signals: false, allow_ad_personalization_signals: false });
    var s = document.createElement("script"); s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
  }

  /* Events from the page: ishTrack("sign_up", {...}). Silently dropped without consent. */
  window.ishTrack = function (name, params) { if (loaded && window.gtag) gtag("event", name, params || {}); };

  var bar = null;
  function hide() { if (bar) { bar.classList.remove("on"); var b = bar; setTimeout(function () { b.remove(); }, 250); bar = null; } }
  function choose(v) {
    save(v); hide();
    if (v === "yes") loadGA();
    else { clearGaCookies(); if (loaded) location.reload(); }
  }
  function show() {
    if (bar || !GA_ID) return;
    bar = document.createElement("div");
    bar.className = "consent"; bar.setAttribute("role", "region"); bar.setAttribute("aria-label", "Analytics choice");
    bar.innerHTML =
      '<p>Analytics cookies? They help us see what’s useful. <a href="/privacy.html#our-website-and-waitlist">Details</a></p>' +
      '<div><button type="button" data-v="no">No</button><button type="button" data-v="yes">Yes</button></div>';
    bar.addEventListener("click", function (e) { var v = e.target.getAttribute && e.target.getAttribute("data-v"); if (v) choose(v); });
    document.body.appendChild(bar);
    requestAnimationFrame(function () { requestAnimationFrame(function () { bar && bar.classList.add("on"); }); });
  }

  function init() {
    document.querySelectorAll("[data-consent-settings]").forEach(function (a) {
      if (!GA_ID) { a.hidden = true; return; }
      a.addEventListener("click", function (e) { e.preventDefault(); show(); });
    });
    if (navigator.globalPrivacyControl) return;          // treated as "no"; never asked
    var c = read();
    if (c === "yes") loadGA();
    else if (c === null) setTimeout(show, 1200);          // after the hero has settled
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();

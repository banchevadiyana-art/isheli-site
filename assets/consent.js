/* ishéli · analytics consent
   Google Tag Manager (which loads Google Analytics 4) loads only after a clear "Accept". Nothing is set before that:
   no gtag, no cookies, no request to Google. "Decline" is as easy as "Accept".
   The choice is kept on this device for 6 months (localStorage, not a cookie).
   A browser sending Global Privacy Control is treated as "Decline" and never asked. */
(function () {
  var GTM_ID = "GTM-5RVLJRR3"; // Google Tag Manager container; GA4 is configured inside it
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
    if (loaded || !GTM_ID) return; loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    /* Only analytics is allowed: no ads, no ad personalisation. */
    gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    var s = document.createElement("script"); s.async = true;
    s.src = "https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(GTM_ID);
    document.head.appendChild(s);
  }

  /* Events from the page: ishTrack("generate_lead", {...}) becomes a dataLayer event for GTM.
     Silently dropped without consent. */
  window.ishTrack = function (name, params) {
    if (!loaded) return;
    var e = { event: name }; params = params || {};
    for (var k in params) if (Object.prototype.hasOwnProperty.call(params, k)) e[k] = params[k];
    window.dataLayer.push(e);
  };

  var bar = null;
  function hide() { if (bar) { bar.classList.remove("on"); var b = bar; setTimeout(function () { b.remove(); }, 250); bar = null; } }
  function choose(v) {
    save(v); hide();
    if (v === "yes") loadGA();
    else { clearGaCookies(); if (loaded) location.reload(); }
  }
  function show() {
    if (bar || !GTM_ID) return;
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
      if (!GTM_ID) { a.hidden = true; return; }
      a.addEventListener("click", function (e) { e.preventDefault(); show(); });
    });
    if (navigator.globalPrivacyControl) return;          // treated as "no"; never asked
    var c = read();
    if (c === "yes") loadGA();
    else if (c === null) setTimeout(show, 1200);          // after the hero has settled
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();

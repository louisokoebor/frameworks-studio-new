// Cookie consent banner. Google Analytics only loads after the visitor accepts;
// the default "denied" consent state is set by the inline snippet in each page's <head>.
const STORAGE_KEY = "fs-cookie-consent";
const GA_SRC = "https://www.googletagmanager.com/gtag/js?id=G-LGVB34BVLZ";

function readChoice() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveChoice(choice) {
  try {
    localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // Storage blocked: the choice still applies for this page view
  }
}

function loadAnalytics() {
  if (document.querySelector(`script[src="${GA_SRC}"]`)) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = GA_SRC;
  document.head.appendChild(script);
}

function clearAnalyticsCookies() {
  // GA sets _ga / _ga_<id> on the top-level domain, so expire them on each domain level
  const parts = window.location.hostname.split(".");
  const domains = parts.map((_, i) => parts.slice(i).join(".")).filter((d) => d.includes("."));
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0].trim();
    if (!name.startsWith("_ga")) return;
    const expire = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    document.cookie = expire;
    domains.forEach((domain) => {
      document.cookie = `${expire}; domain=.${domain}`;
    });
  });
}

function applyChoice(choice) {
  if (typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    analytics_storage: choice === "granted" ? "granted" : "denied",
  });
  if (choice === "granted") loadAnalytics();
  else clearAnalyticsCookies();
}

function getPrivacyHref() {
  // Resolve relative to the site root so the link works from nested service pages
  return new URL("/privacy.html#cookies", window.location.origin).href;
}

function buildBanner() {
  const banner = document.createElement("div");
  banner.className = "cookie-banner";
  banner.setAttribute("role", "region");
  banner.setAttribute("aria-label", "Cookie consent");
  banner.innerHTML = `
    <div class="cookie-banner_content">
      <p class="cookie-banner_title">We use cookies</p>
      <p class="cookie-banner_text">We'd like to use Google Analytics cookies to understand how people use this site so we can improve it. They're only set if you accept. <a href="${getPrivacyHref()}">Read our privacy policy</a>.</p>
    </div>
    <div class="cookie-banner_actions">
      <button type="button" class="button w-button" data-cookie-choice="denied">Reject</button>
      <button type="button" class="button-2 w-button" data-cookie-choice="granted">Accept</button>
    </div>
  `;

  banner.querySelectorAll("[data-cookie-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      const choice = button.dataset.cookieChoice;
      saveChoice(choice);
      applyChoice(choice);
      hideBanner(banner);
    });
  });

  return banner;
}

function showBanner({ focus = false } = {}) {
  let banner = document.querySelector(".cookie-banner");
  if (!banner) {
    banner = buildBanner();
    document.body.appendChild(banner);
  }
  // Next frame so the slide-in transition runs
  requestAnimationFrame(() => banner.classList.add("is-visible"));
  if (focus) banner.querySelector('[data-cookie-choice="granted"]').focus({ preventScroll: true });
}

function hideBanner(banner) {
  banner.classList.remove("is-visible");
}

function init() {
  if (!readChoice()) showBanner();

  document.querySelectorAll("[data-cookie-settings]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      showBanner({ focus: true });
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

async function getSiteSecurityInfo() {
  const info = {};

  // 1. Podstawowe dane URL
  const url = new URL(window.location.href);
  info.fullUrl = url.href;
  info.domain = url.hostname;
  info.protocol = url.protocol;
  info.port = url.port || (url.protocol === "https:" ? "443" : "80");
  info.origin = url.origin;

  // 2. Dane o połączeniu (HTTPS wymusza secure context)
  info.isSecureContext = window.isSecureContext;

  // 3. Obsługiwane technologie bezpieczeństwa
  info.csp =
    document.querySelector("meta[http-equiv='Content-Security-Policy']")
      ?.content || null;

  info.referrerPolicy = document.referrer
    ? document.referrer
    : document.querySelector("meta[name='referrer']")?.content || "default";

  info.cookies = document.cookie
    ? document.cookie.split(";").map((c) => c.trim())
    : [];

  // 4. Service Workers (mogą zmieniać ruch)
  if ("serviceWorker" in navigator) {
    info.serviceWorkers = await navigator.serviceWorker
      .getRegistrations()
      .then((regs) => regs.map((r) => r.active?.scriptURL || r));
  } else {
    info.serviceWorkers = [];
  }

  await fetch(`https://api.ssllabs.com/api/v3/analyze?host=${info.domain}`)
    .then((response) => response.json())
    .then((data) => {
      info.ssllabs = data;
    })
    .catch((error) => {
      info.ssllabs = { error: "Nie udało się pobrać danych z SSL Labs" };
    });

  return info;
}

async function init() {
  let dane = await getSiteSecurityInfo();
  const bar = document.createElement("div");
  bar.textContent =
    "To jest nakładka z mojego rozszerzenia 🙃 Dane ->" +
    JSON.stringify(dane, null, 2);
  bar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 8px 16px;
    background: #0f172a;
    color: #e5e7eb;
    font-family: system-ui, sans-serif;
    font-size: 14px;
    z-index: 999999999;
    box-shadow: 0 4px 12px rgba(0,0,0,.4);
  `;
  document.body.appendChild(bar);

  // 3. Przesuń stronę w dół, żeby baner nie zakrywał
  document.body.style.paddingTop = "40px";
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

async function init() {
  await fetch("https://api.ssllabs.com/api/v3/analyze?host=example.com")
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // Zawiera dane o certyfikacie SSL
    })
    .catch((error) => {
      console.error("Błąd przy pobieraniu danych SSL:", error);
    });
  // 2. Dodanie banera na górze strony
  const originalFetch = window.fetch;

  window.fetch = async (url, options) => {
    const domain = new URL(url).hostname;
    console.log("Domena zapytania:", domain);
    return originalFetch(url, options);
  };
  const bar = document.createElement("div");
  bar.textContent = "To jest nakładka z mojego rozszerzenia 🙃 Dane ->" + dane;
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

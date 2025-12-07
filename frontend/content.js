if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

function init() {
  // 1. Zmiana tytułu strony
  document.title = "[EXT] " + document.title;

  // 2. Dodanie banera na górze strony
  const bar = document.createElement("div");
  bar.textContent = "To jest nakładka z mojego rozszerzenia 🙃";
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
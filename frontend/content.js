const overlay = document.createElement("div");
overlay.style.cssText = `
  position: fixed;
  top: 20px;
  right: 20px;
  width: 260px;
  min-height: 80px;
  background: rgba(15,23,42,0.92);
  color: #e5e7eb;
  padding: 12px 14px;
  z-index: 999999999;
  font-family: system-ui, sans-serif;
  font-size: 13px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
`;
overlay.innerText = "Ładowanie danych...";
document.body.appendChild(overlay);

// helper do API przeglądarki (Chrome/Firefox)
const api = typeof browser !== "undefined" ? browser : chrome;

// pytamy background o dane
api.runtime.sendMessage({ type: "GET_DATA" }, (response) => {
  if (!response || response.error) {
    overlay.innerText = "Błąd: " + (response?.error || "brak odpowiedzi");
    return;
  }

  // tutaj dostajesz dane z backendu
  overlay.innerText = "Dane z API:\n" + JSON.stringify(response.data, null, 2);
});
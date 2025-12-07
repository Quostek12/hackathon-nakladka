chrome.runtime.onInstalled.addListener(() => {
  console.log("Rozszerzenie zainstalowane.");
});

// Sprawdzanie certyfikatu SSL
async function checkSSLStatus(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    if (response.ok) {
      return "Strona używa certyfikatu SSL (HTTPS)";
    }
  } catch (error) {
    return "Strona NIE używa certyfikatu SSL";
  }
  return "Nie można sprawdzić SSL";
}

// Nasłuchujemy na kliknięcie rozszerzenia
chrome.action.onClicked.addListener(async (tab) => {
  const status = await checkSSLStatus(tab.url);
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: injectQRCode,
    args: [tab.url, status],
  });
});

// Funkcja, która wstrzykuje kod QR do strony
function injectQRCode(url, sslStatus) {
  const qrContent = `${url}\n${sslStatus}`;

  // Dodaj kod QR do strony
  const img = document.createElement("img");
  img.src = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
    qrContent
  )}&size=200x200`;
  img.style.position = "absolute";
  img.style.top = "10px";
  img.style.right = "10px";
  img.style.zIndex = "1000";
  document.body.appendChild(img);
}

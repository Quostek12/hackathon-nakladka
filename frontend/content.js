// Listener dla wiadomości z popup
const api = typeof browser !== "undefined" ? browser : chrome;

api.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_SECURITY_INFO') {
    console.log('Sprawdzanie informacji bezpieczeństwa...');
    
    const result = {
      csp: "Brak CSP",
      tls: "Nieznany"
    };
    const hostname = window.location.hostname;
    
    // Sprawdzenie CSP z meta tagów
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (cspMeta) {
      console.log('CSP znaleziony w meta tag');
      result.csp = "CSP: Aktywny (meta tag)";
    }
    
    // Pobierz szczegóły TLS z backendu
    const tlsPromise = fetch(`http://localhost:8000/cert/tls?site=${hostname}`)
      .then(resp => resp.json())
      .then(tlsData => {
        if (tlsData && tlsData.tls_version) {
          const version = String(tlsData.tls_version);
          result.tls = version;
        } else {
          result.tls = "brak tls";
        }
      })
      .catch(err => {
        console.error('Błąd pobierania TLS z backendu:', err);
        result.tls = "błąd pobrania tls";
      });
    
    // Sprawdzenie CSP z nagłówków HTTP poprzez fetch
    const cspPromise = fetch(window.location.href, { method: 'HEAD' })
      .then(response => {
        const cspHeader = response.headers.get('content-security-policy');
        console.log('CSP header:', cspHeader);
        if (cspHeader && result.csp === "Brak CSP") {
          result.csp = "CSP: Aktywny (HTTP header)";
        }
      })
      .catch(error => {
        console.error('Błąd sprawdzania CSP:', error);
      });

    Promise.all([tlsPromise, cspPromise]).finally(() => sendResponse(result));
    
    return true; // Asynchroniczna odpowiedź
  }
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

async function init() {
  try {
    const hostname = window.location.hostname;
    const data = await fetch("https://api.ssllabs.com/api/v3/analyze?host=" + hostname)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch((error) => {
        console.error("Błąd przy pobieraniu danych SSL:", error);
        return null;
      });
      await fetch("http://localhost:8000/cert/tls?site=" + hostname)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
            });

    const originalFetch = window.fetch;
    window.fetch = async (url, options) => {
      const domain = new URL(url).hostname;
      console.log("Domena zapytania:", domain);
      return originalFetch(url, options);
    };

    const bar = document.createElement("div");
    const dataText = data ? "Dane pozyskane" : "Brak danych";
    bar.textContent = "To jest nakładka z mojego rozszerzenia 🙃 " + dataText;
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
    document.body.style.paddingTop = "40px";
  } catch (error) {
    console.error("Błąd inicjalizacji:", error);
  }
}

const api = typeof browser !== "undefined" ? browser : chrome;

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Popup loaded");
  const statusDiv = document.getElementById("status");
  const qrcodeDiv = document.getElementById("qrcode");
  const refreshBtn = document.getElementById("refresh");

  const updateStatus = async () => {
    try {
      console.log("Updating status...");
      const [tab] = await api.tabs.query({ active: true, currentWindow: true });
      
      // Parsowanie URL
      const urlObj = new URL(tab.url);
      const fullUrl = tab.url;
      const protocol = urlObj.protocol;
      const hostname = urlObj.hostname;
      
      console.log("Full URL:", fullUrl);
      console.log("Protocol:", protocol);
      console.log("Hostname:", hostname);
      
      // Sprawdzenie czy to gov.pl
      const isGovPl = hostname.endsWith('.gov.pl');
      const govPLStatus = isGovPl ? '✓ gov.pl' : '✗ Nie gov.pl';
      
      // Sprawdzenie informacji bezpieczeństwa - wysyłamy wiadomość do content script
      let cspInfo = "Sprawdzanie...";
      let tlsInfo = "Sprawdzanie...";
      statusDiv.textContent = `Domena: ${hostname}\nProtokół: ${protocol}\n${govPLStatus}\n${cspInfo}\n${tlsInfo}\n\nRozszerzenie działa! ✓`;
      
      try {
        const response = await api.tabs.sendMessage(tab.id, { type: 'GET_SECURITY_INFO' });
        console.log('Security info response:', response);
        if (response) {
          cspInfo = response.csp || "Brak CSP";
          tlsInfo = response.tls || "Nieznany";
        } else {
          cspInfo = "Brak CSP";
          tlsInfo = "Nieznany";
        }
      } catch (e) {
        console.error("Error getting security info:", e);
        cspInfo = "Błąd sprawdzania CSP";
        tlsInfo = "Błąd sprawdzania TLS";
      }

      // Pobierz TLS bezpośrednio z backendu jako źródło prawdy (wersja tylko)
      try {
        const tlsResp = await fetch(`http://localhost:8000/cert/tls?site=${hostname}`);
        const tlsData = await tlsResp.json();
        if (tlsData && tlsData.tls_version) {
          tlsInfo = String(tlsData.tls_version);
        } else {
          tlsInfo = "brak tls";
        }
      } catch (err) {
        console.error("Błąd pobierania TLS z backendu:", err);
        tlsInfo = `${tlsInfo} (brak połączenia z backendem)`;
      }
      
      // Wyświetlenie informacji
      statusDiv.textContent = "Zeskanuj kod QR aplikacją mObywatel, aby sprawdzić, czy strona jest bezpieczna:";
      
      // Czyszczenie poprzedniego QR kodu
      qrcodeDiv.innerHTML = '';
      
      // Przygotowanie danych do QR kodu
      const qrData = [
        `URL: ${fullUrl}`,
        `Protocol: ${protocol}`,
        `Domain: ${hostname}`,
        `Gov.pl: ${isGovPl}`,
        `CSP: ${cspInfo}`,
        `${tlsInfo}`
      ].join('\n');
      
      console.log("QR Data:", qrData);
      console.log("QRCodeLib available:", typeof window.QRCodeLib);
      
      // Generowanie QR kodu przy użyciu biblioteki
      if (window.QRCodeLib && typeof window.QRCodeLib.toCanvas === 'function') {
        console.log("QRCodeLib found, generating QR code...");
        try {
          const canvas = document.createElement('canvas');
          qrcodeDiv.appendChild(canvas);
          
          await window.QRCodeLib.toCanvas(canvas, qrData, {
            width: 200,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#ffffff'
            }
          });
          
          canvas.style.border = '1px solid #0f172a';
          canvas.style.borderRadius = '6px';
          console.log("QR Code generated successfully");
        } catch (e) {
          console.error("Error generating QR:", e);
          qrcodeDiv.innerHTML = `<div style="color: red; text-align: center; font-size: 12px;">Błąd QR: ${e.message}</div>`;
        }
      } else {
        console.error("QRCodeLib not found or missing toCanvas method!");
        console.log("Available methods:", Object.keys(window.QRCodeLib || {}));
        qrcodeDiv.innerHTML = "<div style='color: red; text-align: center; font-size: 12px;'>QR Library not loaded properly</div>";
      }
      
    } catch (error) {
      console.error("Error:", error);
      statusDiv.textContent = `Błąd: ${error.message}`;
    }
  };

  updateStatus();
  refreshBtn.addEventListener("click", updateStatus);
});

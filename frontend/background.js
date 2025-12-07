const api = typeof browser !== "undefined" ? browser : chrome;

const cspHeaders = new Map();

api.webRequest.onHeadersReceived.addListener(
  (details) => {
    const cspHeader = details.responseHeaders.find(
      header => header.name.toLowerCase() === 'content-security-policy'
    );
    
    if (cspHeader) {
      cspHeaders.set(details.tabId, cspHeader.value);
      console.log(`CSP found for tab ${details.tabId}:`, cspHeader.value);
    } else {
      cspHeaders.set(details.tabId, null);
    }
  },
  { urls: ["<all_urls>"], types: ["main_frame"] },
  ["responseHeaders"]
);

api.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_CSP_HEADER') {
    const csp = cspHeaders.get(request.tabId);
    if (csp) {
      sendResponse({ csp: "CSP: Aktywny" });
    } else {
      sendResponse({ csp: "Brak CSP" });
    }
    return true;
  }
});

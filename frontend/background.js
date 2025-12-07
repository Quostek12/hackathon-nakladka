{
  "manifest_version": 2,
  "name": "Moja Nakładka",
  "version": "1.0",
  "description": "Overlay + fetch do API",
  
  "permissions": [
    "tabs",
    "https://twoje-api.pl/*"
  ],

  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"]
    }
  ],

  "background": {
    "scripts": ["background.js"],
    "persistent": false
  }
}

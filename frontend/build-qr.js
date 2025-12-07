const QRCode = require('qrcode');

// Export for browser
if (typeof window !== 'undefined') {
  window.QRCodeLib = QRCode;
}

module.exports = QRCode;

const QRCode = require('qrcode');

if (typeof window !== 'undefined') {
  window.QRCodeLib = QRCode;
}

module.exports = QRCode;

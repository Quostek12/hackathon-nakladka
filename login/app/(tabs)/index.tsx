
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

// Helper: convert hex color to rgba with given alpha (0..1)
function colorWithAlpha(hex: string, alpha: number) {
  const h = hex.replace('#', '');
  const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function TabOneScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedQRCodes, setScannedQRCodes] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(true);

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const cameraRef = useRef<CameraView>(null);

  // Zezwolenia
  useEffect(() => {
    (async () => {
      if (!permission) {
        await requestPermission();
      }
    })();
  }, [permission, requestPermission]);

  // Funkcja obsługi skanowania QR
  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (isScanning) {
      setScannedQRCodes((prev) => [data, ...prev]);
      
      // Opóźnij możliwość skanowania na 100ms
      setIsScanning(false);
      setTimeout(() => setIsScanning(true), 100);
    }
  };

  if (!permission) return <Text>Proszę czekać…</Text>;
  if (!permission.granted) return <Text>Brak dostępu do kamery</Text>;

  return (
    <View style={styles.container}>
      <View style={[styles.cameraWrapper, { backgroundColor: theme.tint }]}
      >
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
          autofocus="on"
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={handleBarCodeScanned}
        />
      </View>

      {scannedQRCodes.length > 0 && (
        <View style={styles.lastCodeContainer}>
          <View style={[styles.lastCodeBox, { borderColor: theme.accent, backgroundColor: colorWithAlpha(theme.background, 0.98) }]}>
            <Text style={[styles.lastCodeText, { color: theme.text }]}>{scannedQRCodes[0]}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 30,
  },
  cameraWrapper: {
    width: 250,
    height: 320,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  codesContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 12,
    alignItems: 'center',
  },
  codesLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  codeItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
    width: '90%',
    alignSelf: 'center',
  },
  codeText: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  lastCodeContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 14,
  },
  lastCodeBox: {
    width: '90%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lastCodeText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
});

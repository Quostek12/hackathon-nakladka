import { StyleSheet, View, Text, ScrollView } from "react-native";
import { useState, useEffect, useRef } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

// Helper: convert hex color to rgba with given alpha (0..1)
function colorWithAlpha(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const bigint = parseInt(
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h,
    16
  );
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function TabOneScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedQRCodes, setScannedQRCodes] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(true);
  const [securityStatus, setSecurityStatus] = useState<
    "danger" | "warning" | "safe" | null
  >(null);

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const cameraRef = useRef<CameraView>(null);

  // Zezwolenia
  useEffect(() => {
    (async () => {
      if (!permission) {
        await requestPermission();
      }
    })();
  }, [permission, requestPermission]);

  // Obsługa skanowanego QR code
  useEffect(() => {
    if (scannedQRCodes.length === 0) return;

    const qrData = scannedQRCodes[0];
    const parsed = parseQRData(qrData);
    const backendData = parsed.backendData;

    // Zapytanie do backendu
    const confirmQR = async () => {
      try {
        const response = await fetch("http://localhost:8000/qr/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ backendData }),
        });
        console.log("QR confirmed:", await response.json());
      } catch (error) {
        console.error("Błąd potwierdzenia QR:", error);
      }
    };

    confirmQR();

    // Sprawdzenie bezpieczeństwa
    const hasTLS =
      backendData?.tls_version?.includes("TLSv1.3") ||
      qrData.includes("TLSv1.3");
    const hasHTTPS = qrData.toLowerCase().includes("https");
    const hasGov = qrData.toLowerCase().includes(".gov");

    if (!hasTLS || !hasHTTPS) {
      setSecurityStatus("danger");
    } else if (!hasGov) {
      setSecurityStatus("warning");
    } else {
      setSecurityStatus("safe");
    }
  }, [scannedQRCodes]);

  // Parsowanie danych z QR code
  const parseQRData = (qrData: string) => {
    try {
      // Szukamy linii zaczynającej się od "Backend Data:"
      const lines = qrData.split("\n");
      let backendData = null;

      for (const line of lines) {
        if (line.startsWith("Backend Data:")) {
          const jsonStr = line.replace("Backend Data: ", "");
          backendData = JSON.parse(jsonStr);
          break;
        }
      }

      return {
        backendData,
        fullText: qrData,
      };
    } catch (error) {
      console.error("Błąd parsowania QR:", error);
      return {
        backendData: null,
        fullText: qrData,
      };
    }
  };

  // Funkcja obsługi skanowania QR
  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (isScanning) {
      setScannedQRCodes((prev: any) => [data, ...prev]);
      const parsed = parseQRData(data);
      console.log("Backend Data:", parsed.backendData);

      // Opóźnij możliwość skanowania na 100ms
      setIsScanning(false);
      setTimeout(() => setIsScanning(true), 100);
    }
  };

  if (!permission) return <Text>Proszę czekać…</Text>;
  if (!permission.granted) return <Text>Brak dostępu do kamery</Text>;

  return (
    <View style={styles.container}>
      <View style={[styles.cameraWrapper, { backgroundColor: theme.tint }]}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
          autofocus="on"
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={handleBarCodeScanned}
        />
      </View>

      {securityStatus === "danger" && (
        <View style={styles.lastCodeContainer}>
          <View style={styles.dangerBox}>
            <Text style={styles.dangerText}>
              Strona jest niebezpieczna z powodu braku szyfrowania.
            </Text>
          </View>
        </View>
      )}

      {securityStatus === "warning" && (
        <View style={styles.lastCodeContainer}>
          <View style={styles.warnBox}>
            <Text style={styles.warnText}>
              Strona bezpieczna, ale nie rządowa.
            </Text>
          </View>
        </View>
      )}

      {securityStatus === "safe" && (
        <View style={styles.lastCodeContainer}>
          <View style={styles.safeBox}>
            <Text style={styles.safeText}>Bezpieczna strona rządowa</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 30,
  },
  cameraWrapper: {
    width: 250,
    height: 320,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  codesContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 12,
    alignItems: "center",
  },
  codesLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  codeItem: {
    backgroundColor: "#f9f9f9",
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#007AFF",
    width: "90%",
    alignSelf: "center",
  },
  codeText: {
    fontSize: 12,
    color: "#333",
    fontFamily: "monospace",
    textAlign: "center",
  },
  lastCodeContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 14,
  },
  lastCodeBox: {
    width: "90%",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  lastCodeText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "monospace",
    textAlign: "center",
  },
  dangerBox: {
    width: "90%",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#ffd6d6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ff4d4d",
  },
  dangerText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#cc0000",
    textAlign: "center",
  },
  warnBox: {
    width: "90%",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#fff4cc",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ffd11a",
  },
  warnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#b36b00",
    textAlign: "center",
  },
  safeBox: {
    width: "90%",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#e6ffea",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#33cc66",
  },
  safeText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0b6623",
    textAlign: "center",
  },
});

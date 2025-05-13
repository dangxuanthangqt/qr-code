"use client";
//https://github.com/mebjas/html5-qrcode/issues/823
import {
  Html5Qrcode,
  Html5QrcodeCameraScanConfig,
  QrcodeSuccessCallback,
} from "html5-qrcode";
import { useEffect, useRef, useState } from "react";

const QR_CODE_SCANNER_ID = "qr-code-scanner";

const DEFAULT_VERBOSE = false;

const DEFAULT_CONFIG: Html5QrcodeCameraScanConfig = {
  fps: 10,
  qrbox: 250,
  aspectRatio: 1,
  disableFlip: false,
};

type QrCodeScannerProps = {
  config?: Html5QrcodeCameraScanConfig;
  isScanning: boolean;
  setIsScanning: (isScanning: boolean) => void;
  onScanSuccess: QrcodeSuccessCallback;
  onScanError?: (errorMessage: string) => void;
};

function QrCodeScanner({
  config = DEFAULT_CONFIG,
  isScanning,
  onScanSuccess,
  onScanError,
  setIsScanning,
}: QrCodeScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScanningRef = useRef<boolean>(false);
  const [scannerInitialized, setScannerInitialized] = useState(false);

  useEffect(() => {
    if (isScanning && !scannerRef.current) {
      try {
        const element = document.getElementById(QR_CODE_SCANNER_ID);

        if (element) {
          const html5QrCodeInstance = new Html5Qrcode(
            QR_CODE_SCANNER_ID,
            DEFAULT_VERBOSE
          );
          scannerRef.current = html5QrCodeInstance;

          setScannerInitialized(true);
        }
      } catch (error) {
        console.error("Lỗi khi khởi tạo QR scanner:", error);
        setIsScanning(false);
      }
    }

    // Cleanup function
    return () => {
      if (scannerRef.current && isScanningRef.current) {
        scannerRef.current
          .stop()
          .catch((error) => console.error("Lỗi khi dừng camera:", error))
          .finally(() => {
            isScanningRef.current = false;
          });
      }
    };
  }, [isScanning]);

  useEffect(() => {
    if (isScanning && scannerInitialized && !isScanningRef.current) {
      startScanner();
    } else if (!isScanning && isScanningRef.current) {
      stopScanner();
    }
  }, [isScanning, scannerInitialized]);

  const startScanner = async () => {
    if (scannerRef.current && !isScanningRef.current) {
      try {
        await scannerRef.current.start(
          { facingMode: { exact: "environment" } },
          config,
          onScanSuccess,
          onScanError
        );

        isScanningRef.current = true;
      } catch (error) {
        console.log("Lỗi khi bắt đầu quét mã QR:", error);
        isScanningRef.current = false;
        setIsScanning(false);
      }
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && isScanningRef.current) {
      try {
        await scannerRef.current.stop();
        isScanningRef.current = false;
      } catch (error) {
        console.log("Lỗi khi dừng camera:", error);
      }
    }
  };

  const handleCloseScanner = () => {
    setIsScanning(false);
  };

  if (!isScanning) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg w-[90%] max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Quét mã QR</h3>
          <button
            onClick={handleCloseScanner}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div
          className="w-full aspect-square border border-amber-500"
          id={QR_CODE_SCANNER_ID}
        ></div>
      </div>
    </div>
  );
}

export default QrCodeScanner;

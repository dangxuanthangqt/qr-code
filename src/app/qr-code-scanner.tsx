"use client";

import {
  Html5Qrcode,
  Html5QrcodeCameraScanConfig,
  QrcodeSuccessCallback,
} from "html5-qrcode";
import { Fragment, useEffect, useRef } from "react";

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
  onScanSuccess: QrcodeSuccessCallback;
  onScanError?: (errorMessage: string) => void;
};

function QrCodeScanner({
  config = DEFAULT_CONFIG,
  onScanSuccess,
  onScanError,
}: QrCodeScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScanningRef = useRef<boolean>(false);

  useEffect(() => {
    try {
      const html5QrCode = new Html5Qrcode(QR_CODE_SCANNER_ID);
      scannerRef.current = html5QrCode;

      return () => {
        if (scannerRef.current) {
          if (isScanningRef.current) {
            scannerRef.current
              .stop()
              .catch((error) => console.log("Lỗi khi dừng camera:", error));
          }
          scannerRef.current = null;
        }
      };
    } catch (error) {
      console.log("Lỗi khi khởi tạo QR scanner:", error);
    }
  }, []);

  async function startScanner() {
    if (scannerRef.current) {
      try {
        const devices = await Html5Qrcode.getCameras();
        // scannerRef.current

        if (devices && devices.length) {
          const cameraId = devices[0].id;

          await scannerRef.current.start(
            cameraId,
            config,
            (decodedText: string, decodedResult: any) => {
              console.log("Decoded text: ", decodedText);
              console.log("Decoded result: ", decodedResult);
              onScanSuccess(decodedText, decodedResult);
              scannerRef.current?.clear();
            },
            (errorMessage: string) => {
              // console.error("Scan error: ", errorMessage);
            }
          );

          isScanningRef.current = true;
          // .. use this to start scanning.
        }
      } catch (error) {
        console.log("Lỗi khi bắt đầu quét mã QR:", error);
        isScanningRef.current = false;
      }
    }
  }

  async function stopScanner() {
    if (scannerRef.current && isScanningRef.current) {
      try {
        await scannerRef.current.stop();
        isScanningRef.current = false;
      } catch (error) {
        console.log("Lỗi khi dừng camera:", error);
      }
    }
  }

  return (
    <Fragment>
      <div className="flex">
        <button
          style={{ margin: "10px", width: 100, height: 100, background: "red" }}
          onClick={startScanner}
        >
          Scan QR Code
        </button>
        <button
          style={{ margin: "10px", width: 100, height: 100, background: "red" }}
          onClick={stopScanner}
        >
          Stop Scan
        </button>
      </div>
      <div
        className="w-[400px] h-[500px] border border-amber-500"
        id={QR_CODE_SCANNER_ID}
      ></div>
      ;
    </Fragment>
  );
}

export default QrCodeScanner;

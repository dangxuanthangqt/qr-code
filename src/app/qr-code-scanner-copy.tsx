"use client";
//https://github.com/mebjas/html5-qrcode/issues/823
import {
  Html5Qrcode,
  Html5QrcodeCameraScanConfig,
  QrcodeSuccessCallback,
} from "html5-qrcode";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";

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
  isScanning: boolean;
  setIsScanning: (isScanning: boolean) => void;
};

function QrCodeScanner({
  config = DEFAULT_CONFIG,
  onScanSuccess,
  onScanError,
  isScanning,
  setIsScanning,
}: QrCodeScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScanningRef = useRef<boolean>(false);

  useEffect(() => {
    try {
      const html5QrCode = new Html5Qrcode(QR_CODE_SCANNER_ID, DEFAULT_VERBOSE);
      scannerRef.current = html5QrCode;

      return () => {
        if (scannerRef.current) {
          if (isScanningRef.current) {
            scannerRef.current
              .stop()
              .catch((error) => console.error("Lỗi khi dừng camera:", error));
          }
          scannerRef.current = null;
        }
      };
    } catch (error) {
      console.error("Lỗi khi khởi tạo QR scanner:", error);
    }
  }, []);

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
        setIsScanning(true);
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
        setIsScanning(false);
      } catch (error) {
        console.log("Lỗi khi dừng camera:", error);
      }
    }
  };

  useEffect(() => {
    if (isScanning && !isScanningRef.current) {
      startScanner();
    } else if (!isScanning && isScanningRef.current) {
      stopScanner();
    }
  }, [isScanning]);

  return (
    <div
      // className={`${
      //   isScanning ? "fixed inset-0 z-50" : "w-[400px] h-[500px]"
      // } border border-amber-500`}
      className="w-[400px] h-[500px] border border-amber-500"
      id={QR_CODE_SCANNER_ID}
    ></div>
  );
}

export default QrCodeScanner;

// "use client";

// import { useState } from "react";
// import QrCodeScanner from "./qr-code-scanner";

// export default function Home() {
//   const [isScanning, setIsScanning] = useState(false);

//   const [result, setResult] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const handleScanSuccess = (decodedText: string, decodedResult: any) => {
//     console.log("Decoded text: ", decodedText);
//     console.log("Decoded result: ", decodedResult);
//     setResult(decodedText);
//     setError(null);
//     setIsScanning(false);
//   };

//   const handleScanError = (errorMessage: string) => {
//     setError(errorMessage);
//     setIsScanning(false);
//     console.error("Scan error: ", errorMessage);
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">QR Code Scanner</h1>

//       {result && (
//         <div className="mb-4">
//           <h2 className="text-xl font-semibold">Kết quả quét:</h2>
//           <p>{result}</p>
//         </div>
//       )}
//       {error && (
//         <div className="mb-4">
//           <h2 className="text-xl font-semibold text-red-500">Lỗi:</h2>
//           <p>{error}</p>
//         </div>
//       )}
//       <div className="mb-4">
//         {!isScanning ? (
//           <button
//             className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//             onClick={() => setIsScanning(true)}
//           >
//             Bật Camera
//           </button>
//         ) : (
//           <button
//             className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
//             onClick={() => setIsScanning(false)}
//           >
//             Tắt Camera
//           </button>
//         )}
//       </div>

//       <QrCodeScanner
//         onScanSuccess={handleScanSuccess}
//         onScanError={handleScanError}
//         isScanning={isScanning}
//         setIsScanning={setIsScanning}
//       />
//     </div>
//   );
// }

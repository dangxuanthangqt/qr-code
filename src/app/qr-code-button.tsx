"use client";

import { useState } from "react";
import QrCodeScanner from "./qr-code-scanner-copy";

export default function QrCodeButton() {
  const [isScanning, setIsScanning] = useState(false);

  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScanSuccess = (decodedText: string, decodedResult: any) => {
    console.log("Decoded text: ", decodedText);
    console.log("Decoded result: ", decodedResult);
    setResult(decodedText);
    setError(null);
    setIsScanning(false);
  };

  const handleScanError = (errorMessage: string) => {
    // setError(errorMessage);
    // setIsScanning(false);
    console.log("Scan error: ", errorMessage);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">QR Code Scanner</h1>

      {result && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Kết quả quét:</h2>
          <p>{result}</p>
        </div>
      )}
      {error && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-red-500">Lỗi:</h2>
          <p>{error}</p>
        </div>
      )}
      <div className="mb-4">
        {!isScanning ? (
          <button
            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => setIsScanning(true)}
          >
            Bật Camera
          </button>
        ) : (
          <button
            className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={() => setIsScanning(false)}
          >
            Tắt Camera
          </button>
        )}
      </div>

      <QrCodeScanner
        onScanSuccess={handleScanSuccess}
        onScanError={handleScanError}
        isScanning={isScanning}
        setIsScanning={setIsScanning}
      />
    </div>
  );
}

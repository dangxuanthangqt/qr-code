"use client";

import { useState } from "react";
import QrCodeScanner from "./qr-code-scanner";
import QrCodeButton from "./qr-code-button";

export default function Home() {
  // const [result, setResult] = useState<string | null>(null);

  // const handleScanSuccess = (decodedText: string, decodedResult: any) => {
  //   console.log("Decoded text: ", decodedText);
  //   console.log("Decoded result: ", decodedResult);
  //   setResult(decodedText);
  // };
  // const handleScanError = (errorMessage: string) => {
  //   console.error("Scan error: ", errorMessage);
  // };

  // return (
  //   <div>
  //     {result && (
  //       <div>
  //         <p>{result}</p>
  //       </div>
  //     )}
  //     <QrCodeScanner
  //       onScanSuccess={handleScanSuccess}
  //       onScanError={handleScanError}
  //     />
  //   </div>
  // );
  return <QrCodeButton></QrCodeButton>;
}

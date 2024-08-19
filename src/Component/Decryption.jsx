import { Box, Button, TextField, Typography } from "@mui/material";
import CryptoJS from "crypto-js";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import React, { useState } from "react";
import FileDropZone from "./FileDropZone";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const Decryption = () => {
  const [cipherText, setCipherText] = useState("");
  const [decryptedText, setDecryptedText] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [fileName, setFileName] = useState("");
  const [keyFileName, setKeyFileName] = useState("");

  const handleDecrypt = () => {
    if (fileName.split(".")[fileName.length - 1] === ".txt") {
      handleTextDecrypt();
    } else {
      handlePDFDecrypt();
    }
  };

  const onFileSelected = (file) => {
    if (file.name.endsWith(".pdf")) {
      handlePdfFile(file);
    } else if (file.name.endsWith(".txt")) {
      handleTxtFile(file);
    }
  };

  const onKeyFileSelected = async (file) => {
    const fileContent = await file.text();
    setSecretKey(fileContent);
  };

  const handleTxtFile = async (file) => {
    const fileContent = await file.text();
    setCipherText(fileContent);
  };

  const handleTextDecrypt = () => {
    const decrypted = CryptoJS.Rabbit.decrypt(cipherText, secretKey).toString(
      CryptoJS.enc.Utf8
    );
    setDecryptedText(decrypted);

    const textBlob = new Blob([decrypted], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(textBlob, `${fileName.split("-")[0]}-text-decrypted.txt`);
  };

  const handlePdfFile = async (file) => {
    const typedArray = new Uint8Array(await file.arrayBuffer());
    const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
    const textContent = await extractTextFromPDF(pdf);
    setCipherText(textContent);
  };

  const handlePDFDecrypt = () => {
    const decrypted = CryptoJS.Rabbit.decrypt(cipherText, secretKey).toString(
      CryptoJS.enc.Utf8
    );
    setDecryptedText(decrypted);

    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(decrypted, 10, 10);

    // Save the PDF as a Blob
    const pdfBlob = doc.output("blob");
    saveAs(pdfBlob, `${fileName.split(".")[0]}-text-decrypted.pdf`);

    // Save the secret key as a .txt file
    const keyBlob = new Blob([secretKey], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(keyBlob, `${fileName.split(".")[0]}-key.txt`);
  };

  const extractTextFromPDF = async (pdf) => {
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      text += pageText + "\n";
    }
    return text;
  };

  return (
    <Box
      sx={{
        width: { sm: "80%", md: "40%" },
        display: "flex",
        flexDirection: "column",
        mx: "auto",
      }}
    >
      <Typography
        variant="h3"
        sx={{ textAlign: "center", mb: 2, color: "#1C3861" }}
      >
        Decryption
      </Typography>
      <Box sx={{ display: "flex", mb: 1 }}>
        <FileDropZone
          onFileSelected={onFileSelected}
          fileName={fileName}
          setFileName={setFileName}
          label="Drag or drop your encryped text file"
        />
      </Box>
      <Box sx={{ display: "flex", mb: 2 }}>
        <FileDropZone
          onFileSelected={onKeyFileSelected}
          fileName={keyFileName}
          setFileName={setKeyFileName}
          label="Drag or drop your key file"
        />
      </Box>
      <Box sx={{ display: "flex", mb: 2 }}>
        <TextField label="Plain Text" value={decryptedText} fullWidth />
      </Box>
      <Button
        variant="outlined"
        onClick={handleDecrypt}
        disabled={!cipherText || !secretKey}
      >
        Decrypt
      </Button>
    </Box>
  );
};

export default Decryption;

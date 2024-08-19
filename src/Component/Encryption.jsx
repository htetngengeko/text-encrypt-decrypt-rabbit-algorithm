import { AutoFixHigh } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import CryptoJS from "crypto-js";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import Randomstring from "randomstring";
import React, { useState } from "react";
import FileDropZone from "./FileDropZone";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const Encryption = () => {
  const [plainText, setPlainText] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [cipherText, setCipherText] = useState("");
  const [cipherPDF, setCipherPDF] = useState("");
  const [fileName, setFileName] = useState("");

  const handleEncrypt = () => {
    if (fileName.split(".")[fileName.length - 1] === ".txt") {
      handleTextEncrypt();
    } else {
      handlePDFEncrypt();
    }
  };

  const onFileSelected = (file) => {
    if (file.name.endsWith(".pdf")) {
      handlePdfFile(file);
    } else if (file.name.endsWith(".txt")) {
      handleTxtFile(file);
    }
  };

  const handleTxtFile = async (file) => {
    const fileContent = await file.text();
    setPlainText(fileContent);
  };

  const handleTextEncrypt = () => {
    const encrypted = CryptoJS.Rabbit.encrypt(plainText, secretKey).toString();
    setCipherText(encrypted);
    const textBlob = new Blob([encrypted], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(textBlob, `${fileName.split(".")[0]}-text-encrypted.txt`);

    const keyBlob = new Blob([secretKey], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(keyBlob, `${fileName.split(".")[0]}-key.txt`);
  };

  const handlePdfFile = async (file) => {
    const typedArray = new Uint8Array(await file.arrayBuffer());
    const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
    const textContent = await extractTextFromPDF(pdf);
    setPlainText(textContent);
  };

  const handlePDFEncrypt = () => {
    const encrypted = CryptoJS.Rabbit.encrypt(plainText, secretKey).toString();
    setCipherPDF(encrypted);

    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(encrypted, 10, 10);

    // Save the PDF as a Blob
    const pdfBlob = doc.output("blob");
    saveAs(pdfBlob, `${fileName.split(".")[0]}-text-encrypted.pdf`);

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
        Encryption
      </Typography>
      <Box sx={{ display: "flex", mb: 2 }}>
        <FileDropZone
          onFileSelected={onFileSelected}
          fileName={fileName}
          setFileName={setFileName}
          label="Drag or Drop your file"
        />
      </Box>
      <Box sx={{ display: "flex", mb: 2 }}>
        <TextField
          label="Secret Key"
          value={secretKey}
          fullWidth
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  sx={{ mr: 1 }}
                  onClick={() => {
                    setSecretKey(Randomstring.generate(16));
                  }}
                >
                  <AutoFixHigh />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ display: "flex", mb: 2 }}>
        <TextField label="Original Text" value={plainText} fullWidth />
      </Box>

      <Box sx={{ display: "flex", mb: 2 }}>
        <TextField label="Cipher Text" value={cipherText} fullWidth />
      </Box>
      <Button
        variant="outlined"
        onClick={handleEncrypt}
        disabled={!plainText || !secretKey}
      >
        Encrypt
      </Button>
    </Box>
  );
};

export default Encryption;

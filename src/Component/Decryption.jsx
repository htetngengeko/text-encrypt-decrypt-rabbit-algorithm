import { Box, Button, TextField, Typography } from "@mui/material";
import CryptoJS from "crypto-js";
import { saveAs } from "file-saver";
import React, { useState } from "react";
import FileDropZone from "./FileDropZone";

const Decryption = () => {
  const [cipherText, setCipherText] = useState("");
  const [decryptedText, setDecryptedText] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [textFileName, setTextFileName] = useState("");
  const [keyFileName, setKeyFileName] = useState("");

  const handleDecrypt = () => {
    const decrypted = CryptoJS.Rabbit.decrypt(cipherText, secretKey).toString(
      CryptoJS.enc.Utf8
    );
    setDecryptedText(decrypted);
    const textBlob = new Blob([decrypted], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(textBlob, `${textFileName.split("-")[0]}-text-decrypted.txt`);
  };

  const onTextFileSelected = async (file) => {
    const fileContent = await file.text();
    setCipherText(fileContent);
  };

  const onKeyFileSelected = async (file) => {
    const fileContent = await file.text();
    setSecretKey(fileContent);
  };

  // const decryptText = () => {
  //   const decrypted = CryptoJS.Rabbit.decrypt(ciphertext, key);
  //   setDecryptedText(decrypted.toString(CryptoJS.enc.Utf8));
  // };
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
          onFileSelected={onTextFileSelected}
          fileName={textFileName}
          setFileName={setTextFileName}
          label="Drag or drop your encryped text file"
        />
      </Box>
      <Box sx={{ display: "flex", mb: 2 }}>
        <FileDropZone
          onFileSelected={onKeyFileSelected}
          fileName={keyFileName}
          setFileName={setKeyFileName}
          label="Drag or drop your encryped key file"
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

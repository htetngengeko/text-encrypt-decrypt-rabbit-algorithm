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
import Randomstring from "randomstring";
import React, { useState } from "react";
import FileDropZone from "./FileDropZone";

const Encryption = () => {
  const [plainText, setPlainText] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [cipherText, setCipherText] = useState("");
  const [fileName, setFileName] = useState("");

  const handleEncrypt = () => {
    const encrypted = CryptoJS.Rabbit.encrypt(plainText, secretKey).toString();
    setCipherText(encrypted);
    const textBlob = new Blob([encrypted], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(textBlob, `${fileName.split(".")[0]}-text-encrypted.txt`);

    const keyBlob = new Blob([secretKey], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(keyBlob, `${fileName.split(".")[0]}-key-encrypted.txt`);
  };

  const onFileSelected = async (file) => {
    const fileContent = await file.text();
    setPlainText(fileContent);
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

      {/* IV */}
      {/* <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <TextField
            disabled={mode === "ECB" ? true : false}
            label="Initialization Vector (Optional)"
            value={initializationVector}
            fullWidth
            sx={{ mr: 1 }}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    disabled={mode === "ECB" ? true : false}
                    sx={{ mr: 1 }}
                    onClick={() =>
                      setInitializationVector(randomBytes(8).toString("hex"))
                    }
                  >
                    <AutoFixHighIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <ToggleButtonGroup
            color="primary"
            value={mode}
            exclusive
            onChange={(evt, value) => {
              if (value !== null) {
                setInitializationVector("");
                setMode(value);
              }
            }}
          >
            <ToggleButton value="ECB">ECB</ToggleButton>
            <ToggleButton value="CBC">CBC</ToggleButton>
          </ToggleButtonGroup>
        </Box> */}
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

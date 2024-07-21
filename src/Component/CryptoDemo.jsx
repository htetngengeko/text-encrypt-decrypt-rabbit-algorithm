import { BottomNavigation, Box, Button } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
// import { randomBytes } from "crypto";
import React, { useState } from "react";
import Decryption from "./Decryption";
import Encryption from "./Encryption";

const CryptoDemo = () => {
  const [encryptPage, setEncryptPage] = useState(true);

  return (
    <Box
      sx={{
        bgcolor: "#EBECF1",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ mb: 5 }}>
        <AppBar
          position="sticky"
          sx={{
            bgcolor: "#1C3861",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#E7E8EF",
            p: 3,
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              width: "100%",
            }}
          >
            <img
              src="file-security_6772375.png"
              alt=""
              style={{ width: 50, height: 50 }}
            />
            <Typography sx={{ fontSize: { xs: 20, md: 24, lg: 38 } }}>
              Text Encryption & Decryption Using Rabbit Algorithm
            </Typography>
            <Box>
              <Button color="inherit" onClick={(e) => setEncryptPage(true)}>
                Encrypt
              </Button>
              <Button color="inherit" onClick={(e) => setEncryptPage(false)}>
                Decrypt
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      {encryptPage ? <Encryption /> : <Decryption />}
      <BottomNavigation
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          bgcolor: "inherit",
          color: "#1C3861",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Typography>
          Designed and coded by{" "}
          <a
            href="https://github.com/htetngengeko"
            style={{
              color: "#206A5D",
              backgroundColor: "transparent",
              textDecoration: "none",
            }}
          >
            {" "}
            Htet Nge Nge Ko{" "}
          </a>{" "}
          (VIIT-6) for Bachelor of Engineering mini-thesis.
        </Typography>
        <Typography>Academic Year : 2023-2024</Typography>
      </BottomNavigation>
    </Box>
  );
};

export default CryptoDemo;

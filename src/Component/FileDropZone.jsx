import { Box, Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";

const FileDropZone = ({ onFileSelected, fileName, setFileName, label }) => {
  const onDrop = (acceptedFiles) => {
    setFileName(acceptedFiles[0].name);
    onFileSelected(acceptedFiles[0]);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "txt/plain": [".txt"] },
    onDrop,
  });
  return (
    <Box
      {...getRootProps()}
      sx={{
        width: "100%",
        mt: 2,
        border: "1px dotted #1C3861",
        borderRadius: 2,
        p: 1,
        textAlign: "center",
        cursor: "pointer",
      }}
    >
      <input {...getInputProps()} />
      <Typography>
        {fileName ? fileName : isDragActive ? " Drag here" : label}
      </Typography>
    </Box>
  );
};

export default FileDropZone;

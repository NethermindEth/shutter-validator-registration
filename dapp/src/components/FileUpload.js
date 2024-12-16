import React, { useState } from "react";

function FileUpload({ onFileUpload }) {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => onFileUpload(e.target.result);
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <input type="file" accept=".json" onChange={handleFileChange} />
      {fileName && <p>Uploaded file: {fileName}</p>}
    </div>
  );
}

export default FileUpload;

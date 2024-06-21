const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

// Set up storage destination and file naming
const storage = multer.memoryStorage();

// Initialize upload middleware with storage configuration
const upload = multer({ storage: storage });

const app = express();
const port = 3001; // Choose an appropriate port

app.use(cors()); // Enable CORS
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.post("/write-data-entry-monolith", (req, res) => {
  const { content } = req.body;

  const filePath = path.join(
    __dirname,
    "src/data-entry-monolith/DataEntryMonolith.tsx"
  );

  fs.writeFile(filePath, content, "utf8", (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error writing file", error: err });
    }
    res.status(200).json({ message: "File written successfully" });
  });
});

app.post("/upload-pdf", upload.single("pdf"), (req, res) => {
  const file = req.file;
  const filename = req.body.filename;

  if (!file) {
    return res.status(400).send("No file uploaded.");
  }

  if (!filename) {
    return res.status(400).send("No filename provided.");
  }

  // Sanitize the filename to prevent directory traversal attacks
  const sanitizedFilename = path.basename(filename);

  // Save the file to the desired location
  const filePath = path.join(
    __dirname,
    "src/data-entry-monolith/pdf",
    sanitizedFilename
  );
  fs.writeFile(filePath, file.buffer, (err) => {
    if (err) {
      return res.status(500).send("Failed to save file.");
    }
    res.send("File uploaded and saved successfully.");
  });
});

// Ensure the uploads directory exists
if (!fs.existsSync(path.join(__dirname, "src/data-entry-monolith/pdf"))) {
  fs.mkdirSync(path.join(__dirname, "src/data-entry-monolith/pdf"));
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

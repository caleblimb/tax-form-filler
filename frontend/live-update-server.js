const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { createCanvas } = require("canvas");
const Jimp = require("jimp");
// const sharp = require("sharp");

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
      console.error("Error writing file:", err);
      return res
        .status(500)
        .json({ message: "Error writing file", error: err });
    }
    console.log("File written successfully");
    res.status(200).json({ message: "File written successfully" });
  });
});

app.post("/upload-pdf", upload.single("pdf"), (req, res) => {
  const file = req.file;
  const filename = req.body.filename;

  if (!file) {
    console.error("No file uploaded.");
    return res.status(400).send("No file uploaded.");
  }

  if (!filename) {
    console.error("No filename provided.");
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
  pdfToPng(file, filePath + ".png");
  fs.writeFile(filePath, file.buffer, (err) => {
    if (err) {
      console.error("Failed to save file.");
      return res.status(500).send("Failed to save file.");
    }
    console.log("File uploaded and saved successfully.");
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

async function pdfToPng(file, outputFilePath) {
  try {
    // Read the file buffer
    const fileBuffer = file.buffer;
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    // Load the PDF document
    const pdfDoc = await pdfjs.getDocument({ data: new Uint8Array(fileBuffer) })
      .promise;

    // Get the first page
    const page = await pdfDoc.getPage(1);

    // Create a canvas to render the page
    const viewport = page.getViewport({ scale: 1 });
    const canvas = createCanvas(viewport.width, viewport.height);
    const context = canvas.getContext("2d");

    // Render the page into the canvas context
    await page.render({ canvasContext: context, viewport }).promise;

    // Create a thumbnail using sharp
    const buffer = canvas.toBuffer("image/png");

    const image = await Jimp.read(buffer);
    image
      .resize(200, Jimp.AUTO) // Adjust the width to create a smaller thumbnail
      .write(outputFilePath);
    console.log("Successfully saved PDF thumbnail.");
  } catch (err) {
    console.error("Error saving PDF thumbnail:", err);
  }
}

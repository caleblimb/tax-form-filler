import { getDocument, PDFDocumentProxy, PDFPageProxy, PageViewport } from "pdfjs-dist";
/* global document */
/* global console */

export const convertToBase64 = async (pdfFile: File, pageNumber: number): Promise<string | null> => {
  try {
    // Convert File to ArrayBuffer
    const arrayBuffer: ArrayBuffer = await readFileAsync(pdfFile);

    // Load PDF from ArrayBuffer
    const pdf: PDFDocumentProxy = await getDocument({ data: arrayBuffer }).promise;

    const page: PDFPageProxy = await pdf.getPage(pageNumber);
    const viewport: PageViewport = page.getViewport({ scale: 1 });

    // Render PDF page to a canvas
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;

    // Convert canvas to base64 PNG
    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error("Error converting PDF to base64 PNG:", error);
    return null;
  }
};

// Function to read file as ArrayBuffer
const readFileAsync = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file as ArrayBuffer"));
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

import axios from "axios";

export const exportToFrontend = async (content: string) => {
  try {
    const response = await axios.post("http://localhost:3001/write-data-entry-monolith", { content });
    console.log(response.data.message);
  } catch (error) {
    console.error("Error editing file:", error);
  }
};

export const uploadPdf = async (pdf: File) => {
  try {
    const formData = new FormData();
    formData.append("pdf", pdf);
    formData.append("filename", pdf.name);

    fetch("http://localhost:3001/upload-pdf", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        alert(data);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("File upload failed.");
      });
  } catch (error) {
    console.error("uploadPdf:", error);
  }
};

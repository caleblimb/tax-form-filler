/* global console */
/* global document */
import React from "react";
import FileSvg from "../svg/File.svg";
import "./FileLoader.scss";

interface FileLoaderProps {
  contentTypes: string[];
  label: string;
  onLoadFile: (file: File) => void;
}

function FileLoader({ contentTypes, label, onLoadFile }: FileLoaderProps) {
  const processFile = (file: File) => {
    if (contentTypes.indexOf(file.type) > -1) {
      onLoadFile(file);
    } else {
      console.error("File type is unsupported!");
    }
  };

  const selectFile = async (): Promise<File> => {
    return new Promise((resolve) => {
      let input = document.createElement("input");
      input.type = "file";
      input.multiple = false;
      input.accept = contentTypes.join(",");

      input.onchange = () => {
        let files = Array.from(input.files!);
        resolve(files[0]);
      };

      input.click();
    });
  };

  const onDrop = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      [...(ev.dataTransfer.items as unknown as Array<any>)].forEach((item) => {
        if (item.kind === "file") {
          const file: File | null = item.getAsFile();
          if (file !== null) {
            processFile(file);
          }
        }
      });
    } else {
      // Use DataTransfer interface to access the file(s)
      [...(ev.dataTransfer.files as unknown as Array<any>)].forEach((file) => {
        processFile(file);
      });
    }
  };

  const onClick = async () => {
    const file = await selectFile();
    processFile(file);
  };

  return (
    <div className="file-loader">
      <div
        onDrop={(ev) => onDrop(ev)}
        onDragOver={(ev) => ev.preventDefault()}
        onClick={() => onClick()}
        className="drop-zone"
      >
        <FileSvg />
        <p>{label}</p>
      </div>
    </div>
  );
}

export default FileLoader;

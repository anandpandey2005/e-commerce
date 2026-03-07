import React, { useRef, useState } from "react";

const matchesAccept = (file, accept) => {
  if (!accept) {
    return true;
  }

  const rules = accept
    .split(",")
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean);

  if (!rules.length) {
    return true;
  }

  const fileType = String(file?.type || "").toLowerCase();
  const fileName = String(file?.name || "").toLowerCase();

  return rules.some((rule) => {
    if (rule.endsWith("/*")) {
      const prefix = rule.replace("/*", "/");
      return fileType.startsWith(prefix);
    }

    if (rule.startsWith(".")) {
      return fileName.endsWith(rule);
    }

    return fileType === rule;
  });
};

export default function FileDropInput({
  id,
  label,
  accept,
  file,
  existingUrl,
  helperText,
  onFileSelect,
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleFile = (nextFile) => {
    if (!nextFile) {
      onFileSelect(null);
      setLocalError("");
      return;
    }

    if (!matchesAccept(nextFile, accept)) {
      setLocalError("Selected file type is not allowed.");
      return;
    }

    setLocalError("");
    onFileSelect(nextFile);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0] || null)}
      />
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          handleFile(event.dataTransfer.files?.[0] || null);
        }}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-4 text-sm transition-colors ${
          isDragging
            ? "border-yellow-500 bg-yellow-50 text-yellow-800"
            : "border-gray-300 bg-gray-50 text-gray-700 hover:border-yellow-500"
        }`}
      >
        {file ? (
          <p className="font-medium">{file.name}</p>
        ) : (
          <p>Drag and drop file here, or click to choose</p>
        )}
        {helperText ? <p className="mt-1 text-xs text-gray-500">{helperText}</p> : null}
        {!file && existingUrl ? (
          <a
            href={existingUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="mt-2 inline-block text-xs text-blue-600 underline"
          >
            View current file
          </a>
        ) : null}
      </div>
      {file ? (
        <button
          type="button"
          onClick={() => handleFile(null)}
          className="w-fit rounded-md border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:bg-gray-100"
        >
          Remove file
        </button>
      ) : null}
      {localError ? <p className="text-xs text-red-600">{localError}</p> : null}
    </div>
  );
}

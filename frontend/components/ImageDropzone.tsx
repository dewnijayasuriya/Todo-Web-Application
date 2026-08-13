"use client";

import { useRef, useState } from "react";
import type { DragEvent } from "react";

type ImageDropzoneProps = {
  id: string;
  previewUrl: string | null;
  onFileSelected: (file: File) => void;
  onRemove: () => void;
  accept?: string;
  disabled?: boolean;
  helperText?: string;
};

// Custom drag-and-drop image upload area: click or drop to select a file,
// with an in-place preview and remove button once one is chosen. Replaces
// the native file input's "Choose File" button + filename display.
export default function ImageDropzone({
  id,
  previewUrl,
  onFileSelected,
  onRemove,
  accept = "image/jpeg,image/jpg,image/png,image/webp",
  disabled,
  helperText = "SVG, PNG, JPG or WEBP",
}: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const openFilePicker = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingOver(false);

    if (disabled) {
      return;
    }

    const file = event.dataTransfer.files?.[0];

    if (file) {
      onFileSelected(file);
    }
  };

  if (previewUrl) {
    return (
      <div className="relative inline-block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl}
          alt="Selected"
          className="h-32 w-32 rounded-xl object-cover ring-1 ring-slate-200"
        />
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          aria-label="Remove image"
          title="Remove image"
          className="absolute -right-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          <svg
            className="h-3.5 w-3.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 6l12 12M18 6L6 18"
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={openFilePicker}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openFilePicker();
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) {
          setIsDraggingOver(true);
        }
      }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={handleDrop}
      className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition duration-150 ${
        disabled
          ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-60"
          : isDraggingOver
            ? "cursor-pointer border-blue-500 bg-blue-50"
            : "cursor-pointer border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50"
      }`}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-400 ring-1 ring-slate-200">
        <svg
          className="h-5 w-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
            d="M12 16V4m0 0L7 9m5-5 5 5M5 16v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2"
          />
        </svg>
      </span>

      <p className="text-sm text-slate-600">
        <span className="font-semibold text-blue-600 underline">
          Click to upload
        </span>{" "}
        or drag and drop
      </p>

      {helperText ? (
        <p className="text-xs text-slate-400">{helperText}</p>
      ) : null}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            onFileSelected(file);
          }

          // Allow re-selecting the same file after removal.
          event.target.value = "";
        }}
        className="sr-only"
      />
    </div>
  );
}

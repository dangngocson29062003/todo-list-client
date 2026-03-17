"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileText } from "lucide-react";
import Image from "next/image";

export function FileUpload({
  isOthers,
  isAvatar,
  value,
  onChange,
}: {
  isOthers?: boolean;
  isAvatar?: boolean;
  value?: File[];
  onChange?: (files: File[]) => void;
}) {
  const MAX_FILES = isAvatar ? 1 : 10;
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if ((value?.length || 0) + acceptedFiles.length > MAX_FILES) {
        alert(`Chỉ được upload tối đa ${MAX_FILES} file`);
        return;
      }

      const oversized = acceptedFiles.find((file) => file.size > MAX_SIZE);
      if (oversized) {
        alert(`File ${oversized.name} vượt quá 10MB`);
        return;
      }

      //   onChange([...(value || []), ...acceptedFiles]);
    },
    [onChange, value],
  );

  const handleRemove = (index: number) => {
    const newFiles = value?.filter((_, i) => i !== index);
    // onChange(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: isOthers
      ? {
          "image/*": [],
          "application/pdf": [],
        }
      : {
          "image/*": [],
        },
    multiple: true,
    maxFiles: MAX_FILES,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
        isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-8 w-8 text-gray-400" />
      <div className="mt-2 text-sm text-gray-600">
        Drag and drop files here or{" "}
        <span className="font-semibold">browse</span>
      </div>
      {isOthers ? (
        <div className="text-gray-400 text-sm">
          Up to {MAX_FILES} files, max 10MB each (Images or PDF)
        </div>
      ) : (
        <div className="text-gray-400 text-sm">
          Up to {MAX_FILES} images, max 10MB each
        </div>
      )}

      {/* Preview */}
      {value !== undefined && value?.length > 0 && (
        <div className="mt-4 grid grid-cols-4 gap-2">
          {value?.map((file, i) => {
            const isImage = file.type.startsWith("image/");
            const isPDF = file.type === "application/pdf";

            return (
              <div
                key={i}
                className="relative w-full h-24 group border rounded overflow-hidden bg-gray-50 flex items-center justify-center"
              >
                {/* Ảnh */}
                {isImage && (
                  <Image
                    src={URL.createObjectURL(file)}
                    width={200}
                    height={200}
                    alt={file.name}
                    className="object-cover w-full h-full"
                  />
                )}

                {/* PDF */}
                {isPDF && (
                  <div className="flex flex-col items-center justify-center p-2">
                    <FileText
                      className="h-8 w-8 text-[#F79E1B]"
                      strokeWidth={1}
                    />
                    <p className="text-xs mt-1 text-gray-700 truncate w-full px-1 text-center">
                      {file.name}
                    </p>
                  </div>
                )}

                {/* Remove */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(i);
                  }}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

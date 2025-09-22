"use client";

import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { uploadMedia } from "@/lib/actions/upload-media";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader, Upload } from "lucide-react";
import { handleError } from "@/lib/utils";

interface Artifact {
  id?: number;
  file?: File;
  name: string;
  description: string;
  uploaded: boolean;
}

export default function FileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  // handle file upload and embedding generation
  const uploadArtifact = async (artifact: Artifact) => {
    if (!artifact.file) return;
    setIsUploading(true);
    setErrorMessage(null);

    try {
      // upload
      const mediaPath = await uploadMedia(artifact.file);

      if (!mediaPath) {
        throw new Error("Failed to upload file");
      }

      // generate embeddings via api route
      const formData = new FormData();
      formData.append("mediaPath", mediaPath);

      const response = await fetch("/api/generate-embeddings", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error("Failed to generate embeddings");
      }

      toast.success(`Successfully processed ${artifact.name}`);
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(handleError(error));
    } finally {
      setIsUploading(false);
    }
  };

  // set up drag & drop
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    if (rejectedFiles.length > 0) {
      const sizeRejections = rejectedFiles.filter(
        (rejection) => rejection.errors[0]?.code === "file-too-large"
      );

      if (sizeRejections.length > 0) {
        setErrorMessage(
          "File size exceeds 2MB limit."
        );
        return;
      }
    }

    const validFileTypes = [
      "text/plain",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/pdf",
    ];

    const validFiles = acceptedFiles.filter((file) =>
      validFileTypes.includes(file.type)
    );

    if (validFiles.length > 0) {
      // process each valid file
      validFiles.forEach((file) => {
        uploadArtifact({
          file,
          name: file.name,
          description: "",
          uploaded: false,
        });
      });
    } else {
      setErrorMessage(
        "Invalid file type. Only PDF, DOCX, XLSX, and TXT are allowed."
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/pdf": [".pdf"],
    },
    maxSize: 2 * 1024 * 1024,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className="border-2 border-dashed p-8 text-center rounded"
      >
        <input {...getInputProps()} />
        <Upload className="w-full mb-4 h-8 w-8" />
        <p>Drag & Drop files here, or click to select</p>
        <p className="text-muted-foreground text-sm">Max file size: 2MB</p>
      </div>
      {errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}

      {isUploading && (
        <div className="mt-1 flex items-center gap-2 text-muted-foreground">
          <p>Processing files</p>
          <Loader className="h-6 w-6 animate-spin" />
        </div>
      )}
    </div>
  );
}

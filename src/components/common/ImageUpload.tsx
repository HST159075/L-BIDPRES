"use client";

import { useState, useCallback } from "react";
import { Upload, X, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
} from "@/config/constants";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  accept?: "image" | "video";
  className?: string;
  disabled?: boolean;
  label?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  accept = "image",
  className,
  disabled,
  label,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setError("");

      const maxSize = accept === "image" ? 5 * 1024 * 1024 : 50 * 1024 * 1024;
      if (file.size > maxSize) {
        setError(`Max size: ${accept === "image" ? "5MB" : "50MB"}`);
        setIsUploading(false);
        return;
      }

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        formData.append("cloud_name", CLOUDINARY_CLOUD_NAME);
       

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${accept}/upload`,
          { method: "POST", body: formData },
        );
        const data = await res.json();
        if (data.secure_url) {
          onChange(data.secure_url);
        } else {
          setError("Upload failed. Please try again.");
        }
      } catch {
        setError("Upload failed. Check your connection.");
      } finally {
        setIsUploading(false);
      }
    },
    [accept, onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) upload(file);
    },
    [upload],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
  };

  if (value) {
    return (
      <div
        className={cn(
          "relative rounded-xl overflow-hidden bg-muted",
          className,
        )}
      >
        {accept === "image" ? (
          <img
            src={value}
            alt="Uploaded"
            className="w-full h-full object-cover"
          />
        ) : (
          <video src={value} className="w-full h-full object-cover" controls />
        )}
        {!disabled && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <p className="text-sm font-medium">{label}</p>}
      <label
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={cn(
          "flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors",
          disabled || isUploading
            ? "opacity-50 cursor-not-allowed border-border"
            : "border-border hover:border-bid-500 hover:bg-bid-500/5",
        )}
      >
        {isUploading ? (
          <Loader className="w-6 h-6 text-bid-500 animate-spin" />
        ) : (
          <Upload className="w-6 h-6 text-muted-foreground" />
        )}
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            {isUploading ? "Uploading..." : "Click or drag to upload"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {accept === "image"
              ? "PNG, JPG, WEBP — Max 5MB"
              : "MP4, MOV — Max 50MB"}
          </p>
        </div>
        <input
          type="file"
          accept={accept === "image" ? "image/*" : "video/*"}
          disabled={disabled || isUploading}
          onChange={handleChange}
          className="sr-only"
        />
      </label>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// Multi-image upload
interface MultiImageUploadProps {
  values: string[];
  onChange: (urls: string[]) => void;
  max?: number;
  className?: string;
}

export function MultiImageUpload({
  values,
  onChange,
  max = 10,
  className,
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const uploadOne = async (file: File): Promise<string | null> => {
    if (file.size > 5 * 1024 * 1024) return null;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData },
    );
    const data = await res.json();
    return data.secure_url || null;
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(
      0,
      max - values.length,
    );
    if (!files.length) return;
    setIsUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadOne));
      onChange([...values, ...(urls.filter(Boolean) as string[])]);
    } finally {
      setIsUploading(false);
    }
  };

  const remove = (idx: number) => onChange(values.filter((_, i) => i !== idx));

  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
        {values.map((url, i) => (
          <div
            key={i}
            className="relative aspect-square rounded-xl overflow-hidden bg-muted group"
          >
            <img
              src={url}
              alt={`Photo ${i + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        ))}
        {values.length < max && (
          <label className="aspect-square border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-bid-500 hover:bg-bid-500/5 transition-colors">
            {isUploading ? (
              <Loader className="w-5 h-5 text-bid-500 animate-spin" />
            ) : (
              <>
                <Upload className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground mt-1">Add</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={isUploading}
              onChange={handleChange}
              className="sr-only"
            />
          </label>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {values.length}/{max} photos (min 2 required)
      </p>
    </div>
  );
}

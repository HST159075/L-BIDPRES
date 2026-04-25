import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
} from "@/config/constants";

type UploadType = "image" | "video" | "raw";

interface UploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  duration?: number;
}

export const uploadService = {
  upload: async (
    file: File,
    type: UploadType = "image",
  ): Promise<UploadResult> => {
    const maxSize = type === "image" ? 5 : 50; // MB
    if (file.size > maxSize * 1024 * 1024) {
      throw new Error(`File too large. Max size is ${maxSize}MB.`);
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("cloud_name", CLOUDINARY_CLOUD_NAME);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${type}/upload`,
      { method: "POST", body: formData },
    );

    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      duration: data.duration,
    };
  },

  uploadMultiple: async (
    files: File[],
    type: UploadType = "image",
  ): Promise<UploadResult[]> => {
    return Promise.all(files.map((f) => uploadService.upload(f, type)));
  },
};

export interface CloudinaryUploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

export async function uploadToCloudinary(
  file: File,
  fileName?: string,
): Promise<CloudinaryUploadResult> {
  try {
    console.log("1. uploadToCloudinary START");
    console.log("2. File:", file.name, file.size);
    console.log("3. FileName:", fileName);

    const cloudName =
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    const uploadPreset =
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    console.log("4. Cloud name:", cloudName);
    console.log("5. Upload preset:", uploadPreset);

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary configuration is missing");
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "vysh_products");

    if (fileName) {
      const sanitizedPublicId = fileName.replace(/\.[^/.]+$/, "");

      formData.append("public_id", sanitizedPublicId);
    }

    console.log("6. Sending request to Cloudinary...");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    console.log("7. Cloudinary response received");
    console.log("Status:", response.status);

    const data = await response.json();

    console.log("8. Cloudinary response:", data);

    if (!response.ok) {
      throw new Error(
        data?.error?.message || "Cloudinary upload failed"
      );
    }

    console.log("9. Upload successful");

    return {
      success: true,
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error: any) {
    console.error("10. Cloudinary upload ERROR:", error);

    return {
      success: false,
      error: error.message || "Upload failed",
    };
  }
}
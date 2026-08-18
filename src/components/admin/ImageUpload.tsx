"use client";

import React, { useState, useRef, useEffect } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { compressImageToWebP } from "@/lib/image-compressor";

interface CloudinaryUploadProps {
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
  imageUrl?: string;
  imagePublicId?: string;
}

export function CloudinaryUpload({
  onImageSelect,
  onImageRemove,
  imageUrl = "",
}: CloudinaryUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(imageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentUrl(imageUrl || "")
  }, [imageUrl])

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Original file validation
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    // Original file max size
    if (file.size > 10 * 1024 * 1024) {
      toast.error(
        "File is too large. Maximum size is 10MB."
      );
      return;
    }

    setIsProcessing(true);

    try {
      toast.loading(
        "Optimizing image...",
        { id: "image-upload" }
      );

      // Convert to WebP + compress
      const compressedFile =
        await compressImageToWebP(
          file,
        );

      const previewUrl = URL.createObjectURL(compressedFile);

      if(currentUrl?.startsWith("blob:")){
        URL.revokeObjectURL(currentUrl);
      }

      setCurrentUrl(previewUrl);
      
      onImageSelect(compressedFile);

      toast.success("Image is ready to upload", {
        id: "image-upload",
      })

    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to process image.",
        {
          id: "image-upload",
        }
      );
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if(currentUrl?.startsWith("blob:")){
      URL.revokeObjectURL(currentUrl);
    }
    setCurrentUrl("");
    onImageRemove();
    toast.success("Image removed.");
  };

  const triggerFileInput = () => {
    if (!isProcessing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      {currentUrl ? (
        <div className="relative aspect-square rounded-2xl overflow-hidden border border-[#E8D8D3] bg-[#FFF9F8] group max-w-[240px] mx-auto shadow-sm">
          <img
            src={currentUrl}
            alt="Uploaded Product"
            className="w-full h-full object-cover"
          />
          {isProcessing ? (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            </div>
          ) : (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          onClick={triggerFileInput}
          className="border-2 border-dashed border-[#E8D8D3] bg-[#FFF9F8] hover:bg-[#FFF5F3] rounded-2xl p-6 text-center space-y-3 hover:border-[#D4AF37] transition-all cursor-pointer flex flex-col items-center justify-center min-h-[200px]"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-8 h-8 text-[#5C061D] animate-spin" />
              <p className="text-xs font-semibold text-[#1D1D1D]">Optimizing image...</p>
            </>
          ) : (
            <>
              <UploadCloud className="w-8 h-8 text-[#5C061D]" />
              <p className="text-xs font-semibold text-[#1D1D1D]">
                Drag & drop image here or{" "}
                <span className="text-[#5C061D] font-bold underline">click to browse</span>
              </p>
              <p className="text-[10px] text-[#888888]">PNG, JPG, WEBP up to 10MB</p>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            disabled={isProcessing}
          />
        </div>
      )}
    </div>
  );
}

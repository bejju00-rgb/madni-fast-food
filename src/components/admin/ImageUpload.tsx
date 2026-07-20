"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Link as LinkIcon } from "lucide-react";
import toast from "react-hot-toast";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder = "madni-fast-food",
  label = "Image",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      onChange(data.url);
      toast.success("Image uploaded!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;
    onChange(urlInput.trim());
    setUrlInput("");
    setShowUrlInput(false);
    toast.success("Image URL set");
  };

  return (
    <div>
      <label className="text-sm text-white/60 mb-2 block">{label}</label>

      {value ? (
        <div className="relative w-full h-40 rounded-xl overflow-hidden border border-white/10 mb-3">
          <Image src={value} alt="Preview" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1.5 bg-dark/80 rounded-full hover:bg-red-500/80 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          className="w-full h-40 rounded-xl border-2 border-dashed border-white/20 flex flex-col
                     items-center justify-center gap-2 cursor-pointer hover:border-orange/50
                     hover:bg-white/5 transition-all mb-3"
        >
          {uploading ? (
            <Loader2 size={24} className="text-orange animate-spin" />
          ) : (
            <>
              <Upload size={24} className="text-white/40" />
              <span className="text-white/40 text-sm">Click to upload image</span>
              <span className="text-white/20 text-xs">PNG, JPG, WEBP — max 5MB</span>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-sm hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <Upload size={14} />
          {value ? "Change Image" : "Upload Image"}
        </button>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-sm hover:bg-white/10 transition-colors"
        >
          <LinkIcon size={14} />
          Paste URL
        </button>
      </div>

      {showUrlInput && (
        <div className="flex gap-2 mt-3">
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-orange/50"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="px-4 py-2 bg-orange rounded-xl text-sm font-semibold"
          >
            Set
          </button>
        </div>
      )}
    </div>
  );
}

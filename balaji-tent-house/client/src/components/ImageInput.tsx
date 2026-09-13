import { useRef, useState, ChangeEvent } from "react";
import { Upload, Link2, Loader2, ImageIcon, X } from "lucide-react";
import { uploadApi } from "../api/client";

interface ImageInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  /** "circle" | "square" | "rectangle" — affects only the preview shape */
  previewShape?: "circle" | "square" | "rectangle";
  helperText?: string;
}

const shapeClass = (shape: ImageInputProps["previewShape"]) => {
  if (shape === "circle") return "rounded-full aspect-square object-cover";
  if (shape === "rectangle") return "rounded-lg aspect-video object-cover";
  return "rounded-lg aspect-square object-cover";
};

const ImageInput = ({
  label,
  value,
  onChange,
  previewShape = "square",
  helperText,
}: ImageInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showUrlField, setShowUrlField] = useState(false);

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const { data } = await uploadApi.uploadImage(file);
      onChange(data.url);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Upload failed. Try a smaller image.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-charcoal mb-1.5">{label}</label>

      <div className="flex items-start gap-4">
        <div className="shrink-0 h-20 w-20 rounded-lg border border-charcoal/15 bg-charcoal/5 overflow-hidden flex items-center justify-center relative">
          {value ? (
            <>
              <img src={value} alt={label} className={`h-full w-full ${shapeClass(previewShape)}`} />
              <button
                type="button"
                onClick={() => onChange("")}
                className="absolute top-0.5 right-0.5 h-5 w-5 rounded-full bg-charcoal/70 text-white flex items-center justify-center"
                aria-label="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
            </>
          ) : (
            <ImageIcon className="h-6 w-6 text-charcoal/30" />
          )}
        </div>

        <div className="flex-1 space-y-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-lg border border-charcoal/15 bg-white px-3.5 py-2 text-sm font-medium hover:border-maroon transition-colors disabled:opacity-60"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? "Uploading..." : "Choose photo from device"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/gif"
            className="hidden"
            onChange={handleFileSelect}
          />

          <button
            type="button"
            onClick={() => setShowUrlField((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-charcoal/60 hover:text-maroon"
          >
            <Link2 className="h-3 w-3" />
            {showUrlField ? "Hide link field" : "Or paste an image link instead"}
          </button>

          {showUrlField && (
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-sm focus:border-maroon outline-none"
            />
          )}

          {error && <p className="text-xs text-red-600">{error}</p>}
          {helperText && !error && <p className="text-xs text-charcoal/50">{helperText}</p>}
        </div>
      </div>
    </div>
  );
};

export default ImageInput;

import { useState, useRef } from "react";

export function UploadZone({
  onFiles,
  accept = "image/*",
  multiple = false,
  disabled = false,
  children,
  className = "",
}: {
  onFiles: (files: FileList) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl transition-colors cursor-pointer select-none ${
        dragging ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/40 hover:bg-secondary/50"
      } ${disabled ? "opacity-50 pointer-events-none" : ""} ${className}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.files.length > 0) onFiles(e.dataTransfer.files);
      }}
    >
      {children}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onFiles(e.target.files);
            e.target.value = "";
          }
        }}
      />
    </div>
  );
}

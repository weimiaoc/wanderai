"use client";

import { useState } from "react";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  fallbackText?: string;
  loading?: "lazy" | "eager";
}

export default function SafeImage({
  src,
  alt,
  className = "",
  fallbackSrc,
  fallbackText,
  loading = "lazy",
}: SafeImageProps) {
  const [error, setError] = useState(false);

  if (error && fallbackSrc) {
    return (
      <img
        src={fallbackSrc}
        alt={alt}
        className={className}
        loading={loading}
      />
    );
  }

  if (error) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{
          background: "linear-gradient(135deg, #4F8EF722, #7ED6C222)",
        }}
      >
        {fallbackText && (
          <span className="text-4xl font-bold text-[#4F8EF7]/30">
            {fallbackText}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => setError(true)}
    />
  );
}

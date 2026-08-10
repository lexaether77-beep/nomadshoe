"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function ZoomableImage({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Zoom in: ${alt}`}
        className={`block w-full cursor-zoom-in ${className ?? ""}`}
      >
        <Image src={src} alt={alt} width={width} height={height} className="w-full h-auto" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-foreground/90 p-4"
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="h-auto max-h-full w-auto max-w-full rounded-lg object-contain"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-surface font-technical text-xl text-foreground ring-1 ring-line"
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
}

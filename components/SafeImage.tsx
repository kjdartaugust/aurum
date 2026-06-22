"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

const FALLBACK = "/placeholder-gold.svg";

/**
 * next/image wrapper that swaps to a local on-brand placeholder if the remote
 * source fails to load (e.g. an expired Unsplash id), so the UI never shows a
 * broken-image icon in production.
 */
export default function SafeImage({ src, alt, ...rest }: ImageProps) {
  const [current, setCurrent] = useState(src);
  // SVGs (our product art + the fallback) are served as-is; the Next image
  // optimizer rejects SVG by default.
  const isSvg =
    typeof current === "string" && current.toLowerCase().endsWith(".svg");
  const isFallback = current === FALLBACK;

  return (
    <Image
      // Lighter default compression for heavy gold photos; non-priority images
      // lazy-load automatically via next/image.
      quality={70}
      {...rest}
      src={current}
      alt={alt}
      // SVG sources skip the Next optimizer (which rejects SVG by default).
      unoptimized={isSvg || isFallback || rest.unoptimized}
      onError={() => setCurrent(FALLBACK)}
    />
  );
}

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
  const isFallback = current === FALLBACK;

  return (
    <Image
      // Lighter default compression for heavy gold photos; non-priority images
      // lazy-load automatically via next/image.
      quality={70}
      {...rest}
      src={current}
      alt={alt}
      // The placeholder is a local SVG; skip optimization for it.
      unoptimized={isFallback || rest.unoptimized}
      onError={() => setCurrent(FALLBACK)}
    />
  );
}

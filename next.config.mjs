/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Serve modern, smaller formats; Next negotiates per-browser.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;

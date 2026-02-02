/** @type {import('next').NextConfig} */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:4000";

const nextConfig = {
  allowedDevOrigins: [
    "webchat-liff-l3gp.vercel.app",
    "localhost:3000",
    "127.0.0.1:3000",
    "192.168.1.37:3000",
  ],
  devIndicators: { buildActivity: false },

  async rewrites() {
    return [
      { source: "/messages/:path*", destination: `${API_BASE}/messages/:path*` },
      { source: "/auth/:path*", destination: `${API_BASE}/auth/:path*` },
      { source: "/line/:path*", destination: `${API_BASE}/line/:path*` },
      { source: "/admin/:path*", destination: `${API_BASE}/admin/:path*` },
    ];
  },
};

module.exports = nextConfig;

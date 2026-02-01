/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: "/messages/:path*", destination: "http://127.0.0.1:4000/messages/:path*" },
      { source: "/auth/:path*", destination: "http://127.0.0.1:4000/auth/:path*" },
      { source: "/webhook/:path*", destination: "http://127.0.0.1:4000/webhook/:path*" },
      { source: "/admin/:path*", destination: "http://127.0.0.1:4000/admin/:path*" },
    ];
  },
};

module.exports = nextConfig;

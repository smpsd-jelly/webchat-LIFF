/** @type {import('next').NextConfig} */
const nextConfig = {
   allowedDevOrigins: [
    "0edac273319a.ngrok-free.app",
    "localhost:3000",
    "127.0.0.1:3000",
    "192.168.1.37:3000",
  ],

  async rewrites() {
    return [
      {
        source: "/messages/:path*",
        destination: "http://127.0.0.1:4000/messages/:path*",
      },
      {
        source: "/auth/:path*",
        destination: "http://127.0.0.1:4000/auth/:path*",
      },
      {
        source: "/line/:path*",
        destination: "http://127.0.0.1:4000/line/:path*",
      },
      {
        source: "/admin/:path*",
        destination: "http://127.0.0.1:4000/admin/:path*",
      },
    ];
  },
};

module.exports = nextConfig;

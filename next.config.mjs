/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
      remotePatterns: [
          {
          protocol: "https",
          hostname: "img.sndimg.com",
          port: "",
          pathname: "/**",
          },
      ],
  },
};

export default nextConfig;



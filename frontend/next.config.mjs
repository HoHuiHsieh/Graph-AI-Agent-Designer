/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    reactStrictMode: true,
    swcMinify: true,
    basePath: "/web",
    distDir: "build",
    env: {
        DEV_MODE: process.env.NODE_ENV,
    },
};

export default nextConfig;
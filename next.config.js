/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
            },
            {
                protocol: 'https',
                hostname: '*.cloudinary.com',
            },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },
}

module.exports = nextConfig

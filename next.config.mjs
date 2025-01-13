/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'uploadthing.com',
            },
            {
                protocol: 'https',
                hostname: 'utfs.io',
            },
            {
                protocol: "https",
                hostname: "v65bt4tat6.ufs.sh",
              },

        ]
    }
};

export default nextConfig;

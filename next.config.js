/** @type {import('next').NextConfig} */
const nextConfig = {
    /*output:"export",
    basePath:"/cacao",*/
    images: {
        domains: ['dummyimage.com', 'localhost', 'backend.jirka.co']
    },
    reactStrictMode: false
};

module.exports = nextConfig;

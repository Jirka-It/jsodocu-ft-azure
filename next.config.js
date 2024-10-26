/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['dummyimage.com']
    },
    reactStrictMode: true,
    async redirects() {
        return [
            {
                source: '/apps/mail',
                destination: '/apps/mail/inbox',
                permanent: true
            }
        ];
    }
};

module.exports = nextConfig;

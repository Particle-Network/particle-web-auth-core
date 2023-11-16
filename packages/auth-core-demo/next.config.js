const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/index',
                destination: '/',
            },
            {
                source: '/index.html',
                destination: '/',
            },
            {
                source: '/customize.html',
                destination: '/customize',
            },
            {
                source: '/connect.html',
                destination: '/connect',
            },
            {
                source: '/wagmi.html',
                destination: '/wagmi',
            },
        ];
    },
    webpack: (config, options) => {
        const { dev } = options;

        if (!dev) {
            config.plugins.push(
                new BundleAnalyzerPlugin({
                    analyzerMode: 'static',
                    reportFilename: 'report.html',
                    openAnalyzer: false,
                })
            );
        }

        return config;
    },
};

module.exports = nextConfig;

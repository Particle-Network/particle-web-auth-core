const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['crypto-js'],
    swcMinify: false,
    output: 'export',
    distDir: 'dist',
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

        // fix: more than one React when native link
        config.resolve.alias['react'] = path.resolve(__dirname, '../../node_modules/react');
        config.resolve.alias['react-dom'] = path.resolve(__dirname, '../../node_modules/react-dom');

        return config;
    },
};

module.exports = nextConfig;

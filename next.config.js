const { SubresourceIntegrityPlugin } = require('webpack-subresource-integrity');

const withTM = require('next-transpile-modules')([
  '@react-hook/window-scroll',
  '@react-hook/event',
  '@react-hook/throttle',
  '@react-hook/passive-layout-effect',
  '@react-hook/latest',
]);

const { i18n } = require('./next-i18next.config');

const umbracoDomains = [
  'webapp-we-shop-umbraco-mock-replica.azurewebsites.net',
  'webapp-we-shop-umbraco-daily-replica.azurewebsites.net',
  'webapp-we-shop-umbraco-dev-replica.azurewebsites.net',
  'webapp-we-shop-umbraco-qa-replica.azurewebsites.net',
  'webapp-we-shop-umbraco-prod-replica.azurewebsites.net',
  'webapp-we-shop-umbraco-dailycore-publisher.azurewebsites.net',
  'webapp-we-shop-umbraco-devcore-publisher.azurewebsites.net',
  'webapp-we-shop-umbraco-qacore-publisher.azurewebsites.net',
  'webapp-we-shop-umbraco-prodcore-publisher.azurewebsites.net',
  'api.daily.lemu-backend.dk',
  'media.daily.lemu-backend.dk',
];

const externalDomains = [
  'assets.cdnlemu.dk',
  '*.vercel.app',
  'vitals.vercel-insights.com',
  'gigya.com',
  'cdns.gigya.com',
  'cdns.eu1.gigya.com',
  'policy.app.cookieinformation.com',
  'cookieinformation.com',
  'www.googletagmanager.com'
];

const shouldApplySecurityHeaders = false; //process.env.NEXT_ENV === 'production';

const ContentSecurityPolicy = shouldApplySecurityHeaders ? `
  script-src 'self' 'unsafe-inline' ${externalDomains.join(' ')};
  connect-src ${umbracoDomains.join(' ')} ${externalDomains.join(' ')};
  style-src 'self' 'unsafe-inline';
  font-src 'self';
  img-src 'self' 'unsafe-inline' data: https: ${umbracoDomains.join(' ')};
  frame-ancestors 'self' youtube.com googletagmanager.com;
  base-uri 'self';
  form-action 'self';
  object-src 'none';
  default-src https: 'unsafe-eval' 'unsafe-inline';
` : '';

const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
  },
];

module.exports = withTM({
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },

  i18n,
  images: {
    domains: [
      'assets.cdnlemu.dk',
     ...umbracoDomains
    ],
  },
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
  webpack: function (config) {
    const originalEntry = config.entry;

    config.entry = async () => {
      const entries = await originalEntry();
      if (entries['main.js'] && !entries['main.js'].includes('./client/polyfills.js')) {
        entries['main.js'].unshift('./client/polyfills.js');
      }
      return entries;
    };

    config.output.crossOriginLoading = 'anonymous';
    config.plugins.push(new SubresourceIntegrityPlugin({
        hashFuncNames: ['sha256', 'sha384'],
        enabled: shouldApplySecurityHeaders
    }));

    return config;
  },
});

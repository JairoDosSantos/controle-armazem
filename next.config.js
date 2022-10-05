/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public'
})


module.exports = withPWA({
   reactStrictMode: true,
    images: {
    domains: ['i.ibb.co'],
  },
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
  },
});


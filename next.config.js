/** @type {import("next").NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/my-work",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/my-work/:id",
        destination: "/projects",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;

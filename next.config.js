module.exports = {
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.node = { fs: "empty", module: "empty" };
    }

    return config;
  },
};

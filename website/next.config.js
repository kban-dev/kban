require('dotenv').config()

module.exports = (phase, { defaultConfig }) => {
  return {
    ...defaultConfig,
    webpack: (config, options) => {
      // console.log(options);
      return config;
    },
    poweredByHeader: false,
    env: {
      API_URL: process.env.API_URL,
    }
  };
};

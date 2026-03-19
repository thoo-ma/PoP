module.exports = ({ config }) => {
  config.plugins[1][1].apiToken = process.env.EMBRACE_API_TOKEN || "";
  return config;
};

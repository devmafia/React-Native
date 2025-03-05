module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }]],
    // plugins: ["expo-router/babel"], // Ensure expo-router plugin is included
  };
};

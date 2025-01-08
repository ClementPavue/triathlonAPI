// babel.config.js
module.exports = {
    sourceMaps: "inline",
    retainLines: true,
    plugins: ["jest-hoist"],
    presets: [["@babel/preset-env", { targets: { node: "current" } }], "@babel/preset-typescript"],
};

const fs = require("fs");

/** @type {Partial<import('@jest/types').Config.ProjectConfig>} */
const commonProjectsConfig = {
    moduleDirectories: ["node_modules"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "mjs", "cjs", "node"],
    moduleNameMapper: fs.readdirSync("./src/", { withFileTypes: true }).reduce((map, file) => {
        if (file.isDirectory()) {
            map[`^${file.name}/(.*)$`] = `<rootDir>/src/${file.name}/$1`;
        } else if (["ts", "tsx", "js", "jsx", "json", "mjs", "cjs", "node"].find(item => file.name.endsWith(`.${item}`))) {
            const fileName = file.name.slice(0, file.name.lastIndexOf("."));
            map[`^${fileName}$`] = `<rootDir>/src/${fileName}`;
        }
        return map;
    }, Object.create(null)),
    rootDir: "./",
    roots: ["<rootDir>/", "<rootDir>/src/"],
    testEnvironment: "node",
    testPathIgnorePatterns: [".husky/", ".vscode/", "dist/", "coverage/", "node_modules/"],
    transformIgnorePatterns: [],
};

/** @type {Omit<import('@jest/types').Config.GlobalConfig, "projects"> & { projects: Array<import('@jest/types').Config.ProjectConfig> }} */
module.exports = {
    maxWorkers: 3,
    projects: [
        {
            displayName: "unit",
            testMatch: [
                "<rootDir>/src/modules/**/__tests__/**/unit/**/*.(spec|test).[tj]s?(x)",
                "<rootDir>/src/tools/**/__tests__/**/unit/**/*.(spec|test).[tj]s?(x)",
            ],
        },
        {
            displayName: "integration",
            testMatch: [
                "<rootDir>/src/modules/**/__tests__/**/integration/**/*.(spec|test).[tj]s?(x)",
                "<rootDir>/src/tools/**/__tests__/**/integration/**/*.(spec|test).[tj]s?(x)",
            ],
        },
    ].map(obj => ({ ...commonProjectsConfig, ...obj })),
    cache: false,
    forceExit: true,
    passWithNoTests: true,
    collectCoverage: true,
    collectCoverageFrom: [
        "**/*.{js,jsx,ts,tsx}",
        "!**/node_modules/**",
        "!**/.husky/**",
        "!**/.vscode/**",
        "!**/dist/**",
        "!**/coverage/**",
        "!**/__tests__/**",
        "!**/__mocks__/**",
        "!jest.config.js",
    ],
    coverageDirectory: "<rootDir>/coverage",
    verbose: true,
};

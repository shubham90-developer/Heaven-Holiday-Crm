module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testTimeout: 30000,
    testPathIgnorePatterns: ["/node_modules/", "/dist/"],
    // tell jest to resolve .ts files
    moduleFileExtensions: ["ts", "tsx", "js", "json"],
    setupFilesAfterEnv: [
        "<rootDir>/src/test/setup.ts"
    ]
};
export default {
  testEnvironment: "node",
  transform: {},
  setupFiles: ["dotenv/config"],
  globalSetup: "<rootDir>/tests/global-setup.cjs",
  testTimeout: 20000,
};

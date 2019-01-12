module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
  collectCoverageFrom: ['src/**/*.js'],
  testRegex: ['(/__tests__/.*spec)\\.js$'],
};

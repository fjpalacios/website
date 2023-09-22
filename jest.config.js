module.exports = {
  transform: {
    '^.+\\.[jt]sx?$': `<rootDir>/jest-preprocess.js`,
  },
  moduleNameMapper: {
    '.+\\.scss$': `identity-obj-proxy`,
    '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': `<rootDir>/__mocks__/file-mock.js`,
  },
  testPathIgnorePatterns: [
    `node_modules`,
    `\\.cache`,
    `<rootDir>.*/public`,
    `<rootDir>/cypress/`,
  ],
  transformIgnorePatterns: [`node_modules/(?!(gatsby)/)`],
  globals: {
    __PATH_PREFIX__: ``,
  },
  verbose: true,
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: `http://localhost`,
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  coverageReporters: ['lcov', 'text', 'html'],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
}

module.exports = {
  transform: {
    '^.+\\.[jt]sx?$': `<rootDir>/jest-preprocess.js`,
    '^.+\\.(md|mdx)$': 'jest-transformer-mdx',
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
  transformIgnorePatterns: [`node_modules/(?!(gatsby|gatsby-plugin-mdx)/)`],
  globals: {
    __PATH_PREFIX__: ``,
  },
  testURL: `http://localhost`,
  setupFiles: [`<rootDir>/loadershim.js`],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  coverageReporters: ['lcov', 'text', 'html'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupFilesAfterEnv: ['<rootDir>/src/setup-enzyme.ts'],
}

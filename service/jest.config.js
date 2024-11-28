module.exports = {
  rootDir: './',
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['js', 'json', 'jsx'],
  roots: ['<rootDir>/tests'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {},
  testPathIgnorePatterns: ['/node_modules/'],
  testURL: 'http://localhost',
  watchPathIgnorePatterns: [],
  watchman: true,
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!(axios)/)'],
};

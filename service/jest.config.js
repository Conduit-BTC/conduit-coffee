module.exports = {
  // The root directory that Jest should scan for tests and modules within
  rootDir: './',

  // The glob patterns Jest uses to detect test files
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: ['/node_modules/'],

  // An array of directory names to be searched recursively up from the requiring module's location
  moduleDirectories: ['node_modules'],

  // An array of file extensions your modules use
  moduleFileExtensions: ['js', 'json', 'jsx'],

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  // moduleNameMapper: {
  //   '^@/(.*)$': '<rootDir>/src/$1',
  // },

  // A list of paths to directories that Jest should use to search for files in
  roots: ['<rootDir>/tests'],

  // The path to a module that runs some code to configure or set up the testing environment before each test
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // The test environment that will be used for testing
  testEnvironment: 'jsdom',

  // Options that will be passed to the testEnvironment
  testEnvironmentOptions: {},

  // An array of regexp pattern strings that are matched against all test paths before executing the test
  testPathIgnorePatterns: ['/node_modules/'],

  // This option sets the URL for the jsdom environment
  testURL: 'http://localhost',

  // An array of regexp pattern strings that are matched against all source file paths before re-running tests in watch mode
  watchPathIgnorePatterns: [],

  // Whether to use watchman for file crawling
  watchman: true,
};

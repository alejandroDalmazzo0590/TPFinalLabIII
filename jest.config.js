module.exports = {
    transform: {
      '^.+\\.vue$': 'vue-jest',
      '^.+\\.js$': 'babel-jest',
    },
    moduleFileExtensions: ['js', 'vue'],
    transformIgnorePatterns: [
      '/node_modules/(?!(vue|@babel)/)',
    ],
    testEnvironment: "jest-environment-jsdom",
  };
  
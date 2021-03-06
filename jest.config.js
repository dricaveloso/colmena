module.exports = {
  roots: ["<rootDir>"],
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js", "json", "jsx"],
  testPathIgnorePatterns: ["<rootDir>[/\\\\](node_modules|.next)[/\\\\]"],
  transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(ts|tsx)$"],
  transform: {
    "^.+\\.(ts|tsx)$": "babel-jest",
  },
  watchPlugins: ["jest-watch-typeahead/filename", "jest-watch-typeahead/testname"],
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/test/__mocks__/fileMock.js",
    "^@/components/(.*)$": "<rootDir>/src/component/$1",
    "^@/enums/(.*)$": "<rootDir>/src/enums/index",
    "^@/hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^@/interfaces/(.*)$": "<rootDir>/src/interfaces/$1",
    "^@/pages/(.*)$": "<rootDir>/src/pages/$1",
    "^@/services/(.*)$": "<rootDir>/src/services/$1",
    "^@/store/(.*)$": "<rootDir>/src/store/$1",
    "^@/styles/(.*)$": "<rootDir>/src/styles/$1",
    "^@/types/(.*)$": "<rootDir>/src/types/index",
    "^@/utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@/libs/(.*)$": "<rootDir>/src/libs/$1",
    "^@/constants/(.*)$": "<rootDir>/src/constants/$1",
    "^@/tests/(.*)$": "<rootDir>/test/$1",
  },
  moduleDirectories: ["node_modules", "src"],
};

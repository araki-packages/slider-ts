module.exports = {
  preset: 'ts-jest',
  testRegex: "(/__tests__/.*|(\\.|/)(spec))\\.(jsx?|tsx?)$",
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json'
    }
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
};
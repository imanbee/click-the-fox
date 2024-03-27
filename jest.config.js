export default {
  preset: "ts-jest",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    // process `*.tsx` files with `ts-jest`
  },
  moduleNameMapper: {
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/__ mocks __/fileMock.js",
    "\\.(css|scss)$": "identity-obj-proxy",
  },
};

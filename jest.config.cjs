const path = require('path')

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    transform: {
        '^.+\\.(ts|tsx)$': [
            'ts-jest',
            {
                tsconfig: {
                    target: 'es2023',
                    lib: ['ES2023', 'DOM'],
                    module: 'esnext',
                    moduleResolution: 'bundler',
                    baseUrl: '.',
                    paths: {
                        '@/*': [path.join(__dirname, 'src/*')],
                    },
                    esModuleInterop: true,
                    skipLibCheck: true,
                    allowImportingTsExtensions: true,
                    moduleDetection: 'force',
                    noEmit: true,
                    jsx: 'react-jsx',
                    noUnusedLocals: true,
                    noUnusedParameters: true,
                    erasableSyntaxOnly: true,
                    noFallthroughCasesInSwitch: true,
                    types: ['jest', '@testing-library/jest-dom'],
                    verbatimModuleSyntax: false,
                },
                diagnostics: {
                    ignoreCodes: ['TS151001'],
                },
            },
        ],
    },
    testMatch: ['**/*.test.ts', '**/*.test.tsx'],
}

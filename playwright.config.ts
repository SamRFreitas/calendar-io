import { defineConfig } from '@playwright/test'

export default defineConfig({
    testDir: './tests/E2E', //
    testMatch: '**/*.spec.ts',
    testIgnore: '**/*.test.ts',
    use: {
        baseURL: 'http://localhost:5173',
        // launchOptions: {
        //     slowMo: 2000,
        // },
    },
})

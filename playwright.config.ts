import { defineConfig, devices } from '@playwright/test'

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
    projects: [
        { name: 'Desktop Chrome', use: { ...devices['Desktop Chrome'] } },
        { name: 'iPad Mini', use: { ...devices['iPad Mini'] } },
        { name: 'iPhone 13', use: { ...devices['iPhone 13'] } },
    ],
})

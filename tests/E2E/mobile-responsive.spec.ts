import { test, expect } from '@playwright/test'

test.describe('Mobile responsive behavior', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173')
        await page.setViewportSize({ width: 375, height: 800 })
    })

    test('tapping a day with an event opens the day list on mobile month view', async ({ page }) => {
        for (let i = 0; i < 12; i++) {
            const current = await page.locator('.nav-title').textContent()
            if (current?.includes('September 2026')) break
            await page.click('text=→')
        }

        await page.click('[data-testid="add-event-button"]')
        await page.fill('[data-testid="event-name"]', 'Mobile Tap Test')
        await page.click('[data-testid="event-type-meeting"]')
        await page.fill('[data-testid="event-start"]', '2026-09-01T10:00')
        await page.fill('[data-testid="event-end"]', '2026-09-01T11:00')
        await page.click('[data-testid="event-save"]')

        const dayCellWithEvent = page.locator('.calendar-day').filter({ has: page.locator('.event-dot') })
        await dayCellWithEvent.click()

        await expect(page.locator('[data-testid="event-name"]')).not.toBeVisible()
        await expect(page.locator('.modal-content').getByText('Mobile Tap Test')).toBeVisible()
    })

    test('shows one day at a time in week view on mobile, switchable via chips', async ({ page }) => {
        await page.click('text=Week')

        const columns = page.locator('.week-grid-day-column')
        await expect(columns).toHaveCount(7)

        const chips = page.locator('.week-day-chip')
        await expect(chips).toHaveCount(7)

        await chips.nth(3).click()
        await expect(columns.nth(3)).toBeVisible()
        await expect(columns.nth(0)).not.toBeVisible()
    })

    test('tapping a past day in month view does nothing on mobile, same as desktop', async ({ page }) => {
        const pastDay = page.locator('.calendar-day.bg-muted').first()
        await pastDay.click()

        await expect(page.locator('.modal-content')).not.toBeVisible()
    })

    test('theme toggle stays inside the menu container on very narrow screens', async ({ page }) => {
        await page.setViewportSize({ width: 320, height: 700 })

        const menuBox = await page.locator('.menu-container').boundingBox()
        const themeToggleBox = await page.getByTestId('theme-toggle-button').boundingBox()

        expect(menuBox).not.toBeNull()
        expect(themeToggleBox).not.toBeNull()
        expect(themeToggleBox!.x).toBeGreaterThanOrEqual(menuBox!.x - 1)
        expect(themeToggleBox!.x + themeToggleBox!.width).toBeLessThanOrEqual(menuBox!.x + menuBox!.width + 1)
    })
})

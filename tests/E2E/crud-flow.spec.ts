import { test, expect, type Page } from '@playwright/test'

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1280) < 768

// Below md (768px), Day.tsx hides the desktop event badges in favor of dots,
// and tapping a day opens the DayEventsList popover instead of the badge
// being directly clickable. These helpers pick the right interaction path.
async function clickEventToEdit(page: Page, eventName: string) {
    if (isMobile(page)) {
        await page.locator('.calendar-day').filter({ hasText: eventName }).first().click()
        await page.locator('.modal-content').getByText(eventName).click()
    } else {
        await page.locator(`text=${eventName}`).click({ force: true })
    }
}

async function expectEventListed(page: Page, eventName: string) {
    if (isMobile(page)) {
        await page.locator('.calendar-day').filter({ hasText: eventName }).first().click()
        await expect(page.locator('.modal-content').getByText(eventName)).toBeVisible()
        await page.click('[aria-label="Close"]')
    } else {
        await expect(page.locator(`text=${eventName}`)).toBeVisible()
    }
}

async function expectEventNotListed(page: Page, eventName: string) {
    if (isMobile(page)) {
        await expect(page.locator('.calendar-day').filter({ hasText: eventName })).toHaveCount(0)
    } else {
        await expect(page.locator(`text=${eventName}`)).not.toBeVisible()
    }
}

async function navigateToSeptember2026(page: Page) {
    const monthYear = await page.locator('.nav-title').textContent()
    if (!monthYear?.includes('September 2026')) {
        for (let i = 0; i < 12; i++) {
            await page.click('text=→')
            const current = await page.locator('.nav-title').textContent()
            if (current?.includes('September 2026')) break
        }
    }
}

test.describe('Calendar E2E', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173')
        await navigateToSeptember2026(page)
    })

    test('should add a new event', async ({ page }) => {
        await page.click('[data-testid="add-event-button"]')
        await page.fill('[data-testid="event-name"]', 'Test Meeting')
        await page.selectOption('[data-testid="event-type"]', 'meeting')
        await page.fill('[data-testid="event-start"]', '2026-09-01T10:00')
        await page.fill('[data-testid="event-end"]', '2026-09-01T11:00')
        await page.click('[data-testid="event-save"]')
        await expectEventListed(page, 'Test Meeting')
    })

    test('should edit an existing event', async ({ page }) => {
        await page.click('[data-testid="add-event-button"]')
        await page.fill('[data-testid="event-name"]', 'Edit Test')
        await page.selectOption('[data-testid="event-type"]', 'meeting')
        await page.fill('[data-testid="event-start"]', '2026-09-01T10:00')
        await page.fill('[data-testid="event-end"]', '2026-09-01T11:00')
        await page.click('[data-testid="event-save"]')

        await clickEventToEdit(page, 'Edit Test')

        // Wait for the edit form
        await page.waitForSelector('[data-testid="event-name"]', { timeout: 5000 })
        await page.fill('[data-testid="event-name"]', 'Edited Meeting')

        // Click the second save button (edit form's Save button)
        // The first one is the "Add" button from initial render, the second is "Save" in edit mode
        const saveButtons = page.locator('[data-testid="event-save"]')
        const count = await saveButtons.count()
        await saveButtons.nth(count - 1).click({ force: true })

        // Press Escape to close any open modals
        await page.keyboard.press('Escape')
        await page.waitForTimeout(500)

        // Verify the edited event appears
        await expectEventListed(page, 'Edited Meeting')
    })

    test('should delete an event', async ({ page }) => {
        
        page.on('dialog', async (dialog) => {
            await dialog.accept()
        })

        await page.click('[data-testid="add-event-button"]')
        await page.fill('[data-testid="event-name"]', 'Delete Test')
        await page.selectOption('[data-testid="event-type"]', 'meeting')
        await page.fill('[data-testid="event-start"]', '2026-09-01T10:00')
        await page.fill('[data-testid="event-end"]', '2026-09-01T11:00')
        await page.click('[data-testid="event-save"]')

        await clickEventToEdit(page, 'Delete Test')

        await page.waitForSelector('[data-testid="event-delete"]', { timeout: 5000 })
        await page.click('[data-testid="event-delete"]')

        await expectEventNotListed(page, 'Delete Test')
    })

    test('should persist events after reload', async ({ page }) => {
        await page.click('[data-testid="add-event-button"]')
        await page.fill('[data-testid="event-name"]', 'Persist Test')
        await page.selectOption('[data-testid="event-type"]', 'meeting')
        await page.fill('[data-testid="event-start"]', '2026-09-01T10:00')
        await page.fill('[data-testid="event-end"]', '2026-09-01T11:00')
        await page.click('[data-testid="event-save"]')

        await expectEventListed(page, 'Persist Test')
        await page.reload()
        await navigateToSeptember2026(page)
        await expectEventListed(page, 'Persist Test')
    })

    test('should block past date events', async ({ page }) => {
        await page.click('[data-testid="add-event-button"]')
        await page.fill('[data-testid="event-name"]', 'Past Event')
        await page.selectOption('[data-testid="event-type"]', 'meeting')
        await page.fill('[data-testid="event-start"]', '2020-01-01T10:00')
        await page.fill('[data-testid="event-end"]', '2020-01-01T11:00')
        await page.click('[data-testid="event-save"]')
        await expect(page.locator('text=Cannot create an event in the past')).toBeVisible()
    })

    test('should have a min attribute on the start input', async ({ page }) => {
        await page.click('[data-testid="add-event-button"]')

        const startInput = page.locator('[data-testid="event-start"]')
        const minDate = await startInput.getAttribute('min')

        expect(minDate).not.toBeNull()
        expect(minDate).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/) // formato YYYY-MM-DDTHH:mm
    })

    test('should block events with overlapping times', async ({ page }) => {
        
        await page.click('[data-testid="add-event-button"]')
        await page.fill('[data-testid="event-name"]', 'First Event')
        await page.selectOption('[data-testid="event-type"]', 'meeting')
        await page.fill('[data-testid="event-start"]', '2026-09-01T10:00')
        await page.fill('[data-testid="event-end"]', '2026-09-01T11:00')
        await page.click('[data-testid="event-save"]')


        await expectEventListed(page, 'First Event')

        
        await page.click('[data-testid="add-event-button"]')
        await page.fill('[data-testid="event-name"]', 'Second Event')
        await page.selectOption('[data-testid="event-type"]', 'meeting')
        await page.fill('[data-testid="event-start"]', '2026-09-01T10:30')
        await page.fill('[data-testid="event-end"]', '2026-09-01T10:45')
        await page.click('[data-testid="event-save"]')

        
        await expect(page.locator('text=Conflicts with "First Event"')).toBeVisible({ timeout: 5000 })
    })

    test('clicking a week-grid cell pre-fills the event form with that date and hour', async ({ page }) => {
        await page.click('text=Week')

        if (isMobile(page)) {
            // Only the selected day's column is visible on mobile; select the 3rd day first.
            await page.locator('.week-day-chip').nth(2).click()
        }

        const thirdColumn = page.locator('.week-grid-day-column').nth(2)
        await thirdColumn.locator('.week-grid-hour-cell').nth(9).click()

        const startInput = page.locator('[data-testid="event-start"]')
        await expect(startInput).toBeVisible()
        expect(await startInput.inputValue()).toMatch(/T09:00$/)

        const endInput = page.locator('[data-testid="event-end"]')
        expect(await endInput.inputValue()).toMatch(/T10:00$/)
    })

    test('editing a past event without changing its time succeeds (no longer blocked)', async ({ page }) => {
        await page.evaluate(() => {
            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)
            const pad = (n: number) => String(n).padStart(2, '0')
            const y = yesterday.getFullYear()
            const m = pad(yesterday.getMonth() + 1)
            const d = pad(yesterday.getDate())
            const events = JSON.parse(localStorage.getItem('events') || '[]')
            events.push({
                id: 'past-evt-1',
                type: 'meeting',
                name: 'Old Meeting',
                startDate: `${y}-${m}-${d}T10:00:00`,
                endDate: `${y}-${m}-${d}T11:00:00`,
            })
            localStorage.setItem('events', JSON.stringify(events))
        })
        await page.reload() // resets currentDate to real "today" -> current month view shows yesterday

        await clickEventToEdit(page, 'Old Meeting')
        await page.fill('[data-testid="event-name"]', 'Old Meeting Renamed')
        await page.click('[data-testid="event-save"]')

        await expect(page.locator('text=Cannot create an event in the past')).not.toBeVisible()
        await expectEventListed(page, 'Old Meeting Renamed')
    })

    test('moving an existing event start into the past is still blocked', async ({ page }) => {
        await page.click('[data-testid="add-event-button"]')
        await page.fill('[data-testid="event-name"]', 'Move Test')
        await page.selectOption('[data-testid="event-type"]', 'meeting')
        await page.fill('[data-testid="event-start"]', '2026-09-01T10:00')
        await page.fill('[data-testid="event-end"]', '2026-09-01T11:00')
        await page.click('[data-testid="event-save"]')

        await clickEventToEdit(page, 'Move Test')
        await page.fill('[data-testid="event-start"]', '2020-01-01T10:00')
        await page.fill('[data-testid="event-end"]', '2020-01-01T11:00')

        const saveButtons = page.locator('[data-testid="event-save"]')
        const count = await saveButtons.count()
        await saveButtons.nth(count - 1).click({ force: true })

        await expect(page.locator('text=Cannot create an event in the past')).toBeVisible()
    })
})

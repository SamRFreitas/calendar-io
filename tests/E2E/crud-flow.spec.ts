import { test, expect } from '@playwright/test'

test.describe('Calendar E2E', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173')

        // Navega para Septembro de 2026
        const monthYear = await page.locator('.nav-title').textContent()
        if (!monthYear?.includes('September 2026')) {
            for (let i = 0; i < 12; i++) {
                await page.click('text=→')
                const current = await page.locator('.nav-title').textContent()
                if (current?.includes('September 2026')) break
            }
        }
    })

    test('should add a new event', async ({ page }) => {
        await page.click('[data-testid="add-event-button"]')
        await page.fill('[data-testid="event-name"]', 'Test Meeting')
        await page.selectOption('[data-testid="event-type"]', 'meeting')
        await page.fill('[data-testid="event-start"]', '2026-09-01T10:00')
        await page.fill('[data-testid="event-end"]', '2026-09-01T11:00')
        await page.click('[data-testid="event-save"]')
        await expect(page.locator('text=Test Meeting')).toBeVisible()
    })

    test('should edit an existing event', async ({ page }) => {
        await page.click('[data-testid="add-event-button"]')
        await page.fill('[data-testid="event-name"]', 'Edit Test')
        await page.selectOption('[data-testid="event-type"]', 'meeting')
        await page.fill('[data-testid="event-start"]', '2026-09-01T10:00')
        await page.fill('[data-testid="event-end"]', '2026-09-01T11:00')
        await page.click('[data-testid="event-save"]')

        const event = page.locator('text=Edit Test')
        await event.waitFor({ state: 'visible', timeout: 5000 })
        await event.click({ force: true })

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
        await expect(page.locator('text=Edited Meeting')).toBeVisible({ timeout: 5000 })
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

        const event = page.locator('text=Delete Test')
        await event.waitFor({ state: 'visible', timeout: 5000 })
        await event.click({ force: true })

        await page.waitForSelector('[data-testid="event-delete"]', { timeout: 5000 })
        await page.click('[data-testid="event-delete"]')

        await expect(page.locator('text=Delete Test')).not.toBeVisible()
    })

    test('should persist events after reload', async ({ page }) => {
        await page.click('[data-testid="add-event-button"]')
        await page.fill('[data-testid="event-name"]', 'Persist Test')
        await page.selectOption('[data-testid="event-type"]', 'meeting')
        await page.fill('[data-testid="event-start"]', '2026-09-01T10:00')
        await page.fill('[data-testid="event-end"]', '2026-09-01T11:00')
        await page.click('[data-testid="event-save"]')

        await expect(page.locator('text=Persist Test')).toBeVisible()
        await page.reload()
        await expect(page.locator('text=Persist Test')).toBeVisible()
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

        
        await expect(page.locator('text=First Event')).toBeVisible()

        
        await page.click('[data-testid="add-event-button"]')
        await page.fill('[data-testid="event-name"]', 'Second Event')
        await page.selectOption('[data-testid="event-type"]', 'meeting')
        await page.fill('[data-testid="event-start"]', '2026-09-01T10:30')
        await page.fill('[data-testid="event-end"]', '2026-09-01T10:45')
        await page.click('[data-testid="event-save"]')

        
        await expect(page.locator('text=This time slot conflicts with an existing event')).toBeVisible({ timeout: 5000 })
    })
    
})


const { test, expect } = require('@playwright/test');
// Require dotenv and configure to load variables from .env file
require('dotenv').config();

test.beforeEach(async ({ page }) => {
    await page.goto(process.env.SALESFORCE_URL);
});

test.describe('Login', () => {
    test('should allow me to Login', async ({ page }) => {
        await page.locator("#username").fill(process.env.SALESFORCE_USERNAME);
        await page.locator("#password").fill(process.env.SALESFORCE_PASSWORD);
      
        await page.locator("#Login").click();
        // Navigate to the Home page
        await page.waitForLoadState('networkidle');
        
        // Assertion to verify successful login 
        await page.waitForSelector("div[title='Setup Home']");
        const loggedinHome = await page.locator("div[title='Setup Home']");
        await expect(loggedinHome).toBeVisible()
    });
});
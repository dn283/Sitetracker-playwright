const { test, expect } = require('@playwright/test');
require('dotenv').config();
const { LoginPage } = require('../pages/LoginPage');

test.describe('Login', (page) => {
    let loginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await page.goto(process.env.SALESFORCE_URL);
    });

    test('should allow me to Login', async () => {
        await loginPage.login(process.env.SALESFORCE_USERNAME, process.env.SALESFORCE_PASSWORD);
        
        // Assertion to verify successful login 
        const isLoggedIn = await loginPage.isLoggedIn();
        expect(isLoggedIn).toBeTruthy();
    });
});
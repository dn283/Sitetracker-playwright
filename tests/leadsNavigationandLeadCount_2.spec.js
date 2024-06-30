const { test, expect } = require('@playwright/test');
require('dotenv').config();

test.beforeEach(async ({ page }) => {
    // Navigate to Salesforce login page
    await page.goto(process.env.SALESFORCE_URL);

    // Perform login
    await page.locator("#username").fill(process.env.SALESFORCE_USERNAME);
    await page.locator("#password").fill(process.env.SALESFORCE_PASSWORD);
    await page.locator("#Login").click();

    // Wait for login to complete
    await page.waitForLoadState('networkidle');
});

test('Navigate to Leads Section', async ({ page }) => {

    // Open Apps menu and go to Leads section
    await page.locator(".slds-icon-waffle").click();
    await page.locator('input[placeholder="Search apps and items..."]').fill('Leads');
    await page.getByRole('option', { name: 'Leads' }).click();
    await page.waitForLoadState('networkidle');

    // Ensure on My Leads view
    const leadsHeaderTitle = await page.title();
    expect(leadsHeaderTitle).toEqual('Lead Intelligence View | Leads | Salesforce');
});

test('Filter Leads and Validate Lead Count', async ({ page }) => {
    // Open Apps menu and go to Leads section
    await page.locator(".slds-icon-waffle").click();
    await page.locator('input[placeholder="Search apps and items..."]').fill('Leads');
    await page.getByRole('option', { name: 'Leads' }).click();
    await page.waitForLoadState('networkidle');


    // Click on the filter icon
    await page.locator('button[title="Show filters"]').click();
    await page.waitForSelector('.slds-panel__body');

    // Click on the 'Created Date' filter and set custom range
    await page.locator('#LeadfilterPanelDateCriterion').click();
    const startDateInput = await page.locator('input.slds-input').nth(0);
    const endDateInput = await page.locator('input.slds-input').nth(1);
    await startDateInput.fill('01/01/2024');

    const today = new Date();
    const todayFormatted = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
    await endDateInput.fill(todayFormatted);

    await page.locator('.doneButton').click();
    await page.waitForTimeout(3000); 

    // Validate that the date filter criteria is reflected
    const operatorAndOperandText = await page.locator('#LeadfilterPanelDateCriterion').innerText();
    const expectedStartDate = '1/1/2024';
    const expectedEndDate = todayFormatted;
    if (operatorAndOperandText.includes(expectedStartDate) && operatorAndOperandText.includes(expectedEndDate)) {
        console.log('Selected dates are correctly reflected in the element.');
    } else {
        console.log('Selected dates do not match the expected dates.');
        console.log(`Expected start date: ${expectedStartDate}, Expected end date: ${expectedEndDate}`);
    }

    // Save date filter criteria
    await page.locator('.saveButton').click();
    await page.waitForLoadState('networkidle');

    // Verify the lead count
    const totalLeadElement = await page.locator('button[data-api-name="TotalLead"]');
    const leadCountText = await totalLeadElement.innerText();
    const expectedLeadCount = '22'; 
    if (leadCountText.includes(expectedLeadCount)) {
        console.log(`Lead count confirmed: ${expectedLeadCount}`);
    } else {
        console.log(`Lead count does not match the expected value.`);
        console.log(`Expected: ${expectedLeadCount}, Actual: ${leadCountText}`);
    }
});
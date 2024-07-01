const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { LeadsPage } = require('../pages/LeadsPage');
require('dotenv').config();

test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto(process.env.SALESFORCE_URL);
    await loginPage.login(process.env.SALESFORCE_USERNAME, process.env.SALESFORCE_PASSWORD);
});

test('Navigate to Leads Section', async ({ page }) => {
    const leadsPage = new LeadsPage(page);
    await leadsPage.navigateToLeads();

    const leadsHeaderTitle = await page.title();
    expect(leadsHeaderTitle).toEqual('Lead Intelligence View | Leads | Salesforce');
});

test('TC 2 - Filter Leads and Validate Lead Count', async ({ page }) => {
    const leadsPage = new LeadsPage(page);
    await leadsPage.navigateToLeads();
    await leadsPage.openFilterPanel();

    const startDate = '1/1/2024';
    const today = new Date();
    const todayFormatted = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
    const endDate=todayFormatted;
    await leadsPage.setCreatedDateFilter(startDate, endDate);
    await page.waitForTimeout(3000); 

    // Verify that the date filter criteria is reflected
    const operatorAndOperandText = await leadsPage.dateFilterCriterion.innerText();
   
    if (operatorAndOperandText.includes(startDate) && operatorAndOperandText.includes(endDate)) {
        console.log('Selected dates are correctly reflected in the element.');
    } else {
        console.log('Selected dates do not match the expected dates.');
        console.log(`Expected start date: ${startDate}, Expected end date: ${endDate}`);
    }

    // Verify the lead count
    const leadCountText = await leadsPage.getLeadCount();
    const expectedLeadCount = '22'; 
    if (leadCountText.includes(expectedLeadCount)) {
        console.log(`Lead count confirmed: ${expectedLeadCount}`);
    } else {
        console.log(`Lead count does not match the expected value.`);
        console.log(`Expected: ${expectedLeadCount}, Actual: ${leadCountText}`);
    }
});
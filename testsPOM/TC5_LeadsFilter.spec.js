const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { LeadsPage } = require('../pages/LeadsPage');

require('dotenv').config();
let loginPage;
let leadsPage;
test.beforeEach(async ({ page }) => {
  

   loginPage = new LoginPage(page);
  await page.goto(process.env.SALESFORCE_URL);
  await loginPage.login(process.env.SALESFORCE_USERNAME, process.env.SALESFORCE_PASSWORD);
});

test('TC 5 - Task Filter and Display', async ({ page }) => {


   leadsPage = new LeadsPage(page);

  await leadsPage.navigateToLeads();
  await leadsPage.clickLeadByName('Betty Bair'); 
  await leadsPage.goToActivityTab();

  // Filter by Next 7 Days
  await leadsPage.setFilterDateRange('Next 7 days'); 
  const isCreateBudgetPlanVisible = await leadsPage.checkTaskInElements('Create Budget Plan');
  expect(isCreateBudgetPlanVisible).toBeTruthy();

  // Filter by All Time 
  await leadsPage.setFilterDateRange('All time');
  const expectedTasks = ['Submit Budget Plan for Review', 'Create Budget Plan'];
  for (const expectedTask of expectedTasks) {
    const isTaskVisible = await leadsPage.checkTaskInElements(expectedTask);
    expect(isTaskVisible).toBeTruthy();
  }
});

const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { LeadsPage } = require('../pages/LeadsPage');
require('dotenv').config();

let loginPage;
let leadsPage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    leadsPage = new LeadsPage(page);
    await page.goto(process.env.SALESFORCE_URL);
    await loginPage.login(process.env.SALESFORCE_USERNAME, process.env.SALESFORCE_PASSWORD);
    expect(await loginPage.isLoggedIn()).toBeTruthy();
});

test('TC 3a - Open Lead and Create Task: "Create Budget Plan"', async () => {
    await leadsPage.navigateToLeads();

    await leadsPage.clickLeadByName('Betty Bair');
    await leadsPage.goToActivityTab();
    // Set due date to today's date
    const today = new Date();
    const todayFormatted = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;

    await leadsPage.createTask('Create Budget Plan', todayFormatted, 'In Progress');

    expect(await leadsPage.checkToastMessage('Create Budget Plan')).toBeTruthy();

});

test('TC 3b - Open Lead and Create Task: "Submit Budget Plan for Review"', async () => {
    await leadsPage.navigateToLeads();

    await leadsPage.clickLeadByName('Betty Bair');
    await leadsPage.goToActivityTab();
    // Calculate one week from today
    const today = new Date();
    const oneWeekFromNow = new Date(today);
    oneWeekFromNow.setDate(today.getDate() + 7);
    const oneWeekFormatted = `${oneWeekFromNow.getMonth() + 1}/${oneWeekFromNow.getDate()}/${oneWeekFromNow.getFullYear()}`;

    await leadsPage.createTask('Submit Budget Plan for Review', oneWeekFormatted, 'Not Started');

    expect(await leadsPage.checkToastMessage('Submit Budget Plan for Review')).toBeTruthy();
});

test('TC 4 - Activity Tab and Task Validation', async () => {
    await leadsPage.navigateToLeads();

    await leadsPage.clickLeadByName('Betty Bair');
    await leadsPage.goToActivityTab();
    

    // Ensure both tasks are displayed
    const expectedTasks = ['Submit Budget Plan for Review', 'Create Budget Plan'];
    for (const task of expectedTasks) {
        expect(await leadsPage.checkTaskInElements(task)).toBeTruthy();
    }

    // Additional validation for "Create Budget Plan" task
    await leadsPage.openTaskDetails('Create Budget Plan');
    const initialDescription = await leadsPage.getTaskDescription('Create Budget Plan');
    expect(initialDescription).toEqual('');
   

    await leadsPage.editTaskDescription('Create Budget Plan', 'Test Budget for Q4');
    await leadsPage.openTaskDetails('Create Budget Plan');
    const updatedDescription = await leadsPage.getTaskDescription('Create Budget Plan');
    console.log(updatedDescription)
    expect(updatedDescription).toEqual('Test Budget for Q4');
});
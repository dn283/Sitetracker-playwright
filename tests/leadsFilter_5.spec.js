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
    // Open Apps menu and go to Leads section
    await page.locator(".slds-icon-waffle").click();
    await page.locator('input[placeholder="Search apps and items..."]').fill('Leads');
    await page.getByRole('option', { name: 'Leads' }).click();
    await page.waitForLoadState('networkidle');

    // Ensure on My Leads view
    const leadsHeaderTitle = await page.title();
    expect(leadsHeaderTitle).toEqual('Lead Intelligence View | Leads | Salesforce');
});

test('Task Filter and Display"', async ({ page }) => {

    await page.locator("a[title='Betty Bair']").click();
    await page.waitForLoadState('networkidle');
    const recordTitle = await page.textContent("lightning-formatted-name[slot='primaryField']");
    expect(recordTitle).toContain('Ms Betty Bair');

    // Navigate to the 'Activity' tab 
    await page.locator('#activityTab__item').click();

    // Click on the gear icon next to "Filters" and set the date range to the next 7 days, then apply
    await page.locator('.filterMenuLink').click();
    await page.locator('label').filter({ hasText: 'Next 7 days' }).click()
    await page.locator('.timelineFilterApplyAndSave').click();
    await page.waitForSelector('.slds-col.slds-truncate.timelineGridItemLeft :first-child');

    // Check if 'Create Budget Plan' task is displayed
    let expectedTasks = [

        'Create Budget Plan'
    ];

    for (const expectedTask of expectedTasks) {
        const taskElements = await page.locator('.slds-col.slds-truncate.timelineGridItemLeft :first-child');
        const taskCount = await taskElements.count();
        console.log(`Found ${taskCount} task elements.`);

        let isTaskFound = false;
        for (let i = 0; i < taskCount; i++) {
            const taskText = await taskElements.nth(i).textContent();
            console.log(`Task text is : ${taskText}`);
            if (taskText.includes(expectedTask)) {
                console.log(`Filtered task : ${expectedTask}`);
                isTaskFound = true;
                break;
            }
        }

        expect(isTaskFound).toBeTruthy(); 
    }

    // Click "Show All Activities &  Check if Both task is displayed
    await page.locator('.filterMenuLink').click();
    await page.locator('label').filter({ hasText: 'All time' }).click()
    await page.locator('.timelineFilterApplyAndSave').click();
    await page.waitForTimeout(3000);

    expectedTasks = [
        'Submit Budget Plan for Review',
        'Create Budget Plan'
    ];

    // Validate that both tasks are now visible
    for (const expectedTask of expectedTasks) {
        const taskElements = await page.locator('.slds-col.slds-truncate.timelineGridItemLeft :first-child');
        const taskCount = await taskElements.count();
        console.log(`Found ${taskCount} task elements.`);

        let isTaskFound = false;
        for (let i = 0; i < taskCount; i++) {
            const taskText = await taskElements.nth(i).textContent();
            console.log(`Task text is : ${taskText}`);
            if (taskText.includes(expectedTask)) {
                console.log(`Found task : ${expectedTask}`);
                isTaskFound = true;
                break;
            }
        }

        expect(isTaskFound).toBeTruthy();
    }


})


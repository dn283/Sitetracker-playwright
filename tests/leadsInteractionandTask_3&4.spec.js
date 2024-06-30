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

test('Open Lead and Create Task: "Create Budget Plan"', async ({ page }) => {


    // Click on the lead named 'Betty Bair' and ensure her record opens
    await page.locator("a[title='Betty Bair']").click();
    await page.waitForLoadState('networkidle');
    const recordTitle = await page.textContent("lightning-formatted-name[slot='primaryField']");
    expect(recordTitle).toContain('Ms Betty Bair');

    // Navigate to the 'Activity' tab 
    await page.locator('#activityTab__item').click();

    // Click on 'New Task'
    await page.locator("button[title='New Task']").click();

    // Fill out task details: Subject, Due Date, Assigned to, Status

    //Subject
    const taskSubject = 'Create Budget Plan';
    await page.fill('input.slds-combobox__input', taskSubject);

    // Due Date
    const today = new Date();
    const todayFormatted = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
    await page.fill('.inputDate input[type="text"]', todayFormatted);

    // Assigned to
    const assignedToElement = await page.locator("span.pillText").nth(1)
    const assignedToValue = await assignedToElement.textContent();
    console.log(assignedToValue);

    // Status
    await page.locator('.uiInputSelect .select').click();

    // Select the option "In Progress" from the dropdown
    await page.getByRole('option', { name: 'In Progress' }).click()

    // Click Save or Create button to create the task
    await page.locator('.bottomBarRight').click();

    // success toast message 
    const successToast = await page.locator('.toastMessage');

    // Get the text content of the toast message
    const toastMessage = await successToast.textContent();
    console.log(toastMessage)

    // Assert that the toast message contains the expected text
    expect(toastMessage.includes(taskSubject)).toBeTruthy();

});

test('Open Lead and Create Task: "Submit Budget Plan for Review"', async ({ page }) => {


    // Click on the lead named 'Betty Bair' and ensure her record opens
    await page.locator("a[title='Betty Bair']").click();
    await page.waitForLoadState('networkidle');
    const recordTitle = await page.textContent("lightning-formatted-name[slot='primaryField']");
    expect(recordTitle).toContain('Ms Betty Bair');

    // Navigate to the 'Activity' tab 
    await page.locator('#activityTab__item').click();

    // Click on 'New Task'
    await page.locator("button[title='New Task']").click();

    //Subject
    const taskSubject = 'Submit Budget Plan for Review';
    await page.fill('input.slds-combobox__input', taskSubject);

    // Due Date
    const today = new Date();
    const todayFormatted = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
    // await page.pause();

    // Calculate one week from today
    const oneWeekFromNow = new Date(today);
    oneWeekFromNow.setDate(today.getDate() + 8);
    const oneWeekFormatted = `${oneWeekFromNow.getMonth() + 1}/${oneWeekFromNow.getDate()}/${oneWeekFromNow.getFullYear()}`;

    await page.fill('.inputDate input[type="text"]', oneWeekFormatted);

    // Assigned to
    const assignedToElement = await page.locator("span.pillText").nth(1)
    const assignedToValue = await assignedToElement.textContent();
    console.log(assignedToValue);

    // Status
    await page.locator('.uiInputSelect .select').click();

    // Select the option "In Progress" from the dropdown
    await page.getByRole('option', { name: 'Not Started' }).click()

    // Click Save or Create button to create the task
    await page.locator('.bottomBarRight').click();

    // success toast message 
    const successToast = await page.locator('.toastMessage');

    // Get the text content of the toast message
    const toastMessage = await successToast.textContent();
    console.log(toastMessage)

    // Assert that the toast message contains the expected text
    expect(toastMessage.includes(taskSubject)).toBeTruthy();

});

test('Activity Tab and Task Validation', async ({ page }) => {
    // Click on the lead named 'Betty Bair' and ensure her record opens
    await page.locator("a[title='Betty Bair']").click();
    await page.waitForLoadState('networkidle');
    const recordTitle = await page.textContent("lightning-formatted-name[slot='primaryField']");
    expect(recordTitle).toContain('Ms Betty Bair');

    // Navigate to the 'Activity' tab 
    await page.locator('#activityTab__item').click();

    // Wait for the section content to be visible
    const sectionContent = await page.locator('.slds-section__content');
    await sectionContent.waitFor({ state: 'visible' });

    // -------------Ensure both tasks are displayed ----------------

    // expected task details
    const expectedTasks = [
        'Submit Budget Plan for Review',
        'Create Budget Plan'
    ];

    await page.waitForTimeout(4000);
    await page.pause()

    // Function to check if the text content of an element matches any expected task
    async function checkTaskInElements(expectedTask) {
        const taskElements = await page.locator('.slds-col.slds-truncate.timelineGridItemLeft :first-child');

        const taskCount = await taskElements.count();
        expect(taskCount).toBe(2);
        console.log(`Found ${taskCount} task elements.`);

        for (let i = 0; i < taskCount; i++) {
            const taskText = await taskElements.nth(i).textContent();
            console.log(`Task text is: ${taskText}`);
            if (taskText.includes(expectedTask)) {
                console.log(`Found task :  ${expectedTask}`);
                return true;
            }
        }
        return false;
    }
    // Loop through each expected task and check if it's present in any element
    for (const task of expectedTasks) {
        const isTaskFound = await checkTaskInElements(task);
        console.log("  time : --- " + task)
        expect(isTaskFound).toBeTruthy();
    }

    // -------------Additional validation for "Create Budget Plan" task ---------------

// ○	For the "Create Budget Plan" task, click the expand icon (>) and confirm the 'Description' field is blank.
// ○	Edit the 'Description' by selecting "Edit Comments" from the dropdown menu, add "Budget for Q4", and save.
// ○	Validate that the 'Description' now shows "Budget for Q4".


    await page.locator('a').filter({ hasText: 'Details for Create Budget Plan' }).click();
    const descriptionField = await page.locator('.slds-item--detail');
    const DescriptionText = await page.locator('.slds-item--detail').textContent();
    console.log("Description Text is: " + DescriptionText)
    await expect(DescriptionText).toEqual('');

    await page.locator('a').filter({ hasText: 'Show more actions' }).nth(1)

    await page.locator(".rowActionsPlaceHolder").nth(1).click()

    await page.getByRole('menuitem', { name: 'Edit Comments' }).click();
    await page.waitForTimeout(3000)
    await page.locator("textarea[role='textbox']").fill('Test Budget for Q4');
    await page.locator(".cuf-publisherShareButton").click();
    await page.locator('.toastMessage').isVisible();

    await page.locator('a').filter({ hasText: 'Details for Create Budget Plan' }).click();
    const updatedDescription = await descriptionField.textContent();

    expect(updatedDescription).toEqual('Test Budget for Q4');


    console.log('Text validation successful')

});

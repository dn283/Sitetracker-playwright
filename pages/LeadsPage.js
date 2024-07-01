class LeadsPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.appsMenuIcon = page.locator(".slds-icon-waffle");
        this.searchInput = page.locator('input[placeholder="Search apps and items..."]');
        this.leadsOption = page.getByRole('option', { name: 'Leads' });
        this.filterIcon = page.locator('button[title="Show filters"]');
        this.dateFilterCriterion = page.locator('#LeadfilterPanelDateCriterion');
        this.startDateInput = page.locator('input.slds-input').nth(0);
        this.endDateInput = page.locator('input.slds-input').nth(1);
        this.doneButton = page.locator('.doneButton');
        this.totalLeadElement = page.locator('button[data-api-name="TotalLead"]');

        this.activityTabItem = page.locator('#activityTab__item');
        this.newTaskButton = page.locator("button[title='New Task']");
        this.taskSubjectInput = page.locator('input.slds-combobox__input');
        this.dueDateInput = page.locator('.inputDate input[type="text"]');
        this.taskStatusSelect = page.locator('.uiInputSelect .select');
        this.bottomBarRightButton = page.locator('.bottomBarRight');
        this.toastMessage = page.locator('.toastMessage');
        this.timelineGridItemLeft = page.locator('.slds-col.slds-truncate.timelineGridItemLeft :first-child');
        this.detailsLink = (taskName) => page.locator('a').filter({ hasText: `Details for ${taskName}` });
        this.showMoreActionsLink = (index) => page.locator('a').filter({ hasText: 'Show more actions' }).nth(index);
        this.editCommentsMenuItem = page.getByRole('menuitem', { name: 'Edit Comments' });
        this.descriptionTextarea = page.locator("textarea[role='textbox']");
        this.publisherShareButton = page.locator(".cuf-publisherShareButton");
        this.detailItem = page.locator('.slds-item--detail');

        this.filterMenuLink = page.locator('.filterMenuLink');
        this.filterRangeLabelLocator = label => page.locator('label').filter({ hasText: label });
        this.timelineFilterApplyAndSave = page.locator('.timelineFilterApplyAndSave');
    
    }

    async navigateToLeads() {
        await this.appsMenuIcon.click();
        await this.searchInput.fill('Leads');
        await this.leadsOption.click();
        await this.page.waitForLoadState('networkidle');
    }

    async openFilterPanel() {
        await this.filterIcon.click();
        await this.page.waitForSelector('.slds-panel__body');
    }

    async setCreatedDateFilter(startDate, endDate) {
        await this.dateFilterCriterion.click();
        await this.startDateInput.fill(startDate);
        await this.endDateInput.fill(endDate);
        await this.doneButton.click();
    }

    async getLeadCount() {
        const leadCountText = await this.totalLeadElement.innerText();
        return leadCountText;
    }

    async clickLeadByName(leadName) {
    const leadLink = await this.page.locator(`a[title='${leadName}']`); 
    await leadLink.click();
  }

    async goToActivityTab() {
        await this.activityTabItem.click();
        await this.page.waitForSelector('.filterMenuLink')
    }

    async createTask(subject, dueDate, status) {
        await this.newTaskButton.click();
        await this.taskSubjectInput.fill(subject);
        await this.dueDateInput.fill(dueDate);
        await this.taskStatusSelect.click();
        await this.page.getByRole('option', { name: status }).click();
        await this.bottomBarRightButton.click();
    }

    async checkToastMessage(expectedMessage) {
        const toastMessage = await this.toastMessage.textContent();
        console.log(toastMessage)
        return toastMessage.includes(expectedMessage);
    }

    async checkTaskInElements(expectedTask) {
        const taskCount = await this.timelineGridItemLeft.count();
        console.log(`Found ${taskCount} task elements.`);

        for (let i = 0; i < taskCount; i++) {
            const taskText = await this.timelineGridItemLeft.nth(i).textContent();
            console.log(`Task text is: ${taskText}`);
            if (taskText.includes(expectedTask)) {
                console.log(`Found task :  ${expectedTask}`);
                return true;
            }
        }
        return false;
    }

    async openTaskDetails(taskName) {
        await this.detailsLink(taskName).click();
    }

    async editTaskDescription(taskName, newDescription) {
        await this.openTaskDetails(taskName);
        await this.showMoreActionsLink(1).click();
        await this.editCommentsMenuItem.click();
        await this.descriptionTextarea.fill(newDescription);
        await this.publisherShareButton.click();
        await this.page.locator('.toastMessage').isVisible();
    }

    async getTaskDescription(taskName) {
        const descriptionText = await this.detailItem.textContent();
        return descriptionText;
    }

    async setFilterDateRange(rangeLabel) {
        await this.filterMenuLink.click(); 
        await this.filterRangeLabelLocator(rangeLabel).click(); 
        await this.timelineFilterApplyAndSave.click(); 
      }
}

module.exports = { LeadsPage };
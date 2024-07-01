# **Sitetracker-Playwright**

This repository contains Playwright test scripts for your Salesforce application, focusing on login and lead management functionalities.

### **Setup**

## **Install Playwright**
``` 
npm install playwright 
```

## **Install the dotenv package:**
```
npm install dotenv
```

## **Set up Environment Variables**

Create a .env file in the project root directory.
Add environment variables for Salesforce URLs, usernames, and passwords:
```
SALESFORCE_URL=https://your-salesforce-url.com
SALESFORCE_USERNAME=your_username
SALESFORCE_PASSWORD=your_password
```

## **Running Tests**

### **Run all tests:**
```
npx playwright test --workers=1
```

Run a specific test case (Also defined in package.json):

```
npx playwright test TC1_sitetrackerLogin.spec.js
```

## **Code Structure**

- playwright.config.js: Playwright configuration file.

- testsPOM/: Directory containing Playwright test case files (.spec.js).

- package.json: File containing project dependencies and scripts.

- **Example test cases:**
```
- TC1_sitetrackerLogin.spec.js: Login to Salesforce.
- TC2_LeadsNavigateAndLeadCount.spec.js: Navigate to Leads section and verify lead count.
- TC3and4TaskValidations.spec.js: Validate tasks associated with a lead.
- TC5_LeadsFilter.spec.js: Filter leads by date range and verify task presence.
```

 **Show Report**
```
  npx playwright show-report
```

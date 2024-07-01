class LoginPage {
     /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.usernameField = page.locator("#username");
    this.passwordField = page.locator("#password");
    this.loginButton = page.locator("#Login");
  }

  async login(username, password) {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async isLoggedIn() {
    try {
      await this.page.waitForSelector("div[title='Setup Home']", { state: 'visible' });
      return true;
    } catch (error) {
      return false;
    }
  }
}

export { LoginPage };
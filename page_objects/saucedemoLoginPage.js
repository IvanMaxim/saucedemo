import config from "../config/config";
import { expect } from "@playwright/test";

export class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = '#user-name';
    this.passwordInput = '#password';
    this.loginButton = '#login-button';
  }

  async loginToPortal(username, password) {
    await this.page.goto('https://www.saucedemo.com');
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForSelector(this.usernameInput, { state: "visible" });
    await this.page.waitForSelector(this.passwordInput, { state: "visible" });
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);

    // Wait for navigation and network requests to complete
    await this.page.waitForLoadState("networkidle");
    
    // Check if user is locked out
    const errorLocator = this.page.locator('.error-message-container');
    const hasError = await errorLocator.isVisible().catch(() => false);
    
    // If no error, user successfully logged in
    if (!hasError) {
      // Wait for the inventory container to be visible
      await this.page.waitForSelector('.inventory_container', {
        timeout: 10000,
      });
      
      // Verify we're on the inventory page
      await expect(this.page).toHaveURL('https://www.saucedemo.com/inventory.html');
    }
  }
}
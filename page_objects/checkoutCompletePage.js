import { expect } from "@playwright/test";

export class CheckoutCompletePage {
  constructor(page) {
    this.page = page;
    
    // Main container selectors
    this.checkoutCompleteContainer = '#checkout_complete_container';
    this.ponyExpressImage = '.pony_express';
    this.completeHeader = '.complete-header';
    this.completeText = '.complete-text';
    this.backHomeButton = '[data-test="back-to-products"]';
    
    // Header selectors
    this.title = '[data-test="title"]';
    this.shoppingCartLink = '.shopping_cart_link';
    
    // Menu selectors
    this.burgerMenuButton = '#react-burger-menu-btn';
    this.logoutLink = '#logout_sidebar_link';
    this.resetAppStateLink = '#reset_sidebar_link';
    this.allItemsLink = '#inventory_sidebar_link';
    this.aboutLink = '#about_sidebar_link';
    
    // Footer selectors
    this.footerContainer = '.footer';
    this.socialLinks = '.social';
    this.twitterLink = '.social_twitter';
    this.facebookLink = '.social_facebook';
    this.linkedinLink = '.social_linkedin';
    this.footerCopy = '.footer_copy';
  }
  
  // Opens checkout complete page
  async open() {
    await this.page.goto('https://www.saucedemo.com/checkout-complete.html');
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForSelector(this.checkoutCompleteContainer, { state: "visible" });
  }
  
  // Checks if checkout complete page is loaded
  async isLoaded() {
    await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
    await expect(this.page.locator(this.checkoutCompleteContainer)).toBeVisible();
    return true;
  }
  
  // Gets the page title
  async getTitle() {
    return this.page.locator(this.title).textContent();
  }
  
  // Gets the complete header text
  async getCompleteHeader() {
    return this.page.locator(this.completeHeader).textContent();
  }
  
  // Gets the complete text
  async getCompleteText() {
    return this.page.locator(this.completeText).textContent();
  }
  
  // Checks if pony express image is visible
  async isPonyExpressImageVisible() {
    return this.page.locator(this.ponyExpressImage).isVisible();
  }
  
  // Clicks back home button
  async backToHome() {
    await this.page.click(this.backHomeButton);
    await this.page.waitForURL('https://www.saucedemo.com/inventory.html');
  }
  
  // Opens side menu
  async openMenu() {
    await this.page.locator(this.burgerMenuButton).click();
    await this.page.waitForSelector(this.logoutLink, { state: "visible" });
  }
  
  // Navigates to all items
  async goToAllItems() {
    await this.openMenu();
    await this.page.locator(this.allItemsLink).click();
    await this.page.waitForURL('https://www.saucedemo.com/inventory.html');
  }
  
  // Navigates to about page
  async goToAbout() {
    await this.openMenu();
    await this.page.locator(this.aboutLink).click();
  }
  
  // Logs out from the system
  async logout() {
    await this.openMenu();
    await this.page.locator(this.logoutLink).click();
    await this.page.waitForURL('https://www.saucedemo.com/');
  }
  
  // Resets app state
  async resetAppState() {
    await this.openMenu();
    await this.page.locator(this.resetAppStateLink).click();
  }
  
  // Clicks on social media links
  async clickTwitterLink() {
    await this.page.click(this.twitterLink);
  }
  
  async clickFacebookLink() {
    await this.page.click(this.facebookLink);
  }
  
  async clickLinkedinLink() {
    await this.page.click(this.linkedinLink);
  }
  
  // Gets the footer copyright text
  async getFooterCopyText() {
    return this.page.locator(this.footerCopy).textContent();
  }
}

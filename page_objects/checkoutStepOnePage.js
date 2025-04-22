import { expect } from "@playwright/test";

export class CheckoutPage {
  constructor(page) {
    this.page = page;
    
    // Checkout information form selectors
    this.checkoutContainer = '#checkout_info_container';
    this.firstNameInput = '[data-test="firstName"]';
    this.lastNameInput = '[data-test="lastName"]';
    this.postalCodeInput = '[data-test="postalCode"]';
    this.continueButton = '[data-test="continue"]';
    this.cancelButton = '[data-test="cancel"]';
    this.errorMessage = '[data-test="error"]';
    
    // Checkout overview selectors
    this.checkoutSummaryContainer = '#checkout_summary_container';
    this.inventoryItems = '.cart_item';
    this.inventoryItemName = '.inventory_item_name';
    this.inventoryItemPrice = '.inventory_item_price';
    this.summarySubtotalLabel = '.summary_subtotal_label';
    this.summaryTaxLabel = '.summary_tax_label';
    this.summaryTotalLabel = '.summary_total_label';
    this.finishButton = '[data-test="finish"]';
    
    // Checkout complete selectors
    this.checkoutCompleteContainer = '#checkout_complete_container';
    this.completeHeader = '.complete-header';
    this.backHomeButton = '[data-test="back-to-products"]';
    
    // Menu selectors
    this.burgerMenuButton = '#react-burger-menu-btn';
    this.logoutLink = '#logout_sidebar_link';
    this.resetAppStateLink = '#reset_sidebar_link';
  }
  
  // Opens checkout page step one
  async open() {
    await this.page.goto('https://www.saucedemo.com/checkout-step-one.html');
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForSelector(this.checkoutContainer, { state: "visible" });
  }
  
  // Checks if checkout page step one is loaded
  async isStepOneLoaded() {
    await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
    await expect(this.page.locator(this.checkoutContainer)).toBeVisible();
    return true;
  }
  
  // Fills checkout information form
  async fillCheckoutInfo(firstName, lastName, postalCode) {
    await this.page.fill(this.firstNameInput, firstName);
    await this.page.fill(this.lastNameInput, lastName);
    await this.page.fill(this.postalCodeInput, postalCode);
  }
  
  // Continues to checkout step two
  async continueToStepTwo() {
    await this.page.click(this.continueButton);
    await this.page.waitForURL('https://www.saucedemo.com/checkout-step-two.html');
    await this.page.waitForSelector(this.checkoutSummaryContainer, { state: "visible" });
  }
  
  // Cancels checkout and returns to cart
  async cancelCheckout() {
    await this.page.click(this.cancelButton);
    await this.page.waitForURL('https://www.saucedemo.com/cart.html');
  }
  
  // Checks if checkout page step two is loaded
  async isStepTwoLoaded() {
    await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
    await expect(this.page.locator(this.checkoutSummaryContainer)).toBeVisible();
    return true;
  }
  
  // Gets all items in checkout summary
  async getCheckoutItems() {
    return this.page.locator(this.inventoryItems).count();
  }
  
  // Checks if item exists in checkout summary
  async hasItem(productName) {
    const items = await this.page.locator(`${this.inventoryItemName}:has-text("${productName}")`).count();
    return items > 0;
  }
  
  // Gets subtotal amount from checkout summary
  async getSubtotal() {
    const subtotalText = await this.page.locator(this.summarySubtotalLabel).textContent();
    return parseFloat(subtotalText.replace('Item total: $', ''));
  }
  
  // Gets tax amount from checkout summary
  async getTax() {
    const taxText = await this.page.locator(this.summaryTaxLabel).textContent();
    return parseFloat(taxText.replace('Tax: $', ''));
  }
  
  // Gets total amount from checkout summary
  async getTotal() {
    const totalText = await this.page.locator(this.summaryTotalLabel).textContent();
    return parseFloat(totalText.replace('Total: $', ''));
  }
  
  // Completes checkout
  async finishCheckout() {
    await this.page.click(this.finishButton);
    await this.page.waitForURL('https://www.saucedemo.com/checkout-complete.html');
    await this.page.waitForSelector(this.checkoutCompleteContainer, { state: "visible" });
  }
  
  // Checks if checkout complete page is loaded
  async isCheckoutCompleteLoaded() {
    await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
    await expect(this.page.locator(this.checkoutCompleteContainer)).toBeVisible();
    return true;
  }
  
  // Gets checkout complete message
  async getCompleteMessage() {
    return this.page.locator(this.completeHeader).textContent();
  }
  
  // Returns to products page after checkout
  async backToProducts() {
    await this.page.click(this.backHomeButton);
    await this.page.waitForURL('https://www.saucedemo.com/inventory.html');
  }
  
  // Opens side menu
  async openMenu() {
    await this.page.locator(this.burgerMenuButton).click();
    await this.page.waitForSelector(this.logoutLink, { state: "visible" });
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
}

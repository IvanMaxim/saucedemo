import { expect } from "@playwright/test";

export class CheckoutStepTwoPage {
  constructor(page) {
    this.page = page;
    
    // Main container selectors
    this.checkoutSummaryContainer = '#checkout_summary_container';
    this.cartList = '.cart_list';
    
    // Cart item selectors
    this.cartItems = '.cart_item';
    this.cartQuantityLabel = '.cart_quantity_label';
    this.cartDescLabel = '.cart_desc_label';
    this.itemQuantity = '.cart_quantity';
    this.itemName = '.inventory_item_name';
    this.itemDesc = '.inventory_item_desc';
    this.itemPrice = '.inventory_item_price';
    
    // Summary info selectors
    this.summaryInfo = '.summary_info';
    this.paymentInfoLabel = '[data-test="payment-info-label"]';
    this.paymentInfoValue = '[data-test="payment-info-value"]';
    this.shippingInfoLabel = '[data-test="shipping-info-label"]';
    this.shippingInfoValue = '[data-test="shipping-info-value"]';
    this.subtotalLabel = '[data-test="subtotal-label"]';
    this.taxLabel = '[data-test="tax-label"]';
    this.totalLabel = '[data-test="total-label"]';
    
    // Button selectors
    this.cancelButton = '#cancel';
    this.finishButton = '#finish';
    
    // Menu selectors
    this.burgerMenuButton = '#react-burger-menu-btn';
    this.logoutLink = '#logout_sidebar_link';
    this.resetAppStateLink = '#reset_sidebar_link';
    this.allItemsLink = '#inventory_sidebar_link';
    this.aboutLink = '#about_sidebar_link';
    
    // Header selectors
    this.title = '[data-test="title"]';
    this.shoppingCartLink = '.shopping_cart_link';
  }
  
  // Opens checkout step two page
  async open() {
    await this.page.goto('https://www.saucedemo.com/checkout-step-two.html');
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForSelector(this.checkoutSummaryContainer, { state: "visible" });
  }
  
  // Checks if checkout step two page is loaded
  async isLoaded() {
    await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
    await expect(this.page.locator(this.checkoutSummaryContainer)).toBeVisible();
    return true;
  }
  
  // Gets the page title
  async getTitle() {
    return this.page.locator(this.title).textContent();
  }
  
  // Gets all cart items
  async getCartItems() {
    return this.page.locator(this.cartItems).count();
  }
  
  // Checks if item exists in cart
  async hasItem(productName) {
    const items = await this.page.locator(`${this.itemName}:has-text("${productName}")`).count();
    return items > 0;
  }
  
  // Gets payment information
  async getPaymentInfo() {
    return this.page.locator(this.paymentInfoValue).textContent();
  }
  
  // Gets shipping information
  async getShippingInfo() {
    return this.page.locator(this.shippingInfoValue).textContent();
  }
  
  // Gets subtotal amount
  async getSubtotal() {
    const subtotalText = await this.page.locator(this.subtotalLabel).textContent();
    return parseFloat(subtotalText.replace('Item total: $', ''));
  }
  
  // Gets tax amount
  async getTax() {
    const taxText = await this.page.locator(this.taxLabel).textContent();
    return parseFloat(taxText.replace('Tax: $', ''));
  }
  
  // Gets total amount
  async getTotal() {
    const totalText = await this.page.locator(this.totalLabel).textContent();
    return parseFloat(totalText.replace('Total: $', ''));
  }
  
  // Cancels checkout and returns to cart
  async cancel() {
    await this.page.click(this.cancelButton);
    await this.page.waitForURL('https://www.saucedemo.com/cart.html');
  }
  
  // Completes checkout
  async finish() {
    await this.page.click(this.finishButton);
    await this.page.waitForURL('https://www.saucedemo.com/checkout-complete.html');
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
  
  // Goes to shopping cart
  async goToCart() {
    await this.page.locator(this.shoppingCartLink).click();
    await this.page.waitForURL('https://www.saucedemo.com/cart.html');
  }
}

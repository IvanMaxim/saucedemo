import { expect } from "@playwright/test";

export class CartPage {
  constructor(page) {
    this.page = page;
    
    // Cart container selector
    this.cartContainer = '#cart_contents_container';
    // Cart item selector
    this.cartItems = '.cart_item';
    // Cart item name selector
    this.cartItemName = '.inventory_item_name';
    // Cart item price selector
    this.cartItemPrice = '.inventory_item_price';
    // Remove button selector
    this.removeButton = '[data-test^="remove"]';
    
    // Navigation buttons
    // Continue shopping button selector
    this.continueShoppingButton = '[data-test="continue-shopping"]';
    // Checkout button selector
    this.checkoutButton = '[data-test="checkout"]';
    
    // Menu selectors
    // Burger menu button selector
    this.burgerMenuButton = '#react-burger-menu-btn';
    // Logout link selector
    this.logoutLink = '#logout_sidebar_link';
    // Reset app state link selector
    this.resetAppStateLink = '#reset_sidebar_link';
  }
  
  // Opens cart page and waits for it to load
  async open() {
    await this.page.goto('https://www.saucedemo.com/cart.html');
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForSelector(this.cartContainer, { state: "visible" });
  }
  
  // Checks if cart page is loaded
  async isLoaded() {
    await expect(this.page).toHaveURL('https://www.saucedemo.com/cart.html');
    await expect(this.page.locator(this.cartContainer)).toBeVisible();
    return true;
  }
  
  // Returns all cart items
  async getAllCartItems() {
    return this.page.locator(this.cartItems).all();
  }
  
  // Returns number of items in cart
  async getCartItemCount() {
    return this.page.locator(this.cartItems).count();
  }
  
  // Checks if item exists in cart
  async hasItem(productName) {
    const items = await this.page.locator(`${this.cartItemName}:has-text("${productName}")`).count();
    return items > 0;
  }
  
  // Removes item from cart by name
  async removeItem(productName) {
    const item = this.page.locator(this.cartItems)
      .filter({ hasText: productName });
    await item.locator(this.removeButton).click();
  }
  
  // Calculates total price of items in cart
  async getTotalPrice() {
    const priceElements = this.page.locator(this.cartItemPrice);
    const count = await priceElements.count();
    let total = 0;
    
    for (let i = 0; i < count; i++) {
      const priceText = await priceElements.nth(i).textContent();
      const price = parseFloat(priceText.replace('$', ''));
      total += price;
    }
    
    return total;
  }
  
  // Continues shopping and returns to inventory page
  async continueShopping() {
    await this.page.locator(this.continueShoppingButton).click();
    await this.page.waitForURL('https://www.saucedemo.com/inventory.html');
  }
  
  // Proceeds to checkout page
  async checkout() {
    await this.page.locator(this.checkoutButton).click();
    await this.page.waitForURL('https://www.saucedemo.com/checkout-step-one.html');
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

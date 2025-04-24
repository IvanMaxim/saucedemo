import { test, expect } from "@playwright/test";
import { LoginPage } from "../page_objects/saucedemoLoginPage";
import { InventoryPage } from "../page_objects/inventoryPage";
import { CartPage } from "../page_objects/cartPage";
import config from "../config/config";

test.describe("Saucedemo Cart Operations Tests", () => {
  // Login before each test
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginToPortal(config.Saucedemo_standard_user_LOGIN, config.Saucedemo_standard_user_PASSWORD);
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });
  
  test('Add product to cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const productName = 'Sauce Labs Backpack';
    
    // Verify cart is empty at the beginning
    expect(await inventoryPage.getCartCount()).toBe(0);
    // Verify the add to cart button is visible for the product
    const addButton = page.locator(`[data-test="add-to-cart-${productName.toLowerCase().replace(/ /g, '-')}"]`);
    await expect(addButton).toBeVisible();
    
    // Add product to cart and verify
    await inventoryPage.addProductToCart(productName);
    expect(await inventoryPage.getCartCount()).toBe(1);
    
    // Verify the add button changed to remove button
    const removeButton = page.locator(`[data-test="remove-${productName.toLowerCase().replace(/ /g, '-')}"]`);
    await expect(removeButton).toBeVisible();
    
    // Verify cart badge is visible and shows correct count
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText('1');
    // Navigate to cart and verify product is there
    await inventoryPage.goToCart();
    const cartPage = new CartPage(page);
    await cartPage.isLoaded();
    expect(await cartPage.hasItem(productName)).toBe(true);
    expect(await cartPage.getCartItemCount()).toBe(1);
    
    // Verify product details in cart
    const productElement = page.locator('.inventory_item_name').filter({ hasText: productName });
    await expect(productElement).toBeVisible();
    
    // Verify we can continue shopping from cart
    await cartPage.continueShopping();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });
  
  test('Remove product from cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const productName = 'Sauce Labs Bike Light';
    
    // Verify cart is empty at the beginning
    expect(await inventoryPage.getCartCount()).toBe(0);
    // Add product to cart and verify
    await inventoryPage.addProductToCart(productName);
    expect(await inventoryPage.getCartCount()).toBe(1);
    // Navigate to cart and verify product is there
    await inventoryPage.goToCart();
    const cartPage = new CartPage(page);
    await cartPage.isLoaded();
    expect(await cartPage.hasItem(productName)).toBe(true);
    // Verify the remove button is visible for the product
    const removeButton = page.locator(`[data-test="remove-${productName.toLowerCase().replace(/ /g, '-')}"]`);
    await expect(removeButton).toBeVisible();
    // Remove the product and verify it's no longer in the cart
    await cartPage.removeItem(productName);
    expect(await cartPage.getCartItemCount()).toBe(0);
    expect(await cartPage.hasItem(productName)).toBe(false);
    // Verify cart badge is updated after removal
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).not.toBeVisible();
    // Verify we can continue shopping after removing item
    await cartPage.continueShopping();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });
  
  test('Add multiple products to cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    // Define multiple products to test with
    const products = [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt'
    ];
    for (const product of products) {
      await inventoryPage.addProductToCart(product);
    }
    expect(await inventoryPage.getCartCount()).toBe(products.length);
    await inventoryPage.goToCart();
    const cartPage = new CartPage(page);
    await cartPage.isLoaded();
    for (const product of products) {
      expect(await cartPage.hasItem(product)).toBe(true);
    }
    expect(await cartPage.getCartItemCount()).toBe(products.length);
  });
  
  test('Problem user cart operations', async ({ page }) => {
    // Test with problem_user which has known issues
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.logout();
    const loginPage = new LoginPage(page);
    await loginPage.loginToPortal(config.Saucedemo_problem_user_LOGIN, config.Saucedemo_problem_user_PASSWORD);
    const productName = 'Sauce Labs Backpack';
    await inventoryPage.addProductToCart(productName);
    expect(await inventoryPage.getCartCount()).toBe(1);
    await inventoryPage.goToCart();
    const cartPage = new CartPage(page);
    await cartPage.isLoaded();
    expect(await cartPage.getCartItemCount()).toBeGreaterThan(0);
  });
});

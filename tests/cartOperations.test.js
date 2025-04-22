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
    expect(await inventoryPage.getCartCount()).toBe(0);
    await inventoryPage.addProductToCart(productName);
    expect(await inventoryPage.getCartCount()).toBe(1);
    await inventoryPage.goToCart();
    const cartPage = new CartPage(page);
    await cartPage.isLoaded();
    expect(await cartPage.hasItem(productName)).toBe(true);
    expect(await cartPage.getCartItemCount()).toBe(1);
  });
  
  test('Remove product from cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const productName = 'Sauce Labs Bike Light';
    await inventoryPage.addProductToCart(productName);
    expect(await inventoryPage.getCartCount()).toBe(1);
    await inventoryPage.goToCart();
    const cartPage = new CartPage(page);
    await cartPage.isLoaded();
    expect(await cartPage.hasItem(productName)).toBe(true);
    await cartPage.removeItem(productName);
    expect(await cartPage.getCartItemCount()).toBe(0);
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

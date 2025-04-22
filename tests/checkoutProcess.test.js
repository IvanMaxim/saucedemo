import { test, expect } from "@playwright/test";
import { LoginPage } from "../page_objects/saucedemoLoginPage";
import { InventoryPage } from "../page_objects/inventoryPage";
import { CartPage } from "../page_objects/cartPage";
import { CheckoutPage } from "../page_objects/checkoutStepOnePage";
import config from "../config/config";
test.describe("Saucedemo Checkout Process Tests", () => {
  // Login and add product to cart before each test
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginToPortal(config.Saucedemo_standard_user_LOGIN, config.Saucedemo_standard_user_PASSWORD);
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    const cartPage = new CartPage(page);
    await cartPage.isLoaded();
    expect(await cartPage.getCartItemCount()).toBe(1);
  });
  test('Complete checkout process with valid information', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.checkout();
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.isStepOneLoaded();
    await checkoutPage.fillCheckoutInfo('John', 'Doe', '12345');
    await checkoutPage.continueToStepTwo();
    await checkoutPage.isStepTwoLoaded();
    expect(await checkoutPage.hasItem('Sauce Labs Backpack')).toBe(true);
    const subtotal = await checkoutPage.getSubtotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();
    expect(total).toBeCloseTo(subtotal + tax, 2);
    await checkoutPage.finishCheckout();
    await checkoutPage.isCheckoutCompleteLoaded();
    const completeMessage = await checkoutPage.getCompleteMessage();
    expect(completeMessage).toContain('Thank you');
    await checkoutPage.backToProducts();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });
  test('Checkout with missing information shows error', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.checkout();
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.isStepOneLoaded();
    // Try to continue without filling any information
    await page.click(checkoutPage.continueButton);
    // Check for error message
    await expect(page.locator(checkoutPage.errorMessage)).toBeVisible();
    // Fill only first name and try again
    await checkoutPage.fillCheckoutInfo('John', '', '');
    await page.click(checkoutPage.continueButton);
    // Check for error message
    await expect(page.locator(checkoutPage.errorMessage)).toBeVisible();
    // Fill first and last name but no postal code
    await checkoutPage.fillCheckoutInfo('John', 'Doe', '');
    await page.click(checkoutPage.continueButton);
    // Check for error message
    await expect(page.locator(checkoutPage.errorMessage)).toBeVisible();
    // Finally fill all fields and continue
    await checkoutPage.fillCheckoutInfo('John', 'Doe', '12345');
    await checkoutPage.continueToStepTwo();
    // Verify we're on step two
    await checkoutPage.isStepTwoLoaded();
  });
  test('Cancel checkout returns to cart', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.checkout();
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.isStepOneLoaded();
    await checkoutPage.cancelCheckout();
    // Verify we're back on cart page
    await cartPage.isLoaded();
    expect(await cartPage.getCartItemCount()).toBe(1);
  });
  test('Checkout with problem_user', async ({ page }) => {
    // First logout
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.logout();
    // Login as problem_user
    const loginPage = new LoginPage(page);
    await loginPage.loginToPortal(config.Saucedemo_problem_user_LOGIN, config.Saucedemo_problem_user_PASSWORD);
    // Add product to cart
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    const cartPage = new CartPage(page);
    await cartPage.checkout();
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.isStepOneLoaded();
    // Try to fill checkout info (problem_user may have issues here)
    try {
      await checkoutPage.fillCheckoutInfo('John', 'Doe', '12345');
      await checkoutPage.continueToStepTwo();
    } catch (error) {
      // For problem_user, we expect potential issues with the form
      console.log('Problem user encountered expected issues with checkout form');
    }
  });
});

import { test, expect } from "@playwright/test";
import { LoginPage } from "../page_objects/saucedemoLoginPage";
import { InventoryPage } from "../page_objects/inventoryPage";
import { CartPage } from "../page_objects/cartPage";
import { CheckoutPage } from "../page_objects/checkoutStepOnePage";
import config from "../config/config";
test.describe("Saucedemo Payment and Order Completion Tests", () => {
  // Test for verifying the complete payment and order completion process
  test('Complete purchase with specific customer data', async ({ page }) => {
    // Login to the website
    const loginPage = new LoginPage(page);
    await loginPage.loginToPortal(config.Saucedemo_standard_user_LOGIN, config.Saucedemo_standard_user_PASSWORD);
    // Verify successful login and navigation to the inventory page
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    // Add product to cart
    const inventoryPage = new InventoryPage(page);
    const productName = 'Sauce Labs Backpack';
    await inventoryPage.addProductToCart(productName);
    // Verify that the product has been added to the cart
    expect(await inventoryPage.getCartCount()).toBe(1);
    // Navigate to the cart
    await inventoryPage.goToCart();
    // Verify that we are on the cart page and the product is in the cart
    const cartPage = new CartPage(page);
    await cartPage.isLoaded();
    expect(await cartPage.hasItem(productName)).toBe(true);
    // Proceed to checkout
    await cartPage.checkout();
    // Fill customer information on the checkout-step-one page
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.isStepOneLoaded();
    await checkoutPage.fillCheckoutInfo('Ivan', 'Maxim', '777777');
    // Proceed to the order confirmation page
    await checkoutPage.continueToStepTwo();
    // Verify that we are on the order confirmation page
    await checkoutPage.isStepTwoLoaded();
    expect(await checkoutPage.hasItem(productName)).toBe(true);
    // Get and verify financial information
    const subtotal = await checkoutPage.getSubtotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();
    // Verify the correctness of the total amount calculation
    expect(total).toBeCloseTo(subtotal + tax, 2);
    // Complete the checkout process
    await checkoutPage.finishCheckout();
    // Verify that we are on the order completion success page
    await checkoutPage.isCheckoutCompleteLoaded();
    // Verify the presence of the checkout complete container
    await expect(page.locator('#checkout_complete_container')).toBeVisible();
    // Verify the successful order completion message
    const completeMessage = await checkoutPage.getCompleteMessage();
    expect(completeMessage).toContain('Thank you');
    // Return to the products page
    await checkoutPage.backToProducts();
    // Verify that we have returned to the inventory page
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });
  // Test for verifying the complete process with multiple items
  test('Complete purchase with multiple items', async ({ page }) => {
    // Login to the website
    const loginPage = new LoginPage(page);
    await loginPage.loginToPortal(config.Saucedemo_standard_user_LOGIN, config.Saucedemo_standard_user_PASSWORD);
    // Verify successful login
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    // Add multiple products to the cart
    const inventoryPage = new InventoryPage(page);
    const products = [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt'
    ];
    for (const product of products) {
      await inventoryPage.addProductToCart(product);
    }
    // Verify that all products have been added to the cart
    expect(await inventoryPage.getCartCount()).toBe(products.length);
    // Navigate to the cart
    await inventoryPage.goToCart();
    // Verify that we are on the cart page and all products are in the cart
    const cartPage = new CartPage(page);
    await cartPage.isLoaded();
    for (const product of products) {
      expect(await cartPage.hasItem(product)).toBe(true);
    }
    // Proceed to checkout
    await cartPage.checkout();
    // Fill customer information
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.isStepOneLoaded();
    await checkoutPage.fillCheckoutInfo('Ivan', 'Maxim', '777777');
    // Proceed to the order confirmation page
    await checkoutPage.continueToStepTwo();
    // Verify that we are on the order confirmation page
    await checkoutPage.isStepTwoLoaded();
    // Verify that all products are in the order
    for (const product of products) {
      expect(await checkoutPage.hasItem(product)).toBe(true);
    }
    // Get and verify financial information
    const subtotal = await checkoutPage.getSubtotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();
    // Verify the correctness of the total amount calculation
    expect(total).toBeCloseTo(subtotal + tax, 2);
    // Complete the checkout process
    await checkoutPage.finishCheckout();
    // Verify that we are on the order completion success page
    await checkoutPage.isCheckoutCompleteLoaded();
    // Verify the presence of the checkout complete container
    await expect(page.locator('#checkout_complete_container')).toBeVisible();
    // Verify the successful order completion message
    const completeMessage = await checkoutPage.getCompleteMessage();
    expect(completeMessage).toContain('Thank you');
    // Return to the products page
    await checkoutPage.backToProducts();
    // Verify that we have returned to the inventory page
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });
});

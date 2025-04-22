import { test, expect } from "@playwright/test";
import { LoginPage } from "../page_objects/saucedemoLoginPage";
import config from "../config/config";

test.describe("Saucedemo Authorization Tests", () => {
    
  // Test for standard_user from config
  test('Login with standard_user from config', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginToPortal(config.Saucedemo_standard_user_LOGIN, config.Saucedemo_standard_user_PASSWORD);
    // Verify we're on the inventory page
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });
  
  // Test for locked_out_user from config
  test('Login with locked_out_user from config', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginToPortal(config.Saucedemo_locked_out_user_LOGIN, config.Saucedemo_locked_out_user_PASSWORD);
    // Verify error message is displayed
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface: Sorry, this user has been locked out');
    // Verify error close button is visible
    await expect(page.locator('[data-test="error-button"]')).toBeVisible();
  });
  
  // Test for problem_user from config
  test('Login with problem_user from config', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginToPortal(config.Saucedemo_problem_user_LOGIN, config.Saucedemo_problem_user_PASSWORD);
    // Verify we're on the inventory page
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    // Verify problem user can see inventory items
    const inventoryItems = page.locator('.inventory_item');
    await expect(inventoryItems.first()).toBeVisible();
    // Verify problem user can see item names
    const itemNames = page.locator('.inventory_item_name');
    await expect(itemNames.first()).toBeVisible();
  });
  
  // Test for performance_glitch_user from config
  test('Login with performance_glitch_user from config', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginToPortal(config.Saucedemo_performance_glitch_user_LOGIN, config.Saucedemo_performance_glitch_user_PASSWORD);
    // Verify we're on the inventory page
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });
  
  // Test for error_user from config
  test('Login with error_user from config', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginToPortal(config.Saucedemo_error_user_LOGIN, config.Saucedemo_error_user_PASSWORD);
    // Verify we're on the inventory page
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });
  
  // Test for visual_user from config
  test('Login with visual_user from config', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginToPortal(config.Saucedemo_visual_user_LOGIN, config.Saucedemo_visual_user_PASSWORD);
    // Verify we're on the inventory page
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });
});
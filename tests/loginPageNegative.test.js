import { test, expect } from "@playwright/test";
import { LoginPage } from "../page_objects/saucedemoLoginPage";
import config from "../config/config";

test.describe("Saucedemo Negative Authorization Tests", () => {
  const errorSelector = '[data-test="error"]';
  const errorButtonSelector = '[data-test="error-button"]';
  const wrongPasswordErrorText = 'Epic sadface: Username and password do not match any user in this service';
  
  test('Login with standard_user and incorrect password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginToPortal(config.Saucedemo_standard_user_LOGIN, 'wrong_password');
    
    await expect(page.locator(errorSelector)).toBeVisible();
    await expect(page.locator(errorSelector)).toContainText(wrongPasswordErrorText);
    await expect(page.locator(errorButtonSelector)).toBeVisible();
  });
  
  test('Login with locked_out_user and incorrect password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginToPortal(config.Saucedemo_locked_out_user_LOGIN, 'wrong_password');
    await expect(page.locator(errorSelector)).toBeVisible();
    await expect(page.locator(errorSelector)).toContainText(wrongPasswordErrorText);
    await expect(page.locator(errorButtonSelector)).toBeVisible();
  });
  
  test('Login with problem_user and incorrect password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginToPortal(config.Saucedemo_problem_user_LOGIN, 'wrong_password');
    await expect(page.locator(errorSelector)).toBeVisible();
    await expect(page.locator(errorSelector)).toContainText(wrongPasswordErrorText);
    await expect(page.locator(errorButtonSelector)).toBeVisible();
  });
  
  test('Login with performance_glitch_user and incorrect password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginToPortal(config.Saucedemo_performance_glitch_user_LOGIN, 'wrong_password');
    await expect(page.locator(errorSelector)).toBeVisible();
    await expect(page.locator(errorSelector)).toContainText(wrongPasswordErrorText);
    await expect(page.locator(errorButtonSelector)).toBeVisible();
  });
  
  test('Login with error_user and incorrect password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginToPortal(config.Saucedemo_error_user_LOGIN, 'wrong_password');
    await expect(page.locator(errorSelector)).toBeVisible();
    await expect(page.locator(errorSelector)).toContainText(wrongPasswordErrorText);
    await expect(page.locator(errorButtonSelector)).toBeVisible();
  });
  
  test('Login with visual_user and incorrect password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginToPortal(config.Saucedemo_visual_user_LOGIN, 'wrong_password');
    await expect(page.locator(errorSelector)).toBeVisible();
    await expect(page.locator(errorSelector)).toContainText(wrongPasswordErrorText);
    await expect(page.locator(errorButtonSelector)).toBeVisible();
  });
  
  test('Login with empty username', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginToPortal('', 'secret_sauce');
    await expect(page.locator(errorSelector)).toBeVisible();
    await expect(page.locator(errorSelector)).toContainText('Epic sadface: Username is required');
    await expect(page.locator(errorButtonSelector)).toBeVisible();
  });
  
  test('Login with empty password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginToPortal('standard_user', '');
    await expect(page.locator(errorSelector)).toBeVisible();
    await expect(page.locator(errorSelector)).toContainText('Epic sadface: Password is required');
    await expect(page.locator(errorButtonSelector)).toBeVisible();
  });
});

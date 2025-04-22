import { test, expect } from "@playwright/test";
import { LoginPage } from "../page_objects/saucedemoLoginPage";
import { InventoryPage } from "../page_objects/inventoryPage";
import { CartPage } from "../page_objects/cartPage";
import { CheckoutPage } from "../page_objects/checkoutStepOnePage";
import config from "../config/config";
test.describe("Saucedemo Payment and Order Completion Tests", () => {
  // Тест для проверки полного процесса оплаты и завершения заказа
  test('Complete purchase with specific customer data', async ({ page }) => {
    // Логин на сайт
    const loginPage = new LoginPage(page);
    await loginPage.loginToPortal(config.Saucedemo_standard_user_LOGIN, config.Saucedemo_standard_user_PASSWORD);
    // Проверка успешного входа и перехода на страницу инвентаря
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    // Добавление товара в корзину
    const inventoryPage = new InventoryPage(page);
    const productName = 'Sauce Labs Backpack';
    await inventoryPage.addProductToCart(productName);
    // Проверка, что товар добавлен в корзину
    expect(await inventoryPage.getCartCount()).toBe(1);
    // Переход в корзину
    await inventoryPage.goToCart();
    // Проверка, что мы находимся на странице корзины и в ней есть товар
    const cartPage = new CartPage(page);
    await cartPage.isLoaded();
    expect(await cartPage.hasItem(productName)).toBe(true);
    // Переход к оформлению заказа
    await cartPage.checkout();
    // Заполнение данных покупателя на странице checkout-step-one
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.isStepOneLoaded();
    await checkoutPage.fillCheckoutInfo('Ivan', 'Maxim', '777777');
    // Переход к странице подтверждения заказа
    await checkoutPage.continueToStepTwo();
    // Проверка, что мы находимся на странице подтверждения заказа
    await checkoutPage.isStepTwoLoaded();
    expect(await checkoutPage.hasItem(productName)).toBe(true);
    // Получение и проверка финансовой информации
    const subtotal = await checkoutPage.getSubtotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();
    // Проверка корректности расчета итоговой суммы
    expect(total).toBeCloseTo(subtotal + tax, 2);
    // Завершение оформления заказа
    await checkoutPage.finishCheckout();
    // Проверка, что мы находимся на странице успешного завершения заказа
    await checkoutPage.isCheckoutCompleteLoaded();
    // Проверка наличия контейнера завершения заказа
    await expect(page.locator('#checkout_complete_container')).toBeVisible();
    // Проверка сообщения об успешном завершении заказа
    const completeMessage = await checkoutPage.getCompleteMessage();
    expect(completeMessage).toContain('Thank you');
    // Возврат на страницу с товарами
    await checkoutPage.backToProducts();
    // Проверка, что мы вернулись на страницу инвентаря
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });
  // Тест для проверки полного процесса с несколькими товарами
  test('Complete purchase with multiple items', async ({ page }) => {
    // Логин на сайт
    const loginPage = new LoginPage(page);
    await loginPage.loginToPortal(config.Saucedemo_standard_user_LOGIN, config.Saucedemo_standard_user_PASSWORD);
    // Проверка успешного входа
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    // Добавление нескольких товаров в корзину
    const inventoryPage = new InventoryPage(page);
    const products = [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt'
    ];
    for (const product of products) {
      await inventoryPage.addProductToCart(product);
    }
    // Проверка, что все товары добавлены в корзину
    expect(await inventoryPage.getCartCount()).toBe(products.length);
    // Переход в корзину
    await inventoryPage.goToCart();
    // Проверка, что мы находимся на странице корзины и в ней есть все товары
    const cartPage = new CartPage(page);
    await cartPage.isLoaded();
    for (const product of products) {
      expect(await cartPage.hasItem(product)).toBe(true);
    }
    // Переход к оформлению заказа
    await cartPage.checkout();
    // Заполнение данных покупателя
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.isStepOneLoaded();
    await checkoutPage.fillCheckoutInfo('Ivan', 'Maxim', '777777');
    // Переход к странице подтверждения заказа
    await checkoutPage.continueToStepTwo();
    // Проверка, что мы находимся на странице подтверждения заказа
    await checkoutPage.isStepTwoLoaded();
    // Проверка наличия всех товаров в заказе
    for (const product of products) {
      expect(await checkoutPage.hasItem(product)).toBe(true);
    }
    // Получение и проверка финансовой информации
    const subtotal = await checkoutPage.getSubtotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();
    // Проверка корректности расчета итоговой суммы
    expect(total).toBeCloseTo(subtotal + tax, 2);
    // Завершение оформления заказа
    await checkoutPage.finishCheckout();
    // Проверка, что мы находимся на странице успешного завершения заказа
    await checkoutPage.isCheckoutCompleteLoaded();
    // Проверка наличия контейнера завершения заказа
    await expect(page.locator('#checkout_complete_container')).toBeVisible();
    // Проверка сообщения об успешном завершении заказа
    const completeMessage = await checkoutPage.getCompleteMessage();
    expect(completeMessage).toContain('Thank you');
    // Возврат на страницу с товарами
    await checkoutPage.backToProducts();
    // Проверка, что мы вернулись на страницу инвентаря
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });
});

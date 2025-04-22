# Saucedemo Automated Testing with Playwright

This project contains automated tests for the [Saucedemo](https://www.saucedemo.com/) website using Playwright test framework. The tests are organized using the Page Object Model pattern for better maintainability and readability.

## Features

- Login functionality tests (positive and negative scenarios)
- Cart operations tests (adding/removing products)
- Checkout process tests
- Payment and order completion tests
- Support for different user types (standard_user, problem_user, etc.)

## Project Structure

```
├── config/                 # Configuration files
├── page_objects/           # Page Object Model classes
│   ├── cartPage.js         # Cart page interactions
│   ├── checkoutCompletePage.js # Checkout complete page interactions
│   ├── checkoutStepOnePage.js  # Checkout step one page interactions
│   ├── checkoutStepTwoPage.js  # Checkout step two page interactions
│   ├── inventoryPage.js    # Inventory/products page interactions
│   └── saucedemoLoginPage.js # Login page interactions
├── tests/                  # Test files
│   ├── cartOperations.test.js    # Tests for cart functionality
│   ├── checkoutProcess.test.js   # Tests for checkout process
│   ├── loginPage.test.js         # Tests for login functionality
│   ├── loginPageNegative.test.js # Negative tests for login
│   └── paymentAndCompletion.test.js # Tests for payment and order completion
└── utils/                  # Utility functions and helpers
```

## Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)
- Playwright Test Framework

## Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/saucedemo-playwright-tests.git
   cd saucedemo-playwright-tests
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Install Playwright browsers
   ```
   npx playwright install
   ```

## Running Tests

- Run all tests:
  ```
  npx playwright test
  ```

- Run specific test file:
  ```
  npx playwright test tests/loginPage.test.js
  ```

- Run tests with UI mode:
  ```
  npx playwright test --ui
  ```

- Run tests with headed browsers:
  ```
  npx playwright test --headed
  ```

- Run tests for specific user type:
  ```
  npx playwright test tests/checkoutProcess.test.js --grep "problem_user"
  ```

## Test Reports

After running tests, you can view the HTML report:

```
npx playwright show-report
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

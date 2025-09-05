import { test, expect } from '@playwright/test';

const uniqueDesc = `Updated Expense To Delete ${Date.now()}`;

test.describe('Expense Tracker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should create a new expense item', async ({ page }) => {
    await page.getByTestId('add-expense').click();
    await page.getByTestId('expense-description').fill('Test Expense');
    await page.getByTestId('expense-amount').fill('100');
    await page.getByTestId('expense-category').selectOption('Food');
    await page.getByTestId('save-expense').click();
    await expect(page.getByText('Test Expense')).toBeVisible();
  });

  test('should edit an expense item', async ({ page }) => {
    await page.getByText('Test Expense').click();
    await page.getByTestId('edit-expense').click();
    await page.getByTestId('expense-description').fill(uniqueDesc);
    await page.getByTestId('save-expense').click();
    await expect(page.getByText(uniqueDesc)).toBeVisible();
  });

  test('should delete an expense item', async ({ page }) => {
    const row = await page.getByText(uniqueDesc).first();
    await row.click();
    await page.getByTestId('delete-expense').click();
    await page.getByTestId('confirm-delete').click();
    await expect(page.getByText(uniqueDesc)).toHaveCount(0);
  });

  test('should search for an expense item', async ({ page }) => {
    const searchDesc = `Searchable Expense ${Date.now()}`;

    // Create a unique expense for search
    await page.getByTestId('add-expense').click();
    await page.getByTestId('expense-description').fill(searchDesc);
    await page.getByTestId('expense-amount').fill('50');
    await page.getByTestId('expense-category').selectOption('Food');
    await page.getByTestId('save-expense').click();
    await expect(page.getByText(searchDesc)).toBeVisible();

    // Now search for it (using a partial string is fine if your search supports it)
    await page.getByTestId('search-bar').fill(searchDesc.slice(0, 10));
    await expect(page.getByText(searchDesc)).toBeVisible({ timeout: 3000 });
  });
});
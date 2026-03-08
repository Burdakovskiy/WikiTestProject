import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  private readonly elements: {
    usernameInput: Locator;
    passwordInput: Locator;
    submitButton: Locator;
    errorBox: Locator;
    preferencesLoginWarning: Locator;
  };

  constructor(private readonly page: Page) {
    this.elements = {
      usernameInput: this.page.locator('#wpName1').or(this.page.locator('input[name="wpName"]')),
      passwordInput: this.page
        .locator('#wpPassword1')
        .or(this.page.locator('input[name="wpPassword"]')),
      submitButton: this.page
        .locator('#wpLoginAttempt')
        .or(this.page.locator('button[type="submit"]')),
      errorBox: this.page.locator('.cdx-message--error, .mw-message-box-error, .errorbox').first(),
      preferencesLoginWarning: this.page
        .locator('.cdx-message__content')
        .filter({
          hasText: /Please log in to change your preferences\./i,
        })
        .first(),
    };
  }

  async open(): Promise<void> {
    await this.page.goto('/wiki/Special:UserLogin', {
      waitUntil: 'commit',
      timeout: 60_000,
    });

    await expect(this.elements.usernameInput).toBeVisible({ timeout: 30_000 });
  }

  private async fillUsername(username: string): Promise<void> {
    await this.elements.usernameInput.fill(username);
  }

  private async fillPassword(password: string): Promise<void> {
    await this.elements.passwordInput.fill(password);
  }

  private async submitButtonTap(): Promise<void> {
    await this.elements.submitButton.click();
  }

  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.submitButtonTap();
  }

  async expectLoginFormVisible(): Promise<void> {
    await expect(this.elements.usernameInput).toBeVisible();
    await expect(this.elements.passwordInput).toBeVisible();
    await expect(this.elements.submitButton).toBeVisible();
  }

  async loginPageIsVisible(): Promise<void> {
    await expect(this.page).toHaveURL(/Special:UserLogin/i);
  }

  async expectLoginErrorVisible(): Promise<void> {
    await expect(this.elements.errorBox).toBeVisible();
  }

  async expectIsOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/Special:UserLogin/i);
  }

  async expectPreferencesLoginWarningVisible(): Promise<void> {
    await expect(this.elements.preferencesLoginWarning).toBeVisible();
  }
}

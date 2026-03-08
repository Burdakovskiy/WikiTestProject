import { expect, Locator, Page } from '@playwright/test';

export class PreferencesPage {
  private readonly elements: {
    languageSelect: Locator;
    restoreDefaultsLink: Locator;
    resetConfirmCheckbox: Locator;
    restoreDefaultsSubmitButton: Locator;
    preferencesSavedMessage: Locator;
    saveButton: Locator;
    pageTitle: Locator;
  };
  constructor(private readonly page: Page) {
    this.elements = {
      languageSelect: this.page.locator('select[name="wplanguage"]').first(),
      restoreDefaultsLink: this.page.locator('a[href="/wiki/Special:Preferences/reset"]'),
      resetConfirmCheckbox: this.page.locator('#mw-input-wpconfirm input[name="wpconfirm"]'),
      restoreDefaultsSubmitButton: this.page.locator('button[type="submit"]'),
      preferencesSavedMessage: this.page.locator('.mw-notification-content'),
      saveButton: this.page.getByRole('button', { name: /save|сохранить/i }).first(),
      pageTitle: this.page.locator('#firstHeading, .mw-first-heading').first(),
    };
  }

  private async goToReset(): Promise<void> {
    await this.elements.restoreDefaultsLink.click();
  }

  private async saveLanguage(): Promise<void> {
    await expect(this.elements.saveButton).toBeVisible();
    await expect(this.elements.saveButton).toBeEnabled({ timeout: 10000 });
    await this.elements.saveButton.click();
    await expect(this.elements.preferencesSavedMessage).toBeVisible();
  }

  async ensureBaseLanguageIsEn(): Promise<void> {
    const current = await this.getInterfaceLanguage();
    if (current === 'en') return;

    await this.resetPreferencesToDefault();

    const afterReset = await this.getInterfaceLanguage();
    if (afterReset === 'en') return;

    await this.setInterfaceLanguageAndSave('en');
    await expect(this.elements.languageSelect).toHaveValue('en');
  }

  private async getInterfaceLanguage(): Promise<'en' | 'ru' | string> {
    return (await this.elements.languageSelect.inputValue()).toLowerCase();
  }

  private async resetPreferencesToDefault(): Promise<void> {
    await this.goToReset();
    await expect(this.page).toHaveURL(/Special:Preferences\/reset/i);

    const cb = this.elements.resetConfirmCheckbox;
    await expect(cb).toBeVisible();

    if (!(await cb.isChecked())) await cb.check();
    await expect(cb).toBeChecked();

    await this.elements.restoreDefaultsSubmitButton.click();
    await expect(this.page).toHaveURL(/Special:Preferences/i);
  }

  async setInterfaceLanguageAndSave(target: 'en' | 'ru'): Promise<void> {
    await this.setLanguageByPrefix(target);
    await expect(this.elements.languageSelect).toHaveValue(target);

    await this.saveLanguage();
    await expect(this.elements.languageSelect).toHaveValue(target);
  }

  private async setLanguageByPrefix(prefix: 'en' | 'ru'): Promise<void> {
    await this.elements.languageSelect.evaluate((el, value) => {
      const s = el as HTMLSelectElement;

      const exists = Array.from(s.options).some((o) => o.value.toLowerCase() === String(value));
      if (!exists) {
        throw new Error(`Option value "${value}" not found in wplanguage select`);
      }

      s.value = String(value);
      s.dispatchEvent(new Event('input', { bubbles: true }));
      s.dispatchEvent(new Event('change', { bubbles: true }));
    }, prefix);
  }

  async expectPreferencesIsVisible(): Promise<void> {
    await expect(this.page).toHaveURL(/Special:Preferences/i);
  }

  async expectInterfaceLanguage(expected: 'en' | 'ru'): Promise<void> {
    await expect(this.elements.languageSelect).toHaveValue(expected);
  }

  async expectLocalizedTitle(expectedLang: 'en' | 'ru'): Promise<void> {
    const expectedTitle = expectedLang === 'ru' ? /Настройки/i : /Preferences/i;
    await expect(this.elements.pageTitle).toHaveText(expectedTitle);
  }
}

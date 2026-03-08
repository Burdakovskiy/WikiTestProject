import { expect, Page } from '@playwright/test';

export class MainPage {
  constructor(private readonly page: Page) {}

  async goToPreferences(): Promise<void> {
    await this.page.goto('/wiki/Special:Preferences');
  }

  async mainPageIsVisible(): Promise<void> {
    await expect(this.page).toHaveURL(/Main_Page/i);
  }
}

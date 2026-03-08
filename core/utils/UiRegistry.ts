import { Page } from '@playwright/test';
import { UI_KEYS } from '../config/uiKeys';
import { LoginPage } from '../ui/pages/Login.page';
import { MainPage } from '../ui/pages/Main.page';
import { PreferencesPage } from '../ui/pages/Preferences.page';

export type UiDeps = {
  page: Page;
};

type UiKey = (typeof UI_KEYS)[keyof typeof UI_KEYS];

export class UiRegistry {
  private cache = new Map<UiKey, unknown>();

  constructor(private deps: UiDeps) {}

  private getOrCreate<T>(key: UiKey, factory: () => T): T {
    const cached = this.cache.get(key);
    if (cached) return cached as T;

    const created = factory();
    this.cache.set(key, created);
    return created;
  }

  login(): LoginPage {
    return this.getOrCreate(UI_KEYS.login, () => new LoginPage(this.deps.page));
  }

  preferences(): PreferencesPage {
    return this.getOrCreate(UI_KEYS.preferences, () => new PreferencesPage(this.deps.page));
  }

  main(): MainPage {
    return this.getOrCreate(UI_KEYS.main, () => new MainPage(this.deps.page));
  }
}

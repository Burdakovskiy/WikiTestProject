import { Page } from '@playwright/test';
import { UiRegistry } from '../utils/UiRegistry';

export interface TestContext {
  page: Page;
  uiRegistry: UiRegistry;
}

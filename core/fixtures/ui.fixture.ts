import { test as base, expect } from '@playwright/test';
import type { TestContext } from './types';
import { UiRegistry } from '../utils/UiRegistry';

type Fixtures = {
  ctx: TestContext;
};

export const test = base.extend<Fixtures>({
  ctx: async ({ page }, use) => {
    const uiRegistry = new UiRegistry({ page });
    const ctx: TestContext = {
      page,
      uiRegistry,
    };
    await use(ctx);
  },
});

export { expect };

import { test, expect } from '../core/fixtures/ui.fixture';
import { ChangeInterfaceLangFlow } from '../core/flows/preferences/ChangeInterfaceLang.flow';
import type { UserCredentials } from '../core/data/UserCredentials';

test.describe('Technical task tests', () => {
  test('POSITIVE: authorized user changes language from Eng to Rus', async ({ ctx }) => {
    const username = process.env.WIKI_USERNAME;
    const password = process.env.WIKI_PASSWORD;

    expect(username, 'WIKI_USERNAME must be set').toBeTruthy();
    expect(password, 'WIKI_PASSWORD must be set').toBeTruthy();

    const credentials: UserCredentials = {
      username: process.env.WIKI_USERNAME!,
      password: process.env.WIKI_PASSWORD!,
    };

    await ChangeInterfaceLangFlow.run(ctx, credentials);

    const preferences = ctx.uiRegistry.preferences();
    await preferences.expectInterfaceLanguage('ru');
    await preferences.expectLocalizedTitle('ru');
  });

  test('NEGATIVE: login fails with invalid password', async ({ ctx }) => {
    const login = ctx.uiRegistry.login();

    const username = process.env.WIKI_USERNAME;
    expect(username, 'WIKI_USERNAME must be set').toBeTruthy();

    await login.open();
    await login.loginPageIsVisible();
    await login.expectLoginFormVisible();

    await login.login(username!, 'wrong_password_123');

    await login.expectIsOnLoginPage();
    await login.expectLoginErrorVisible();
  });

  test('NEGATIVE: unauthorized user opens Preferences', async ({ ctx }) => {
    const login = ctx.uiRegistry.login();
    const page = ctx.page;

    await page.goto('/wiki/Special:Preferences', {
      waitUntil: 'commit',
      timeout: 60_000,
    });

    await login.expectIsOnLoginPage();
    await login.loginPageIsVisible();
    await login.expectPreferencesLoginWarningVisible();
  });
});

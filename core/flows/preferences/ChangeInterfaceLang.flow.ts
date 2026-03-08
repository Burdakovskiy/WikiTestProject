import type { UserCredentials } from '../../data/UserCredentials';
import type { TestContext } from '../../fixtures/types';
import { LoginUserFlow } from '../auth/LoginUser.flow';

export class ChangeInterfaceLangFlow {
  static async run(ctx: TestContext, credentials: UserCredentials): Promise<void> {
    const main = ctx.uiRegistry.main();
    const preferences = ctx.uiRegistry.preferences();

    await LoginUserFlow.run(ctx, credentials);

    await main.goToPreferences();

    await preferences.expectPreferencesIsVisible();
    await preferences.ensureBaseLanguageIsEn();
    await preferences.expectLocalizedTitle('en');
    await preferences.setInterfaceLanguageAndSave('ru');
  }
}

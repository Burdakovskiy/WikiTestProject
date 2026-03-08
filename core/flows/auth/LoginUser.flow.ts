import type { UserCredentials } from '../../data/UserCredentials';
import type { TestContext } from '../../fixtures/types';

export class LoginUserFlow {
  static async run(ctx: TestContext, credentials: UserCredentials): Promise<void> {
    const login = ctx.uiRegistry.login();
    const main = ctx.uiRegistry.main();

    await login.open();

    await login.loginPageIsVisible();
    await login.expectLoginFormVisible();

    await login.login(credentials.username, credentials.password);

    console.log('After login URL:', ctx.page.url());
    const bodyText = await ctx.page.locator('body').innerText();
    console.log('Body contains CAPTCHA:', /captcha/i.test(bodyText));
    console.log(
      'Body contains incorrect password:',
      /incorrect username or password/i.test(bodyText),
    );
  }
}

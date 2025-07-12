import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
    readonly page: Page;
    readonly baseURL: string;

    constructor(page: Page, baseURL = 'http://localhost:4173') {
        this.page = page;
        this.baseURL = baseURL;
    }

    async goto(path: string = '') {
        await this.page.goto(`${this.baseURL}${path}`);
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }

    async waitForElement(selector: string, options: { timeout?: number } = {}) {
        return await this.page.waitForSelector(selector, options);
    }

    async clickButton(text: string) {
        await this.page.click(`button:has-text("${text}")`);
    }

    async fillInput(selector: string, value: string) {
        await this.page.fill(selector, value);
    }

    async selectOption(selector: string, value: string) {
        await this.page.selectOption(selector, value);
    }

    async getTextContent(selector: string): Promise<string> {
        const element = await this.page.locator(selector);
        return (await element.textContent()) || '';
    }

    async waitForURL(urlPattern: RegExp | string) {
        await this.page.waitForURL(urlPattern);
    }

    async expectElementVisible(selector: string) {
        await expect(this.page.locator(selector)).toBeVisible();
    }

    async expectElementHidden(selector: string) {
        await expect(this.page.locator(selector)).toBeHidden();
    }

    async expectTextContent(selector: string, expectedText: string) {
        await expect(this.page.locator(selector)).toContainText(expectedText);
    }

    async takeScreenshot(name: string) {
        await this.page.screenshot({ path: `test-results/screenshots/${name}.png` });
    }

    async scrollToBottom() {
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    }

    async scrollToTop() {
        await this.page.evaluate(() => window.scrollTo(0, 0));
    }

    async isElementVisible(selector: string): Promise<boolean> {
        try {
            const element = this.page.locator(selector);
            return await element.isVisible();
        } catch {
            return false;
        }
    }

    async waitForResponse(urlPattern: RegExp | string) {
        return await this.page.waitForResponse(urlPattern);
    }

    async interceptApiCall(url: string, response: any) {
        await this.page.route(url, (route) => {
            route.fulfill({
                contentType: 'application/json',
                body: JSON.stringify(response),
            });
        });
    }

    async mockSupabaseAuth(isAuthenticated: boolean = true) {
        if (isAuthenticated) {
            await this.page.addInitScript(() => {
                // Mock authenticated state
                window.localStorage.setItem('supabase.auth.token', 'mock-token');
                window.localStorage.setItem(
                    'supabase.auth.user',
                    JSON.stringify({
                        id: 'test-user-id',
                        email: 'test@example.com',
                        user_metadata: { name: 'Test User' },
                    })
                );
            });
        } else {
            await this.page.addInitScript(() => {
                // Mock unauthenticated state
                window.localStorage.removeItem('supabase.auth.token');
                window.localStorage.removeItem('supabase.auth.user');
            });
        }
    }
}
import { test, expect } from '@playwright/test';
import { HomePage } from './pages/homepage.page';

test.describe('Homepage Tests', () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.visitHomePage();
    });

    test('should display hero section correctly', async () => {
        await homePage.expectHeroSectionVisible();
        await homePage.expectNavigationMenuVisible();
    });

    test('should navigate to pricing page', async () => {
        await homePage.navigateToPricing();
        await expect(homePage.page.locator('h1')).toContainText('Pricing');
    });

    test('should navigate to contact page', async () => {
        await homePage.navigateToContact();
        await expect(homePage.page.locator('h1')).toContainText('Contact');
    });

    test('should display features section', async () => {
        await homePage.expectFeaturesVisible();
    });

    test('should have proper SEO elements', async () => {
        await homePage.expectSeoElements();
    });

    test('should display footer', async () => {
        await homePage.expectFooterVisible();
    });

    test('should be responsive on mobile devices', async () => {
        await homePage.expectResponsiveDesign();
    });

    test('should have accessible navigation', async ({ page }) => {
        // Test keyboard navigation
        await page.keyboard.press('Tab');
        await expect(page.locator(':focus')).toBeVisible();

        // Test ARIA labels
        const nav = page.locator('nav');
        await expect(nav).toHaveAttribute('aria-label', /.+/);
    });

    test('should load without JavaScript errors', async ({ page }) => {
        const errors: string[] = [];

        page.on('pageerror', (error) => {
            errors.push(error.message);
        });

        await homePage.visitHomePage();

        // Allow some time for any JS errors to occur
        await page.waitForTimeout(2000);

        expect(errors).toHaveLength(0);
    });

    test('should have fast loading times', async ({ page }) => {
        const startTime = Date.now();
        await homePage.visitHomePage();
        const loadTime = Date.now() - startTime;

        // Should load within 5 seconds
        expect(loadTime).toBeLessThan(5000);
    });
});

test.describe('Marketing Pages Flow', () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
    });

    test('should complete full marketing flow', async () => {
        // Visit homepage
        await homePage.visitHomePage();
        await homePage.expectHeroSectionVisible();

        // Navigate to pricing
        await homePage.navigateToPricing();
        await expect(homePage.page.locator('h1')).toContainText('Pricing');

        // Navigate to contact
        await homePage.navigateToContact();
        await expect(homePage.page.locator('h1')).toContainText('Contact');

        // Return to homepage
        await homePage.visitHomePage();
        await homePage.expectHeroSectionVisible();
    });

    test('should handle CTA button clicks', async ({ page }) => {
        await homePage.visitHomePage();

        // Mock authentication redirect
        await homePage.interceptApiCall('**/auth/**', { success: true });

        await homePage.clickCtaButton();
        // Should either redirect to auth or dashboard
        await expect(page.url()).toMatch(/\/(auth|dashboard)/);
    });
});

test.describe('Cross-browser Compatibility', () => {
    test('should work correctly in all browsers', async ({ page, browserName }) => {
        const homePage = new HomePage(page);
        await homePage.visitHomePage();

        // Basic functionality should work in all browsers
        await homePage.expectHeroSectionVisible();
        await homePage.expectNavigationMenuVisible();
        await homePage.expectFooterVisible();

        console.log(`Test passed in ${browserName}`);
    });
});

test.describe('Performance Tests', () => {
    test('should pass Web Vitals thresholds', async ({ page }) => {
        await page.goto('/');

        // Wait for page to fully load
        await page.waitForLoadState('networkidle');

        // Check for basic performance metrics
        const performanceMetrics = await page.evaluate(() => {
            const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            return {
                loadTime: navigation.loadEventEnd - navigation.loadEventStart,
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0
            };
        });

        // Basic performance assertions
        expect(performanceMetrics.loadTime).toBeLessThan(3000);
        expect(performanceMetrics.domContentLoaded).toBeLessThan(2000);
        expect(performanceMetrics.firstPaint).toBeLessThan(1500);
    });
});
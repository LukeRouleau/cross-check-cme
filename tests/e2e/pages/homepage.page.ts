import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
    readonly heroSection: string;
    readonly ctaButton: string;
    readonly navigationMenu: string;
    readonly pricingSection: string;
    readonly featuresSection: string;
    readonly contactForm: string;

    constructor(page: Page) {
        super(page);
        this.heroSection = '[data-testid="hero-section"]';
        this.ctaButton = '[data-testid="cta-button"]';
        this.navigationMenu = '[data-testid="navigation-menu"]';
        this.pricingSection = '[data-testid="pricing-section"]';
        this.featuresSection = '[data-testid="features-section"]';
        this.contactForm = '[data-testid="contact-form"]';
    }

    async visitHomePage() {
        await this.goto('/');
        await this.waitForPageLoad();
    }

    async expectHeroSectionVisible() {
        await expect(this.page.locator('h1')).toBeVisible();
        await expect(this.page.locator('h1')).toContainText('SaaS Kit');
    }

    async expectNavigationMenuVisible() {
        const nav = this.page.locator('nav');
        await expect(nav).toBeVisible();

        // Check for common navigation items
        await expect(this.page.locator('a:has-text("Pricing")')).toBeVisible();
        await expect(this.page.locator('a:has-text("Contact")')).toBeVisible();
    }

    async clickCtaButton() {
        const ctaButton = this.page.locator('button:has-text("Get Started")').first();
        await ctaButton.click();
    }

    async navigateToPricing() {
        await this.page.click('a:has-text("Pricing")');
        await this.waitForURL(/.*\/pricing/);
    }

    async navigateToContact() {
        await this.page.click('a:has-text("Contact")');
        await this.waitForURL(/.*\/contact/);
    }

    async expectFeaturesVisible() {
        // Check for common features that should be displayed
        await expect(this.page.locator('text=User Authentication')).toBeVisible();
        await expect(this.page.locator('text=Billing')).toBeVisible();
        await expect(this.page.locator('text=Dashboard')).toBeVisible();
    }

    async expectResponsiveDesign() {
        // Test mobile menu toggle
        await this.page.setViewportSize({ width: 375, height: 667 });
        await this.page.waitForTimeout(500);

        const mobileMenuToggle = this.page.locator('[data-testid="mobile-menu-toggle"]');
        if (await mobileMenuToggle.isVisible()) {
            await mobileMenuToggle.click();
            await expect(this.page.locator('nav')).toBeVisible();
        }
    }

    async expectSeoElements() {
        // Check for proper SEO elements
        await expect(this.page.locator('title')).toContainText('SaaS Kit');

        const metaDescription = this.page.locator('meta[name="description"]');
        await expect(metaDescription).toHaveAttribute('content', /.+/);
    }

    async scrollToSection(sectionSelector: string) {
        await this.page.locator(sectionSelector).scrollIntoViewIfNeeded();
    }

    async expectFooterVisible() {
        await this.scrollToBottom();
        await expect(this.page.locator('footer')).toBeVisible();
    }
}
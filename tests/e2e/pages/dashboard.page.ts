import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class DashboardPage extends BasePage {
    readonly sidebar: string;
    readonly userProfile: string;
    readonly casesList: string;
    readonly createCaseButton: string;
    readonly settingsLink: string;
    readonly logoutButton: string;

    constructor(page: Page) {
        super(page);
        this.sidebar = '[data-testid="sidebar"]';
        this.userProfile = '[data-testid="user-profile"]';
        this.casesList = '[data-testid="cases-list"]';
        this.createCaseButton = '[data-testid="create-case-button"]';
        this.settingsLink = '[data-testid="settings-link"]';
        this.logoutButton = '[data-testid="logout-button"]';
    }

    async visitDashboard() {
        await this.goto('/dashboard');
        await this.waitForPageLoad();
    }

    async expectDashboardVisible() {
        await expect(this.page.locator('h1')).toContainText('Dashboard');
        await expect(this.page.locator('nav')).toBeVisible();
    }

    async expectSidebarVisible() {
        await expect(this.page.locator('nav')).toBeVisible();
        await expect(this.page.locator('a:has-text("Dashboard")')).toBeVisible();
        await expect(this.page.locator('a:has-text("Settings")')).toBeVisible();
    }

    async expectUserAuthenticated() {
        // Check that user is authenticated by looking for logout button or user menu
        const logoutBtn = this.page.locator('button:has-text("Log out")').first();
        await expect(logoutBtn).toBeVisible();
    }

    async expectCasesListVisible() {
        // Check for cases list or empty state
        const casesList = this.page.locator('[data-testid="cases-list"]');
        const emptyState = this.page.locator('text=No cases found');

        // Either cases list should be visible, or empty state should be shown
        await expect(casesList.or(emptyState)).toBeVisible();
    }

    async createNewCase() {
        const createButton = this.page.locator('button:has-text("Create Case")').first();
        await createButton.click();
        await this.waitForURL(/.*\/case\/[a-zA-Z0-9-]+\/initiate/);
    }

    async navigateToSettings() {
        await this.page.click('a:has-text("Settings")');
        await this.waitForURL(/.*\/settings/);
    }

    async logout() {
        await this.page.click('button:has-text("Log out")');
        await this.waitForURL(/.*\//); // Should redirect to home
    }

    async expectAdminAvailabilityBanner() {
        // Check for admin availability banner
        const banner = this.page.locator('[data-testid="admin-availability-banner"]');
        if (await banner.isVisible()) {
            await expect(banner).toContainText('Admin');
        }
    }

    async expectCaseListItem(caseId: string) {
        const caseItem = this.page.locator(`[data-testid="case-item-${caseId}"]`);
        await expect(caseItem).toBeVisible();
    }

    async clickCaseItem(caseId: string) {
        const caseItem = this.page.locator(`[data-testid="case-item-${caseId}"]`);
        await caseItem.click();
        await this.waitForURL(new RegExp(`.*\/case\/${caseId}`));
    }

    async expectWelcomeMessage() {
        await expect(this.page.locator('text=Welcome')).toBeVisible();
    }

    async expectDashboardStats() {
        // Check for dashboard statistics if they exist
        const statsSection = this.page.locator('[data-testid="dashboard-stats"]');
        if (await statsSection.isVisible()) {
            await expect(statsSection).toBeVisible();
        }
    }
}
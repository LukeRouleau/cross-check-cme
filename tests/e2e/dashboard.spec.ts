import { test, expect } from '@playwright/test';
import { DashboardPage } from './pages/dashboard.page';

test.describe('Dashboard Tests', () => {
    let dashboardPage: DashboardPage;

    test.beforeEach(async ({ page }) => {
        dashboardPage = new DashboardPage(page);

        // Mock authentication for dashboard access
        await dashboardPage.mockSupabaseAuth(true);
        await dashboardPage.visitDashboard();
    });

    test('should display dashboard correctly for authenticated user', async () => {
        await dashboardPage.expectDashboardVisible();
        await dashboardPage.expectSidebarVisible();
        await dashboardPage.expectUserAuthenticated();
    });

    test('should display cases list or empty state', async () => {
        await dashboardPage.expectCasesListVisible();
    });

    test('should allow user to create new case', async ({ page }) => {
        // Mock API responses for case creation
        await dashboardPage.interceptApiCall('**/api/cases', {
            id: 'test-case-123',
            status: 'draft',
            created_at: new Date().toISOString()
        });

        await dashboardPage.createNewCase();
        await expect(page.url()).toMatch(/\/case\/[a-zA-Z0-9-]+\/initiate/);
    });

    test('should navigate to settings', async () => {
        await dashboardPage.navigateToSettings();
        await expect(dashboardPage.page.locator('h1')).toContainText('Settings');
    });

    test('should allow user to logout', async ({ page }) => {
        await dashboardPage.logout();
        await expect(page.url()).toMatch(/\/$/);
    });

    test('should display admin availability banner when applicable', async () => {
        await dashboardPage.expectAdminAvailabilityBanner();
    });

    test('should display welcome message', async () => {
        await dashboardPage.expectWelcomeMessage();
    });
});

test.describe('Dashboard Navigation', () => {
    let dashboardPage: DashboardPage;

    test.beforeEach(async ({ page }) => {
        dashboardPage = new DashboardPage(page);
        await dashboardPage.mockSupabaseAuth(true);
        await dashboardPage.visitDashboard();
    });

    test('should navigate between dashboard sections', async ({ page }) => {
        // Test navigation to settings
        await dashboardPage.navigateToSettings();
        await expect(page.url()).toMatch(/\/settings/);

        // Navigate back to dashboard
        await page.click('a:has-text("Dashboard")');
        await expect(page.url()).toMatch(/\/dashboard/);
    });

    test('should maintain authentication state during navigation', async ({ page }) => {
        // Navigate to different sections and ensure user remains authenticated
        await dashboardPage.navigateToSettings();
        await dashboardPage.expectUserAuthenticated();

        await page.click('a:has-text("Dashboard")');
        await dashboardPage.expectUserAuthenticated();
    });
});

test.describe('Case Management', () => {
    let dashboardPage: DashboardPage;

    test.beforeEach(async ({ page }) => {
        dashboardPage = new DashboardPage(page);
        await dashboardPage.mockSupabaseAuth(true);
        await dashboardPage.visitDashboard();
    });

    test('should display existing cases', async () => {
        // Mock cases data
        await dashboardPage.interceptApiCall('**/api/cases', [
            {
                id: 'case-1',
                status: 'draft',
                created_at: '2024-01-01T00:00:00Z'
            },
            {
                id: 'case-2',
                status: 'submitted',
                created_at: '2024-01-02T00:00:00Z'
            }
        ]);

        await dashboardPage.visitDashboard();
        await dashboardPage.expectCasesListVisible();
    });

    test('should allow clicking on case items', async ({ page }) => {
        const caseId = 'test-case-123';

        // Mock case data
        await dashboardPage.interceptApiCall(`**/api/cases/${caseId}`, {
            id: caseId,
            status: 'draft',
            created_at: '2024-01-01T00:00:00Z'
        });

        await dashboardPage.clickCaseItem(caseId);
        await expect(page.url()).toMatch(new RegExp(`/case/${caseId}`));
    });
});

test.describe('Authentication Integration', () => {
    test('should redirect unauthenticated users', async ({ page }) => {
        const dashboardPage = new DashboardPage(page);

        // Mock unauthenticated state
        await dashboardPage.mockSupabaseAuth(false);
        await dashboardPage.visitDashboard();

        // Should redirect to login or home
        await expect(page.url()).toMatch(/\/(auth|login|$)/);
    });

    test('should handle auth state changes', async ({ page }) => {
        const dashboardPage = new DashboardPage(page);

        // Start unauthenticated
        await dashboardPage.mockSupabaseAuth(false);
        await dashboardPage.visitDashboard();

        // Simulate authentication
        await dashboardPage.mockSupabaseAuth(true);
        await dashboardPage.visitDashboard();

        await dashboardPage.expectDashboardVisible();
    });
});

test.describe('Error Handling', () => {
    let dashboardPage: DashboardPage;

    test.beforeEach(async ({ page }) => {
        dashboardPage = new DashboardPage(page);
        await dashboardPage.mockSupabaseAuth(true);
    });

    test('should handle API errors gracefully', async ({ page }) => {
        // Mock API error
        await page.route('**/api/cases', (route) => {
            route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ error: 'Internal Server Error' })
            });
        });

        await dashboardPage.visitDashboard();

        // Should show error message or empty state
        await expect(page.locator('text=Error').or(page.locator('text=No cases found'))).toBeVisible();
    });

    test('should handle network errors', async ({ page }) => {
        // Simulate network failure
        await page.route('**/api/cases', (route) => {
            route.abort();
        });

        await dashboardPage.visitDashboard();

        // Should handle gracefully
        await expect(page.locator('text=Error').or(page.locator('text=No cases found'))).toBeVisible();
    });
});

test.describe('Responsive Design', () => {
    test('should work on mobile devices', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });

        const dashboardPage = new DashboardPage(page);
        await dashboardPage.mockSupabaseAuth(true);
        await dashboardPage.visitDashboard();

        await dashboardPage.expectDashboardVisible();
        await dashboardPage.expectSidebarVisible();
    });

    test('should work on tablet devices', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });

        const dashboardPage = new DashboardPage(page);
        await dashboardPage.mockSupabaseAuth(true);
        await dashboardPage.visitDashboard();

        await dashboardPage.expectDashboardVisible();
        await dashboardPage.expectSidebarVisible();
    });
});
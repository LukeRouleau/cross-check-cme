# Testing Framework Documentation

This document provides comprehensive guidance on the testing framework for the SaaS Kit, including how to run tests, extend coverage, and contribute new test cases.

## Overview

The SaaS Kit uses a multi-layered testing approach:

- **Unit Tests**: Fast, isolated tests using Vitest
- **E2E Tests**: End-to-end browser testing with Playwright
- **API Tests**: Backend API testing with Playwright's request functionality  
- **Visual Regression Tests**: Screenshot comparison testing
- **Accessibility Tests**: WCAG compliance testing
- **Performance Tests**: Core Web Vitals and performance metrics

## Quick Start

### Running Tests Locally

```bash
# Install dependencies
npm install

# Run all tests
npm run test:all

# Run only unit tests
npm run test:unit

# Run only E2E tests  
npm run test:e2e

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run E2E tests with UI
npm run test:e2e:ui

# Debug E2E tests
npm run test:e2e:debug
```

### Test Structure

```
tests/
├── e2e/                    # End-to-end tests
│   ├── pages/             # Page Object Model classes
│   ├── fixtures/          # Test data and fixtures
│   ├── utils/             # Testing utilities
│   ├── homepage.spec.ts   # Homepage tests
│   ├── dashboard.spec.ts  # Dashboard tests
│   └── api.spec.ts        # API tests
├── visual/                # Visual regression tests
├── accessibility/         # Accessibility tests
├── performance/          # Performance tests
└── unit/                 # Unit tests (alongside source files)
```

## Test Categories

### 1. Unit Tests

**Location**: `src/**/*.test.ts`  
**Framework**: Vitest  
**Purpose**: Test individual functions, components, and utilities

```typescript
// Example unit test
import { describe, it, expect } from 'vitest';
import { calculateTotal } from './utils';

describe('calculateTotal', () => {
  it('should calculate total correctly', () => {
    expect(calculateTotal([10, 20, 30])).toBe(60);
  });
});
```

### 2. E2E Tests

**Location**: `tests/e2e/`  
**Framework**: Playwright  
**Purpose**: Test complete user flows and interactions

```typescript
// Example E2E test
import { test, expect } from '@playwright/test';
import { HomePage } from './pages/homepage.page';

test('should complete user registration flow', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.visitHomePage();
  await homePage.clickCtaButton();
  
  // Continue testing the flow...
});
```

### 3. API Tests

**Location**: `tests/e2e/api.spec.ts`  
**Framework**: Playwright Request API  
**Purpose**: Test backend API endpoints directly

```typescript
// Example API test
test('should create new case', async ({ request }) => {
  const response = await request.post('/api/cases', {
    headers: { 'Authorization': 'Bearer token' },
    data: { title: 'Test Case' }
  });
  
  expect(response.status()).toBe(201);
});
```

## Page Object Model

We use the Page Object Model pattern for maintainable E2E tests:

```typescript
// pages/homepage.page.ts
export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async visitHomePage() {
    await this.goto('/');
    await this.waitForPageLoad();
  }

  async expectHeroSectionVisible() {
    await expect(this.page.locator('h1')).toBeVisible();
  }
}
```

## Test Data Management

### Fixtures

Use fixtures for consistent test data:

```typescript
// fixtures/user.fixtures.ts
export const testUsers = {
  validUser: {
    email: 'test@example.com',
    password: 'password123'
  },
  adminUser: {
    email: 'admin@example.com',
    password: 'admin123'
  }
};
```

### Environment Variables

Test environment variables are configured in:
- `.github/workflows/tests.yml` for CI
- Local `.env.test` file for local development

## Authentication Testing

### Mocking Supabase Auth

```typescript
// Mock authenticated state
await page.addInitScript(() => {
  window.localStorage.setItem('supabase.auth.token', 'mock-token');
});

// Mock unauthenticated state
await page.addInitScript(() => {
  window.localStorage.removeItem('supabase.auth.token');
});
```

### Using Test Utilities

```typescript
import { DashboardPage } from './pages/dashboard.page';

test('dashboard test', async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.mockSupabaseAuth(true);
  await dashboardPage.visitDashboard();
});
```

## Visual Regression Testing

Visual tests capture screenshots and compare them to baseline images:

```typescript
// Visual regression test
test('homepage visual regression', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png');
});
```

To update visual baselines:
```bash
npx playwright test --update-snapshots
```

## Accessibility Testing

Accessibility tests ensure WCAG compliance:

```typescript
// Accessibility test
test('homepage accessibility', async ({ page }) => {
  await page.goto('/');
  
  // Test keyboard navigation
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toBeVisible();
  
  // Test ARIA labels
  await expect(page.locator('nav')).toHaveAttribute('aria-label', /.+/);
});
```

## Performance Testing

Performance tests measure Core Web Vitals:

```typescript
// Performance test
test('homepage performance', async ({ page }) => {
  await page.goto('/');
  
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    return {
      loadTime: navigation.loadEventEnd - navigation.loadEventStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
    };
  });
  
  expect(metrics.loadTime).toBeLessThan(3000);
});
```

## CI/CD Integration

### GitHub Actions

Tests run automatically on:
- Pull requests
- Pushes to main branch
- Manual workflow dispatch

### Test Reports

- Unit test coverage reports uploaded to Codecov
- E2E test reports available as GitHub Actions artifacts
- Visual regression differences shown in PR comments

## Extending Test Coverage

### Adding New Tests

1. **Identify the Feature**: Determine what needs testing
2. **Choose Test Type**: Unit, E2E, API, Visual, etc.
3. **Create Test File**: Follow naming conventions
4. **Write Test Cases**: Cover happy path, edge cases, and error conditions
5. **Update Documentation**: Document new test patterns

### Test Coverage Goals

- **Unit Tests**: 80%+ code coverage
- **E2E Tests**: All critical user flows
- **API Tests**: All public endpoints
- **Visual Tests**: Key pages and components
- **Accessibility**: WCAG AA compliance

### Common Test Patterns

#### Testing Forms

```typescript
test('contact form submission', async ({ page }) => {
  await page.goto('/contact');
  
  // Fill form
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="message"]', 'Test message');
  
  // Submit and verify
  await page.click('button[type="submit"]');
  await expect(page.locator('.success-message')).toBeVisible();
});
```

#### Testing Authentication Flows

```typescript
test('login flow', async ({ page }) => {
  await page.goto('/login');
  
  // Mock successful authentication
  await page.route('**/auth/login', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ success: true })
    });
  });
  
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');
  
  await expect(page.url()).toMatch(/\/dashboard/);
});
```

#### Testing API Endpoints

```typescript
test('API error handling', async ({ request }) => {
  const response = await request.get('/api/cases/invalid-id');
  expect(response.status()).toBe(404);
  
  const body = await response.json();
  expect(body.error).toBeDefined();
});
```

## Best Practices

### Test Organization

1. **Group Related Tests**: Use `describe` blocks
2. **Clear Test Names**: Describe what the test does
3. **Setup/Teardown**: Use `beforeEach`/`afterEach`
4. **Isolated Tests**: Each test should be independent

### Performance

1. **Parallel Execution**: Tests run in parallel by default
2. **Selective Testing**: Use `test.only` for debugging
3. **Efficient Selectors**: Use data-testid attributes
4. **Minimize Waits**: Use specific wait conditions

### Maintainability

1. **Page Object Model**: Encapsulate page interactions
2. **Shared Utilities**: Common functions in utils/
3. **Consistent Patterns**: Follow established conventions
4. **Documentation**: Keep docs up to date

## Troubleshooting

### Common Issues

1. **Flaky Tests**: Add proper waits and retries
2. **Slow Tests**: Optimize selectors and reduce timeouts
3. **CI Failures**: Check environment variables and dependencies
4. **Visual Differences**: Review and update snapshots

### Debugging

```bash
# Run tests in headed mode
npm run test:e2e:headed

# Debug specific test
npm run test:e2e:debug -- --grep "specific test"

# Generate test code
npm run test:e2e:codegen
```

## Contributing

1. **Write Tests First**: TDD approach encouraged
2. **Follow Conventions**: Use existing patterns
3. **Test Coverage**: Maintain or improve coverage
4. **Documentation**: Update docs for new patterns
5. **Review Process**: All tests reviewed in PRs

## Resources

- [Playwright Documentation](https://playwright.dev/docs)
- [Vitest Documentation](https://vitest.dev/guide/)
- [Testing Library Guidelines](https://testing-library.com/docs/guiding-principles)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Test Coverage Metrics

Current coverage goals:
- Unit Tests: 80%+ statement coverage
- E2E Tests: 100% of critical user paths
- API Tests: 100% of public endpoints
- Visual Tests: All major UI components
- Accessibility: WCAG AA compliance

Monitor coverage with:
```bash
npm run test:coverage
```

View detailed coverage reports in `coverage/` directory after running tests.
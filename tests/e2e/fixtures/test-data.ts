/**
 * Test data and fixtures for E2E tests
 */

export const testUsers = {
    validUser: {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
    },
    adminUser: {
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Admin User'
    },
    invalidUser: {
        email: 'invalid@example.com',
        password: 'wrongpassword'
    }
};

export const testCases = {
    draftCase: {
        id: 'case-draft-123',
        title: 'Draft Test Case',
        description: 'This is a draft test case',
        status: 'draft',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    submittedCase: {
        id: 'case-submitted-456',
        title: 'Submitted Test Case',
        description: 'This is a submitted test case',
        status: 'submitted',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z'
    },
    completedCase: {
        id: 'case-completed-789',
        title: 'Completed Test Case',
        description: 'This is a completed test case',
        status: 'completed',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-03T00:00:00Z'
    }
};

export const testDocuments = {
    validPdf: {
        id: 'doc-pdf-123',
        filename: 'test-document.pdf',
        size: 1024 * 1024, // 1MB
        type: 'application/pdf',
        content: Buffer.from('Test PDF content')
    },
    validImage: {
        id: 'doc-image-456',
        filename: 'test-image.jpg',
        size: 512 * 1024, // 512KB
        type: 'image/jpeg',
        content: Buffer.from('Test image content')
    },
    invalidFile: {
        id: 'doc-invalid-789',
        filename: 'malware.exe',
        size: 2048,
        type: 'application/x-msdownload',
        content: Buffer.from('Malicious content')
    },
    oversizedFile: {
        id: 'doc-large-999',
        filename: 'large-file.pdf',
        size: 10 * 1024 * 1024, // 10MB
        type: 'application/pdf',
        content: Buffer.alloc(10 * 1024 * 1024, 'x')
    }
};

export const testApiResponses = {
    successfulLogin: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        user: {
            id: 'user-123',
            email: 'test@example.com',
            name: 'Test User'
        }
    },
    unauthorizedError: {
        error: 'Unauthorized',
        message: 'Invalid credentials'
    },
    validationError: {
        error: 'Validation Error',
        message: 'Required fields are missing',
        details: {
            email: 'Email is required',
            password: 'Password must be at least 8 characters'
        }
    },
    serverError: {
        error: 'Internal Server Error',
        message: 'Something went wrong'
    }
};

export const testStripeData = {
    successfulPayment: {
        id: 'pi_test_123',
        amount: 2000,
        currency: 'usd',
        status: 'succeeded',
        customer: 'cus_test_123'
    },
    failedPayment: {
        id: 'pi_test_456',
        amount: 2000,
        currency: 'usd',
        status: 'failed',
        last_payment_error: {
            code: 'card_declined',
            message: 'Your card was declined.'
        }
    },
    subscription: {
        id: 'sub_test_123',
        status: 'active',
        current_period_end: Math.floor(Date.now() / 1000) + 86400 * 30,
        plan: {
            id: 'plan_test_123',
            amount: 2000,
            currency: 'usd',
            interval: 'month'
        }
    }
};

export const testEmailData = {
    validContact: {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Contact',
        message: 'This is a test contact message'
    },
    invalidEmail: {
        name: 'Jane Doe',
        email: 'invalid-email',
        subject: 'Test Contact',
        message: 'This is a test contact message'
    },
    emptyForm: {
        name: '',
        email: '',
        subject: '',
        message: ''
    }
};

export const testUrlPatterns = {
    homepage: /^https?:\/\/[^\/]+\/$/,
    dashboard: /^https?:\/\/[^\/]+\/dashboard$/,
    login: /^https?:\/\/[^\/]+\/(auth|login)/,
    pricing: /^https?:\/\/[^\/]+\/pricing$/,
    contact: /^https?:\/\/[^\/]+\/contact$/,
    settings: /^https?:\/\/[^\/]+\/settings/,
    caseDetail: /^https?:\/\/[^\/]+\/case\/[a-zA-Z0-9-]+$/,
    caseInitiate: /^https?:\/\/[^\/]+\/case\/[a-zA-Z0-9-]+\/initiate$/
};

export const testSelectors = {
    // Common selectors
    navigation: {
        mainNav: 'nav[role="navigation"]',
        mobileMenuToggle: '[data-testid="mobile-menu-toggle"]',
        logoLink: 'a[href="/"]',
        dashboardLink: 'a[href="/dashboard"]',
        settingsLink: 'a[href="/settings"]',
        logoutButton: 'button:has-text("Log out")'
    },

    // Form selectors
    forms: {
        contactForm: '[data-testid="contact-form"]',
        loginForm: '[data-testid="login-form"]',
        settingsForm: '[data-testid="settings-form"]',
        emailInput: 'input[name="email"]',
        passwordInput: 'input[name="password"]',
        submitButton: 'button[type="submit"]'
    },

    // Dashboard selectors
    dashboard: {
        welcomeMessage: '[data-testid="welcome-message"]',
        casesList: '[data-testid="cases-list"]',
        createCaseButton: '[data-testid="create-case-button"]',
        adminBanner: '[data-testid="admin-availability-banner"]',
        emptyState: '[data-testid="empty-state"]'
    },

    // Marketing page selectors
    marketing: {
        hero: '[data-testid="hero-section"]',
        features: '[data-testid="features-section"]',
        pricing: '[data-testid="pricing-section"]',
        testimonials: '[data-testid="testimonials-section"]',
        footer: 'footer'
    }
};

export const testTimeouts = {
    short: 2000,
    medium: 5000,
    long: 10000,
    navigation: 30000
};

export const testViewports = {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1440, height: 900 },
    largeDesktop: { width: 1920, height: 1080 }
};

export const testEnvironments = {
    development: {
        baseURL: 'http://localhost:5173',
        apiURL: 'http://localhost:5173/api'
    },
    test: {
        baseURL: 'http://localhost:4173',
        apiURL: 'http://localhost:4173/api'
    },
    staging: {
        baseURL: 'https://staging.example.com',
        apiURL: 'https://staging.example.com/api'
    }
};

/**
 * Generate test data with random values
 */
export const generateTestData = {
    user: () => ({
        email: `test-${Date.now()}@example.com`,
        password: 'password123',
        name: `Test User ${Date.now()}`
    }),

    case: () => ({
        id: `case-${Date.now()}`,
        title: `Test Case ${Date.now()}`,
        description: `Generated test case description ${Date.now()}`,
        status: 'draft',
        created_at: new Date().toISOString()
    }),

    document: () => ({
        id: `doc-${Date.now()}`,
        filename: `test-document-${Date.now()}.pdf`,
        size: Math.floor(Math.random() * 1024 * 1024),
        type: 'application/pdf'
    })
};

/**
 * Common test utilities
 */
export const testUtils = {
    // Generate random string
    randomString: (length: number = 10) => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },

    // Generate random email
    randomEmail: () => `test-${Date.now()}-${Math.random().toString(36).substr(2, 5)}@example.com`,

    // Wait for specific duration
    wait: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

    // Format date for tests
    formatDate: (date: Date) => date.toISOString().split('T')[0],

    // Generate mock UUID
    mockUUID: () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
};
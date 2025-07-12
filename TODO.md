# Cross-Check CME Portal - Development TODO

## Overview
This TODO list tracks the progress of developing a user portal for a consulting business where clients (lawyers) can submit "cases" (critiques of comprehensive medical exams). The portal manages the complete lifecycle from case initiation to admin review and completion.

---

## Phase 1: Core Case Infrastructure & User Dashboard ✅ COMPLETED

### Database Schema & Models
- [x] **Supabase Database Setup**
  - [x] `profiles` table with RLS policies
  - [x] `stripe_customers` table for payment integration
  - [x] `user_products` table for product access tracking
  - [x] `contact_messages` table for general inquiries
  - [x] User signup trigger for automatic profile creation

- [x] **Core Case Management Tables**
  - [x] `cases` table with status enum (draft, submitted, under_review, in_progress, declined, completed)
  - [x] `case_documents` table for file metadata
  - [x] `terms_of_service` table with versioning
  - [x] `user_terms_agreement` table for tracking agreements
  - [x] `admin_settings` table for availability management
  - [x] `case_communications` table for messaging
  - [x] Auto-updating timestamps with triggers

### User Dashboard
- [x] **Dashboard Page (`/dashboard`)**
  - [x] `DashboardPage.svelte` with categorized case display
  - [x] "Create New Case" button with admin availability checks
  - [x] Case sections: Open Cases, In Progress, Case History
  - [x] Case count indicators
  - [x] Loading states and error handling

- [x] **Dashboard Components**
  - [x] `CaseListItem.svelte` - Case summary display with actions
  - [x] `AdminAvailabilityBanner.svelte` - Admin status display
  - [x] Delete functionality for draft cases
  - [x] Confirmation dialogs for destructive actions

### API Endpoints - Basic Case Operations
- [x] **`GET /api/cases`** - Fetch user's cases with proper RLS
- [x] **`POST /api/cases`** - Create new draft case with admin availability validation
- [x] **`DELETE /api/cases/[caseId]`** - Delete draft cases with document cleanup
- [x] **`GET /api/admin/availability`** - Fetch admin availability status

### User Authentication & Security
- [x] Row Level Security (RLS) policies implemented
- [x] User session management with Supabase Auth
- [x] Protected routes and API endpoints
- [x] Service role for admin operations

---

## Phase 2: Case Initiation Flow - Client Side 🔄 IN PROGRESS

### Case Initiation Architecture
- [x] **Initiation Flow Setup**
  - [x] Multi-step wizard architecture (`/case/[caseId]/initiate`)
  - [x] `InitiationStepper.svelte` component for navigation
  - [x] Step state management with persistence
  - [x] Progress tracking and validation
  - [x] Breadcrumb navigation system

### Step 1: Terms of Service ✅ COMPLETED
- [x] **`TermsStep.svelte` Component**
  - [x] Latest terms fetching from API
  - [x] Terms display with scrollable content
  - [x] Agreement checkbox with validation
  - [x] One-way agreement logic (cannot un-agree)
  - [x] Loading states and error handling
  - [x] Success confirmation UI

- [x] **Terms API Endpoints**
  - [x] `GET /api/terms/latest` - Fetch current terms
  - [x] `POST /api/cases/[caseId]/agree-terms` - Save agreement
  - [x] Terms versioning and tracking

### Step 2: File Upload 🔄 PARTIALLY COMPLETE
- [x] **`FileUploadStep.svelte` Component**
  - [x] Drag & drop file upload interface
  - [x] File type and size validation
  - [x] Multiple file selection support
  - [x] Upload progress feedback
  - [x] File listing with metadata display
  - [x] Delete uploaded files functionality

- [x] **File Upload API Structure**
  - [x] `GET /api/cases/[caseId]/documents` - Fetch uploaded documents
  - [x] `POST /api/cases/[caseId]/documents` - Upload file metadata
  - [x] `DELETE /api/cases/[caseId]/documents/[documentId]` - Delete documents
  - [x] File validation and security checks

- [ ] **File Storage Integration** 🚧 NEEDS IMPLEMENTATION
  - [ ] Supabase Storage bucket setup
  - [ ] RLS policies for file access
  - [ ] Actual file upload to storage
  - [ ] File download/preview functionality
  - [ ] Storage path generation and management

### Step 3: Custom Instructions ❌ NOT STARTED
- [ ] **`InstructionsStep.svelte` Component**
  - [ ] Rich text editor or textarea for instructions
  - [ ] Character/word limit validation
  - [ ] Auto-save functionality
  - [ ] Instructions preview
  - [ ] Required field validation

- [ ] **Instructions API**
  - [ ] `PUT /api/cases/[caseId]/instructions` - Save custom instructions
  - [ ] Instructions validation and sanitization

### Step 4: Payment Deposit ❌ NOT STARTED
- [ ] **`PaymentStep.svelte` Component**
  - [ ] Stripe Elements integration
  - [ ] Payment amount display
  - [ ] Payment form validation
  - [ ] Payment processing feedback
  - [ ] Success/failure handling

- [ ] **Payment API & Stripe Integration**
  - [ ] `POST /api/cases/[caseId]/payment` - Process payment
  - [ ] Stripe webhook handling
  - [ ] Payment intent creation
  - [ ] Payment failure handling
  - [ ] Refund capability for declined cases

### Step 5: Review & Submit ❌ NOT STARTED
- [ ] **`ReviewSubmitStep.svelte` Component**
  - [ ] Complete case summary display
  - [ ] Terms agreement confirmation
  - [ ] Uploaded files list
  - [ ] Custom instructions preview
  - [ ] Payment confirmation
  - [ ] Final submission button

- [ ] **Case Submission API**
  - [ ] `POST /api/cases/[caseId]/submit` - Submit case for review
  - [ ] Status change to 'submitted'
  - [ ] Notification trigger for admin
  - [ ] Submission confirmation

### General Case Initiation Features
- [x] **Progress Persistence**
  - [x] `POST /api/cases/[caseId]/set-current-step` - Save current step
  - [x] Resume from last completed step
  - [x] Step completion tracking

- [ ] **Case Initiation Validation**
  - [ ] Comprehensive validation before submission
  - [ ] Error handling and recovery
  - [ ] Data integrity checks

---

## Phase 3: Admin Dashboard & Case Management ❌ NOT STARTED

### Admin Authentication & Access
- [ ] **Admin Role Management**
  - [ ] Admin user identification system
  - [ ] Role-based access control
  - [ ] Admin-specific RLS policies
  - [ ] Admin route protection

### Admin Dashboard
- [ ] **`AdminDashboardPage.svelte`**
  - [ ] Incoming case submissions view
  - [ ] Case status filtering
  - [ ] Case priority/urgency indicators
  - [ ] Admin workload overview
  - [ ] Quick actions for common tasks

### Case Review & Management
- [ ] **`AdminCaseViewPage.svelte`**
  - [ ] Complete case details display
  - [ ] All uploaded documents access
  - [ ] Client instructions review
  - [ ] Payment status verification
  - [ ] Case history timeline

- [ ] **Case Actions**
  - [ ] `POST /api/admin/cases/[caseId]/accept` - Accept case
  - [ ] `POST /api/admin/cases/[caseId]/decline` - Decline with reason
  - [ ] `PUT /api/admin/cases/[caseId]/progress` - Update progress
  - [ ] `POST /api/admin/cases/[caseId]/complete` - Mark complete
  - [ ] Bulk actions for multiple cases

### Admin Settings & Availability
- [ ] **`AdminAvailabilitySettings.svelte`**
  - [ ] Toggle availability on/off
  - [ ] Custom availability messages
  - [ ] Vacation/absence scheduling
  - [ ] Notification preferences

- [ ] **Admin Settings API**
  - [ ] `PUT /api/admin/availability` - Update availability
  - [ ] `GET /api/admin/settings` - Fetch admin preferences
  - [ ] `PUT /api/admin/settings` - Update preferences

---

## Phase 4: Communication & Messaging ❌ NOT STARTED

### Case-Specific Communication
- [ ] **`CaseChatWindow.svelte`**
  - [ ] Real-time messaging interface
  - [ ] Message history display
  - [ ] File attachment support
  - [ ] Message status indicators
  - [ ] Typing indicators

### General Inquiries
- [ ] **`GeneralInquiryForm.svelte`**
  - [ ] Non-case inquiry form
  - [ ] Contact information collection
  - [ ] Inquiry categorization
  - [ ] Submission confirmation

### Admin Message Management
- [ ] **`AdminMessagesView.svelte`**
  - [ ] All conversations overview
  - [ ] Unread message indicators
  - [ ] Message search and filtering
  - [ ] Response templates
  - [ ] Message archiving

### Communication API
- [ ] **Message Management**
  - [ ] `GET /api/communications/[caseId]` - Fetch case messages
  - [ ] `POST /api/communications/[caseId]` - Send message
  - [ ] `GET /api/communications/general` - General inquiries
  - [ ] `POST /api/communications/general` - Submit inquiry
  - [ ] `PUT /api/communications/[messageId]/read` - Mark as read

---

## Phase 5: Notifications & Alerts ❌ NOT STARTED

### Client Notifications
- [ ] **Email Notifications**
  - [ ] Case submission confirmation
  - [ ] Case acceptance/decline notification
  - [ ] Progress updates
  - [ ] Case completion notification
  - [ ] Payment confirmations
  - [ ] Communication alerts

- [ ] **In-App Notifications**
  - [ ] Notification bell/indicator
  - [ ] Notification history
  - [ ] Notification preferences
  - [ ] Push notifications (if applicable)

### Admin Notifications
- [ ] **Multi-Channel Alerts**
  - [ ] Email notifications for new cases
  - [ ] SMS/text notifications
  - [ ] Webhook notifications
  - [ ] Slack/Discord integration options

- [ ] **Notification API**
  - [ ] `GET /api/notifications` - Fetch notifications
  - [ ] `PUT /api/notifications/[notificationId]/read` - Mark as read
  - [ ] `POST /api/notifications/preferences` - Update preferences

---

## Phase 6: Advanced Features & Integrations ❌ NOT STARTED

### File Management & Security
- [ ] **Enhanced File Handling**
  - [ ] File preview functionality
  - [ ] Download with access logging
  - [ ] File encryption at rest
  - [ ] Virus scanning integration
  - [ ] File retention policies

### Payment & Billing
- [ ] **Advanced Payment Features**
  - [ ] Multiple payment methods
  - [ ] Payment history tracking
  - [ ] Automatic refund processing
  - [ ] Payment dispute handling
  - [ ] Billing dashboard

### Analytics & Reporting
- [ ] **Admin Analytics**
  - [ ] Case volume metrics
  - [ ] Response time analytics
  - [ ] Client satisfaction tracking
  - [ ] Revenue reporting
  - [ ] Performance dashboards

### Integration & APIs
- [ ] **External Integrations**
  - [ ] Calendar integration for availability
  - [ ] Document signing integration
  - [ ] Time tracking integration
  - [ ] Third-party notification services

---

## Phase 7: Testing & Quality Assurance ❌ NOT STARTED

### Automated Testing
- [ ] **Unit Tests**
  - [ ] Component testing with Vitest
  - [ ] API endpoint testing
  - [ ] Database function testing
  - [ ] Utility function testing

- [ ] **Integration Tests**
  - [ ] End-to-end user flows
  - [ ] API integration testing
  - [ ] Database migration testing
  - [ ] Payment flow testing

### Manual Testing
- [ ] **User Experience Testing**
  - [ ] Case initiation flow testing
  - [ ] Admin workflow testing
  - [ ] Cross-browser compatibility
  - [ ] Mobile responsiveness
  - [ ] Accessibility compliance

### Performance & Security
- [ ] **Performance Testing**
  - [ ] Load testing
  - [ ] Database query optimization
  - [ ] File upload performance
  - [ ] API response times

- [ ] **Security Testing**
  - [ ] Authentication testing
  - [ ] Authorization testing
  - [ ] Input validation testing
  - [ ] File upload security
  - [ ] SQL injection prevention

---

## Phase 8: Deployment & Production ❌ NOT STARTED

### Production Setup
- [ ] **Environment Configuration**
  - [ ] Production database setup
  - [ ] Environment variable management
  - [ ] Stripe production keys
  - [ ] Email service configuration
  - [ ] File storage production setup

- [ ] **Deployment Pipeline**
  - [ ] CI/CD pipeline setup
  - [ ] Automated testing in pipeline
  - [ ] Database migration automation
  - [ ] Production deployment process
  - [ ] Rollback procedures

### Monitoring & Maintenance
- [ ] **Production Monitoring**
  - [ ] Error tracking and logging
  - [ ] Performance monitoring
  - [ ] Uptime monitoring
  - [ ] Database monitoring
  - [ ] Security monitoring

- [ ] **Documentation & Support**
  - [ ] User documentation
  - [ ] Admin documentation
  - [ ] API documentation
  - [ ] Troubleshooting guides
  - [ ] Support procedures

---

## Current Priority Actions

### Immediate Next Steps (Phase 2 Completion)
1. **Complete File Upload Implementation**
   - Implement Supabase Storage integration
   - Add file download/preview functionality
   - Test file upload security and validation

2. **Build Instructions Step**
   - Create InstructionsStep.svelte component
   - Implement instructions API endpoint
   - Add form validation and auto-save

3. **Implement Payment Step**
   - Integrate Stripe Elements
   - Create payment processing API
   - Add payment confirmation flow

4. **Complete Review & Submit**
   - Build comprehensive review interface
   - Implement case submission API
   - Add submission confirmation

### Critical Technical Debt
- [ ] **File Storage**: Complete Supabase Storage integration
- [ ] **Error Handling**: Comprehensive error handling across all components
- [ ] **Loading States**: Consistent loading states in all UI components
- [ ] **Form Validation**: Robust client and server-side validation
- [ ] **Performance**: Optimize database queries and API responses

### Known Issues & Warnings
- [ ] **Breadcrumb Navigation**: Needs dynamic updates for nested routes
- [ ] **Svelte Check Warning**: Unused `caseId` prop in `TermsStep.svelte`
- [ ] **File Upload**: Placeholder implementation needs real storage
- [ ] **Payment Integration**: Stripe integration not yet implemented
- [ ] **Admin Functionality**: Complete admin system needs to be built

---

## Development Guidelines

### Testing Requirements
- Every new feature must include step-by-step manual testing instructions
- Critical business logic should have unit tests
- User flows should have integration tests
- Security features must be thoroughly tested

### Code Quality Standards
- Use TypeScript for type safety
- Follow established component patterns
- Implement proper error handling
- Add comprehensive logging for debugging
- Maintain consistent UI/UX patterns

### Documentation Updates
- Update this TODO as features are completed
- Document API endpoints and their usage
- Maintain component documentation
- Update deployment and setup instructions
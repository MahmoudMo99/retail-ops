# RetailOps

A modern e-commerce operations dashboard built with Angular, PrimeNG, Chart.js, and Bootstrap.

RetailOps provides a complete admin workspace for managing products, orders, customers, inventory, users, analytics, and application preferences through a responsive and multilingual interface.

## Live Demo

**Live Application:**  
https://retail-ops-sigma.vercel.app

### Demo Account

```text
Username: emilys
Password: emilyspass
```

---

## Overview

RetailOps is a production-style frontend application that demonstrates the architecture and user experience of a modern e-commerce administration system.

The application includes authentication, protected routes, role-based access control, business analytics, inventory monitoring, localization, responsive layouts, theme preferences, global search, operational notifications, and a modular feature-based architecture.

The project was designed to demonstrate practical Angular development patterns rather than being a collection of isolated pages.

---

## Features

### Dashboard

- Business KPI overview
- Revenue trend visualization
- Sales breakdown by category
- Recent orders
- Top-performing products
- Responsive Chart.js visualizations
- Locale-aware number and currency formatting

### Products Management

- Server-side pagination
- Product search
- Category filtering
- Sorting
- Product details
- Add product workflow
- Edit product workflow
- Delete confirmation
- Stock status indicators
- Responsive product table

### Orders Management

- Orders overview
- Customer information
- Search and status filtering
- Order details
- Order item breakdown
- Operational order status updates
- Responsive order table

### Customers

- Customer directory
- Server-side pagination
- Search
- Sorting
- Customer details
- Contact information
- Company information
- Responsive customer table

### Inventory Management

- Inventory KPI overview
- Total product count
- Total inventory units
- Inventory value calculation
- In-stock monitoring
- Low-stock monitoring
- Out-of-stock monitoring
- Product stock visualization
- Stock adjustment workflow
- Inventory filtering

### Analytics

- Revenue overview
- Total orders
- Customer metrics
- Average order value
- Revenue by category
- Top-performing products
- Order status distribution
- Inventory health
- Business insights
- Responsive Chart.js visualizations

### Team & Users

- User directory
- User search
- Server-side pagination
- Sorting
- User details
- Add user workflow
- Edit user workflow
- Delete confirmation
- Role management

### Settings

- Light theme
- Dark theme
- System theme
- English language
- Arabic language
- Account information
- Persistent workspace preferences

---

## Authentication

RetailOps includes a complete frontend authentication flow.

Features include:

- Login workflow
- Access token handling
- Refresh token handling
- Automatic access token refresh
- HTTP authentication interceptor
- Session restoration after page refresh
- Protected application routes
- Guest route protection
- Return URL handling
- Current authenticated user state
- Logout workflow

Authentication state is restored when the application starts before protected routes are rendered.

---

## Role-Based Access Control

RetailOps includes a permission-based RBAC architecture.

Supported roles:

- Admin
- Moderator
- User

Permissions are mapped independently from roles and control access to application areas.

Examples include:

```text
dashboard.view
products.view
products.manage
orders.view
orders.manage
inventory.view
inventory.adjust
analytics.view
users.view
users.manage
settings.view
```

The application uses permission guards to protect routes and also hides inaccessible navigation items from the sidebar.

Unauthorized access is redirected to a dedicated `403 Forbidden` page.

In a real production environment, these frontend permissions would be complemented by server-side authorization.

---

## Global Search

RetailOps includes a global command palette for fast workspace navigation.

Open it using:

```text
Ctrl + K
```

Features include:

- Search across application pages
- Keyboard navigation
- Arrow key navigation
- Enter to open
- Escape to close
- Permission-aware results
- English and Arabic search support

---

## Operational Notifications

The notification center generates operational inventory alerts based on product stock data.

Notifications include:

- Low-stock alerts
- Out-of-stock alerts
- Read/unread state
- Unread notification indicator
- Mark all as read
- Direct navigation to inventory

The notifications are derived from API product data rather than being static UI placeholders.

---

## Internationalization

RetailOps supports two complete interface languages:

- English
- Arabic

The application uses `ngx-translate` for localization.

Language switching automatically updates:

- Application text
- Layout direction
- Typography
- Number formatting
- Currency formatting
- Date formatting
- Chart labels
- Chart tooltips

Direction support:

```text
English → LTR
Arabic  → RTL
```

Typography:

```text
English → Inter
Arabic  → IBM Plex Sans Arabic
```

---

## Theme System

RetailOps includes three appearance modes:

- Light
- Dark
- System

Theme preferences are persisted locally.

When `System` is selected, the application automatically reacts to operating-system theme changes without requiring a page refresh.

---

## Responsive Design

RetailOps is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile

Responsive behavior includes:

- Adaptive application shell
- Mobile sidebar
- Navigation overlay
- Responsive topbar
- Responsive tables
- Responsive dialogs
- Adaptive dashboard layouts
- Responsive charts
- RTL-aware responsive behavior

---

## Tech Stack

### Core

- Angular 22
- TypeScript
- RxJS
- SCSS

### UI

- PrimeNG
- PrimeIcons
- Bootstrap 5

### Data Visualization

- Chart.js

### Internationalization

- ngx-translate

### Typography

- Inter
- IBM Plex Sans Arabic

### API

- DummyJSON REST API

### Deployment

- Vercel

---

## Architecture

RetailOps follows a feature-based Angular architecture.

```text
src/app/
├── core/
│   ├── auth/
│   ├── guards/
│   ├── interceptors/
│   ├── models/
│   └── services/
│
├── shared/
│
├── layout/
│   ├── main-layout/
│   ├── sidebar/
│   ├── topbar/
│   ├── global-search/
│   └── notification-center/
│
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── products/
│   ├── orders/
│   ├── customers/
│   ├── inventory/
│   ├── analytics/
│   ├── users/
│   └── settings/
│
├── app.config.ts
└── app.routes.ts
```

### Core Layer

The `core` layer contains application-wide infrastructure such as:

- Authentication
- Authorization
- Route guards
- HTTP interceptors
- Theme management
- Language management
- Locale-aware formatting
- Notifications

### Layout Layer

The layout layer contains the application shell:

- Main layout
- Sidebar
- Topbar
- Global search
- Notification center

### Feature Layer

Each business domain is isolated into its own feature.

This keeps the application modular and makes individual features easier to maintain and extend.

RetailOps uses Angular standalone components and lazy-loaded routes throughout the application.

---

## Routing

Application features are lazy loaded.

Examples:

```text
/dashboard
/products
/orders
/customers
/inventory
/analytics
/users
/settings
```

Protected application routes require authentication.

Permission-sensitive routes additionally use RBAC permission guards.

Scroll restoration is enabled so navigation between pages starts from the top rather than retaining the previous page position.

---

## API and Demo Data

RetailOps uses the DummyJSON REST API for demonstration purposes.

Read operations use live API data.

Some operations are simulated because DummyJSON does not permanently persist mutations.

These include:

- Adding products
- Updating products
- Deleting products
- Stock adjustments
- Adding users
- Updating users
- Deleting users
- Order status changes

The application updates its local frontend state after these simulated mutations to demonstrate realistic management workflows.

In a production environment, these operations would be connected to a persistent backend and protected with server-side authorization.

---

## Locale-Aware Formatting

Currency, numbers, percentages, compact values, and dates are handled through a centralized formatter service.

Supported locales:

```text
English → en-US
Arabic  → ar-EG
```

Formatting is shared across:

- Dashboard KPIs
- Product prices
- Orders
- Inventory
- Analytics
- Chart axes
- Chart tooltips
- Dates
- Percentages

This avoids duplicated formatting logic across components.

---

## Project Setup

### Prerequisites

Make sure Node.js and npm are installed.

The project was developed with:

```text
Node.js 24
Angular CLI 22
```

### Clone the Repository

```bash
git clone https://github.com/MahmoudMo99/retail-ops.git
cd retail-ops
```

### Install Dependencies

```bash
npm install
```

---

## PrimeUI License

PrimeNG 22 requires a valid PrimeUI license.

Create a `.env.local` file in the project root:

```text
.env.local
```

Add your PrimeUI license key:

```env
PRIMEUI_LICENSE_KEY=your_primeui_license_key
```

The license value is intentionally excluded from version control.

A pre-build script generates the local PrimeUI configuration required by the Angular application.

The generated license file is also excluded from Git.

---

## Development Server

Start the application with:

```bash
npm start
```

Then open:

```text
http://localhost:4200
```

---

## Production Build

Create an optimized production build with:

```bash
npm run build
```

The application uses Angular production bundle budgets configured for the size of the dashboard application.

---

## Available Scripts

### Development

```bash
npm start
```

Starts the Angular development server.

### Production Build

```bash
npm run build
```

Creates the production application bundle.

### Tests

```bash
npm test
```

Runs the configured test suite.

---

## Deployment

RetailOps is deployed using Vercel.

**Live Application:**  
https://retail-ops-sigma.vercel.app

The Vercel project uses:

```text
Framework: Angular
Build Command: npm run build
```

The production environment requires:

```text
PRIMEUI_LICENSE_KEY
```

as a Vercel environment variable.

SPA rewrites are configured using `vercel.json` so direct navigation and page refreshes work correctly for Angular routes such as:

```text
/products
/orders
/analytics
/settings
```

---

## Security Notes

The project demonstrates frontend authentication and authorization architecture.

Implemented protections include:

- Protected Angular routes
- Guest-only routes
- Permission guards
- Token injection through HTTP interceptor
- Automatic access-token refresh
- Session restoration
- Secure exclusion of the PrimeUI license from Git

For a real production system, authorization must also be enforced by the backend because frontend RBAC alone cannot provide complete security.

---

## Highlights

- Angular 22 standalone architecture
- Feature-based project structure
- Lazy-loaded routes
- Responsive application shell
- Authentication flow
- Access and refresh tokens
- Automatic token refresh
- HTTP authentication interceptor
- Session restoration
- Permission-based RBAC
- Protected routes
- 403 access-denied flow
- Global command palette
- Operational inventory notifications
- English and Arabic localization
- Complete RTL support
- Light, Dark, and System themes
- Chart.js analytics
- Server-side API pagination
- Reactive Forms
- CRUD-style management workflows
- Centralized locale-aware formatting
- Responsive tables and dialogs
- Production build configuration
- Vercel deployment

---

## Future Improvements

Possible future enhancements include:

- Persistent backend integration
- Server-side RBAC enforcement
- Real order management workflows
- Real-time notifications
- Advanced global search across business records
- Exportable analytics reports
- Audit logs
- Activity history
- Advanced user permissions
- Automated unit and integration testing
- End-to-end testing
- CI/CD quality checks

---

## Author

**Mahmoud Mohamed**

Software Engineer specializing in Frontend Development and Angular.

RetailOps was built as a portfolio project to demonstrate modern Angular architecture, scalable frontend organization, responsive UI development, authentication, authorization, internationalization, analytics, and real-world e-commerce administration workflows.

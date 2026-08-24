# RetailOps

A modern e-commerce operations dashboard built with Angular, PrimeNG, Chart.js, Bootstrap, and REST APIs.

RetailOps provides a complete admin workspace for managing products, orders, customers, inventory, users, analytics, and workspace preferences through a responsive, multilingual, and production-style Angular application.

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

RetailOps was built as a portfolio project to demonstrate practical Angular development beyond isolated pages and static UI.

The application includes authentication, protected routes, refresh-token handling, permission-based access control, REST API integration, business analytics, inventory monitoring, global search, operational notifications, localization, RTL support, responsive layouts, and persistent theme preferences.

The project follows a modular, feature-based Angular architecture using standalone components and lazy-loaded routes.

---

## Features

### Dashboard

- Business KPI overview
- Revenue trend visualization
- Sales breakdown by category
- Recent orders
- Top-performing products
- Responsive Chart.js visualizations
- Locale-aware numbers, currencies, percentages, and dates

### Products Management

- Product search
- Category filtering
- Server-side pagination
- Sorting
- Product details
- Add and edit product workflows
- Delete confirmation
- Stock status indicators
- Responsive PrimeNG table

### Orders Management

- Orders overview
- Customer information
- Search and status filtering
- Order details
- Order item breakdown
- Order status management
- Responsive order table

### Customers

- Customer directory
- Search
- Sorting
- Server-side pagination
- Customer details
- Contact and company information

### Inventory Management

- Inventory KPI overview
- Total products and units
- Inventory value calculation
- In-stock, low-stock, and out-of-stock monitoring
- Stock-level visualization
- Inventory filtering
- Stock adjustment workflow

### Analytics

- Revenue metrics
- Orders and customer metrics
- Average order value
- Revenue by category
- Top-performing products
- Order-status distribution
- Inventory health
- Business insights
- Responsive Chart.js visualizations

### Team & Users

- User directory
- Search and sorting
- Server-side pagination
- User details
- Add and edit user workflows
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

## Authentication & Session Management

RetailOps includes a complete frontend authentication flow.

Implemented features include:

- Login workflow
- Access-token handling
- Refresh-token handling
- Automatic access-token refresh
- HTTP authentication interceptor
- Session restoration after page refresh
- Protected routes
- Guest-only route protection
- Return URL handling
- Current authenticated-user state
- Logout

The application restores the current session during startup before protected application areas are rendered.

---

## Role-Based Access Control

RetailOps includes a permission-based RBAC architecture.

Supported roles:

- Admin
- Moderator
- User

Permissions are mapped independently from roles and used to control access to application areas.

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

Route guards prevent unauthorized navigation, while the sidebar and global search only expose areas available to the current user.

Unauthorized route access is redirected to a dedicated `403 Forbidden` page.

> Frontend RBAC improves user experience and route protection, but a real production backend must also enforce authorization server-side.

---

## Global Search

RetailOps includes a command palette for fast workspace navigation.

Open it using:

```text
Ctrl + K
```

Features include:

- Search across application areas
- Keyboard navigation
- Arrow keys to move through results
- Enter to open a page
- Escape to close
- Permission-aware results
- English and Arabic search support

---

## Operational Notifications

The notification center generates inventory-related alerts from API product data.

Supported alerts include:

- Low-stock products
- Out-of-stock products
- Read/unread state
- Unread notification indicator
- Mark all as read
- Direct navigation to inventory

This keeps the notification center connected to real application data instead of using static placeholder notifications.

---

## Internationalization, RTL & Themes

RetailOps supports:

- English
- Arabic
- LTR layouts
- RTL layouts
- Light theme
- Dark theme
- System theme

The application uses `ngx-translate` for localization.

Language changes automatically update:

- Interface text
- Layout direction
- Typography
- Number formatting
- Currency formatting
- Percentage formatting
- Date formatting
- Chart labels
- Chart tooltips

Supported locales:

```text
English → en-US
Arabic  → ar-EG
```

Typography:

```text
English → Inter
Arabic  → IBM Plex Sans Arabic
```

The `System` theme automatically responds to operating-system appearance changes.

Language and theme preferences are persisted locally.

---

## Responsive Design

RetailOps is designed for:

- Desktop
- Laptop
- Tablet
- Mobile

Responsive behavior includes:

- Adaptive application shell
- Mobile sidebar
- Navigation backdrop
- Responsive topbar
- Scrollable and adaptive data tables
- Responsive dialogs
- Adaptive dashboard grids
- Responsive Chart.js visualizations
- RTL-aware responsive layouts

---

## Tech Stack

### Frontend

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

The layout layer contains shared application-shell components:

- Main layout
- Sidebar
- Topbar
- Global search
- Notification center

### Feature Layer

Each business domain is isolated inside its own feature.

The application uses Angular standalone components and lazy-loaded routes to keep features modular and independently maintainable.

---

## API & Demo Data

RetailOps uses the DummyJSON REST API for demonstration purposes.

Read operations use live API data.

Some mutation operations are simulated because DummyJSON does not permanently persist changes.

These include:

- Adding products
- Updating products
- Deleting products
- Stock adjustments
- Adding users
- Updating users
- Deleting users
- Order-status changes

The frontend updates its local state after these operations to demonstrate realistic management workflows.

In a production environment, these workflows would be connected to a persistent backend with server-side validation and authorization.

---

## Getting Started

### Prerequisites

Make sure Node.js and npm are installed.

The project was developed using:

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

### PrimeUI License

PrimeNG 22 requires a valid PrimeUI license.

Create a `.env.local` file in the project root:

```text
.env.local
```

Add:

```env
PRIMEUI_LICENSE_KEY=your_primeui_license_key
```

The local environment file and generated license configuration are excluded from version control.

### Start the Development Server

```bash
npm start
```

Open:

```text
http://localhost:4200
```

### Production Build

```bash
npm run build
```

---

## Deployment

RetailOps is deployed on Vercel.

**Live Application:**  
https://retail-ops-sigma.vercel.app

The Vercel deployment uses Angular production builds and requires:

```text
PRIMEUI_LICENSE_KEY
```

as an environment variable.

SPA rewrites are configured so Angular routes work correctly when opened directly or refreshed.

Examples:

```text
/products
/orders
/analytics
/settings
```

---

## Author

**Mahmoud Mohamed**

Software Engineer specializing in Frontend Development and Angular.

RetailOps was built as a portfolio project to demonstrate modern Angular architecture, authentication, authorization, REST API integration, responsive UI development, internationalization, analytics, and real-world e-commerce operations workflows.

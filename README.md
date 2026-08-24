# RetailOps

A modern e-commerce operations admin dashboard built with Angular, PrimeNG, Chart.js, Bootstrap, and REST APIs.

RetailOps is a production-style Angular dashboard that demonstrates real-world frontend workflows such as authentication, role-based access control, data tables, filtering, pagination, analytics, localization, RTL support, theme preferences, and responsive admin layouts.

## Live Demo

**Live Application:**  
https://retail-ops-sigma.vercel.app

### Demo Account

```txt
Username: emilys
Password: emilyspass
```

## Project Highlights

- Authentication with access-token and refresh-token handling
- Protected routes and guest-only routes
- Role-based access control with permission-aware navigation
- Products, orders, customers, inventory, users, analytics, and settings modules
- PrimeNG tables with search, filtering, sorting, and pagination
- Chart.js dashboards for business analytics and inventory insights
- Global command search with keyboard navigation
- Operational notifications generated from API product data
- English and Arabic localization with RTL support
- Light, dark, and system theme preferences
- Responsive admin layout for desktop, tablet, and mobile

## Overview

RetailOps was built as a portfolio project to demonstrate practical Angular development beyond static pages or isolated UI components.

The application provides a complete admin workspace for managing e-commerce operations, including products, orders, customers, inventory, users, analytics, and workspace settings.

The project follows a modular, feature-based Angular architecture using standalone components, lazy-loaded routes, services, guards, interceptors, and reusable UI patterns.

## Main Features

### Dashboard

- KPI overview
- Revenue trend visualization
- Sales breakdown by category
- Recent orders
- Top-performing products
- Responsive Chart.js visualizations
- Locale-aware numbers, currencies, percentages, and dates

### Products Management

- Product listing
- Search and category filtering
- Sorting and pagination
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

### Customers

- Customer directory
- Search and sorting
- Pagination
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

### Team & Users

- User directory
- Search and sorting
- Pagination
- User details
- Add and edit user workflows
- Delete confirmation
- Role management

### Settings

- Light, dark, and system themes
- English and Arabic languages
- Account information
- Persistent workspace preferences

## Authentication & Session Management

RetailOps includes a complete frontend authentication flow:

- Login workflow
- Access-token handling
- Refresh-token handling
- Automatic token refresh
- HTTP authentication interceptor
- Session restoration after page refresh
- Protected routes
- Guest-only route protection
- Return URL handling
- Current authenticated-user state
- Logout

The application restores the current session during startup before protected dashboard areas are rendered.

## Role-Based Access Control

RetailOps includes a permission-based RBAC architecture.

Supported roles:

- Admin
- Moderator
- User

Permissions are mapped independently from roles and used to control access to application areas.

Example permissions:

```txt
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

Unauthorized access is redirected to a dedicated `403 Forbidden` page.

> Frontend RBAC improves user experience and route protection, but authorization must also be enforced on the backend in a real production system.

## Global Search

RetailOps includes a command palette for fast workspace navigation.

Open it using:

```txt
Ctrl + K
```

Features:

- Search across application areas
- Keyboard navigation
- Arrow keys to move through results
- Enter to open a page
- Escape to close
- Permission-aware results
- English and Arabic search support

## Operational Notifications

The notification center generates inventory-related alerts from API product data.

Supported alerts:

- Low-stock products
- Out-of-stock products
- Read and unread states
- Unread notification indicator
- Mark all as read
- Direct navigation to inventory

This keeps the notification center connected to real application data instead of static placeholder notifications.

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

Language changes update:

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

```txt
English → en-US
Arabic  → ar-EG
```

Typography:

```txt
English → Inter
Arabic  → IBM Plex Sans Arabic
```

The system theme responds to the operating-system appearance preference, and both language and theme preferences are persisted locally.

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
- Adaptive dashboard grids
- Scrollable data tables
- Responsive dialogs
- Responsive charts
- RTL-aware layouts

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

### API

- DummyJSON REST API

### Deployment

- Vercel

## Architecture

RetailOps follows a feature-based Angular architecture.

```txt
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

The `core` layer contains application-wide infrastructure:

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

Each business domain is isolated inside its own feature folder to keep the application organized, scalable, and easier to maintain.

## API & Demo Data

RetailOps uses the DummyJSON REST API for demonstration purposes.

Read operations use live API data.

Some mutation operations are simulated because DummyJSON does not permanently persist changes.

Simulated operations include:

- Adding products
- Updating products
- Deleting products
- Stock adjustments
- Adding users
- Updating users
- Deleting users
- Order-status changes

The frontend updates local state after these operations to demonstrate realistic admin workflows.

In a real production environment, these workflows would be connected to a persistent backend with server-side validation and authorization.

## Getting Started

### Prerequisites

Make sure Node.js and npm are installed.

The project was developed using:

```txt
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

```txt
.env.local
```

Add:

```txt
PRIMEUI_LICENSE_KEY=your_primeui_license_key
```

The local environment file and generated license configuration are excluded from version control.

### Start the Development Server

```bash
npm start
```

Open:

```txt
http://localhost:4200
```

### Production Build

```bash
npm run build
```

## Deployment

RetailOps is deployed on Vercel.

**Live Application:**  
https://retail-ops-sigma.vercel.app

The Vercel deployment uses Angular production builds and requires the following environment variable:

```txt
PRIMEUI_LICENSE_KEY
```

SPA rewrites are configured so Angular routes work correctly when opened directly or refreshed.

Examples:

```txt
/products
/orders
/analytics
/settings
```

## Author

**Mahmoud Mohamed**

Software Engineer specializing in Frontend Development and Angular.

RetailOps was built as a portfolio project to demonstrate modern Angular architecture, authentication, authorization, REST API integration, responsive UI development, internationalization, analytics, and real-world e-commerce operations workflows.

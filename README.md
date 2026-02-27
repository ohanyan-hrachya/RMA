# RMA — Reusable Module Architecture

Scalable React Admin / Backoffice Architecture

<img width="1536" height="1024" alt="ChatGPT Image Feb 27, 2026, 11_39_37 AM (1)" src="https://github.com/user-attachments/assets/3999a201-0fcc-450f-a0c9-4805d021537c" />

---

## Overview

RMA (Reusable Module Architecture) is a production-ready, config-driven architecture for building large-scale React admin panels and enterprise backoffice systems.

It focuses on:

* Maximum module reusability
* Minimal page logic
* Strict separation of UI, business logic, and services
* Config-generated CRUD modules
* Dynamic forms and dashboards
* Permission-based UI control
* SOLID-aligned structure

Designed for enterprise domains such as banking systems, SaaS platforms, internal management tools, and operational dashboards.

---

## Tech Stack

* Vite + TypeScript
* MUI + MUI DataGrid
* React Router
* React Query
* Axios
* Zod
* React Hook Form
* Zustand
* Framer Motion

---

## Architecture Principles

### 1. Feature-Based Structure

Modules live inside `modules/` and own their:

* domain (schemas + types)
* services (API layer)
* CRUD config
* dialogs
* dashboards
* UI wrappers

### 2. Config-Driven Modules

CRUD pages, forms, dialogs, and dashboards are generated from configuration objects.

Pages contain minimal logic:

```tsx
export default function UsersPage() {
  return <CrudModule config={usersCrud} />;
}
```

### 3. Clean Separation of Concerns

| Layer    | Responsibility              |
| -------- | --------------------------- |
| UI       | Rendering only              |
| Domain   | Validation + business rules |
| Services | API communication           |
| RMA Core | Orchestration               |
| Store    | Client session state only   |

Server data is handled by React Query.
Global client state is handled by Zustand.

### 4. SOLID Compliance

* Single Responsibility per layer
* Open for extension via config & plugins
* Dependency inversion through service interfaces
* Interface segregation for CRUD operations
* Liskov substitution via consistent service contracts

---

## Folder Structure

```
src/
  app/          → layout, router, providers
  platform/     → axios, query client, auth helpers
  rma/          → core reusable modules (Crud, Form, Dashboard)
  modules/      → feature modules
  shared/       → reusable UI + hooks + utils
  store/        → zustand slices
  assets/
```

---

## Core RMA Components

### 1. CrudModule

Generates full CRUD interface from config.

Features:

* Server-side pagination/sorting/filtering
* Drawer-based create/edit
* Zod validation
* Row + bulk actions
* Permission-based visibility
* Query invalidation
* Custom action dialogs

---

### 2. FormModule

Dynamic or hard form support.

Features:

* Zod-driven validation
* Multi-step wizard support
* Conditional fields
* Async submit
* Config-based layout

---

### 3. DashboardModule

Analytics composition engine.

Supports:

* KPI stat cards
* Line / Bar / Pie charts
* Query-based widgets
* Responsive grid layout
* Animated transitions

---

### 4. DialogHost

Centralized action dialog system.

* Config-driven dialogs
* Optional schema validation
* Permission-gated execution
* Reusable across modules

---

## Permission System

Permission format:

```
resource:action
```

Examples:

```
users:list
users:create
banking:approve
```

All UI elements are gated through permission checks.

---

## Example Modules

### Users

Full CRUD via configuration only.

### Jobs

Standard management table.

### Banking Applications

Dynamic form + approval dialog.

### Overview

Analytics dashboard with KPI cards and charts.

---

## How to Add a New Module

1. Create folder inside `modules/`
2. Add:

   * `domain/` (zod schema)
   * `services/` (implements CrudService)
   * `crud/` (config definition)
   * `ui/` (thin page wrapper)
3. Register module in module registry

No changes required inside RMA core.

---

## UI / UX Design Philosophy

* Clean enterprise layout
* Collapsible sidebar
* Responsive grid system
* Light & dark mode
* Subtle motion (Framer Motion)
* Server-driven DataGrid
* Drawer-based forms
* Clear validation feedback
* Skeleton loaders & empty states

Modern SaaS / banking-grade interface.

---

## Scalability

RMA supports:

* Large multi-module admin systems
* Banking operations panels
* SaaS tenant management
* Operational dashboards
* Extensible plugin-style modules

New modules scale horizontally without modifying core architecture.

---

## Future Enhancements

* Multi-tenant support
* Role management UI
* Audit logging module
* Module-level plugin system
* Advanced analytics engine

---

## Philosophy

RMA is built to avoid:

* Fat pages
* Repeated CRUD logic
* Mixed business/UI code
* Tight coupling between modules

It enforces structure while keeping flexibility.

---

## Status

Architecture foundation ready.
Modules can be added incrementally.

# Reusable Module Architecture (RMA) — Complete Documentation

> **Version:** 1.0  
> **Last Updated:** 2026-03-02  
> **Stack:** Vite · TypeScript · MUI · React Query · Zustand · Axios · Zod · React Hook Form · Framer Motion

---

## Table of Contents

1. [Overview & Philosophy](#1-overview--philosophy)
2. [Folder Structure](#2-folder-structure)
3. [Architecture Layers](#3-architecture-layers)
4. [RMA Core Engine](#4-rma-core-engine)
   - 4.1 [CrudModule](#41-crudmodule)
   - 4.2 [DashboardModule](#42-dashboardmodule)
   - 4.3 [FormModule](#43-formmodule)
   - 4.4 [DialogHost](#44-dialoghost)
5. [Data Layer](#5-data-layer)
   - 5.1 [Axios Instance & Interceptors](#51-axios-instance--interceptors)
   - 5.2 [Service Pattern](#52-service-pattern)
   - 5.3 [React Query Integration](#53-react-query-integration)
6. [State Management](#6-state-management)
   - 6.1 [Auth Store](#61-auth-store)
   - 6.2 [UI Store](#62-ui-store)
   - 6.3 [Permission System](#63-permission-system)
7. [Module Development Guide](#7-module-development-guide)
   - 7.1 [Creating a New Module](#71-creating-a-new-module)
   - 7.2 [CRUD Module Example](#72-crud-module-example)
   - 7.3 [Dashboard Module Example](#73-dashboard-module-example)
8. [UI / UX Specifications](#8-ui--ux-specifications)
   - 8.1 [Layout System](#81-layout-system)
   - 8.2 [Theme & Design Tokens](#82-theme--design-tokens)
   - 8.3 [Animation Standards](#83-animation-standards)
   - 8.4 [Responsive Design](#84-responsive-design)
9. [Security & Permissions](#9-security--permissions)
10. [Testing Strategy](#10-testing-strategy)
11. [Deployment & Build](#11-deployment--build)
12. [Conventions & Best Practices](#12-conventions--best-practices)
13. [Roadmap & Extension Points](#13-roadmap--extension-points)

---

## 1. Overview & Philosophy

### What is RMA?

**Reusable Module Architecture (RMA)** is a config-driven, feature-based architecture designed for enterprise-grade React admin applications. It enforces strict separation of concerns, eliminates code duplication, and enables rapid feature development through composable, generic engine components.

### Core Principles

| Principle | Description |
|---|---|
| **Config over Code** | Modules are defined through configuration objects, not imperative code. A new CRUD page requires ~50 lines of config, not 500 lines of components. |
| **SOLID Compliance** | Single Responsibility (each layer has one job), Open/Closed (extend via config, not modification), Liskov Substitution (generic type contracts), Interface Segregation (small, focused interfaces), Dependency Inversion (modules depend on abstractions). |
| **Feature Isolation** | Each module (`users/`, `jobs/`, `banking/`) is fully self-contained with its own service, types, config, and page. Zero cross-module imports. |
| **Permission-First** | Every UI element, action, and API call is gated by a granular permission system (`resource:action` format). |
| **Type Safety** | Strict TypeScript with no `any`. Generics propagate types from API response → service → config → UI. |

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        App Shell                            │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────────┐  │
│  │   Sidebar      │  │    Topbar      │  │ Content Area  │  │
│  │ (components/)  │  │ (components/)  │  │   (Outlet)    │  │
│  └────────────────┘  └────────────────┘  └───────────────┘  │
└─────────────────────────────┬───────────────────────────────┘
                              │
          ┌───────────────────┴───────────────────┐
          ▼                                       ▼
┌───────────────────┐               ┌──────────────────────────┐
│   rms/ (Engine)   │               │   modules/ (Features)    │
│  ├─ r-layout/     │               │  ├─ users/               │
│  │  ├─ Sidebar    │               │  │  ├─ UsersPage.tsx     │
│  │  └─ Topbar     │◄──────────────┤  │  └─ ...               │
│  └─ r-module/     │               │  ├─ jobs/                │
│     ├─ CrudModule │               │  └─ ...               │
│     └─ hooks/     │               └──────────────────────────┘
└───────────────────┘                              │
          │                                        ▼
          │                         ┌──────────────────────────┐
          │                         │   services/ (Data)       │
          │                         │  ├─ api.ts               │
          │                         │  └─ mock/                │
          │                         │     ├─ data.ts           │
          │                         │     ├─ logic.ts          │
          │                         │     └─ config.ts         │
          └─────────────────────────┘──────────────────────────┘
                                                             │
                                                             ▼
                                            ┌──────────────────────────┐
                                            │   store/ (State)         │
                                            │  ├─ auth.store.ts        │
                                            │  └─ ui.store.ts          │
                                            └──────────────────────────┘
```

---

## 2. Folder Structure

```
src/
├── app/                          # Application shell & providers
│   ├── providers/                # Theme, Query, Router providers
│   └── main.tsx                  # Entry point
│
├── services/                     # Data infrastructure
│   ├── api.ts                    # Axios instance + interceptors
│   ├── mock/                     # 🔥 Modular Mock API
│   │   ├── data.ts               # Raw mock data
│   │   ├── api-logic.ts          # Mock implementation logic
│   │   └── config.ts             # APP_CONFIG definitions
│   └── mockApi.ts                # Aggregator (main dev service)
│
├── rms/                          # 🔥 Reusable Module System (Engine)
│   ├── r-layout/                 # Layout subsystem
│   │   ├── components/           │ Sidebar, Topbar, Logo
│   │   ├── hooks/                │ useLayout hook
│   │   └── LayoutEngine.tsx      │ Main shell orchestrator
│   └── r-module/                 # Module components subsystem
│       ├── components/           │ RowActions, etc.
│       ├── hooks/                │ useCrudModule logic
│       └── CrudModule.tsx        │ Generic CRUD engine
│
├── modules/                      # Business feature modules
│   ├── users/                    │ Users module
│   ├── jobs/                     │ Jobs module
│   └── overview/                 │ Global dashboard
│
├── shared/                       # Global primitives
│   ├── ui/                       # Reusable UI (AutoForm, DataTable)
│   ├── hooks/                    # Reusable logic (usePermission)
│   ├── helpers/                  # API helpers, pagination utils
│   └── types/                    # Centralized TypeScript contracts
│
├── store/                        # Global state (Zustand)
│   ├── auth.store.ts             # Permissions & Auth
│   ├── ui.store.ts               # Theme, Sidebar, UI state
│   └── config.store.ts           # Dynamic app config store
│
└── App.tsx                       # Root container
```

### File Naming Conventions

| Type | Pattern | Example |
|---|---|---|
| Page component | `PascalCase` + `Page` suffix | `UsersPage.tsx` |
| Service | `camelCase` + `Service` suffix | `usersService.ts` |
| Types | `camelCase` + `Types` suffix | `usersTypes.ts` |
| Hook | `use` prefix + `PascalCase` | `usePermission.ts` |
| Store | `camelCase` + `.store.ts` suffix | `auth.store.ts` |
| RMS engine | `PascalCase` + `Module` suffix | `CrudModule.tsx` |

---

## 3. Architecture Layers

### Layer Responsibilities

```
┌───────────────────────────────────────────────────┐
│  PRESENTATION LAYER                                │
│  Pages, Layout, Theme, Animations                  │
│  Rule: ZERO business logic. Config only.           │
├───────────────────────────────────────────────────┤
│  RMA ENGINE LAYER                                  │
│  CrudModule, FormModule, DashboardModule           │
│  Rule: Generic, reusable, config-driven.           │
├───────────────────────────────────────────────────┤
│  MODULE / BUSINESS LAYER                           │
│  Services, Types, Validation Schemas               │
│  Rule: All domain logic lives here.               │
│  Import: @/services, @/shared                      │
├───────────────────────────────────────────────────┤
│  SERVICE / INFRASTRUCTURE LAYER                   │
│  Axios, React Query, Mock API Layer                │
│  Rule: Infrastructure-agnostic, module-agnostic.   │
└───────────────────────────────────────────────────┘
```

### Dependency Rules

- **Pages** → may import from `rms/r-module/`, `modules/` (own module only), `shared/`, `store/`
- **RMA engine** → may import from `services/`, `store/`, `shared/`
- **Modules** → may import from `services/`, `shared/`, `store/`
- **Infrastructure** → may import from `store/` (for auth interceptors only)
- **Shared** → may import from `store/` (for permission hooks only)
- ❌ **Never**: cross-module imports (`users/` → `jobs/`)
- ❌ **Never**: `rms/` importing from `modules/`

---

## 4. RMA Core Engine

### 4.1 CrudModule

The `CrudModule<T>` is the primary workhorse of the architecture. It provides a complete CRUD interface from a single configuration object.

#### Interface

```typescript
interface CrudModuleConfig<T> {
  // Identity
  resource: string;              // Query key namespace (e.g., "users")
  title: string;                 // Display title (e.g., "Users")

  // Data
  columns: GridColDef[];         // MUI DataGrid column definitions
  fetchList: (params: {
    page: number;
    pageSize: number;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
  }) => Promise<{ data: T[]; total: number }>;

  // Mutations (optional — enables corresponding UI)
  onCreate?: (data: Record<string, unknown>) => Promise<T>;
  onUpdate?: (id: number, data: Record<string, unknown>) => Promise<T>;
  onDelete?: (id: number) => Promise<void>;

  // UI Renderers
  renderForm?: (props: {
    mode: 'create' | 'edit';
    initialData?: T;
    onSubmit: (data: Record<string, unknown>) => void;
    onCancel: () => void;
    isSubmitting: boolean;
  }) => ReactNode;
  renderView?: (row: T) => ReactNode;

  // Custom row actions
  actions?: CrudAction<T>[];

  // Permission gates
  permissions?: {
    list?: string;     // e.g., "users:list"
    create?: string;   // e.g., "users:create"
    update?: string;   // e.g., "users:update"
    delete?: string;   // e.g., "users:delete"
    view?: string;     // e.g., "users:view"
  };
}
```

#### Features

| Feature | Implementation |
|---|---|
| **Server-side pagination** | `paginationMode="server"` with `GridPaginationModel` state |
| **Server-side sorting** | `sortingMode="server"` with `GridSortModel` state |
| **Debounced search** | 300ms debounce on search input, triggers query refetch |
| **Skeleton loading** | Custom `loadingOverlay` slot with animated skeletons |
| **Empty state** | Custom `noRowsOverlay` with centered message |
| **Create/Edit drawer** | Right-anchored `Drawer` (480px) with form renderer |
| **Delete confirmation** | `Dialog` with confirm/cancel actions |
| **View details** | Right-anchored `Drawer` with custom view renderer |
| **Permission gating** | Actions hidden if user lacks required permission |
| **Query invalidation** | Automatic cache invalidation on create/update/delete |
| **keepPreviousData** | Prevents layout shift during pagination/sort changes |
| **Entry animation** | Framer Motion fade-in + slide-up on mount |

#### Usage Pattern

```typescript
// modules/users/UsersPage.tsx
const config: CrudModuleConfig<User> = {
  resource: 'users',
  title: 'Users',
  columns: [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    // ...
  ],
  fetchList: (params) => mockApi.fetchUsers(params),
  onCreate: (data) => mockApi.createUser(data),
  onUpdate: (id, data) => mockApi.updateUser(id, data),
  onDelete: (id) => mockApi.deleteUser(id),
  renderForm: ({ mode, initialData, onSubmit, onCancel, isSubmitting }) => (
    <UserForm mode={mode} initialData={initialData} ... />
  ),
  permissions: {
    list: 'users:list',
    create: 'users:create',
    update: 'users:update',
    delete: 'users:delete',
    view: 'users:view',
  },
};

export default function UsersPage() {
  return <CrudModule config={config} />;
}
```

#### Refactoring Guidelines

The `CrudModule` follows a logic-presentation separation pattern. The main file acts as an orchestrator, while logic and sub-UI are delegated:

```
rms/r-module/
├── CrudModule.tsx           # Main orchestrator (composition)
├── components/
│   └── RowActions.tsx       # Table row action buttons
└── hooks/
    └── useCrudModule.ts     # Core state, queries, and mutations
```

---

### 4.2 DashboardModule

The `DashboardModule` provides a config-driven dashboard layout with KPI cards and widget grids.

#### Interface

```typescript
interface KpiCard {
  title: string;               // Card label
  value: string | number;      // Primary metric
  change?: number;             // Percentage change (positive = green, negative = red)
  icon?: ReactNode;            // Icon element
  color?: string;              // Icon background color
}

interface DashboardWidget {
  title: string;               // Widget header
  span?: number;               // Grid columns (1-12, default: 6)
  render: () => ReactNode;     // Widget content renderer
}

interface DashboardModuleConfig {
  kpis: KpiCard[];
  widgets: DashboardWidget[];
}
```

#### Features

| Feature | Implementation |
|---|---|
| **KPI cards** | 4-column responsive grid with trend indicators |
| **Staggered animation** | Each card animates with incremental delay (80ms) |
| **Widget grid** | Configurable span for flexible layouts |
| **Trend indicators** | ↑/↓ arrows with green/red coloring |
| **Icon badges** | Colored icon containers with subtle opacity |

#### Usage Pattern

```typescript
const config: DashboardModuleConfig = {
  kpis: [
    { title: 'Total Users', value: '12,847', change: 12.5, icon: <PeopleIcon /> },
    { title: 'Revenue', value: '$284K', change: -3.2, icon: <AttachMoneyIcon /> },
  ],
  widgets: [
    { title: 'User Growth', span: 8, render: () => <AreaChart ... /> },
    { title: 'Distribution', span: 4, render: () => <PieChart ... /> },
  ],
};
```

---

### 4.3 FormModule (Planned)

The `FormModule` will provide Zod-driven dynamic form generation with support for complex form patterns.

#### Planned Interface

```typescript
interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'select' | 'checkbox' | 'date' | 'textarea' | 'file';
  placeholder?: string;
  options?: { label: string; value: string }[];  // For select fields
  required?: boolean;
  disabled?: boolean;
  dependsOn?: {                 // Conditional rendering
    field: string;
    value: unknown;
  };
  gridSpan?: number;            // 1-12 grid columns
}

interface FormStep {
  title: string;
  description?: string;
  fields: FormField[];
}

interface FormModuleConfig<T> {
  schema: ZodSchema<T>;         // Zod validation schema
  fields?: FormField[];          // Single-step form
  steps?: FormStep[];            // Multi-step wizard
  defaultValues?: Partial<T>;
  onSubmit: (data: T) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}
```

#### Planned Features

- **Zod-driven validation**: Schema auto-generates field-level error messages
- **Dynamic field rendering**: Field type → component mapping
- **Multi-step wizard**: Step navigation with per-step validation
- **Conditional fields**: Show/hide fields based on other field values
- **Grid layout**: Responsive field grid with configurable spans
- **Async submission**: Loading state with disable during submit
- **Custom field components**: Override any field type with a custom renderer

#### Implementation Plan

```
rma/
├── FormModule.tsx              # Main form orchestrator
├── FormWizard.tsx              # Multi-step navigation
├── fields/
│   ├── TextField.tsx           # Text/email/number input
│   ├── SelectField.tsx         # Dropdown select
│   ├── CheckboxField.tsx       # Boolean checkbox
│   ├── DateField.tsx           # Date picker
│   ├── TextareaField.tsx       # Multi-line text
│   ├── FileField.tsx           # File upload
│   └── FieldRenderer.tsx       # Dynamic field type mapper
└── useFormModule.ts            # Form state + validation hook
```

---

### 4.4 Shared UI Primitives

The architecture provides "Auto" components that generate UI from metadata, reducing repetitive JSX.

#### AutoForm
Generates an interactive form from a `FormFieldSchema[]`.
- Support for `text`, `select`, `date`, `checkbox`.
- Built-in validation (required fields).
- Automatic grid layout.

#### AutoView
Generates a read-only details view from a `ViewFieldSchema[]`.
- Support for `currency`, `date`, `chip`, `boolean` formatting.
- Consistent visual hierarchy (Label/Value pairs).

#### DataTable
A styled wrapper around MUI DataGrid with standardized pagination and loading states.
- Handles server-side pagination and sorting automatically.
- Custom skeleton loaders and empty states.

---

## 5. Data Layer

### 5.1 Axios Instance & Interceptors

```
services/api.ts
│
├── Base Configuration
│   ├── baseURL: '/api'
│   └── Content-Type: 'application/json'
│
├── Request Interceptor
│   └── Injects JWT from authStore → Authorization: Bearer <token>
│
└── Response Interceptor
    └── Normalizes errors → { status, message, errors }
```

#### Error Normalization

All API errors are normalized to a consistent shape:

```typescript
interface ApiError {
  status: number;           // HTTP status code (default: 500)
  message: string;          // Human-readable message
  errors: Record<string, string[]>;  // Field-level validation errors
}
```

#### Planned Enhancements

| Feature | Description |
|---|---|
| **Refresh token rotation** | Auto-refresh expired access tokens using refresh token |
| **401 redirect** | Redirect to login on authentication failure |
| **Request deduplication** | Cancel duplicate in-flight requests |
| **Retry logic** | Exponential backoff for transient failures (5xx) |
| **Request/response logging** | Debug-mode request logging |

### 5.2 Service Pattern

Each module should define a service file that encapsulates all API calls:

```typescript
// modules/users/usersService.ts
import { api } from '@/services/api';
import type { User, CreateUserDto, UpdateUserDto } from './usersTypes';

export const usersService = {
  list: async (params: ListParams) => {
    const { data } = await api.get<PaginatedResponse<User>>('/users', { params });
    return data;
  },

  getById: async (id: number) => {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },

  create: async (dto: CreateUserDto) => {
    const { data } = await api.post<User>('/users', dto);
    return data;
  },

  update: async (id: number, dto: UpdateUserDto) => {
    const { data } = await api.put<User>(`/users/${id}`, dto);
    return data;
  },

  delete: async (id: number) => {
    await api.delete(`/users/${id}`);
  },
};
```

#### Service Rules

1. Services return **domain objects**, never raw Axios responses
2. Services handle **DTO → API** mapping
3. Services are **pure functions** — no side effects, no UI dependencies
4. One service file per module
5. Service methods match REST semantics: `list`, `getById`, `create`, `update`, `delete`

### 5.3 React Query Integration

#### Query Key Factory

```typescript
// services/queryClient.ts
export const queryKeys = {
  all:    (resource: string) => [resource] as const,
  list:   (resource: string, params?: Record<string, unknown>) => [resource, 'list', params] as const,
  detail: (resource: string, id: string | number) => [resource, 'detail', id] as const,
};
```

#### Key Hierarchy for Invalidation

```
['users']                          ← invalidates ALL user queries
['users', 'list', { page: 0 }]    ← specific list query
['users', 'detail', 42]           ← specific user detail
```

#### Query Defaults

```typescript
{
  staleTime: 30_000,        // 30 seconds before refetch
  retry: 1,                 // Single retry on failure
  refetchOnWindowFocus: false,  // No refetch on tab focus
}
```

#### Mutation → Invalidation Pattern

```typescript
const createMutation = useMutation({
  mutationFn: (data) => service.create(data),
  onSuccess: () => {
    // Invalidate ALL queries for this resource
    queryClient.invalidateQueries({ queryKey: queryKeys.all('users') });
    // Close drawer, show toast, etc.
  },
});
```

---

## 6. State Management

### 6.1 Auth Store

```typescript
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  permissions: Set<string>;
  setAuth: (user, accessToken, refreshToken, permissions) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}
```

#### Design Decisions

- **`Set<string>` for permissions**: O(1) lookup vs O(n) for arrays
- **Flat permission strings**: `resource:action` format (e.g., `users:create`)
- **No derived state**: Permissions are stored as-is from the API
- **Selector pattern**: Components subscribe to specific slices to minimize re-renders

### 6.2 UI Store

```typescript
interface UiState {
  mode: 'light' | 'dark';
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  setMode: (mode: 'light' | 'dark') => void;
  toggleMode: () => void;
  toggleSidebar: () => void;
  toggleCollapsed: () => void;
}
```

#### Future Extensions

```typescript
interface UiState {
  sidebarCollapsed: boolean;
  themeMode: 'light' | 'dark' | 'system';
  density: 'compact' | 'standard' | 'comfortable';
  locale: string;
  breadcrumbs: Breadcrumb[];
  notifications: Notification[];
}
```

### 6.3 Permission System

#### Permission Format

```
{resource}:{action}
```

Examples:
```
users:list        → View users table
users:create      → Create new users
users:update      → Edit existing users
users:delete      → Delete users
users:view        → View user details
banking:approve   → Approve banking applications (custom action)
overview:view     → Access the dashboard
```

#### Permission Checking

```typescript
// Hook-based (in components)
const canCreate = usePermission('users:create');

// Store-based (in services/utils)
const can = useAuthStore.getState().hasPermission('users:create');

// Component-based (declarative)
<PermissionGate permission="users:create">
  <CreateButton />
</PermissionGate>
```

#### Permission Flow

```
API Login Response
  └── permissions: ["users:list", "users:create", ...]
        └── authStore.setAuth(user, token, refresh, permissions)
              └── permissions = new Set(permissions)
                    └── Component: usePermission("users:create") → true/false
                          └── UI: Show/hide element
```

---

## 7. Module Development Guide

### 7.1 Creating a New Module

Follow this checklist for every new module:

```
□ 1. Create folder: src/modules/{moduleName}/
□ 2. Define types: {moduleName}Types.ts
□ 3. Create service: {moduleName}Service.ts
□ 4. Define Zod schema: {moduleName}Schema.ts
□ 5. Create page: {moduleName}Page.tsx
□ 6. Add route to App.tsx
□ 7. Add sidebar link to AdminLayout.tsx
□ 8. Add permissions to authStore (dev/mock)
□ 9. Add mock API handlers (if needed)
□ 10. Test permissions gating
```

### 7.2 CRUD Module Example (Step-by-Step)

#### Step 1: Define Types

```typescript
// modules/products/productsTypes.ts
export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  category: string;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
}

export interface CreateProductDto {
  name: string;
  sku: string;
  price: number;
  category: string;
}

export type UpdateProductDto = Partial<CreateProductDto>;
```

#### Step 2: Create Service

```typescript
// modules/products/productsService.ts
import { api } from '@/platform/api';
import type { Product, CreateProductDto, UpdateProductDto } from './productsTypes';

export const productsService = {
  list: async (params) => {
    const { data } = await api.get('/products', { params });
    return data;
  },
  create: async (dto: CreateProductDto) => {
    const { data } = await api.post<Product>('/products', dto);
    return data;
  },
  update: async (id: number, dto: UpdateProductDto) => {
    const { data } = await api.put<Product>(`/products/${id}`, dto);
    return data;
  },
  delete: async (id: number) => {
    await api.delete(`/products/${id}`);
  },
};
```

#### Step 3: Define Zod Schema

```typescript
// modules/products/productsSchema.ts
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  sku: z.string().min(1, 'SKU is required').regex(/^[A-Z0-9-]+$/, 'Invalid SKU format'),
  price: z.number().min(0, 'Price must be positive'),
  category: z.string().min(1, 'Category is required'),
});

export type ProductFormValues = z.infer<typeof productSchema>;
```

#### Step 4: Create Page

```typescript
// modules/products/ProductsPage.tsx
import { CrudModule, type CrudModuleConfig } from '@/rms/r-module/CrudModule';
import type { Product } from './productsTypes';
import { productsService } from './productsService';
import { ProductForm } from './ProductForm';

const config: CrudModuleConfig<Product> = {
  resource: 'products',
  title: 'Products',
  columns: [
    { field: 'name', headerName: 'Product Name', flex: 1, minWidth: 200 },
    { field: 'sku', headerName: 'SKU', width: 140 },
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
      valueFormatter: (value) => `$${Number(value).toFixed(2)}`,
    },
    { field: 'category', headerName: 'Category', width: 160 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
  ],
  fetchList: productsService.list,
  onCreate: productsService.create,
  onUpdate: productsService.update,
  onDelete: productsService.delete,
  renderForm: (props) => <ProductForm {...props} />,
  permissions: {
    list: 'products:list',
    create: 'products:create',
    update: 'products:update',
    delete: 'products:delete',
    view: 'products:view',
  },
};

export default function ProductsPage() {
  return <CrudModule config={config} />;
}
```

#### Step 5: Register Module in APP_CONFIG

Modules are now registered dynamically via `services/mock/config.ts`.

```typescript
// services/mock/config.ts
export const APP_CONFIG: AppConfig = {
  // ...
  modules: [
    // ...
    {
      id: 'products',
      name: 'Products',
      path: '/products',
      icon: 'InventoryIcon',
      permissions: ['products:list']
    },
  ]
};
```

### 7.3 Dashboard Module Example

```typescript
// modules/analytics/AnalyticsPage.tsx
import { DashboardModule } from '@/rms/r-module/DashboardModule';
import { useQuery } from '@tanstack/react-query';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const { data: stats } = useQuery({
    queryKey: ['analytics', 'stats'],
    queryFn: () => analyticsService.getStats(),
  });

  return (
    <DashboardModule
      config={{
        kpis: [
          { title: 'Page Views', value: stats?.pageViews ?? '—', change: 15.3 },
          { title: 'Bounce Rate', value: stats?.bounceRate ?? '—', change: -2.1 },
          { title: 'Avg Session', value: stats?.avgSession ?? '—', change: 8.7 },
          { title: 'Conversions', value: stats?.conversions ?? '—', change: 22.4 },
        ],
        widgets: [
          {
            title: 'Traffic Over Time',
            span: 8,
            render: () => (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={stats?.trafficData ?? []}>
                  <Area type="monotone" dataKey="views" fill="#2563EB" fillOpacity={0.1} stroke="#2563EB" />
                </AreaChart>
              </ResponsiveContainer>
            ),
          },
        ],
      }}
    />
  );
}
```

---

## 8. UI / UX Specifications

### 8.1 Layout System

The RMA layout is handled by the `LayoutEngine`, which uses a modular approach to separate shell concerns.

#### Architecture

```
rms/r-layout/
├── LayoutEngine.tsx      # Main layout wrapper & grid
├── components/
│   ├── Sidebar.tsx       # Navigation drawer & footer
│   ├── Topbar.tsx        # App bar & breadcrumbs
│   └── Logo.tsx          # Shared brand component
└── hooks/
    └── useLayout.ts      # Responsive & shell derivation logic
```

#### Layout Components

| Component | Responsibility |
|---|---|
| **Sidebar** | Drawer persistence, navigation items, user info |
| **Topbar** | Breadcrumbs, mobile menu trigger, theme toggle |
| **LayoutEngine** | Responsive margin management, AnimatePresence orchestration |

### 8.2 Theme & Design Tokens

#### Color Palette

```typescript
palette: {
  primary:    { main: '#2563EB', light: '#60A5FA', dark: '#1D4ED8' },
  secondary:  { main: '#7C3AED' },
  background: { default: '#F8FAFC', paper: '#FFFFFF' },
  text:       { primary: '#0F172A', secondary: '#64748B' },
  divider:    '#E2E8F0',
  success:    { main: '#059669', light: '#D1FAE5' },
  warning:    { main: '#D97706', light: '#FEF3C7' },
  error:      { main: '#DC2626', light: '#FEE2E2' },
  info:       { main: '#2563EB', light: '#DBEAFE' },
}
```

#### Typography Scale

| Variant | Weight | Letter Spacing | Use Case |
|---|---|---|---|
| h4 | 700 | -0.02em | Page titles |
| h5 | 700 | -0.01em | Section headers |
| h6 | 600 | default | Card titles |
| subtitle1 | 500 | default | Widget headers |
| body1 | 400 | default | Body text |
| body2 | 400 | default | Secondary text |
| caption | 400 | default | Metadata |
| button | 600 | default | Button labels (no uppercase) |

#### Border Radius

| Element | Radius |
|---|---|
| Global default | 12px |
| Buttons | 10px |
| Cards | 16px |
| Chips | 8px |
| Drawer | 16px 0 0 16px |
| DataGrid container | 12px |
| Search input | 10px |

#### Shadow System

```css
/* Card shadow */
0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)

/* Button hover shadow */
0 4px 14px rgba(37, 99, 235, 0.3)

/* Sidebar shadow (when floating) */
4px 0 24px rgba(0,0,0,0.08)
```

### 8.3 Animation Standards

All animations use **Framer Motion** with these standards:

#### Page Transitions

```typescript
initial={{ opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3 }}
```

#### Staggered Lists (KPI Cards)

```typescript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: index * 0.08, duration: 0.3 }}
```

#### Widget Entries

```typescript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
```

#### Drawer Animations

MUI Drawer's built-in slide animation (no custom Framer Motion needed).

#### Rules

1. **Duration**: 200-350ms for most transitions
2. **Easing**: Use default spring or ease curves
3. **Direction**: Prefer Y-axis (vertical) for content entering
4. **Stagger**: 60-100ms delay between sequential items
5. **No animation on**: Data changes within existing views (prevents jank)

### 8.4 Responsive Design

#### Breakpoints (MUI defaults)

| Breakpoint | Width | Description |
|---|---|---|
| `xs` | 0px | Mobile portrait |
| `sm` | 600px | Mobile landscape / small tablet |
| `md` | 900px | Tablet |
| `lg` | 1200px | Desktop |
| `xl` | 1536px | Large desktop |

#### Responsive Behaviors

| Component | Mobile (`xs`) | Tablet (`sm-md`) | Desktop (`lg+`) |
|---|---|---|---|
| Sidebar | Hidden (overlay) | Collapsed (72px) | Expanded (260px) |
| KPI grid | 1 column | 2 columns | 4 columns |
| Widget grid | 1 column | 1-2 columns | Configurable span |
| DataGrid | Horizontal scroll | Full width | Full width |
| Drawers | Full width | 480px | 480px |
| Content padding | 16px | 24px | 32px |

---

## 9. Security & Permissions

### Permission Model

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────┐
│   API Login  │────▶│  JWT + Perms    │────▶│  Auth Store  │
└──────────────┘     └─────────────────┘     └──────────────┘
                                                     │
                              ┌───────────────────────┤
                              ▼                       ▼
                     ┌─────────────────┐    ┌──────────────────┐
                     │ UI Permission   │    │ API Interceptor  │
                     │ Gate (frontend) │    │ (JWT in headers) │
                     └─────────────────┘    └──────────────────┘
```

### Security Rules

1. **Never trust the frontend**: Permissions are enforced on the API. Frontend gating is UX-only.
2. **No role storage in user table**: Roles go in a separate `user_roles` table.
3. **No localStorage for auth checks**: Use Zustand store hydrated from secure token.
4. **JWT rotation**: Implement refresh token rotation to prevent token theft.
5. **CSRF protection**: Use `SameSite=Strict` cookies or CSRF tokens.
6. **Input sanitization**: All user input validated with Zod before submission.

### Permission Hierarchy (Recommended)

```
Super Admin  → all permissions
Admin        → all except system:* permissions
Manager      → module:list, module:view, module:create, module:update
Viewer       → module:list, module:view only
Custom       → granular per-resource permissions
```

---

## 10. Testing Strategy

### Test Pyramid

```
          ╱╲
         ╱  ╲        E2E Tests (Cypress/Playwright)
        ╱    ╲       → Critical user flows
       ╱──────╲
      ╱        ╲     Integration Tests (React Testing Library)
     ╱          ╲    → Module pages, form submissions
    ╱────────────╲
   ╱              ╲   Unit Tests (Vitest)
  ╱                ╲  → Services, utils, stores, schemas
 ╱──────────────────╲
```

### What to Test

| Layer | Tool | What to Test |
|---|---|---|
| Zod schemas | Vitest | Valid/invalid inputs, edge cases |
| Services | Vitest + MSW | API call parameters, response mapping |
| Stores | Vitest | State transitions, permission checks |
| RMA components | RTL | Config rendering, action visibility |
| Module pages | RTL | Full page render, permission gating |
| Critical flows | Playwright | Login → CRUD → logout |

### Test File Convention

```
modules/users/
├── UsersPage.tsx
├── UsersPage.test.tsx          # Integration test
├── usersService.ts
├── usersService.test.ts        # Unit test
├── usersSchema.ts
└── usersSchema.test.ts         # Schema validation test
```

---

## 11. Deployment & Build

### Build Configuration

```bash
# Development
npm run dev          # Vite dev server (HMR)

# Production build
npm run build        # TypeScript check + Vite build

# Preview production build
npm run preview      # Serve production bundle locally

# Tests
npm run test         # Run all tests (Vitest)
npm run test:watch   # Watch mode
```

### Environment Variables

```env
VITE_API_BASE_URL=https://api.example.com
VITE_APP_NAME=Admin Portal
VITE_SENTRY_DSN=https://...        # Error tracking
VITE_GA_ID=G-XXXXXX                # Analytics
```

### Build Output

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js          # Main bundle
│   ├── vendor-[hash].js         # Dependencies
│   └── index-[hash].css         # Styles
└── favicon.ico
```

---

## 12. Conventions & Best Practices

### TypeScript Rules

| Rule | Example |
|---|---|
| No `any` | Use `unknown` + type narrowing |
| Explicit return types on services | `async (): Promise<User[]>` |
| Generics for reusable components | `CrudModule<T extends { id: number }>` |
| `as const` for query keys | `['users', 'list'] as const` |
| Discriminated unions for state | `type Status = 'idle' \| 'loading' \| 'error'` |

### Import Order

```typescript
// 1. React / framework
import { useState, useCallback } from 'react';

// 2. Third-party libraries
import { useQuery } from '@tanstack/react-query';
import { DataGrid } from '@mui/x-data-grid';

// 3. Internal absolute imports
import { useAuthStore } from '@/store';
import { queryKeys } from '@/services/queryClient';

// 4. Relative imports
import type { User } from './usersTypes';
import { usersService } from './usersService';
```

### Component Patterns

```typescript
// ✅ Config-driven (RMA way)
const config = { columns, fetchList, ... };
return <CrudModule config={config} />;

// ❌ Imperative (anti-pattern)
const [data, setData] = useState([]);
useEffect(() => { fetchData().then(setData) }, []);
return <Table data={data} ... />;
```

### Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Components | PascalCase | `UserForm.tsx` |
| Hooks | camelCase + `use` prefix | `usePermission.ts` |
| Services | camelCase + `Service` suffix | `usersService.ts` |
| Types | PascalCase (interfaces) | `interface User {}` |
| DTOs | PascalCase + `Dto` suffix | `CreateUserDto` |
| Enums | PascalCase | `UserStatus` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_PAGE_SIZE` |
| Query keys | camelCase factory | `queryKeys.list('users')` |
| Permissions | lowercase `resource:action` | `users:create` |

---

## 13. Roadmap & Extension Points

### Phase 1 — Foundation ✅

- [x] Project setup (Vite + TypeScript + MUI)
- [x] Folder structure
- [x] Theme configuration
- [x] Admin layout with sidebar
- [x] Auth store with permissions
- [x] Axios instance with interceptors
- [x] React Query client + key factory
- [x] Mock API layer
- [x] CrudModule engine (Modularized)
- [x] DashboardModule engine
- [x] LayoutEngine (Modularized)
- [x] Users module (CRUD)
- [x] Jobs module (CRUD)
- [x] Banking module (CRUD + custom actions)
- [x] Overview dashboard
- [x] AutoForm / AutoView components
- [x] Alias support (@/*) implementation
- [x] Dynamic Module Registration (via config)

### Phase 2 — Enhanced Engine

- [ ] FormModule (Zod-driven dynamic forms)
- [ ] Multi-step wizard support
- [ ] DialogHost (centralized dialog management)
- [ ] Column density toggle
- [ ] Advanced filters panel
- [ ] Bulk actions (multi-select)
- [ ] CSV/Excel export
- [ ] Row expand details

### Phase 3 — Enterprise Features

- [ ] Dark mode toggle
- [ ] Real JWT authentication
- [ ] Refresh token rotation
- [ ] Role-based route guards
- [ ] Activity audit log
- [ ] Real-time notifications (WebSocket)
- [ ] File upload module
- [ ] Multi-language (i18n)

### Phase 4 — DevOps & Quality

- [ ] Comprehensive test suite (80%+ coverage)
- [ ] Storybook for component docs
- [ ] CI/CD pipeline
- [ ] Performance monitoring (Web Vitals)
- [ ] Error tracking (Sentry)
- [ ] API documentation (OpenAPI)

### Phase 5 — Advanced UI

- [ ] Drag-and-drop kanban board
- [ ] Calendar/scheduler view
- [ ] Rich text editor integration
- [ ] Advanced charting (drill-down, real-time)
- [ ] Map visualizations
- [ ] PDF report generation

---

## Appendix A: Quick Reference Card

```
│  New CRUD page:                                      │
│    1. types → service → schema → page → route       │
│    2. Page = <CrudModule config={...} />            │
│                                                      │
│  New Dashboard:                                      │
│    1. <DashboardModule config={{ kpis, widgets }} /> │
│                                                      │
│  Permission check:                                   │
│    Hook:  usePermission('resource:action')           │
│    Gate:  <PermissionGate permission="...">          │
│    Store: useAuthStore.getState().hasPermission('...')│
│                                                      │
│  Query key:                                          │
│    queryKeys.all('users')                            │
│    queryKeys.list('users', { page: 0 })             │
│    queryKeys.detail('users', 42)                     │
│                                                      │
│  Invalidate:                                         │
│    qc.invalidateQueries({                            │
│      queryKey: queryKeys.all('users')                │
│    })                                                │
│                                                      │
│  File structure:                                     │
│    modules/{name}/                                   │
│      {name}Page.tsx                                  │
│      {name}Service.ts                                │
│      {name}Types.ts                                  │
│      {name}Schema.ts                                 │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

*This document is the single source of truth for the RMA architecture. All contributors must follow these guidelines when building new modules or extending the engine.*

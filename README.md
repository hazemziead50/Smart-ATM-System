# 🏦 Smart ATM System

A full-featured ATM banking simulation built with React, TypeScript, and Zustand. Users can log in, view their balance, deposit/withdraw money, transfer funds to other users, track transaction history, follow currency rates, and customize their experience with a dark/light theme.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React + TypeScript** | UI and type safety |
| **Vite** | Build tool and dev server |
| **Zustand** | Global state management (with `persist` middleware where needed) |
| **React Router v6** | Client-side routing and protected routes |
| **CSS Modules** | Scoped, component-level styling |
| **mockapi.io** | Mock REST API backend for user data |

---

## ✨ Features

### 🔐 Authentication
- Login with username + PIN, validated against mock API user records.
- Session persists across page refreshes via Zustand's `persist` middleware (stores only the `user` object in `localStorage`).
- **Protected Routes**: any authenticated page (`/dashboard`, `/deposit`, `/withdraw`, `/transfer`, `/history`, `/settings`, `/watchlist`) automatically redirects unauthenticated users back to the login page.
- Logout clears the session and returns the user to `/`.

### 🖥️ Dashboard
- Displays user profile (photo or initials fallback), username, and account status.
- **Balance Card**: shows current balance with dynamic color — green when positive, red when zero — updating live after every transaction.
- **Quick Actions**: one-tap navigation to Deposit, Withdraw, Transfer, and History.
- **Birthday Popup**: automatically detects if today matches the user's birthday and shows a one-time congratulations modal — shown only once per browser session (via `sessionStorage`), not on every dashboard visit.
- Quick-access icons to Settings and Currency Watchlist.

### 💰 Deposit
- Form-based deposit with real-time validation (must be a positive number).
- Updates the user's balance and appends a new transaction record (`type`, `amount`, `date`) to mock API via `PUT`.
- Quick-amount shortcut buttons (100 / 200 / 500).

### 💸 Withdraw
- Same validation as Deposit, plus a balance-sufficiency check (can't withdraw more than the available balance).
- Displays available balance prominently before the input field.
- Quick-amount shortcuts, disabled automatically if they exceed the current balance.

### 🔁 Transfer
- Transfer funds to another registered user by username.
- Looks up the recipient in the mock API, validates they exist and aren't the sender themselves.
- Updates **both** accounts atomically in the same operation: debits the sender (`Transfer` transaction) and credits the recipient (`Deposit` transaction), each with a cross-reference to the other party (`target_user`).

### 📜 Transaction History
- Displays all deposits, withdrawals, and transfers, sorted from most recent to oldest.
- Color-coded and icon-coded by transaction type (green = deposit, orange = withdraw, blue = transfer).
- **Pagination**: transactions are split into pages (5 per page) with page-number navigation and prev/next controls.
- Friendly empty state when no transactions exist yet.

### 💹 Currency Watchlist
- Displays a fixed list of currencies (USD, EUR, JOD) with their exchange rates.
- Users can star/unstar any currency to add or remove it from their personal watchlist.
- Watchlist state lives in a **dedicated Zustand store with no persistence** — it's intentionally in-memory only and resets on page refresh, per the state-management practice requirement.

### ⚙️ Settings
- **Theme Toggle**: switch between light and dark mode. Implemented via a separate `useThemeStore` (persisted to `localStorage`) that sets a `data-theme` attribute on the document root; all page styles read their colors from CSS custom properties (`theme.css`) so every page re-themes instantly.
- **Reset Account**: a "danger zone" action that zeroes out the balance and clears all transaction history, gated behind an inline confirmation step (no destructive action fires without an explicit second click).

### 🔔 Toast Notifications
- A global, non-blocking notification system (separate Zustand store, no persistence) for confirming successful operations (deposit, withdraw, transfer, reset) or surfacing errors.
- Toasts auto-dismiss after 3 seconds and can also be dismissed manually; multiple toasts stack cleanly.
- Rendered once at the app root so any page can trigger a toast without prop drilling.

### 🚫 404 Page
- Catch-all route (`path="*"`) for any unmatched URL.
- Offers a smart "go home" button: authenticated users are sent to `/dashboard`, everyone else to the login page.

### 🌓 Theming & Design System
- All pages share a consistent visual language: gradient backgrounds, white/dark rounded cards, and page-specific accent colors (purple for Dashboard/Login, green for Deposit, orange for Withdraw, blue for Transfer).
- Full RTL (right-to-left) Arabic layout throughout, with careful `direction: ltr` overrides for numbers, dates, and usernames so they display correctly inside an RTL page.
- CSS Modules used everywhere to keep styles scoped per component/page and avoid class name collisions.

### 🌱 Data Seeding
- A one-time seeding utility checks the mock API on app startup; if no users exist yet, it populates a starter set of accounts (with realistic linked transactions) automatically — guarded against React 18 Strict Mode's double-invoke behavior via a `useRef` flag.

---

## 📁 Project Structure (high level)

```
src/
├── Pages/              # Route-level screens (Login, Dashboard, Deposit, Withdraw, Transfer, History, Settings, Watchlist, Notfound)
│   └── styles/          # One CSS Module per page
├── Component/           # Reusable, self-contained UI pieces (BalanceCard, BirthdayModal, QuickActions, ToastContainer, ResetAccount, ThemeToggle)
├── Store/               # Zustand stores (useAuthStore, useThemeStore, useWatchlistStore, useToastStore)
├── Routers/             # AppRoutes + ProtectedRoute
├── Types/               # Shared TypeScript interfaces
├── Utils/               # Seeding script, currency mock data
└── theme.css            # CSS custom properties for light/dark themes
```

---

## 🧠 Key Architectural Decisions

- **Self-contained components**: components like `BalanceCard` and `Birthday` pull their own data straight from the relevant Zustand store via selectors, rather than receiving it as props — keeping page components thin and components reusable.
- **Selective persistence**: `useAuthStore` and `useThemeStore` persist to `localStorage` (session and theme should survive refresh); `useWatchlistStore` and `useToastStore` intentionally do **not** persist (in-memory by design).
- **Optional chaining & nullish coalescing** used throughout for safe access to potentially-missing user data (`user?.transactions?.length ?? 0`).

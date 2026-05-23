# Enterprise Design System — Walkthrough

## What Was Built

A complete, production-ready CSS design system for a **Loan Sanction & Employee Management Web Application** — 19 files totaling ~317 KB.

---

## File Architecture

```
e:\Personal\StyleComponent\
├── index.html                         ← Full sample dashboard (48.6 KB)
└── assets/
    ├── css/
    │   ├── app.css                    ← Master import (single entry point)
    │   ├── variables.css              ← 80+ CSS custom properties + resets
    │   ├── theme.css                  ← Dark theme variable overrides
    │   ├── dark-mode.css              ← Component-level dark refinements
    │   ├── layout.css                 ← Page grid, content wrappers
    │   ├── sidebar.css                ← Collapsible multi-level sidebar
    │   ├── navbar.css                 ← Sticky top navbar + dropdowns
    │   ├── buttons.css                ← Button system (sizes, variants)
    │   ├── forms.css                  ← Form controls, validation, wizard
    │   ├── tables.css                 ← Enterprise data tables
    │   ├── cards.css                  ← Dashboard/KPI/stat/activity cards
    │   ├── components.css             ← Modals, badges, alerts, timeline, skeletons
    │   ├── utilities.css              ← Tailwind-inspired utility classes
    │   ├── animations.css             ← Keyframes & transition utilities
    │   ├── responsive.css             ← Mobile → desktop breakpoints
    │   └── pages.css                  ← 9 page-specific style modules
    └── js/
        ├── theme-toggle.js            ← Dark/light toggle + localStorage
        └── sidebar.js                 ← Sidebar collapse + submenu + mobile
```

---

## Key Design Decisions

| Decision | Detail |
|---|---|
| **Primary color** | `#2563eb` (Salesforce/Microsoft blue) |
| **Dark palette** | GitHub Dark inspired (`#0d1117` body, `#161b22` surfaces) |
| **Font stack** | Inter → Segoe UI → Roboto → system sans-serif |
| **Base font size** | 14px (enterprise standard) |
| **CSS architecture** | CSS Custom Properties — no SASS/build required |
| **Theme switching** | `data-theme="dark"` on `<html>`, persisted via localStorage |
| **Naming** | BEM-inspired: `.sidebar__item--active` |
| **Icons** | Font Awesome 6 (CDN) |
| **Bootstrap strategy** | Override with same selectors + custom enterprise classes |

---

## Integration in ASP.NET Core MVC

Add this to your `_Layout.cshtml` `<head>`:

```html
<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<!-- Font Awesome 6 -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

<!-- Bootstrap 5 -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- Design System (loads all 15 CSS files) -->
<link rel="stylesheet" href="~/assets/css/app.css">
```

Before `</body>`:

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="~/assets/js/theme-toggle.js"></script>
<script src="~/assets/js/sidebar.js"></script>
```

---

## JavaScript APIs

### ThemeManager (theme-toggle.js)
```js
ThemeManager.toggle();           // Switch light ↔ dark
ThemeManager.setTheme('dark');   // Set specific theme
ThemeManager.getTheme();         // Returns 'light' or 'dark'

// Listen for changes
document.addEventListener('themechange', (e) => {
    console.log(e.detail.theme, e.detail.previous);
});
```

### SidebarManager (sidebar.js)
```js
SidebarManager.toggle();        // Toggle collapse/expand (or mobile open/close)
SidebarManager.collapse();      // Collapse to icon-only
SidebarManager.expand();        // Expand to full width
SidebarManager.isCollapsed();   // Check state

// Listen for changes
document.addEventListener('sidebarchange', (e) => {
    console.log(e.detail.collapsed);
});
```

---

## Page-Specific CSS Classes

The `pages.css` file provides styles for 9 enterprise modules:

| Page | Root class | Key features |
|---|---|---|
| Login | `.page-login` | Centered card, logo, social login, remember me |
| Dashboard | `.page-dashboard` | KPI grid, chart areas, welcome banner, quick actions |
| Attendance | `.page-attendance` | Calendar grid, day status colors, legend, summary |
| Loan Application | `.page-loan` | Multi-step wizard, document upload, status tracker |
| Profile | `.page-profile` | Banner header, avatar overlap, detail grid, tabs |
| Employee Management | `.page-employees` | Toolbar, card grid view |
| Reports | `.page-reports` | Chart grid, metrics, export bar |
| Settings | `.page-settings` | 2-column layout, toggle rows |
| Approvals | `.page-approvals` | Pipeline stages, approval cards, history timeline |

---

## Verification

- ✅ All 16 CSS files created and non-empty (239 KB total)
- ✅ Both JS files with full public API (29.5 KB)
- ✅ Sample `index.html` demonstrating full dashboard layout
- ✅ Theme toggle with localStorage persistence
- ✅ Sidebar collapse with localStorage persistence
- ✅ Font Awesome icons throughout
- ✅ Responsive breakpoints at 576/768/992/1200/1400px
- ✅ Dark mode with deep component-level overrides
- ✅ BEM naming convention
- ✅ All values reference CSS custom properties (no raw colors/sizes)

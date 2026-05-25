# ENTERPRISE AI GOVERNANCE RULES
# LendersTitle.UI

This project is an ENTERPRISE ERP APPLICATION built using:

- ASP.NET Core MVC
- Razor Views
- Bootstrap 5
- jQuery
- SQL Server
- Entity Framework Core
- Service + Repository Pattern

The system includes:
- Loan Management
- Attendance Management
- Employee Management
- Branch Management
- ERP Operations

This is NOT a beginner MVC project.

The architecture must remain:
- Modular
- Scalable
- Maintainable
- Enterprise-grade

---

# CORE DEVELOPMENT PRINCIPLES

Always follow:

- Separation of Concerns
- Reusability
- Thin Controllers
- Modular Frontend Architecture
- Reusable Components
- SPA-like Rendering
- Enterprise UI Consistency

Avoid:
- Monolithic files
- Inline CSS
- Inline JavaScript
- Fat controllers
- Duplicate logic

---

# PROJECT ARCHITECTURE

MVC Flow:

Controller
? Service
? Repository
? Database

Frontend Flow:

Layout
? Partial Views
? AJAX Rendering
? Dynamic UI Updates

---

# ENTERPRISE UI ARCHITECTURE

The UI follows:

- Shared Layout System
- Reusable Components
- Partial Views
- AJAX Page Rendering
- Modular CSS
- Modular JavaScript

The UI should feel similar to:
- Microsoft 365
- Google Workspace
- Zoho ERP
- Salesforce
- SAP ERP

---

# FOLDER STRUCTURE RULES

Controllers:
Controllers/

Models:
Models/

Views:
Views/

Shared Layouts:
Views/Shared/

Shared Components:
Views/Shared/Components/

Global Assets:
wwwroot/assets/

CSS:
wwwroot/assets/css/

JavaScript:
wwwroot/assets/js/

---

# CSS ARCHITECTURE RULES

CSS is organized into:

core/
layout/
components/
utilities/

DO NOT:
- Dump everything into pages.css
- Create giant CSS files
- Duplicate component styles

Use:
- Existing utility classes
- Existing component styles
- Existing variables

---

# JS ARCHITECTURE RULES

JavaScript is organized into:

core/
components/
modules/

core/
- app init
- AJAX helpers
- sidebar
- theme toggle

components/
- reusable components

modules/
- page-specific logic

DO NOT:
- Put all code in app.js
- Write inline JS
- Duplicate module logic

---

# MODULE JS RULES

Each module/page must have dedicated JS files.

Example:

wwwroot/assets/js/modules/branch/

- branch-index.js
- branch-create.js
- branch-edit.js

---

# PAGE CSS RULES

Every major page/module should maintain dedicated CSS.

Example:

wwwroot/assets/css/modules/branch/

- branch-index.css
- branch-create.css
- branch-edit.css

Avoid giant global CSS dumping.

---

# PARTIAL VIEW RULES

Large pages/forms must use partial views.

Examples:
- _Form.cshtml
- _Toolbar.cshtml
- _Filters.cshtml
- _List.cshtml

Avoid:
- Massive Razor pages
- Repeated UI blocks

---

# AJAX RENDERING RULES

The application follows SPA-like MVC rendering.

Use:
- AJAX
- PartialView()
- Dynamic content loading

Avoid unnecessary full page reloads.

---

# VIEW COMPONENT RULES

Use ViewComponents only for reusable dynamic sections.

Examples:
- Sidebar
- Dashboard cards
- Attendance summary
- Notifications

Do NOT misuse ViewComponents for full pages.

---

# CONTROLLER RULES

Controllers must remain THIN.

Controllers should:
- Receive requests
- Validate input
- Call services
- Return responses

Controllers should NOT:
- Contain business logic
- Contain SQL
- Perform complex calculations

---

# SERVICE RULES

Business logic belongs inside Services.

Examples:
- Attendance calculations
- Loan workflow
- Approval rules
- Validation logic

---

# REPOSITORY RULES

Repositories handle:
- Database access
- EF Core operations
- Queries
- Stored procedure calls

Repositories should NOT contain business logic.

---

# FILE DESTINATION RULES

Views:
Views/{ModuleName}/

Module JS:
wwwroot/assets/js/modules/{module}/

Module CSS:
wwwroot/assets/css/modules/{module}/

Reusable Components:
Views/Shared/Components/

Reusable JS:
wwwroot/assets/js/components/

Reusable CSS:
wwwroot/assets/css/components/

---

# ENTERPRISE DESIGN RULES

Always maintain:
- Professional spacing
- Consistent typography
- Reusable cards
- Responsive layouts
- Dark/light mode support

Avoid:
- Fancy startup UI
- Random gradients
- Over-animation
- Inconsistent spacing

---

# RESPONSIVE DESIGN RULES

Support:
- Desktop
- Laptop
- Tablet
- Mobile

Use Bootstrap properly.

Never break layout responsiveness.

---

# SECURITY RULES

Always validate:
- Anti-forgery token
- Input validation
- SQL injection prevention
- XSS prevention

Never trust client-side validation only.

---

# PERFORMANCE RULES

Avoid:
- Giant JS files
- Giant CSS files
- Large DOM rendering
- Duplicate AJAX requests

Prefer:
- Modular assets
- Partial rendering
- Lazy loading where possible

---

# FUTURE SCALABILITY RULE

This ERP system will continue growing.

Always optimize for:
- Maintainability
- Scalability
- Team collaboration
- Long-term architecture

Never optimize for:
- Quick hacks
- Temporary shortcuts
- One-off implementations
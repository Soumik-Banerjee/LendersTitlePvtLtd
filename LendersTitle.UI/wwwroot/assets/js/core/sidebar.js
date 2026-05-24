/* ==========================================================================
   SIDEBAR.JS — Collapsible Sidebar with Submenu & Mobile Support
   ==========================================================================
   Usage:
   1. Include this script at the bottom of your page (before </body>)
   2. Uses vanilla JS (jQuery-compatible but not required)
   3. Auto-initializes on DOMContentLoaded
   
   HTML Requirements:
   - .app-wrapper              — outer container (receives .sidebar-collapsed / .sidebar-open)
   - .sidebar                  — the sidebar element
   - .sidebar__collapse-btn    — button to toggle collapse
   - .sidebar__item--has-children — items with submenus
   - .sidebar__item-arrow      — chevron arrow in expandable items
   - .sidebar__submenu         — nested submenu <ul>
   - .navbar-top__toggle       — hamburger toggle in navbar (mobile)
   - .sidebar-backdrop         — overlay behind sidebar on mobile

   API:
   - SidebarManager.toggle()           — Toggle collapsed state
   - SidebarManager.collapse()         — Collapse sidebar
   - SidebarManager.expand()           — Expand sidebar
   - SidebarManager.isCollapsed()      — Check collapsed state
   - SidebarManager.toggleSubmenu(el)  — Toggle a specific submenu
   - SidebarManager.openMobile()       — Open mobile drawer
   - SidebarManager.closeMobile()      — Close mobile drawer
   ========================================================================== */

;(function (window, document) {
    'use strict';

    /* ----------------------------------------------------------------------
       CONFIGURATION
       ---------------------------------------------------------------------- */
    var STORAGE_KEY        = 'sidebar-collapsed';
    var COLLAPSED_CLASS    = 'sidebar-collapsed';
    var OPEN_CLASS         = 'sidebar-open';
    var EXPANDED_CLASS     = 'sidebar__item--expanded';
    var ACTIVE_CLASS       = 'sidebar__item--active';
    var SUBMENU_OPEN_CLASS = 'open';
    var MOBILE_BREAKPOINT  = 992; // px — matches responsive.css lg breakpoint

    /* ----------------------------------------------------------------------
       SIDEBAR MANAGER
       ---------------------------------------------------------------------- */
    var SidebarManager = {

        /** @type {HTMLElement|null} */
        wrapper: null,
        /** @type {HTMLElement|null} */
        sidebar: null,
        /** @type {HTMLElement|null} */
        backdrop: null,

        /**
         * Initialize the sidebar system.
         */
        init: function () {
            this.wrapper  = document.querySelector('.app-wrapper');
            this.sidebar  = document.querySelector('.sidebar');
            this.backdrop = document.querySelector('.sidebar-backdrop');

            if (!this.wrapper || !this.sidebar) {
                // Sidebar elements not found — skip initialization
                return;
            }

            this._restoreState();
            this._bindCollapseToggle();
            this._bindNavbarToggle();
            this._bindSubmenus();
            this._bindBackdrop();
            this._bindKeyboard();
            this._watchResize();
            this._setActiveItem();
        },

        /* ------------------------------------------------------------------
           PUBLIC API
           ------------------------------------------------------------------ */

        /**
         * Toggle sidebar between collapsed and expanded.
         */
        toggle: function () {
            if (this._isMobile()) {
                if (this.wrapper.classList.contains(OPEN_CLASS)) {
                    this.closeMobile();
                } else {
                    this.openMobile();
                }
            } else {
                if (this.isCollapsed()) {
                    this.expand();
                } else {
                    this.collapse();
                }
            }
        },

        /**
         * Collapse the sidebar to icon-only mode.
         */
        collapse: function () {
            if (!this.wrapper) return;
            this.wrapper.classList.add(COLLAPSED_CLASS);
            this._closeAllSubmenus();
            this._save(true);
            this._dispatchEvent('sidebarchange', { collapsed: true });
        },

        /**
         * Expand the sidebar to full width.
         */
        expand: function () {
            if (!this.wrapper) return;
            this.wrapper.classList.remove(COLLAPSED_CLASS);
            this._save(false);
            this._dispatchEvent('sidebarchange', { collapsed: false });
        },

        /**
         * Check if sidebar is currently collapsed.
         * @returns {boolean}
         */
        isCollapsed: function () {
            return this.wrapper ? this.wrapper.classList.contains(COLLAPSED_CLASS) : false;
        },

        /**
         * Open sidebar as mobile drawer.
         */
        openMobile: function () {
            if (!this.wrapper) return;
            this.wrapper.classList.add(OPEN_CLASS);
            this.wrapper.classList.remove(COLLAPSED_CLASS);
            document.body.style.overflow = 'hidden'; // Prevent background scroll
            
            // Ensure backdrop exists
            if (!this.backdrop) {
                this.backdrop = document.createElement('div');
                this.backdrop.className = 'sidebar-backdrop';
                this.wrapper.appendChild(this.backdrop);
                this._bindBackdrop();
            }

            // Focus trap — focus the sidebar
            if (this.sidebar) {
                this.sidebar.setAttribute('tabindex', '-1');
                this.sidebar.focus();
            }
        },

        /**
         * Close the mobile sidebar drawer.
         */
        closeMobile: function () {
            if (!this.wrapper) return;
            this.wrapper.classList.remove(OPEN_CLASS);
            document.body.style.overflow = '';
        },

        /**
         * Toggle a submenu open/closed.
         * @param {HTMLElement} parentItem - The .sidebar__item--has-children element
         */
        toggleSubmenu: function (parentItem) {
            if (!parentItem) return;

            var submenu = parentItem.querySelector('.sidebar__submenu');
            var arrow   = parentItem.querySelector('.sidebar__item-arrow');
            if (!submenu) return;

            var isExpanded = parentItem.classList.contains(EXPANDED_CLASS);

            if (isExpanded) {
                // Close this submenu
                parentItem.classList.remove(EXPANDED_CLASS);
                submenu.classList.remove(SUBMENU_OPEN_CLASS);
                submenu.style.maxHeight = '0';
                if (arrow) arrow.style.transform = '';
            } else {
                // Optionally close other submenus (accordion behavior)
                this._closeOtherSubmenus(parentItem);

                // Open this submenu
                parentItem.classList.add(EXPANDED_CLASS);
                submenu.classList.add(SUBMENU_OPEN_CLASS);
                submenu.style.maxHeight = submenu.scrollHeight + 'px';
                if (arrow) arrow.style.transform = 'rotate(90deg)';
            }
        },

        /* ------------------------------------------------------------------
           PRIVATE — Binding
           ------------------------------------------------------------------ */

        /**
         * Bind collapse toggle buttons.
         */
        _bindCollapseToggle: function () {
            var self = this;
            var buttons = document.querySelectorAll('.sidebar__collapse-btn');

            for (var i = 0; i < buttons.length; i++) {
                buttons[i].addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    self.toggle();
                });
            }
        },

        /**
         * Bind the navbar hamburger toggle (primarily for mobile).
         */
        _bindNavbarToggle: function () {
            var self = this;
            var toggles = document.querySelectorAll('.navbar-top__toggle');

            for (var i = 0; i < toggles.length; i++) {
                toggles[i].addEventListener('click', function (e) {
                    e.preventDefault();
                    self.toggle();
                });
            }
        },

        /**
         * Bind click handlers on submenu parent items.
         */
        _bindSubmenus: function () {
            var self = this;
            var parents = this.sidebar.querySelectorAll('.sidebar__item--has-children');

            for (var i = 0; i < parents.length; i++) {
                (function (parent) {
                    // Bind click on the parent link itself (not children)
                    var link = parent.querySelector('.sidebar__item-link') || parent;
                    if (link) {
                        link.addEventListener('click', function (e) {
                            // Don't navigate, just toggle submenu
                            e.preventDefault();
                            e.stopPropagation();

                            // If sidebar is collapsed on desktop, expand it first
                            if (self.isCollapsed() && !self._isMobile()) {
                                self.expand();
                                // Small delay to let the sidebar expand visually
                                setTimeout(function () {
                                    self.toggleSubmenu(parent);
                                }, 200);
                            } else {
                                self.toggleSubmenu(parent);
                            }
                        });
                    }
                })(parents[i]);
            }
        },

        /**
         * Bind backdrop click to close mobile sidebar.
         */
        _bindBackdrop: function () {
            var self = this;
            if (this.backdrop) {
                this.backdrop.addEventListener('click', function () {
                    self.closeMobile();
                });
            }
        },

        /**
         * Bind keyboard shortcuts.
         * - Escape: close mobile sidebar
         * - [ or ]: toggle sidebar (when not focused on input)
         */
        _bindKeyboard: function () {
            var self = this;

            document.addEventListener('keydown', function (e) {
                // Escape closes mobile sidebar
                if (e.key === 'Escape' && self.wrapper.classList.contains(OPEN_CLASS)) {
                    self.closeMobile();
                    return;
                }

                // Don't trigger shortcuts when typing in inputs
                var tag = (e.target.tagName || '').toLowerCase();
                if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) {
                    return;
                }

                // [ key toggles sidebar
                if (e.key === '[' && !e.ctrlKey && !e.metaKey && !e.altKey) {
                    e.preventDefault();
                    self.toggle();
                }
            });
        },

        /* ------------------------------------------------------------------
           PRIVATE — State Management
           ------------------------------------------------------------------ */

        /**
         * Restore sidebar state from localStorage.
         */
        _restoreState: function () {
            if (this._isMobile()) {
                // Always collapsed on mobile
                this.wrapper.classList.remove(COLLAPSED_CLASS);
                return;
            }

            var saved = this._getSaved();
            if (saved === 'true') {
                this.wrapper.classList.add(COLLAPSED_CLASS);
            } else {
                this.wrapper.classList.remove(COLLAPSED_CLASS);
            }
        },

        /**
         * Watch for window resize to handle breakpoint changes.
         */
        _watchResize: function () {
            var self = this;
            var debounceTimer;

            window.addEventListener('resize', function () {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(function () {
                    if (self._isMobile()) {
                        // Close mobile sidebar on resize to desktop
                        self.closeMobile();
                    }
                }, 150);
            });
        },

        /**
         * Set the active sidebar item based on current URL.
         */
        _setActiveItem: function () {
            var currentPath = window.location.pathname.toLowerCase();
            var items = this.sidebar.querySelectorAll('.sidebar__item');

            for (var i = 0; i < items.length; i++) {
                var link = items[i].querySelector('a');
                if (!link) continue;

                var href = (link.getAttribute('href') || '').toLowerCase();
                
                // Remove existing active
                items[i].classList.remove(ACTIVE_CLASS);

                // Match current path
                if (href && href !== '#' && href !== '/' && currentPath.indexOf(href) !== -1) {
                    items[i].classList.add(ACTIVE_CLASS);

                    // Auto-expand parent submenu if inside one
                    var parentSubmenu = items[i].closest('.sidebar__submenu');
                    if (parentSubmenu) {
                        var parentItem = parentSubmenu.closest('.sidebar__item--has-children');
                        if (parentItem && !parentItem.classList.contains(EXPANDED_CLASS)) {
                            parentItem.classList.add(EXPANDED_CLASS);
                            parentSubmenu.classList.add(SUBMENU_OPEN_CLASS);
                            parentSubmenu.style.maxHeight = parentSubmenu.scrollHeight + 'px';
                            var arrow = parentItem.querySelector('.sidebar__item-arrow');
                            if (arrow) arrow.style.transform = 'rotate(90deg)';
                        }
                    }
                } else if (href === '/' && currentPath === '/') {
                    items[i].classList.add(ACTIVE_CLASS);
                }
            }
        },

        /* ------------------------------------------------------------------
           PRIVATE — Submenu Helpers
           ------------------------------------------------------------------ */

        /**
         * Close all open submenus.
         */
        _closeAllSubmenus: function () {
            var expanded = this.sidebar.querySelectorAll('.' + EXPANDED_CLASS);
            for (var i = 0; i < expanded.length; i++) {
                expanded[i].classList.remove(EXPANDED_CLASS);
                var submenu = expanded[i].querySelector('.sidebar__submenu');
                if (submenu) {
                    submenu.classList.remove(SUBMENU_OPEN_CLASS);
                    submenu.style.maxHeight = '0';
                }
                var arrow = expanded[i].querySelector('.sidebar__item-arrow');
                if (arrow) arrow.style.transform = '';
            }
        },

        /**
         * Close other submenus (accordion behavior) — only siblings.
         * @param {HTMLElement} currentItem
         */
        _closeOtherSubmenus: function (currentItem) {
            var parent = currentItem.parentElement;
            if (!parent) return;

            var siblings = parent.querySelectorAll(':scope > .sidebar__item--has-children.' + EXPANDED_CLASS);
            for (var i = 0; i < siblings.length; i++) {
                if (siblings[i] !== currentItem) {
                    siblings[i].classList.remove(EXPANDED_CLASS);
                    var submenu = siblings[i].querySelector('.sidebar__submenu');
                    if (submenu) {
                        submenu.classList.remove(SUBMENU_OPEN_CLASS);
                        submenu.style.maxHeight = '0';
                    }
                    var arrow = siblings[i].querySelector('.sidebar__item-arrow');
                    if (arrow) arrow.style.transform = '';
                }
            }
        },

        /* ------------------------------------------------------------------
           PRIVATE — Utilities
           ------------------------------------------------------------------ */

        /**
         * Check if viewport is below mobile breakpoint.
         * @returns {boolean}
         */
        _isMobile: function () {
            return window.innerWidth < MOBILE_BREAKPOINT;
        },

        /**
         * Dispatch a custom event on the document.
         * @param {string} name
         * @param {Object} detail
         */
        _dispatchEvent: function (name, detail) {
            var event;
            try {
                event = new CustomEvent(name, {
                    detail: detail,
                    bubbles: true
                });
            } catch (e) {
                event = document.createEvent('CustomEvent');
                event.initCustomEvent(name, true, false, detail);
            }
            document.dispatchEvent(event);
        },

        /**
         * Save collapsed state to localStorage.
         * @param {boolean} collapsed
         */
        _save: function (collapsed) {
            try {
                localStorage.setItem(STORAGE_KEY, String(collapsed));
            } catch (e) { /* ignore */ }
        },

        /**
         * Get saved collapsed state.
         * @returns {string|null}
         */
        _getSaved: function () {
            try {
                return localStorage.getItem(STORAGE_KEY);
            } catch (e) {
                return null;
            }
        }
    };

    /* ----------------------------------------------------------------------
       DOM READY — Initialize
       ---------------------------------------------------------------------- */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            SidebarManager.init();
        });
    } else {
        SidebarManager.init();
    }

    /* ----------------------------------------------------------------------
       EXPORT — Make globally accessible
       ---------------------------------------------------------------------- */
    window.SidebarManager = SidebarManager;

})(window, document);

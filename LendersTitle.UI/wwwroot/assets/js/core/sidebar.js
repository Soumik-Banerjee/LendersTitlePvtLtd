/* ==========================================================================
   SIDEBAR.JS — Enterprise Collapsible Sidebar with Search & Mobile
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
   - .sidebar__search-input    — search input for filtering navigation

   API:
   - SidebarManager.toggle()           — Toggle collapsed state
   - SidebarManager.collapse()         — Collapse sidebar
   - SidebarManager.expand()           — Expand sidebar
   - SidebarManager.isCollapsed()      — Check collapsed state
   - SidebarManager.toggleSubmenu(el)  — Toggle a specific submenu
   - SidebarManager.openMobile()       — Open mobile drawer
   - SidebarManager.closeMobile()      — Close mobile drawer
   - SidebarManager.search(query)      — Filter sidebar items
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
    var MOBILE_BREAKPOINT  = 992;
    var SEARCH_DEBOUNCE    = 150;

    /* ----------------------------------------------------------------------
       SIDEBAR MANAGER
       ---------------------------------------------------------------------- */
    var SidebarManager = {

        wrapper: null,
        sidebar: null,
        backdrop: null,
        searchInput: null,
        searchClear: null,
        noResults: null,

        /**
         * Initialize the sidebar system.
         */
        init: function () {
            this.wrapper  = document.querySelector('.app-wrapper');
            this.sidebar  = document.querySelector('.sidebar');
            this.backdrop = document.querySelector('.sidebar-backdrop');

            if (!this.wrapper || !this.sidebar) {
                return;
            }

            this.searchInput = this.sidebar.querySelector('.sidebar__search-input');
            this.searchClear = this.sidebar.querySelector('.sidebar__search-clear');
            this.noResults   = this.sidebar.querySelector('.sidebar__search-no-results');

            this._restoreState();
            this._bindCollapseToggle();
            this._bindNavbarToggle();
            this._bindSubmenus();
            this._bindBackdrop();
            this._bindKeyboard();
            this._bindSearch();
            this._watchResize();
            this._setActiveItem();
        },

        /* ------------------------------------------------------------------
           PUBLIC API
           ------------------------------------------------------------------ */

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

        collapse: function () {
            if (!this.wrapper) return;
            this.wrapper.classList.add(COLLAPSED_CLASS);
            this._closeAllSubmenus();
            this._save(true);
            this._clearSearch();
            this._dispatchEvent('sidebarchange', { collapsed: true });
        },

        expand: function () {
            if (!this.wrapper) return;
            this.wrapper.classList.remove(COLLAPSED_CLASS);
            this._save(false);
            this._dispatchEvent('sidebarchange', { collapsed: false });
        },

        isCollapsed: function () {
            return this.wrapper ? this.wrapper.classList.contains(COLLAPSED_CLASS) : false;
        },

        openMobile: function () {
            if (!this.wrapper) return;
            this.wrapper.classList.add(OPEN_CLASS);
            this.wrapper.classList.remove(COLLAPSED_CLASS);
            document.body.style.overflow = 'hidden';

            if (!this.backdrop) {
                this.backdrop = document.createElement('div');
                this.backdrop.className = 'sidebar-backdrop';
                this.wrapper.appendChild(this.backdrop);
                this._bindBackdrop();
            }

            if (this.sidebar) {
                this.sidebar.setAttribute('tabindex', '-1');
                this.sidebar.focus();
            }
        },

        closeMobile: function () {
            if (!this.wrapper) return;
            this.wrapper.classList.remove(OPEN_CLASS);
            document.body.style.overflow = '';
            var submenus = this.sidebar.querySelectorAll('.sidebar__submenu');
            for (var i = 0; i < submenus.length; i++) {
                submenus[i].style.maxHeight = '';
            }
        },

        toggleSubmenu: function (parentItem) {
            if (!parentItem) return;

            var submenu = parentItem.querySelector('.sidebar__submenu');
            var arrow   = parentItem.querySelector('.sidebar__item-arrow');
            if (!submenu) return;

            var isExpanded = parentItem.classList.contains(EXPANDED_CLASS);

            if (isExpanded) {
                parentItem.classList.remove(EXPANDED_CLASS);
                submenu.classList.remove(SUBMENU_OPEN_CLASS);
                submenu.style.maxHeight = '0';
                if (arrow) arrow.style.transform = '';
            } else {
                this._closeOtherSubmenus(parentItem);

                parentItem.classList.add(EXPANDED_CLASS);
                submenu.classList.add(SUBMENU_OPEN_CLASS);
                submenu.style.maxHeight = submenu.scrollHeight + 'px';
                if (arrow) arrow.style.transform = 'rotate(90deg)';
            }
        },

        /**
         * Search/filter sidebar navigation items.
         * @param {string} query - Search query
         */
        search: function (query) {
            query = (query || '').trim().toLowerCase();
            var items = this.sidebar.querySelectorAll('.sidebar__item');
            var sections = this.sidebar.querySelectorAll('.sidebar__section');
            var hasVisibleItems = false;

            // Reset all items first
            for (var i = 0; i < items.length; i++) {
                items[i].classList.remove('highlight-match');
                items[i].style.display = '';
            }

            // Show all sections
            for (var s = 0; s < sections.length; s++) {
                sections[s].style.display = '';
            }

            if (this.noResults) {
                this.noResults.classList.remove('visible');
            }

            if (query.length === 0) {
                return;
            }

            // Filter items, expand matching submenus
            for (var j = 0; j < items.length; j++) {
                var itemText = items[j].querySelector('.sidebar__item-text');
                if (!itemText) continue;

                var text = (itemText.textContent || '').trim().toLowerCase();
                var matches = text.indexOf(query) !== -1;

                if (matches) {
                    items[j].classList.add('highlight-match');
                    hasVisibleItems = true;

                    // Preserve submenu parent item
                    var parentMenu = items[j].closest('.sidebar__submenu');
                    if (parentMenu) {
                        parentMenu.classList.add(SUBMENU_OPEN_CLASS);
                        parentMenu.style.maxHeight = parentMenu.scrollHeight + 'px';
                        var parentItem = parentMenu.closest('.sidebar__item--has-children') || parentMenu.previousElementSibling;
                        if (parentItem && parentItem.classList.contains('sidebar__item--has-children')) {
                            parentItem.classList.add(EXPANDED_CLASS);
                            var parArrow = parentItem.querySelector('.sidebar__item-arrow');
                            if (parArrow) parArrow.style.transform = 'rotate(90deg)';
                        }
                    }

                    // Show the section containing this match
                    var section = items[j].closest('.sidebar__section');
                    if (section) {
                        var sectionTitle = section.querySelector('.sidebar__section-title');
                        if (sectionTitle) {
                            var sectionText = (sectionTitle.textContent || '').trim().toLowerCase();
                            if (sectionText.indexOf(query) === -1) {
                                // section title doesn't match but item does — keep section visible
                            }
                        }
                    }
                } else {
                    // Only hide if not a parent of visible submenu items
                    var isParentOfMatch = false;
                    var submenu = items[j].querySelector('.sidebar__submenu');
                    if (submenu) {
                        var subItems = submenu.querySelectorAll('.sidebar__item');
                        for (var k = 0; k < subItems.length; k++) {
                            var subText = subItems[k].querySelector('.sidebar__item-text');
                            if (subText) {
                                var st = (subText.textContent || '').trim().toLowerCase();
                                if (st.indexOf(query) !== -1) {
                                    isParentOfMatch = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (!isParentOfMatch) {
                        items[j].style.display = 'none';
                    }
                }
            }

            // Hide sections with no visible items
            for (var si = 0; si < sections.length; si++) {
                var visibleItems = sections[si].querySelectorAll('.sidebar__item:not([style*="display: none"])');
                if (visibleItems.length === 0) {
                    sections[si].style.display = 'none';
                }
            }

            // Show no-results message
            if (this.noResults) {
                if (!hasVisibleItems) {
                    this.noResults.classList.add('visible');
                } else {
                    this.noResults.classList.remove('visible');
                }
            }
        },

        /* ------------------------------------------------------------------
           PRIVATE — Binding
           ------------------------------------------------------------------ */

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

        _bindSubmenus: function () {
            var self = this;
            var parents = this.sidebar.querySelectorAll('.sidebar__item--has-children');

            for (var i = 0; i < parents.length; i++) {
                (function (parent) {
                    var link = parent.querySelector('.sidebar__item-link') || parent;
                    if (link) {
                        link.addEventListener('click', function (e) {
                            e.preventDefault();
                            e.stopPropagation();

                            if (self.isCollapsed() && !self._isMobile()) {
                                self.expand();
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

        _bindBackdrop: function () {
            var self = this;
            if (this.backdrop) {
                this.backdrop.addEventListener('click', function () {
                    self.closeMobile();
                });
            }
        },

        _bindKeyboard: function () {
            var self = this;

            document.addEventListener('keydown', function (e) {
                // Escape closes mobile sidebar
                if (e.key === 'Escape' && self.wrapper.classList.contains(OPEN_CLASS)) {
                    self.closeMobile();
                    return;
                }

                var tag = (e.target.tagName || '').toLowerCase();
                var isInput = (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable);

                // Ctrl+/ or Cmd+/ or just / to focus search
                if ((e.key === '/' && !isInput) || ((e.ctrlKey || e.metaKey) && e.key === '/' && !isInput)) {
                    e.preventDefault();
                    if (self.searchInput) {
                        self.searchInput.focus();
                        self.searchInput.select();
                    }
                    return;
                }

                // Escape to clear search and blur
                if (e.key === 'Escape' && self.searchInput && document.activeElement === self.searchInput) {
                    self._clearSearch();
                    self.searchInput.blur();
                    return;
                }

                // [ key toggles sidebar (only when not in input)
                if (e.key === '[' && !e.ctrlKey && !e.metaKey && !e.altKey && !isInput) {
                    e.preventDefault();
                    self.toggle();
                }
            });
        },

        _bindSearch: function () {
            var self = this;

            if (!this.searchInput) return;

            // Debounced search on input
            var debounceTimer;
            this.searchInput.addEventListener('input', function () {
                clearTimeout(debounceTimer);
                var val = this.value;
                debounceTimer = setTimeout(function () {
                    self.search(val);
                    // Show/hide clear button
                    if (self.searchClear) {
                        if (val.trim().length > 0) {
                            self.searchClear.classList.add('visible');
                        } else {
                            self.searchClear.classList.remove('visible');
                        }
                    }
                }, SEARCH_DEBOUNCE);
            });

            // Clear search on escape
            this.searchInput.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') {
                    self._clearSearch();
                    this.blur();
                }
            });

            // Clear button click
            if (this.searchClear) {
                this.searchClear.addEventListener('click', function () {
                    self._clearSearch();
                    if (self.searchInput) {
                        self.searchInput.focus();
                    }
                });
            }

            // Create no-results element if not present
            if (!this.noResults) {
                this.noResults = document.createElement('div');
                this.noResults.className = 'sidebar__search-no-results';
                this.noResults.textContent = 'No menu items found';
                var body = this.sidebar.querySelector('.sidebar__body');
                if (body) {
                    body.appendChild(this.noResults);
                }
            }
        },

        /* ------------------------------------------------------------------
           PRIVATE — State Management
           ------------------------------------------------------------------ */

        _restoreState: function () {
            if (this._isMobile()) {
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

        _watchResize: function () {
            var self = this;
            var debounceTimer;

            window.addEventListener('resize', function () {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(function () {
                    if (self._isMobile()) {
                        self.closeMobile();
                        self._clearSearch();
                    } else {
                        var submenus = self.sidebar.querySelectorAll('.sidebar__submenu');
                        for (var i = 0; i < submenus.length; i++) {
                            submenus[i].style.maxHeight = '';
                        }
                    }
                }, 150);
            });
        },

        _setActiveItem: function () {
            var currentPath = window.location.pathname.toLowerCase();
            var items = this.sidebar.querySelectorAll('.sidebar__item');

            // Remove active from section title parents
            var hasActive = false;

            for (var i = 0; i < items.length; i++) {
                var link = items[i].querySelector('a');
                if (!link) continue;

                var href = (link.getAttribute('href') || '').toLowerCase();

                items[i].classList.remove(ACTIVE_CLASS);

                // Match current path — most specific match wins
                if (href && href !== '#' && href !== '/' && currentPath.indexOf(href) !== -1) {
                    // Check if there's a more specific match coming
                    var hrefParts = href.split('/').filter(Boolean);
                    var currentParts = currentPath.split('/').filter(Boolean);

                    if (href !== '/') {
                        // Prefer exact match over partial
                        if (currentPath === href || currentPath.indexOf(href + '/') === 0 || currentPath.indexOf(href + '?') === 0 || currentPath === href + '/') {
                            items[i].classList.add(ACTIVE_CLASS);
                            hasActive = true;

                            var parentSubmenu = items[i].closest('.sidebar__submenu');
                            if (parentSubmenu) {
                                var parentItem = parentSubmenu.closest('.sidebar__item--has-children') || 
                                                  (parentSubmenu.previousElementSibling && parentSubmenu.previousElementSibling.classList.contains('sidebar__item--has-children') ? parentSubmenu.previousElementSibling : null);
                                if (parentItem && !parentItem.classList.contains(EXPANDED_CLASS)) {
                                    parentItem.classList.add(EXPANDED_CLASS);
                                    parentSubmenu.classList.add(SUBMENU_OPEN_CLASS);
                                    parentSubmenu.style.maxHeight = parentSubmenu.scrollHeight + 'px';
                                    var arrow = parentItem.querySelector('.sidebar__item-arrow');
                                    if (arrow) arrow.style.transform = 'rotate(90deg)';
                                }
                            }
                        }
                    }
                } else if (href === '/') {
                    // Root path
                    if (currentPath === '/' || currentPath === '') {
                        if (!hasActive) {
                            items[i].classList.add(ACTIVE_CLASS);
                            hasActive = true;
                        }
                    }
                }
            }
        },

        /* ------------------------------------------------------------------
           PRIVATE — Search Helpers
           ------------------------------------------------------------------ */

        _clearSearch: function () {
            if (this.searchInput) {
                this.searchInput.value = '';
            }
            this.search('');
            if (this.searchClear) {
                this.searchClear.classList.remove('visible');
            }
        },

        /* ------------------------------------------------------------------
           PRIVATE — Submenu Helpers
           ------------------------------------------------------------------ */

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

        _isMobile: function () {
            return window.innerWidth < MOBILE_BREAKPOINT;
        },

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

        _save: function (collapsed) {
            try {
                localStorage.setItem(STORAGE_KEY, String(collapsed));
            } catch (e) { /* ignore */ }
        },

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

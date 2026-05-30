/* ==========================================================================
   THEME TOGGLE — Dark/Light Mode with localStorage Persistence
   ==========================================================================
   Usage:
   1. Include this script at the bottom of your page (before </body>)
   2. Add a button with id="theme-toggle" or class="navbar-top__theme-toggle"
   3. The script auto-initializes on DOMContentLoaded
   
   API:
   - ThemeManager.toggle()        — Toggle between light/dark
   - ThemeManager.setTheme(name)  — Set specific theme ('light' or 'dark')
   - ThemeManager.getTheme()      — Get current theme string
   - ThemeManager.isSystemDark()  — Check system preference
   
   Events:
   - 'themechange' CustomEvent on document with detail: { theme, previous }
   ========================================================================== */

;(function (window, document) {
    'use strict';

    /* ----------------------------------------------------------------------
       CONFIGURATION
       ---------------------------------------------------------------------- */
    var STORAGE_KEY = 'app-theme';
    var DARK        = 'dark';
    var LIGHT       = 'light';
    var ATTR        = 'data-bs-theme';

    /* ----------------------------------------------------------------------
       THEME MANAGER
       ---------------------------------------------------------------------- */
    var ThemeManager = {

        /**
         * Initialize the theme system.
         * Priority: localStorage → system preference → light (default)
         */
        init: function () {
            var saved = this._getSaved();
            var theme;

            if (saved === DARK || saved === LIGHT) {
                theme = saved;
            } else if (this.isSystemDark()) {
                theme = DARK;
            } else {
                theme = LIGHT;
            }

            this._apply(theme, true);
            this._bindToggleButtons();
            this._watchSystemPreference();
        },

        /**
         * Toggle between light and dark mode.
         */
        toggle: function () {
            var current = this.getTheme();
            var next = current === DARK ? LIGHT : DARK;
            this.setTheme(next);
        },

        /**
         * Set a specific theme.
         * @param {string} theme - 'light' or 'dark'
         */
        setTheme: function (theme) {
            if (theme !== DARK && theme !== LIGHT) {
                console.warn('[ThemeManager] Invalid theme:', theme);
                return;
            }
            this._apply(theme, false);
        },

        /**
         * Get the current active theme.
         * @returns {string} 'light' or 'dark'
         */
        getTheme: function () {
            return document.documentElement.getAttribute(ATTR) || LIGHT;
        },

        /**
         * Check if the system prefers dark mode.
         * @returns {boolean}
         */
        isSystemDark: function () {
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        },

        /* ------------------------------------------------------------------
           PRIVATE METHODS
           ------------------------------------------------------------------ */

        /**
         * Apply the theme to the DOM and persist to localStorage.
         * @param {string} theme
         * @param {boolean} isInit - true if called during initialization
         */
        _apply: function (theme, isInit) {
            var previous = this.getTheme();
            
            // Set the data-bs-theme attribute on <html>
            document.documentElement.setAttribute(ATTR, theme);

            // Persist to localStorage
            this._save(theme);

            // Update all toggle button icons
            this._updateIcons(theme);

            // Update meta theme-color for mobile browsers
            this._updateMetaThemeColor(theme);

            // Dispatch custom event (skip on init to avoid double-firing)
            if (!isInit) {
                var event;
                try {
                    event = new CustomEvent('themechange', {
                        detail: { theme: theme, previous: previous },
                        bubbles: true
                    });
                } catch (e) {
                    // IE11 fallback
                    event = document.createEvent('CustomEvent');
                    event.initCustomEvent('themechange', true, false, {
                        theme: theme,
                        previous: previous
                    });
                }
                document.dispatchEvent(event);
            }
        },

        /**
         * Bind click handlers to all theme toggle buttons.
         */
        _bindToggleButtons: function () {
            var self = this;

            // Find all toggle buttons by ID and class
            var buttons = document.querySelectorAll(
                '#theme-toggle, .navbar-top__theme-toggle, [data-theme-toggle]'
            );

            for (var i = 0; i < buttons.length; i++) {
                buttons[i].addEventListener('click', function (e) {
                    e.preventDefault();
                    self.toggle();
                });
            }
        },

        /**
         * Update icon visibility on toggle buttons.
         * Convention:
         *   - .theme-icon-light  → shown in dark mode (clicking switches to light)
         *   - .theme-icon-dark   → shown in light mode (clicking switches to dark)
         *   OR use Font Awesome with .fa-sun / .fa-moon inside the button
         * @param {string} theme
         */
        _updateIcons: function (theme) {
            var isDark = theme === DARK;

            // Method 1: Toggle visibility classes
            var lightIcons = document.querySelectorAll('.theme-icon-light');
            var darkIcons  = document.querySelectorAll('.theme-icon-dark');

            for (var i = 0; i < lightIcons.length; i++) {
                lightIcons[i].style.display = isDark ? 'inline-block' : 'none';
            }
            for (var j = 0; j < darkIcons.length; j++) {
                darkIcons[j].style.display = isDark ? 'none' : 'inline-block';
            }

            // Method 2: Update Font Awesome icon class directly
            var faIcons = document.querySelectorAll('.theme-toggle-icon');
            for (var k = 0; k < faIcons.length; k++) {
                var icon = faIcons[k];
                if (isDark) {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                } else {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            }

            // Method 3: Update aria-label on toggle buttons
            var buttons = document.querySelectorAll(
                '#theme-toggle, .navbar-top__theme-toggle, [data-theme-toggle]'
            );
            var label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
            for (var l = 0; l < buttons.length; l++) {
                buttons[l].setAttribute('aria-label', label);
                buttons[l].setAttribute('title', label);
            }
        },

        /**
         * Update the <meta name="theme-color"> for mobile browser chrome.
         * @param {string} theme
         */
        _updateMetaThemeColor: function (theme) {
            var meta = document.querySelector('meta[name="theme-color"]');
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('name', 'theme-color');
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', theme === DARK ? '#161b22' : '#ffffff');
        },

        /**
         * Watch for system preference changes (e.g., OS switches to dark mode).
         * Only applies if no explicit user preference is saved.
         */
        _watchSystemPreference: function () {
            var self = this;
            if (!window.matchMedia) return;

            var mq = window.matchMedia('(prefers-color-scheme: dark)');

            var handler = function (e) {
                // Only auto-switch if user hasn't explicitly chosen
                var saved = self._getSaved();
                if (!saved) {
                    self._apply(e.matches ? DARK : LIGHT, false);
                }
            };

            // Modern browsers
            if (mq.addEventListener) {
                mq.addEventListener('change', handler);
            } else if (mq.addListener) {
                // Safari < 14
                mq.addListener(handler);
            }
        },

        /**
         * Save theme preference to localStorage.
         * @param {string} theme
         */
        _save: function (theme) {
            try {
                localStorage.setItem(STORAGE_KEY, theme);
            } catch (e) {
                // localStorage may be unavailable (private browsing, etc.)
            }
        },

        /**
         * Get saved theme preference from localStorage.
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
       EARLY INITIALIZATION (prevent flash of wrong theme)
       ---------------------------------------------------------------------- */
    // Apply theme immediately (before DOMContentLoaded) to prevent FOUC
    (function () {
        var saved;
        try {
            saved = localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            saved = null;
        }

        if (saved === DARK || saved === LIGHT) {
            document.documentElement.setAttribute(ATTR, saved);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute(ATTR, DARK);
        }
    })();

    /* ----------------------------------------------------------------------
       DOM READY — Full initialization
       ---------------------------------------------------------------------- */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            ThemeManager.init();
        });
    } else {
        // DOM already loaded
        ThemeManager.init();
    }

    /* ----------------------------------------------------------------------
       EXPORT — Make ThemeManager globally accessible
       ---------------------------------------------------------------------- */
    window.ThemeManager = ThemeManager;

})(window, document);

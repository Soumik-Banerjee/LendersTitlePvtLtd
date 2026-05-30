;(function ($) {
    'use strict';

    var SIDEBAR_SELECTOR   = '.sidebar';
    var BACKDROP_SELECTOR  = '.sidebar-backdrop';
    var TOGGLE_SELECTOR    = '.navbar-top__toggle';
    var COLLAPSE_BTN       = '.sidebar__collapse-btn';
    var HAS_CHILDREN       = '.sidebar__item--has-children';
    var SUBMENU            = '.sidebar__submenu';
    var STORAGE_KEY        = 'sidebar-collapsed';
    var LG_BREAKPOINT      = 992;

    var $sidebar = $(SIDEBAR_SELECTOR);
    var $backdrop = $(BACKDROP_SELECTOR);
    var $toggleBtn = $(TOGGLE_SELECTOR);
    var $collapseBtn = $(COLLAPSE_BTN);

    if (!$sidebar.length) return;

    /* ── Desktop collapse/expand ── */
    function getCollapsed() {
        try { return localStorage.getItem(STORAGE_KEY) === 'true'; } catch (e) { return false; }
    }

    function setCollapsed(state) {
        try { localStorage.setItem(STORAGE_KEY, state); } catch (e) {}
    }

    function applyCollapsed(collapsed) {
        $sidebar.toggleClass('collapsed', collapsed);
        if (collapsed) {
            $sidebar.find(SUBMENU).removeClass('open');
            $sidebar.find(HAS_CHILDREN).removeClass('open');
        }
    }

    /* ── Mobile open/close ── */
    function openMobile() {
        $sidebar.addClass('open');
        $backdrop.addClass('open');
        $('body').css('overflow', 'hidden');
    }

    function closeMobile() {
        $sidebar.removeClass('open');
        $backdrop.removeClass('open');
        $('body').css('overflow', '');
    }

    function isMobile() {
        return window.innerWidth < LG_BREAKPOINT;
    }

    /* ── Submenu toggle ── */
    function toggleSubmenu($trigger) {
        var $next = $trigger.next(SUBMENU);
        if (!$next.length) {
            if (!isMobile() && $sidebar.hasClass('collapsed')) {
                setCollapsed(false);
                applyCollapsed(false);
                $next = $trigger.next(SUBMENU);
                if ($next.length) {
                    $next.addClass('open');
                    $trigger.addClass('open');
                }
            }
            return;
        }
        var isOpen = $next.hasClass('open');
        $trigger.closest('.sidebar__section').find(SUBMENU).removeClass('open');
        $trigger.closest('.sidebar__section').find(HAS_CHILDREN).removeClass('open');
        if (!isOpen) {
            $next.addClass('open');
            $trigger.addClass('open');
        }
    }

    /* ── Init ── */
    function init() {
        // Restore collapsed state only on desktop
        if (!isMobile()) {
            applyCollapsed(getCollapsed());
        } else {
            applyCollapsed(false);
            closeMobile();
        }
    }

    /* ── Events ── */

    // Collapse button (desktop)
    $collapseBtn.on('click', function (e) {
        e.stopPropagation();
        if (isMobile()) {
            closeMobile();
            return;
        }
        var collapsed = !$sidebar.hasClass('collapsed');
        setCollapsed(collapsed);
        applyCollapsed(collapsed);
    });

    // Hamburger toggle (mobile)
    $toggleBtn.on('click', function () {
        if (isMobile()) {
            if ($sidebar.hasClass('open')) {
                closeMobile();
            } else {
                openMobile();
            }
        } else {
            // On desktop, toggle collapse
            var collapsed = !$sidebar.hasClass('collapsed');
            setCollapsed(collapsed);
            applyCollapsed(collapsed);
        }
    });

    // Backdrop click
    $backdrop.on('click', closeMobile);

    // Submenu toggle
    $sidebar.on('click', HAS_CHILDREN, function (e) {
        e.preventDefault();
        toggleSubmenu($(this));
    });

    // Window resize
    var resizeTimer;
    $(window).on('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            if (isMobile()) {
                applyCollapsed(false);
                if (!$sidebar.hasClass('open')) {
                    $('body').css('overflow', '');
                }
            } else {
                closeMobile();
                applyCollapsed(getCollapsed());
            }
        }, 150);
    });

    // Keyboard: Escape to close mobile sidebar
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape' && isMobile() && $sidebar.hasClass('open')) {
            closeMobile();
        }
    });

    init();

})(jQuery);

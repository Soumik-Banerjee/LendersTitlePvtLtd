;(function ($) {
    'use strict';

    var DESKTOP_SIDEBAR = '#sidebarDesktop';
    var OFFCANVAS_ID = '#sidebarOffcanvas';
    var TOGGLE_BTN = '#sidebarToggleDesktop';
    var HEADER_TOGGLE = '#sidebarToggle';
    var SEARCH_INPUT = '.sidebar__search-input';
    var NAV_ITEMS = '.sidebar__item';
    var NAV_LINKS = '.sidebar__link';
    var NAV_SECTIONS = '.sidebar__section';
    var STORAGE_KEY = 'sidebar-desktop-collapsed';
    var LG_BREAKPOINT = 992;
    var SEARCH_DEBOUNCE = 200;

    var $desktop = $(DESKTOP_SIDEBAR);
    var $offcanvasEl = $(OFFCANVAS_ID);
    var offcanvasInstance = null;

    if (!$desktop.length && !$offcanvasEl.length) return;

    /* ── Bootstrap Offcanvas instance ── */
    if ($offcanvasEl.length) {
        offcanvasInstance = new bootstrap.Offcanvas($offcanvasEl[0], {
            backdrop: true,
            scroll: false
        });
    }

    /* ── Desktop collapse state ── */

    function getCollapsed() {
        try { return localStorage.getItem(STORAGE_KEY) === 'true'; } catch (e) { return false; }
    }

    function setCollapsed(state) {
        try { localStorage.setItem(STORAGE_KEY, state); } catch (e) {}
    }

    function applyCollapsed(collapsed) {
        $desktop.toggleClass('sidebar--collapsed', collapsed);
        var $btn = $(HEADER_TOGGLE);
        $btn.find('i').attr('class', collapsed ? 'fa-solid fa-chevron-right' : 'fa-solid fa-chevron-left');
        if (collapsed) {
            $desktop.find('.collapse.show').each(function () {
                var inst = bootstrap.Collapse.getInstance(this);
                if (inst) inst.hide();
            });
        }
    }

    function isMobile() {
        return window.innerWidth < LG_BREAKPOINT;
    }

    /* ── Toggle desktop sidebar ── */

    function toggleDesktop() {
        if (isMobile()) return;
        var collapsed = !$desktop.hasClass('sidebar--collapsed');
        setCollapsed(collapsed);
        applyCollapsed(collapsed);
    }

    /* ── Submenu collapse events ── */

    function initSubmenuEvents() {
        $(document).off('show.bs.collapse.hide.bs.collapse', DESKTOP_SIDEBAR + ' .collapse,' + OFFCANVAS_ID + ' .collapse')
            .on('show.bs.collapse', DESKTOP_SIDEBAR + ' .collapse,' + OFFCANVAS_ID + ' .collapse', function () {
                var $parent = $(this).closest(NAV_ITEMS);
                $parent.addClass('expanded');
                var $section = $parent.closest('.sidebar__nav > li').length ? $parent.closest('.sidebar__nav > li').parent() : $parent.parent();
                $section.find('.collapse.show').not(this).each(function () {
                    var inst = bootstrap.Collapse.getInstance(this);
                    if (inst) inst.hide();
                });
            })
            .on('hide.bs.collapse', DESKTOP_SIDEBAR + ' .collapse,' + OFFCANVAS_ID + ' .collapse', function () {
                var $parent = $(this).closest(NAV_ITEMS);
                $parent.removeClass('expanded');
            });
    }

    /* ── Search filter ── */

    var searchTimer;
    $(document).on('input', SEARCH_INPUT, function () {
        clearTimeout(searchTimer);
        var $input = $(this);
        var $sidebar = $input.closest('.sidebar, .offcanvas');
        var $nav = $sidebar.find('.sidebar__nav');
        searchTimer = setTimeout(function () {
            var query = $input.val().toLowerCase().trim();
            $nav.find(NAV_ITEMS).each(function () {
                var $item = $(this);
                var text = $item.text().toLowerCase();
                $item.toggleClass('sidebar__item--hidden', query !== '' && !text.includes(query));
            });
            $nav.find(NAV_SECTIONS).each(function () {
                var $section = $(this);
                var hasVisible = $section.nextUntil(NAV_SECTIONS).filter(NAV_ITEMS).filter(function () {
                    return !$(this).hasClass('sidebar__item--hidden');
                }).length > 0;
                $section.toggleClass('sidebar__item--hidden', query !== '' && !hasVisible);
            });
        }, SEARCH_DEBOUNCE);
    });

    /* ── Active state fallback ── */

    function setActiveFromUrl() {
        var path = window.location.pathname.replace(/\/$/, '').toLowerCase();
        $desktop.find('.sidebar__link[href]').each(function () {
            var $link = $(this);
            var href = $link.attr('href').replace(/\/$/, '').toLowerCase();
            if (href && path.indexOf(href) === 0) {
                $desktop.find('.sidebar__link.active').removeClass('active').removeAttr('aria-current');
                $link.addClass('active').attr('aria-current', 'page');
                var $parentItem = $link.closest(NAV_ITEMS);
                if ($parentItem.hasClass('sidebar__item--has-sub')) {
                    $parentItem.addClass('expanded');
                    var $collapse = $parentItem.find('.collapse');
                    if ($collapse.length) {
                        var inst = bootstrap.Collapse.getInstance($collapse[0]);
                        if (inst) inst.show();
                    }
                }
                return false;
            }
        });
    }

    /* ── Logout handler ── */

    $(document).on('click', '.sidebar__logout', function () {
        var url = $(this).data('logout-url');
        if (!url) return;
        if (confirm('Are you sure you want to sign out?')) {
            window.location.href = url;
        }
    });

    /* ── Keyboard shortcut: Ctrl+B ── */

    $(document).on('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            if (isMobile()) {
                if (offcanvasInstance) offcanvasInstance.show();
            } else {
                toggleDesktop();
            }
        }
    });

    /* ── Click handlers ── */

    $(document).on('click', HEADER_TOGGLE, function () {
        if (isMobile()) return;
        toggleDesktop();
    });

    $(document).on('click', TOGGLE_BTN, function () {
        if (isMobile()) {
            if (offcanvasInstance) offcanvasInstance.show();
        } else {
            toggleDesktop();
        }
    });

    /* ── Window resize ── */

    var resizeTimer;
    $(window).on('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            if (!isMobile()) {
                if (offcanvasInstance) offcanvasInstance.hide();
                applyCollapsed(getCollapsed());
            } else {
                applyCollapsed(false);
            }
        }, 150);
    });

    /* ── Init ── */

    function init() {
        initSubmenuEvents();
        if (isMobile()) {
            applyCollapsed(false);
        } else {
            applyCollapsed(getCollapsed());
        }
        setActiveFromUrl();
    }

    init();

})(jQuery);

;(function ($) {
    'use strict';

    if (window.location.pathname.startsWith('/Login')) return;

    var lastActivity = Date.now();
    var isIdle = false;
    var hbTimer = null;
    var IDLE_MS = 120000;
    var HEARTBEAT_MS = 600000;

    $(document).on('mousemove keydown click scroll touchstart', function () {
        var wasIdle = isIdle;
        lastActivity = Date.now();
        isIdle = false;
        if (wasIdle) onReturnFromIdle();
    });

    setInterval(function () {
        if (!isIdle && Date.now() - lastActivity > IDLE_MS) {
            isIdle = true;
            stopHeartbeat();
        }
    }, 30000);

    function startHeartbeat() {
        if (hbTimer) return;
        hbTimer = setInterval(function () {
            $.get('/Auth/Ping');
        }, HEARTBEAT_MS);
    }

    function stopHeartbeat() {
        clearInterval(hbTimer);
        hbTimer = null;
    }
    startHeartbeat();

    function onReturnFromIdle() {
        $.get('/Auth/ValidateSession').done(function () {
            startHeartbeat();
        }).fail(function () {
            window.location.href = '/Login/Index';
        });
    }

    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible' && Date.now() - lastActivity > IDLE_MS) {
            onReturnFromIdle();
        }
    });

    $(document).ajaxError(function (e, xhr) {
        if (xhr.status === 401) {
            window.location.href = '/Login/Index';
        }
    });

})(jQuery);
